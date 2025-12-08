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
  p.textContent = message;

  const nav = document.createElement("nav");

  const a = document.createElement("a");
  a.href = buttonUrl;
  a.target = "_blank";
  a.className = "dropdown-button";

  const textNode = document.createTextNode("Visit Website");

  const icon = document.createElement("i");
  icon.className = "icon";
  icon.textContent = "➜";

  a.appendChild(textNode);
  a.appendChild(icon);
  nav.appendChild(a);

  section.appendChild(p);
  section.appendChild(nav);

  return section;
};
