import { LaunchTests, test } from 'tst';
import { fileURLToPath } from 'url';
import { cartesian } from '../utils.js';

export const cartesian_simple = test(({l, a:{eq}}) => {
  const colors = ['red', 'green', 'blue'] as const;
  const size = ['Small', 'Medium', 'Large'] as const;
  const numbers = [1, 2];
  const combos = cartesian(colors, numbers, size);
  l(combos);
  const x = combos[0][1]
  eq(combos.length, 18);
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

});

const isProgramLaunchContext = () => {
  return fileURLToPath(import.meta.url) === process.argv[1];
}

isProgramLaunchContext() && LaunchTests('./tests', {echo_test_logging: true});
