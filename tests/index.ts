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
});

export const cartesian2 = test(({l, a:{eq}}) => {

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
  const numbers = [1, 2];
  const combos = cartesian(Color, numbers, Size);
  //    ^?
  l(combos);
  eq(combos.length, 18);

});

const isProgramLaunchContext = () => {
  return fileURLToPath(import.meta.url) === process.argv[1];
}

isProgramLaunchContext() && LaunchTests('./tests', {echo_test_logging: true});
