//JaysonBam
//Main AR logic with AFrame

import { getCampaign } from "./api/campaign";
import { createDropdownMessage } from "./components/DropdownMessage";
import { showErrorOnScreen } from "./components/ErrorBanner";
import type { AFrameEntity, AFrameComponent } from "./types";
import type { AFrameStatic, MaterialTextureLoadedDetail, TexImage } from "./types/aframe";
import { enforceHighQualityCamera, startCameraFallbackStream, stopCameraFallbackStream } from "./utils/camera";

declare const AFRAME: AFrameStatic;

const updateOrReplaceDropdown = (message: string, buttonUrl?: string) => {
  //only one message at a time
  const existing = document.getElementById("dropdown-message");
  if (existing) existing.remove();

  const newEl = createDropdownMessage(message, buttonUrl || "");

  document.body.appendChild(newEl);
  // Trigger reflow then show
  void newEl.offsetWidth;
  newEl.classList.add("visible");
  return newEl;
};

export const registerComponents = () => {
  // target-handler: listens for targetFound and then loads campaign data
  AFRAME.registerComponent("target-handler", {
    schema: {
      campaignId: { type: "number" },
    },

    init(this: AFrameComponent) {
      const element = this.el;
      const aImage = element.querySelector("a-image") as AFrameEntity | null;

      if (aImage) {
        aImage.addEventListener("materialtextureloaded", (evt: Event) => {
          const e = evt as CustomEvent<MaterialTextureLoadedDetail>;
          const texture = e?.detail?.texture;
          const img = texture?.image;
          if (!img) return;

          const typedImg = img as TexImage;
          const width = typedImg.naturalWidth ?? typedImg.width;
          const height = typedImg.naturalHeight ?? typedImg.height;

          if (width && height) {
            const ratio = height / width;
            aImage.setAttribute("height", String(ratio));
            aImage.setAttribute("width", "1");
          }
        });
      }

      element.addEventListener("targetFound", async () => {
        try {
          console.log("Target found");
          // Resolve campaign id: prefer explicit schema value, otherwise use global map
          let campaignId = this.data?.campaignId as number | undefined;
          if (!campaignId) {
            const attr = element.getAttribute("mindar-image-target");
            let idx: number | undefined;
            if (typeof attr === 'string') {
              const m = attr.match(/targetIndex:\s*(\d+)/);
              if (m) idx = Number(m[1]);
            } else if (attr && typeof attr === 'object') {
              // A-Frame may parse component data and return an object
              const parsed = attr as Record<string, unknown>;
              if (parsed.targetIndex !== undefined) idx = Number(parsed.targetIndex as number);
            }
            if (idx !== undefined) {
              campaignId = window.__TARGET_TO_CAMPAIGN?.[idx] as number | undefined;
            }
          }
          if (!campaignId) return;

          const campaign = await getCampaign(campaignId);
          if (!campaign) return;

          // Update overlay image: preload then apply to prevent white flash
          if (aImage) {
            try {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              try { (img as HTMLImageElement).referrerPolicy = 'no-referrer'; } catch {
                // ignore environments that disallow setting referrerPolicy
              }

              const onTexture = () => {
                aImage.setAttribute('visible', 'true');
                aImage.removeEventListener('materialtextureloaded', onTexture);
              };

              img.onload = () => {
                aImage.addEventListener('materialtextureloaded', onTexture);
                aImage.setAttribute('src', campaign.displayUrl);
              };

              const onImgError = function (this: GlobalEventHandlers, ev: Event | string) {
                console.error('Overlay preload failed for', campaign.displayUrl, ev);
                // fallback: still set src so A-Frame can handle error state
                aImage.setAttribute('src', campaign.displayUrl);
                aImage.setAttribute('visible', 'true');
              };
              img.onerror = onImgError;

              img.src = campaign.displayUrl;
            } catch (err) {
              console.error('Error preloading overlay', err);
              aImage.setAttribute('src', campaign.displayUrl);
              aImage.setAttribute('visible', 'true');
            }
          }

          // Wait 3s then show/update dropdown
          setTimeout(() => {
            updateOrReplaceDropdown(campaign.message, campaign.buttonUrl);
          }, 3000);
        } catch (err) {
          if (err instanceof Error && (err.message === "Server error, could not fetch data" || err.message === "User error to fetch data")) {
            showErrorOnScreen(err.message);
          }
          console.error("target-handler: error handling targetFound", err);
        }
      });
    },
  });
};

const createCamera = () => {
  const camera = document.createElement("a-camera");
  camera.setAttribute("position", "0 0 0");
  camera.setAttribute("look-controls", "enabled: false");
  return camera;
};

  const createTargetEntity = (index: number) => {
  const entity = document.createElement("a-entity");
  entity.setAttribute("mindar-image-target", `targetIndex: ${index}`);
    // attach handler component (map is used to resolve campaign id at runtime)
    entity.setAttribute("target-handler", "");

  const aImage = document.createElement("a-image");
  aImage.setAttribute("rotation", "0 0 0");
  aImage.setAttribute("position", "0 0 0");
  aImage.setAttribute("width", "1");
  aImage.setAttribute("height", "1");
  // start hidden to avoid showing an untextured white quad while the image loads
  aImage.setAttribute("visible", "false");

  entity.appendChild(aImage);
  return entity;
};


export const initAR = async (compiledMindUrl?: string | null, campaignIds: number[] = []) => {
  enforceHighQualityCamera();
  registerComponents();

  const body = document.body;

  // build the A-Frame scene in a minimal DOM-safe manner
  const sceneContainer = document.createElement("div");
  sceneContainer.className = "ar-scene-container";

  const scene = document.createElement("a-scene");
  // If we have a compiledMindUrl, enable MindAR image tracking. Otherwise fall back to camera-only view.
  if (compiledMindUrl && compiledMindUrl.trim() !== "") {
    scene.setAttribute(
      "mindar-image",
      `imageTargetSrc: ${compiledMindUrl}; autoStart: true; uiScanning: no;`,
    );
    // If a fallback camera was started earlier, stop it to avoid duplicate streams
    try { stopCameraFallbackStream(); } catch (err) { /* ignore */ }
  } else {
    // camera-only: do not attach mindar-image, keep a simple scene so the camera view is available
    scene.setAttribute("embedded", "true");
    (scene as HTMLElement).style.background = 'transparent';
  }
  scene.setAttribute("color-space", "sRGB");
  scene.setAttribute(
    "renderer",
    "colorManagement: true, physicallyCorrectLights",
  );
  scene.setAttribute("vr-mode-ui", "enabled: false");
  scene.setAttribute("device-orientation-permission-ui", "enabled: false");

  // camera
  scene.appendChild(createCamera());

  if (campaignIds && campaignIds.length > 0) {
    campaignIds.forEach((_, index) => {
      scene.appendChild(createTargetEntity(index));
    });
  }

  sceneContainer.appendChild(scene);
  // If no compiled targets, start a plain camera stream behind the scene so user sees camera view
  if (!compiledMindUrl || compiledMindUrl.trim() === "") {
    startCameraFallbackStream().catch(() => { /* already logged */ });
  }

  body.appendChild(sceneContainer);
};
