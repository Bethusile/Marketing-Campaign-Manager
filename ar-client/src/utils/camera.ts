//JaysonBam
// Uses higher resolution for better AR

export const enforceHighQualityCamera = () => {
  const orig = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = function (
    constraints: MediaStreamConstraints,
  ) {
    try {
      if (
        constraints &&
        typeof constraints.video === "object" &&
        constraints.video !== null
      ) {
        const videoConstraints = constraints.video;
        if (videoConstraints.facingMode === "environment") {
          constraints.video = {
            ...videoConstraints,
            width: { min: 1280, ideal: 1920, max: 2560 },
            height: { min: 720, ideal: 1080, max: 1440 },
            frameRate: { ideal: 60 },
          };
        }
      }
    } catch (err) {
      console.warn(
        "enforceHighQualityCamera: failed to modify constraints",
        err,
      );
    }
    return orig(constraints);
  };
};
