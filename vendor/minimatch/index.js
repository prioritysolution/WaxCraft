"use strict";

// minimatch 3.x call signature (default-export function + statics) on top of
// minimatch 11. On Windows, 3.x treated "\" in patterns as a path separator
// unless `allowWindowsEscape` was set; 11.x needs `windowsPathsNoEscape` for that.
const path = require("path");
const latest = require("minimatch-latest");

const isWindows = path.sep === "\\";

const normalize = (options) => {
  const opts = options ? { ...options } : {};
  if (isWindows && opts.windowsPathsNoEscape === undefined) {
    opts.windowsPathsNoEscape = !opts.allowWindowsEscape;
  }
  return opts;
};

class Minimatch extends latest.Minimatch {
  constructor(pattern, options) {
    super(pattern, normalize(options));
  }
}

function minimatch(target, pattern, options) {
  return latest.minimatch(target, pattern, normalize(options));
}

minimatch.Minimatch = Minimatch;
minimatch.minimatch = minimatch;
minimatch.GLOBSTAR = latest.GLOBSTAR;
minimatch.sep = latest.sep;
minimatch.filter = (pattern, options) =>
  latest.filter(pattern, normalize(options));
minimatch.makeRe = (pattern, options) =>
  latest.makeRe(pattern, normalize(options));
minimatch.match = (list, pattern, options) =>
  latest.match(list, pattern, normalize(options));
minimatch.braceExpand = (pattern, options) =>
  latest.braceExpand(pattern, normalize(options));
minimatch.escape = (pattern, options) =>
  latest.escape(pattern, normalize(options));
minimatch.unescape = (pattern, options) =>
  latest.unescape(pattern, normalize(options));
minimatch.defaults = (def) => {
  if (!def || typeof def !== "object" || !Object.keys(def).length) {
    return minimatch;
  }
  const merged = (target, pattern, options) =>
    minimatch(target, pattern, { ...def, ...options });
  return Object.assign(merged, minimatch, {
    Minimatch: class extends Minimatch {
      constructor(pattern, options) {
        super(pattern, { ...def, ...options });
      }
    },
    defaults: (more) => minimatch.defaults({ ...def, ...more }),
  });
};

module.exports = minimatch;
