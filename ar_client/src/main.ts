//JaysonBam
//Main script calling helper function

import "./style.css";
import "./vendor/aframe.min.js";
import "./vendor/mindar-image-aframe.prod.js";
import { getActiveCampaignTargets } from "./api/campaign.js";
import { initAR } from "./ar-setup";
import { compileTargets } from "./utils/compiler";
import { showErrorOnScreen } from "./components/ErrorBanner";

declare global {
	interface Window {
		__TARGET_TO_CAMPAIGN?: Record<number, number>;
	}
}

const app = document.querySelector<HTMLDivElement>("#app")!;

const showLoading = (message = "Loading...") => {
 	const existingLoadingEl = document.getElementById("ar-loading");
 	if (existingLoadingEl) return () => existingLoadingEl.remove();

	const loadingEl = document.createElement("div");
	loadingEl.id = "ar-loading";
	loadingEl.innerText = message;
	document.body.appendChild(loadingEl);

	return () => {
		loadingEl.remove();
	};
};

const render = async () => {
	try {
		const targets = await getActiveCampaignTargets();
		if (app) app.style.display = "none";

		// `targets` is an array of { id, targetUrl } in the desired compilation order.
		if (!targets || targets.length === 0) {
			console.warn("No active campaigns found — loading camera without targets");
			if (app) app.style.display = "none";
			// initialize camera-only mode: no compiler, no detectors/overlays
			await initAR(undefined, []);
			return;
		}

		const campaignIds = targets.map((target) => target.id);
		const targetImageUrls = targets.map((target) => target.targetUrl);

		// Build explicit map: mindar targetIndex -> campaignId
		const targetToCampaignMap: Record<number, number> = {};
	 	campaignIds.forEach((id, targetIndex) => { targetToCampaignMap[targetIndex] = id; });
		// expose for runtime components to resolve targetIndex -> campaignId
		window.__TARGET_TO_CAMPAIGN = targetToCampaignMap;

		let compiledMindUrl: string;
		const hideLoading = showLoading("Compiling AR Targets...");
		try {
			compiledMindUrl = await compileTargets(targetImageUrls);
		} catch (err) {
			hideLoading();
			console.error("Failed to compile targets:", err);
			if (err instanceof Error && err.message.startsWith("Failed to load image:")) {
				console.error("Image load failure details:", err);
				showErrorOnScreen(`Failed to load image for AR target. URL: ${err.message.replace("Failed to load image: ","")}.`);
			} else {
				showErrorOnScreen("Failed to initialize AR targets.");
			}
			return;
		}
		hideLoading();

		initAR(compiledMindUrl, campaignIds);
	} catch (error) {
		if (error instanceof Error && (error.message === "Server error, could not fetch data" || error.message === "User error to fetch data")) {
			showErrorOnScreen(error.message);
		} else {
			console.error(error);
		}
	}
};

render();
