import './style.css'
// Import the getImages function
import { getImages } from './helpers/getImages';

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

const app: HTMLElement = document.createElement('section');
app.id = 'app';
const title:HTMLElement = document.createElement('h1');
title.innerText = 'Campaign Manager';
app.appendChild(title);
document.body.appendChild(app);

// Response section 
const respPre: HTMLPreElement = document.createElement('pre');
respPre.className = 'resp';
respPre.textContent = 'No response yet';

const respSection: HTMLElement = document.createElement('section');
const respHeading: HTMLElement = document.createElement('h2');
respHeading.innerText = 'Response';
respSection.appendChild(respHeading);
respSection.appendChild(respPre);
app.appendChild(respSection);


const getImagesSection: HTMLElement = document.createElement('section');
const getImagesHeading: HTMLElement = document.createElement('h2');
getImagesHeading.innerText = 'Get Campaign Images';
getImagesSection.appendChild(getImagesHeading);

const getImagesButton: HTMLButtonElement = document.createElement('button');
getImagesButton.innerText = 'Load Images';

getImagesButton.addEventListener('click', async () => {
    const response = await getImages();
    setResp(response);
});
getImagesSection.appendChild(getImagesButton);
app.appendChild(getImagesSection);

//Responce
let resp: JSONValue | null = null;
function setResp(value: JSONValue | null): void {
	resp = value;
	if (resp !== null) {
		try {
			respPre.textContent = JSON.stringify(resp, null, 2);
		} catch (_) {
			respPre.textContent = String(resp);
		}
	} else {
		respPre.textContent = 'No response yet';
	}
}

declare global {
	interface Window {
		setResp?: (value: JSONValue | null) => void;
	}
}

window.setResp = setResp;



