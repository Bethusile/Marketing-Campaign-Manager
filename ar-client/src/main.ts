import './style.css';
import { getActiveCampaign } from './services/api';
import { initAR } from './ar-setup';
import { StartScreen } from './components/StartScreen';

const app = document.querySelector<HTMLDivElement>('#app')!;

const render = async () => {
  try {
    const campaign = await getActiveCampaign();
    
    // Auto start AR
    if (app) app.style.display = 'none';
    initAR(campaign);

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
