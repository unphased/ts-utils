import { bgBlue, green, inverse, kvString, red } from "../utils.js"

// uses "unicode block elements" and such glyphs to render progress bars and other arbitrary time based division type stuff.

// lookup strings, low to high value
const full_block = '█'
const left_block = '▏▎▍▌▋▊▉█'
const bottom_block = '▁▂▃▄▅▆▇█'
export const half_block = '▌';

// low level bar rendering
export const renderHorizBar = (ratio: number, width = 5) => {

  // there is something nuanced here. There are 8 states of fill for a char

  // [ | | | | | | | ]
  //  0 1 2 3 4 5 6 7
  // 0       ^       1

  // This means the actual cutoff positions should be bisecting the positions of the divisions, so they should be at
  // the ratio positions 1/16, 3/16, 5/16, 7/16, 9/16, 11/16, 13/16, 15/16
  // In practice this is done by subtracting 1/16 from the input ratio

  const chars_width = Math.max(0, ratio * width - 1/16);
  const blocks = Math.floor(chars_width);
  const remaining = Math.ceil((chars_width - blocks) * 8);
  // console.error(kvString({ ratio, width, chars_width, blocks, remaining }));
  let so_far = full_block.repeat(blocks);
  if (so_far.length >= width) {
    return so_far;
  }
  so_far += (remaining > 0 ? left_block[remaining - 1] : ' ');
  if (so_far.length >= width) {
    return so_far;
  }
  return so_far + ' '.repeat(width - so_far.length);
}

// a bar that has definable fixed width for showing how much a scalar is above or below a given expected value
export const renderBarRatioComparisonLowerIsBetter = (actual: number, expectation: number, width: number, slop = 0.08) => {
  const ratio = actual / expectation;
  if (ratio < 1 - slop) {
    return bgBlue(green(renderHorizBar(ratio, width)));
  } 
  // the rest has ratio >= 1. Invert the ratio
  if (ratio < 1 + slop) {
    if (ratio > 1) {
      return bgBlue(inverse(renderHorizBar(1/ratio, width)));
    }
    return bgBlue(renderHorizBar(ratio, width));
  }
  return bgBlue(inverse(red(renderHorizBar(1/ratio, width))));
}

