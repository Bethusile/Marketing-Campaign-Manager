import { compileTargets } from './genarator';

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };
type SetResp = (value: JSONValue | null) => void;

export const addTargetHelper = (setResp: SetResp): void => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? window.location.origin;
  
  const form = document.querySelector<HTMLFormElement>('#add-target-form');
  const campaignInput = document.querySelector<HTMLInputElement>('#target-campaign-id');
  const imagesInput = document.querySelector<HTMLInputElement>('#target-image-ids');
  const submit = form?.querySelector<HTMLButtonElement>('button[type="submit"]');

  if (!form || !campaignInput || !imagesInput || !submit) {
    console.error('Add target form elements not found');
    return;
  }

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
};

export default addTargetHelper;