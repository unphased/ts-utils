import { test } from 'tst';
import { minimatch } from 'minimatch';
import * as util from 'util';
import { red } from '../utils.js';

// Convert a glob pattern to regex
function convertGlobToRegex(pattern: string) {
  const regex = minimatch.makeRe(pattern);
  if (regex === false) {
    throw new Error('Invalid pattern: ' + red(pattern) + ' for minimatch.makeRe().');
  }
  return regex;
}

export const globStarStarTest = test('minimatch', ({l, a: {eqO}}) => {
  // Test pattern with **
  const testPattern = '**/*.js';
  const regex = convertGlobToRegex(testPattern);

  l(`Glob Pattern: ${testPattern}`);
  l(`Generated Regex: ${regex}`);
  eqO(/^(?:\/|(?:(?!(?:\/|^)\.).)*?\/)?(?!\.)[^/]*?\.js$/, regex);
});

export const regexAlternationFusingBench = test('minimatch', async ({l, spawn, a: {is, eq, gt}}) => {

  // Sample list of patterns
  const patterns = [
    'src/**/*.ts',
    'watch-iter.sh',
    'package.json',
    'transform-instrumentation-plugin.js',
    // 'git-commit-all-sentinel',
    'restart_files.txt',
    'rebuild_FE_files.txt',
    '*-babel-plugin.js',
    '*-babel-plugin.mjs',
    'babel.config.js',
    'client/client.ts',
    'client/virt-scroll.ts',
    'client/styles/styles.less',
    'index.html',
    'webpack.config.ts',
    'webpack.config.dev.ts',
    'git-commit-fe-sentinel',
  ];

  // Create individual regexes
  const individualRegexes = patterns.map(convertGlobToRegex);
  is(individualRegexes); // ensure minimax can parse globs...

  // Create a combined regex
  const combinedRegex = new RegExp(individualRegexes.map(r => r.source).join('|'));

  // Sample list of file paths to test. It'll be quite large due to node_modules.
  const output_find = (await spawn('bash', ['-c', 'find . -type f | sed "s/^\\.\\///"'], { bufferStdout: true })).stdout;
  const testFilePaths = output_find.split('\n').filter(path => path);

  let hits = 0;
  const startTime = process.hrtime();
  for (const path of testFilePaths) {
    if ((individualRegexes as (Exclude<typeof individualRegexes[0], false>[])).some(regex => regex.test(path))) {
      hits++;
    }
  }
  const diff = process.hrtime(startTime);
  const misses = testFilePaths.length - hits;
  const timeIndividual = diff[0] * 1e9 + diff[1]; // Convert to nanoseconds

  let hits2 = 0;
  const startTime2 = process.hrtime();
  for (const path of testFilePaths) {
    if (combinedRegex.test(path)) {
      hits2++;
    }
  }
  const diff2 = process.hrtime(startTime2);
  const misses2 = testFilePaths.length - hits2;
  const timeCombined = diff2[0] * 1e9 + diff2[1];

  l("number of files processed", testFilePaths.length);
  l(`Individual Regexes: ${util.inspect(timeIndividual)} ns`);
  l(`Combined Regex: ${util.inspect(timeCombined)} ns`);
  l('Hits', hits, hits2);
  l('Misses', misses, misses2);

  gt(timeIndividual, timeCombined);
  eq(hits, hits2);
  eq(misses, misses2);

});

