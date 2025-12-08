//JaysonBam
//Main AR logic with AFrame

import { getCampaign } from "./api/campaign";
import { createDropdownMessage } from "./components/DropdownMessage";
import { showErrorOnScreen } from "./components/ErrorBanner";
import type { AFrameComponent, AFrameStatic } from "./types/aframe";
import { enforceHighQualityCamera, startCameraFallbackStream, stopCameraFallbackStream } from "./utils/camera";

declare const AFRAME: AFrameStatic;

// Runtime type-guard for texture image objects to safely access width/height props
function isTextureImageLike(obj: object | null): obj is { naturalWidth?: number; width?: number; naturalHeight?: number; height?: number } {
  if (!obj || typeof obj !== 'object') return false;
  return Object.prototype.hasOwnProperty.call(obj, 'naturalWidth') ||
    Object.prototype.hasOwnProperty.call(obj, 'width') ||
    Object.prototype.hasOwnProperty.call(obj, 'naturalHeight') ||
    Object.prototype.hasOwnProperty.call(obj, 'height');
}

const updateOrReplaceDropdown = (message: string, buttonUrl?: string) => {
  //only one message at a time
  const existingDropdownEl = document.getElementById("dropdown-message");
  if (existingDropdownEl) existingDropdownEl.remove();

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
      const aImageEl = element.querySelector("a-image");

          if (aImageEl) {
          aImageEl.addEventListener("materialtextureloaded", (evt: Event) => {
          if (!(evt instanceof CustomEvent)) return;
          const texture = evt.detail?.texture;
          const textureImage = texture?.image ?? null;
          if (!textureImage) return;

          // runtime-safe access: prefer naturalWidth/height, fallback to width/height
          let width: number | undefined;
          let height: number | undefined;
          try {
            // runtime-safe access: prefer naturalWidth/height, fallback to width/height
            if (isTextureImageLike(textureImage)) {
              if (typeof textureImage.naturalWidth === 'number') width = textureImage.naturalWidth;
              else if (typeof textureImage.width === 'number') width = textureImage.width;
              if (typeof textureImage.naturalHeight === 'number') height = textureImage.naturalHeight;
              else if (typeof textureImage.height === 'number') height = textureImage.height;
            }
          } catch (_e) {
            // ignore
          }

          if (width && height) {
            const ratio = height / width;
            aImageEl.setAttribute("height", String(ratio));
            aImageEl.setAttribute("width", "1");
          }
        });
      }

      element.addEventListener("targetFound", async () => {
        try {
          console.log("Target found");
          // Resolve campaign id: prefer explicit schema value, otherwise use global map
          let campaignId: number | undefined = undefined;
          if (typeof this.data?.campaignId === 'number') campaignId = this.data.campaignId;
          if (!campaignId) {
            const attr = element.getAttribute("mindar-image-target");
            let targetIndex: number | undefined;
              if (typeof attr === 'string') {
              const matchResult = attr.match(/targetIndex:\s*(\d+)/);
              if (matchResult) targetIndex = Number(matchResult[1]);
            } else if (attr && typeof attr === 'object') {
              // A-Frame may parse component data and return an object; do a safe extraction
              try {
                const parsedObj = JSON.parse(JSON.stringify(attr));
                if (parsedObj && parsedObj.targetIndex !== undefined) targetIndex = Number(parsedObj.targetIndex);
              } catch (_e) {
                // ignore malformed object
              }
            }
            if (targetIndex !== undefined) {
              const mapped = window.__TARGET_TO_CAMPAIGN ? window.__TARGET_TO_CAMPAIGN[targetIndex] : undefined;
              if (typeof mapped === 'number') campaignId = mapped;
            }
          }
          if (!campaignId) return;

          const campaign = await getCampaign(campaignId);
          if (!campaign) return;

          // Update overlay image: preload then apply to prevent white flash
          if (aImageEl) {
            try {
              const overlayImage = new Image();
              overlayImage.crossOrigin = 'anonymous';
              try { overlayImage.referrerPolicy = 'no-referrer'; } catch (_err) {
                // ignore environments that disallow setting referrerPolicy
              }

              const onTexture = () => {
                aImageEl.setAttribute('visible', 'true');
                aImageEl.removeEventListener('materialtextureloaded', onTexture);
              };

              overlayImage.onload = () => {
                aImageEl.addEventListener('materialtextureloaded', onTexture);
                aImageEl.setAttribute('src', campaign.displayUrl);
              };

              const onOverlayPreloadError = function (this: GlobalEventHandlers, ev: Event | string) {
                console.error('Overlay preload failed for', campaign.displayUrl, ev);
                // fallback: still set src so A-Frame can handle error state
                aImageEl.setAttribute('src', campaign.displayUrl);
                aImageEl.setAttribute('visible', 'true');
              };
              overlayImage.onerror = onOverlayPreloadError;

              overlayImage.src = campaign.displayUrl;
            } catch (err) {
              console.error('Error preloading overlay', err);
              aImageEl.setAttribute('src', campaign.displayUrl);
              aImageEl.setAttribute('visible', 'true');
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

  const aImageEl = document.createElement("a-image");
  aImageEl.setAttribute("rotation", "0 0 0");
  aImageEl.setAttribute("position", "0 0 0");
  aImageEl.setAttribute("width", "1");
  aImageEl.setAttribute("height", "1");
  // start hidden to avoid showing an untextured white quad while the image loads
  aImageEl.setAttribute("visible", "false");

  entity.appendChild(aImageEl);
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
    if (scene instanceof HTMLElement) scene.style.background = 'transparent';
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
