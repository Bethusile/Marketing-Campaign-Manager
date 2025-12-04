//JaysonBam
//Main AR logic with AFrame

import { getCampaign } from "./services/api";
import { createDropdownMessage } from "./components/DropdownMessage";
import type { AFrameEntity, AFrameComponent } from "./types";
import { enforceHighQualityCamera } from "./utils/camera";

declare const AFRAME: {
  registerComponent: (name: string, def: object) => void;
};

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
        aImage.addEventListener("materialtextureloaded", (e: any) => {
          const texture = e.detail.texture;
          if (!texture || !texture.image) return;

          const width = texture.image.naturalWidth || texture.image.width;
          const height = texture.image.naturalHeight || texture.image.height;

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
          const campaignId = this.data?.campaignId as number | undefined;
          if (!campaignId) return;

          const campaign = await getCampaign(campaignId);
          if (!campaign) return;

          // Update overlay image
          if (aImage) {
            aImage.setAttribute("src", campaign.displayUrl);
          }

          // Wait 3s then show/update dropdown
          setTimeout(() => {
            updateOrReplaceDropdown(campaign.message, campaign.buttonUrl);
          }, 3000);
        } catch (err) {
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

const createTargetEntity = (index: number, campaignId: number) => {
  const entity = document.createElement("a-entity");
  entity.setAttribute("mindar-image-target", `targetIndex: ${index}`);
  entity.setAttribute("target-handler", `campaignId: ${campaignId}`);

  const aImage = document.createElement("a-image");
  aImage.setAttribute("rotation", "0 0 0");
  aImage.setAttribute("position", "0 0 0");
  aImage.setAttribute("width", "1");
  aImage.setAttribute("height", "1");

  entity.appendChild(aImage);
  return entity;
};


export const initAR = async (compiledMindUrl: string, campaignIds: number[]) => {
  enforceHighQualityCamera();
  registerComponents();

  const body = document.body;

  // build the A-Frame scene in a minimal DOM-safe manner
  const sceneContainer = document.createElement("div");
  sceneContainer.className = "ar-scene-container";

  const scene = document.createElement("a-scene");
  scene.setAttribute(
    "mindar-image",
    `imageTargetSrc: ${compiledMindUrl}; autoStart: true; uiScanning: no;`,
  );
  scene.setAttribute("color-space", "sRGB");
  scene.setAttribute(
    "renderer",
    "colorManagement: true, physicallyCorrectLights",
  );
  scene.setAttribute("vr-mode-ui", "enabled: false");
  scene.setAttribute("device-orientation-permission-ui", "enabled: false");

  // camera
  scene.appendChild(createCamera());

  campaignIds.forEach((id, index) => {
    scene.appendChild(createTargetEntity(index, id));
  });

  sceneContainer.appendChild(scene);
  body.appendChild(sceneContainer);
};