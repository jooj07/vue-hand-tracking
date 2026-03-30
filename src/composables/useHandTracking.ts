import { ref } from 'vue';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@mediapipe/hands';

export function useHandTracking() {
  // Variável reativa que conterá as coordenadas [x, y, z] para uso no Vue
  const hands = ref<handPoseDetection.Hand[]>([]);

  let detector: handPoseDetection.HandDetector | null = null;
  let animationFrameId: number;
  let isTracking = false;

  const initModel = async (maxHands = 2) => {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig: handPoseDetection.MediaPipeHandsMediaPipeModelConfig = {
      runtime: 'mediapipe',
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands', // Carrega o wasm via CDN
      modelType: 'full',
      maxHands: maxHands,
    };
    detector = await handPoseDetection.createDetector(model, detectorConfig);
  };

  const detectHands = async (video: HTMLVideoElement) => {
    // Só prossegue se o vídeo estiver totalmente carregado (readyState === 4)
    if (!detector || !isTracking || video.readyState !== 4) return;

    try {
      // flipHorizontal inverte o eixo X para agir como um espelho
      hands.value = await detector.estimateHands(video, { flipHorizontal: true });
    } catch (error) {
      console.error("Erro na detecção:", error);
    }

    // Loop recursivo de alta performance
    if (isTracking) {
      animationFrameId = requestAnimationFrame(() => detectHands(video));
    }
  };

  const startTracking = async (videoElement: HTMLVideoElement) => {
    if (!detector) await initModel();
    isTracking = true;
    detectHands(videoElement);
  };

  const stopTracking = () => {
    isTracking = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  };

  return {
    hands,
    startTracking,
    stopTracking
  };
}
