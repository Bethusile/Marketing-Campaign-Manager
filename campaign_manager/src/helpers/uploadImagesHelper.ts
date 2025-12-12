export function uploadImagesHelper(onResponse: (resp: any) => void): void {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const form = document.querySelector<HTMLFormElement>('#upload-images-form');
  
  if (!form) {
    console.error('Upload images form not found');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const res = await fetch(`${SERVER_URL}/api/uploadImages`, {
        method: 'POST',
        body: formData,
      });

      let json;
      try {
        json = await res.json();
      } catch (_) {
        json = { error: 'Server did not return JSON' };
      }

      onResponse(json);
    } catch (err) {
      onResponse({ error: String(err) });
    }
  });
}