export const showErrorOnScreen = (message: string) => {
  const existing = document.getElementById('ar-error');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.id = 'ar-error';
  el.className = 'ar-error-banner';
  el.innerText = message;

  document.body.appendChild(el);
  return () => {
    const cur = document.getElementById('ar-error');
    if (cur) cur.remove();
  };
};
