import { misc, v2, Vec2 } from 'cc';

function vectorsToDegress(dirVec: Vec2) {
  let comVec = v2(0, 1);
  let radian = dirVec.signAngle(comVec);
  let degree = misc.radiansToDegrees(radian);

  return degree;
}

export default vectorsToDegress;
