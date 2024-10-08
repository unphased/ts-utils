import * as os from 'os';
import { execSync } from 'child_process';

function getDefaultInterface() {
  let defaultInterface = '';

  try {
    if (os.platform() === 'darwin') {
      // macOS
      defaultInterface = execSync('route -n get default | grep interface | awk \'{print $2}\'', {
        encoding: 'utf8',
      }).trim();
    } else if (os.platform() === 'linux') {
      // Linux
      const routeOutput = execSync('ip route', { encoding: 'utf8' });
      const routes = routeOutput.split('\n');

      let lowestMetric = Infinity;
      for (const route of routes) {
        if (route.includes('default')) {
          const metric = parseInt(route.split('metric ')[1].trim(), 10);
          if (metric < lowestMetric) {
            lowestMetric = metric;
            defaultInterface = route.split(' ')[4];
          }
        }
      }
    }
  } catch (error) {
    console.error('Error retrieving default interface:', error);
  }

  return defaultInterface;
}

export function getLocalLANIPAddress() {
  const defaultInterface = getDefaultInterface();
  const interfaces = os.networkInterfaces();

  if (defaultInterface && interfaces[defaultInterface]) {
    const iface = interfaces[defaultInterface];

    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }

  return null;
}

