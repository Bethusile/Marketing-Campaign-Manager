export const showErrorOnScreen = (message: string) => {
  const existingErrorEl = document.getElementById('ar-error');
  if (existingErrorEl) existingErrorEl.remove();

  const errorEl = document.createElement('div');
  errorEl.id = 'ar-error';
  errorEl.className = 'ar-error-banner';
  errorEl.innerText = message;

  document.body.appendChild(errorEl);
  return () => {
    const currentErrorEl = document.getElementById('ar-error');
    if (currentErrorEl) currentErrorEl.remove();
  };
};
