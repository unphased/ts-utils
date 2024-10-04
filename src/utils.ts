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

// a twist on util.inspect
const inspectShowFunctions = (...x: any[]) => x.map(item => 'unimplemented');
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

// TODO replace wholesale with simple-statistics
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
    return [...this.data]; // Return a copy of the data array
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

    if (this.data.length === 0) return 0;
    const mean = this.mean();
    const varianceSum = this.data.reduce((acc, val) => acc + (val - mean) ** 2, 0);
    const varianceValue = varianceSum / this.data.length;
    this.cache.variance = varianceValue; // Cache result
    return varianceValue;
  }
  public standardDeviation(): number {
    if (this.cache.standardDeviation !== undefined) return this.cache.standardDeviation;

    if (this.data.length === 0) return 0;
    const variance = this.variance();
    const stdDevValue = Math.sqrt(variance);
    this.cache.standardDeviation = stdDevValue; // Cache result
    return stdDevValue;
  }
}

export type VoidTakingMethodsOf<T> = {
  [P in keyof T]: T[P] extends () => unknown ? P : never;
}[keyof T];

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

export function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
}

export const mapObjectProps = <T, V>(obj: { [k: string]: T; }, cb: (k: string, v: T) => V, filter = (k, v) => k !== undefined): V[] => {
  let e = Object.entries(obj)
  if (filter) e = e.filter(([k, v]) => filter(k, v));
  return e.map(([k, v]) => cb(k, v));
};

// a bit like json but more readable
export const kvString = (x: { [k: PropertyKey]: any }) => mapObjectProps(x, (k, v) => `${k}=${v}`).join(' ');

// TODO make it use a deep equal
export const identical = <T>(a: T[]) => {
  const v0 = JSON.stringify(a[0]);
  return a.every((v) => JSON.stringify(v) === v0);
};

// thanks to @jcalz https://stackoverflow.com/questions/78169579/how-to-transfer-type-from-variadic-parameters-into-a-different-shape-in-the-retu?noredirect=1#comment137810613_78169579

type EnumOrArray = { [key: string]: any; } | any[];

type ConvertEnumOrArrayToElement<T extends EnumOrArray> = T extends readonly (infer U)[] ? U :
{ [K in keyof T]: K extends number ? never : T[K] }[keyof T]

type ConvertArrayToElementAndEnumToKey<T extends EnumOrArray> = T extends readonly (infer U)[] ? U :
// in here we can't just use keyof T in order to eliminate the number keys.
{ [K in keyof T]: K extends number ? never : K }[keyof T]

function enum_to_values<T extends { [key: string]: any }>(e: T): ConvertEnumOrArrayToElement<T>[] {
  return Object.keys(e).filter(k => isNaN(Number(k))).map(k => e[k]) as any;
}
function enum_to_keys<T extends { [key: string]: any }>(e: T): ConvertArrayToElementAndEnumToKey<T>[] {
  return Object.keys(e).filter(k => isNaN(Number(k))) as any;
}

// Recursive function to generate combinations
function recursivelyGenerateCartesianProduct(groups: any[][], prefix: any[] = []): any[][] {
  if (!groups.length) return [prefix];
  const firstGroup = groups[0];
  const restGroups = groups.slice(1);
  return firstGroup.flatMap(item => recursivelyGenerateCartesianProduct(restGroups, [...prefix, item]));
}

// only use on small cardinalities please. very computationally inefficient
export const cartesian_slow = <T extends EnumOrArray[]>(...inputs: T): { [I in keyof T]: ConvertArrayToElementAndEnumToKey<T[I]> }[] => recursivelyGenerateCartesianProduct(inputs.map(inp => Array.isArray(inp) ? inp : enum_to_keys(inp))) as any;

export const cartesian_enum_vals_slow = <T extends EnumOrArray[]>(...inputs: T): { [I in keyof T]: ConvertEnumOrArrayToElement<T[I]> }[] => recursivelyGenerateCartesianProduct(inputs.map(inp => Array.isArray(inp) ? inp : enum_to_values(inp))) as any;

const sanity_check = () => {
  enum Color {
    Red = 'red',
    Green = 'green',
    Blue = 'blue'
  }
  const x = enum_to_values(Color);
  const y = enum_to_keys(Color);
  enum ColorNum {
    Black, White
  }
  const xx = enum_to_values(ColorNum);
  const yy = enum_to_keys(ColorNum);
  const xy = recursivelyGenerateCartesianProduct([xx,yy, ['a','b','c']]);
  console.log('xxxyyy', x, y, xx, yy, xy);
  const z = cartesian_slow(Color, ColorNum, ['a','b','c'] as const);
  const zz = cartesian_enum_vals_slow(Color, ColorNum, ['a','b','c'] as const);
  console.log('cartesians', z, zz);

  // this works
  const size = ['S', 'M', 'L'];
  enum OtherColors {
    Black, White
  }
  const numbers = [1, 2];
  const combos = cartesian_slow(['r', 'g', 'b'] as const, numbers, size, OtherColors);

  // the following does work but types are screwed up (produces crazy weird type due to the "as const" declared array)
  const colsconst = ['r', 'g', 'b'] as const;
  // simplified utility
  type cc = ConvertEnumOrArrayToElement<typeof colsconst>;
  type ConvertToArrayElement<T> = T extends readonly (infer U)[] ? U : never;
  type ccc = ConvertToArrayElement<typeof colsconst>;
  const combos2 = cartesian_slow(colsconst, numbers, size, OtherColors);

  console.log('combos', combos)
  console.log('combos2', combos2)
}

export const cartesianAt = <T extends EnumOrArray[]>(inputs: T, i: number): { [I in keyof T]: ConvertArrayToElementAndEnumToKey<T[I]> } => {
  // for enums, yield their keys per usual preference
  const input_arrs = inputs.map(inp => Array.isArray(inp) ? inp : enum_to_keys(inp));
  const input_lens = input_arrs.map(arr => arr.length);
  // example [[a, b, c], [1, 2], [i, ii]]
  // ex input_lens [3, 2, 2]
  // cumulative product counts memoizes the count it takes to increment each group.
  // ex cum_prod_counts [2, 4]
  const cum_prod_counts: number[] = []; // = input_lens.slice(1).reduce((acc, len) => { acc.push((acc[acc.length - 1] ?? 1) * len); return acc; }, []);
  let mult = 1;
  for (let j = input_lens.length - 1; j > 0; j--) {
    mult *= input_lens[j];
    cum_prod_counts.push(mult);
  }
  // progressively modulo index walking backward in cpc
  const quots: number[] = [];
  let curi = i
  for (let j = cum_prod_counts.length - 1; j >= 0; j--) {
    const cpcj = cum_prod_counts[j];
    quots.push(Math.floor(curi / cpcj));
    curi %= cpcj;
  }
  quots.push(curi);
  const ret: any = [];
  const l = input_lens.length;
  for (let j = 0; j < l; j++) {
    ret[j] = input_arrs[j][quots[j]];
  }
  return ret;
}

// suppose you want to sample from some cart product, need the len to be able to do a uniform random sample on the set.
export const cartesianLen = <T extends EnumOrArray[]>(...inputs: T): number => {
  return inputs.reduce((acc, inp) => acc * (Array.isArray(inp) ? inp.length : enum_to_keys(inp).length), 1);
}

export const cartesianAll = <T extends EnumOrArray[]>(...inputs: T): { [I in keyof T]: ConvertArrayToElementAndEnumToKey<T[I]> }[] => {
  const len = cartesianLen(...inputs);
  console.error('len', len);
  const result: { [I in keyof T]: ConvertArrayToElementAndEnumToKey<T[I]> }[] = [];
  for (let i = 0; i < len; i++) {
    result.push(cartesianAt(inputs, i));
  }
  return result;
}

// there is still potentially a useful way to produce things like zips and cartesian products and whatever else out of infinite sequence generators, it changes the iteration pattern as well as cart product sequence order to a round robin kind of outward spiral. We can also think about incorporating finite sequences within those contexts where applicable.

// This is not going to be useful for the common case of the target function being a recursive function. we
// generally cannot modify recursive calls to inject memoization. Be warned.
export const memoized = <T extends any[], U>(fn: (...args: T) => U) => {
  const cache = new Map<string, U>();
  // let hits = 0
  return (...args: T): U => {
    // Determine the cache key
    // Use a special symbol for no arguments, otherwise serialize arguments for key. Being clever here since VOID_KEY
    // cannot be valid JSON, so it's safe to use it as a key for the void case.
    const key = args.length === 0 ? 'VOID_KEY' : (args.length === 1 && typeof args[0] !== 'object') ? args[0].toString() : JSON.stringify(args);
    if (cache.has(key)) {
      // hits++;
      // console.error('cache hit', fn.toString().slice(0,20), key, hits)
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    // console.error('cache size hits', cache.size, hits);
    return result;
  };
};

export const timed = <T extends any[], U>(fn: (...args: T) => U) => {
  return (...args: T): [U, string] => {
    const start = process.hrtime();
    const result = fn(...args);
    const end = process.hrtime(start);
    return [result, `${hrTimeMs(end)}ms`];
  };
}

export const timedMs = <T extends any[], U>(fn: (...args: T) => U) => {
  return (...args: T): [U, number] => {
    const start = process.hrtime();
    const result = fn(...args);
    const end = process.hrtime(start);
    return [result, hrTimeMs(end)];
  };
}

// debating if i should rename this to Drill or something.
export class Chainable<T> {
  private object: T;

  constructor(object: T) {
    this.object = object;
  }

  /* the R suffix indicates a notion of "raw" where it will not return a Chainable instance, just the thing inside
  (which is drilled down into the structure by however many levels were chained).
  */
  objR<K extends keyof T, V extends T[K]>(
    key: K,
    objToMerge?: V
  ) {
    const entry: Partial<T[K]> = this.object[key] || {};
    const merged = objToMerge ? { ...entry, ...objToMerge } : entry;
    this.object[key] = merged as Required<T>[K];
    return this.object[key] as Required<T>[K];
  }

  /** calling obj either gets the value of the key given, or when given an objToMerge, will merge that into (or set
   from nothing) into an object at that key.
   */
  obj<K extends keyof T, V extends T[K]>(
    key: K,
    objToMerge?: V
  ) {
    return new Chainable(this.objR(key, objToMerge));
  }

  arrR<K extends keyof T>(
    key: K,
    ...elements: NonNullable<T[K]> extends (infer R)[] ? R[] : never
  ) {
    if (!this.object[key] || !Array.isArray(this.object[key])) {
      this.object[key] = [] as T[K];
    }
    if (elements.length) {
      (this.object[key] as any).push(...elements);
    }
    return this.object[key];
  }

  /** specify an array to exist on this key, with any elements provided initialized or inserted in. Returning the
  array.
  */
  arr<K extends keyof T>(
    key: K,
    ...elements: NonNullable<T[K]> extends (infer R)[] ? R[] : never
  ) {
    return new Chainable(this.arrR(key, ...elements));
  }

  // specify an array to exist on this key, with an element provided at a specific index
  // arrSet<K extends keyof T, I extends number>(
  //   key: K,
  //   index: I,
  //   element: T[K] extends (infer R)[] ? R : never
  // ) {
  //   if (!this.object[key] || !Array.isArray(this.object[key])) {
  //     this.object[key] = [] as T[K];
  //   }
  //
  //   (this.object[key] as any)[index] = element;
  //   return new Chainable(this.object[key]);
  // }

  // unfortunately this way of chaining prevents native syntax since we have to stay in a chain of Chainable return
  // values. so sub is used to perform array indexing.
  
  /** raw form of sub
  */
  subR<I extends number>(index: I): T extends (infer U)[] ? U : never;
  subR<I extends number>(index: I, defaultValue: T extends (infer U)[] ? U : never): T extends (infer U)[] ? U : never;
  subR<I extends number>(index: I, defaultValue?: T extends (infer U)[] ? U : never): any {
    if (Array.isArray(this.object)) {
      if (this.object[index] === undefined) {
        this.object[index] = defaultValue;
      }
      return this.object[index];
    } else {
      throw new Error('Operation `sub` is not valid on non-array types.');
    }
  }

  /** retrieves the value at the index, optionally with a value to assign to it that will only be set if that slot is undefined.
  */
  sub<I extends number>(index: I): T extends (infer U)[] ? Chainable<U> : never;
  sub<I extends number>(index: I, defaultValue: T extends (infer U)[] ? U : never): T extends (infer U)[] ? Chainable<U> : never;
  sub<I extends number>(index: I, defaultValue?: T extends (infer U)[] ? U : never): any {
    return new Chainable(this.subR(index, defaultValue));
  }

  // subArrR<I extends number>(
  //   index: I,
  //   ...elements: T extends (infer R)[] ? R[] : never
  // ): any {
  //   if (!this.object[index] || !Array.isArray(this.object[index])) {
  //     this.object[index] = [];
  //   }
  //   this.object[index].push(...elements);
  //   return this.object[key];
  // }

  /** Method to access the encapsulated object, if direct manipulation or retrieval is necessary.
  */
  getRaw(): T {
    return this.object;
  }
}

export class Node<T> {
  constructor(public value: T, public prev: Node<T> | null = null, public next: Node<T> | null = null) {}
}

export class DoublyLinkedList<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;

  addToFront(value: T): Node<T> {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    return newNode;
  }

  moveToFront(node: Node<T>): void {
    if (node === this.head) return;
    this.remove(node);
    node.next = this.head;
    node.prev = null;
    if (this.head) this.head.prev = node;
    this.head = node;
    if (!this.tail) this.tail = node;
  }

  removeLast(): T | undefined {
    if (!this.tail) return undefined;
    const value = this.tail.value;
    this.remove(this.tail);
    return value;
  }

  remove(node: Node<T>): void {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (node === this.head) this.head = node.next;
    if (node === this.tail) this.tail = node.prev;
  }

  clear(): void {
    this.head = this.tail = null;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }
}

export function attemptNumberParse(value) {
  const type = typeof value;
  if (type !== 'number' && type !== 'string') {
    return value;
  }
  // if it is clearly parseable to a number, then make it one, otherwise leave it as-is (likely a string)
  const trimmed = value.trim();
  const number = Number(trimmed);
  const trailing_leading_zeros_cleaned = trimmed.replace(/\.\d*(0+)$/)
  if (number.toString() === trimmed) {}
}

