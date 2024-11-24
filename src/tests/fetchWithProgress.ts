import { test } from "tst";
import { createServer } from 'http';
import { fetchWithProgress } from '../web/fetchWithProgress.js';

export const fetchWithProgress_test = test('fetchWithProgress', async ({ l, a: { eq } }) => {
  // Create a test server that slowly sends data

  const chunks = ['Hello', ' ', 'World', 'lorem ipsum'];
  for (let i = 0; i < 90; ++i) {
    chunks.push(Array.from({length: Math.round(Math.random() * 10) + 2}, (_) => String.fromCharCode('a'.charCodeAt(0) + i % 26)).join(''));
  }
  console.log('chunks:', chunks);

  const server = createServer((req, res) => {
    const totalSize = chunks.join('').length;
    
    res.setHeader('Content-Length', totalSize);
    
    let i = 0;
    const sendChunk = () => {
      if (i < chunks.length) {
        res.write(chunks[i]);
        i++;
        setTimeout(sendChunk, 4);
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
    eq(text, chunks.join(''));
    
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
