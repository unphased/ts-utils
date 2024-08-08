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
  hsluv_instance.rgbToHsluv();
  const {hsluv_h: h, hsluv_s: s, hsluv_l: l} = hsluv_instance;
  return [h, s, l] as const;
};
 
export const hsluv_rgb_round_trip = test(({a: {eqE}}) => {
  for (let i = 0; i < 10000; ++i) {
    const [r, g, b] = Array.from({length: 3}, _ => Math.random() * 255);
    const [rr, gg, bb] = hsluv2rgb(...rgb2hsluv(r, g, b));
    eqE(r, rr, 1e-10); // seems like 1e-10 is as good as we can expect
    eqE(g, gg, 1e-10);
    eqE(b, bb, 1e-10);
  } 
});

export const hsluv_space_demo = test(({l, lo, a: {eqO}}) => {
  eqO(hsluv2rgb(100,50,50), [112.08375883742715, 123.77985010235344, 81.94029770580472]);
  // establishing a proof of concept of the trick to use bg and fg color with half block glyph to cram two colors into a single character.
  l(colors.bg_red + colors.green + half_block + colors.bg_blue + colors.yellow + half_block + colors.reset);

  // horiz for hue and vertical for lightness
  l(Array.from({length: 101}, (_, j) => Array.from({length: 360}, (_,i) => {
    const even = i % 2 == 0;
    const rgb = hsluv2rgb(i, 100, j);
    if (even) {
      return colors.truecolor(...rgb);
    } else {
      return colors.truecolor_bg(...rgb) + half_block;
    }
  }).join('') + colors.bg_reset + colors.fg_reset).join('\n'));

  // vertical for saturation
  l(Array.from({length: 101}, (_, j) => Array.from({length: 360}, (_,i) => {
    const even = i % 2 == 0;
    const rgb = hsluv2rgb(i, j, 75);
    if (even) {
      return colors.truecolor(...rgb);
    } else {
      return colors.truecolor_bg(...rgb) + half_block;
    }
  }).join('') + colors.bg_reset + colors.fg_reset).join('\n'));
});

export const hsluv_small_hue_palette_and_rotation = test(({t, l, a: {eq}}) => {
  t('exemptFromAsserting');
  const NUM = 6;
  const HUE_ROTATE_INTVL = 12;
  l('hues:', Array.from({length: Math.floor(360/NUM/HUE_ROTATE_INTVL)}, (_, j) => Array.from({length: NUM}, (_, i) => 360/NUM * i + j * HUE_ROTATE_INTVL)));
  l('\n' + Array.from({length: Math.floor(360/NUM/HUE_ROTATE_INTVL)}, (_, j) => Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i + j * HUE_ROTATE_INTVL, 100, 75)) + '    ').join('')).join(colors.bg_reset + '\n') + colors.bg_reset);
});

export const hsluv_palette_and_variant_spaces = test(({t, l}) => {
  t('exemptFromAsserting');
  const NUM = 5;
  
  l('light going down')
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 100, 85)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 100, 80)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 100, 75)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 100, 70)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 100, 65)) + '    ').join('') + colors.bg_reset);

  l('sat going down')
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 100, 75)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 80, 75)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 60, 75)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 50, 75)) + '    ').join('') + colors.bg_reset);

  l('sat up light up (this looks the best to me)')
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 65, 60)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 70, 65)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 80, 70)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 90, 75)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 97, 78)) + '    ').join('') + colors.bg_reset);

  l('sat down light up');
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 100, 65)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 90, 70)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 80, 75)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 70, 80)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 60, 85)) + '    ').join('') + colors.bg_reset);

  l('sat down light down different pairing')
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 100, 75)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 90, 70)) + '    ').join('') + colors.bg_reset);
  l(Array.from({length: NUM}, (_, i) => colors.truecolor_bg(...hsluv2rgb(360/NUM * i, 80, 65)) + '    ').join('') + colors.bg_reset);

  // in summary, this approach is not bad at all for generating palettes out of thin air, but some zones in the hue distribution are problematic at certain other levels in this colorspace, the most salient issue is cyan. I may introduce a hack to modify this color space because it is otherwise really beautiful.
});

const NUM_COLORS = 10;
const COLOR_GAP = 1;
const HUE_OFFSET_DEG = -50;
export const rainbow_hsluv = Array.from({length: NUM_COLORS}, (_, i) => hsluv2rgb((360 * i / (NUM_COLORS + COLOR_GAP) + HUE_OFFSET_DEG + 360) % 360, 100, 70)).reverse();

export const rainbow_palette = test(({t, l}) => {
  t('exemptFromAsserting');
  l(rainbow_hsluv.map(c => colors.truecolor_bg(...c) + '   ').join('') + colors.bg_reset);
});
