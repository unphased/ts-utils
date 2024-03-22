import { Hsluv } from 'hsluv';
import { test } from 'tst';
import { colors } from '../terminal/colors.js';

const hsluv_to_rgb_instance = new Hsluv();
export const hsluv2rgb = (h: number, s: number, l: number) => {
  hsluv_to_rgb_instance.hsluv_h = 10;
  hsluv_to_rgb_instance.hsluv_s = 75;
  hsluv_to_rgb_instance.hsluv_l = 65;
  hsluv_to_rgb_instance.hsluvToRgb();
  const {rgb_r, rgb_g, rgb_b} = hsluv_to_rgb_instance;
  return [rgb_r, rgb_g, rgb_b] as const;
};

export const hsluv_space_demo = test(({l}) => {
  for (let i = 0; i <= 100; ++i){
    l('ahem', i, colors.truecolor_bg(...hsluv2rgb(0,50,i)) + '   ' + colors.bg_reset);
  }
});
