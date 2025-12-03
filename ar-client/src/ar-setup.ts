import type { Campaign } from './services/api';

declare const AFRAME: any;

export const setupCameraHack = () => {
  // Hack to force high resolution to try to pick the main camera on mobile
  // instead of the wide-angle camera which is often default for "environment"
  const origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = function(constraints: any) {
      if (constraints.video && constraints.video.facingMode === 'environment') {
          // Adding width/height constraints often forces the main camera
          constraints.video.width = { min: 1280, ideal: 1920, max: 2560 };
          constraints.video.height = { min: 720, ideal: 1080, max: 1440 };
          constraints.video.frameRate = { ideal: 60 };
      }
      return origGetUserMedia(constraints);
  };
};

export const registerComponents = () => {
  if (typeof AFRAME === 'undefined') return;

  // Component to set the aspect ratio of the image to match its natural dimensions
  AFRAME.registerComponent('fix-aspect-ratio', {
      init: function () {
          const el = this.el;
          const src = el.getAttribute('src');
          // Handle both selector and direct url
          const img = document.querySelector(src);
          
          if (img) {
              if (img.complete) {
                  this.setRatio(img);
              } else {
                  img.onload = () => {
                      this.setRatio(img);
                  };
              }
          }
      },
      setRatio: function (img: any) {
          if (img.naturalWidth === 0) return;
          const ratio = img.naturalHeight / img.naturalWidth;
          this.el.setAttribute('height', ratio);
          this.el.setAttribute('width', '1');
      }
  });
};

export const initAR = (campaign: Campaign) => {
  setupCameraHack();
  registerComponents();

  const body = document.body;
  // Use the URL directly if it starts with http or /, otherwise prepend the uploads path
  const imageUrl = campaign.unredacted_image_url.startsWith('http') || campaign.unredacted_image_url.startsWith('/')
    ? campaign.unredacted_image_url
    : `http://localhost:3000/uploads/${campaign.unredacted_image_url}`;

  const sceneHTML = `
    <a-scene mindar-image="imageTargetSrc: ./targets.mind; autoStart: true; uiScanning: no;"
             color-space="sRGB"
             renderer="colorManagement: true, physicallyCorrectLights"
             vr-mode-ui="enabled: false"
             device-orientation-permission-ui="enabled: false">

        <a-assets>
            <img id="overlayImage" src="${imageUrl}" crossorigin="anonymous" />
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        <a-entity mindar-image-target="targetIndex: 0">
            <a-image src="#overlayImage" 
                     rotation="0 0 0" 
                     position="0 0 0" 
                     width="1" 
                     height="1"
                     fix-aspect-ratio>
            </a-image>
        </a-entity>
    </a-scene>
  `;

  const sceneContainer = document.createElement('div');
  sceneContainer.style.position = 'fixed';
  sceneContainer.style.top = '0';
  sceneContainer.style.left = '0';
  sceneContainer.style.width = '100%';
  sceneContainer.style.height = '100%';
  sceneContainer.style.zIndex = '0';
  sceneContainer.innerHTML = sceneHTML;
  body.appendChild(sceneContainer);
};
