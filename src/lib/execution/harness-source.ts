/**
 * Plain-JavaScript test harness. It is injected as a string into a Web Worker
 * (browser execution) and evaluated by scripts/verify-problems.ts (CI check that
 * every reference solution passes its own test cases), so it must stay
 * dependency-free ES2017.
 *
 * Exposes: runAll(payload) -> { results, logs, error }
 */
export const HARNESS_SOURCE = String.raw`
function ListNode(val, next) { this.val = val === undefined ? 0 : val; this.next = next === undefined ? null : next; }
function TreeNode(val, left, right) { this.val = val === undefined ? 0 : val; this.left = left === undefined ? null : left; this.right = right === undefined ? null : right; }

function __toList(arr) { var d = new ListNode(0), c = d; for (var i = 0; i < arr.length; i++) { c.next = new ListNode(arr[i]); c = c.next; } return d.next; }
function __fromList(h) { var out = [], c = h, guard = 0; while (c && guard++ < 100000) { out.push(c.val); c = c.next; } return out; }
function __toTree(arr) {
  if (!arr || !arr.length || arr[0] === null) return null;
  var root = new TreeNode(arr[0]), q = [root], i = 1;
  while (q.length && i < arr.length) {
    var n = q.shift();
    if (i < arr.length && arr[i] !== null) { n.left = new TreeNode(arr[i]); q.push(n.left); } i++;
    if (i < arr.length && arr[i] !== null) { n.right = new TreeNode(arr[i]); q.push(n.right); } i++;
  }
  return root;
}
function __fromTree(root) {
  if (!root) return [];
  var out = [], q = [root];
  while (q.length) { var n = q.shift(); if (n) { out.push(n.val); q.push(n.left); q.push(n.right); } else out.push(null); }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}
function __clone(v) { return v === undefined ? null : JSON.parse(JSON.stringify(v)); }
function __prepare(input, types) {
  return input.map(function (v, i) {
    if (types[i] === "ListNode") return __toList(v);
    if (types[i] === "ListNode[]") return v.map(__toList);
    if (types[i] === "TreeNode") return __toTree(v);
    return __clone(v);
  });
}
function __serialize(v, type) {
  if (v === undefined) return null;
  if (type === "ListNode") return __fromList(v);
  if (type === "TreeNode") return __fromTree(v);
  if (v instanceof ListNode) return __fromList(v);
  if (v instanceof TreeNode) return __fromTree(v);
  return __clone(v);
}
function __key(v) { return JSON.stringify(v); }
function __sortDeep(v, nested) {
  if (!Array.isArray(v)) return v;
  var arr = v.map(function (x) { return nested && Array.isArray(x) ? x.slice().sort(function (a, b) { return __key(a) < __key(b) ? -1 : __key(a) > __key(b) ? 1 : 0; }) : x; });
  return arr.sort(function (a, b) { return __key(a) < __key(b) ? -1 : __key(a) > __key(b) ? 1 : 0; });
}
function __floatEq(a, b) {
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) < 1e-5;
  if (Array.isArray(a) && Array.isArray(b)) { if (a.length !== b.length) return false; for (var i = 0; i < a.length; i++) if (!__floatEq(a[i], b[i])) return false; return true; }
  return __key(a) === __key(b);
}
function __equal(actual, expected, mode) {
  if (mode === "float") return __floatEq(actual, expected);
  if (mode === "unordered") return __key(__sortDeep(actual, false)) === __key(__sortDeep(expected, false));
  if (mode === "unorderedNested") return __key(__sortDeep(actual, true)) === __key(__sortDeep(expected, true));
  return __key(actual) === __key(expected);
}
function __now() { return (typeof performance !== "undefined" ? performance.now() : Date.now()); }

function __runCase(entry, sig, kind, test, mode) {
  var t0 = __now(), actual;
  if (kind === "design") {
    var ops = test.input[0], args = test.input[1], out = [null];
    var inst = new (Function.prototype.bind.apply(entry, [null].concat(args[0])))();
    for (var k = 1; k < ops.length; k++) {
      var r = inst[ops[k]].apply(inst, args[k]);
      out.push(r === undefined ? null : __clone(r));
    }
    actual = out;
  } else {
    var types = sig.params.map(function (p) { return p[1]; });
    var prepared = __prepare(test.input, types);
    var ret = entry.apply(null, prepared);
    actual = sig.returns === "void" ? __serialize(prepared[0], types[0]) : __serialize(ret, sig.returns);
  }
  var ms = __now() - t0;
  return { id: test.id, input: test.input, expected: test.expected, actual: actual, passed: __equal(actual, test.expected, mode), ms: ms };
}

function runAll(payload) {
  var logs = [];
  var fakeConsole = { log: function () { if (logs.length < 200) logs.push(Array.prototype.map.call(arguments, function (a) { try { return typeof a === "string" ? a : JSON.stringify(a); } catch (e) { return String(a); } }).join(" ")); } };
  fakeConsole.info = fakeConsole.log; fakeConsole.warn = fakeConsole.log; fakeConsole.error = fakeConsole.log; fakeConsole.debug = fakeConsole.log;
  var name = payload.kind === "design" ? payload.sig.className : payload.sig.name;
  var entry;
  try {
    var factory = new Function("console", "ListNode", "TreeNode", payload.code + "\n;return (typeof " + name + " !== 'undefined') ? " + name + " : undefined;");
    entry = factory(fakeConsole, ListNode, TreeNode);
  } catch (e) {
    return { results: [], logs: logs, error: { type: "Compilation Error", message: String(e && e.message ? e.message : e) } };
  }
  if (typeof entry !== "function") {
    return { results: [], logs: logs, error: { type: "Compilation Error", message: "Could not find " + (payload.kind === "design" ? "class " : "function ") + name + ". Keep the name from the starter code." } };
  }
  var results = [];
  for (var i = 0; i < payload.tests.length; i++) {
    try { results.push(__runCase(entry, payload.sig, payload.kind, payload.tests[i], payload.mode)); }
    catch (e) { return { results: results, logs: logs, error: { type: "Runtime Error", message: String(e && e.message ? e.message : e), testId: payload.tests[i].id } }; }
  }
  return { results: results, logs: logs, error: null };
}
`;
