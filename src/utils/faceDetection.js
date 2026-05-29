import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";

let faceDetector;

export const initFaceDetector = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm"
  );
  faceDetector = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
      delegate: "GPU"
    },
    runningMode: "VIDEO"
  });
  return faceDetector;
};

export const detectFaces = async (videoElement) => {
  if (!faceDetector) return [];
  const detections = await faceDetector.detectForVideo(videoElement, performance.now());
  return detections.detections;
};
