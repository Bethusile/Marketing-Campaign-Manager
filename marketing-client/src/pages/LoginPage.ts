export function LoginPage(onLogin: () => void): HTMLElement {
  const container = document.createElement('div');
  container.className = 'section';
  
  const button = document.createElement('button');
  button.className = 'button is-primary';
  button.textContent = 'Login';
  button.addEventListener('click', onLogin);
  
  container.appendChild(button);
  return container;
}
