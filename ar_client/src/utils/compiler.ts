import type { MindAR } from "../types/mindar";

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

export const compileTargets = async (imageUrls: string[]): Promise<string> => {
  const images = await Promise.all(imageUrls.map((imageUrl) => loadImage(imageUrl)));
  const compiler = new MINDAR.IMAGE.Compiler();

  // console.log("Compiling targets...");
  await compiler.compileImageTargets(images, (progress: number) => {
    // console.log("Compilation progress:", progress);
  });

  const exportedBuffer = await compiler.exportData();
  const uint8 = new Uint8Array(exportedBuffer);
  const blob = new Blob([uint8]);
  return URL.createObjectURL(blob);
};
