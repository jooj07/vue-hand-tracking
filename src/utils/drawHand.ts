import type { Keypoint } from '@tensorflow-models/hand-pose-detection';

const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

export function drawHand(keypoints: Keypoint[], ctx: CanvasRenderingContext2D) {
  if (!keypoints || keypoints.length === 0) return;

  const fingers = Object.values(fingerJoints);
  for (const joints of fingers) {
    for (let k = 0; k < joints.length - 1; k++) {
      const firstJointIndex = joints[k];
      const secondJointIndex = joints[k + 1];

      if (firstJointIndex === undefined || secondJointIndex === undefined) continue;

      const kp1 = keypoints[firstJointIndex];
      const kp2 = keypoints[secondJointIndex];

      if (kp1 && kp2) {
        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }

  for (let i = 0; i < keypoints.length; i++) {
    const kp = keypoints[i];
    if (kp) {
      ctx.beginPath();
      ctx.arc(kp.x, kp.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#FF0000';
      ctx.fill();
    }
  }
}
