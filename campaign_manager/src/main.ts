import './style.css'

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



