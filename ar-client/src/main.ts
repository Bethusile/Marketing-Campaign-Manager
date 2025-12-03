import './style.css';
import { getActiveCampaignTargets } from './services/api';
import { initAR } from './ar-setup';

const app = document.querySelector<HTMLDivElement>('#app')!;

const render = async () => {
  try {
    const targets = await getActiveCampaignTargets();
    if (app) app.style.display = 'none';
    initAR(targets);

  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <div style="color: white; text-align: center; padding: 20px;">
        <h1>Error</h1>
        <p>Could not load active campaign.</p>
      </div>
    `;
  }
};

render();
