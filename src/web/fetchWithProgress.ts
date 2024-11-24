interface ProgressOptions {
  debounceInterval?: number; // in milliseconds
}

export function fetchWithProgress(
  url: string, 
  options: RequestInit = {}, 
  onProgress?: (progress: number) => void,
  progressOptions: ProgressOptions = { debounceInterval: 100 }
) {
  return fetch(url, options).then(response => {
    const contentLength = response.headers.get('Content-Length');

    if (!contentLength) {
      console.error('Content-Length header is missing');
      return response;
    }

    const total = parseInt(contentLength, 10);
    let loaded = 0;

    const reader = response.body.getReader();
    const stream = new ReadableStream({
      start(controller) {
        function push() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            loaded += value.byteLength;
            const progress = (loaded / total) * 100;

            // Debounced progress reporting
            if (onProgress && typeof onProgress === 'function') {
              if (!push['lastCall'] || 
                  Date.now() - push['lastCall'] >= (progressOptions.debounceInterval ?? 100)) {
                onProgress(progress);
                push['lastCall'] = Date.now();
              }
            }

            controller.enqueue(value);
            push();
          }).catch(error => {
            console.error('Error reading stream:', error);
            controller.error(error);
          });
        }
        push();
      }
    });

    // Create a new response with the modified stream
    return new Response(stream, {
      headers: response.headers
    });
  });
}
