// JaysonBam
// Dropdown message conponennt, to display message when campaign is scanned

export const createDropdownMessage = (
  message: string,
  buttonUrl: string,
): HTMLElement => {
  const section = document.createElement("section");
  section.id = "dropdown-message";

  const paragraphEl = document.createElement("p");
  paragraphEl.className = "message-text";
  paragraphEl.textContent = message;

  const nav = document.createElement("nav");

  const linkEl = document.createElement("a");
  linkEl.href = buttonUrl;
  linkEl.target = "_blank";
  linkEl.className = "dropdown-button";

  const textNode = document.createTextNode("Visit Website");

  const icon = document.createElement("i");
  icon.className = "icon";
  icon.textContent = "➜";

  linkEl.appendChild(textNode);
  linkEl.appendChild(icon);
  nav.appendChild(linkEl);

  section.appendChild(paragraphEl);
  section.appendChild(nav);

  return section;
};
