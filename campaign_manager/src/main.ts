import './style.css'

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

function getApiBaseUrl(): string {
	const envBase = import.meta.env.VITE_API_BASE_URL;
	if (envBase) {
		return envBase;
	}
	if (import.meta.env.DEV) {
		return 'http://localhost:3000';
	}
	return '';
}

const apiBase = getApiBaseUrl().replace(/\/$/, '');
const API_UPLOAD_ENDPOINT = apiBase ? `${apiBase}/api/campaign/upload` : '/api/campaign/upload';

const appRoot = document.querySelector<HTMLElement>('#app');
if (!appRoot) {
	throw new Error('App container not found. Ensure index.html contains #app.');
}
appRoot.dataset.ready = 'true';

const logoImg = document.querySelector<HTMLImageElement>('#app-logo');
if (logoImg) {
	logoImg.src = new URL('../Logo_BBD_Software.png', import.meta.url).href;
}

const form = document.querySelector<HTMLFormElement>('#upload-form');
const statusEl = document.querySelector<HTMLParagraphElement>('[data-upload-status]');
const respPre = document.querySelector<HTMLPreElement>('[data-resp]');
const titleInput = document.querySelector<HTMLInputElement>('#campaign-title');
const messageInput = document.querySelector<HTMLTextAreaElement>('#campaign-message');
const buttonUrlInput = document.querySelector<HTMLInputElement>('#campaign-button-url');
const submitButton = form?.querySelector<HTMLButtonElement>('button[type="submit"]') ?? null;

if (!form || !statusEl || !respPre || !titleInput || !messageInput || !buttonUrlInput || !submitButton) {
	throw new Error('Upload form markup is missing required elements.');
}

form.addEventListener('submit', async (event) => {
	event.preventDefault();
	const titleValue = titleInput.value.trim();
	const messageValue = messageInput.value.trim();
	const buttonUrlValue = buttonUrlInput.value.trim();

	if (!titleValue || !messageValue || !buttonUrlValue) {
		statusEl.textContent = 'Please complete title, message, and button URL.';
		return;
	}

	const payload = {
		title: titleValue,
		message: messageValue,
		buttonUrl: buttonUrlValue,
		targetIdMap: {},
	};

	submitButton.disabled = true;
	submitButton.textContent = 'Uploading…';
	statusEl.textContent = 'Uploading to server…';

	try {
		const response = await uploadCampaign(payload);
		statusEl.textContent = 'Upload complete ✔';
		setResp(response);
		form.reset();
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to upload campaign';
		statusEl.textContent = message;
		setResp({ error: message });
	} finally {
		submitButton.disabled = false;
		submitButton.textContent = 'Create Campaign';
	}
});

// Response handling
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

async function uploadCampaign(payloadBody: Record<string, unknown>): Promise<JSONValue> {
	const response = await fetch(API_UPLOAD_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payloadBody),
	});
	const responseText = await response.text();
	const payload = safeParseJson(responseText);
	if (!response.ok) {
		const serverError = (payload as { error?: string; detail?: string }).error;
		const detail = (payload as { detail?: string }).detail;
		const fallback = responseText || `${response.status} ${response.statusText}`;
		const message = [serverError ?? fallback, detail].filter(Boolean).join(' · ');
		throw new Error(message || 'Server rejected the upload');
	}
	return payload;
}

function safeParseJson(text: string): JSONValue {
	if (!text) return {};
	try {
		return JSON.parse(text);
	} catch (_) {
		return {};
	}
}



