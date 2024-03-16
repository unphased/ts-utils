import * as util from "util";
import { colors } from './terminal/colors.js';

export const emph_arrow = (color: string) => `${color}${colors.curly_underline}===>${colors.underline_reset}${colors.reset}\n`;

// this effectively also converts from win path.sep to unix ("/").
// Note, this code ideally I could figure out how to share... but I can't and it's duplicated in 2 more places:
// (1) client.ts (2) babel log plugin
export const pathShortName = (pth: string, pathSegments = 1) => {
  if (pth.match(/index\.ts$/)) {
    pathSegments++;
  }
  return (pth.split(/[/\\]/).slice(-pathSegments)).join('/');
}

// // a somewhat unorthodox experiment to add a way to call map with an async function without resulting in concurrent execution
// declare global {
//   interface Array<T> {
//     seqMap<R>(asyncFn: (item: T) => Promise<R>): Promise<R[]>;
//     uniq(): T[];
//     nullfilter(): NonNullable<T>[];
//   }
// }
//
// Object.defineProperty(Array.prototype, 'seqMap', {
//   value:

export async function seqMap<T, R>(x: T[], asyncFn: (item: T) => Promise<R>): Promise<R[]> {
  // dynamic type assertion
  if (typeof asyncFn !== 'function') {
    throw new TypeError('Argument must be async function');
  }

  const result: R[] = [];
  for (const item of x) {
    // try {
    // Apply the async function and wait for it
    const transformedItem = await asyncFn(item);
    result.push(transformedItem);
    // } catch (error) {
    //   // Handle errors gracefully
    //   console.error(`An error occurred while processing item: ${item}`);
    //   console.error(error);
    //   result.push(null as unknown as R);  // or however you wish to represent an error
    // }
  }
  return result;
}

// , enumerable: false
// });

export function uniq<T>(x: T[]): T[] {
  return [...new Set(x)];
}

// Object.defineProperty(Array.prototype, 'uniq', {
//   value: function<T>(this: T[]): T[] {
//     return [...new Set(this)];
//   },
//   enumerable: false
// });

export function nullfilter(x: Array<any>): any[] {
  return x.filter((e): e is NonNullable<typeof e> => !!e);
}

// Object.defineProperty(Array.prototype, 'nullfilter', {
//   value: nullfilter,
//   enumerable: false
// });

export const hrTimeMs = (hrTimeDelta: [number, number]) => hrTimeDelta[0] * 1000 + hrTimeDelta[1] / 1000000;

export const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

// first array needs to be one larger than second array. join into one array like zipping a zipper. First array becomes
// even indices. Final array length is always odd
export const zipper = (arr1: any[], arr2: any[]) => {
  const result: any[] = [];
  for (let i = 0; i < arr2.length; ++i) {
    result.push(arr1[i]);
    result.push(arr2[i]);
  }
  result.push(arr1[arr2.length]);
  return result;
};
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const format = (...x: any[]) => x.map(item => Buffer.isBuffer(item) ?
  colors.blue + item.toString('utf8') + colors.fg_reset :
  typeof item === 'string' ?
    item.includes('\x1b') ? item : colors.underline_green + colors.underline + item + colors.underline_reset
    : util.inspect(item, { depth: 7, colors: true })
).join(' ');
// TODO: Have a mode that uses git (???) to work out an initial heuristic to use for displaying the tests that have
// been touched in the last X hours. This is probably even more streamlined than providing a manual control around
// which tests to enable autorun for.
// TODO Also consider schlepping this ring buffer contents after a run of a test, into a test 'ephemeris' file. This can be
// pulled up on demand and great for sanity checking even passing tests alongside any logging.
// TODO reconcile pp with format()

// pretty print 1: single item, grey bg
export const pp = (x: any) => colors.dark_grey_bg + (Buffer.isBuffer(x) ? x.toString('utf8') : (typeof x === 'string' ? x : util.inspect(x, { colors: true, depth: Infinity, compact: true }))) + colors.bg_reset;
// pretty print 2: as above but colorize and show if escapes are present
export const pp2 = (x: any) => colors.dark_grey_bg + (Buffer.isBuffer(x) ? x.toString('utf8') :
  typeof x === 'string' ?
    x.includes('\x1b') ? util.inspect(x, {colors: true}) : x :
    util.inspect(x, { colors: true, depth: Infinity, compact: true })
) + colors.bg_reset;
export const red = (s: string) => colors.red + s + colors.fg_reset;
export const green = (s: string) => colors.green + s + colors.fg_reset;
export const bold = (s: string) => colors.bold + s + colors.bold_reset;
export const italic = (s: string) => colors.italic + s + colors.italic_reset;
export const underline = (s: string) => colors.underline + s + colors.underline_reset;
export const inverse = (s: string) => colors.reverse + s + colors.reverse_reset;
export const bgBlue = (s: string) => colors.bg_blue + s + colors.bg_reset;

export const lut = [1, 0.625, 0.390625, 0.245, 0.15, 0.1, 0.06, 0.03, 0.02, 0.01];

export function weightedAverageFromBackByLUT(values: number[]) {
  let sum_weighted = 0;
  let sum_weights = 0;
  for (let i = 0; i < Math.min(values.length, lut.length); i++) {
    const idx = values.length - i - 1;
    sum_weighted += values[idx] * lut[i];
    sum_weights += lut[i];
  }
  return sum_weighted / sum_weights;
}

export class Statistics {
  private data: number[];
  private cache: {
    mean?: number;
    variance?: number;
    standardDeviation?: number;
  };
  constructor(data: number[] = []) {
    this.data = data;
    this.cache = {};
  }
  public setData(data: number[]): void {
    this.data = data;
    this.cache = {}; // Clear cache when data changes
  }
  public getData(): number[] {
    return this.data;
  }
  public max(): number {
    if (this.data.length === 0) return 0;
    return Math.max(...this.data);
  }
  public mean(): number {
    if (this.cache.mean !== undefined) return this.cache.mean;

    if (this.data.length === 0) return 0;
    const sum = this.data.reduce((acc, val) => acc + val, 0);
    const meanValue = sum / this.data.length;
    this.cache.mean = meanValue; // Cache result
    return meanValue;
  }
  public variance(): number {
    if (this.cache.variance !== undefined) return this.cache.variance;

    const mean = this.mean();
    const varianceSum = this.data.reduce((acc, val) => acc + (val - mean) ** 2, 0);
    const varianceValue = varianceSum / this.data.length;
    this.cache.variance = varianceValue; // Cache result
    return varianceValue;
  }
  public standardDeviation(): number {
    if (this.cache.standardDeviation !== undefined) return this.cache.standardDeviation;

    const variance = this.variance();
    const stdDevValue = Math.sqrt(variance);
    this.cache.standardDeviation = stdDevValue; // Cache result
    return stdDevValue;
  }
}

type PickByValueTypes<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K]
};

export const groupBy = <T, P extends keyof PickByValueTypes<T, PropertyKey>>(
  arr: T[],
  prop: P
) => {
  const result: Record<PropertyKey, T[]> = {};
  arr.forEach(item => {
    const key = item[prop] as PropertyKey; // Trust that T[P] is a PropertyKey
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  });
  return result;
};

const mapObjectProps = <T, V>(obj: { [k: string]: T; }, cb: (k: keyof T, v: T) => V): V[] => {
  return Object.entries(obj).map(([k, v]) => cb(k as keyof T, v));
};

type EnumOrArray = { [key: string]: any; } | any[];
type ConvertEnumOrArrayToElement<T extends EnumOrArray> = T extends (infer U)[] ? U :
{ [K in keyof T]: K extends number ? never : T[K] }[keyof T]

function cartesian<T extends EnumOrArray[]>(...inputs: T):
{ [I in keyof T]: ConvertEnumOrArrayToElement<T[I]> }[] {
  const itemGroups: any[][] = inputs.map(input => {
    if (Array.isArray(input)) {
      return input; // Directly return if input is an array
    } else {
      // Only work with the enum's keys (names), then convert them to their numeric values
      const originalKeys = Object.keys(input).filter(key => isNaN(Number(key)));
      return originalKeys.map(key => input[key]);
    }
  });

  // Recursive function to generate combinations (remains unchanged)
  function generateCartesianProduct(groups: any[][], prefix: any[] = []): any[][] {
    if (!groups.length) return [prefix];
    const firstGroup = groups[0];
    const restGroups = groups.slice(1);

    let result: any[][] = [];

    firstGroup.forEach(item => {
      result = result.concat(generateCartesianProduct(restGroups, [...prefix, item]));
    });

    return result;
  }

  return generateCartesianProduct(itemGroups) as any;
}

