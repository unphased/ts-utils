import { LaunchTests, test } from 'tst';
import { fileURLToPath } from 'url';

type EnumOrArray = { [key: string]: any } | any[];

function getAllPermutations(...inputs: EnumOrArray[]): any[][] {
  // Convert enums (objects) to arrays and flatten inputs to a single array of arrays
  const itemGroups: any[][] = inputs.map(input =>
    Array.isArray(input) ? input : Object.values(input).filter(value => typeof value === "number" || typeof value === "string")
  );

  // Recursive function to generate permutations
  function generatePermutations(groups: any[][], prefix: any[] = []): any[][] {
    if (!groups.length) return [prefix];
    const firstGroup = groups[0];
    const restGroups = groups.slice(1);

    let result: any[][] = [];

    firstGroup.forEach(item => {
      result = result.concat(generatePermutations(restGroups, [...prefix, item]));
    });

    return result;
  }

  return generatePermutations(itemGroups);
}

export const permutations = test(({l}) => {
  enum Color {
    Red,
    Green,
    Blue
  }
  const numbers = [1, 2];
  const permutations = getAllPermutations(Color, numbers);
  l(permutations);
});


const isProgramLaunchContext = () => {
  return fileURLToPath(import.meta.url) === process.argv[1];
}

isProgramLaunchContext() && LaunchTests('./tests');
