import { LaunchTests, test } from 'tst';
import { fileURLToPath } from 'url';
import { cartesian_slow, cartesian_enum_vals_slow, cartesianAt, cartesianAll, identical, memoized, timed, Statistics, pick, LRUCache } from '../utils.js';
import { format } from "../node/format.js";
import { colors } from '../terminal.js';
import { Chainable } from 'ts-utils';

// this tests/index.ts body is generally for testing stuff from utils. For simplicity, has the entry point for testing and re-export of other deps using tests at the bottom.

export const cartesian_simple = test(({l, a:{eq}}) => {
  const size = ['S', 'M', 'L'];
  enum OtherColors {
    Black, White
  }
  const numbers = [1, 2];
  const combos = cartesian_slow(['r', 'g', 'b'] as const, numbers, size, OtherColors);
  const combovs = cartesian_enum_vals_slow(['r', 'g', 'b'] as const, numbers, size, OtherColors);
  l('a', combos);
  l('b', combovs);
  eq(combos.length, 36);
  eq(combos.length, combovs.length);

  enum Color {
    Red = 'red',
    Green = 'green',
    Blue = 'blue'
  }

  enum Size {
    Small = 1,
    Medium = 10,
    Large = 100
  }
  const combos2 = cartesian_slow(Color, numbers, Size);
  l(combos2);
  eq(combos2.length, 18);
});

// generators as items to use in a list, which is hardly surprising if closures work!
// TODO: a generator cartesian which takes both generators and lists and produces a generator that enumerates the
// cartesian lazily

// i should delete this, it's pretty useless (generating cart prod from generators in general...)
export const cartesian_via_generator_playground = test(({l, t, a:{eqO}}) => {
  t('exemptFromAsserting', true);
  /*
   streaming cartesian product elements uses less memory ...
  */
  const generator = cartesianProductSimplified(['a', 'b'], [1, 2, 3, 4], ['x', 'y', 'z']);
  /* prints
    [ 'a', 1, 'x' ]
    [ 'a', 1, 'y' ]
    [ 'a', 1, 'z' ]
    [ 'a', 2, 'x' ]
    [ 'a', 2, 'y' ]
    [ 'a', 2, 'z' ]
    [ 'a', 3, 'x' ]
    [ 'a', 3, 'y' ]
    [ 'a', 3, 'z' ]
    [ 'a', 4, 'x' ]
    [ 'a', 4, 'y' ]
    [ 'a', 4, 'z' ]
    [ 'b', 1, 'x' ]
    [ 'b', 1, 'y' ]
    [ 'b', 1, 'z' ]
    [ 'b', 2, 'x' ]
    [ 'b', 2, 'y' ]
    [ 'b', 2, 'z' ]
    [ 'b', 3, 'x' ]
    [ 'b', 3, 'y' ]
    [ 'b', 3, 'z' ]
    [ 'b', 4, 'x' ]
    [ 'b', 4, 'y' ]
    [ 'b', 4, 'z' ]
  */
  printValues(generator);

  // helper function to print all values from a generator function
  function printValues(generator) {
    let iteration = null;
    while (iteration = generator.next()) {
      if (iteration.done === true) {
        break;
      }
      l(iteration.value);
    }
  }

  // helper function to construct the arguments array for the 'cartesianProduct' class
  function cartesianProductSimplified(...arrays) {
    let args = [];
    for (let i = 1; i < arrays.length; i++) {
      args = args.concat([cartesianProduct, arrays[i]]);
    }
    args.splice(0, 0, arrays[0]);
    return cartesianProduct(...args);
  }

  /*
   call it like this:

   cartesianProduct(['a', 'b'], cartesianProduct, [1, 2, 3, 4], cartesianProduct, ['x', 'y', 'z']);

   use cartesianProductSimplified to simplify it:

   cartesianProductSimplified(['a', 'b'], [1, 2, 3, 4], ['x', 'y', 'z'])
  */
  function* cartesianProduct(values, generator, ...generatorArgs) {
    l('args to cartesianProduct', values, generator, generatorArgs);
    for (const value of values) {
      if (generator) {
        const iterator = generator(...generatorArgs);
        let iteration = null;
        while (iteration = iterator.next()) {
          if (iteration.done === true) {
            break;
          }
          yield [value, ...iteration.value];
        }
      } else {
        yield [value];
      }
    }
  }
});

enum A {a, b, c}
enum B {x, y, z}
export const cartesian_analytical = test(({l, a:{eqO}}) => {
  eqO(cartesianAll(A, B), [
    ['a', 'x'],
    ['a', 'y'],
    ['a', 'z'],
    ['b', 'x'],
    ['b', 'y'],
    ['b', 'z'],
    ['c', 'x'],
    ['c', 'y'],
    ['c', 'z']
  ]);
});

export const cartesian_analytical_2 = test(({l, a:{eq}}) => {
  const a = cartesianAll(['x', 'y', 'z', 'w'], A, [1, 2]);
  l(a);
  eq(a.length, 24);
  const b = cartesianAll(A, ['x', 'y', 'z', 'w'], [1, 2]);
  l(b);
  eq(b.length, 24);
});

export const cartesian_with_funs = test(({l, a:{eq, eqO}}) => {
  const methods = [
    (x: number) => x + 1,
    (x: number) => x * 2,
    (x: number) => x / 3
  ];

  const combos = cartesian_slow(methods, methods, [100, 200, 300, 400] as const);
  const combos_a = cartesianAll(methods, methods, [100, 200, 300, 400] as const);
  eqO(combos, combos_a);
  l(combos.map(([f, g, x]) => f(g(x))));
  eq(combos.length, 36);
});

export const cartesian_with_gens = test(({l, a:{eqO}}) => {
  const gens = [
    function*() { yield 1; yield 2; yield 3; },
    function*() { yield 4; yield 5; yield 6; },
  ];
  const combos = cartesian_slow(gens, ['a', 'b', 'c'] as const);
  const combos_a = cartesianAll(gens, ['a', 'b', 'c'] as const);
  eqO(combos, combos_a);
  const evald = combos.map(([g, x]) => Array.from(g()).map(y => x.repeat(y)));
  l(evald);
  eqO(evald, [[1,2,3],[4,5,6]].flatMap(nums => nums.map((num, ni) => nums.map(n2 => 'abc'[ni].repeat(n2)))));
});

export const cartesian_with_ones = test(({l, a:{eqO}}) => {
  // sanity check for one-length sets to be treated properly
  const combos = cartesian_slow([1], A, [3]);
  const combos_a = cartesianAll([1], A, [3]);
  eqO(combos, combos_a);
  l(combos);
});

// this one might be a little bit volatile when runtimes can implement util.inspect in any way, but we can adjust it
// later if that becomes relevant.
export const format_sanity = test('format', ({l, a:{eqO}}) => {
  const a = [1, 'x'];
  const sq = (x: number) => x ** 2;
  function dbl(x: number) { return x * 2; }
  eqO(format(a, sq, dbl), `[ ${colors.yellow + '1' + colors.fg_reset}, ${colors.green + "'x'" + colors.fg_reset} ] (x) => x ** 2 function dbl(x) {\n    return x * 2;\n  }`);
});

export const identical_simple = test(({l, a:{is}}) => {
  is(identical([1, 1, 1]));
  is(!identical([1, 1, 2]));
  is(identical([[1, 1, 1], [1, 1, 1]]));
  is(!identical([[1, 1, 1], [1, 1, 2]]));
});

export const memoized_void_fn_with_random_values = test('memoize', ({l, a:{eq, eqO, neO}}) => {
  const random_maker = () => Array.from({length: 100}, () => Math.random());
  neO(random_maker(), random_maker());
  const memo_random = memoized(random_maker);
  eqO(memo_random(), memo_random());
  eq(memo_random(), memo_random()); // also should be referentially equal due to memoization
});

// TODO when i can think up of a good example of an expensive function that is worth memoizing but isnt recursive i
// will make another test for memoization

export const memoizer_check_via_prime_computation = test('memoize', ({l, a:{eq, eqO, neO}}) => {
  // define simple prime checking methods
  const is_prime = (n: number) => {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i+=2) {
      if (n % i === 0) return false;
    }
    return true;
  }
  // sanity check on simple sieve
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43];

  for (let i = 1; i < 47; i++) {
    eq(is_prime(i), primes.includes(i), i);
  }

  const is_prime_memo = memoized(is_prime);

  const primes_under = (n: number, cached = false) => {
    const primes = [];
    for (let i = 2; i < n; i++) {
      if ((cached ? is_prime_memo : is_prime)(i)) primes.push(i);
    }
    return primes;
  }

  l('first listing prime checks arent memoized:', timed(primes_under)(1000000, true));
  l('second listing prime checks are memoized:', timed(primes_under)(1000000, true));
  l('third listing prime checks are memoized (faster from cache?):', timed(primes_under)(1000000, true));

  const primes_under_memo = memoized(primes_under);
  l('same as above but this run will save the value', timed(primes_under_memo)(1000000, true));
  l('and this retrieves that value instantly', timed(primes_under_memo)(1000000, true));

  // The above seems smart but it's really not. the memoization HOF is far from being powerful enough to do actually
  // intelligent things. Also this is still trial division which is inferior to all sieves for prime enumeration.
  function actual_good_primes_under(n: number) {
    const primes = [2, 3]; // mutable array tracking primes seen so far. start with a better base case
    const prime = (n: number) => { // sieve leverages same prime list as we generate them
      const sqrt = Math.sqrt(n);
      for (let i = 1; primes[i] <= sqrt; i++) {
        if (n % primes[i] === 0) return false;
      }
      return true;
    }
    for (let i = 5; i < n; i+=2) {
      if (prime(i)) primes.push(i);
    }
    return primes;
  }
  eqO(primes_under(100000, true), actual_good_primes_under(100000));
  l('smart prime listing 1:', timed(actual_good_primes_under)(1000000));

});

import { renderHorizBar, renderBarRatioComparisonLowerIsBetter } from '../terminal/precision-bars.js';
import { lexAnsi } from '../terminal/ansi-parse.js';

export const visual_check_comparison = test('terminal precision bar rendering', ({ t, l, a: { eq } }) => {
  t('exemptFromAsserting', true);
  const WIDTH = 20;
  for (let i = 1; i <= 200; i *= 1.05) {
    const r = renderBarRatioComparisonLowerIsBetter(i, 10, WIDTH);
    const ansi = lexAnsi(r);
    l(r, i/10);
    eq(ansi.cleaned.length, 1);
    eq(ansi.cleaned[0].length, WIDTH);
  }
});

export const visual_check = test('terminal precision bar rendering', ({ t, l, a: { eq } }) => {
  t('exemptFromAsserting', true);
  l(renderHorizBar(0.5, 10) + '<<<');
  l(renderHorizBar(0.5, 5) + '<<<');
  for(let i = 0; i <= 10; i += 1/8) {
    const r = renderHorizBar(i/10, 10);
    l(r + '<<<', i);
    eq(r.length, 10, 'length of bar');
  }
  for (let i = 0; i <= 50; i += 1) {
    const r = renderHorizBar(i/50, 3)
    l(r + '<<<', i);
    eq(r.length, 3, 'length of bar');
  }
})

// there are 9 possible levels showable with a single bar. the bar comes in 8 states of fill, so there is a 9th first state
// representing 0. however if we have 3 chars for example, that makes for 25 states and not 27 states.
export const aliasing_check = test('terminal precision bar rendering', ({t, l, a: {eq}}) => {
  const bars = '▏▎▍▌▋▊▉█';
  eq(renderHorizBar(0, 1), ' ');
  eq(renderHorizBar(0.000001, 1), ' ');
  eq(renderHorizBar(1/16 - 0.000001, 1), ' ');
  eq(renderHorizBar(1/16 + 0.000001, 1), bars[0]);
  eq(renderHorizBar(3/16 - 0.000001, 1), bars[0]);
  eq(renderHorizBar(3/16 + 0.000001, 1), bars[1]);

  eq(renderHorizBar(11/16 - 0.000001, 1), bars[4]);
  eq(renderHorizBar(11/16 + 0.000001, 1), bars[5]);

  eq(renderHorizBar(1/32 - 0.000001, 2), '  ');
  eq(renderHorizBar(1/32 + 0.000001, 2), bars[0] + ' ');
});

export const plot_test = test('plot', ({plot}) => {
  plot('uplot', [{
    title: 'a',
    y_axes: ['y'],
    data: [[1, 2, 3, 4], [1, 4, 9, 16]]
  }]);
});

export const bootstrap_array_experiment2_test = test('object chaining', ({ l, a: { eqO } }) => {
  // confirm we can directly use the helpers to flexibly populate complex structures to a suitable degree of precision
  type Type2 = {
    a?: {
      aa?: number;
      b: {
        c: number;
      }[];
    }[];
  };

  type Type3 = {
    z?: {
      y: number[];
    };
    x?: {
      w: Type2;
    };
  };

  const z = new Chainable<Type3>({});

  // z.obj('x').obj('w').arr('a', { b: [], aa: 1 })[0].b.push({ c: 1 });
  // const x = z.obj('x').obj('w').arr('a', { b: [], aa: 1 }).sub(0).arr('b', { c: 1 });
  const x = z.obj('x').obj('w').arr('a', { b: [], aa: 1 }).sub(0).arr('b', { c: 1 });
  l('z', z);
  eqO(z.getRaw(), {
    x: {
      w: {
        a: [{ b: [{ c: 1 }], aa: 1 }]
      }
    }
  });

  const y = new Chainable({ a: [] });
  y.arr('a', 1, { z: 'z' }, 3).sub(1).obj('bb b b b b b', { c: 1 });
  l('y', y);
});

export const simple_array_chainable = test('object chaining', ({ l, a: {eqO}}) => {
  const x = new Chainable<{arr?: (number | string | { hmmm?: any[] })[]}>({});
  x.arr('arr', 1, 2, {}, 4, 'abc').sub(2).arr('hmmm');
  eqO(x.getRaw(), { arr: [1, 2, { hmmm: [] }, 4, 'abc'] } as any);

  const y = new Chainable<{ a?: any[] }>({});
  l('uh', y.arr('a', 'aa', 'bb').sub(1).getRaw());
  l('y', y.getRaw());
  // eqO(y.getRaw(), { a: [undefined, { p: { z: 'a' } }] });
});
export const chainable_exhaustive_manual = test('object chaining', ({ l, a: {eqO}}) => {
  // [0]: spec, [1]: cb that takes obj starting state to evaluate the chain, we are validating the side effects,
  // [2]: optional value to validate against the return of the chain.
  const subtests = [
    [{a: []}, (o) => new Chainable(o).arr('a').getRaw(), []],
    [{a: [1]}, (o) => new Chainable(o).arr('a', 1).getRaw(), [1]],
    [{a: [1]}, (o) => new Chainable(o).arr('a', 1).subR(0), 1],
    [{a: [1, 2]}, (o) => new Chainable(o).arr('a', 1, 2).getRaw(), [1, 2]],
    [{a: [1, 2, 3]}, (o) => new Chainable(o).arrR('a', 1, 2, 3), [1, 2, 3]],
    [{a: {}}, o => new Chainable(o).objR('a'), {}],
    [{b: {a: 'c'}}, o => new Chainable(o).objR('b')['a'] = 'c', 'c'],
    [{b: {a: 'c'}}, o => { const x = new Chainable(o).objR('b'); x['a'] = 'c'; return x; }, { a: 'c' }],
    [{c: [0]}, o => new Chainable(o).arr('c', 0).subR(0), 0],
    [{c: [1]}, o => new Chainable(o).arr('c', 1).subR(0), 1],
    [{c: [,,2]}, o => new Chainable(o).arrR('c')[2] = 2, 2],
    [{d: [0], e: [1]}, o => { const x = new Chainable(o); x.arr('d', 0); return x.arrR('e', 1) }, [1]],
    [{d: [0, 1, 2]}, o => new Chainable(o).arrR('d', 0, 1, 2).map(e => 9 - e), [9, 8, 7]],

    [{d: [{}, {a: {x: 'x'}}, {}]}, o => new Chainable(o).arr('d', {}, {}, {}).sub(1).objR('a').x = 'x', 'x'],
    [{d: [{}, {a: 'a'}]}, o => new Chainable(o).arr('d', {}, {}).subR(1).a = 'a', 'a'],


    // [{e: [['abc', 'def'], [1, 2, 3, 4], [99, 98, 97]]}, o => {
    //   const x = new Chainable(o).arr('e');
    //   // x.sub(0).('abc', 'def');
    // }]

  ];
  const check = <T, S>(a: [T, ({}) => S, S]) => {
    const init = {};
    const ret = a[1](init);
    eqO(a[0], init);
    if (a[2] !== undefined) {
      eqO(a[2], ret);
    }
  }
  l(subtests.map(check));
});

export const chainable_exhaustive_arr = test('object chaining', ({ l, a: {eqO}}) => {
  const Ch = (x) => new Chainable(x);
  const spl = (x) => x.split('');
  const subtests = [
    [[1], o => Ch(o).subR(0, 1), 1],
    [[, 1], o => Ch(o).subR(1, 1), 1],
    [[, {}], o => Ch(o).subR(1, {}), {}],
    [[, {a: 'a'}], o => Ch(o).subR(1, {}).a = 'a'],
    [[, {a: [1,2, { 'three': 3 }]}], o => Ch(o).sub(1, {}).arr('a', 1, 2).sub(2, { 'three': 3 })],
    [[, {a: [1,2, { 'four': 4 }]}], o => Ch(o).sub(1, {}).arr('a', 1, 2).subR(2, {}).four = 4],
    [[,,{refl: [,,spl('bar')]},{vel: [, 'v'], refl: [,spl('foo')]}], o => {
      const c = Ch(o);
      c.sub(3, {}).arr('refl').subR(1, ['f','o','o']);
      c.sub(3, {}).arr('vel').subR(1, 'v');
      c.sub(2, {}).arr('refl').subR(2, ['b','a','r']);
    }]
  ];
  const check = <T, S>(a: [T, ([]) => S, S]) => {
    const init = [];
    const ret = a[1](init);
    eqO(a[0], init);
    if (a[2] !== undefined) {
      eqO(ret, a[2]);
    }
  }
  l(subtests.map(check));
});

export const time_rendering_for_date_picker = test('date', ({t, l, a: {eq}}) => {
  const d = new Date();
  function toDateInputValue(dateObject: Date){
    const local = new Date(dateObject);
    local.setMinutes(dateObject.getMinutes() - dateObject.getTimezoneOffset());
    return local.toJSON().slice(0,16);
  }

  l(d, toDateInputValue(d));
  eq(d.toISOString().slice(13, 16), toDateInputValue(d).slice(13)); // chceks the minutes lines up as that's all that's guaranteed
});

export const statistics_class_tests = test('Statistics class', ({l, a: {eq, eqO}}) => {
  const stats = new Statistics([1, 2, 3, 4, 5]);

  // Test mean
  eq(stats.mean(), 3);

  // Test variance
  eq(Math.abs(stats.variance() - 2) < 0.0001, true);

  // Test standard deviation
  eq(Math.abs(stats.standardDeviation() - Math.sqrt(2)) < 0.0001, true);

  // Test max
  eq(stats.max(), 5);

  // Test with empty data
  const emptyStats = new Statistics();
  eq(emptyStats.mean(), 0);
  eq(emptyStats.variance(), 0);
  eq(emptyStats.standardDeviation(), 0);
  eq(emptyStats.max(), 0);

  // Test setData and getData
  stats.setData([10, 20, 30, 40, 50]);
  eq(stats.mean(), 30);
  eqO(stats.getData(), [10, 20, 30, 40, 50]);

  // Test caching
  const cachedStats = new Statistics([2, 4, 6, 8, 10]);
  eq(cachedStats.mean(), 6);
  eq(cachedStats.mean(), 6); // Should use cached value
  cachedStats.setData([1, 3, 5, 7, 9]);
  eq(cachedStats.mean(), 5); // Should recalculate
});

export * from '../color/math.js';
export * from './test_minimatch_regex.js';

export const chainable_tests = test('Chainable class', ({l, a: {eqO}}) => {
  const chain = new Chainable({});
  
  // Test obj method
  chain.obj('user', {name: 'John'});
  eqO(chain.getRaw(), {user: {name: 'John'}});

  // Test arr method
  chain.obj('user').arr('hobbies', 'reading', 'cycling');
  eqO(chain.getRaw(), {user: {name: 'John', hobbies: ['reading', 'cycling']}});

  // Test sub method
  chain.obj('user').arr('hobbies').sub(1, 'swimming'); // 2nd arg to sub is a defaultvalue, and will not override here.
  eqO(chain.getRaw(), {user: {name: 'John', hobbies: ['reading', 'cycling']}});

  // Test objR method
  const userObj = chain.objR('user');
  eqO(userObj, {name: 'John', hobbies: ['reading', 'cycling']});

  // Test arrR method
  const hobbiesArr = chain.obj('user').arrR('hobbies');
  eqO(hobbiesArr, ['reading', 'cycling']);
});

export const pick_tests = test('pick function', ({l, a: {eqO, eq}}) => {
  // Test case 1: Basic object with various types
  const obj1 = { a: 1, b: 'string', c: true, d: [1, 2, 3], e: { nested: 'object' }, f: null, g: undefined };
  
  eqO(pick(obj1, 'a', 'c', 'd'), { a: 1, c: true, d: [1, 2, 3] });
  eqO(pick(obj1, 'b', 'e'), { b: 'string', e: { nested: 'object' } });
  eqO(pick(obj1, 'f', 'g'), { f: null, g: undefined });

  // Test case 2: Empty object
  const obj2 = {};
  eqO(pick(obj2, 'a' as any, 'b' as any), {});

  // Test case 3: Object with Symbol keys
  const symbol1 = Symbol('sym1');
  const symbol2 = Symbol('sym2');
  const obj3 = { [symbol1]: 'symbol value', [symbol2]: 42, normalKey: 'normal value' };
  
  eqO(pick(obj3, symbol1 as any, 'normalKey'), { [symbol1]: 'symbol value', normalKey: 'normal value' });

  // Test case 4: Picking non-existent keys
  const obj4 = { a: 1, b: 2 };
  eqO(pick(obj4, 'a', 'c', 'd'), { a: 1 });

  // Test case 5: Picking from object with inherited properties
  const proto = { inheritedProp: 'inherited' };
  const obj5 = Object.create(proto);
  obj5.ownProp = 'own';
  
  eqO(pick(obj5, 'ownProp', 'inheritedProp'), { ownProp: 'own' });

  // Test case 6: Picking with duplicate keys
  const obj6 = { a: 1, b: 2, c: 3 };
  eqO(pick(obj6, 'a', 'b', 'a', 'c', 'b'), { a: 1, b: 2, c: 3 });

  // Test case 7: Performance test for large objects
  const largeObj = {};
  for (let i = 0; i < 10000; i++) {
    largeObj[`key${i}`] = i;
  }
  const start = performance.now();
  const pickedLarge = pick(largeObj, 'key0', 'key9999');
  const end = performance.now();
  
  eqO(pickedLarge, { key0: 0, key9999: 9999 });
  eq(Object.keys(pickedLarge).length, 2);
  l(`Performance test took ${end - start} ms`);

  // Test case 8: Picking no properties
  eqO(pick(obj1), {});

  // Test case 9: Picking all properties
  eqO(pick(obj1, 'a', 'b', 'c', 'd', 'e', 'f', 'g'), obj1);
});

export const LRUCache_01 = test('LRUCache', ({l, a: {eq}}) => {
  // Test 1: Basic functionality
  const cache = new LRUCache<string, number>(3);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);

  eq(cache.get("a"), 1, "Should retrieve correct value for 'a'");
  eq(cache.get("b"), 2, "Should retrieve correct value for 'b'");
  eq(cache.get("c"), 3, "Should retrieve correct value for 'c'");
  eq(cache.size(), 3, "Cache size should be 3");
});

export const LRUCache_02 = test('LRUCache', ({l, a: {eq}}) => {
  // Test 2: Eviction of least recently used item
  const cache = new LRUCache<string, number>(3);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);
  cache.put("d", 4);

  eq(cache.get("a"), undefined, "'a' should have been evicted");
  eq(cache.get("d"), 4, "'d' should be in the cache");
  eq(cache.size(), 3, "Cache size should still be 3");
});

export const LRUCache_03 = test('LRUCache', ({l, a: {eq}}) => {
  // Test 3: Updating existing key
  const cache = new LRUCache<string, number>(3);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);
  cache.put("a", 4);

  eq(cache.get("a"), 4, "'a' should be updated to 4");
  eq(cache.size(), 3, "Cache size should still be 3");
});

export const LRUCache_04 = test('LRUCache', ({l, a: {eq}}) => {
  // Test 4: Get updates order
  const cache = new LRUCache<string, number>(3);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);
  cache.get("a");
  cache.put("d", 4);

  eq(cache.get("b"), undefined, "'b' should have been evicted");
  eq(cache.get("a"), 1, "'a' should still be in the cache");
});

export const LRUCache_05 = test('LRUCache', ({l, a: {eq}}) => {
  // Test 5: Delete functionality
  const cache = new LRUCache<string, number>(3);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);

  eq(cache.delete("b"), true, "Delete should return true for existing key");
  eq(cache.get("b"), undefined, "'b' should no longer be in the cache");
  eq(cache.size(), 2, "Cache size should be 2 after deletion");
  eq(cache.delete("d"), false, "Delete should return false for non-existing key");
});

export const LRUCache_06 = test('LRUCache', ({l, a: {eq}}) => {
  // Test 6: Clear functionality
  const cache = new LRUCache<string, number>(3);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.clear();

  eq(cache.size(), 0, "Cache should be empty after clear");
  eq(cache.get("a"), undefined, "All items should be removed after clear");
});

export const LRUCache_07 = test('LRUCache', ({l, a: {eq}}) => {
  // Test 7: Handling of capacity 0
  const cache = new LRUCache<string, number>(0);
  cache.put("a", 1);

  eq(cache.size(), 0, "Cache with capacity 0 should always be empty");
  eq(cache.get("a"), undefined, "Cache with capacity 0 should not store items");
});

export const LRUCache_08 = test('LRUCache', ({l, a: {eq, is}}) => {
  // Test 8: Entries method
  const cache = new LRUCache<string, number>(3);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);

  const entries = cache.entries();
  eq(entries.length, 3, "Entries should return all items");
  is(entries.some(([k, v]) => k === "a" && v === 1), "Entries should contain ['a', 1]");
  is(entries.some(([k, v]) => k === "b" && v === 2), "Entries should contain ['b', 2]");
  is(entries.some(([k, v]) => k === "c" && v === 3), "Entries should contain ['c', 3]");
});

export const LRUCache_09 = test('LRUCache', ({l, a: {eq}}) => {
  // Test 9: Large capacity
  const cache = new LRUCache<number, number>(1000);
  for (let i = 0; i < 1000; i++) {
    cache.put(i, i * 2);
  }
  eq(cache.size(), 1000, "Cache should be full");
  eq(cache.get(500), 1000, "Should retrieve correct value");
  cache.put(1000, 2000);
  eq(cache.get(0), undefined, "Least recently used item should be evicted");
  eq(cache.get(1), 2, "Second item should still be present");
});

export const LRUCache_10 = test('LRUCache', ({l, a: {eq, is}}) => {
  // Test 10: Random operations
  const cache = new LRUCache<number, number>(100);
  const operations = 10000;
  let putCount = 0, getCount = 0, deleteCount = 0;

  for (let i = 0; i < operations; i++) {
    const op = Math.floor(Math.random() * 3);
    const key = Math.floor(Math.random() * 200);
    
    if (op === 0) {
      cache.put(key, i);
      putCount++;
    } else if (op === 1) {
      cache.get(key);
      getCount++;
    } else {
      cache.delete(key);
      deleteCount++;
    }
  }

  is(cache.size() <= 100, "Cache size should not exceed capacity");
  l(`Put: ${putCount}, Get: ${getCount}, Delete: ${deleteCount}`);
});

export const LRUCache_11 = test('LRUCache', ({l, a: {eq}}) => {
  // Test 11: Edge cases
  const cache1 = new LRUCache<string, number>(1);
  cache1.put("key1", 1);
  cache1.put("key2", 2);
  eq(cache1.get("key1"), undefined, "First key should be evicted");
  eq(cache1.get("key2"), 2, "Second key should be present");

  const zeroCache = new LRUCache<string, number>(0);
  zeroCache.put("key", 1);
  eq(zeroCache.size(), 0, "Zero capacity cache should always be empty");
  eq(zeroCache.get("key"), undefined, "Zero capacity cache should not store items");

  const negativeCache = new LRUCache<string, number>(-5);
  negativeCache.put("key", 1);
  eq(negativeCache.size(), 0, "Negative capacity should be treated as zero");
});

export const LRUCache_12 = test('LRUCache', ({l, a: {eq}}) => {
  // Test 12: Type safety
  const cache = new LRUCache<string, number | string>(5);
  cache.put("num", 42);
  cache.put("str", "hello");
  eq(cache.get("num"), 42, "Should store and retrieve number correctly");
  eq(cache.get("str"), "hello", "Should store and retrieve string correctly");

  // Note: TypeScript errors cannot be checked at runtime, so we're just ensuring the operations are valid
  cache.put("valid", 123);
  cache.put("alsoValid", "world");
  eq(cache.size(), 4, "Cache should contain all valid entries");
});

export const LRUCache_013_zero_capacity = test('LRUCache', ({l, a: {eq}}) => {
  // Test 13: Cache with capacity 0
  const cache = new LRUCache<number, number>(0);

  cache.put(1, 1);
  eq(cache.size(), 0, 'Cache size should be 0 with capacity 0');
  eq(cache.get(1), undefined, 'Getting a key from a cache with capacity 0 should return undefined');
  cache.delete(1);
  eq(cache.size(), 0, 'Deleting a key from a cache with capacity 0 should not change the size');
});


export const LRUCache_014_capacity_change = test('LRUCache', ({l, a: {eq}}) => {
  // Test 14: Changing cache capacity
  const cache = new LRUCache<string, number>(3);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);

  eq(cache.size(), 3, "Cache should have 3 items");

  cache.setCapacity(2);

  eq(cache.size(), 2, "Cache should now have 2 items after capacity reduction");
  eq(cache.get("a"), undefined, "Least recently used item should be evicted");
  eq(cache.get("b"), 2, "More recently used items should remain");
  eq(cache.get("c"), 3, "Most recently used item should remain");

  cache.setCapacity(4);
  cache.put("d", 4);
  cache.put("e", 5);

  eq(cache.size(), 4, "Cache should now have 4 items after capacity increase");
  eq(cache.get("b"), 2, "Previously added items should still be present");
});

export const LRUCache_015_concurrent_operations = test('LRUCache', ({l, a: {eq, is}}) => {
  // Test 15: Simulating concurrent operations
  const cache = new LRUCache<string, number>(3);

  cache.put("a", 1);
  cache.get("a");
  cache.put("b", 2);
  cache.delete("a");
  cache.put("c", 3);
  cache.get("b");
  cache.put("d", 4);

  eq(cache.size(), 3, "Cache size should be 3 after concurrent-like operations");
  eq(cache.get("a"), undefined, "Deleted item should not be present");
  eq(cache.get("b"), 2, "Item 'b' should be present and have correct value");
  eq(cache.get("c"), 3, "Item 'c' should be present and have correct value");
  eq(cache.get("d"), 4, "Item 'd' should be present and have correct value");
});

export const LRUCache_016_large_capacity = test('LRUCache', ({l, a: {eq, is}}) => {
  // Test 16: Performance with large capacity
  const largeCapacity = 1000000;
  const cache = new LRUCache<number, number>(largeCapacity);

  for (let i = 0; i < largeCapacity; i++) {
    cache.put(i, i * 2);
  }

  eq(cache.size(), largeCapacity, "Cache should contain all inserted items");
  eq(cache.get(500000), 1000000, "Should retrieve correct value for middle item");

  cache.put(largeCapacity, largeCapacity * 2);
  eq(cache.get(0), undefined, "First inserted item should be evicted");
  eq(cache.get(1), 2, "Second item should still be present");
});

export const LRUCache_017_stress_test = test('LRUCache', ({l, a: {eq}}) => {
  // Test 17: Stress test with repeated operations
  const cache = new LRUCache<number, number>(1000);
  const operations = 1000000;

  for (let i = 0; i < operations; i++) {
    const key = i % 2000;
    if (i % 2 === 0) {
      cache.put(key, i);
    } else {
      cache.get(key);
    }
  }

  eq(cache.size(), 1000, "Cache size should be at capacity after stress test");
});

export const LRUCache_018_complex_keys_values = test('LRUCache', ({l, a: {eqO, eq}}) => {
  // Test 18: Complex object keys and values
  const cache = new LRUCache<{id: number}, {data: string[]}>(2);

  const key1 = {id: 1};
  const value1 = {data: ['a', 'b', 'c']};
  const key2 = {id: 2};
  const value2 = {data: ['d', 'e', 'f']};

  cache.put(key1, value1);
  cache.put(key2, value2);

  eqO(cache.get(key1), value1, "Should retrieve correct complex value for key1");
  eqO(cache.get(key2), value2, "Should retrieve correct complex value for key2");

  const key3 = {id: 3};
  const value3 = {data: ['g', 'h', 'i']};
  cache.put(key3, value3);

  eq(cache.get(key1), undefined, "First inserted complex key-value should be evicted");
});

export const LRUCache_019_entries_order = test('LRUCache', ({l, a: {eqO}}) => {
  // Test 19: Verify entries() method order
  const cache = new LRUCache<string, number>(3);

  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);
  cache.get("a");

  const entries = cache.entries();
  eqO(entries, [["b", 2], ["c", 3], ["a", 1]], "Entries should be in order from least to most recently used");
});

export const LRUCache_020_non_string_keys = test('LRUCache', ({l, a: {eq, is}}) => {
  // Test 20: Non-string, non-numeric keys
  const cache = new LRUCache<symbol, string>(2);

  const key1 = Symbol('key1');
  const key2 = Symbol('key2');

  cache.put(key1, "value1");
  cache.put(key2, "value2");

  eq(cache.get(key1), "value1", "Should retrieve correct value for symbol key1");
  eq(cache.get(key2), "value2", "Should retrieve correct value for symbol key2");

  const key3 = Symbol('key3');
  cache.put(key3, "value3");

  eq(cache.get(key1), undefined, "First inserted symbol key should be evicted");
});

export const LRUCache_021_performance_benchmark = test('LRUCache', ({l, a: {is}}) => {
  // Test 21: Performance benchmark to confirm O(1) operation runtime
  const cache = new LRUCache<number, number>(1000000);
  const iterations = 1000000;

  // Measure put operation
  const startPut = performance.now();
  for (let i = 0; i < iterations; i++) {
    cache.put(i, i);
  }
  const endPut = performance.now();
  const putTime = endPut - startPut;

  // Measure get operation
  const startGet = performance.now();
  for (let i = 0; i < iterations; i++) {
    cache.get(i);
  }
  const endGet = performance.now();
  const getTime = endGet - startGet;

  // Calculate average time per operation
  const avgPutTime = putTime / iterations;
  const avgGetTime = getTime / iterations;

  l(`Average put time: ${avgPutTime.toFixed(9)} ms`);
  l(`Average get time: ${avgGetTime.toFixed(9)} ms`);

  // Check if operations are roughly constant time
  // We'll consider it constant time if the average operation time is less than 0.001 ms
  is(avgPutTime < 0.001, "Put operation should be roughly constant time (O(1))");
  is(avgGetTime < 0.001, "Get operation should be roughly constant time (O(1))");

  // Additional check: Perform operations on a smaller cache and compare times
  const smallCache = new LRUCache<number, number>(100);
  const smallIterations = 10000;

  const startSmallPut = performance.now();
  for (let i = 0; i < smallIterations; i++) {
    smallCache.put(i % 100, i);
  }
  const endSmallPut = performance.now();
  const smallPutTime = (endSmallPut - startSmallPut) / smallIterations;

  const startSmallGet = performance.now();
  for (let i = 0; i < smallIterations; i++) {
    smallCache.get(i % 100);
  }
  const endSmallGet = performance.now();
  const smallGetTime = (endSmallGet - startSmallGet) / smallIterations;

  l(`Average small cache put time: ${smallPutTime.toFixed(9)} ms`);
  l(`Average small cache get time: ${smallGetTime.toFixed(9)} ms`);

  // Check if the operation times for the small cache are similar to the large cache
  // We'll consider them similar if they're within an order of magnitude
  is(avgPutTime / smallPutTime < 10 && avgPutTime / smallPutTime > 0.1, 
     "Put operation time should be similar for different cache sizes");
  is(avgGetTime / smallGetTime < 10 && avgGetTime / smallGetTime > 0.1, 
     "Get operation time should be similar for different cache sizes");
});


const isProgramLaunchContext = () => {
  return fileURLToPath(import.meta.url) === process.argv[1];
}

isProgramLaunchContext() && LaunchTests('./dist/', {echo_test_logging: true});
