//JaysonBam
//Compiles all target images to a sing mind target

import type { MindAR } from "../types/mindar";

declare const MINDAR: MindAR;

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    // Some hosts require no-referrer or appropriate CORS headers for canvas access.
    img.crossOrigin = "anonymous";
    try {
      img.referrerPolicy = "no-referrer";
    } catch (e) {
      // ignore if not supported
    }
    img.onload = () => resolve(img);
    img.onerror = (e) => {
      type ErrorWithEvent = Error & { event?: Event | ErrorEvent | unknown };
      const err = new Error(`Failed to load image: ${src}`) as ErrorWithEvent;
      // attach original event for debugging (typed)
      err.event = e as Event | ErrorEvent | unknown;
      reject(err);
    };
    img.src = src;
  });

export const compileTargets = async (imageUrls: string[]): Promise<string> => {
  const images = await Promise.all(imageUrls.map((u) => loadImage(u)));
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
