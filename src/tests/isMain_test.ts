import { test } from 'tst';
import * as fs from 'fs';
const fsp = fs.promises;
import * as path from 'path';
import * as os from 'os';

// export const LRUCache_24_cleanup_callback_with_custom_cache = test('LRUCacheMap', ({l, a: {eq, eqO}}) => {
//   // Test 24: Cleanup callback with custom cache
//   const evictedItems: [string, number][] = [];
//   const cleanupCallback = (key: string, value: number) => {
//     evictedItems.push([key, value]);
//   };
//   

export const isMain_test = test('isMain function', async ({ l, spawn, a: { match } }) => {
  // build a trivial script to test the isMain behavior
  const code = /* typescript */ `
import { isMain } from "./dist/utils.js";
console.log("argv:", process.argv, "i.m.u:", import.meta.url, "result:", isMain(import.meta.url));
`;
  // launching in a oneliner doesn't count (this one is interesting)
  const out = await spawn('node', ['--input-type=module', '-e', code], { bufferStdout: true });
  l('output from `node -e`:', out.stdout);
  match(out.stdout, /result: false/);

  // save as file
  const tmpdir = os.tmpdir();
  const tmpCodeFilePth = path.join(tmpdir, 'ts-utils-temp-isMain-test-codefile.ts');
  await fsp.writeFile(tmpCodeFilePth, code);

  // launch directly should be isMain true


});

