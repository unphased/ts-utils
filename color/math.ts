import { Hsluv } from 'hsluv';
import { test } from 'tst';
import { colors } from '../terminal/colors.js';
import { half_block } from '../terminal.js';

const hsluv_instance = new Hsluv();
export const hsluv2rgb = (h: number, s: number, l: number) => {
  hsluv_instance.hsluv_h = h;
  hsluv_instance.hsluv_s = s;
  hsluv_instance.hsluv_l = l;
  hsluv_instance.hsluvToRgb();
  const {rgb_r, rgb_g, rgb_b} = hsluv_instance;
  return [rgb_r * 255, rgb_g * 255, rgb_b * 255] as const;
};

export const rgb2hsluv = (r: number, g: number, b: number) => {
  hsluv_instance.rgb_r = r/255;
  hsluv_instance.rgb_g = g/255;
  hsluv_instance.rgb_b = b/255;
};
 
// export const hsluv_rgb_round_trip = test({a: {eq}} => {
//   for (let i = 0; i < 10000; ++i) {
//     const random_rgb_color = Math.random() * ;
//     eq()
//   } 
// });

export const hsluv_space_demo = test(({l, lo}) => {
  l(hsluv2rgb(0,0,0));
  l(hsluv2rgb(100,50,50));
  l(hsluv2rgb(0,50,0));
  // establishing a proof of concept of the trick to use bg and fg color with half block glyph to cram two colors into a single character.
  l(colors.bg_red + colors.green + half_block + colors.bg_blue + colors.yellow + half_block + colors.reset);

  // horiz for hue and vertical for lightness
  l(Array.from({length: 101}, (_, j) => Array.from({length: 360}, (_,i) => {
    const even = i % 2 == 0;
    const rgb = hsluv2rgb(i, 75, j);
    if (even) {
      return colors.truecolor(...rgb);
    } else {
      return colors.truecolor_bg(...rgb) + half_block;
    }
  }).join('') + colors.bg_reset + colors.fg_reset).join('\n'));

  // vertical for saturation
  l(Array.from({length: 101}, (_, j) => Array.from({length: 360}, (_,i) => {
    const even = i % 2 == 0;
    const rgb = hsluv2rgb(i, j, 70);
    if (even) {
      return colors.truecolor(...rgb);
    } else {
      return colors.truecolor_bg(...rgb) + half_block;
    }
  }).join('') + colors.bg_reset + colors.fg_reset).join('\n'));
});
