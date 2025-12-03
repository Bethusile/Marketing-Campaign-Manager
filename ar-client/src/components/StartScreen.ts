import type { Campaign } from '../services/api';

export const StartScreen = (campaign: Campaign): string => {
  return `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background: #000; z-index: 1000;">
      <div style="text-align: center; color: white;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">${campaign.title}</h1>
        <button id="start-ar" style="padding: 10px 20px; font-size: 1.2rem; cursor: pointer;">Start AR</button>
      </div>
    </div>
  `;
};
