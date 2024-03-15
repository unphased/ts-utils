import { LaunchTests, test } from 'tst';
import { fileURLToPath } from 'url';
import { cartesian } from '../utils.js';

export const permutation_simple = test(({l, a:{eq}}) => {
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
  l(combos);
  eq(combos.length, 18);
});

const isProgramLaunchContext = () => {
  return fileURLToPath(import.meta.url) === process.argv[1];
}

isProgramLaunchContext() && LaunchTests('./tests', {echo_test_logging: true});
