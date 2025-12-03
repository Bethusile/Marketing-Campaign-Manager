import { getCampaign } from './services/api';
import { DropdownMessage } from './components/DropdownMessage';

declare const AFRAME: any;
declare const MINDAR: any;

// Store the mapping of target index to campaign ID
let targetCampaignMap: Record<number, number> = {};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const compileTargets = async (imageUrls: string[]): Promise<string> => {
  const images = await Promise.all(imageUrls.map(loadImage));
  const compiler = new MINDAR.IMAGE.Compiler();
  
  console.log('Compiling targets...');
  await compiler.compileImageTargets(images, (progress: number) => {
    console.log('Compilation progress:', progress);
  });
  
  const exportedBuffer = await compiler.exportData();
  const blob = new Blob([exportedBuffer]);
  return URL.createObjectURL(blob);
};

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
          this.updateRatio();
      },
      updateRatio: function() {
          const el = this.el;
          const src = el.getAttribute('src');
          if (!src) return;

          if (src.startsWith('#')) {
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
          } else {
              // Direct URL
              const img = new Image();
              img.onload = () => this.setRatio(img);
              img.src = src;
          }
      },
      setRatio: function (img: any) {
          if (img.naturalWidth === 0) return;
          const ratio = img.naturalHeight / img.naturalWidth;
          this.el.setAttribute('height', ratio);
          this.el.setAttribute('width', '1');
      }
  });

  AFRAME.registerComponent('target-handler', {
    schema: {
      targetIndex: { type: 'number' }
    },
    init: function () {
      this.el.addEventListener('targetFound', async () => {
        console.log('Target found');
        
        // Get the campaign ID associated with this target index
        const campaignId = targetCampaignMap[this.data.targetIndex];
        if (!campaignId) return;

        const campaign = await getCampaign(campaignId);
        if (!campaign) return;

        // Update the overlay image specific to this entity
        const aImage = this.el.querySelector('a-image');
        if (aImage) {
            aImage.setAttribute('src', campaign.display_url);
            // Manually trigger aspect ratio update since we changed the src
            if (aImage.components['fix-aspect-ratio']) {
                aImage.components['fix-aspect-ratio'].updateRatio();
            }
        }

        setTimeout(() => {
          // Check if it already exists
          let dropdown = document.getElementById('dropdown-message');
          
          if (!dropdown) {
            const dropdownContainer = document.createElement('div');
            dropdownContainer.innerHTML = DropdownMessage(campaign.message, campaign.button_url);
            document.body.appendChild(dropdownContainer);
            
            // Re-query to get the actual element with the ID
            dropdown = document.getElementById('dropdown-message');
          } else {
             // Update existing dropdown content if it exists (e.g. if switching targets)
             dropdown.innerHTML = DropdownMessage(campaign.message, campaign.button_url);
             // Note: DropdownMessage returns the outer div string, so we might need to be careful here.
             // Actually, DropdownMessage returns the full HTML string including the id="dropdown-message" div.
             // So if we want to update, we should probably replace the element or update its children.
             // For simplicity, let's remove and re-add or just update the inner parts.
             // But since the structure is simple, let's just replace the outerHTML or innerHTML of the parent?
             // Let's just remove the old one and add new one to be safe.
             dropdown.remove();
             const dropdownContainer = document.createElement('div');
             dropdownContainer.innerHTML = DropdownMessage(campaign.message, campaign.button_url);
             document.body.appendChild(dropdownContainer);
             dropdown = document.getElementById('dropdown-message');
          }

          if (dropdown) {
            // Force reflow to ensure transition happens
            void dropdown.offsetWidth;
            dropdown.classList.add('visible');
          }
        }, 3000);
      });
    }
  });
};

export const initAR = async (targets: Record<number, string>) => {
  setupCameraHack();
  registerComponents();

  const body = document.body;
  
  const campaignIds = Object.keys(targets).map(Number);
  if (campaignIds.length === 0) {
      console.error("No active campaigns found");
      return;
  }

  // Collect all target image URLs
  const targetImageUrls = campaignIds.map(id => targets[id]);

  // Compile them into a single .mind file
  let compiledMindUrl: string;
  try {
    // Show loading state
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'ar-loading';
    loadingDiv.style.position = 'fixed';
    loadingDiv.style.top = '50%';
    loadingDiv.style.left = '50%';
    loadingDiv.style.transform = 'translate(-50%, -50%)';
    loadingDiv.style.background = 'rgba(0,0,0,0.7)';
    loadingDiv.style.color = 'white';
    loadingDiv.style.padding = '20px';
    loadingDiv.style.borderRadius = '10px';
    loadingDiv.innerText = 'Compiling AR Targets...';
    body.appendChild(loadingDiv);

    compiledMindUrl = await compileTargets(targetImageUrls);
    
    body.removeChild(loadingDiv);
  } catch (error) {
    console.error('Failed to compile targets:', error);
    alert('Failed to initialize AR targets.');
    return;
  }

  // Generate an entity for each campaign, mapping the index to the campaign ID
  const entities = campaignIds.map((id, index) => {
    targetCampaignMap[index] = id;
    return `
      <a-entity mindar-image-target="targetIndex: ${index}" target-handler="targetIndex: ${index}">
        <a-image src="#overlayImage" rotation="0 0 0" position="0 0 0" width="1" height="1" fix-aspect-ratio></a-image>
      </a-entity>
    `;
  }).join('\n');

  // Initial overlay image can be empty or a placeholder until detection
  const initialImageUrl = ""; 

  const sceneHTML = `
    <a-scene mindar-image="imageTargetSrc: ${compiledMindUrl}; autoStart: true; uiScanning: no;"
             color-space="sRGB"
             renderer="colorManagement: true, physicallyCorrectLights"
             vr-mode-ui="enabled: false"
             device-orientation-permission-ui="enabled: false">

        <a-assets>
            <img id="overlayImage" src="${initialImageUrl}" crossorigin="anonymous" />
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        ${entities}
    </a-scene>
  `;

  const sceneContainer = document.createElement('div');
  sceneContainer.style.position = 'fixed';
  sceneContainer.style.top = '0';
  sceneContainer.style.left = '0';
  sceneContainer.style.width = '100%';
  sceneContainer.style.height = '100%';
  sceneContainer.style.zIndex = '0';
  sceneContainer.style.overflow = 'hidden';
  sceneContainer.innerHTML = sceneHTML;
  body.appendChild(sceneContainer);
};
