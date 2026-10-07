import type { ProblemDef } from "./builder";

export const advancedProblems: ProblemDef[] = [
  // ------------------------------------------------------------ greedy
  {
    t: "Jump Game", d: "M", topic: "greedy", sub: "Reachability", pat: ["greedy", "dynamic-programming"], tags: ["Array", "Greedy"], co: ["amazon", "microsoft", "google", "meta", "apple", "flipkart"],
    desc: "You are given an integer array `nums`. You start at index 0, and `nums[i]` is your maximum jump length from index `i`. Return `true` if you can reach the last index.",
    cons: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"],
    hints: ["Track the farthest index reachable so far."],
    exp: "Scan left to right keeping the farthest reachable index. If the current index is ever beyond it, you are stuck; otherwise extend it with i + nums[i].",
    steps: ["far = 0.", "For each i: if i > far return false; far = max(far, i + nums[i]).", "Return true."],
    tc: "O(n)", sc: "O(1)",
    fn: ["canJump", [["nums", "int[]"]], "bool"],
    tests: [[[[2, 3, 1, 1, 4]], true], [[[3, 2, 1, 0, 4]], false], [[[0]], true], [[[2, 0, 0]], true]],
    js: `
var canJump = function(nums) {
    let far = 0;
    for (let i = 0; i < nums.length; i++) {
        if (i > far) return false;
        far = Math.max(far, i + nums[i]);
    }
    return true;
};`,
    py: `
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        far = 0
        for i, x in enumerate(nums):
            if i > far:
                return False
            far = max(far, i + x)
        return True`,
  },
  {
    t: "Jump Game II", d: "M", topic: "greedy", sub: "BFS-like greedy", pat: ["greedy", "bfs"], tags: ["Array", "Greedy"], co: ["amazon", "google", "microsoft", "flipkart"],
    desc: "Given `nums` where `nums[i]` is the maximum jump length from index `i`, return the minimum number of jumps to reach the last index. You can always reach it.",
    cons: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 1000"],
    hints: ["Think of ranges of indices reachable with j jumps as BFS levels."],
    exp: "Indices reachable with the same number of jumps form a contiguous window. Scan the current window, computing the farthest next reach; when the window ends, take a jump.",
    steps: ["jumps = 0, end = 0, far = 0.", "For i < n - 1: far = max(far, i + nums[i]); if i == end, jumps++, end = far."],
    tc: "O(n)", sc: "O(1)",
    fn: ["jump", [["nums", "int[]"]], "int"],
    tests: [[[[2, 3, 1, 1, 4]], 2], [[[2, 3, 0, 1, 4]], 2], [[[0]], 0], [[[1, 1, 1, 1]], 3]],
    js: `
var jump = function(nums) {
    let jumps = 0, end = 0, far = 0;
    for (let i = 0; i < nums.length - 1; i++) {
        far = Math.max(far, i + nums[i]);
        if (i === end) { jumps++; end = far; }
    }
    return jumps;
};`,
  },
  {
    t: "Gas Station", d: "M", topic: "greedy", sub: "Circular tours", pat: ["greedy"], tags: ["Array", "Greedy"], co: ["amazon", "google", "microsoft", "flipkart"],
    desc: "There are `n` gas stations on a circular route; station `i` has `gas[i]` and travelling to the next costs `cost[i]`. Return the starting station index that lets you travel around once, or -1. The answer is unique if it exists.",
    cons: ["1 <= n <= 10^5", "0 <= gas[i], cost[i] <= 10^4"],
    hints: ["If total gas < total cost, there is no answer.", "If you run dry at station i, no station between the start and i can work either."],
    exp: "When the running tank goes negative at i, every start up to i fails, so restart from i + 1. If total gas covers total cost, the last restart point is the answer.",
    steps: ["total and tank sums of gas[i] - cost[i].", "When tank < 0, start = i + 1, tank = 0.", "Return total >= 0 ? start : -1."],
    tc: "O(n)", sc: "O(1)",
    fn: ["canCompleteCircuit", [["gas", "int[]"], ["cost", "int[]"]], "int"],
    tests: [[[[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]], 3], [[[2, 3, 4], [3, 4, 3]], -1], [[[5], [4]], 0]],
    js: `
var canCompleteCircuit = function(gas, cost) {
    let total = 0, tank = 0, start = 0;
    for (let i = 0; i < gas.length; i++) {
        const d = gas[i] - cost[i];
        total += d; tank += d;
        if (tank < 0) { start = i + 1; tank = 0; }
    }
    return total >= 0 ? start : -1;
};`,
  },
  {
    t: "Assign Cookies", d: "E", topic: "greedy", sub: "Matching sorted lists", pat: ["greedy", "two-pointers"], tags: ["Greedy", "Sorting"], co: ["amazon", "adobe"],
    desc: "Each child `i` has a greed factor `g[i]` and each cookie `j` has size `s[j]`. A child is content if they get a cookie with `s[j] >= g[i]`. Each child gets at most one cookie. Return the maximum number of content children.",
    cons: ["1 <= g.length <= 3 * 10^4", "0 <= s.length <= 3 * 10^4"],
    hints: ["Sort both and give each child the smallest cookie that satisfies them."],
    exp: "Satisfying the least greedy child with the smallest sufficient cookie never hurts later choices, so a two-pointer sweep over the sorted lists is optimal.",
    steps: ["Sort g and s.", "Walk cookies; when s[j] >= g[i], i++.", "Return i."],
    tc: "O(n log n)", sc: "O(1)",
    fn: ["findContentChildren", [["g", "int[]"], ["s", "int[]"]], "int"],
    tests: [[[[1, 2, 3], [1, 1]], 1], [[[1, 2], [1, 2, 3]], 2], [[[10, 9, 8, 7], [5, 6, 7, 8]], 2]],
    js: `
var findContentChildren = function(g, s) {
    g.sort((a, b) => a - b); s.sort((a, b) => a - b);
    let i = 0;
    for (let j = 0; j < s.length && i < g.length; j++) if (s[j] >= g[i]) i++;
    return i;
};`,
  },
  {
    t: "Non-overlapping Intervals", d: "M", topic: "greedy", sub: "Interval scheduling", pat: ["greedy", "merge-intervals"], tags: ["Greedy", "Sorting", "Intervals"], co: ["meta", "amazon", "google", "microsoft"],
    desc: "Given an array of `intervals`, return the minimum number of intervals you need to remove to make the rest non-overlapping. Intervals that only touch (e.g. [1,2] and [2,3]) do not overlap.",
    cons: ["1 <= intervals.length <= 10^5"],
    hints: ["Keep the interval that ends earliest; it leaves the most room."],
    exp: "Classic activity selection: sort by end time and greedily keep intervals that start at or after the last kept end. Everything else must be removed.",
    steps: ["Sort by end.", "Keep if start >= lastEnd, else count a removal."],
    tc: "O(n log n)", sc: "O(1)",
    fn: ["eraseOverlapIntervals", [["intervals", "int[][]"]], "int"],
    tests: [[[[[1, 2], [2, 3], [3, 4], [1, 3]]], 1], [[[[1, 2], [1, 2], [1, 2]]], 2], [[[[1, 2], [2, 3]]], 0]],
    js: `
var eraseOverlapIntervals = function(intervals) {
    intervals.sort((a, b) => a[1] - b[1]);
    let end = -Infinity, removed = 0;
    for (const [s, e] of intervals) { if (s >= end) end = e; else removed++; }
    return removed;
};`,
  },
  {
    t: "Partition Labels", d: "M", topic: "greedy", sub: "Last occurrence", pat: ["greedy", "two-pointers"], tags: ["Greedy", "String", "Hash Table"], co: ["amazon", "meta", "google"],
    desc: "Partition string `s` into as many parts as possible so that each letter appears in at most one part. Return the sizes of the parts in order.",
    cons: ["1 <= s.length <= 500", "Lowercase English letters"],
    hints: ["Record the last index of every letter.", "A part can end when the scan reaches the furthest last-index seen in it."],
    exp: "Extend the current part to the furthest last occurrence of any letter in it. When the scan reaches that point, the part is closed.",
    steps: ["last[c] = last index.", "end = max(end, last[s[i]]); when i == end push i - start + 1."],
    tc: "O(n)", sc: "O(26)",
    fn: ["partitionLabels", [["s", "string"]], "int[]"],
    tests: [[["ababcbacadefegdehijhklij"], [9, 7, 8]], [["eccbbbbdec"], [10]], [["abc"], [1, 1, 1]]],
    js: `
var partitionLabels = function(s) {
    const last = {};
    for (let i = 0; i < s.length; i++) last[s[i]] = i;
    const res = [];
    let start = 0, end = 0;
    for (let i = 0; i < s.length; i++) {
        end = Math.max(end, last[s[i]]);
        if (i === end) { res.push(end - start + 1); start = i + 1; }
    }
    return res;
};`,
  },
  {
    t: "Candy", d: "H", topic: "greedy", sub: "Two-pass greedy", pat: ["greedy"], tags: ["Greedy", "Array"], co: ["amazon", "google", "microsoft", "flipkart"],
    desc: "Children stand in a line with `ratings`. Each child gets at least one candy, and a child with a higher rating than a neighbour gets more candies than that neighbour. Return the minimum total candies.",
    cons: ["1 <= n <= 2 * 10^4", "0 <= ratings[i] <= 2 * 10^4"],
    hints: ["Satisfy the left-neighbour rule in one pass and the right-neighbour rule in another."],
    exp: "A left-to-right pass handles increasing runs, and a right-to-left pass handles decreasing runs; taking the max of both satisfies both constraints minimally.",
    steps: ["c = ones.", "Left pass: if r[i] > r[i-1], c[i] = c[i-1] + 1.", "Right pass: if r[i] > r[i+1], c[i] = max(c[i], c[i+1] + 1)."],
    tc: "O(n)", sc: "O(n)",
    fn: ["candy", [["ratings", "int[]"]], "int"],
    tests: [[[[1, 0, 2]], 5], [[[1, 2, 2]], 4], [[[1, 3, 4, 5, 2]], 11], [[[5]], 1]],
    js: `
var candy = function(ratings) {
    const n = ratings.length, c = new Array(n).fill(1);
    for (let i = 1; i < n; i++) if (ratings[i] > ratings[i - 1]) c[i] = c[i - 1] + 1;
    for (let i = n - 2; i >= 0; i--) if (ratings[i] > ratings[i + 1]) c[i] = Math.max(c[i], c[i + 1] + 1);
    return c.reduce((a, b) => a + b, 0);
};`,
  },
  {
    t: "Minimum Number of Arrows to Burst Balloons", d: "M", topic: "greedy", sub: "Interval stabbing", pat: ["greedy", "merge-intervals"], tags: ["Greedy", "Sorting", "Intervals"], co: ["meta", "amazon"],
    desc: "Balloons are intervals `[xstart, xend]` on the x-axis. An arrow shot at x bursts every balloon with `xstart <= x <= xend`. Return the minimum number of arrows to burst all balloons.",
    cons: ["1 <= points.length <= 10^5", "-2^31 <= xstart < xend <= 2^31 - 1"],
    hints: ["Sort by end and shoot at the end of the first unburst balloon."],
    exp: "Shooting at the smallest end point bursts as many overlapping balloons as possible. Skip every balloon that starts at or before that point, then repeat.",
    steps: ["Sort by end.", "arrows = 1, pos = first end.", "For each balloon starting after pos: arrows++, pos = its end."],
    tc: "O(n log n)", sc: "O(1)",
    fn: ["findMinArrowShots", [["points", "int[][]"]], "int"],
    tests: [[[[[10, 16], [2, 8], [1, 6], [7, 12]]], 2], [[[[1, 2], [3, 4], [5, 6], [7, 8]]], 4], [[[[1, 2], [2, 3], [3, 4], [4, 5]]], 2]],
    js: `
var findMinArrowShots = function(points) {
    points.sort((a, b) => a[1] - b[1]);
    let arrows = 1, pos = points[0][1];
    for (const [s, e] of points) if (s > pos) { arrows++; pos = e; }
    return arrows;
};`,
  },
  {
    t: "Lemonade Change", d: "E", topic: "greedy", sub: "Making change", pat: ["greedy"], tags: ["Greedy", "Simulation"], co: ["amazon", "adobe"],
    desc: "Each lemonade costs $5. Customers pay with $5, $10 or $20 bills in order, and you start with no change. Return `true` if you can give every customer correct change.",
    cons: ["1 <= bills.length <= 10^5", "bills[i] is 5, 10, or 20"],
    hints: ["For a $20, prefer giving a $10 and a $5 over three $5s."],
    exp: "$5 bills are the most flexible change, so preserve them: for $20 use a $10 + $5 when possible.",
    steps: ["Track counts of 5s and 10s.", "Give change greedily; fail if impossible."],
    tc: "O(n)", sc: "O(1)",
    fn: ["lemonadeChange", [["bills", "int[]"]], "bool"],
    tests: [[[[5, 5, 5, 10, 20]], true], [[[5, 5, 10, 10, 20]], false], [[[10]], false]],
    js: `
var lemonadeChange = function(bills) {
    let five = 0, ten = 0;
    for (const b of bills) {
        if (b === 5) five++;
        else if (b === 10) { if (!five) return false; five--; ten++; }
        else if (ten && five) { ten--; five--; }
        else if (five >= 3) five -= 3;
        else return false;
    }
    return true;
};`,
  },
  // ------------------------------------------------------------ backtracking
  {
    t: "Subsets", d: "M", topic: "backtracking", sub: "Include / exclude", pat: ["backtracking", "bit-manipulation"], tags: ["Backtracking", "Array"], co: ["meta", "amazon", "google", "microsoft", "apple"],
    desc: "Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution must not contain duplicate subsets; return them in any order.",
    cons: ["1 <= nums.length <= 10", "All elements are unique"],
    hints: ["Every element is either in or out of a subset.", "Record the current path at every node of the recursion tree."],
    exp: "Backtracking explores a decision tree where each level decides whether to include the next element. Recording the path at every call enumerates all 2ⁿ subsets.",
    steps: ["dfs(start, path): record path.", "For i from start: push nums[i], dfs(i + 1), pop."],
    tc: "O(n · 2ⁿ)", sc: "O(n)",
    fn: ["subsets", [["nums", "int[]"]], "int[][]"],
    cmp: "unorderedNested",
    tests: [[[[1, 2, 3]], [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]], [[[0]], [[], [0]]], [[[5, 9]], [[], [5], [9], [5, 9]]]],
    js: `
var subsets = function(nums) {
    const res = [], path = [];
    const dfs = (start) => {
        res.push(path.slice());
        for (let i = start; i < nums.length; i++) { path.push(nums[i]); dfs(i + 1); path.pop(); }
    };
    dfs(0);
    return res;
};`,
    py: `
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        res, path = [], []
        def dfs(start):
            res.append(path[:])
            for i in range(start, len(nums)):
                path.append(nums[i])
                dfs(i + 1)
                path.pop()
        dfs(0)
        return res`,
  },
  {
    t: "Permutations", d: "M", topic: "backtracking", sub: "Ordering choices", pat: ["backtracking"], tags: ["Backtracking", "Array"], co: ["microsoft", "amazon", "meta", "google"],
    desc: "Given an array `nums` of distinct integers, return all the possible permutations in any order.",
    cons: ["1 <= nums.length <= 6", "All integers are unique"],
    hints: ["Track which elements are already used in the current permutation."],
    exp: "Build permutations position by position. At each level try every unused element, recurse, and undo the choice.",
    steps: ["used[] flags.", "If path length == n record it.", "Try each unused element, recurse, backtrack."],
    tc: "O(n · n!)", sc: "O(n)",
    fn: ["permute", [["nums", "int[]"]], "int[][]"],
    cmp: "unordered",
    tests: [[[[1, 2, 3]], [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]], [[[0, 1]], [[0, 1], [1, 0]]], [[[1]], [[1]]]],
    js: `
var permute = function(nums) {
    const res = [], path = [], used = new Array(nums.length).fill(false);
    const dfs = () => {
        if (path.length === nums.length) { res.push(path.slice()); return; }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true; path.push(nums[i]);
            dfs();
            path.pop(); used[i] = false;
        }
    };
    dfs();
    return res;
};`,
  },
  {
    t: "Combination Sum", d: "M", topic: "backtracking", sub: "Unbounded choices", pat: ["backtracking"], tags: ["Backtracking", "Array"], co: ["amazon", "meta", "microsoft", "google", "atlassian"],
    desc: "Given distinct integers `candidates` and a `target`, return all unique combinations where the chosen numbers sum to `target`. The same number may be chosen unlimited times. Return combinations in any order.",
    cons: ["1 <= candidates.length <= 30", "2 <= candidates[i] <= 40", "1 <= target <= 40"],
    hints: ["Allow reusing the current index, but never go back to earlier indices (avoids duplicate orderings)."],
    exp: "Recurse with a remaining target and a start index. Staying at the same index allows repetition, while never moving backwards prevents the same combination in different orders.",
    steps: ["dfs(start, remain): remain == 0 → record.", "For i from start: if c[i] <= remain, push, dfs(i, remain - c[i]), pop."],
    tc: "O(N^(T/M))", sc: "O(T/M)",
    fn: ["combinationSum", [["candidates", "int[]"], ["target", "int"]], "int[][]"],
    cmp: "unorderedNested",
    tests: [[[[2, 3, 6, 7], 7], [[2, 2, 3], [7]]], [[[2, 3, 5], 8], [[2, 2, 2, 2], [2, 3, 3], [3, 5]]], [[[2], 1], []]],
    js: `
var combinationSum = function(candidates, target) {
    const res = [], path = [];
    const dfs = (start, remain) => {
        if (remain === 0) { res.push(path.slice()); return; }
        for (let i = start; i < candidates.length; i++) {
            if (candidates[i] > remain) continue;
            path.push(candidates[i]);
            dfs(i, remain - candidates[i]);
            path.pop();
        }
    };
    dfs(0, target);
    return res;
};`,
  },
  {
    t: "Combination Sum II", d: "M", topic: "backtracking", sub: "Skipping duplicates", pat: ["backtracking"], tags: ["Backtracking", "Array"], co: ["amazon", "meta", "microsoft"],
    desc: "Given `candidates` (may contain duplicates) and a `target`, return all unique combinations where the numbers sum to `target`. Each number may be used once.",
    cons: ["1 <= candidates.length <= 100", "1 <= candidates[i] <= 50", "1 <= target <= 30"],
    hints: ["Sort first; at each depth skip a value equal to the previous one at the same depth."],
    exp: "Sorting groups duplicates. Skipping equal values at the same recursion level prevents duplicate combinations while still allowing a value to repeat through different positions.",
    steps: ["Sort.", "In the loop, skip i > start with c[i] == c[i - 1].", "Recurse with i + 1."],
    tc: "O(2ⁿ)", sc: "O(n)",
    fn: ["combinationSum2", [["candidates", "int[]"], ["target", "int"]], "int[][]"],
    cmp: "unorderedNested",
    tests: [[[[10, 1, 2, 7, 6, 1, 5], 8], [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]], [[[2, 5, 2, 1, 2], 5], [[1, 2, 2], [5]]]],
    js: `
var combinationSum2 = function(candidates, target) {
    candidates.sort((a, b) => a - b);
    const res = [], path = [];
    const dfs = (start, remain) => {
        if (remain === 0) { res.push(path.slice()); return; }
        for (let i = start; i < candidates.length && candidates[i] <= remain; i++) {
            if (i > start && candidates[i] === candidates[i - 1]) continue;
            path.push(candidates[i]);
            dfs(i + 1, remain - candidates[i]);
            path.pop();
        }
    };
    dfs(0, target);
    return res;
};`,
  },
  {
    t: "N-Queens", d: "H", topic: "backtracking", sub: "Constraint placement", pat: ["backtracking"], tags: ["Backtracking"], co: ["amazon", "microsoft", "google", "apple", "flipkart"],
    desc: "Place `n` queens on an `n x n` chessboard so that no two queens attack each other. Return all distinct solutions; each is a list of strings where 'Q' marks a queen and '.' an empty square. Order does not matter.",
    cons: ["1 <= n <= 9"],
    hints: ["Place one queen per row.", "Track used columns and both diagonals (r - c and r + c)."],
    exp: "Fill rows one at a time. Sets of occupied columns and diagonals make each safety check O(1), and backtracking undoes a placement once its subtree is explored.",
    steps: ["dfs(row): if row == n record board.", "For each column not under attack, place, recurse, remove."],
    tc: "O(n!)", sc: "O(n)",
    fn: ["solveNQueens", [["n", "int"]], "string[][]"],
    cmp: "unordered",
    tests: [[[4], [[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]]], [[1], [["Q"]]], [[2], []]],
    js: `
var solveNQueens = function(n) {
    const res = [], cols = new Set(), d1 = new Set(), d2 = new Set(), pos = [];
    const dfs = (r) => {
        if (r === n) { res.push(pos.map((c) => ".".repeat(c) + "Q" + ".".repeat(n - c - 1))); return; }
        for (let c = 0; c < n; c++) {
            if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
            cols.add(c); d1.add(r - c); d2.add(r + c); pos.push(c);
            dfs(r + 1);
            cols.delete(c); d1.delete(r - c); d2.delete(r + c); pos.pop();
        }
    };
    dfs(0);
    return res;
};`,
  },
  {
    t: "Word Search", d: "M", topic: "backtracking", sub: "Grid backtracking", pat: ["backtracking", "dfs"], tags: ["Backtracking", "Matrix"], co: ["amazon", "microsoft", "meta", "google", "apple", "atlassian"],
    desc: "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid, formed from sequentially adjacent cells (horizontal or vertical) without reusing a cell.",
    cons: ["1 <= m, n <= 6", "1 <= word.length <= 15"],
    hints: ["DFS from each cell, marking cells as visited on the way down and restoring them on the way back."],
    exp: "Try every starting cell. The DFS matches one character at a time, temporarily marking cells to avoid reuse and restoring them when backtracking.",
    steps: ["dfs(i, j, k): k == len → true.", "Check bounds and board[i][j] == word[k].", "Mark, explore 4 neighbours, restore."],
    tc: "O(m·n·3^L)", sc: "O(L)",
    fn: ["exist", [["board", "char[][]"], ["word", "string"]], "bool"],
    tests: [[[[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCCED"], true], [[[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "SEE"], true], [[[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCB"], false]],
    js: `
var exist = function(board, word) {
    const m = board.length, n = board[0].length;
    const dfs = (i, j, k) => {
        if (k === word.length) return true;
        if (i < 0 || j < 0 || i >= m || j >= n || board[i][j] !== word[k]) return false;
        const c = board[i][j];
        board[i][j] = "#";
        const found = dfs(i + 1, j, k + 1) || dfs(i - 1, j, k + 1) || dfs(i, j + 1, k + 1) || dfs(i, j - 1, k + 1);
        board[i][j] = c;
        return found;
    };
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (dfs(i, j, 0)) return true;
    return false;
};`,
  },
  {
    t: "Letter Combinations of a Phone Number", d: "M", topic: "backtracking", sub: "Cartesian products", pat: ["backtracking"], tags: ["Backtracking", "String"], co: ["amazon", "google", "meta", "microsoft", "atlassian"],
    desc: "Given a string of digits 2–9, return all possible letter combinations that the number could represent on a phone keypad, in any order.",
    cons: ["0 <= digits.length <= 4"],
    hints: ["Each digit adds one letter choice to the current prefix."],
    exp: "Recurse over the digits, appending each mapped letter to the prefix. When all digits are used, record the combination.",
    steps: ["If digits empty return [].", "dfs(i, prefix) over the letters of digits[i]."],
    tc: "O(4ⁿ · n)", sc: "O(n)",
    fn: ["letterCombinations", [["digits", "string"]], "string[]"],
    cmp: "unordered",
    tests: [[["23"], ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]], [[""], []], [["2"], ["a", "b", "c"]]],
    js: `
var letterCombinations = function(digits) {
    if (!digits) return [];
    const map = { 2: "abc", 3: "def", 4: "ghi", 5: "jkl", 6: "mno", 7: "pqrs", 8: "tuv", 9: "wxyz" };
    const res = [];
    const dfs = (i, prefix) => {
        if (i === digits.length) { res.push(prefix); return; }
        for (const c of map[digits[i]]) dfs(i + 1, prefix + c);
    };
    dfs(0, "");
    return res;
};`,
  },
  {
    t: "Generate Parentheses", d: "M", topic: "backtracking", sub: "Constrained generation", pat: ["backtracking"], tags: ["Backtracking", "String"], co: ["google", "amazon", "meta", "microsoft", "apple", "adobe"],
    desc: "Given `n` pairs of parentheses, generate all combinations of well-formed parentheses, in any order.",
    cons: ["1 <= n <= 8"],
    hints: ["You can add '(' while open < n and ')' while close < open."],
    exp: "Build strings character by character, only adding a closing bracket when it would match an earlier opening bracket. Every completed string is valid by construction.",
    steps: ["dfs(s, open, close).", "If length 2n record.", "Add '(' if open < n; add ')' if close < open."],
    tc: "O(4ⁿ / √n)", sc: "O(n)",
    fn: ["generateParenthesis", [["n", "int"]], "string[]"],
    cmp: "unordered",
    tests: [[[3], ["((()))", "(()())", "(())()", "()(())", "()()()"]], [[1], ["()"]], [[2], ["(())", "()()"]]],
    js: `
var generateParenthesis = function(n) {
    const res = [];
    const dfs = (s, open, close) => {
        if (s.length === 2 * n) { res.push(s); return; }
        if (open < n) dfs(s + "(", open + 1, close);
        if (close < open) dfs(s + ")", open, close + 1);
    };
    dfs("", 0, 0);
    return res;
};`,
  },
  {
    t: "Palindrome Partitioning", d: "M", topic: "backtracking", sub: "Partition search", pat: ["backtracking", "dynamic-programming"], tags: ["Backtracking", "String"], co: ["amazon", "google", "microsoft"],
    desc: "Given a string `s`, partition it so that every substring is a palindrome. Return all possible partitions in any order.",
    cons: ["1 <= s.length <= 16"],
    hints: ["Choose a palindromic prefix, then partition the rest."],
    exp: "At each position, try every end index that forms a palindrome, add it to the path, and recurse on the remainder.",
    steps: ["dfs(start): start == n → record.", "For end in start..n-1: if s[start..end] palindrome, recurse."],
    tc: "O(n · 2ⁿ)", sc: "O(n)",
    fn: ["partition", [["s", "string"]], "string[][]"],
    cmp: "unordered",
    tests: [[["aab"], [["a", "a", "b"], ["aa", "b"]]], [["a"], [["a"]]], [["aba"], [["a", "b", "a"], ["aba"]]]],
    js: `
var partition = function(s) {
    const res = [], path = [];
    const isPal = (l, r) => { while (l < r) if (s[l++] !== s[r--]) return false; return true; };
    const dfs = (start) => {
        if (start === s.length) { res.push(path.slice()); return; }
        for (let end = start; end < s.length; end++) {
            if (!isPal(start, end)) continue;
            path.push(s.slice(start, end + 1));
            dfs(end + 1);
            path.pop();
        }
    };
    dfs(0);
    return res;
};`,
  },
  {
    t: "Subsets II", d: "M", topic: "backtracking", sub: "Skipping duplicates", pat: ["backtracking"], tags: ["Backtracking", "Array"], co: ["meta", "amazon", "flipkart"],
    desc: "Given an integer array `nums` that may contain duplicates, return all possible subsets without duplicate subsets, in any order.",
    cons: ["1 <= nums.length <= 10"],
    hints: ["Sort, then skip equal values at the same recursion depth."],
    exp: "Same as Subsets, but sorting and skipping duplicates at the same level ensures each distinct subset is generated once.",
    steps: ["Sort.", "Record path at each call.", "Skip i > start with nums[i] == nums[i - 1]."],
    tc: "O(n · 2ⁿ)", sc: "O(n)",
    fn: ["subsetsWithDup", [["nums", "int[]"]], "int[][]"],
    cmp: "unorderedNested",
    tests: [[[[1, 2, 2]], [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]], [[[0]], [[], [0]]]],
    js: `
var subsetsWithDup = function(nums) {
    nums.sort((a, b) => a - b);
    const res = [], path = [];
    const dfs = (start) => {
        res.push(path.slice());
        for (let i = start; i < nums.length; i++) {
            if (i > start && nums[i] === nums[i - 1]) continue;
            path.push(nums[i]); dfs(i + 1); path.pop();
        }
    };
    dfs(0);
    return res;
};`,
  },
  // ------------------------------------------------------------ dynamic programming
  {
    t: "Climbing Stairs", d: "E", topic: "dynamic-programming", sub: "1D DP", pat: ["dynamic-programming"], tags: ["Dynamic Programming", "Math"], co: ["amazon", "google", "microsoft", "apple", "adobe", "flipkart"],
    desc: "You are climbing a staircase with `n` steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you reach the top?",
    cons: ["1 <= n <= 45"],
    hints: ["To reach step i, your last move came from i - 1 or i - 2.", "ways(i) = ways(i - 1) + ways(i - 2)."],
    exp: "The number of ways to reach step i is the sum of ways to reach the two previous steps. It is the Fibonacci recurrence, solvable with two rolling variables.",
    steps: ["a = 1 (step 0), b = 1 (step 1).", "Repeat n - 1 times: [a, b] = [b, a + b].", "Return b."],
    tc: "O(n)", sc: "O(1)",
    fn: ["climbStairs", [["n", "int"]], "int"],
    tests: [[[2], 2], [[3], 3], [[1], 1], [[5], 8], [[45], 1836311903]],
    js: `
var climbStairs = function(n) {
    let a = 1, b = 1;
    for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
    return b;
};`,
    py: `
class Solution:
    def climbStairs(self, n: int) -> int:
        a, b = 1, 1
        for _ in range(n - 1):
            a, b = b, a + b
        return b`,
  },
  {
    t: "House Robber", d: "M", topic: "dynamic-programming", sub: "1D DP", pat: ["dynamic-programming"], tags: ["Dynamic Programming", "Array"], co: ["amazon", "google", "microsoft", "apple", "adobe", "flipkart"],
    desc: "Houses along a street contain money `nums[i]`. You cannot rob two adjacent houses. Return the maximum amount you can rob.",
    cons: ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"],
    hints: ["At each house choose: skip it (keep the previous best) or rob it (best from two houses back + this one)."],
    exp: "dp[i] = max(dp[i - 1], dp[i - 2] + nums[i]). Only the last two values are needed, giving O(1) space.",
    steps: ["prev2 = 0, prev1 = 0.", "For x: cur = max(prev1, prev2 + x); shift.", "Return prev1."],
    tc: "O(n)", sc: "O(1)",
    fn: ["rob", [["nums", "int[]"]], "int"],
    tests: [[[[1, 2, 3, 1]], 4], [[[2, 7, 9, 3, 1]], 12], [[[0]], 0], [[[2, 1, 1, 2]], 4]],
    js: `
var rob = function(nums) {
    let prev2 = 0, prev1 = 0;
    for (const x of nums) [prev2, prev1] = [prev1, Math.max(prev1, prev2 + x)];
    return prev1;
};`,
    py: `
class Solution:
    def rob(self, nums: List[int]) -> int:
        prev2 = prev1 = 0
        for x in nums:
            prev2, prev1 = prev1, max(prev1, prev2 + x)
        return prev1`,
  },
  {
    t: "Coin Change", d: "M", topic: "dynamic-programming", sub: "Unbounded knapsack", pat: ["dynamic-programming", "bfs"], tags: ["Dynamic Programming", "BFS"], co: ["amazon", "google", "microsoft", "meta", "apple", "flipkart", "atlassian"],
    desc: "Given coin denominations `coins` and an `amount`, return the fewest number of coins needed to make up that amount, or -1 if it cannot be made. You have an infinite number of each coin.",
    cons: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
    hints: ["Greedy fails for some coin systems (e.g. [1, 3, 4] for 6).", "dp[a] = 1 + min(dp[a - c]) over coins c."],
    exp: "Build the answer for every amount from 0 up. The best way to make amount a uses some last coin c, so dp[a] = min over c of dp[a - c] + 1.",
    steps: ["dp = [0, Infinity × amount].", "For a in 1..amount, for c in coins: dp[a] = min(dp[a], dp[a - c] + 1).", "Return dp[amount] or -1."],
    tc: "O(amount · coins)", sc: "O(amount)",
    fn: ["coinChange", [["coins", "int[]"], ["amount", "int"]], "int"],
    tests: [[[[1, 2, 5], 11], 3], [[[2], 3], -1], [[[1], 0], 0], [[[1, 3, 4], 6], 2], [[[186, 419, 83, 408], 6249], 20]],
    js: `
var coinChange = function(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (let a = 1; a <= amount; a++)
        for (const c of coins) if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
    return dp[amount] === Infinity ? -1 : dp[amount];
};`,
    py: `
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        dp = [0] + [float("inf")] * amount
        for a in range(1, amount + 1):
            for c in coins:
                if c <= a:
                    dp[a] = min(dp[a], dp[a - c] + 1)
        return -1 if dp[amount] == float("inf") else dp[amount]`,
  },
  {
    t: "Longest Increasing Subsequence", d: "M", topic: "dynamic-programming", sub: "Subsequence DP", pat: ["dynamic-programming", "binary-search"], tags: ["Dynamic Programming", "Binary Search"], co: ["google", "amazon", "microsoft", "meta", "apple", "flipkart"],
    desc: "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
    cons: ["1 <= nums.length <= 2500", "-10^4 <= nums[i] <= 10^4"],
    hints: ["O(n²): dp[i] = 1 + max(dp[j]) for j < i with nums[j] < nums[i].", "O(n log n): keep the smallest tail for each subsequence length."],
    exp: "Patience sorting keeps tails[k] = smallest possible tail of an increasing subsequence of length k + 1. Each number replaces the first tail >= it (binary search) or extends the list.",
    steps: ["tails = [].", "For x: find lower bound of x in tails; replace or append.", "Return tails.length."],
    tc: "O(n log n)", sc: "O(n)",
    fn: ["lengthOfLIS", [["nums", "int[]"]], "int"],
    tests: [[[[10, 9, 2, 5, 3, 7, 101, 18]], 4], [[[0, 1, 0, 3, 2, 3]], 4], [[[7, 7, 7, 7]], 1], [[[4, 10, 4, 3, 8, 9]], 3]],
    js: `
var lengthOfLIS = function(nums) {
    const tails = [];
    for (const x of nums) {
        let lo = 0, hi = tails.length;
        while (lo < hi) { const m = (lo + hi) >> 1; if (tails[m] < x) lo = m + 1; else hi = m; }
        tails[lo] = x;
    }
    return tails.length;
};`,
    alt: [{ name: "Quadratic DP", time: "O(n²)", space: "O(n)", note: "dp[i] = longest subsequence ending at i. Easier to derive, fine for n ≤ 2500." }],
  },
  {
    t: "Longest Common Subsequence", d: "M", topic: "dynamic-programming", sub: "2D string DP", pat: ["dynamic-programming"], tags: ["Dynamic Programming", "String"], co: ["amazon", "google", "microsoft", "adobe", "flipkart"],
    desc: "Given two strings `text1` and `text2`, return the length of their longest common subsequence, or 0 if there is none.",
    cons: ["1 <= text1.length, text2.length <= 1000", "Lowercase English letters"],
    hints: ["dp[i][j] = LCS of the first i characters of text1 and first j of text2."],
    exp: "If the last characters match, they extend the LCS of both prefixes; otherwise drop one character from either string and take the better result.",
    steps: ["dp of size (m + 1) × (n + 1) filled with 0.", "dp[i][j] = a[i-1] == b[j-1] ? dp[i-1][j-1] + 1 : max(dp[i-1][j], dp[i][j-1]).", "Return dp[m][n]."],
    tc: "O(m·n)", sc: "O(min(m, n)) with rolling rows",
    fn: ["longestCommonSubsequence", [["text1", "string"], ["text2", "string"]], "int"],
    tests: [[["abcde", "ace"], 3], [["abc", "abc"], 3], [["abc", "def"], 0], [["bsbininm", "jmjkbkjkv"], 1]],
    js: `
var longestCommonSubsequence = function(text1, text2) {
    const m = text1.length, n = text2.length;
    let prev = new Array(n + 1).fill(0);
    for (let i = 1; i <= m; i++) {
        const cur = new Array(n + 1).fill(0);
        for (let j = 1; j <= n; j++)
            cur[j] = text1[i - 1] === text2[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
        prev = cur;
    }
    return prev[n];
};`,
    py: `
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        prev = [0] * (len(text2) + 1)
        for a in text1:
            cur = [0]
            for j, b in enumerate(text2, 1):
                cur.append(prev[j - 1] + 1 if a == b else max(prev[j], cur[-1]))
            prev = cur
        return prev[-1]`,
  },
  {
    t: "0/1 Knapsack", d: "M", topic: "dynamic-programming", sub: "Bounded knapsack", pat: ["dynamic-programming"], tags: ["Dynamic Programming", "Knapsack"], co: ["amazon", "microsoft", "flipkart", "adobe", "google"],
    desc: "Given `n` items with `weights[i]` and `values[i]` and a knapsack of `capacity`, choose a subset of items (each at most once) with total weight at most `capacity` that maximises total value. Return that value.",
    cons: ["1 <= n <= 100", "1 <= weights[i] <= 1000", "0 <= capacity <= 1000"],
    hints: ["dp[w] = best value with capacity w.", "Iterate capacities downward so each item is used at most once."],
    exp: "For each item, decide to skip it or take it. A 1D table over capacities works if you iterate capacities from high to low, so the item is not counted twice.",
    steps: ["dp = zeros(capacity + 1).", "For each item i, for w from capacity down to weights[i]: dp[w] = max(dp[w], dp[w - weights[i]] + values[i]).", "Return dp[capacity]."],
    tc: "O(n · capacity)", sc: "O(capacity)",
    fn: ["knapsack", [["weights", "int[]"], ["values", "int[]"], ["capacity", "int"]], "int"],
    tests: [[[[1, 3, 4, 5], [1, 4, 5, 7], 7], 9], [[[4, 5, 1], [1, 2, 3], 4], 3], [[[5], [10], 4], 0], [[[10, 20, 30], [60, 100, 120], 50], 220]],
    js: `
var knapsack = function(weights, values, capacity) {
    const dp = new Array(capacity + 1).fill(0);
    for (let i = 0; i < weights.length; i++)
        for (let w = capacity; w >= weights[i]; w--) dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    return dp[capacity];
};`,
    py: `
class Solution:
    def knapsack(self, weights: List[int], values: List[int], capacity: int) -> int:
        dp = [0] * (capacity + 1)
        for wt, val in zip(weights, values):
            for w in range(capacity, wt - 1, -1):
                dp[w] = max(dp[w], dp[w - wt] + val)
        return dp[capacity]`,
  },
  {
    t: "House Robber II", d: "M", topic: "dynamic-programming", sub: "Circular DP", pat: ["dynamic-programming"], tags: ["Dynamic Programming"], co: ["amazon", "google", "microsoft"],
    desc: "Houses are arranged in a circle, so the first and last houses are adjacent. Without robbing adjacent houses, return the maximum amount you can rob.",
    cons: ["1 <= nums.length <= 100", "0 <= nums[i] <= 1000"],
    hints: ["You cannot rob both the first and last house; solve the line problem twice."],
    exp: "Either the first house is excluded or the last house is excluded. Run linear House Robber on both ranges and take the maximum.",
    steps: ["If n == 1 return nums[0].", "Return max(rob(0..n-2), rob(1..n-1))."],
    tc: "O(n)", sc: "O(1)",
    fn: ["rob", [["nums", "int[]"]], "int"],
    tests: [[[[2, 3, 2]], 3], [[[1, 2, 3, 1]], 4], [[[1, 2, 3]], 3], [[[5]], 5]],
    js: `
var rob = function(nums) {
    if (nums.length === 1) return nums[0];
    const line = (lo, hi) => { let a = 0, b = 0; for (let i = lo; i <= hi; i++) [a, b] = [b, Math.max(b, a + nums[i])]; return b; };
    return Math.max(line(0, nums.length - 2), line(1, nums.length - 1));
};`,
  },
  {
    t: "Unique Paths", d: "M", topic: "dynamic-programming", sub: "Grid DP", pat: ["dynamic-programming"], tags: ["Dynamic Programming", "Math", "Combinatorics"], co: ["google", "amazon", "meta", "microsoft", "apple"],
    desc: "A robot on an `m x n` grid starts at the top-left and can only move right or down. How many unique paths lead to the bottom-right corner?",
    cons: ["1 <= m, n <= 100", "The answer is at most 2 * 10^9"],
    hints: ["paths(i, j) = paths(i - 1, j) + paths(i, j - 1)."],
    exp: "Each cell is reached from above or from the left, so its count is the sum of those two counts. A single row array suffices.",
    steps: ["row = ones(n).", "For each next row, row[j] += row[j - 1].", "Return row[n - 1]."],
    tc: "O(m·n)", sc: "O(n)",
    fn: ["uniquePaths", [["m", "int"], ["n", "int"]], "int"],
    tests: [[[3, 7], 28], [[3, 2], 3], [[1, 1], 1], [[10, 10], 48620]],
    js: `
var uniquePaths = function(m, n) {
    const row = new Array(n).fill(1);
    for (let i = 1; i < m; i++) for (let j = 1; j < n; j++) row[j] += row[j - 1];
    return row[n - 1];
};`,
    alt: [{ name: "Combinatorics", time: "O(min(m, n))", space: "O(1)", note: "Choose which m - 1 of the m + n - 2 moves go down: C(m + n - 2, m - 1)." }],
  },
  {
    t: "Word Break", d: "M", topic: "dynamic-programming", sub: "Segmentation DP", pat: ["dynamic-programming", "hash-map"], tags: ["Dynamic Programming", "Trie", "String"], co: ["amazon", "google", "meta", "microsoft", "apple", "flipkart"],
    desc: "Given a string `s` and a dictionary `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words (words may be reused).",
    cons: ["1 <= s.length <= 300", "1 <= wordDict.length <= 1000"],
    hints: ["dp[i] = can the prefix of length i be segmented?"],
    exp: "A prefix is breakable if some shorter breakable prefix is followed by a dictionary word that reaches i.",
    steps: ["dp[0] = true.", "For i in 1..n, for j < i: if dp[j] and s[j..i) in dict, dp[i] = true.", "Return dp[n]."],
    tc: "O(n² · L)", sc: "O(n)",
    fn: ["wordBreak", [["s", "string"], ["wordDict", "string[]"]], "bool"],
    tests: [[["leetcode", ["leet", "code"]], true], [["applepenapple", ["apple", "pen"]], true], [["catsandog", ["cats", "dog", "sand", "and", "cat"]], false], [["a", ["b"]], false]],
    js: `
var wordBreak = function(s, wordDict) {
    const dict = new Set(wordDict), dp = new Array(s.length + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= s.length; i++)
        for (let j = 0; j < i && !dp[i]; j++) if (dp[j] && dict.has(s.slice(j, i))) dp[i] = true;
    return dp[s.length];
};`,
  },
  {
    t: "Decode Ways", d: "M", topic: "dynamic-programming", sub: "Counting DP", pat: ["dynamic-programming"], tags: ["Dynamic Programming", "String"], co: ["meta", "amazon", "google", "microsoft"],
    desc: "A message of letters is encoded with A → 1, ..., Z → 26. Given a digit string `s`, return the number of ways to decode it.",
    cons: ["1 <= s.length <= 100", "s contains only digits and may have leading zeros"],
    hints: ["A single digit 1–9 decodes alone; a pair 10–26 decodes together."],
    exp: "ways[i] adds ways[i - 1] if the last digit is non-zero, and ways[i - 2] if the last two digits form 10–26.",
    steps: ["a = 1 (empty), b = s[0] != '0'.", "For each i ≥ 2 compute c from the two rules.", "Return b."],
    tc: "O(n)", sc: "O(1)",
    fn: ["numDecodings", [["s", "string"]], "int"],
    tests: [[["12"], 2], [["226"], 3], [["06"], 0], [["11106"], 2], [["10"], 1]],
    js: `
var numDecodings = function(s) {
    let a = 1, b = s[0] === "0" ? 0 : 1;
    for (let i = 2; i <= s.length; i++) {
        let c = 0;
        if (s[i - 1] !== "0") c += b;
        const two = Number(s.slice(i - 2, i));
        if (two >= 10 && two <= 26) c += a;
        a = b; b = c;
    }
    return b;
};`,
  },
  {
    t: "Edit Distance", d: "M", topic: "dynamic-programming", sub: "2D string DP", pat: ["dynamic-programming"], tags: ["Dynamic Programming", "String"], co: ["google", "amazon", "microsoft", "meta", "adobe"],
    desc: "Given two strings `word1` and `word2`, return the minimum number of operations (insert, delete or replace a character) needed to convert `word1` into `word2`.",
    cons: ["0 <= word1.length, word2.length <= 500"],
    hints: ["dp[i][j] = edit distance between the first i chars of word1 and the first j of word2."],
    exp: "If the last characters match, no operation is needed for them. Otherwise take 1 + the minimum of insert (dp[i][j-1]), delete (dp[i-1][j]) and replace (dp[i-1][j-1]).",
    steps: ["Base: dp[i][0] = i, dp[0][j] = j.", "Fill with the recurrence.", "Return dp[m][n]."],
    tc: "O(m·n)", sc: "O(n)",
    fn: ["minDistance", [["word1", "string"], ["word2", "string"]], "int"],
    tests: [[["horse", "ros"], 3], [["intention", "execution"], 5], [["", "a"], 1], [["abc", "abc"], 0]],
    js: `
var minDistance = function(word1, word2) {
    const m = word1.length, n = word2.length;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
        const cur = [i];
        for (let j = 1; j <= n; j++)
            cur[j] = word1[i - 1] === word2[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j], cur[j - 1], prev[j - 1]);
        prev = cur;
    }
    return prev[n];
};`,
  },
  {
    t: "Partition Equal Subset Sum", d: "M", topic: "dynamic-programming", sub: "Subset-sum knapsack", pat: ["dynamic-programming"], tags: ["Dynamic Programming", "Knapsack"], co: ["amazon", "meta", "google", "flipkart"],
    desc: "Given an integer array `nums`, return `true` if you can partition it into two subsets with equal sums.",
    cons: ["1 <= nums.length <= 200", "1 <= nums[i] <= 100"],
    hints: ["You need a subset summing to total / 2.", "This is 0/1 knapsack with booleans."],
    exp: "If the total is odd it is impossible. Otherwise check whether some subset sums to half the total using a boolean knapsack over sums, iterating sums downward.",
    steps: ["If total odd return false.", "can[0] = true; for x, for s from half down to x: can[s] ||= can[s - x].", "Return can[half]."],
    tc: "O(n · sum)", sc: "O(sum)",
    fn: ["canPartition", [["nums", "int[]"]], "bool"],
    tests: [[[[1, 5, 11, 5]], true], [[[1, 2, 3, 5]], false], [[[2, 2]], true], [[[1]], false]],
    js: `
var canPartition = function(nums) {
    const total = nums.reduce((a, b) => a + b, 0);
    if (total % 2) return false;
    const half = total / 2, can = new Array(half + 1).fill(false);
    can[0] = true;
    for (const x of nums) for (let s = half; s >= x; s--) if (can[s - x]) can[s] = true;
    return can[half];
};`,
  },
  {
    t: "Min Cost Climbing Stairs", d: "E", topic: "dynamic-programming", sub: "1D DP", pat: ["dynamic-programming"], tags: ["Dynamic Programming"], co: ["amazon", "adobe"],
    desc: "`cost[i]` is the cost of step `i`. After paying, you can climb one or two steps. You may start at step 0 or 1. Return the minimum cost to reach the top (beyond the last step).",
    cons: ["2 <= cost.length <= 1000", "0 <= cost[i] <= 999"],
    hints: ["dp[i] = min cost to stand on step i = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])."],
    exp: "The cheapest way to reach step i comes from step i - 1 or i - 2 plus that step's cost. Two rolling variables suffice.",
    steps: ["a = b = 0.", "For i from 2 to n: c = min(b + cost[i-1], a + cost[i-2]).", "Return b."],
    tc: "O(n)", sc: "O(1)",
    fn: ["minCostClimbingStairs", [["cost", "int[]"]], "int"],
    tests: [[[[10, 15, 20]], 15], [[[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]], 6], [[[0, 0]], 0]],
    js: `
var minCostClimbingStairs = function(cost) {
    let a = 0, b = 0;
    for (let i = 2; i <= cost.length; i++) [a, b] = [b, Math.min(b + cost[i - 1], a + cost[i - 2])];
    return b;
};`,
  },
  {
    t: "Coin Change II", d: "M", topic: "dynamic-programming", sub: "Counting combinations", pat: ["dynamic-programming"], tags: ["Dynamic Programming"], co: ["amazon", "google", "microsoft"],
    desc: "Given coin denominations `coins` and an `amount`, return the number of combinations that make up that amount (order does not matter). Each coin can be used unlimited times.",
    cons: ["1 <= coins.length <= 300", "0 <= amount <= 5000"],
    hints: ["Loop over coins in the outer loop to count combinations, not permutations."],
    exp: "Processing coins one at a time ensures each combination is counted once in a fixed coin order: ways[a] += ways[a - c].",
    steps: ["ways[0] = 1.", "For each coin c, for a from c to amount: ways[a] += ways[a - c]."],
    tc: "O(amount · coins)", sc: "O(amount)",
    fn: ["change", [["amount", "int"], ["coins", "int[]"]], "int"],
    tests: [[[5, [1, 2, 5]], 4], [[3, [2]], 0], [[10, [10]], 1], [[0, [7]], 1]],
    js: `
var change = function(amount, coins) {
    const ways = new Array(amount + 1).fill(0);
    ways[0] = 1;
    for (const c of coins) for (let a = c; a <= amount; a++) ways[a] += ways[a - c];
    return ways[amount];
};`,
  },
  {
    t: "Target Sum", d: "M", topic: "dynamic-programming", sub: "Subset-sum counting", pat: ["dynamic-programming", "backtracking"], tags: ["Dynamic Programming", "Backtracking"], co: ["meta", "google", "amazon"],
    desc: "Given `nums` and a `target`, assign '+' or '-' to each number. Return the number of assignments whose expression evaluates to `target`.",
    cons: ["1 <= nums.length <= 20", "0 <= nums[i] <= 1000", "-1000 <= target <= 1000"],
    hints: ["If P is the positive set, sum(P) = (total + target) / 2."],
    exp: "The problem reduces to counting subsets that sum to (total + target) / 2, a classic counting knapsack.",
    steps: ["If (total + target) is odd or |target| > total, return 0.", "Count subsets summing to s with a 1D DP iterating downward."],
    tc: "O(n · sum)", sc: "O(sum)",
    fn: ["findTargetSumWays", [["nums", "int[]"], ["target", "int"]], "int"],
    tests: [[[[1, 1, 1, 1, 1], 3], 5], [[[1], 1], 1], [[[1], 2], 0], [[[0, 0, 1], 1], 4]],
    js: `
var findTargetSumWays = function(nums, target) {
    const total = nums.reduce((a, b) => a + b, 0);
    if (Math.abs(target) > total || (total + target) % 2) return 0;
    const s = (total + target) / 2, dp = new Array(s + 1).fill(0);
    dp[0] = 1;
    for (const x of nums) for (let v = s; v >= x; v--) dp[v] += dp[v - x];
    return dp[s];
};`,
  },
  {
    t: "Burst Balloons", d: "H", topic: "dynamic-programming", sub: "Interval DP", pat: ["dynamic-programming"], tags: ["Dynamic Programming", "Divide and Conquer"], co: ["google", "amazon", "microsoft"],
    desc: "Balloons `nums` are in a row. Bursting balloon i earns `nums[i-1] * nums[i] * nums[i+1]` (out-of-range neighbours count as 1), after which its neighbours become adjacent. Return the maximum coins you can collect.",
    cons: ["1 <= n <= 300", "0 <= nums[i] <= 100"],
    hints: ["Think about which balloon in a range is burst last."],
    exp: "Let dp[l][r] be the best score for bursting everything strictly between l and r. If k is the last balloon burst in that range, its neighbours are l and r, giving dp[l][k] + val[l]·val[k]·val[r] + dp[k][r].",
    steps: ["Pad nums with 1 at both ends.", "Fill dp by increasing gap r - l.", "Return dp[0][n + 1]."],
    tc: "O(n³)", sc: "O(n²)",
    fn: ["maxCoins", [["nums", "int[]"]], "int"],
    tests: [[[[3, 1, 5, 8]], 167], [[[1, 5]], 10], [[[7]], 7]],
    js: `
var maxCoins = function(nums) {
    const v = [1, ...nums, 1], n = v.length;
    const dp = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let gap = 2; gap < n; gap++)
        for (let l = 0; l + gap < n; l++) {
            const r = l + gap;
            for (let k = l + 1; k < r; k++) dp[l][r] = Math.max(dp[l][r], dp[l][k] + v[l] * v[k] * v[r] + dp[k][r]);
        }
    return dp[0][n - 1];
};`,
  },
  {
    t: "Longest Palindromic Subsequence", d: "M", topic: "dynamic-programming", sub: "Interval DP", pat: ["dynamic-programming"], tags: ["Dynamic Programming", "String"], co: ["amazon", "microsoft", "flipkart"],
    desc: "Given a string `s`, find the length of the longest palindromic subsequence in `s`.",
    cons: ["1 <= s.length <= 1000"],
    hints: ["It equals the LCS of s and its reverse.", "Or: dp[i][j] over substrings."],
    exp: "dp[i][j] is the answer for s[i..j]. Matching ends add 2 to the inner answer; otherwise drop one end and take the best.",
    steps: ["dp[i][i] = 1.", "For i from n - 1 down, j from i + 1 up: apply the recurrence.", "Return dp[0][n - 1]."],
    tc: "O(n²)", sc: "O(n)",
    fn: ["longestPalindromeSubseq", [["s", "string"]], "int"],
    tests: [[["bbbab"], 4], [["cbbd"], 2], [["a"], 1], [["agbdba"], 5]],
    js: `
var longestPalindromeSubseq = function(s) {
    const n = s.length;
    let next = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        const cur = new Array(n).fill(0);
        cur[i] = 1;
        for (let j = i + 1; j < n; j++) cur[j] = s[i] === s[j] ? next[j - 1] + 2 : Math.max(next[j], cur[j - 1]);
        next = cur;
    }
    return next[n - 1];
};`,
  },
  // ------------------------------------------------------------ bit manipulation
  {
    t: "Single Number", d: "E", topic: "bit-manipulation", sub: "XOR tricks", pat: ["bit-manipulation"], tags: ["Bit Manipulation", "Array"], co: ["amazon", "google", "apple", "adobe"],
    desc: "Given a non-empty array of integers `nums` where every element appears twice except one, find that single one in O(n) time and O(1) space.",
    cons: ["1 <= nums.length <= 3 * 10^4", "Each element appears twice except one"],
    hints: ["x ^ x = 0 and x ^ 0 = x."],
    exp: "XOR is commutative and cancels pairs, so XOR-ing every element leaves only the element that appears once.",
    steps: ["acc = 0.", "acc ^= x for all x.", "Return acc."],
    tc: "O(n)", sc: "O(1)",
    fn: ["singleNumber", [["nums", "int[]"]], "int"],
    tests: [[[[2, 2, 1]], 1], [[[4, 1, 2, 1, 2]], 4], [[[1]], 1], [[[-3, 7, 7]], -3]],
    js: `
var singleNumber = function(nums) {
    return nums.reduce((a, b) => a ^ b, 0);
};`,
    py: `
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        return reduce(lambda a, b: a ^ b, nums, 0)`,
  },
  {
    t: "Number of 1 Bits", d: "E", topic: "bit-manipulation", sub: "Bit counting", pat: ["bit-manipulation"], tags: ["Bit Manipulation"], co: ["apple", "microsoft", "amazon"],
    desc: "Given a positive integer `n`, return the number of set bits in its binary representation (its Hamming weight).",
    cons: ["1 <= n <= 2^31 - 1"],
    hints: ["n & (n - 1) clears the lowest set bit."],
    exp: "Brian Kernighan's trick removes one set bit per iteration, so the loop runs once per set bit.",
    steps: ["count = 0.", "While n: n &= n - 1; count++."],
    tc: "O(number of set bits)", sc: "O(1)",
    fn: ["hammingWeight", [["n", "int"]], "int"],
    tests: [[[11], 3], [[128], 1], [[2147483645], 30]],
    js: `
var hammingWeight = function(n) {
    let count = 0;
    while (n) { n &= n - 1; count++; }
    return count;
};`,
  },
  {
    t: "Counting Bits", d: "E", topic: "bit-manipulation", sub: "Bit DP", pat: ["bit-manipulation", "dynamic-programming"], tags: ["Bit Manipulation", "Dynamic Programming"], co: ["amazon", "apple", "adobe"],
    desc: "Given an integer `n`, return an array `ans` of length `n + 1` where `ans[i]` is the number of 1s in the binary representation of `i`.",
    cons: ["0 <= n <= 10^5"],
    hints: ["bits(i) = bits(i >> 1) + (i & 1)."],
    exp: "Shifting right drops the lowest bit, whose count we already know, so each answer is derived from a smaller one in O(1).",
    steps: ["ans[0] = 0.", "ans[i] = ans[i >> 1] + (i & 1)."],
    tc: "O(n)", sc: "O(n)",
    fn: ["countBits", [["n", "int"]], "int[]"],
    tests: [[[2], [0, 1, 1]], [[5], [0, 1, 1, 2, 1, 2]], [[0], [0]]],
    js: `
var countBits = function(n) {
    const ans = new Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++) ans[i] = ans[i >> 1] + (i & 1);
    return ans;
};`,
  },
  {
    t: "Reverse Bits", d: "E", topic: "bit-manipulation", sub: "Bit shifting", pat: ["bit-manipulation"], tags: ["Bit Manipulation"], co: ["apple", "amazon", "microsoft"],
    desc: "Reverse the bits of a given 32-bit unsigned integer `n` and return the result as an unsigned integer.",
    cons: ["0 <= n <= 2^32 - 1"],
    hints: ["Shift the result left and append the lowest bit of n, 32 times."],
    exp: "Peel bits off n from the right and push them onto the result from the left. In JavaScript, use >>> 0 to keep the value unsigned.",
    steps: ["res = 0.", "Repeat 32 times: res = (res << 1) | (n & 1); n >>>= 1.", "Return res >>> 0."],
    tc: "O(32)", sc: "O(1)",
    fn: ["reverseBits", [["n", "long"]], "long"],
    tests: [[[43261596], 964176192], [[4294967293], 3221225471], [[0], 0]],
    js: `
var reverseBits = function(n) {
    let res = 0;
    for (let i = 0; i < 32; i++) { res = (res << 1) | (n & 1); n >>>= 1; }
    return res >>> 0;
};`,
  },
  {
    t: "Sum of Two Integers", d: "M", topic: "bit-manipulation", sub: "Bitwise arithmetic", pat: ["bit-manipulation"], tags: ["Bit Manipulation", "Math"], co: ["meta", "apple", "microsoft"],
    desc: "Given two integers `a` and `b`, return their sum without using the operators `+` and `-`.",
    cons: ["-1000 <= a, b <= 1000"],
    hints: ["a ^ b adds without carry; (a & b) << 1 is the carry."],
    exp: "Repeat: the sum without carry is a ^ b and the carry is (a & b) << 1. When the carry becomes 0, the partial sum is the answer.",
    steps: ["While b != 0: carry = (a & b) << 1; a = a ^ b; b = carry.", "Return a."],
    tc: "O(32)", sc: "O(1)",
    fn: ["getSum", [["a", "int"], ["b", "int"]], "int"],
    tests: [[[1, 2], 3], [[2, 3], 5], [[-1, 1], 0], [[-12, -8], -20]],
    js: `
var getSum = function(a, b) {
    while (b !== 0) { const carry = (a & b) << 1; a = a ^ b; b = carry; }
    return a;
};`,
  },
  {
    t: "Power of Two", d: "E", topic: "bit-manipulation", sub: "Single set bit", pat: ["bit-manipulation"], tags: ["Bit Manipulation", "Math"], co: ["google", "amazon", "apple"],
    desc: "Given an integer `n`, return `true` if it is a power of two.",
    cons: ["-2^31 <= n <= 2^31 - 1"],
    hints: ["Powers of two have exactly one set bit."],
    exp: "A positive number with exactly one set bit satisfies n & (n - 1) == 0.",
    steps: ["Return n > 0 && (n & (n - 1)) === 0."],
    tc: "O(1)", sc: "O(1)",
    fn: ["isPowerOfTwo", [["n", "int"]], "bool"],
    tests: [[[1], true], [[16], true], [[3], false], [[0], false], [[-16], false]],
    js: `
var isPowerOfTwo = function(n) {
    return n > 0 && (n & (n - 1)) === 0;
};`,
  },
  {
    t: "Single Number II", d: "M", topic: "bit-manipulation", sub: "Bit counting per position", pat: ["bit-manipulation"], tags: ["Bit Manipulation"], co: ["google", "amazon"],
    desc: "Given `nums` where every element appears three times except one which appears once, return the single element in linear time and constant space.",
    cons: ["1 <= nums.length <= 3 * 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
    hints: ["Count each bit position modulo 3."],
    exp: "For each of the 32 bit positions, the count of set bits across all numbers modulo 3 is exactly that bit of the single number.",
    steps: ["For bit 0..31: count set bits; if count % 3, set the bit in the result.", "Return the result as a signed 32-bit integer."],
    tc: "O(32n)", sc: "O(1)",
    fn: ["singleNumber", [["nums", "int[]"]], "int"],
    tests: [[[[2, 2, 3, 2]], 3], [[[0, 1, 0, 1, 0, 1, 99]], 99], [[[-2, -2, 1, 1, 4, 1, 4, 4, -4, -2]], -4]],
    js: `
var singleNumber = function(nums) {
    let res = 0;
    for (let b = 0; b < 32; b++) {
        let c = 0;
        for (const x of nums) c += (x >> b) & 1;
        if (c % 3) res |= 1 << b;
    }
    return res;
};`,
  },
  // ------------------------------------------------------------ divide & conquer
  {
    t: "Different Ways to Add Parentheses", d: "M", topic: "divide-and-conquer", sub: "Split on operators", pat: ["dynamic-programming"], tags: ["Divide and Conquer", "Recursion", "Memoization"], co: ["google", "amazon"],
    desc: "Given a string `expression` of numbers and operators (+, -, *), return all possible results from computing all the different ways to group numbers and operators, in any order.",
    cons: ["1 <= expression.length <= 20", "Numbers are in [0, 99]"],
    hints: ["Every operator can be the last one evaluated; split there."],
    exp: "For each operator, recursively compute all results of the left and right sides and combine every pair. Memoising substrings avoids recomputation.",
    steps: ["If no operator, return [number].", "For each operator split, combine left × right results."],
    tc: "O(Catalan(n))", sc: "O(Catalan(n))",
    fn: ["diffWaysToCompute", [["expression", "string"]], "int[]"],
    cmp: "unordered",
    tests: [[["2-1-1"], [0, 2]], [["2*3-4*5"], [-34, -14, -10, -10, 10]], [["11"], [11]]],
    js: `
var diffWaysToCompute = function(expression) {
    const memo = new Map();
    const go = (s) => {
        if (memo.has(s)) return memo.get(s);
        const res = [];
        for (let i = 0; i < s.length; i++) {
            const c = s[i];
            if (c !== "+" && c !== "-" && c !== "*") continue;
            for (const a of go(s.slice(0, i))) for (const b of go(s.slice(i + 1)))
                res.push(c === "+" ? a + b : c === "-" ? a - b : a * b);
        }
        if (!res.length) res.push(Number(s));
        memo.set(s, res);
        return res;
    };
    return go(expression);
};`,
  },
  {
    t: "Count of Range Sum", d: "H", topic: "divide-and-conquer", sub: "Merge-sort counting", pat: ["prefix-sum"], tags: ["Divide and Conquer", "Merge Sort", "Prefix Sum"], co: ["google", "amazon"],
    desc: "Given an integer array `nums` and two integers `lower` and `upper`, return the number of range sums that lie in `[lower, upper]` inclusive. A range sum S(i, j) is the sum of `nums[i..j]`.",
    cons: ["1 <= nums.length <= 10^5", "-10^5 <= lower <= upper <= 10^5"],
    hints: ["Range sums are differences of prefix sums.", "During merge sort of prefix sums, count pairs across the halves with two moving pointers."],
    exp: "With prefix sums P, count pairs i < j with lower <= P[j] - P[i] <= upper. Merge sort keeps each half sorted, so for every left element two pointers find the valid window in the right half.",
    steps: ["Build prefix sums with a leading 0.", "Recursive merge sort; for each left value advance lo/hi pointers in the right half.", "Add hi - lo per left value."],
    tc: "O(n log n)", sc: "O(n)",
    fn: ["countRangeSum", [["nums", "int[]"], ["lower", "int"], ["upper", "int"]], "int"],
    tests: [[[[-2, 5, -1], -2, 2], 3], [[[0], 0, 0], 1], [[[1, 2, 3], 3, 5], 3]],
    js: `
var countRangeSum = function(nums, lower, upper) {
    const P = [0];
    for (const x of nums) P.push(P[P.length - 1] + x);
    const sort = (a) => {
        if (a.length < 2) return [a, 0];
        const mid = a.length >> 1;
        const [L, c1] = sort(a.slice(0, mid)), [R, c2] = sort(a.slice(mid));
        let c = c1 + c2, lo = 0, hi = 0;
        for (const x of L) {
            while (lo < R.length && R[lo] - x < lower) lo++;
            while (hi < R.length && R[hi] - x <= upper) hi++;
            c += hi - lo;
        }
        const out = []; let i = 0, j = 0;
        while (i < L.length || j < R.length) out.push(j >= R.length || (i < L.length && L[i] <= R[j]) ? L[i++] : R[j++]);
        return [out, c];
    };
    return sort(P)[1];
};`,
  },
  {
    t: "Search a 2D Matrix II", d: "M", topic: "divide-and-conquer", sub: "Eliminating quadrants", pat: ["binary-search", "two-pointers"], tags: ["Divide and Conquer", "Matrix", "Binary Search"], co: ["amazon", "microsoft", "google", "apple"],
    desc: "Search for `target` in an `m x n` matrix where each row is sorted left to right and each column is sorted top to bottom.",
    cons: ["1 <= m, n <= 300", "-10^9 <= values, target <= 10^9"],
    hints: ["Start at the top-right corner: moving left decreases, moving down increases."],
    exp: "From the top-right corner, every comparison eliminates a full row or column, reducing the search space like a divide-and-conquer staircase.",
    steps: ["r = 0, c = n - 1.", "If value > target c--, if < target r++, else found."],
    tc: "O(m + n)", sc: "O(1)",
    fn: ["searchMatrix", [["matrix", "int[][]"], ["target", "int"]], "bool"],
    tests: [[[[[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 5], true], [[[[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 20], false], [[[[-5]], -5], true]],
    js: `
var searchMatrix = function(matrix, target) {
    let r = 0, c = matrix[0].length - 1;
    while (r < matrix.length && c >= 0) {
        const v = matrix[r][c];
        if (v === target) return true;
        if (v > target) c--; else r++;
    }
    return false;
};`,
  },
  // ------------------------------------------------------------ advanced graphs
  {
    t: "Critical Connections in a Network", d: "H", topic: "advanced-graphs", sub: "Bridges (Tarjan)", pat: ["dfs"], tags: ["Graph", "Tarjan", "DFS"], co: ["amazon", "google", "meta"],
    desc: "There are `n` servers connected by undirected `connections`. A critical connection is one that, if removed, disconnects some servers. Return all critical connections in any order.",
    cons: ["2 <= n <= 10^5", "n - 1 <= connections.length <= 10^5"],
    hints: ["An edge (u, v) is a bridge if v's subtree cannot reach u or above without that edge.", "Track discovery times and low-links."],
    exp: "Tarjan's bridge-finding DFS records each node's discovery time and the lowest discovery time reachable from its subtree. A tree edge u–v is a bridge when low[v] > disc[u].",
    steps: ["DFS assigning disc and low.", "low[u] = min(low[u], low[v]) for children, disc[v] for back edges.", "Collect edges with low[v] > disc[u]."],
    tc: "O(V + E)", sc: "O(V + E)",
    fn: ["criticalConnections", [["n", "int"], ["connections", "int[][]"]], "int[][]"],
    cmp: "unorderedNested",
    tests: [[[4, [[0, 1], [1, 2], [2, 0], [1, 3]]], [[1, 3]]], [[2, [[0, 1]]], [[0, 1]]], [[5, [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4]]], [[2, 3], [3, 4]]]],
    js: `
var criticalConnections = function(n, connections) {
    const adj = Array.from({ length: n }, () => []);
    for (const [a, b] of connections) { adj[a].push(b); adj[b].push(a); }
    const disc = new Array(n).fill(-1), low = new Array(n).fill(0), res = [];
    let time = 0;
    const dfs = (u, parent) => {
        disc[u] = low[u] = time++;
        for (const v of adj[u]) {
            if (v === parent) continue;
            if (disc[v] === -1) {
                dfs(v, u);
                low[u] = Math.min(low[u], low[v]);
                if (low[v] > disc[u]) res.push([u, v]);
            } else low[u] = Math.min(low[u], disc[v]);
        }
    };
    dfs(0, -1);
    return res;
};`,
  },
  {
    t: "Reconstruct Itinerary", d: "H", topic: "advanced-graphs", sub: "Eulerian path (Hierholzer)", pat: ["dfs"], tags: ["Graph", "Eulerian Path", "DFS"], co: ["google", "meta", "amazon", "microsoft"],
    desc: "Given airline `tickets` `[from, to]`, reconstruct the itinerary that starts at \"JFK\" and uses every ticket exactly once. If several exist, return the lexicographically smallest one.",
    cons: ["1 <= tickets.length <= 300", "A valid itinerary exists"],
    hints: ["Using every edge exactly once is an Eulerian path.", "Hierholzer's algorithm appends airports in post-order."],
    exp: "Sort destinations so the smallest is tried first. DFS consumes edges greedily and appends an airport after all its outgoing edges are used; reversing that post-order gives the itinerary.",
    steps: ["Build adjacency lists sorted in reverse so pop() gives the smallest.", "dfs(a): while edges remain pop and recurse; then push a.", "Reverse the route."],
    tc: "O(E log E)", sc: "O(E)",
    fn: ["findItinerary", [["tickets", "string[][]"]], "string[]"],
    tests: [[[[["MUC", "LHR"], ["JFK", "MUC"], ["SFO", "SJC"], ["LHR", "SFO"]]], ["JFK", "MUC", "LHR", "SFO", "SJC"]], [[[["JFK", "SFO"], ["JFK", "ATL"], ["SFO", "ATL"], ["ATL", "JFK"], ["ATL", "SFO"]]], ["JFK", "ATL", "JFK", "SFO", "ATL", "SFO"]], [[[["JFK", "KUL"], ["JFK", "NRT"], ["NRT", "JFK"]]], ["JFK", "NRT", "JFK", "KUL"]]],
    js: `
var findItinerary = function(tickets) {
    const adj = new Map();
    for (const [a, b] of tickets) { if (!adj.has(a)) adj.set(a, []); adj.get(a).push(b); }
    for (const list of adj.values()) list.sort().reverse();
    const route = [];
    const dfs = (a) => {
        const list = adj.get(a) || [];
        while (list.length) dfs(list.pop());
        route.push(a);
    };
    dfs("JFK");
    return route.reverse();
};`,
  },
  {
    t: "Bus Routes", d: "H", topic: "advanced-graphs", sub: "BFS over routes", pat: ["bfs", "hash-map"], tags: ["Graph", "BFS", "Hash Table"], co: ["google", "amazon"],
    desc: "`routes[i]` lists the stops of bus i, which loops forever. Starting at stop `source` (not on a bus), return the least number of buses you must take to reach `target`, or -1.",
    cons: ["1 <= routes.length <= 500", "Total stops across routes <= 10^5"],
    hints: ["Treat buses as BFS nodes; you move between buses at shared stops."],
    exp: "Map each stop to the buses serving it. BFS from all buses at the source stop, expanding to buses sharing any stop, and stop when a bus serves the target.",
    steps: ["stop → buses map.", "BFS over buses starting with those at source.", "Mark buses and stops visited to avoid repeats."],
    tc: "O(total stops)", sc: "O(total stops)",
    fn: ["numBusesToDestination", [["routes", "int[][]"], ["source", "int"], ["target", "int"]], "int"],
    tests: [[[[[1, 2, 7], [3, 6, 7]], 1, 6], 2], [[[[7, 12], [4, 5, 15], [6], [15, 19], [9, 12, 13]], 15, 12], -1], [[[[1, 2]], 1, 1], 0]],
    js: `
var numBusesToDestination = function(routes, source, target) {
    if (source === target) return 0;
    const byStop = new Map();
    routes.forEach((r, i) => r.forEach((s) => { if (!byStop.has(s)) byStop.set(s, []); byStop.get(s).push(i); }));
    const seenBus = new Set(), seenStop = new Set([source]);
    let level = [source], buses = 0;
    while (level.length) {
        buses++;
        const next = [];
        for (const stop of level) for (const b of byStop.get(stop) || []) {
            if (seenBus.has(b)) continue;
            seenBus.add(b);
            for (const s of routes[b]) {
                if (s === target) return buses;
                if (!seenStop.has(s)) { seenStop.add(s); next.push(s); }
            }
        }
        level = next;
    }
    return -1;
};`,
  },
  {
    t: "Count Strongly Connected Components", d: "H", topic: "advanced-graphs", sub: "Kosaraju / Tarjan", pat: ["dfs"], tags: ["Graph", "Strongly Connected Components", "DFS"], co: ["google", "microsoft", "flipkart"],
    desc: "Given a directed graph with `n` nodes (0..n-1) and `edges` `[u, v]`, return the number of strongly connected components: maximal groups where every node can reach every other node.",
    cons: ["1 <= n <= 10^4", "0 <= edges.length <= 10^5"],
    hints: ["Kosaraju: order nodes by DFS finish time, then DFS the reversed graph in reverse finish order."],
    exp: "The first pass records nodes by finish time. In the transposed graph, a DFS started from the latest-finishing unvisited node explores exactly one strongly connected component.",
    steps: ["DFS on the graph pushing nodes on finish.", "Reverse all edges.", "Pop nodes; each new DFS on the reverse graph is one SCC."],
    tc: "O(V + E)", sc: "O(V + E)",
    fn: ["countSCC", [["n", "int"], ["edges", "int[][]"]], "int"],
    tests: [[[5, [[1, 0], [0, 2], [2, 1], [0, 3], [3, 4]]], 3], [[3, [[0, 1], [1, 2], [2, 0]]], 1], [[4, []], 4]],
    js: `
var countSCC = function(n, edges) {
    const g = Array.from({ length: n }, () => []), rg = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) { g[u].push(v); rg[v].push(u); }
    const seen = new Array(n).fill(false), order = [];
    const dfs1 = (u) => { seen[u] = true; for (const v of g[u]) if (!seen[v]) dfs1(v); order.push(u); };
    for (let i = 0; i < n; i++) if (!seen[i]) dfs1(i);
    seen.fill(false);
    const dfs2 = (u) => { seen[u] = true; for (const v of rg[u]) if (!seen[v]) dfs2(v); };
    let count = 0;
    for (let i = order.length - 1; i >= 0; i--) if (!seen[order[i]]) { count++; dfs2(order[i]); }
    return count;
};`,
  },
  {
    t: "Minimum Height Trees", d: "M", topic: "advanced-graphs", sub: "Tree centres", pat: ["topological-sort", "bfs"], tags: ["Graph", "BFS", "Topological Sort"], co: ["google", "amazon", "microsoft"],
    desc: "For a tree of `n` nodes with undirected `edges`, a root that minimises the tree's height gives a minimum height tree. Return all such roots in any order.",
    cons: ["1 <= n <= 2 * 10^4", "edges.length == n - 1"],
    hints: ["Repeatedly trim leaves; the last one or two nodes are the centres."],
    exp: "Peeling leaves layer by layer (like Kahn's algorithm on degrees) converges on the tree's centre, which is one node or two adjacent nodes.",
    steps: ["Compute degrees; queue leaves.", "Remove leaves while more than 2 nodes remain.", "Return the remaining nodes."],
    tc: "O(n)", sc: "O(n)",
    fn: ["findMinHeightTrees", [["n", "int"], ["edges", "int[][]"]], "int[]"],
    cmp: "unordered",
    tests: [[[4, [[1, 0], [1, 2], [1, 3]]], [1]], [[6, [[3, 0], [3, 1], [3, 2], [3, 4], [5, 4]]], [3, 4]], [[1, []], [0]]],
    js: `
var findMinHeightTrees = function(n, edges) {
    if (n === 1) return [0];
    const adj = Array.from({ length: n }, () => []), deg = new Array(n).fill(0);
    for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); deg[a]++; deg[b]++; }
    let leaves = [], remaining = n;
    deg.forEach((d, i) => d === 1 && leaves.push(i));
    while (remaining > 2) {
        remaining -= leaves.length;
        const next = [];
        for (const u of leaves) for (const v of adj[u]) if (--deg[v] === 1) next.push(v);
        leaves = next;
    }
    return leaves;
};`,
  },
  {
    t: "Making A Large Island", d: "H", topic: "advanced-graphs", sub: "Component labelling", pat: ["dfs", "union-find"], tags: ["Graph", "DFS", "Matrix"], co: ["google", "meta", "amazon"],
    desc: "Given an `n x n` binary grid, you may change at most one 0 to 1. Return the size of the largest island possible afterwards (islands are 4-directionally connected 1s).",
    cons: ["1 <= n <= 500"],
    hints: ["Label each island with an id and record its size.", "For each 0, sum the sizes of distinct neighbouring islands + 1."],
    exp: "First label islands and store their sizes. Flipping a 0 merges the distinct islands around it, so its value is 1 + the sum of those islands' sizes.",
    steps: ["DFS label islands with ids starting at 2.", "For each 0 sum distinct neighbour island sizes + 1.", "Return the max (or n² if no zero)."],
    tc: "O(n²)", sc: "O(n²)",
    fn: ["largestIsland", [["grid", "int[][]"]], "int"],
    tests: [[[[[1, 0], [0, 1]]], 3], [[[[1, 1], [1, 0]]], 4], [[[[1, 1], [1, 1]]], 4], [[[[0, 0], [0, 0]]], 1]],
    js: `
var largestIsland = function(grid) {
    const n = grid.length, size = [0, 0];
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const label = (i, j, id) => {
        if (i < 0 || j < 0 || i >= n || j >= n || grid[i][j] !== 1) return 0;
        grid[i][j] = id;
        return 1 + dirs.reduce((s, [a, b]) => s + label(i + a, j + b, id), 0);
    };
    let id = 2;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (grid[i][j] === 1) size[id] = label(i, j, id++);
    let best = Math.max(0, ...size);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        if (grid[i][j] !== 0) continue;
        const ids = new Set();
        for (const [a, b] of dirs) { const x = i + a, y = j + b; if (x >= 0 && y >= 0 && x < n && y < n && grid[x][y] > 1) ids.add(grid[x][y]); }
        let total = 1;
        for (const k of ids) total += size[k];
        best = Math.max(best, total);
    }
    return best;
};`,
  },
  // ------------------------------------------------------------ advanced strings
  {
    t: "Find the Index of the First Occurrence in a String", d: "E", topic: "advanced-strings", sub: "KMP", pat: [], tags: ["String", "KMP", "String Matching"], co: ["microsoft", "apple", "amazon", "meta"],
    desc: "Given two strings `haystack` and `needle`, return the index of the first occurrence of `needle` in `haystack`, or -1 if it is not part of `haystack`.",
    cons: ["1 <= haystack.length, needle.length <= 10^4"],
    hints: ["KMP's failure function tells you how far to fall back after a mismatch without re-reading the haystack."],
    exp: "Build the longest-proper-prefix-that-is-also-suffix (LPS) table for the needle. During the scan, a mismatch moves the needle pointer to lps[j - 1] instead of restarting, giving linear time.",
    steps: ["Compute lps for needle.", "Scan haystack with i and needle with j.", "On full match return i - j + 1."],
    tc: "O(n + m)", sc: "O(m)",
    fn: ["strStr", [["haystack", "string"], ["needle", "string"]], "int"],
    tests: [[["sadbutsad", "sad"], 0], [["leetcode", "leeto"], -1], [["aaaaab", "aab"], 3], [["abc", "c"], 2]],
    js: `
var strStr = function(haystack, needle) {
    const m = needle.length, lps = new Array(m).fill(0);
    for (let i = 1, len = 0; i < m;) {
        if (needle[i] === needle[len]) lps[i++] = ++len;
        else if (len) len = lps[len - 1];
        else lps[i++] = 0;
    }
    for (let i = 0, j = 0; i < haystack.length;) {
        if (haystack[i] === needle[j]) { i++; j++; if (j === m) return i - m; }
        else if (j) j = lps[j - 1];
        else i++;
    }
    return -1;
};`,
  },
  {
    t: "Repeated Substring Pattern", d: "E", topic: "advanced-strings", sub: "Prefix function", pat: [], tags: ["String", "KMP"], co: ["amazon", "google"],
    desc: "Given a string `s`, check if it can be constructed by taking a substring of it and appending multiple copies of the substring together.",
    cons: ["1 <= s.length <= 10^4"],
    hints: ["s is periodic iff s appears in (s + s) with the first and last characters removed.", "Or: n % (n - lps[n - 1]) == 0."],
    exp: "Using the KMP prefix function, the smallest period is n - lps[n - 1]. The string is a repetition exactly when that period divides n and is shorter than n.",
    steps: ["Compute lps.", "p = n - lps[n - 1].", "Return lps[n - 1] > 0 && n % p === 0."],
    tc: "O(n)", sc: "O(n)",
    fn: ["repeatedSubstringPattern", [["s", "string"]], "bool"],
    tests: [[["abab"], true], [["aba"], false], [["abcabcabcabc"], true], [["a"], false]],
    js: `
var repeatedSubstringPattern = function(s) {
    const n = s.length, lps = new Array(n).fill(0);
    for (let i = 1, len = 0; i < n;) {
        if (s[i] === s[len]) lps[i++] = ++len;
        else if (len) len = lps[len - 1];
        else lps[i++] = 0;
    }
    const l = lps[n - 1];
    return l > 0 && n % (n - l) === 0;
};`,
  },
  {
    t: "Shortest Palindrome", d: "H", topic: "advanced-strings", sub: "KMP on s + # + reverse", pat: [], tags: ["String", "KMP", "Rolling Hash"], co: ["google", "amazon", "microsoft"],
    desc: "Given a string `s`, you can add characters in front of it. Return the shortest palindrome you can find by performing this transformation.",
    cons: ["0 <= s.length <= 5 * 10^4"],
    hints: ["Find the longest palindromic prefix of s.", "The prefix function of s + '#' + reverse(s) gives it directly."],
    exp: "The answer is reverse(suffix after the longest palindromic prefix) + s. Running KMP's prefix function on s + '#' + reverse(s) yields that prefix length as the last value.",
    steps: ["t = s + '#' + rev(s); compute lps of t.", "k = lps[t.length - 1].", "Return rev(s.slice(k)) + s."],
    tc: "O(n)", sc: "O(n)",
    fn: ["shortestPalindrome", [["s", "string"]], "string"],
    tests: [[["aacecaaa"], "aaacecaaa"], [["abcd"], "dcbabcd"], [[""], ""], [["aba"], "aba"]],
    js: `
var shortestPalindrome = function(s) {
    const rev = s.split("").reverse().join(""), t = s + "#" + rev;
    const lps = new Array(t.length).fill(0);
    for (let i = 1, len = 0; i < t.length;) {
        if (t[i] === t[len]) lps[i++] = ++len;
        else if (len) len = lps[len - 1];
        else lps[i++] = 0;
    }
    const k = t.length ? lps[t.length - 1] : 0;
    return rev.slice(0, s.length - k) + s;
};`,
  },
  {
    t: "Longest Happy Prefix", d: "H", topic: "advanced-strings", sub: "Prefix function", pat: [], tags: ["String", "KMP", "Rolling Hash"], co: ["google", "amazon"],
    desc: "A happy prefix is a non-empty prefix which is also a suffix (excluding the string itself). Given `s`, return its longest happy prefix, or \"\" if none exists.",
    cons: ["1 <= s.length <= 10^5"],
    hints: ["This is exactly the last value of the KMP prefix function."],
    exp: "The prefix function's final entry is the length of the longest proper prefix that is also a suffix of the whole string.",
    steps: ["Compute lps.", "Return s.slice(0, lps[n - 1])."],
    tc: "O(n)", sc: "O(n)",
    fn: ["longestPrefix", [["s", "string"]], "string"],
    tests: [[["level"], "l"], [["ababab"], "abab"], [["abc"], ""], [["aaaa"], "aaa"]],
    js: `
var longestPrefix = function(s) {
    const n = s.length, lps = new Array(n).fill(0);
    for (let i = 1, len = 0; i < n;) {
        if (s[i] === s[len]) lps[i++] = ++len;
        else if (len) len = lps[len - 1];
        else lps[i++] = 0;
    }
    return s.slice(0, lps[n - 1]);
};`,
  },
  {
    t: "Repeated DNA Sequences", d: "M", topic: "advanced-strings", sub: "Rolling hash", pat: ["sliding-window", "hash-map", "bit-manipulation"], tags: ["String", "Rolling Hash", "Hash Table"], co: ["amazon", "google"],
    desc: "Given a DNA string `s` of 'A', 'C', 'G', 'T', return all 10-letter-long sequences that occur more than once, in any order.",
    cons: ["1 <= s.length <= 10^5"],
    hints: ["Encode each letter in 2 bits and roll a 20-bit hash through the window."],
    exp: "A rolling 2-bit encoding turns each 10-letter window into a 20-bit integer in O(1) per step. Track windows seen once and windows already reported.",
    steps: ["Map A,C,G,T → 0..3.", "Roll hash = ((hash << 2) | code) & 0xFFFFF.", "Report windows whose hash was seen exactly once before."],
    tc: "O(n)", sc: "O(n)",
    fn: ["findRepeatedDnaSequences", [["s", "string"]], "string[]"],
    cmp: "unordered",
    tests: [[["AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"], ["AAAAACCCCC", "CCCCCAAAAA"]], [["AAAAAAAAAAAAA"], ["AAAAAAAAAA"]], [["ACGT"], []]],
    js: `
var findRepeatedDnaSequences = function(s) {
    const code = { A: 0, C: 1, G: 2, T: 3 }, seen = new Map(), res = [];
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = ((h << 2) | code[s[i]]) & 0xfffff;
        if (i < 9) continue;
        const c = (seen.get(h) || 0) + 1;
        seen.set(h, c);
        if (c === 2) res.push(s.slice(i - 9, i + 1));
    }
    return res;
};`,
  },
  {
    t: "Longest Duplicate Substring", d: "H", topic: "advanced-strings", sub: "Binary search + rolling hash", pat: ["binary-search", "sliding-window"], tags: ["String", "Rolling Hash", "Binary Search", "Suffix Array"], co: ["google", "amazon"],
    desc: "Given a string `s`, return the longest substring that occurs at least twice (occurrences may overlap). Return \"\" if none exists. The tests here have a unique answer.",
    cons: ["2 <= s.length <= 3 * 10^4"],
    hints: ["If a duplicate of length L exists, one of length L - 1 does too: binary search L.", "Check a length with a Rabin–Karp rolling hash."],
    exp: "Binary search the answer length. For a candidate length, slide a polynomial rolling hash over the string and look for a repeated hash, confirming with a direct substring comparison to rule out collisions.",
    steps: ["lo = 1, hi = n - 1.", "check(L) uses a rolling hash map from hash → start indices.", "Keep the last successful substring."],
    tc: "O(n log n)", sc: "O(n)",
    fn: ["longestDupSubstring", [["s", "string"]], "string"],
    tests: [[["banana"], "ana"], [["abcd"], ""], [["aa"], "a"], [["abcabcx"], "abc"]],
    js: `
var longestDupSubstring = function(s) {
    const n = s.length, MOD = 1000000007, B = 131;
    const check = (L) => {
        let h = 0, pw = 1;
        for (let i = 0; i < L; i++) { h = (h * B + s.charCodeAt(i)) % MOD; if (i) pw = (pw * B) % MOD; }
        const seen = new Map([[h, [0]]]);
        for (let i = L; i < n; i++) {
            h = (h - (s.charCodeAt(i - L) * pw) % MOD + MOD) % MOD;
            h = (h * B + s.charCodeAt(i)) % MOD;
            const start = i - L + 1, sub = s.substr(start, L);
            const list = seen.get(h);
            if (list) { for (const j of list) if (s.substr(j, L) === sub) return sub; list.push(start); }
            else seen.set(h, [start]);
        }
        return "";
    };
    let lo = 1, hi = n - 1, best = "";
    while (lo <= hi) {
        const mid = (lo + hi) >> 1, found = check(mid);
        if (found) { best = found; lo = mid + 1; } else hi = mid - 1;
    }
    return best;
};`,
  },
];
