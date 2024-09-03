import * as util from "util";
import { colors } from '../terminal/colors.js';

// brainstorm: need another helper that will perform a deep object traversal. It will return a copy of the object but
// with functions inside replaced with some kind of rendered placeholder which includes their serializations. Pass THAT
// into util.inspect et voila!
type AdditionalFormatOpts = {
    inspectStrings?: boolean;
};
// A sane default for showing multiple items. Will space-delimited render buffers in blue text, green underlines on any plain string items to clarify their boundaries, functions get serialized!, and typical util.inspect for anything else (objects, arrays).
export const format_opt = (x: any[], opts?: util.InspectOptions & AdditionalFormatOpts) => x.map(item => Buffer.isBuffer(item) ?
    colors.blue + item.toString('utf8') + colors.fg_reset :
    typeof item === 'string' ?
        (opts && opts.inspectStrings) ? util.inspect(item, { colors: true, compact: true }) : item.includes('\x1b') ? item : colors.underline_green + colors.underline + item + colors.underline_reset + colors.underline_color_reset :
        typeof item === 'function' ?
            item.toString() :
            util.inspect(item, { depth: 7, colors: true, compact: true, maxArrayLength: 15, maxStringLength: 120, ...opts })
).join(' ');

export const format = (...x: any[]) => format_opt(x);
// TODO: Have a mode that uses git (???) to work out an initial heuristic to use for displaying the tests that have
// been touched in the last X hours. This is probably even more streamlined than providing a manual control around
// which tests to enable autorun for.
// TODO Also consider schlepping this ring buffer contents after a run of a test, into a test 'ephemeris' file. This can be
// pulled up on demand and great for sanity checking even passing tests alongside any logging.
// TODO reconcile pp with format()
// pretty print 1: single item, grey bg

export const pp = (x: any) => colors.dark_grey_bg + (Buffer.isBuffer(x) ? x.toString('utf8') : (typeof x === 'string' ? x : util.inspect(x, { colors: true, depth: Infinity, compact: true }))) + colors.bg_reset;
// pretty print 2: as above but colorize and show string broken down if escapes are present
export const pp2 = (x: any) => colors.dark_grey_bg + (Buffer.isBuffer(x) ? x.toString('utf8') :
    typeof x === 'string' ?
        x.includes('\x1b') ? util.inspect(x, { colors: true, compact: true }) : x :
        util.inspect(x, { colors: true, depth: Infinity, compact: true })
) + colors.bg_reset;

