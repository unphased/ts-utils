import { LaunchTests, test } from 'tst';
import { fileURLToPath } from 'url';
import { cartesian } from '../utils.js';

export const permutation_simple = test(({l, a:{eq}}) => {
  const colors = ['red', 'green', 'blue'] as const;
  const size = ['Small', 'Medium', 'Large'] as const;
  const numbers = [1, 2];
  const combos = cartesian(colors, numbers, size);
  l(combos);
  const x = combos[0][1]
  eq(combos.length, 18);
});

const isProgramLaunchContext = () => {
  return fileURLToPath(import.meta.url) === process.argv[1];
}

isProgramLaunchContext() && LaunchTests('./tests', {echo_test_logging: true});
