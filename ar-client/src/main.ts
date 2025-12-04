//JaysonBam
//Main script calling helper function

import "aframe";
import "mind-ar/dist/mindar-image-aframe.prod.js";
import "./style.css";
import { getActiveCampaignTargets } from "./services/api";
import { initAR } from "./ar-setup";
import { compileTargets } from "./utils/compiler";

const app = document.querySelector<HTMLDivElement>("#app")!;

const showLoading = (message = "Loading...") => {
  const existing = document.getElementById("ar-loading");
  if (existing) return () => existing.remove();

  const el = document.createElement("div");
  el.id = "ar-loading";
  el.innerText = message;
  document.body.appendChild(el);

  return () => {
    el.remove();
  };
};

const render = async () => {
  try {
    const targets = await getActiveCampaignTargets();
    if (app) app.style.display = "none";

    const campaignIds = Object.keys(targets).map((k) => Number(k));
    if (campaignIds.length === 0) {
      console.error("No active campaigns found");
      return;
    }

    const targetImageUrls = campaignIds.map((id) => targets[id]);

    let compiledMindUrl: string;
    const hideLoading = showLoading("Compiling AR Targets...");
    try {
      compiledMindUrl = await compileTargets(targetImageUrls);
    } catch (err) {
      hideLoading();
      console.error("Failed to compile targets:", err);
      alert("Failed to initialize AR targets.");
      return;
    }
    hideLoading();

    initAR(compiledMindUrl, campaignIds);
  } catch (error) {
    console.error(error);
  }
};

render();
