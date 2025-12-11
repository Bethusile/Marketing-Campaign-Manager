export function uploadImagesHelper(onResponse: (resp: any) => void): HTMLElement {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL; // <-- add this

  const wrapper = document.createElement('section');
  wrapper.className = 'upload-section';

  const heading = document.createElement('h2');
  heading.innerText = 'Upload Images';
  wrapper.appendChild(heading);

  const form = document.createElement('form');
  form.enctype = 'multipart/form-data';
  form.className = 'upload-form';

  // Title row
  const titleRow = document.createElement('div');
  titleRow.className = 'form-row';
  const titleLabel = document.createElement('label');
  titleLabel.innerText = 'Title:';
  titleLabel.htmlFor = 'title';
  const title = document.createElement('input');
  title.type = 'text';
  title.name = 'title';
  title.id = 'title';
  title.placeholder = 'Campaign Title';
  title.required = true;
  titleRow.append(titleLabel, title);

  // Redacted row
  const redactedRow = document.createElement('div');
  redactedRow.className = 'form-row';
  const redactedLabel = document.createElement('label');
  redactedLabel.innerText = 'Redacted Image:';
  redactedLabel.htmlFor = 'redacted';
  const redacted = document.createElement('input');
  redacted.type = 'file';
  redacted.name = 'redacted';
  redacted.id = 'redacted';
  redacted.accept = 'image/*';
  redacted.required = true;
  redactedRow.append(redactedLabel, redacted);

  // Unredacted row
  const unredactedRow = document.createElement('div');
  unredactedRow.className = 'form-row';
  const unredactedLabel = document.createElement('label');
  unredactedLabel.innerText = 'Unredacted Image:';
  unredactedLabel.htmlFor = 'unredacted';
  const unredacted = document.createElement('input');
  unredacted.type = 'file';
  unredacted.name = 'unredacted';
  unredacted.id = 'unredacted';
  unredacted.accept = 'image/*';
  unredacted.required = true;
  unredactedRow.append(unredactedLabel, unredacted);

  // Button row
  const btnRow = document.createElement('div');
  btnRow.className = 'form-row';
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.innerText = 'Upload';
  btn.className = 'small-btn';
  btnRow.appendChild(btn);

  form.append(titleRow, redactedRow, unredactedRow, btnRow);
  wrapper.appendChild(form);

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

  return wrapper;
}
