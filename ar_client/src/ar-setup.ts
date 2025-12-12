// Main AR logic with A-Frame

import { getARStartup, getUnredactedImageById } from "./api/campaign";
import { createDropdownMessage } from "./components/DropdownMessage";
import type { AFrameComponent, AFrameStatic, MaterialTextureLoadedDetail, AFrameEntity, TexImage } from "./types/aframe";
import { enforceHighQualityCamera, startCameraFallbackStream, stopCameraFallbackStream } from "./utils/camera";

declare const AFRAME: AFrameStatic;

const updateOrReplaceDropdown = (message: string, buttonUrl?: string) => {
  const existingDropdownEl = document.getElementById("dropdown-message");
  // If a dropdown already exists, keep it and ignore new requests
  if (existingDropdownEl) {
    existingDropdownEl.classList.add("visible");
    return existingDropdownEl;
  }

  const newEl = createDropdownMessage(message, buttonUrl || "");
  document.body.appendChild(newEl);
  void newEl.offsetWidth;
  newEl.classList.add("visible");
  return newEl;
};

// AR point overlay helpers
const createARPointMessage = () => {
  try {
    if (!document.getElementById('ar-point-message')) {
      const el = document.createElement('div');
      el.id = 'ar-point-message';
      el.textContent = 'Point camera to the campaign';
      document.body.appendChild(el);
    }
  } catch (err) {
    // ignore overlay creation errors
    // eslint-disable-next-line no-console
    // console.warn('createARPointMessage failed', err);
  }
};

const removeARPointMessage = () => {
  try {
    const el = document.getElementById('ar-point-message');
    if (el) el.remove();
  } catch (err) {
    // ignore
  }
};

const registerComponents = () => {
  AFRAME.registerComponent("target-handler", {
    schema: { campaignId: { type: "number" } },
    init(this: AFrameComponent) {
      const element = this.el;
      const aImageEl = element.querySelector("a-image");

      if (aImageEl) {
        aImageEl.addEventListener("materialtextureloaded", (evt: Event) => {
          if (!(evt instanceof CustomEvent)) return;
          const customEvt = evt as CustomEvent<MaterialTextureLoadedDetail>;
          const texture = customEvt.detail?.texture;
          const textureImage = texture?.image ?? null;
          if (!textureImage) return;
          const width = (textureImage as HTMLImageElement).naturalWidth;
          const height = (textureImage as HTMLImageElement).naturalHeight;
          if (width && height) {
            const targetWidth = Number(element.getAttribute("width")) || 1;
            aImageEl.setAttribute("width", String(targetWidth));
            aImageEl.setAttribute("height", String(targetWidth * (height / width)));
          }
        });
      }

      element.addEventListener("targetFound", async () => {
        // Remove the AR-point prompt as soon as a target is detected
        try { removeARPointMessage(); } catch {}
        try {
          // parse targetIndex (supports both attribute shapes)
          const attrAll = element.getAttribute("mindar-image-target");
          let targetIndex: number | undefined;
          if (typeof attrAll === "string") {
            const matchResult = attrAll.match(/targetIndex:\s*(\d+)/);
            if (matchResult) targetIndex = Number(matchResult[1]);
          } else if (attrAll && typeof attrAll === "object") {
            try {
              const parsedObj = JSON.parse(JSON.stringify(attrAll));
              if (parsedObj && parsedObj.targetIndex !== undefined) targetIndex = Number(parsedObj.targetIndex);
            } catch (_e) {
              // ignore
            }
          }
          if (targetIndex === undefined) return;

          const idParam = new URLSearchParams(window.location.search).get('id');
          if (!idParam || idParam.trim() === '') return;
          const campaignPayload = await getARStartup(idParam.trim());
          if (!campaignPayload) return;

          const raw = campaignPayload.targetIdMap ? (campaignPayload.targetIdMap[targetIndex] ?? campaignPayload.targetIdMap[targetIndex]) : undefined;
          const imageId = raw !== undefined ? (typeof raw === "number" ? raw : Number(raw)) : undefined;

          let overlayUrl: string | undefined;
          if (typeof imageId === "number" && !Number.isNaN(imageId)) {
            try {
              overlayUrl = await getUnredactedImageById(imageId);
            } catch (_e) {
              // ignore
            }
          }
          if (!overlayUrl && campaignPayload.targetMindUrl) overlayUrl = campaignPayload.targetMindUrl;

          if (!aImageEl || !overlayUrl) return;

          // Wait for the A-Frame material texture to be loaded before making the image visible
          let textureFallbackTimer: number | undefined;
          const onTexture = () => {
            try {
              const elWithComponents = aImageEl as unknown as AFrameEntity & { components?: { material?: { material?: { map?: { image?: TexImage | null } } } } };
              const texture = elWithComponents.components?.material?.material?.map;
              const textureImage = texture?.image ?? null;
              if (textureImage) {
                const w = (textureImage as HTMLImageElement).naturalWidth;
                const h = (textureImage as HTMLImageElement).naturalHeight;
                if (w && h) {
                  const targetWidth = Number(element.getAttribute("width")) || 1;
                  aImageEl.setAttribute("width", String(targetWidth));
                  aImageEl.setAttribute("height", String(targetWidth * (h / w)));
                }
              }
            } catch (_e) {
              // ignore sizing errors
            }
            try { aImageEl.setAttribute("visible", "true"); } catch (_e) {}
            if (textureFallbackTimer !== undefined) clearTimeout(textureFallbackTimer);
            aImageEl.removeEventListener("materialtextureloaded", onTexture);
          };
          aImageEl.addEventListener("materialtextureloaded", onTexture);

          // Small fallback: if the event doesn't fire, show the image after 2s to avoid permanent invisibility
          textureFallbackTimer = window.setTimeout(() => {
            try { aImageEl.setAttribute("visible", "true"); } catch (_e) {}
          }, 2000);

          // Set the source after attaching listener so we don't miss the event
          aImageEl.setAttribute("src", overlayUrl);

          setTimeout(() => updateOrReplaceDropdown(campaignPayload.message || "", campaignPayload.buttonUrl || ""), 3000);
        } catch (err) {
          // console.error("target-handler error", err);
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
  const ent = document.createElement("a-entity");
  ent.setAttribute("mindar-image-target", `targetIndex: ${index}`);
  ent.setAttribute("target-handler", "");
  const img = document.createElement("a-image");
  img.setAttribute("rotation", "0 0 0");
  img.setAttribute("position", "0 0 0");
  img.setAttribute("width", "1");
  img.setAttribute("height", "1");
  img.setAttribute("visible", "false");
  ent.appendChild(img);
  return ent;
};

export const initAR = async (imageTargetSrc?: string, campaignIds: number[] = []) => {
  try {
    enforceHighQualityCamera();
  } catch (e) {
    // non-fatal
  }

  registerComponents();

  const container = document.createElement("div");
  container.className = "ar-scene-container";

  const scene = document.createElement("a-scene");
  if (imageTargetSrc && imageTargetSrc.trim() !== "") {
    scene.setAttribute("mindar-image", `imageTargetSrc: ${imageTargetSrc}; autoStart: true; uiScanning: no;`);
    try {
      stopCameraFallbackStream();
    } catch {}
  } else {
    scene.setAttribute("embedded", "true");
    (scene as HTMLElement).style.background = "transparent";
  }

  scene.setAttribute("color-space", "sRGB");
  scene.setAttribute("renderer", "colorManagement: true, physicallyCorrectLights");
  scene.setAttribute("vr-mode-ui", "enabled: false");
  scene.setAttribute("device-orientation-permission-ui", "enabled: false");

  scene.appendChild(createCamera());
  if (campaignIds && campaignIds.length > 0) {
    campaignIds.forEach((_, idx) => {
      scene.appendChild(createTargetEntity(idx));
    });
  }

  container.appendChild(scene);
  document.body.appendChild(container);

  // If we're starting AR (have a compiled mind file and targets), show a prompt
  try {
    if (imageTargetSrc && imageTargetSrc.trim() !== '' && campaignIds && campaignIds.length > 0) {
      createARPointMessage();
    }
  } catch (err) {
    // ignore overlay creation errors
  }

  if (!imageTargetSrc || imageTargetSrc.trim() === "") {
    // start fallback camera stream so user sees video when no AR targets
    startCameraFallbackStream().catch(() => {});
  }
};

export default initAR;
