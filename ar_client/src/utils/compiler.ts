//JaysonBam
//Compiles all target images to a sing mind target

import type { MindAR } from "../types/mindar";

declare const MINDAR: MindAR;

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
      type ErrorWithEvent = Error & { event?: Event | ErrorEvent | unknown };
      const err = new Error(`Failed to load image: ${src}`) as ErrorWithEvent;
      // attach original event for debugging (typed)
      err.event = errorEvent as Event | ErrorEvent | unknown;
      reject(err);
    };
    loadedImage.src = src;
  });

export const compileTargets = async (imageUrls: string[]): Promise<string> => {
  const images = await Promise.all(imageUrls.map((imageUrl) => loadImage(imageUrl)));
  const compiler = new MINDAR.IMAGE.Compiler();

  console.log("Compiling targets...");
  await compiler.compileImageTargets(images, (progress: number) => {
    console.log("Compilation progress:", progress);
  });

  const exportedBuffer = await compiler.exportData();
  const uint8 = new Uint8Array(exportedBuffer);
  const blob = new Blob([uint8]);
  return URL.createObjectURL(blob);
};
