import type { ProblemDef } from "./builder";
import { HEAP } from "./trees";

const DSU = `class DSU {
    constructor(n) { this.p = Array.from({ length: n }, (_, i) => i); this.r = new Array(n).fill(0); this.count = n; }
    find(x) { while (this.p[x] !== x) { this.p[x] = this.p[this.p[x]]; x = this.p[x]; } return x; }
    union(a, b) {
        a = this.find(a); b = this.find(b);
        if (a === b) return false;
        if (this.r[a] < this.r[b]) [a, b] = [b, a];
        this.p[b] = a;
        if (this.r[a] === this.r[b]) this.r[a]++;
        this.count--;
        return true;
    }
}`;

export const graphProblems: ProblemDef[] = [
  // ------------------------------------------------------------ representation
  {
    t: "Find the Town Judge", d: "E", topic: "graph-representation", sub: "In-degree and out-degree", pat: [], tags: ["Graph", "Array"], co: ["amazon", "apple"],
    desc: "In a town of `n` people labelled 1..n, the judge trusts nobody and is trusted by everyone else. Given `trust` pairs `[a, b]` meaning a trusts b, return the judge's label or -1.",
    cons: ["1 <= n <= 1000", "0 <= trust.length <= 10^4"],
    hints: ["Think of trust as directed edges.", "The judge has in-degree n - 1 and out-degree 0."],
    exp: "Represent the relation as a directed graph and track degrees. A single score in - out equal to n - 1 identifies the judge.",
    steps: ["score[b]++ and score[a]-- for each pair.", "Return the person with score n - 1."],
    tc: "O(n + E)", sc: "O(n)",
    fn: ["findJudge", [["n", "int"], ["trust", "int[][]"]], "int"],
    tests: [[[2, [[1, 2]]], 2], [[3, [[1, 3], [2, 3]]], 3], [[3, [[1, 3], [2, 3], [3, 1]]], -1], [[1, []], 1]],
    js: `
var findJudge = function(n, trust) {
    const score = new Array(n + 1).fill(0);
    for (const [a, b] of trust) { score[a]--; score[b]++; }
    for (let i = 1; i <= n; i++) if (score[i] === n - 1) return i;
    return -1;
};`,
  },
  {
    t: "Find Center of Star Graph", d: "E", topic: "graph-representation", sub: "Edge lists", pat: [], tags: ["Graph"], co: ["microsoft"],
    desc: "An undirected star graph has one centre node connected to every other node. Given its `edges`, return the centre.",
    cons: ["3 <= n <= 10^5", "edges.length == n - 1"],
    hints: ["The centre appears in every edge, so it appears in the first two."],
    exp: "Because every edge touches the centre, the node shared by the first two edges must be the centre.",
    steps: ["Compare the endpoints of edges[0] and edges[1]."],
    tc: "O(1)", sc: "O(1)",
    fn: ["findCenter", [["edges", "int[][]"]], "int"],
    tests: [[[[[1, 2], [2, 3], [4, 2]]], 2], [[[[1, 2], [5, 1], [1, 3], [1, 4]]], 1]],
    js: `
var findCenter = function(edges) {
    const [a, b] = edges[0];
    return a === edges[1][0] || a === edges[1][1] ? a : b;
};`,
  },
  {
    t: "Find if Path Exists in Graph", d: "E", topic: "graph-representation", sub: "Adjacency lists", pat: ["bfs", "dfs", "union-find"], tags: ["Graph", "BFS"], co: ["amazon", "google"],
    desc: "Given `n` vertices labelled 0..n-1 and undirected `edges`, return `true` if there is a valid path from `source` to `destination`.",
    cons: ["1 <= n <= 2 * 10^5", "0 <= edges.length <= 2 * 10^5"],
    hints: ["Build an adjacency list, then BFS or DFS from source."],
    exp: "Convert the edge list into adjacency lists, then traverse from the source while marking visited vertices. The destination is reachable if it is ever visited.",
    steps: ["Build adjacency lists.", "BFS from source with a visited array.", "Return visited[destination]."],
    tc: "O(V + E)", sc: "O(V + E)",
    fn: ["validPath", [["n", "int"], ["edges", "int[][]"], ["source", "int"], ["destination", "int"]], "bool"],
    tests: [[[3, [[0, 1], [1, 2], [2, 0]], 0, 2], true], [[6, [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]], 0, 5], false], [[1, [], 0, 0], true]],
    js: `
var validPath = function(n, edges, source, destination) {
    const adj = Array.from({ length: n }, () => []);
    for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }
    const seen = new Array(n).fill(false), q = [source];
    seen[source] = true;
    while (q.length) {
        const u = q.pop();
        if (u === destination) return true;
        for (const v of adj[u]) if (!seen[v]) { seen[v] = true; q.push(v); }
    }
    return false;
};`,
  },
  // ------------------------------------------------------------ BFS
  {
    t: "Rotting Oranges", d: "M", topic: "bfs", sub: "Multi-source BFS", pat: ["bfs"], tags: ["Graph", "BFS", "Matrix"], co: ["amazon", "microsoft", "google", "meta", "flipkart"],
    desc: "In a grid, 0 is empty, 1 is a fresh orange and 2 is rotten. Every minute, fresh oranges adjacent (4-directionally) to rotten ones become rotten. Return the minimum minutes until no fresh orange remains, or -1 if impossible.",
    cons: ["1 <= m, n <= 10", "grid[i][j] is 0, 1, or 2"],
    hints: ["Start BFS from all rotten oranges at once.", "Each BFS layer is one minute."],
    exp: "Multi-source BFS spreads rot from every initially rotten orange simultaneously. The number of layers processed is the elapsed time; any remaining fresh orange means -1.",
    steps: ["Queue all rotten cells and count fresh ones.", "Process layer by layer, rotting fresh neighbours.", "Return minutes if fresh == 0, else -1."],
    tc: "O(m·n)", sc: "O(m·n)",
    fn: ["orangesRotting", [["grid", "int[][]"]], "int"],
    tests: [[[[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], 4], [[[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], -1], [[[[0, 2]]], 0], [[[[1]]], -1]],
    js: `
var orangesRotting = function(grid) {
    const m = grid.length, n = grid[0].length;
    let q = [], fresh = 0, minutes = 0;
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
        if (grid[i][j] === 2) q.push([i, j]);
        else if (grid[i][j] === 1) fresh++;
    }
    while (q.length && fresh) {
        const next = [];
        for (const [i, j] of q) for (const [a, b] of [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]]) {
            if (a >= 0 && b >= 0 && a < m && b < n && grid[a][b] === 1) { grid[a][b] = 2; fresh--; next.push([a, b]); }
        }
        q = next;
        minutes++;
    }
    return fresh ? -1 : minutes;
};`,
    py: `
class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        q = deque((i, j) for i in range(m) for j in range(n) if grid[i][j] == 2)
        fresh = sum(row.count(1) for row in grid)
        minutes = 0
        while q and fresh:
            for _ in range(len(q)):
                i, j = q.popleft()
                for a, b in ((i+1, j), (i-1, j), (i, j+1), (i, j-1)):
                    if 0 <= a < m and 0 <= b < n and grid[a][b] == 1:
                        grid[a][b] = 2
                        fresh -= 1
                        q.append((a, b))
            minutes += 1
        return -1 if fresh else minutes`,
  },
  {
    t: "01 Matrix", d: "M", topic: "bfs", sub: "Multi-source BFS", pat: ["bfs", "dynamic-programming"], tags: ["Graph", "BFS", "Matrix"], co: ["google", "amazon", "microsoft"],
    desc: "Given an `m x n` binary matrix `mat`, return the distance of the nearest 0 for each cell (adjacent cells are distance 1 apart).",
    cons: ["1 <= m, n <= 10^4", "1 <= m * n <= 10^4", "There is at least one 0"],
    hints: ["Run BFS from all zeros at the same time."],
    exp: "Seed a BFS queue with every zero at distance 0. The first time BFS reaches a cell is via a shortest path from some zero.",
    steps: ["dist = 0 for zeros, Infinity otherwise; queue zeros.", "Relax neighbours whose distance improves."],
    tc: "O(m·n)", sc: "O(m·n)",
    fn: ["updateMatrix", [["mat", "int[][]"]], "int[][]"],
    tests: [[[[[0, 0, 0], [0, 1, 0], [0, 0, 0]]], [[0, 0, 0], [0, 1, 0], [0, 0, 0]]], [[[[0, 0, 0], [0, 1, 0], [1, 1, 1]]], [[0, 0, 0], [0, 1, 0], [1, 2, 1]]], [[[[1, 1, 0]]], [[2, 1, 0]]]],
    js: `
var updateMatrix = function(mat) {
    const m = mat.length, n = mat[0].length, q = [];
    const dist = mat.map((row, i) => row.map((v, j) => { if (v === 0) { q.push([i, j]); return 0; } return Infinity; }));
    for (let h = 0; h < q.length; h++) {
        const [i, j] = q[h];
        for (const [a, b] of [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]]) {
            if (a >= 0 && b >= 0 && a < m && b < n && dist[a][b] > dist[i][j] + 1) { dist[a][b] = dist[i][j] + 1; q.push([a, b]); }
        }
    }
    return dist;
};`,
  },
  {
    t: "Word Ladder", d: "H", topic: "bfs", sub: "Implicit graphs", pat: ["bfs"], tags: ["Graph", "BFS", "String"], co: ["amazon", "google", "meta", "microsoft", "apple"],
    desc: "Given `beginWord`, `endWord` and a `wordList`, return the number of words in the shortest transformation sequence from `beginWord` to `endWord`, where each step changes one letter and every intermediate word is in `wordList`. Return 0 if none exists.",
    cons: ["1 <= beginWord.length <= 10", "1 <= wordList.length <= 5000", "All words have the same length"],
    hints: ["Words are nodes; one-letter differences are edges.", "Generate neighbours by trying all 26 letters per position."],
    exp: "BFS over the implicit graph of words finds the shortest sequence. Removing words from the dictionary when they are first visited prevents revisits.",
    steps: ["Put the word list in a set; return 0 if endWord is missing.", "BFS from beginWord, generating one-letter variants.", "Return the level when endWord is reached."],
    tc: "O(N · L · 26)", sc: "O(N · L)",
    fn: ["ladderLength", [["beginWord", "string"], ["endWord", "string"], ["wordList", "string[]"]], "int"],
    tests: [[["hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]], 5], [["hit", "cog", ["hot", "dot", "dog", "lot", "log"]], 0], [["a", "c", ["a", "b", "c"]], 2]],
    js: `
var ladderLength = function(beginWord, endWord, wordList) {
    const dict = new Set(wordList);
    if (!dict.has(endWord)) return 0;
    let level = [beginWord], steps = 1;
    const letters = "abcdefghijklmnopqrstuvwxyz";
    while (level.length) {
        const next = [];
        for (const w of level) {
            if (w === endWord) return steps;
            for (let i = 0; i < w.length; i++) for (const c of letters) {
                const cand = w.slice(0, i) + c + w.slice(i + 1);
                if (dict.has(cand)) { dict.delete(cand); next.push(cand); }
            }
        }
        level = next;
        steps++;
    }
    return 0;
};`,
  },
  {
    t: "Shortest Path in Binary Matrix", d: "M", topic: "bfs", sub: "Grid BFS", pat: ["bfs"], tags: ["Graph", "BFS", "Matrix"], co: ["meta", "amazon", "google"],
    desc: "Given an `n x n` binary matrix, return the length of the shortest clear path (cells with 0) from the top-left to the bottom-right cell, moving in 8 directions. Return -1 if no clear path exists. Path length counts cells.",
    cons: ["1 <= n <= 100", "grid[i][j] is 0 or 1"],
    hints: ["BFS on an unweighted grid gives shortest paths.", "Remember to include diagonal moves."],
    exp: "Run BFS from (0,0) over clear cells with 8-directional moves, recording distances; the first time the target is reached gives the shortest length.",
    steps: ["Return -1 if the start or end is blocked.", "BFS with distance = cell count.", "Return the distance at the target."],
    tc: "O(n²)", sc: "O(n²)",
    fn: ["shortestPathBinaryMatrix", [["grid", "int[][]"]], "int"],
    tests: [[[[[0, 1], [1, 0]]], 2], [[[[0, 0, 0], [1, 1, 0], [1, 1, 0]]], 4], [[[[1, 0, 0], [1, 1, 0], [1, 1, 0]]], -1], [[[[0]]], 1]],
    js: `
var shortestPathBinaryMatrix = function(grid) {
    const n = grid.length;
    if (grid[0][0] || grid[n - 1][n - 1]) return -1;
    const q = [[0, 0, 1]];
    grid[0][0] = 1;
    for (let h = 0; h < q.length; h++) {
        const [i, j, d] = q[h];
        if (i === n - 1 && j === n - 1) return d;
        for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
            const a = i + di, b = j + dj;
            if (a >= 0 && b >= 0 && a < n && b < n && grid[a][b] === 0) { grid[a][b] = 1; q.push([a, b, d + 1]); }
        }
    }
    return -1;
};`,
  },
  {
    t: "Open the Lock", d: "M", topic: "bfs", sub: "State-space BFS", pat: ["bfs"], tags: ["Graph", "BFS", "String"], co: ["google", "amazon"],
    desc: "A lock has 4 circular wheels showing digits, starting at \"0000\". One move turns one wheel by one slot. Given `deadends` that lock the wheels permanently and a `target`, return the minimum number of moves to reach the target, or -1.",
    cons: ["1 <= deadends.length <= 500", "target is not in deadends"],
    hints: ["Each combination is a node with 8 neighbours."],
    exp: "BFS over the 10,000 lock states, skipping deadends and visited states, gives the minimum number of turns.",
    steps: ["Return -1 if '0000' is a deadend.", "BFS generating 8 neighbours per state.", "Return the level when target is found."],
    tc: "O(10^4 · 8)", sc: "O(10^4)",
    fn: ["openLock", [["deadends", "string[]"], ["target", "string"]], "int"],
    tests: [[[["0201", "0101", "0102", "1212", "2002"], "0202"], 6], [[["8888"], "0009"], 1], [[["8887", "8889", "8878", "8898", "8788", "8988", "7888", "9888"], "8888"], -1], [[["0000"], "8888"], -1]],
    js: `
var openLock = function(deadends, target) {
    const seen = new Set(deadends);
    if (seen.has("0000")) return -1;
    seen.add("0000");
    let level = ["0000"], steps = 0;
    while (level.length) {
        const next = [];
        for (const s of level) {
            if (s === target) return steps;
            for (let i = 0; i < 4; i++) for (const d of [1, 9]) {
                const c = s.slice(0, i) + ((Number(s[i]) + d) % 10) + s.slice(i + 1);
                if (!seen.has(c)) { seen.add(c); next.push(c); }
            }
        }
        level = next;
        steps++;
    }
    return -1;
};`,
  },
  // ------------------------------------------------------------ DFS
  {
    t: "Number of Islands", d: "M", topic: "dfs", sub: "Grid flood fill", pat: ["dfs", "bfs", "union-find"], tags: ["Graph", "DFS", "Matrix"], co: ["amazon", "google", "meta", "microsoft", "apple", "adobe", "flipkart", "atlassian"],
    desc: "Given an `m x n` grid of '1' (land) and '0' (water), return the number of islands. An island is formed by connecting adjacent land cells horizontally or vertically.",
    cons: ["1 <= m, n <= 300", "grid[i][j] is '0' or '1'"],
    hints: ["Each time you find unvisited land, you found a new island.", "Sink the whole island with DFS so it is not counted again."],
    exp: "Scan the grid. On unvisited land, increment the count and flood-fill the connected land to mark it visited. Each cell is processed a constant number of times.",
    steps: ["For each '1' cell: count++ and DFS.", "DFS marks the cell '0' and recurses into 4 neighbours."],
    tc: "O(m·n)", sc: "O(m·n) worst-case recursion",
    fn: ["numIslands", [["grid", "char[][]"]], "int"],
    tests: [[[[["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]]], 1], [[[["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]]], 3], [[[["0"]]], 0], [[[["1", "0", "1"], ["0", "1", "0"], ["1", "0", "1"]]], 5]],
    js: `
var numIslands = function(grid) {
    const m = grid.length, n = grid[0].length;
    const sink = (i, j) => {
        if (i < 0 || j < 0 || i >= m || j >= n || grid[i][j] !== "1") return;
        grid[i][j] = "0";
        sink(i + 1, j); sink(i - 1, j); sink(i, j + 1); sink(i, j - 1);
    };
    let count = 0;
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (grid[i][j] === "1") { count++; sink(i, j); }
    return count;
};`,
    py: `
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        m, n = len(grid), len(grid[0])
        def sink(i, j):
            if 0 <= i < m and 0 <= j < n and grid[i][j] == "1":
                grid[i][j] = "0"
                sink(i + 1, j); sink(i - 1, j); sink(i, j + 1); sink(i, j - 1)
        count = 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] == "1":
                    count += 1
                    sink(i, j)
        return count`,
  },
  {
    t: "Clone Graph", d: "M", topic: "dfs", sub: "Graph copying", pat: ["dfs", "bfs", "hash-map"], tags: ["Graph", "DFS", "Hash Table"], co: ["meta", "amazon", "google", "microsoft"],
    desc: "Given a reference to a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node has a value and a list of neighbours. The tests describe the graph as an adjacency list where node i + 1 has neighbours adjList[i].",
    cons: ["The number of nodes is in the range [0, 100]", "Node values are unique and equal their 1-based index"],
    hints: ["Map each original node to its clone so shared neighbours are cloned once."],
    exp: "DFS through the graph with a map from original to cloned node. Create a clone when first seen, then wire its neighbours by recursively cloning them.",
    steps: ["If node is in map, return the clone.", "Create the clone, store it, then clone each neighbour."],
    tc: "O(V + E)", sc: "O(V)",
    fn: ["cloneGraph", [["adjList", "int[][]"]], "int[][]"],
    runnable: false,
    tests: [[[[[2, 4], [1, 3], [2, 4], [1, 3]]], [[2, 4], [1, 3], [2, 4], [1, 3]]], [[[[]]], [[]]]],
    js: `
var cloneGraph = function(node) {
    const map = new Map();
    const clone = (n) => {
        if (!n) return null;
        if (map.has(n)) return map.get(n);
        const c = { val: n.val, neighbors: [] };
        map.set(n, c);
        for (const nb of n.neighbors) c.neighbors.push(clone(nb));
        return c;
    };
    return clone(node);
};`,
  },
  {
    t: "Max Area of Island", d: "M", topic: "dfs", sub: "Grid flood fill", pat: ["dfs"], tags: ["Graph", "DFS", "Matrix"], co: ["amazon", "google", "meta"],
    desc: "Given a binary grid where 1 is land, return the area of the largest island (4-directionally connected land cells), or 0 if there is none.",
    cons: ["1 <= m, n <= 50"],
    hints: ["Make the flood fill return the number of cells it sinks."],
    exp: "DFS from each unvisited land cell returns the size of its island while marking cells visited; the answer is the largest size.",
    steps: ["area(i, j) = 0 outside or on water.", "Otherwise mark and return 1 + area of 4 neighbours.", "Track the max."],
    tc: "O(m·n)", sc: "O(m·n)",
    fn: ["maxAreaOfIsland", [["grid", "int[][]"]], "int"],
    tests: [[[[[0, 0, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 0, 0, 1], [1, 1, 0, 1, 1]]], 6], [[[[0, 0, 0, 0]]], 0], [[[[1, 1], [1, 0]]], 3]],
    js: `
var maxAreaOfIsland = function(grid) {
    const m = grid.length, n = grid[0].length;
    const area = (i, j) => {
        if (i < 0 || j < 0 || i >= m || j >= n || grid[i][j] !== 1) return 0;
        grid[i][j] = 0;
        return 1 + area(i + 1, j) + area(i - 1, j) + area(i, j + 1) + area(i, j - 1);
    };
    let best = 0;
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) best = Math.max(best, area(i, j));
    return best;
};`,
  },
  {
    t: "Flood Fill", d: "E", topic: "dfs", sub: "Grid flood fill", pat: ["dfs", "bfs"], tags: ["Graph", "DFS", "Matrix"], co: ["amazon", "microsoft", "google"],
    desc: "Given an `image` grid, a starting pixel `(sr, sc)` and a `color`, recolour the starting pixel and every pixel connected to it (4-directionally) with the same original colour. Return the modified image.",
    cons: ["1 <= m, n <= 50", "0 <= image[i][j], color < 2^16"],
    hints: ["If the new colour equals the original, nothing changes."],
    exp: "DFS from the start pixel, recolouring every reachable pixel of the original colour. Guard against the case where the colours are equal to avoid infinite recursion.",
    steps: ["orig = image[sr][sc]; if orig == color return.", "DFS recolouring matching neighbours."],
    tc: "O(m·n)", sc: "O(m·n)",
    fn: ["floodFill", [["image", "int[][]"], ["sr", "int"], ["sc", "int"], ["color", "int"]], "int[][]"],
    tests: [[[[[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2], [[2, 2, 2], [2, 2, 0], [2, 0, 1]]], [[[[0, 0, 0], [0, 0, 0]], 0, 0, 0], [[0, 0, 0], [0, 0, 0]]]],
    js: `
var floodFill = function(image, sr, sc, color) {
    const orig = image[sr][sc];
    if (orig === color) return image;
    const fill = (i, j) => {
        if (i < 0 || j < 0 || i >= image.length || j >= image[0].length || image[i][j] !== orig) return;
        image[i][j] = color;
        fill(i + 1, j); fill(i - 1, j); fill(i, j + 1); fill(i, j - 1);
    };
    fill(sr, sc);
    return image;
};`,
  },
  {
    t: "Pacific Atlantic Water Flow", d: "M", topic: "dfs", sub: "Reverse reachability", pat: ["dfs", "bfs"], tags: ["Graph", "DFS", "Matrix"], co: ["google", "amazon", "meta"],
    desc: "An island's `heights` grid touches the Pacific on its top and left edges and the Atlantic on its bottom and right edges. Water flows to neighbours with height <= current. Return all cells from which water can reach both oceans, in any order.",
    cons: ["1 <= m, n <= 200", "0 <= heights[i][j] <= 10^5"],
    hints: ["Search backwards from each ocean, climbing to cells with height >= current.", "Intersect the two reachable sets."],
    exp: "Instead of simulating flow from every cell, start DFS from each ocean's border and move uphill. Cells reached from both oceans are the answer.",
    steps: ["DFS uphill from Pacific borders into set P.", "DFS uphill from Atlantic borders into set A.", "Return cells in both."],
    tc: "O(m·n)", sc: "O(m·n)",
    fn: ["pacificAtlantic", [["heights", "int[][]"]], "int[][]"],
    cmp: "unordered",
    tests: [[[[[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]], [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]], [[[[1]]], [[0, 0]]]],
    js: `
var pacificAtlantic = function(heights) {
    const m = heights.length, n = heights[0].length;
    const P = Array.from({ length: m }, () => new Array(n).fill(false));
    const A = Array.from({ length: m }, () => new Array(n).fill(false));
    const dfs = (i, j, seen, prev) => {
        if (i < 0 || j < 0 || i >= m || j >= n || seen[i][j] || heights[i][j] < prev) return;
        seen[i][j] = true;
        const h = heights[i][j];
        dfs(i + 1, j, seen, h); dfs(i - 1, j, seen, h); dfs(i, j + 1, seen, h); dfs(i, j - 1, seen, h);
    };
    for (let i = 0; i < m; i++) { dfs(i, 0, P, -1); dfs(i, n - 1, A, -1); }
    for (let j = 0; j < n; j++) { dfs(0, j, P, -1); dfs(m - 1, j, A, -1); }
    const res = [];
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (P[i][j] && A[i][j]) res.push([i, j]);
    return res;
};`,
  },
  {
    t: "Surrounded Regions", d: "M", topic: "dfs", sub: "Border-connected regions", pat: ["dfs", "union-find"], tags: ["Graph", "DFS", "Matrix"], co: ["google", "amazon", "microsoft"],
    desc: "Given an `m x n` board of 'X' and 'O', capture all regions of 'O' that are completely surrounded by 'X' by flipping them to 'X'. Regions connected to the border are not captured. Modify the board in place.",
    cons: ["1 <= m, n <= 200"],
    hints: ["Regions touching the border survive; mark them first."],
    exp: "DFS from every border 'O' and mark its region as safe. Then flip all remaining 'O' to 'X' and restore the safe marks to 'O'.",
    steps: ["Mark border-connected 'O' as '#'.", "Flip 'O' → 'X', '#' → 'O'."],
    tc: "O(m·n)", sc: "O(m·n)",
    fn: ["solve", [["board", "char[][]"]], "void"],
    tests: [[[[["X", "X", "X", "X"], ["X", "O", "O", "X"], ["X", "X", "O", "X"], ["X", "O", "X", "X"]]], [["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "O", "X", "X"]]], [[[["X"]]], [["X"]]], [[[["O", "O"], ["O", "O"]]], [["O", "O"], ["O", "O"]]]],
    js: `
var solve = function(board) {
    const m = board.length, n = board[0].length;
    const mark = (i, j) => {
        if (i < 0 || j < 0 || i >= m || j >= n || board[i][j] !== "O") return;
        board[i][j] = "#";
        mark(i + 1, j); mark(i - 1, j); mark(i, j + 1); mark(i, j - 1);
    };
    for (let i = 0; i < m; i++) { mark(i, 0); mark(i, n - 1); }
    for (let j = 0; j < n; j++) { mark(0, j); mark(m - 1, j); }
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) board[i][j] = board[i][j] === "#" ? "O" : "X";
};`,
  },
  // ------------------------------------------------------------ connected components
  {
    t: "Number of Provinces", d: "M", topic: "connected-components", sub: "Adjacency matrix components", pat: ["dfs", "union-find"], tags: ["Graph", "DFS", "Union Find"], co: ["amazon", "google", "microsoft", "flipkart"],
    desc: "There are `n` cities. `isConnected[i][j] = 1` if city i and city j are directly connected. A province is a group of directly or indirectly connected cities. Return the number of provinces.",
    cons: ["1 <= n <= 200", "isConnected[i][i] == 1", "isConnected is symmetric"],
    hints: ["Count how many times you need to start a new DFS."],
    exp: "Every DFS started from an unvisited city explores exactly one province; count the starts.",
    steps: ["visited array.", "For each unvisited city, DFS through row connections and count++."],
    tc: "O(n²)", sc: "O(n)",
    fn: ["findCircleNum", [["isConnected", "int[][]"]], "int"],
    tests: [[[[[1, 1, 0], [1, 1, 0], [0, 0, 1]]], 2], [[[[1, 0, 0], [0, 1, 0], [0, 0, 1]]], 3], [[[[1]]], 1], [[[[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 1], [1, 0, 1, 1]]], 1]],
    js: `
var findCircleNum = function(isConnected) {
    const n = isConnected.length, seen = new Array(n).fill(false);
    const dfs = (i) => { seen[i] = true; for (let j = 0; j < n; j++) if (isConnected[i][j] && !seen[j]) dfs(j); };
    let count = 0;
    for (let i = 0; i < n; i++) if (!seen[i]) { count++; dfs(i); }
    return count;
};`,
  },
  {
    t: "Number of Connected Components in an Undirected Graph", d: "M", topic: "connected-components", sub: "Edge list components", pat: ["union-find", "dfs"], tags: ["Graph", "Union Find"], co: ["google", "amazon", "meta", "microsoft"],
    desc: "Given `n` nodes labelled 0..n-1 and a list of undirected `edges`, return the number of connected components.",
    cons: ["1 <= n <= 2000", "0 <= edges.length <= 5000"],
    hints: ["Each successful union reduces the component count by one."],
    exp: "Start with n singleton sets. Union the endpoints of every edge; whenever two different sets merge, there is one fewer component.",
    steps: ["DSU of size n, count = n.", "For each edge, if union succeeds count--."],
    tc: "O(E · α(n))", sc: "O(n)",
    fn: ["countComponents", [["n", "int"], ["edges", "int[][]"]], "int"],
    tests: [[[5, [[0, 1], [1, 2], [3, 4]]], 2], [[5, [[0, 1], [1, 2], [2, 3], [3, 4]]], 1], [[3, []], 3]],
    js: `
${DSU}
var countComponents = function(n, edges) {
    const d = new DSU(n);
    for (const [a, b] of edges) d.union(a, b);
    return d.count;
};`,
  },
  {
    t: "Graph Valid Tree", d: "M", topic: "connected-components", sub: "Tree detection", pat: ["union-find", "dfs"], tags: ["Graph", "Union Find"], co: ["google", "meta", "amazon"],
    desc: "Given `n` nodes labelled 0..n-1 and a list of undirected `edges`, return `true` if the edges form a valid tree (connected with no cycles).",
    cons: ["1 <= n <= 2000", "0 <= edges.length <= 5000"],
    hints: ["A tree on n nodes has exactly n - 1 edges.", "With n - 1 edges, no cycle implies connectivity."],
    exp: "Check the edge count first, then union every edge; a failed union means a cycle.",
    steps: ["If edges.length !== n - 1 return false.", "Union all edges; return false on a failed union."],
    tc: "O(n · α(n))", sc: "O(n)",
    fn: ["validTree", [["n", "int"], ["edges", "int[][]"]], "bool"],
    tests: [[[5, [[0, 1], [0, 2], [0, 3], [1, 4]]], true], [[5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]], false], [[1, []], true], [[4, [[0, 1], [2, 3]]], false]],
    js: `
${DSU}
var validTree = function(n, edges) {
    if (edges.length !== n - 1) return false;
    const d = new DSU(n);
    for (const [a, b] of edges) if (!d.union(a, b)) return false;
    return true;
};`,
  },
  // ------------------------------------------------------------ topological sort
  {
    t: "Course Schedule", d: "M", topic: "topological-sort", sub: "Cycle detection in DAGs", pat: ["topological-sort", "bfs"], tags: ["Graph", "Topological Sort"], co: ["amazon", "google", "meta", "microsoft", "apple", "flipkart", "atlassian"],
    desc: "There are `numCourses` courses labelled 0..numCourses-1. `prerequisites[i] = [a, b]` means you must take b before a. Return `true` if you can finish all courses.",
    cons: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000"],
    hints: ["You can finish all courses iff the prerequisite graph has no cycle.", "Kahn's algorithm repeatedly takes courses with no remaining prerequisites."],
    exp: "Build the graph and in-degrees. Kahn's algorithm processes zero in-degree courses, decrementing their dependents. If every course is processed, there is no cycle.",
    steps: ["Build adjacency lists b → a and in-degrees.", "Queue all courses with in-degree 0.", "Pop, count, decrement neighbours; return count == numCourses."],
    tc: "O(V + E)", sc: "O(V + E)",
    fn: ["canFinish", [["numCourses", "int"], ["prerequisites", "int[][]"]], "bool"],
    tests: [[[2, [[1, 0]]], true], [[2, [[1, 0], [0, 1]]], false], [[4, [[1, 0], [2, 1], [3, 2], [1, 3]]], false], [[3, []], true]],
    js: `
var canFinish = function(numCourses, prerequisites) {
    const adj = Array.from({ length: numCourses }, () => []), indeg = new Array(numCourses).fill(0);
    for (const [a, b] of prerequisites) { adj[b].push(a); indeg[a]++; }
    const q = [];
    indeg.forEach((d, i) => d === 0 && q.push(i));
    let done = 0;
    for (let h = 0; h < q.length; h++) {
        done++;
        for (const v of adj[q[h]]) if (--indeg[v] === 0) q.push(v);
    }
    return done === numCourses;
};`,
    py: `
class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        adj = [[] for _ in range(numCourses)]
        indeg = [0] * numCourses
        for a, b in prerequisites:
            adj[b].append(a)
            indeg[a] += 1
        q = deque(i for i in range(numCourses) if indeg[i] == 0)
        done = 0
        while q:
            u = q.popleft()
            done += 1
            for v in adj[u]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)
        return done == numCourses`,
  },
  {
    t: "Course Schedule II", d: "M", topic: "topological-sort", sub: "Producing an order", pat: ["topological-sort"], tags: ["Graph", "Topological Sort"], co: ["amazon", "google", "meta", "microsoft"],
    desc: "Same setup as Course Schedule. Return an ordering of courses you can take to finish all of them, or an empty array if impossible. The tests here have exactly one valid ordering.",
    cons: ["1 <= numCourses <= 2000"],
    hints: ["Record the order in which Kahn's algorithm removes courses."],
    exp: "Kahn's algorithm outputs courses in an order that respects all prerequisites. If fewer than numCourses are output, a cycle exists.",
    steps: ["Run Kahn's algorithm collecting the order.", "Return the order if complete, else []."],
    tc: "O(V + E)", sc: "O(V + E)",
    fn: ["findOrder", [["numCourses", "int"], ["prerequisites", "int[][]"]], "int[]"],
    tests: [[[2, [[1, 0]]], [0, 1]], [[3, [[1, 0], [2, 1]]], [0, 1, 2]], [[2, [[1, 0], [0, 1]]], []], [[1, []], [0]]],
    js: `
var findOrder = function(numCourses, prerequisites) {
    const adj = Array.from({ length: numCourses }, () => []), indeg = new Array(numCourses).fill(0);
    for (const [a, b] of prerequisites) { adj[b].push(a); indeg[a]++; }
    const q = [];
    indeg.forEach((d, i) => d === 0 && q.push(i));
    for (let h = 0; h < q.length; h++) for (const v of adj[q[h]]) if (--indeg[v] === 0) q.push(v);
    return q.length === numCourses ? q : [];
};`,
  },
  {
    t: "Alien Dictionary", d: "H", topic: "topological-sort", sub: "Deriving constraints", pat: ["topological-sort", "bfs"], tags: ["Graph", "Topological Sort", "String"], co: ["google", "meta", "amazon", "microsoft", "apple"],
    desc: "You receive a list of `words` sorted lexicographically by an alien alphabet. Return a string of the unique letters in that alphabet's order, or \"\" if the order is invalid. The tests here have a unique valid order.",
    cons: ["1 <= words.length <= 100", "1 <= words[i].length <= 100"],
    hints: ["Compare adjacent words: the first differing letter gives an edge.", "A longer word before its own prefix is invalid."],
    exp: "Extract ordering constraints from each adjacent pair of words, then topologically sort the letters. A cycle or an invalid prefix order means no valid alphabet.",
    steps: ["Collect all letters with in-degree 0.", "For each adjacent pair add an edge at the first difference (or fail on bad prefix).", "Kahn's algorithm; return '' if not all letters are output."],
    tc: "O(total characters)", sc: "O(1) (bounded alphabet)",
    fn: ["alienOrder", [["words", "string[]"]], "string"],
    tests: [[[["wrt", "wrf", "er", "ett", "rftt"]], "wertf"], [[["z", "x"]], "zx"], [[["z", "x", "z"]], ""], [[["abc", "ab"]], ""]],
    js: `
var alienOrder = function(words) {
    const adj = new Map(), indeg = new Map();
    for (const w of words) for (const c of w) { if (!adj.has(c)) { adj.set(c, new Set()); indeg.set(c, 0); } }
    for (let i = 0; i + 1 < words.length; i++) {
        const a = words[i], b = words[i + 1];
        if (a.length > b.length && a.startsWith(b)) return "";
        for (let j = 0; j < Math.min(a.length, b.length); j++) {
            if (a[j] !== b[j]) {
                if (!adj.get(a[j]).has(b[j])) { adj.get(a[j]).add(b[j]); indeg.set(b[j], indeg.get(b[j]) + 1); }
                break;
            }
        }
    }
    const q = [...indeg.keys()].filter((c) => indeg.get(c) === 0);
    for (let h = 0; h < q.length; h++) for (const v of adj.get(q[h])) { indeg.set(v, indeg.get(v) - 1); if (indeg.get(v) === 0) q.push(v); }
    return q.length === adj.size ? q.join("") : "";
};`,
  },
  {
    t: "Find Eventual Safe States", d: "M", topic: "topological-sort", sub: "Reverse topological order", pat: ["topological-sort", "dfs"], tags: ["Graph", "Topological Sort"], co: ["google", "amazon"],
    desc: "In a directed graph given as adjacency lists `graph`, a node is safe if every path starting from it leads to a terminal node (no outgoing edges). Return all safe nodes in ascending order.",
    cons: ["1 <= n <= 10^4", "0 <= graph[i].length <= n"],
    hints: ["Reverse the edges and run Kahn's algorithm from terminal nodes."],
    exp: "A node is safe when all its out-neighbours are safe. Reverse the graph and peel nodes whose out-degree drops to zero, starting from terminal nodes.",
    steps: ["outdeg[i] = graph[i].length; build reverse edges.", "Queue terminals; decrement outdeg of predecessors.", "Return nodes that reach outdeg 0, sorted."],
    tc: "O(V + E)", sc: "O(V + E)",
    fn: ["eventualSafeNodes", [["graph", "int[][]"]], "int[]"],
    tests: [[[[[1, 2], [2, 3], [5], [0], [5], [], []]], [2, 4, 5, 6]], [[[[1, 2, 3, 4], [1, 2], [3, 4], [0, 4], []]], [4]]],
    js: `
var eventualSafeNodes = function(graph) {
    const n = graph.length, rev = Array.from({ length: n }, () => []), out = graph.map((g) => g.length);
    graph.forEach((g, u) => g.forEach((v) => rev[v].push(u)));
    const q = [];
    out.forEach((d, i) => d === 0 && q.push(i));
    for (let h = 0; h < q.length; h++) for (const u of rev[q[h]]) if (--out[u] === 0) q.push(u);
    return q.sort((a, b) => a - b);
};`,
  },
  // ------------------------------------------------------------ shortest path (general)
  {
    t: "Path With Minimum Effort", d: "M", topic: "shortest-path", sub: "Minimax paths", pat: ["binary-search", "bfs"], tags: ["Graph", "Dijkstra", "Matrix"], co: ["google", "amazon", "meta"],
    desc: "Given a grid of `heights`, travel from the top-left to the bottom-right moving 4-directionally. A route's effort is the maximum absolute height difference between consecutive cells. Return the minimum effort.",
    cons: ["1 <= rows, columns <= 100", "1 <= heights[i][j] <= 10^6"],
    hints: ["The cost of a path is its largest step, not the sum.", "Dijkstra still works if you relax with max instead of +."],
    exp: "Run Dijkstra where the distance to a cell is the smallest possible maximum step needed to reach it. Relaxing with max(dist, |diff|) keeps the greedy property.",
    steps: ["dist[0][0] = 0; push into a min-heap.", "Pop the smallest; relax neighbours with max(d, |h diff|).", "Return dist at the target."],
    tc: "O(mn log mn)", sc: "O(mn)",
    fn: ["minimumEffortPath", [["heights", "int[][]"]], "int"],
    tests: [[[[[1, 2, 2], [3, 8, 2], [5, 3, 5]]], 2], [[[[1, 2, 3], [3, 8, 4], [5, 3, 5]]], 1], [[[[1, 2, 1, 1, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 1, 1, 2, 1]]], 0]],
    js: `
${HEAP}
var minimumEffortPath = function(heights) {
    const m = heights.length, n = heights[0].length;
    const dist = Array.from({ length: m }, () => new Array(n).fill(Infinity));
    const h = new Heap((a, b) => a[0] - b[0]);
    dist[0][0] = 0; h.push([0, 0, 0]);
    while (h.size()) {
        const [d, i, j] = h.pop();
        if (d > dist[i][j]) continue;
        if (i === m - 1 && j === n - 1) return d;
        for (const [a, b] of [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]]) {
            if (a < 0 || b < 0 || a >= m || b >= n) continue;
            const nd = Math.max(d, Math.abs(heights[a][b] - heights[i][j]));
            if (nd < dist[a][b]) { dist[a][b] = nd; h.push([nd, a, b]); }
        }
    }
    return 0;
};`,
  },
  {
    t: "Shortest Path in a Grid with Obstacles Elimination", d: "H", topic: "shortest-path", sub: "BFS with state", pat: ["bfs"], tags: ["Graph", "BFS", "Matrix"], co: ["google", "amazon"],
    desc: "Given a grid of 0 (empty) and 1 (obstacle) and an integer `k`, return the minimum number of steps to walk from the top-left to the bottom-right, eliminating at most `k` obstacles. Return -1 if impossible.",
    cons: ["1 <= m, n <= 40", "1 <= k <= m * n"],
    hints: ["The state is (row, column, obstacles removed so far)."],
    exp: "BFS over states that include remaining eliminations. Keeping the best remaining-k seen per cell prunes dominated states.",
    steps: ["BFS from (0, 0, k).", "Moving into an obstacle consumes one elimination.", "Only revisit a cell with more eliminations left than before."],
    tc: "O(m·n·k)", sc: "O(m·n·k)",
    fn: ["shortestPath", [["grid", "int[][]"], ["k", "int"]], "int"],
    tests: [[[[[0, 0, 0], [1, 1, 0], [0, 0, 0], [0, 1, 1], [0, 0, 0]], 1], 6], [[[[0, 1, 1], [1, 1, 1], [1, 0, 0]], 1], -1], [[[[0]], 1], 0]],
    js: `
var shortestPath = function(grid, k) {
    const m = grid.length, n = grid[0].length;
    const best = Array.from({ length: m }, () => new Array(n).fill(-1));
    let level = [[0, 0, k]], steps = 0;
    best[0][0] = k;
    while (level.length) {
        const next = [];
        for (const [i, j, r] of level) {
            if (i === m - 1 && j === n - 1) return steps;
            for (const [a, b] of [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]]) {
                if (a < 0 || b < 0 || a >= m || b >= n) continue;
                const nr = r - grid[a][b];
                if (nr > best[a][b]) { best[a][b] = nr; next.push([a, b, nr]); }
            }
        }
        level = next;
        steps++;
    }
    return -1;
};`,
  },
  // ------------------------------------------------------------ Dijkstra
  {
    t: "Network Delay Time", d: "M", topic: "dijkstra", sub: "Single-source shortest paths", pat: ["bfs"], tags: ["Graph", "Dijkstra", "Heap"], co: ["amazon", "google", "meta", "microsoft"],
    desc: "You are given a network of `n` nodes labelled 1..n and directed weighted edges `times[i] = [u, v, w]`. A signal is sent from node `k`. Return the time for all nodes to receive it, or -1 if some node never does.",
    cons: ["1 <= k <= n <= 100", "1 <= times.length <= 6000", "0 <= w <= 100"],
    hints: ["You need the shortest distance from k to every node; the answer is the largest of them.", "Weights are non-negative: use Dijkstra."],
    exp: "Dijkstra's algorithm finalises nodes in increasing distance order using a min-heap. The network delay is the maximum finalised distance, or -1 if a node stays unreachable.",
    steps: ["Build adjacency lists.", "Dijkstra from k with a min-heap of (dist, node).", "Return max distance, or -1 if any is Infinity."],
    tc: "O(E log V)", sc: "O(V + E)",
    fn: ["networkDelayTime", [["times", "int[][]"], ["n", "int"], ["k", "int"]], "int"],
    tests: [[[[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2], 2], [[[[1, 2, 1]], 2, 1], 1], [[[[1, 2, 1]], 2, 2], -1], [[[[1, 2, 4], [1, 3, 1], [3, 2, 1]], 3, 1], 2]],
    js: `
${HEAP}
var networkDelayTime = function(times, n, k) {
    const adj = Array.from({ length: n + 1 }, () => []);
    for (const [u, v, w] of times) adj[u].push([v, w]);
    const dist = new Array(n + 1).fill(Infinity);
    const h = new Heap((a, b) => a[0] - b[0]);
    dist[k] = 0; h.push([0, k]);
    while (h.size()) {
        const [d, u] = h.pop();
        if (d > dist[u]) continue;
        for (const [v, w] of adj[u]) if (d + w < dist[v]) { dist[v] = d + w; h.push([dist[v], v]); }
    }
    const mx = Math.max(...dist.slice(1));
    return mx === Infinity ? -1 : mx;
};`,
    py: `
class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        adj = defaultdict(list)
        for u, v, w in times:
            adj[u].append((v, w))
        dist = {}
        heap = [(0, k)]
        while heap:
            d, u = heapq.heappop(heap)
            if u in dist:
                continue
            dist[u] = d
            for v, w in adj[u]:
                if v not in dist:
                    heapq.heappush(heap, (d + w, v))
        return max(dist.values()) if len(dist) == n else -1`,
  },
  {
    t: "Path with Maximum Probability", d: "M", topic: "dijkstra", sub: "Multiplicative weights", pat: ["bfs"], tags: ["Graph", "Dijkstra", "Heap"], co: ["google", "amazon"],
    desc: "Given an undirected graph of `n` nodes, `edges` and their success probabilities `succProb`, return the maximum probability of a path from `start_node` to `end_node`, or 0 if no path exists.",
    cons: ["2 <= n <= 10^4", "0 <= succProb[i] <= 1"],
    hints: ["Multiplying probabilities never increases them, so a max-heap Dijkstra works."],
    exp: "Treat the problem as Dijkstra with a max-heap on probability: a node's best probability is final when popped because extending a path can only lower it.",
    steps: ["prob[start] = 1; max-heap.", "Relax neighbours with prob[u] * p.", "Return prob[end]."],
    tc: "O(E log V)", sc: "O(V + E)",
    fn: ["maxProbability", [["n", "int"], ["edges", "int[][]"], ["succProb", "double[]"], ["start_node", "int"], ["end_node", "int"]], "double"],
    cmp: "float",
    tests: [[[3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.2], 0, 2], 0.25], [[3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.3], 0, 2], 0.3], [[3, [[0, 1]], [0.5], 0, 2], 0.0]],
    js: `
${HEAP}
var maxProbability = function(n, edges, succProb, start_node, end_node) {
    const adj = Array.from({ length: n }, () => []);
    edges.forEach(([a, b], i) => { adj[a].push([b, succProb[i]]); adj[b].push([a, succProb[i]]); });
    const prob = new Array(n).fill(0);
    const h = new Heap((a, b) => b[0] - a[0]);
    prob[start_node] = 1; h.push([1, start_node]);
    while (h.size()) {
        const [p, u] = h.pop();
        if (u === end_node) return p;
        if (p < prob[u]) continue;
        for (const [v, w] of adj[u]) if (p * w > prob[v]) { prob[v] = p * w; h.push([prob[v], v]); }
    }
    return 0;
};`,
  },
  {
    t: "Swim in Rising Water", d: "H", topic: "dijkstra", sub: "Minimax paths", pat: ["binary-search", "union-find"], tags: ["Graph", "Dijkstra", "Heap", "Matrix"], co: ["google", "amazon", "meta"],
    desc: "In an `n x n` grid, `grid[i][j]` is the elevation. At time t the water level is t and you can swim between adjacent cells if both elevations are at most t. Return the least time to go from the top-left to the bottom-right.",
    cons: ["1 <= n <= 50", "Values are a permutation of 0..n²-1"],
    hints: ["The time needed for a path is its maximum elevation."],
    exp: "Dijkstra with a min-heap keyed by the maximum elevation on the path so far finds the route whose highest cell is lowest.",
    steps: ["Heap of (maxSoFar, i, j) starting at grid[0][0].", "Pop the smallest and expand neighbours with max(maxSoFar, elevation).", "Return when reaching the target."],
    tc: "O(n² log n)", sc: "O(n²)",
    fn: ["swimInWater", [["grid", "int[][]"]], "int"],
    tests: [[[[[0, 2], [1, 3]]], 3], [[[[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]]], 16], [[[[0]]], 0]],
    js: `
${HEAP}
var swimInWater = function(grid) {
    const n = grid.length, seen = Array.from({ length: n }, () => new Array(n).fill(false));
    const h = new Heap((a, b) => a[0] - b[0]);
    h.push([grid[0][0], 0, 0]); seen[0][0] = true;
    while (h.size()) {
        const [t, i, j] = h.pop();
        if (i === n - 1 && j === n - 1) return t;
        for (const [a, b] of [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]]) {
            if (a < 0 || b < 0 || a >= n || b >= n || seen[a][b]) continue;
            seen[a][b] = true;
            h.push([Math.max(t, grid[a][b]), a, b]);
        }
    }
    return -1;
};`,
  },
  // ------------------------------------------------------------ Bellman-Ford
  {
    t: "Cheapest Flights Within K Stops", d: "M", topic: "bellman-ford", sub: "Bounded relaxation", pat: ["bfs", "dynamic-programming"], tags: ["Graph", "Bellman-Ford", "Dynamic Programming"], co: ["amazon", "google", "meta", "microsoft", "flipkart"],
    desc: "There are `n` cities connected by `flights[i] = [from, to, price]`. Return the cheapest price from `src` to `dst` with at most `k` stops, or -1 if there is no such route.",
    cons: ["1 <= n <= 100", "0 <= k < n", "1 <= price <= 10^4"],
    hints: ["Bellman-Ford's i-th iteration finds the best paths using at most i edges.", "Relax from a copy of the previous round so one round uses only one more edge."],
    exp: "Run k + 1 rounds of Bellman-Ford relaxation. Each round reads from the previous round's prices so paths grow by at most one flight per round.",
    steps: ["price[src] = 0.", "Repeat k + 1 times: tmp = copy; relax every flight from price into tmp; price = tmp.", "Return price[dst] or -1."],
    tc: "O(k · E)", sc: "O(n)",
    fn: ["findCheapestPrice", [["n", "int"], ["flights", "int[][]"], ["src", "int"], ["dst", "int"], ["k", "int"]], "int"],
    tests: [[[4, [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], 0, 3, 1], 700], [[3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 1], 200], [[3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0], 500], [[2, [], 0, 1, 1], -1]],
    js: `
var findCheapestPrice = function(n, flights, src, dst, k) {
    let price = new Array(n).fill(Infinity);
    price[src] = 0;
    for (let i = 0; i <= k; i++) {
        const tmp = price.slice();
        for (const [u, v, w] of flights) if (price[u] + w < tmp[v]) tmp[v] = price[u] + w;
        price = tmp;
    }
    return price[dst] === Infinity ? -1 : price[dst];
};`,
  },
  {
    t: "Negative Weight Cycle Detection", d: "M", topic: "bellman-ford", sub: "Negative cycles", pat: [], tags: ["Graph", "Bellman-Ford"], co: ["google", "microsoft"],
    desc: "Given a directed graph with `n` nodes (0..n-1) and weighted `edges` `[u, v, w]` (weights may be negative), return `true` if the graph contains a cycle whose total weight is negative.",
    cons: ["1 <= n <= 500", "0 <= edges.length <= 5000", "-10^4 <= w <= 10^4"],
    hints: ["After n - 1 rounds of relaxation, any further improvement proves a negative cycle.", "Start with all distances 0 to detect cycles anywhere in the graph."],
    exp: "Bellman-Ford converges in n - 1 rounds without negative cycles. Initialising every distance to 0 acts like a virtual source connected to all nodes; if an n-th round still relaxes an edge, a negative cycle exists.",
    steps: ["dist = zeros.", "Relax all edges n - 1 times.", "If any edge still relaxes, return true."],
    tc: "O(V · E)", sc: "O(V)",
    fn: ["hasNegativeCycle", [["n", "int"], ["edges", "int[][]"]], "bool"],
    tests: [[[3, [[0, 1, 1], [1, 2, -2], [2, 0, -1]]], true], [[3, [[0, 1, 1], [1, 2, -2], [2, 0, 2]]], false], [[1, []], false], [[4, [[0, 1, 4], [2, 3, -1], [3, 2, 0]]], true]],
    js: `
var hasNegativeCycle = function(n, edges) {
    const dist = new Array(n).fill(0);
    for (let i = 0; i < n - 1; i++) for (const [u, v, w] of edges) if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    for (const [u, v, w] of edges) if (dist[u] + w < dist[v]) return true;
    return false;
};`,
  },
  // ------------------------------------------------------------ Floyd-Warshall
  {
    t: "Find the City With the Smallest Number of Neighbors at a Threshold Distance", d: "M", topic: "floyd-warshall", sub: "All-pairs shortest paths", pat: ["dynamic-programming"], tags: ["Graph", "Floyd-Warshall"], co: ["amazon", "google"],
    desc: "Given `n` cities, weighted undirected `edges` and a `distanceThreshold`, return the city with the fewest cities reachable within the threshold. Break ties by returning the city with the greatest label.",
    cons: ["2 <= n <= 100", "1 <= weight, distanceThreshold <= 10^4"],
    hints: ["You need distances between all pairs; n is small."],
    exp: "Floyd–Warshall computes all-pairs shortest paths by allowing each city in turn as an intermediate stop. Then count reachable cities per city.",
    steps: ["Initialise the distance matrix.", "For k, i, j: d[i][j] = min(d[i][j], d[i][k] + d[k][j]).", "Count neighbours within the threshold and pick the best city."],
    tc: "O(n³)", sc: "O(n²)",
    fn: ["findTheCity", [["n", "int"], ["edges", "int[][]"], ["distanceThreshold", "int"]], "int"],
    tests: [[[4, [[0, 1, 3], [1, 2, 1], [1, 3, 4], [2, 3, 1]], 4], 3], [[5, [[0, 1, 2], [0, 4, 8], [1, 2, 3], [1, 4, 2], [2, 3, 1], [3, 4, 1]], 2], 0]],
    js: `
var findTheCity = function(n, edges, distanceThreshold) {
    const d = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)));
    for (const [a, b, w] of edges) { d[a][b] = Math.min(d[a][b], w); d[b][a] = Math.min(d[b][a], w); }
    for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++)
        if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
    let best = -1, bestCount = Infinity;
    for (let i = 0; i < n; i++) {
        const c = d[i].filter((x, j) => j !== i && x <= distanceThreshold).length;
        if (c <= bestCount) { bestCount = c; best = i; }
    }
    return best;
};`,
  },
  {
    t: "Course Schedule IV", d: "M", topic: "floyd-warshall", sub: "Transitive closure", pat: ["topological-sort"], tags: ["Graph", "Floyd-Warshall"], co: ["google", "amazon"],
    desc: "Given `numCourses`, direct `prerequisites[i] = [a, b]` (a must be taken before b) and `queries[j] = [u, v]`, return for each query whether u is a prerequisite of v, directly or indirectly.",
    cons: ["2 <= numCourses <= 100", "1 <= queries.length <= 10^4"],
    hints: ["Compute reachability between all pairs once, then answer queries in O(1)."],
    exp: "Floyd–Warshall's triple loop with boolean OR/AND computes the transitive closure: reach[i][j] becomes true if i reaches k and k reaches j.",
    steps: ["reach[a][b] = true for direct edges.", "reach[i][j] ||= reach[i][k] && reach[k][j].", "Answer each query by lookup."],
    tc: "O(n³ + q)", sc: "O(n²)",
    fn: ["checkIfPrerequisite", [["numCourses", "int"], ["prerequisites", "int[][]"], ["queries", "int[][]"]], "bool[]"],
    tests: [[[2, [[1, 0]], [[0, 1], [1, 0]]], [false, true]], [[2, [], [[1, 0], [0, 1]]], [false, false]], [[3, [[1, 2], [1, 0], [2, 0]], [[1, 0], [1, 2]]], [true, true]]],
    js: `
var checkIfPrerequisite = function(numCourses, prerequisites, queries) {
    const n = numCourses, r = Array.from({ length: n }, () => new Array(n).fill(false));
    for (const [a, b] of prerequisites) r[a][b] = true;
    for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) if (r[i][k]) for (let j = 0; j < n; j++) if (r[k][j]) r[i][j] = true;
    return queries.map(([u, v]) => r[u][v]);
};`,
  },
  // ------------------------------------------------------------ MST / Kruskal / Prim
  {
    t: "Minimum Spanning Tree Weight", d: "M", topic: "mst", sub: "Spanning tree basics", pat: ["union-find", "greedy"], tags: ["Graph", "Minimum Spanning Tree"], co: ["amazon", "microsoft", "flipkart"],
    desc: "Given a connected undirected graph with `n` nodes (0..n-1) and weighted `edges` `[u, v, w]`, return the total weight of its minimum spanning tree.",
    cons: ["1 <= n <= 10^4", "n - 1 <= edges.length <= 10^5", "The graph is connected"],
    hints: ["Any spanning tree has n - 1 edges.", "The lightest edge crossing any cut belongs to some MST."],
    exp: "Sort edges by weight and add each edge that connects two different components (Kruskal). The cut property guarantees the result is minimum.",
    steps: ["Sort edges by weight.", "Union endpoints when they are in different sets; add the weight.", "Stop after n - 1 edges."],
    tc: "O(E log E)", sc: "O(V)",
    fn: ["mstWeight", [["n", "int"], ["edges", "int[][]"]], "int"],
    tests: [[[4, [[0, 1, 10], [0, 2, 6], [0, 3, 5], [1, 3, 15], [2, 3, 4]]], 19], [[3, [[0, 1, 1], [1, 2, 2], [0, 2, 3]]], 3], [[1, []], 0]],
    js: `
${DSU}
var mstWeight = function(n, edges) {
    const d = new DSU(n);
    let total = 0;
    for (const [u, v, w] of edges.slice().sort((a, b) => a[2] - b[2])) if (d.union(u, v)) total += w;
    return total;
};`,
  },
  {
    t: "Connecting Cities With Minimum Cost", d: "M", topic: "kruskal", sub: "Kruskal's algorithm", pat: ["union-find", "greedy"], tags: ["Graph", "Minimum Spanning Tree", "Union Find"], co: ["amazon", "google"],
    desc: "There are `n` cities labelled 1..n and `connections[i] = [x, y, cost]`. Return the minimum cost to connect all cities so every pair is connected, or -1 if it is impossible.",
    cons: ["1 <= n <= 10^4", "1 <= connections.length <= 10^4"],
    hints: ["This is an MST. Kruskal's algorithm sorts edges and unions greedily."],
    exp: "Kruskal's algorithm adds the cheapest edge that joins two different components until n - 1 edges are used. If fewer are possible, the graph is disconnected.",
    steps: ["Sort connections by cost.", "Union with a DSU and add costs.", "Return the total if n - 1 edges were used, else -1."],
    tc: "O(E log E)", sc: "O(n)",
    fn: ["minimumCost", [["n", "int"], ["connections", "int[][]"]], "int"],
    tests: [[[3, [[1, 2, 5], [1, 3, 6], [2, 3, 1]]], 6], [[4, [[1, 2, 3], [3, 4, 4]]], -1], [[2, [[1, 2, 7], [1, 2, 3]]], 3]],
    js: `
${DSU}
var minimumCost = function(n, connections) {
    const d = new DSU(n + 1);
    let total = 0, used = 0;
    for (const [a, b, w] of connections.slice().sort((x, y) => x[2] - y[2])) if (d.union(a, b)) { total += w; used++; }
    return used === n - 1 ? total : -1;
};`,
  },
  {
    t: "Min Cost to Connect All Points", d: "M", topic: "prim", sub: "Prim's algorithm", pat: ["greedy"], tags: ["Graph", "Minimum Spanning Tree"], co: ["amazon", "google", "microsoft", "meta"],
    desc: "Given `points` on a 2D plane, the cost of connecting two points is their Manhattan distance. Return the minimum cost to connect all points so there is exactly one path between any two.",
    cons: ["1 <= points.length <= 1000", "-10^6 <= x, y <= 10^6"],
    hints: ["The graph is complete, so Prim's O(n²) version beats sorting all n² edges."],
    exp: "Prim's algorithm grows the tree one point at a time, always adding the outside point closest to the tree. For dense graphs an array of best distances gives O(n²) without a heap.",
    steps: ["dist = Infinity, dist[0] = 0.", "Repeatedly pick the closest unused point, add its distance.", "Update other points' distances to the new point."],
    tc: "O(n²)", sc: "O(n)",
    fn: ["minCostConnectPoints", [["points", "int[][]"]], "int"],
    tests: [[[[[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]], 20], [[[[3, 12], [-2, 5], [-4, 1]]], 18], [[[[0, 0]]], 0]],
    js: `
var minCostConnectPoints = function(points) {
    const n = points.length, dist = new Array(n).fill(Infinity), used = new Array(n).fill(false);
    dist[0] = 0;
    let total = 0;
    for (let k = 0; k < n; k++) {
        let u = -1;
        for (let i = 0; i < n; i++) if (!used[i] && (u === -1 || dist[i] < dist[u])) u = i;
        used[u] = true;
        total += dist[u];
        for (let v = 0; v < n; v++) {
            if (used[v]) continue;
            const d = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
            if (d < dist[v]) dist[v] = d;
        }
    }
    return total;
};`,
  },
  {
    t: "Optimize Water Distribution in a Village", d: "H", topic: "prim", sub: "Virtual source MST", pat: ["union-find", "greedy"], tags: ["Graph", "Minimum Spanning Tree"], co: ["google", "meta"],
    desc: "There are `n` houses. Building a well in house i costs `wells[i - 1]`; laying a pipe `[a, b, cost]` connects two houses. Return the minimum total cost to supply water to all houses.",
    cons: ["2 <= n <= 10^4", "wells.length == n", "1 <= pipes.length <= 10^4"],
    hints: ["Add a virtual node 0 connected to each house with the well cost."],
    exp: "Model each well as an edge from a virtual source to the house. The cheapest way to supply every house is then the MST of the augmented graph.",
    steps: ["Edges = pipes + [0, i, wells[i - 1]].", "Run Kruskal over n + 1 nodes."],
    tc: "O((n + P) log(n + P))", sc: "O(n + P)",
    fn: ["minCostToSupplyWater", [["n", "int"], ["wells", "int[]"], ["pipes", "int[][]"]], "int"],
    tests: [[[3, [1, 2, 2], [[1, 2, 1], [2, 3, 1]]], 3], [[2, [1, 1], [[1, 2, 1], [1, 2, 2]]], 2]],
    js: `
${DSU}
var minCostToSupplyWater = function(n, wells, pipes) {
    const edges = pipes.concat(wells.map((w, i) => [0, i + 1, w])).sort((a, b) => a[2] - b[2]);
    const d = new DSU(n + 1);
    let total = 0;
    for (const [a, b, w] of edges) if (d.union(a, b)) total += w;
    return total;
};`,
  },
  // ------------------------------------------------------------ DSU
  {
    t: "Redundant Connection", d: "M", topic: "dsu", sub: "Cycle-closing edges", pat: ["union-find"], tags: ["Graph", "Union Find"], co: ["google", "amazon", "microsoft"],
    desc: "A tree with `n` nodes labelled 1..n had one extra edge added. Given the `edges`, return an edge that can be removed so the result is a tree. If there are several, return the one that occurs last in the input.",
    cons: ["3 <= n <= 1000", "edges.length == n"],
    hints: ["The first edge whose endpoints are already connected closes the cycle."],
    exp: "Union edges in order with a DSU. The first edge whose endpoints already share a root creates the cycle, and it is also the last cycle edge in input order.",
    steps: ["DSU over 1..n.", "Return the first edge where union fails."],
    tc: "O(n · α(n))", sc: "O(n)",
    fn: ["findRedundantConnection", [["edges", "int[][]"]], "int[]"],
    tests: [[[[[1, 2], [1, 3], [2, 3]]], [2, 3]], [[[[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]], [1, 4]]],
    js: `
${DSU}
var findRedundantConnection = function(edges) {
    const d = new DSU(edges.length + 1);
    for (const e of edges) if (!d.union(e[0], e[1])) return e;
    return [];
};`,
  },
  {
    t: "Number of Operations to Make Network Connected", d: "M", topic: "dsu", sub: "Spare edges", pat: ["union-find"], tags: ["Graph", "Union Find"], co: ["amazon", "microsoft"],
    desc: "There are `n` computers and `connections[i] = [a, b]` cables. You may move any cable between two computers. Return the minimum number of moves to connect all computers, or -1 if impossible.",
    cons: ["1 <= n <= 10^5", "1 <= connections.length <= min(n(n-1)/2, 10^5)"],
    hints: ["You need at least n - 1 cables.", "The answer is the number of components minus one."],
    exp: "If there are fewer than n - 1 cables it is impossible. Otherwise redundant cables can always be moved, and connecting c components takes c - 1 moves.",
    steps: ["If connections < n - 1 return -1.", "Union all cables and return components - 1."],
    tc: "O(n + E)", sc: "O(n)",
    fn: ["makeConnected", [["n", "int"], ["connections", "int[][]"]], "int"],
    tests: [[[4, [[0, 1], [0, 2], [1, 2]]], 1], [[6, [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3]]], 2], [[6, [[0, 1], [0, 2], [0, 3], [1, 2]]], -1]],
    js: `
${DSU}
var makeConnected = function(n, connections) {
    if (connections.length < n - 1) return -1;
    const d = new DSU(n);
    for (const [a, b] of connections) d.union(a, b);
    return d.count - 1;
};`,
  },
  {
    t: "Satisfiability of Equality Equations", d: "M", topic: "dsu", sub: "Equivalence classes", pat: ["union-find"], tags: ["Graph", "Union Find", "String"], co: ["google", "amazon"],
    desc: "Given equations like \"a==b\" or \"a!=b\" over single-letter variables, return `true` if it is possible to assign integers to variables to satisfy all equations.",
    cons: ["1 <= equations.length <= 500", "Each equation has length 4"],
    hints: ["Process all '==' first to build groups, then check every '!='."],
    exp: "Union variables joined by equality. Then any inequality whose two sides ended up in the same group makes the system unsatisfiable.",
    steps: ["Union for every '=='.", "For every '!=', fail if both sides share a root."],
    tc: "O(n · α(26))", sc: "O(26)",
    fn: ["equationsPossible", [["equations", "string[]"]], "bool"],
    tests: [[[["a==b", "b!=a"]], false], [[["b==a", "a==b"]], true], [[["a==b", "b==c", "a==c"]], true], [[["a==b", "b!=c", "c==a"]], false]],
    js: `
${DSU}
var equationsPossible = function(equations) {
    const d = new DSU(26), id = (c) => c.charCodeAt(0) - 97;
    for (const e of equations) if (e[1] === "=") d.union(id(e[0]), id(e[3]));
    for (const e of equations) if (e[1] === "!" && d.find(id(e[0])) === d.find(id(e[3]))) return false;
    return true;
};`,
  },
  {
    t: "Most Stones Removed with Same Row or Column", d: "M", topic: "dsu", sub: "Grouping by shared keys", pat: ["union-find", "dfs"], tags: ["Graph", "Union Find"], co: ["google", "amazon"],
    desc: "Stones lie on integer coordinates. A stone can be removed if another stone shares its row or column. Return the largest number of stones that can be removed.",
    cons: ["1 <= stones.length <= 1000", "No two stones share a position"],
    hints: ["Stones connected through shared rows or columns form groups.", "Each group can be reduced to a single stone."],
    exp: "Union each stone's row with its column (offset columns to keep them distinct). Every connected group can be removed down to one stone, so the answer is stones - groups.",
    steps: ["Union row x with column y + 10001 for each stone.", "Count distinct roots among used keys.", "Return stones.length - groups."],
    tc: "O(n · α(n))", sc: "O(n)",
    fn: ["removeStones", [["stones", "int[][]"]], "int"],
    tests: [[[[[0, 0], [0, 1], [1, 0], [1, 2], [2, 1], [2, 2]]], 5], [[[[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]]], 3], [[[[0, 0]]], 0]],
    js: `
var removeStones = function(stones) {
    const parent = new Map();
    const find = (x) => { if (!parent.has(x)) parent.set(x, x); while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); } return x; };
    for (const [r, c] of stones) parent.set(find(r), find(c + 10001));
    const roots = new Set([...parent.keys()].map(find));
    return stones.length - roots.size;
};`,
  },
];
