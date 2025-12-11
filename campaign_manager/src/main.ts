import './style.css';
import { updateCampaignStatus } from './helpers/campaignStatusHelper';
import { uploadImagesHelper } from './helpers/uploadImagesHelper';
import { addTargetHelper } from './helpers/addTarget';
import './vendor/aframe.min.js'
import './vendor/mindar-image-aframe.prod.js'


type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

const app: HTMLElement = document.createElement('section');
app.id = 'app';
const title:HTMLElement = document.createElement('h1');
title.innerText = 'Campaign Manager';
app.appendChild(title);
document.body.appendChild(app);

// Toggle Campaign Active section
// you use the campaign ID to toggle its active status
const toggleSection: HTMLElement = document.createElement('section');
toggleSection.id = 'toggleCampaignSection';
const toggleHeading: HTMLElement = document.createElement('h2');
toggleHeading.innerText = 'Toggle Campaign Active';
toggleSection.appendChild(toggleHeading);
const toggleLabel: HTMLLabelElement = document.createElement('label');
toggleLabel.innerText = 'Campaign ID: ';
const toggleInput: HTMLInputElement = document.createElement('input');
toggleInput.type = 'text';
toggleInput.id = 'toggleCampaignId';
toggleLabel.appendChild(toggleInput);
toggleSection.appendChild(toggleLabel);
const toggleActive: HTMLElement = document.createElement('label');
toggleActive.innerText = ' Active: ';
const toggleCheckbox: HTMLInputElement = document.createElement('input');
toggleCheckbox.type = 'checkbox';
toggleCheckbox.id = 'toggleIsActive';
toggleActive.appendChild(toggleCheckbox);
toggleSection.appendChild(toggleActive);
const toggleButton: HTMLButtonElement = document.createElement('button');
toggleButton.innerText = 'Toggle';
toggleButton.id = 'toggleCampaignButton';
toggleSection.appendChild(toggleButton);
app.appendChild(toggleSection);
// Toggle button event listener
toggleButton.addEventListener('click', async () => {
  const campaignId: string = (document.getElementById('toggleCampaignId') as HTMLInputElement).value;
  const isActive: boolean = (document.getElementById('toggleIsActive') as HTMLInputElement).checked;
  const result = await updateCampaignStatus(campaignId, isActive); // Call the helper function to update status
  window.setResp?.(result); // Update the response display
});

// Response section
const respPre: HTMLPreElement = document.createElement('pre');
respPre.className = 'resp';
respPre.textContent = 'No response yet';

const respSection: HTMLElement = document.createElement('section');
const respHeading: HTMLElement = document.createElement('h2');
respHeading.innerText = 'Response';
respSection.appendChild(respHeading);
respSection.appendChild(respPre);

// Response handler
let resp: JSONValue | null = null;

function setResp(value: JSONValue | null): void {
  resp = value;

  if (resp !== null) {
    try {
      // Display server response JSON nicely
      respPre.textContent = JSON.stringify(resp, null, 2);
    } catch (_) {
      respPre.textContent = String(resp);
    }
  } else {
    respPre.textContent = 'No response yet';
  }
}

// Make it globally accessible
declare global {
  interface Window {
    setResp?: (value: JSONValue | null) => void;
  }
}

window.setResp = setResp;


//upload images section
const uploadForm = uploadImagesHelper(window.setResp!);
app.appendChild(uploadForm);

// add target (compile & upload) form
const addTargetForm = addTargetHelper(window.setResp!);
app.appendChild(addTargetForm);

app.appendChild(respSection);


