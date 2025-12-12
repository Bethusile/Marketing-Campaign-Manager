import "./style.css";
import "./vendor/aframe.min.js";
import "./vendor/mindar-image-aframe.prod.js";
import { getARStartup } from "./api/campaign.js";
import { initAR } from "./ar-setup";
import { showErrorOnScreen } from "./components/ErrorBanner";

declare global { interface Window { __TARGET_TO_CAMPAIGN?: Record<number, number>; } }

const render = async () => {
	try {
		// Only call startup when `id` query parameter is present; otherwise start camera without AR
		const idParam = new URLSearchParams(window.location.search).get('id');
		if (!idParam || idParam.trim() === '') {
			// console.warn('No ?id provided — loading camera without AR targets');
			await initAR(undefined, []);
			return;
		}
		const campaignId = idParam.trim();
		const startup = await getARStartup(campaignId);
		// console.log('AR startup payload:', startup);
		if (!startup) {
			// console.warn('No AR startup payload — loading camera without targets');
			await initAR(undefined, []);
			return;
		}

		const targetIdMap: Record<number, number> = startup.targetIdMap ?? {};
		const targetIndexes = Object.keys(targetIdMap).map((k) => Number(k)).filter((n) => !Number.isNaN(n)).sort((a, b) => a - b);
		if (targetIndexes.length === 0) {
			if (startup.targetMindUrl && startup.targetMindUrl.trim() !== '') {
				await initAR(startup.targetMindUrl, []);
				return;
			}
			// console.warn('No targets listed in AR startup payload');
			await initAR(undefined, []);
			return;
		}

				// Build ordered list of image IDs according to targetIndex (object map)
				const orderedImageIds: number[] = targetIndexes.map((idx) => {
					const val = targetIdMap[idx];
					if (typeof val === 'number') return val;
					throw new Error(`Invalid targetIdMap: missing or non-numeric value for index ${idx}`);
				});

		// Map each targetIndex to a campaign placeholder and build campaignIds array
		const targetToCampaignMap: Record<number, number> = {};
		orderedImageIds.forEach((_imgId, idx) => { targetToCampaignMap[idx] = 0; });
		window.__TARGET_TO_CAMPAIGN = targetToCampaignMap;
		const campaignIds = orderedImageIds.map(() => 0);

		// Assume server provides a compiled mind file; prefer startup.targetMindUrl
		if (startup.targetMindUrl && startup.targetMindUrl.trim() !== '') {
			await initAR(startup.targetMindUrl, campaignIds);
			return;
		}

		// Fallback: if for some reason there's no targetMindUrl, start camera without targets
		// console.warn('Expected compiled mind file missing; starting camera without targets');
		await initAR(undefined, []);
		return;
	} catch (error) {
		if (error instanceof Error && (error.message === 'Server error, could not fetch data' || error.message === 'User error to fetch data')) {
			showErrorOnScreen(error.message);
		} else {
			// console.error(error);
		}
	}
};

render();
