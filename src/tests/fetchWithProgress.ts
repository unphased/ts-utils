import { test } from "tst";
import { createServer } from 'http';
import { fetchWithProgress } from '../web/fetchWithProgress.js';

export const fetchWithProgress_local_server = test('fetchWithProgress', async ({ l, a: { eq, is } }) => {
  // Test different debounce intervals
  const testCases = [
    { debounceInterval: 50, chunkDelay: 4 },
    { debounceInterval: 200, chunkDelay: 4 },
    { debounceInterval: 0, chunkDelay: 4 }  // No debouncing
  ];

  for (const { debounceInterval, chunkDelay } of testCases) {
    l(`Testing with debounceInterval: ${debounceInterval}ms`);
    
    const chunks = ['Hello', ' ', 'World', 'lorem ipsum'];
    for (let i = 0; i < 90; ++i) {
      chunks.push(Array.from(
        { length: Math.round(Math.random() * 10) + 2 },
        (_) => String.fromCharCode('a'.charCodeAt(0) + i % 26)
      ).join(''));
    }

    const server = createServer((req, res) => {
      const totalSize = chunks.join('').length;
      res.setHeader('Content-Length', totalSize);
      
      let i = 0;
      const sendChunk = () => {
        if (i < chunks.length) {
          res.write(chunks[i]);
          i++;
          setTimeout(sendChunk, chunkDelay);
        } else {
          res.end();
        }
      };
      
      sendChunk();
    });

    await new Promise(resolve => server.listen(0, resolve));
    const port = (server.address() as any).port;
    
    let progressValues: number[] = [];
    let lastCallTime = 0;
    
    try {
      const response = await fetchWithProgress(
        `http://localhost:${port}`,
        {},
        (progress) => {
          const now = Date.now();
          if (lastCallTime > 0) {
            const timeSinceLastCall = now - lastCallTime;
            // For non-zero debounce intervals, verify minimum spacing
            if (debounceInterval > 0) {
              eq(timeSinceLastCall >= debounceInterval - 5, true, 
                `Progress event spacing (${timeSinceLastCall}ms) should respect debounce interval (${debounceInterval}ms)`);
            }
          }
          lastCallTime = now;
          progressValues.push(progress);
          l(`Progress (${debounceInterval}ms debounce):`, progress);
        },
        { debounceInterval }
      );
      
      const text = await response.text();
      eq(text, chunks.join(''));
      
      // Basic progress validation
      eq(progressValues.length > 0, true, 'Should have progress updates');
      eq(progressValues[0] > 0, true, 'First progress should be > 0');

      // Verify event count matches debounce expectations
      if (debounceInterval === 0) {
        is(progressValues.length === chunks.length, 
          'No debounce should result in as many events as chunks');
      } else if (debounceInterval === 200) {
        eq(progressValues.length < 20, true, 
          'Longer debounce should result in fewer events');
      }
      
      l(`Received ${progressValues.length} progress events with ${debounceInterval}ms debounce`);
    } finally {
      server.close();
    }
  }
});

export const fetchWithProgress_internet_resource = test('fetchWithProgress', async ({ l, a: { eq, is } }) => {
  // a known sluggish network resource
  const url = 'https://api.weather.gov/radar/stations';
  const ret = await fetchWithProgress(url, {}, (progress) => {
    l('progress:', progress);
  }, { debounceInterval: 1 });
  l('ret', ret);
  l(await ret.json());
});
