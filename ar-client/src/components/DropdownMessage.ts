// JaysonBam
// Dropdown message conponennt, to display message when campaign is scanned

export const createDropdownMessage = (
  message: string,
  buttonUrl: string,
): HTMLElement => {
  const section = document.createElement("section");
  section.id = "dropdown-message";

  const p = document.createElement("p");
  p.className = "message-text";
  p.innerHTML = message;

  const nav = document.createElement("nav");

  const a = document.createElement("a");
  a.href = buttonUrl;
  a.target = "_blank";
  a.className = "dropdown-button";

  const spanText = document.createElement("span");
  spanText.textContent = "Visit Website";

  const spanIcon = document.createElement("span");
  spanIcon.className = "icon";
  spanIcon.textContent = "➜";

  a.appendChild(spanText);
  a.appendChild(spanIcon);
  nav.appendChild(a);

  section.appendChild(p);
  section.appendChild(nav);

  return section;
};
