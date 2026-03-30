<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useHandTracking } from '@/composables/useHandTracking';
import { drawHand } from '@/utils/drawHand';
import { analyzeGestures, analyzeGesturesDeep } from '@/utils/gestureAnalysis';

const width = 640;
const height = 480;

const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const { hands, startTracking, stopTracking } = useHandTracking();

const initCamera = async () => {
  if (!videoRef.value) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: width, height: height },
      audio: false,
    });
    videoRef.value.srcObject = stream;

    videoRef.value.onloadedmetadata = () => {
      videoRef.value?.play();
      startTracking(videoRef.value!);
    };
  } catch (err) {
    console.error('Erro ao acessar a câmera:', err);
  }
};

watch(hands, (newHands) => {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

  newHands.forEach(hand => {
    if (hand.keypoints) {
      drawHand(hand.keypoints, ctx);
    }
  });
}, { deep: true });

onMounted(() => {
  initCamera();
});

onUnmounted(() => {
  stopTracking();
  if (videoRef.value?.srcObject) {
    const stream = videoRef.value.srcObject as MediaStream;
    stream.getTracks().forEach(track => track.stop());
  }
});
</script>

<template>
  <div class="flex flex-row gap-8 p-6 justify-center items-start">

    <div class="flex flex-col gap-6 items-center">
      <div class="relative w-[150px] h-[150px] bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <video ref="videoRef" class="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" playsinline
          muted></video>
        <div class="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-full z-10">
          CÂMERA LIVE
        </div>
      </div>

      <div class="relative bg-black rounded-lg shadow-xl overflow-hidden border border-gray-700">
        <div class="absolute top-2 left-2 text-white/50 text-xs font-mono z-10">Esqueleto 2D</div>
        <canvas ref="canvasRef" :width="width" :height="height" class="block bg-black"></canvas>
      </div>
    </div>

    <div class="flex flex-col gap-4 w-80">
      <h2 class="text-xl font-bold text-gray-200 mb-2">Painel de Análise</h2>

      <div v-if="hands.length > 0" class="flex flex-col gap-4">
        <div v-for="(hand, index) in hands" :key="index"
          class="bg-gray-800 text-white p-5 rounded-lg shadow-md font-mono">
          <div class="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
            <span class="font-bold text-lg" :class="hand.handedness === 'Left' ? 'text-green-400' : 'text-purple-400'">
              Mão {{ hand.handedness === 'Left' ? 'Esquerda' : 'Direita' }}
            </span>
            <span class="text-xs text-gray-400">Score: {{ (hand.score * 100).toFixed(0) }}%</span>
          </div>

          <div class="flex flex-col gap-2 text-sm">
            <div class="flex justify-between">
              <span>Indicador:</span>
              <span :class="analyzeGestures(hand).isIndexRaised ? 'text-green-400' : 'text-red-400'">
                {{ analyzeGestures(hand).isIndexRaised ? 'LEVANTADO' : 'ABAIXADO' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span>Médio:</span>
              <span :class="analyzeGestures(hand).isMiddleRaised ? 'text-green-400' : 'text-red-400'">
                {{ analyzeGestures(hand).isMiddleRaised ? 'LEVANTADO' : 'ABAIXADO' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span>Anelar:</span>
              <span :class="analyzeGestures(hand).isRingRaised ? 'text-green-400' : 'text-red-400'">
                {{ analyzeGestures(hand).isRingRaised ? 'LEVANTADO' : 'ABAIXADO' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span>Mínimo:</span>
              <span :class="analyzeGestures(hand).isPinkyRaised ? 'text-green-400' : 'text-red-400'">
                {{ analyzeGestures(hand).isPinkyRaised ? 'LEVANTADO' : 'ABAIXADO' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="hands.length > 0" class="flex flex-col gap-4">
        <div v-for="(hand, index) in hands" :key="index"
          class="bg-gray-800 text-white p-5 rounded-lg shadow-md font-mono">
          <div class="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
            <span class="font-bold text-lg" :class="hand.handedness === 'Left' ? 'text-green-400' : 'text-purple-400'">
              Mão {{ hand.handedness === 'Left' ? 'Esquerda' : 'Direita' }}
            </span>
            <span class="text-xs text-gray-400">Score: {{ (hand.score * 100).toFixed(0) }}%</span>
          </div>

          <span :class="analyzeGestures(hand).isIndexRaised ? 'text-green-400' : 'text-red-400'">
            {{ analyzeGesturesDeep(hand) }}
          </span>

        </div>
      </div>

      <div v-else
        class="bg-gray-800/50 text-gray-400 p-5 rounded-lg text-center font-mono text-sm border border-gray-700 border-dashed">
        Aguardando detecção...
      </div>
    </div>

  </div>
</template>
