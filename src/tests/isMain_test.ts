import { test } from 'tst';
import * as fs from 'fs';
const fsp = fs.promises;
import * as path from 'path';
import * as os from 'os';
import { fileURLToPath } from 'url';

// export const LRUCache_24_cleanup_callback_with_custom_cache = test('LRUCacheMap', ({l, a: {eq, eqO}}) => {
//   // Test 24: Cleanup callback with custom cache
//   const evictedItems: [string, number][] = [];
//   const cleanupCallback = (key: string, value: number) => {
//     evictedItems.push([key, value]);
//   };
//   

export const isMain_test = test('isMain function', async ({ l, spawn, a: { match } }) => {

  // boilerplate. we're keeping ts-utils clear of esbuild shims and fancy shit like that for now
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  l('__dirname', __dirname);
  // build a trivial script to test the isMain behavior
  const code = /* typescript */ `import { isMain } from "${path.resolve(__dirname, '..')}/dist/utils.js";
console.log("argv:", process.argv, "i.m.u:", import.meta.url, "result:", await isMain(import.meta.url));
export const square = (x) => x * x;`;
  l('code is:', code);
  // launching in a oneliner doesn't count (this one is interesting)
  const out = await spawn('node', ['--input-type=module', '-e', code], {
    bufferStdout: true,
    showStdoutWhenBuffering: true
  });
  l('output from `node -e`:', out.stdout);
  match(out.stdout, /result: false/);

  // save as file
  const tmpdir = os.tmpdir();
  const tmpCodeFilePth = path.join(tmpdir, 'ts-utils-temp-isMain-test-codefile.mjs');
  await fsp.writeFile(tmpCodeFilePth, code);

  // launch directly should be isMain true
  const directOut = await spawn('node', [tmpCodeFilePth], {
    bufferStdout: true,
    showStdoutWhenBuffering: true
  });
  l('output from direct file execution:', directOut.stdout);
  match(directOut.stdout, /result: true/);

  // now test the big case which is importing it.
  const importingFilePth = tmpCodeFilePth.replace('codefile.mjs', 'importingfile.mjs');
  const importingCode = /* typescript */ `import { square } from './ts-utils-temp-isMain-test-codefile.mjs';
console.log(square(2));
`;
  await fsp.writeFile(importingFilePth, importingCode);
  const importOut = await spawn('node', [importingFilePth], {
    bufferStdout: true,
    showStdoutWhenBuffering: true
  })
  l('output from imported execution:', importOut.stdout);
  match(importOut.stdout, /result: false/);

  // Clean up the temporary file
  await fsp.unlink(tmpCodeFilePth);
  await fsp.unlink(importingFilePth);
});

