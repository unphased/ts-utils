import { LaunchTests, test } from 'tst';
import { fileURLToPath } from 'url';
import { permutations } from '../utils.js';

export const permutation_simple = test(({l, a:{eq}}) => {
  enum Color {
    Red,
    Green,
    Blue
  }
  enum Size {
    Small,
    Medium,
    Large
  }
  const numbers = [1, 2];
  const perms = permutations(Color, numbers, Size);
  l(perms);
  eq(perms.length, 18);
});

const isProgramLaunchContext = () => {
  return fileURLToPath(import.meta.url) === process.argv[1];
}

isProgramLaunchContext() && LaunchTests('./tests');
