export const DropdownMessage = (message: string, buttonUrl: string) => {
  return `
    <div id="dropdown-message">
      <p class="message-text">${message}</p>
      <a href="${buttonUrl}" target="_blank" class="dropdown-button">
        <span>Visit Website</span>
        <span class="icon">➜</span>
      </a>
    </div>
  `;
};
