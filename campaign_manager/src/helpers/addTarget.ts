import { compileTargets } from './genarator';

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };
type SetResp = (value: JSONValue | null) => void;

export const addTargetHelper = (setResp: SetResp): HTMLFormElement => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? window.location.origin;
  const form = document.createElement('form');
  form.id = 'add-target-form';

  const heading = document.createElement('h2');
  heading.innerText = 'Add Target';

  const campaignLabel = document.createElement('label');
  campaignLabel.innerText = 'Campaign ID:';
  const campaignInput = document.createElement('input');
  campaignInput.name = 'campaignId';
  campaignInput.type = 'text';
  campaignInput.placeholder = 'campaign id';

  const imagesLabel = document.createElement('label');
  imagesLabel.innerText = 'Image IDs (comma-separated):';
  const imagesInput = document.createElement('input');
  imagesInput.name = 'images';
  imagesInput.type = 'text';
  imagesInput.placeholder = 'e.g. 12,34,56';

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.innerText = 'Create & Upload Target';

  form.appendChild(heading);
  form.appendChild(campaignLabel);
  form.appendChild(campaignInput);
  form.appendChild(document.createElement('br'));
  form.appendChild(imagesLabel);
  form.appendChild(imagesInput);
  form.appendChild(document.createElement('br'));
  form.appendChild(submit);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const campaignId = campaignInput.value.trim();
    const imagesValue = imagesInput.value.trim();

    if (!campaignId) {
      setResp({ error: 'Provide campaignId in form' });
      return;
    }
    if (!imagesValue) {
      setResp({ error: 'Provide image IDs (comma-separated)' });
      return;
    }

    submit.disabled = true;
    setResp({ status: 'starting' });

    try {
      const ids: number[] = imagesValue.split(',').map((s) => Number(s.trim())).filter(Boolean);
      if (!ids.length) throw new Error('No image ids resolved');

      // Fetch bulk redacted-image map and build ordered list of urls + index->imageId map
      let imageEntries: Array<{ id: number; url: string }> = [];
      try {
        const r = await fetch(`${SERVER_URL}/api/marketing/images/redacted`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
        });
        if (r.ok) {
          const map = (await r.json().catch(() => ({}))) as Record<string, string>;
          imageEntries = ids.map((id) => {
            const url = `${SERVER_URL}${map[id]}`
            return { id, url };
          }).filter((e) => e.url);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setResp({ error: `Failed to fetch redacted images: ${msg}` });
      }

      if (!imageEntries.length) {
        setResp({ error: 'No redacted image URLs could be resolved' });
        return;
      }

      const imageUrls = imageEntries.map((e) => e.url);

      setResp({ status: 'Compiling targets', count: imageUrls.length });

      const compiled = await compileTargets(imageUrls);

      // fetch blob from object URL
      const blobResp = await fetch(compiled.url);
      const mindBlob = await blobResp.blob();

      const targetIdMap: Record<number, number> = imageEntries.reduce<Record<number, number>>((acc, e, idx) => {
        acc[idx] = e.id;
        return acc;
      }, {});

      const fd = new FormData();
      fd.append('campaignId', String(campaignId));
      fd.append('targetIdMap', JSON.stringify(targetIdMap));
      fd.append('targetMind', mindBlob, 'targets.mind');

      setResp({ status: 'Uploading compiled target' });
      const upl = await fetch(`${SERVER_URL}/api/marketing/campaign/target`, { method: 'PUT', body: fd });
      const uplJson = await upl.json().catch(() => ({ status: upl.status, ok: upl.ok }));
      setResp(uplJson);

      try {
        URL.revokeObjectURL(compiled.url);
      } catch (_){ }
    } catch (err: any) {
      console.error('addTarget error', err);
      setResp({ error: err?.message ?? String(err) });
    } finally {
      submit.disabled = false;
    }
  });

  return form;
};

export default addTargetHelper;