import { LaunchTests, test } from 'tst';
import { fileURLToPath } from 'url';
import { cartesian, cartesian_enum_vals } from '../utils.js';

export const cartesian_simple = test(({l, a:{eq}}) => {
  const size = ['S', 'M', 'L'];
  enum OtherColors {
    Black, White
  }
  const numbers = [1, 2];
  const combos = cartesian(['r', 'g', 'b'] as const, numbers, size, OtherColors);
  const combovs = cartesian_enum_vals(['r', 'g', 'b'] as const, numbers, size, OtherColors);
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
  const combos2 = cartesian(Color, numbers, Size);
  l(combos2);
  eq(combos2.length, 18);
});

export const cartesian_with_funs = test(({l, a:{eq}}) => {
  const methods = [
    (x: number) => x + 1,
    (x: number) => x * 2,
    (x: number) => x / 3
  ];

  const combos = cartesian(methods, methods, [100, 200, 300, 400] as const);
  l(combos.map(([f, g, x]) => f(g(x))));
  eq(combos.length, 36);
});

// generators as items to use in a list, which is trivial
export const cartesian_with_gens = test(({l, a:{eq}}) => {
  // const 
});

// TODO: a generator cartesian which takes both generators and lists and produces a generator that enumerates the
// cartesian lazily

// it sounds ridiculous but it's the right way to go about making arbitrarily scalable benchmarks.

const isProgramLaunchContext = () => {
  return fileURLToPath(import.meta.url) === process.argv[1];
}

isProgramLaunchContext() && LaunchTests('./tests', {echo_test_logging: true});
