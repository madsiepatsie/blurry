import { useRef, useState, useEffect } from 'react';
import { detectFaces, initFaceDetector } from '../utils/faceDetection';

export const useVideoProcessor = (videoRef, canvasRef, options) => {
  const [isReady, setIsReady] = useState(false);
  const [faces, setFaces] = useState([]);
  const requestRef = useRef();

  useEffect(() => {
    initFaceDetector().then(() => setIsReady(true));
  }, []);

  const processFrame = async () => {
    if (videoRef.current && canvasRef.current && isReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.paused || video.ended) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Detect faces
      const detections = await detectFaces(video);
      setFaces(detections);

      // Apply blur to faces
      detections.forEach(detection => {
        const { originX, originY, width, height } = detection.boundingBox;
        
        // Simple blur effect on canvas
        ctx.save();
        ctx.filter = `blur(${options.intensity / 5}px)`;
        ctx.drawImage(
          video,
          originX, originY, width, height,
          originX, originY, width, height
        );
        ctx.restore();
      });

      // Manual blur (mouse tracking)
      if (options.blurMode === 'manual' && options.isRecording) {
        const rect = video.getBoundingClientRect();
        const scaleX = video.videoWidth / rect.width;
        const scaleY = video.videoHeight / rect.height;
        const mouseX = (options.mousePos.x - rect.left) * scaleX;
        const mouseY = (options.mousePos.y - rect.top) * scaleY;
        const size = options.brushSize * scaleX;

        ctx.save();
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, size / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.filter = `blur(${options.intensity / 5}px)`;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    }
    requestRef.current = requestAnimationFrame(processFrame);
  };

  useEffect(() => {
    if (isReady && videoRef.current) {
      requestRef.current = requestAnimationFrame(processFrame);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isReady, options]);

  return { faces };
};
