import { fileURLToPath } from 'url';

const isProgramLaunchContext = () => {
  return fileURLToPath(import.meta.url) === process.argv[1];
}

if (isProgramLaunchContext()) {

}
