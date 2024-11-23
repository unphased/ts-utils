import { test } from "tst";
import { createServer } from 'http';
import { fetchWithProgress } from '../web/fetchWithProgress.js';
import fetch from 'node-fetch';
import { Response, ReadableStream } from 'node-fetch';

// Polyfill fetch and related APIs if not available
if (!global.fetch) {
  global.fetch = fetch as any;
  global.Response = Response as any;
  global.ReadableStream = ReadableStream as any;
}

export const fetchWithProgress_test = test('fetchWithProgress', async ({ l, a: { eq } }) => {
  // Create a test server that slowly sends data
  const server = createServer((req, res) => {
    const chunks = ['Hello', ' ', 'World'];
    const totalSize = chunks.join('').length;
    
    res.setHeader('Content-Length', totalSize);
    
    let i = 0;
    const sendChunk = () => {
      if (i < chunks.length) {
        res.write(chunks[i]);
        i++;
        setTimeout(sendChunk, 100);
      } else {
        res.end();
      }
    };
    
    sendChunk();
  });

  // Start server on random port
  await new Promise(resolve => server.listen(0, resolve));
  const port = (server.address() as any).port;
  
  let progressValues: number[] = [];
  
  try {
    const response = await fetchWithProgress(
      `http://localhost:${port}`,
      {},
      (progress) => {
        progressValues.push(progress);
        l('Progress:', progress);
      }
    );
    
    const text = await response.text();
    eq(text, 'Hello World');
    
    // Verify we got multiple progress updates
    eq(progressValues.length > 1, true);
    // First progress should be > 0
    eq(progressValues[0] > 0, true);
    // Last progress should be 100
    eq(Math.round(progressValues[progressValues.length - 1]), 100);
    
  } finally {
    server.close();
  }
});
