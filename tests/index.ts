import { LaunchTests, test } from 'tst';
import { fileURLToPath } from 'url';
import { cartesian_slow, cartesian_enum_vals_slow, cartesianAt, cartesianAll, format, identical, memoized, timed } from '../utils.js';
import { colors } from '../terminal.js';

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

export * from '../color/math.js';

const isProgramLaunchContext = () => {
  return fileURLToPath(import.meta.url) === process.argv[1];
}

isProgramLaunchContext() && LaunchTests('./dist/', {echo_test_logging: true});
