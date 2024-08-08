import { Hsluv } from 'hsluv';

const hsluv_instance = new Hsluv();
export const hsluv2rgb = (h: number, s: number, l: number) => {
  hsluv_instance.hsluv_h = h;
  hsluv_instance.hsluv_s = s;
  hsluv_instance.hsluv_l = l;
  hsluv_instance.hsluvToRgb();
  const { rgb_r, rgb_g, rgb_b } = hsluv_instance;
  return [rgb_r * 255, rgb_g * 255, rgb_b * 255] as const;
};

export const rgb2hsluv = (r: number, g: number, b: number) => {
  hsluv_instance.rgb_r = r / 255;
  hsluv_instance.rgb_g = g / 255;
  hsluv_instance.rgb_b = b / 255;
  hsluv_instance.rgbToHsluv();
  const { hsluv_h: h, hsluv_s: s, hsluv_l: l } = hsluv_instance;
  return [h, s, l] as const;
};

