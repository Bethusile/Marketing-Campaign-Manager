// Uses higher resolution for better AR

export const enforceHighQualityCamera = () => {
  const orig = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = function (
    constraints: MediaStreamConstraints,
  ) {
    // type-guard to detect MediaTrackConstraints-like objects without casting
    function isMediaTrackConstraintsLike(obj: object | null): obj is MediaTrackConstraints {
      return !!obj && ('facingMode' in obj || 'width' in obj);
    }
    function isFacingParamLike(obj: object | null): obj is { ideal?: string | string[]; exact?: string | string[] } {
      return !!obj && ('ideal' in obj || 'exact' in obj);
    }
    try {
      if (
        constraints &&
        typeof constraints.video === "object" &&
        constraints.video !== null
      ) {
        const maybeVideo = constraints.video;
        // facingMode may be a string ('environment') or an object ({ ideal: 'environment' })
        let isEnvironment = false;
        if (isMediaTrackConstraintsLike(maybeVideo)) {
          const facing = maybeVideo.facingMode;
          if (typeof facing === 'string') {
            isEnvironment = facing === 'environment';
          } else if (typeof facing === 'object' && facing !== null) {
            if (isFacingParamLike(facing)) {
              const ideal = facing.ideal;
              const exact = facing.exact;
              const idealStr = Array.isArray(ideal) ? ideal[0] : ideal;
              const exactStr = Array.isArray(exact) ? exact[0] : exact;
              if (idealStr === 'environment' || exactStr === 'environment') isEnvironment = true;
            }
          }
        }
        if (isEnvironment) {
          const baseConstraints = isMediaTrackConstraintsLike(maybeVideo) ? maybeVideo : undefined;
          constraints.video = {
            ...(baseConstraints ?? {}),
            width: { min: 1280, ideal: 1920, max: 2560 },
            height: { min: 720, ideal: 1080, max: 1440 },
            frameRate: { ideal: 60 },
          };
        }
      }
    } catch (err) {
      // console.warn(
      //   "enforceHighQualityCamera: failed to modify constraints",
      //   err,
      // );
    }
    return orig(constraints);
  };
};

// Start a camera fallback stream and append a fullscreen video element with id `ar-camera-video`.
export const startCameraFallbackStream = async (): Promise<void> => {
  try {
    const existingVideoEl = document.getElementById('ar-camera-video');
    if (existingVideoEl instanceof HTMLVideoElement) return;

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
    try {
      if (!document.getElementById('ar-fallback-message')) {
        const msg = document.createElement('div');
        msg.id = 'ar-fallback-message';
        msg.textContent = 'No campaigns were loaded';
        document.body.appendChild(msg);
      }
    } catch (err) {
    }
  } catch (err) {
    // console.error('startCameraFallbackStream: failed to start camera', err);
    throw err;
  }
};

// Stop and remove the fallback camera video element and its tracks
export const stopCameraFallbackStream = (): void => {
  const videoNode = document.getElementById('ar-camera-video');
  if (!(videoNode instanceof HTMLVideoElement)) return;
  const videoStream = videoNode.srcObject;
  if (videoStream instanceof MediaStream) {
    videoStream.getTracks().forEach((track) => track.stop());
  }
  videoNode.remove();
  // remove fallback overlay if present
  try {
    const msg = document.getElementById('ar-fallback-message');
    if (msg) msg.remove();
  } catch (err) {
    // ignore
  }
};