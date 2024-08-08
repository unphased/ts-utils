import { hsluv2rgb } from './hsluv_conversion.js';

export const rainbow_hsluv = (num: number, hue_offset = -60, hue_range_ratio = 0.8) => {
  const NUM_COLORS = num;
  const HUE_RANGE = hue_range_ratio * 360;
  const HUE_DEG_PER_STOP = HUE_RANGE / (NUM_COLORS - 1);
  const hues = Array.from({ length: NUM_COLORS }, (_, i) => ((i * HUE_DEG_PER_STOP + hue_offset) + 720) % 360);
  return hues.map(h => hsluv2rgb(h, 100, 70));
};

