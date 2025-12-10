import './style.css'

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

const resolvedBase = (() => {
	const fromEnv = import.meta.env.VITE_API_BASE_URL;
	if (fromEnv) {
		return fromEnv;
	}
	if (import.meta.env.DEV) {
		return 'http://localhost:3000';
	}
	return '';
})();

const apiBase = resolvedBase.replace(/\/$/, '');
const API_UPLOAD_ENDPOINT = apiBase ? `${apiBase}/api/campaign/upload` : '/api/campaign/upload';

const app: HTMLElement = document.createElement('section');
app.id = 'app';
const logoSrc = new URL('../Logo_BBD_Software.png', import.meta.url).href;

const hero = document.createElement('header');
hero.className = 'app-hero';

const logoImg = document.createElement('img');
logoImg.src = logoSrc;
logoImg.alt = 'BBD Software logo';
logoImg.className = 'app-logo';
hero.appendChild(logoImg);

const heroText = document.createElement('div');
heroText.className = 'app-hero__text';

const title: HTMLElement = document.createElement('h1');
title.innerText = 'Campaign Manager';
heroText.appendChild(title);

const subtitle: HTMLElement = document.createElement('p');
subtitle.className = 'app-hero__subtitle';
subtitle.textContent = 'Plan, preview, and publish campaigns with ease.';
heroText.appendChild(subtitle);

hero.appendChild(heroText);
app.appendChild(hero);


const uploadCampaignSection = createUploadCampaignSection();
app.appendChild(uploadCampaignSection);
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

function createUploadCampaignSection(): HTMLElement {
	const section = document.createElement('section');
	section.className = 'upload-section';

	const heading = document.createElement('h2');
	heading.textContent = 'Upload Campaign';
	section.appendChild(heading);

	const intro = document.createElement('p');
	intro.className = 'upload-intro';
	intro.textContent = 'Fill in the basics and send the campaign to the server in one click.';
	section.appendChild(intro);

	const form = document.createElement('form');
	form.className = 'upload-form';
	section.appendChild(form);

	const fieldset = document.createElement('fieldset');
	fieldset.className = 'upload-form__fieldset';
	form.appendChild(fieldset);

	const titleInput = document.createElement('input');
	titleInput.type = 'text';
	titleInput.id = 'campaign-title';
	titleInput.name = 'campaignTitle';
	titleInput.placeholder = 'Campaign title';
	fieldset.appendChild(createLabeledControl('Title', titleInput));

	const messageInput = document.createElement('textarea');
	messageInput.id = 'campaign-message';
	messageInput.name = 'campaignMessage';
	messageInput.rows = 4;
	messageInput.placeholder = 'Message content';
	fieldset.appendChild(createLabeledControl('Message', messageInput));

	const buttonUrlInput = document.createElement('input');
	buttonUrlInput.type = 'url';
	buttonUrlInput.id = 'campaign-button-url';
	buttonUrlInput.name = 'campaignButtonUrl';
	buttonUrlInput.placeholder = 'https://example.com';
	fieldset.appendChild(createLabeledControl('Button URL', buttonUrlInput));

	const actions = document.createElement('footer');
	actions.className = 'upload-actions';
	form.appendChild(actions);

	const createButton = document.createElement('button');
	createButton.type = 'submit';
	createButton.textContent = 'Create Campaign';
	actions.appendChild(createButton);

	const status = document.createElement('p');
	status.className = 'upload-status';
	status.textContent = 'Awaiting details…';
	section.appendChild(status);

	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		const titleValue = titleInput.value.trim();
		const messageValue = messageInput.value.trim();
		const buttonUrlValue = buttonUrlInput.value.trim();

		if (!titleValue || !messageValue || !buttonUrlValue) {
			status.textContent = 'Please complete title, message, and button URL.';
			return;
		}

		const payload = {
			title: titleValue,
			message: messageValue,
			buttonUrl: buttonUrlValue,
			targetIdMap: {},
		};

		createButton.disabled = true;
		createButton.textContent = 'Uploading…';
		status.textContent = 'Uploading to server…';

		try {
			const response = await uploadCampaign(payload);
			status.textContent = 'Upload complete ✔';
			setResp(response);
			form.reset();
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to upload campaign';
			status.textContent = message;
			setResp({ error: message });
		} finally {
			createButton.disabled = false;
			createButton.textContent = 'Create Campaign';
		}
	});

	return section;

	function createLabeledControl(
		labelText: string,
		control: HTMLInputElement | HTMLTextAreaElement,
		hint?: string,
	): HTMLElement {
		const wrapper = document.createElement('label');
		wrapper.className = 'input-field';

		const text = document.createElement('span');
		text.className = 'input-field__label';
		text.textContent = labelText;
		wrapper.appendChild(text);
		wrapper.appendChild(control);

		if (hint) {
			const helper = document.createElement('small');
			helper.className = 'input-field__hint';
			helper.textContent = hint;
			wrapper.appendChild(helper);
		}

		return wrapper;
	}
}

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



