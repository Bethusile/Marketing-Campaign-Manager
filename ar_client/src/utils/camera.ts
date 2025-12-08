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
        const videoConstraints = constraints.video as MediaTrackConstraints;
        // facingMode may be a string ('environment') or an object ({ ideal: 'environment' })
        const facing = videoConstraints.facingMode;
        let isEnvironment = false;
        if (typeof facing === 'string') {
          isEnvironment = facing === 'environment';
        } else if (typeof facing === 'object' && facing !== null) {
          const params = facing as ConstrainDOMStringParameters;
          const ideal = params.ideal;
          const exact = params.exact;
          const idealStr = Array.isArray(ideal) ? ideal[0] : ideal;
          const exactStr = Array.isArray(exact) ? exact[0] : exact;
          if (idealStr === 'environment' || exactStr === 'environment') isEnvironment = true;
        }
        if (isEnvironment) {
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

// Start a camera fallback stream and append a fullscreen video element with id `ar-camera-video`.
export const startCameraFallbackStream = async (): Promise<void> => {
  try {
    const existing = document.getElementById('ar-camera-video') as HTMLVideoElement | null;
    if (existing) return;

    const video = document.createElement('video');
    video.id = 'ar-camera-video';
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;

    // use string facingMode to match what enforceHighQualityCamera checks
    const constraints: MediaStreamConstraints = { video: { facingMode: 'environment' }, audio: false };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;

    document.body.appendChild(video);
    await video.play().catch(() => { /* ignore autoplay errors */ });
  } catch (err) {
    console.error('startCameraFallbackStream: failed to start camera', err);
    throw err;
  }
};

// Stop and remove the fallback camera video element and its tracks
export const stopCameraFallbackStream = (): void => {
  const video = document.getElementById('ar-camera-video') as HTMLVideoElement | null;
  if (!video) return;
  const stream = video.srcObject as MediaStream | null;
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
  }
  video.remove();
};