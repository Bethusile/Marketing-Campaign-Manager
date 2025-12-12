interface MindARCompiler {
  compileImageTargets: (
    images: HTMLImageElement[],
    callback: (progress: number) => void,
  ) => Promise<void>;
  exportData: () => Promise<Uint8Array>;
}

interface MindAR {
	IMAGE: {
		Compiler: new () => MindARCompiler;
	};
}

declare const MINDAR: MindAR;

class ErrorWithEvent extends Error {
  event?: Event | ErrorEvent;
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, ErrorWithEvent.prototype);
  }
}

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const loadedImage = new Image();
    // Some hosts require no-referrer or appropriate CORS headers for canvas access.
    loadedImage.crossOrigin = "anonymous";
    try {
      loadedImage.referrerPolicy = "no-referrer";
    } catch (_err) {
      // ignore if not supported
    }
    loadedImage.onload = () => resolve(loadedImage);
    loadedImage.onerror = (errorEvent) => {
      const err = new ErrorWithEvent(`Failed to load image: ${src}`);
      // attach original event for debugging when it's an Event
      if (errorEvent instanceof Event) {
        err.event = errorEvent;
      } else {
        // append textual information when available
        err.message = `${err.message} (${String(errorEvent)})`;
      }
      reject(err);
    };
    loadedImage.src = src;
  });

export const compileTargets = async (imageUrls: string[]): Promise<{ url: string; size: number }> => {
  const images = await Promise.all(imageUrls.map((imageUrl) => loadImage(imageUrl)));
  const compiler = new MINDAR.IMAGE.Compiler();

  console.log("Compiling targets...");
  await compiler.compileImageTargets(images, (progress: number) => {
    console.log("Compilation progress:", progress);
  });

  const exportedBuffer = await compiler.exportData();
  const uint8 = new Uint8Array(exportedBuffer);
  const blob = new Blob([uint8]);
  const url = URL.createObjectURL(blob);
  const size = blob.size || uint8.byteLength || 0;
  return { url, size };
};