import type { Hand } from '@tensorflow-models/hand-pose-detection';

export function analyzeGestures(hand: Hand) {
  if (!hand || !hand.keypoints || hand.keypoints.length < 21) {
    window.console.log(hand)
    return {
      isIndexRaised: false,
      isMiddleRaised: false,
      isRingRaised: false,
      isPinkyRaised: false
    };
  }

  const kp = hand.keypoints;

  // Compara o Y da ponta (ex: 8) com o Y da base do dedo (ex: 6)
  return {
    isIndexRaised: kp[8].y < kp[6].y,
    isMiddleRaised: kp[12].y < kp[10].y,
    isRingRaised: kp[16].y < kp[14].y,
    isPinkyRaised: kp[20].y < kp[18].y,
  };
}

export function analyzeGesturesDeep(hand: Hand) {
  if (!hand || !hand.keypoints || !hand.keypoints3D || hand.keypoints.length < 21) {
    return { isThumbsUp: false, thumbDepth: 0 };
  }

  const kp = hand.keypoints;
  const kp3D = hand.keypoints3D;

  // 1. Polegar apontando para cima (Y da ponta menor que Y da articulação base)
  const isThumbUp = kp[4].y < kp[2].y;

  // 2. Os outros 4 dedos devem estar dobrados (Y da ponta maior que Y da articulação do meio)
  const isIndexFolded = kp[8].y > kp[6].y;
  const isMiddleFolded = kp[12].y > kp[10].y;
  const isRingFolded = kp[16].y > kp[14].y;
  const isPinkyFolded = kp[20].y > kp[18].y;

  // 3. Análise de Profundidade 3D
  // -0.015 é um limiar de tolerância. Garante que o polegar está projetado na direção da lente.
  const isThumbForward = kp3D[4].z < -0.015;

  // O gesto só é confirmado se todas as condições físicas forem verdadeiras
  const isThumbsUpGesto = isThumbUp && isIndexFolded && isMiddleFolded && isRingFolded && isPinkyFolded && isThumbForward;

  return {
    isThumbsUp: isThumbsUpGesto,
    thumbDepth: kp3D[4].z // Exportamos para você ver o valor bruto mudando
  };
}
