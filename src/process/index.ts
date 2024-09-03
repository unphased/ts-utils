import * as child_process from 'child_process';
import * as os from 'os';
import { MMRegExp, minimatch } from 'minimatch';

// produce a compiled re matching all globs specified
const globListToRE = (file_glob_list: string[]) => {
  const regexes = file_glob_list.map(glob => minimatch.makeRe(glob));
  if (regexes.some(re => !re)) {
    throw new Error('Invalid glob pattern observed (minimatch could not convert): ' + regexes.map((re, i) => [i, re] as const).filter(e => !e[1]).map(e => file_glob_list[e[0]]).join(', '));
  }
  return new RegExp((file_glob_list.map(glob => minimatch.makeRe(glob).source)).join('|'));
}

export function spawn_with_file_watching_preemption(cmd: string[], signal: keyof typeof os.constants.signals, file_glob_list: string[]) {

  const full_re = globListToRE(file_glob_list);
}

