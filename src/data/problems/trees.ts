import type { ProblemDef } from "./builder";

export const HEAP = `class Heap {
    constructor(cmp) { this.a = []; this.c = cmp; }
    size() { return this.a.length; }
    peek() { return this.a[0]; }
    push(v) {
        const a = this.a; a.push(v);
        let i = a.length - 1;
        while (i > 0) { const p = (i - 1) >> 1; if (this.c(a[i], a[p]) >= 0) break; [a[i], a[p]] = [a[p], a[i]]; i = p; }
    }
    pop() {
        const a = this.a, top = a[0], last = a.pop();
        if (a.length) {
            a[0] = last;
            let i = 0;
            for (;;) {
                const l = 2 * i + 1, r = l + 1; let m = i;
                if (l < a.length && this.c(a[l], a[m]) < 0) m = l;
                if (r < a.length && this.c(a[r], a[m]) < 0) m = r;
                if (m === i) break;
                [a[i], a[m]] = [a[m], a[i]]; i = m;
            }
        }
        return top;
    }
}`;

export const treeProblems: ProblemDef[] = [
  // ------------------------------------------------------------ binary trees
  {
    t: "Maximum Depth of Binary Tree", d: "E", topic: "binary-trees", sub: "Tree recursion", pat: ["dfs", "bfs"], tags: ["Tree", "DFS"], co: ["amazon", "microsoft", "google", "apple", "adobe"],
    desc: "Given the `root` of a binary tree, return its maximum depth: the number of nodes along the longest path from the root down to the farthest leaf.",
    cons: ["The number of nodes is in the range [0, 10^4]", "-100 <= Node.val <= 100"],
    hints: ["The depth of a tree is 1 + the larger depth of its two subtrees."],
    exp: "A tree's depth is defined recursively: empty trees have depth 0, otherwise 1 plus the maximum depth of the children.",
    steps: ["If root is null return 0.", "Return 1 + max(maxDepth(left), maxDepth(right))."],
    tc: "O(n)", sc: "O(h)",
    fn: ["maxDepth", [["root", "TreeNode"]], "int"],
    tests: [[[[3, 9, 20, null, null, 15, 7]], 3], [[[1, null, 2]], 2], [[[]], 0], [[[1, 2, null, 3, null, 4]], 4]],
    js: `
var maxDepth = function(root) {
    if (!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
};`,
    py: `
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))`,
    alt: [{ name: "BFS level count", time: "O(n)", space: "O(w)", note: "Count levels while traversing level by level." }],
  },
  {
    t: "Invert Binary Tree", d: "E", topic: "binary-trees", sub: "Tree recursion", pat: ["dfs"], tags: ["Tree", "DFS", "BFS"], co: ["google", "amazon", "microsoft", "apple"],
    desc: "Given the `root` of a binary tree, invert the tree (mirror it left to right) and return its root.",
    cons: ["The number of nodes is in the range [0, 100]"],
    hints: ["Swap the children of every node."],
    exp: "Mirroring a tree means swapping each node's left and right child. Do it at the root and recursively in both subtrees.",
    steps: ["If root is null return null.", "Swap left and right, then invert both subtrees.", "Return root."],
    tc: "O(n)", sc: "O(h)",
    fn: ["invertTree", [["root", "TreeNode"]], "TreeNode"],
    tests: [[[[4, 2, 7, 1, 3, 6, 9]], [4, 7, 2, 9, 6, 3, 1]], [[[2, 1, 3]], [2, 3, 1]], [[[]], []]],
    js: `
var invertTree = function(root) {
    if (!root) return null;
    [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
    return root;
};`,
  },
  {
    t: "Diameter of Binary Tree", d: "E", topic: "binary-trees", sub: "Height with side effects", pat: ["dfs"], tags: ["Tree", "DFS"], co: ["meta", "amazon", "google", "microsoft"],
    desc: "Given the `root` of a binary tree, return the length of its diameter: the number of edges on the longest path between any two nodes. The path may not pass through the root.",
    cons: ["The number of nodes is in the range [1, 10^4]"],
    hints: ["The longest path through a node equals height(left) + height(right).", "Compute heights once and update a global best."],
    exp: "A post-order DFS returns each subtree's height. At every node, the path through it has length leftHeight + rightHeight; keep the maximum.",
    steps: ["height(node) returns 0 for null.", "best = max(best, hl + hr).", "Return 1 + max(hl, hr)."],
    tc: "O(n)", sc: "O(h)",
    fn: ["diameterOfBinaryTree", [["root", "TreeNode"]], "int"],
    tests: [[[[1, 2, 3, 4, 5]], 3], [[[1, 2]], 1], [[[1]], 0], [[[1, 2, null, 3, 4, 5, null, null, 6]], 4]],
    js: `
var diameterOfBinaryTree = function(root) {
    let best = 0;
    const height = (n) => {
        if (!n) return 0;
        const l = height(n.left), r = height(n.right);
        best = Math.max(best, l + r);
        return 1 + Math.max(l, r);
    };
    height(root);
    return best;
};`,
  },
  {
    t: "Same Tree", d: "E", topic: "binary-trees", sub: "Parallel recursion", pat: ["dfs"], tags: ["Tree", "DFS"], co: ["amazon", "microsoft", "adobe"],
    desc: "Given the roots of two binary trees `p` and `q`, return `true` if they are structurally identical and their nodes have the same values.",
    cons: ["The number of nodes in both trees is in the range [0, 100]"],
    hints: ["Compare the roots, then compare the left subtrees and the right subtrees."],
    exp: "Recurse on both trees simultaneously; any difference in presence or value makes them different.",
    steps: ["Both null → true; one null → false.", "Values differ → false.", "Recurse left and right."],
    tc: "O(n)", sc: "O(h)",
    fn: ["isSameTree", [["p", "TreeNode"], ["q", "TreeNode"]], "bool"],
    tests: [[[[1, 2, 3], [1, 2, 3]], true], [[[1, 2], [1, null, 2]], false], [[[1, 2, 1], [1, 1, 2]], false], [[[], []], true]],
    js: `
var isSameTree = function(p, q) {
    if (!p || !q) return p === q;
    return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
};`,
  },
  {
    t: "Symmetric Tree", d: "E", topic: "binary-trees", sub: "Mirror recursion", pat: ["dfs", "bfs"], tags: ["Tree", "DFS"], co: ["microsoft", "amazon", "google"],
    desc: "Given the `root` of a binary tree, check whether it is a mirror of itself (symmetric around its centre).",
    cons: ["The number of nodes is in the range [1, 1000]"],
    hints: ["Two subtrees mirror each other if their roots match and left.left mirrors right.right, left.right mirrors right.left."],
    exp: "Compare the left and right subtrees as mirrors: outer children with outer children, inner with inner.",
    steps: ["mirror(a, b): both null → true; one null or different values → false.", "Return mirror(a.left, b.right) && mirror(a.right, b.left)."],
    tc: "O(n)", sc: "O(h)",
    fn: ["isSymmetric", [["root", "TreeNode"]], "bool"],
    tests: [[[[1, 2, 2, 3, 4, 4, 3]], true], [[[1, 2, 2, null, 3, null, 3]], false], [[[1]], true]],
    js: `
var isSymmetric = function(root) {
    const mirror = (a, b) => (!a || !b ? a === b : a.val === b.val && mirror(a.left, b.right) && mirror(a.right, b.left));
    return mirror(root.left, root.right);
};`,
  },
  {
    t: "Balanced Binary Tree", d: "E", topic: "binary-trees", sub: "Height with early exit", pat: ["dfs"], tags: ["Tree", "DFS"], co: ["amazon", "google", "flipkart"],
    desc: "Given a binary tree, determine if it is height-balanced: for every node, the heights of the two subtrees differ by at most one.",
    cons: ["The number of nodes is in the range [0, 5000]"],
    hints: ["Return -1 from the height function to signal an unbalanced subtree."],
    exp: "Compute heights bottom-up; as soon as any node's children differ by more than one, propagate a sentinel so the work stays O(n).",
    steps: ["h(null) = 0.", "If either child is -1 or |hl - hr| > 1 return -1.", "Return 1 + max(hl, hr)."],
    tc: "O(n)", sc: "O(h)",
    fn: ["isBalanced", [["root", "TreeNode"]], "bool"],
    tests: [[[[3, 9, 20, null, null, 15, 7]], true], [[[1, 2, 2, 3, 3, null, null, 4, 4]], false], [[[]], true]],
    js: `
var isBalanced = function(root) {
    const h = (n) => {
        if (!n) return 0;
        const l = h(n.left), r = h(n.right);
        if (l < 0 || r < 0 || Math.abs(l - r) > 1) return -1;
        return 1 + Math.max(l, r);
    };
    return h(root) >= 0;
};`,
  },
  {
    t: "Path Sum", d: "E", topic: "binary-trees", sub: "Root-to-leaf paths", pat: ["dfs"], tags: ["Tree", "DFS"], co: ["amazon", "microsoft", "meta"],
    desc: "Given the `root` of a binary tree and an integer `targetSum`, return `true` if the tree has a root-to-leaf path whose values add up to `targetSum`.",
    cons: ["The number of nodes is in the range [0, 5000]", "-1000 <= Node.val, targetSum <= 1000"],
    hints: ["Subtract the node's value from the target as you go down."],
    exp: "Carry the remaining target into each recursive call. At a leaf, check whether the remaining target equals the leaf's value.",
    steps: ["Null → false.", "Leaf → val === target.", "Recurse with target - val."],
    tc: "O(n)", sc: "O(h)",
    fn: ["hasPathSum", [["root", "TreeNode"], ["targetSum", "int"]], "bool"],
    tests: [[[[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], 22], true], [[[1, 2, 3], 5], false], [[[], 0], false]],
    js: `
var hasPathSum = function(root, targetSum) {
    if (!root) return false;
    if (!root.left && !root.right) return root.val === targetSum;
    return hasPathSum(root.left, targetSum - root.val) || hasPathSum(root.right, targetSum - root.val);
};`,
  },
  {
    t: "Binary Tree Maximum Path Sum", d: "H", topic: "binary-trees", sub: "Gain recursion", pat: ["dfs", "dynamic-programming"], tags: ["Tree", "DFS", "Dynamic Programming"], co: ["google", "meta", "amazon", "microsoft", "flipkart"],
    desc: "A path in a binary tree is a sequence of adjacent nodes where each node appears at most once; it need not pass through the root. Given the `root`, return the maximum path sum of any non-empty path.",
    cons: ["The number of nodes is in the range [1, 3 * 10^4]", "-1000 <= Node.val <= 1000"],
    hints: ["Each node can extend at most one child upward, but a path can bend at one node.", "Ignore negative gains."],
    exp: "DFS returns the best downward gain from each node (never negative). At each node the best bending path is val + leftGain + rightGain, which updates the global maximum.",
    steps: ["gain(null) = 0.", "l = max(0, gain(left)), r = max(0, gain(right)).", "best = max(best, val + l + r); return val + max(l, r)."],
    tc: "O(n)", sc: "O(h)",
    fn: ["maxPathSum", [["root", "TreeNode"]], "int"],
    tests: [[[[1, 2, 3]], 6], [[[-10, 9, 20, null, null, 15, 7]], 42], [[[-3]], -3], [[[2, -1]], 2]],
    js: `
var maxPathSum = function(root) {
    let best = -Infinity;
    const gain = (n) => {
        if (!n) return 0;
        const l = Math.max(0, gain(n.left)), r = Math.max(0, gain(n.right));
        best = Math.max(best, n.val + l + r);
        return n.val + Math.max(l, r);
    };
    gain(root);
    return best;
};`,
  },
  {
    t: "Construct Binary Tree from Preorder and Inorder Traversal", d: "M", topic: "binary-trees", sub: "Tree construction", pat: ["dfs", "hash-map"], tags: ["Tree", "Divide and Conquer"], co: ["amazon", "microsoft", "google", "meta", "adobe"],
    desc: "Given two integer arrays `preorder` and `inorder` of the same binary tree (values are unique), construct and return the tree.",
    cons: ["1 <= preorder.length <= 3000", "All values are unique"],
    hints: ["The first preorder value is the root.", "Its position in inorder splits the left and right subtrees."],
    exp: "Take roots from preorder in order. A hash map from value to inorder index tells how many nodes fall in the left subtree, which bounds each recursive call.",
    steps: ["Map inorder value → index.", "build(lo, hi): root = preorder[p++]; split at idx[root].", "Build left (lo..idx-1) then right (idx+1..hi)."],
    tc: "O(n)", sc: "O(n)",
    fn: ["buildTree", [["preorder", "int[]"], ["inorder", "int[]"]], "TreeNode"],
    tests: [[[[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]], [3, 9, 20, null, null, 15, 7]], [[[-1], [-1]], [-1]], [[[1, 2, 3], [2, 1, 3]], [1, 2, 3]]],
    js: `
var buildTree = function(preorder, inorder) {
    const idx = new Map(inorder.map((v, i) => [v, i]));
    let p = 0;
    const build = (lo, hi) => {
        if (lo > hi) return null;
        const root = new TreeNode(preorder[p++]);
        const m = idx.get(root.val);
        root.left = build(lo, m - 1);
        root.right = build(m + 1, hi);
        return root;
    };
    return build(0, inorder.length - 1);
};`,
  },
  {
    t: "Binary Tree Right Side View", d: "M", topic: "binary-trees", sub: "Level views", pat: ["bfs", "dfs"], tags: ["Tree", "BFS"], co: ["meta", "amazon", "microsoft", "atlassian"],
    desc: "Given the `root` of a binary tree, imagine standing on its right side. Return the values of the nodes you can see, ordered from top to bottom.",
    cons: ["The number of nodes is in the range [0, 100]"],
    hints: ["The visible node of each level is the last one in a left-to-right BFS."],
    exp: "Traverse level by level and record the last node of every level.",
    steps: ["BFS with a queue.", "For each level, push the value of the last node processed."],
    tc: "O(n)", sc: "O(w)",
    fn: ["rightSideView", [["root", "TreeNode"]], "int[]"],
    tests: [[[[1, 2, 3, null, 5, null, 4]], [1, 3, 4]], [[[1, null, 3]], [1, 3]], [[[]], []], [[[1, 2, 3, 4]], [1, 3, 4]]],
    js: `
var rightSideView = function(root) {
    if (!root) return [];
    const res = [];
    let level = [root];
    while (level.length) {
        res.push(level[level.length - 1].val);
        const next = [];
        for (const n of level) { if (n.left) next.push(n.left); if (n.right) next.push(n.right); }
        level = next;
    }
    return res;
};`,
  },
  {
    t: "Count Good Nodes in Binary Tree", d: "M", topic: "binary-trees", sub: "Path state", pat: ["dfs"], tags: ["Tree", "DFS"], co: ["microsoft", "amazon"],
    desc: "A node X is good if on the path from the root to X there are no nodes with a value greater than X. Return the number of good nodes in the tree.",
    cons: ["The number of nodes is in the range [1, 10^5]"],
    hints: ["Pass the maximum value seen so far down the recursion."],
    exp: "DFS while carrying the largest value on the current path. A node is good if its value is at least that maximum.",
    steps: ["dfs(node, maxSoFar).", "Count node if val >= maxSoFar; recurse with max(maxSoFar, val)."],
    tc: "O(n)", sc: "O(h)",
    fn: ["goodNodes", [["root", "TreeNode"]], "int"],
    tests: [[[[3, 1, 4, 3, null, 1, 5]], 4], [[[3, 3, null, 4, 2]], 3], [[[1]], 1]],
    js: `
var goodNodes = function(root) {
    const dfs = (n, mx) => {
        if (!n) return 0;
        const good = n.val >= mx ? 1 : 0;
        const m = Math.max(mx, n.val);
        return good + dfs(n.left, m) + dfs(n.right, m);
    };
    return dfs(root, -Infinity);
};`,
  },
  {
    t: "Lowest Common Ancestor of a Binary Tree", d: "M", topic: "binary-trees", sub: "Ancestor search", pat: ["dfs"], tags: ["Tree", "DFS"], co: ["meta", "amazon", "microsoft", "google", "apple", "atlassian"],
    desc: "Given a binary tree with unique values and two values `p` and `q` that exist in the tree, return the value of their lowest common ancestor: the deepest node that has both as descendants (a node can be a descendant of itself).",
    cons: ["The number of nodes is in the range [2, 10^5]", "All values are unique", "p != q and both exist in the tree"],
    hints: ["If p and q are found in different subtrees of a node, that node is the LCA."],
    exp: "Recursively search for p or q. A node that receives a non-null result from both subtrees is the split point; otherwise pass up whichever side found something.",
    steps: ["If node is null or equals p or q, return node.", "Search left and right.", "Both non-null → node; else the non-null side."],
    tc: "O(n)", sc: "O(h)",
    fn: ["lowestCommonAncestor", [["root", "TreeNode"], ["p", "int"], ["q", "int"]], "int"],
    tests: [[[[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1], 3], [[[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4], 5], [[[1, 2], 1, 2], 1]],
    js: `
var lowestCommonAncestor = function(root, p, q) {
    const find = (n) => {
        if (!n || n.val === p || n.val === q) return n;
        const l = find(n.left), r = find(n.right);
        return l && r ? n : l || r;
    };
    return find(root).val;
};`,
  },
  {
    t: "Serialize and Deserialize Binary Tree", d: "H", topic: "binary-trees", sub: "Encoding trees", pat: ["dfs", "bfs"], tags: ["Tree", "Design", "String"], co: ["google", "meta", "amazon", "microsoft", "atlassian"],
    desc: "Design an algorithm to serialize a binary tree to a string and deserialize that string back to the original tree structure. Any format works as long as the round trip preserves the tree.",
    cons: ["The number of nodes is in the range [0, 10^4]", "-1000 <= Node.val <= 1000"],
    hints: ["Preorder with explicit null markers is enough to rebuild a tree uniquely."],
    exp: "Write a preorder traversal that emits a marker for null children. Reading the tokens back in the same order lets a recursive builder reconstruct the exact shape.",
    steps: ["serialize: preorder, '#' for null, join with commas.", "deserialize: split and rebuild recursively consuming tokens."],
    tc: "O(n)", sc: "O(n)",
    cls: {
      className: "Codec", ctor: [],
      methods: [
        { name: "serialize", params: [["root", "TreeNode"]], returns: "string" },
        { name: "deserialize", params: [["data", "string"]], returns: "TreeNode" },
      ],
    },
    runnable: false,
    tests: [[[["Codec", "serialize", "deserialize"], [[], [[1, 2, 3, null, null, 4, 5]], ["<serialized>"]]], [null, "<serialized>", [1, 2, 3, null, null, 4, 5]]], [[["Codec", "serialize", "deserialize"], [[], [[]], ["<serialized>"]]], [null, "<serialized>", []]]],
    js: `
class Codec {
    serialize(root) {
        const out = [];
        const go = (n) => { if (!n) { out.push("#"); return; } out.push(n.val); go(n.left); go(n.right); };
        go(root);
        return out.join(",");
    }
    deserialize(data) {
        const t = data.split(","); let i = 0;
        const go = () => { const v = t[i++]; if (v === "#") return null; const n = new TreeNode(Number(v)); n.left = go(); n.right = go(); return n; };
        return go();
    }
}`,
  },
  // ------------------------------------------------------------ BST
  {
    t: "Validate Binary Search Tree", d: "M", topic: "bst", sub: "BST invariants", pat: ["dfs"], tags: ["Tree", "BST", "DFS"], co: ["amazon", "microsoft", "meta", "google", "adobe", "flipkart"],
    desc: "Given the `root` of a binary tree, determine if it is a valid binary search tree: every node's left subtree contains only smaller values, its right subtree only larger values, and both subtrees are BSTs.",
    cons: ["The number of nodes is in the range [1, 10^4]", "-2^31 <= Node.val <= 2^31 - 1"],
    hints: ["Comparing a node only with its children is not enough.", "Pass the allowed (low, high) range down the tree."],
    exp: "Every node must lie strictly inside an interval inherited from its ancestors. Going left tightens the upper bound; going right tightens the lower bound.",
    steps: ["valid(node, lo, hi).", "Fail if node.val <= lo or >= hi.", "Recurse left with (lo, val) and right with (val, hi)."],
    tc: "O(n)", sc: "O(h)",
    fn: ["isValidBST", [["root", "TreeNode"]], "bool"],
    tests: [[[[2, 1, 3]], true], [[[5, 1, 4, null, null, 3, 6]], false], [[[5, 4, 6, null, null, 3, 7]], false], [[[2, 2, 2]], false]],
    js: `
var isValidBST = function(root) {
    const ok = (n, lo, hi) => !n || (n.val > lo && n.val < hi && ok(n.left, lo, n.val) && ok(n.right, n.val, hi));
    return ok(root, -Infinity, Infinity);
};`,
    py: `
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def ok(n, lo, hi):
            return not n or (lo < n.val < hi and ok(n.left, lo, n.val) and ok(n.right, n.val, hi))
        return ok(root, float("-inf"), float("inf"))`,
  },
  {
    t: "Kth Smallest Element in a BST", d: "M", topic: "bst", sub: "Inorder order", pat: ["dfs"], tags: ["Tree", "BST"], co: ["amazon", "google", "meta", "microsoft"],
    desc: "Given the `root` of a binary search tree and an integer `k`, return the `k`-th smallest value (1-indexed) of all the values in the tree.",
    cons: ["1 <= k <= n <= 10^4"],
    hints: ["An inorder traversal of a BST visits values in sorted order."],
    exp: "Run an iterative inorder traversal and stop at the k-th visited node, avoiding a full traversal when k is small.",
    steps: ["Push left spine onto a stack.", "Pop, decrement k, return when k hits 0.", "Move to the right child."],
    tc: "O(h + k)", sc: "O(h)",
    fn: ["kthSmallest", [["root", "TreeNode"], ["k", "int"]], "int"],
    tests: [[[[3, 1, 4, null, 2], 1], 1], [[[5, 3, 6, 2, 4, null, null, 1], 3], 3], [[[1], 1], 1]],
    js: `
var kthSmallest = function(root, k) {
    const st = [];
    let cur = root;
    while (cur || st.length) {
        while (cur) { st.push(cur); cur = cur.left; }
        cur = st.pop();
        if (--k === 0) return cur.val;
        cur = cur.right;
    }
    return -1;
};`,
  },
  {
    t: "Lowest Common Ancestor of a Binary Search Tree", d: "M", topic: "bst", sub: "BST navigation", pat: [], tags: ["Tree", "BST"], co: ["amazon", "meta", "microsoft"],
    desc: "Given a BST and two values `p` and `q` present in it, return the value of their lowest common ancestor.",
    cons: ["The number of nodes is in the range [2, 10^5]", "All values are unique"],
    hints: ["If both values are smaller than the node, the LCA is in the left subtree."],
    exp: "Walk down from the root. When p and q fall on different sides of the current node (or one equals it), that node is the LCA.",
    steps: ["While true: if both < val go left; if both > val go right; else return val."],
    tc: "O(h)", sc: "O(1)",
    fn: ["lowestCommonAncestor", [["root", "TreeNode"], ["p", "int"], ["q", "int"]], "int"],
    tests: [[[[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8], 6], [[[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4], 2], [[[2, 1], 2, 1], 2]],
    js: `
var lowestCommonAncestor = function(root, p, q) {
    let n = root;
    while (n) {
        if (p < n.val && q < n.val) n = n.left;
        else if (p > n.val && q > n.val) n = n.right;
        else return n.val;
    }
    return -1;
};`,
  },
  {
    t: "Insert into a Binary Search Tree", d: "M", topic: "bst", sub: "BST modification", pat: [], tags: ["Tree", "BST"], co: ["amazon", "microsoft"],
    desc: "Given the `root` of a BST and a `val` not already in the tree, insert `val` as a new leaf in its correct position and return the root.",
    cons: ["The number of nodes is in the range [0, 10^4]", "val does not exist in the tree"],
    hints: ["Walk down as if searching for val; attach it where you fall off the tree."],
    exp: "Follow BST ordering from the root until reaching a null child, then attach a new node there.",
    steps: ["If root is null return new node.", "Walk left or right until the child slot is empty; attach."],
    tc: "O(h)", sc: "O(1)",
    fn: ["insertIntoBST", [["root", "TreeNode"], ["val", "int"]], "TreeNode"],
    tests: [[[[4, 2, 7, 1, 3], 5], [4, 2, 7, 1, 3, 5]], [[[40, 20, 60, 10, 30, 50, 70], 25], [40, 20, 60, 10, 30, 50, 70, null, null, 25]], [[[], 5], [5]]],
    js: `
var insertIntoBST = function(root, val) {
    if (!root) return new TreeNode(val);
    let n = root;
    while (true) {
        if (val < n.val) { if (!n.left) { n.left = new TreeNode(val); break; } n = n.left; }
        else { if (!n.right) { n.right = new TreeNode(val); break; } n = n.right; }
    }
    return root;
};`,
  },
  {
    t: "Search in a Binary Search Tree", d: "E", topic: "bst", sub: "BST navigation", pat: [], tags: ["Tree", "BST"], co: ["apple", "amazon"],
    desc: "Given the `root` of a BST and an integer `val`, return the subtree rooted at the node whose value equals `val`, or an empty tree if it does not exist.",
    cons: ["The number of nodes is in the range [1, 5000]"],
    hints: ["Use the BST ordering to choose a direction at each node."],
    exp: "Compare val with the current node and move left or right; the search follows a single root-to-leaf path.",
    steps: ["While node and node.val !== val, move left or right.", "Return node."],
    tc: "O(h)", sc: "O(1)",
    fn: ["searchBST", [["root", "TreeNode"], ["val", "int"]], "TreeNode"],
    tests: [[[[4, 2, 7, 1, 3], 2], [2, 1, 3]], [[[4, 2, 7, 1, 3], 5], []], [[[1], 1], [1]]],
    js: `
var searchBST = function(root, val) {
    let n = root;
    while (n && n.val !== val) n = val < n.val ? n.left : n.right;
    return n;
};`,
  },
  {
    t: "Two Sum IV - Input is a BST", d: "E", topic: "bst", sub: "BST + hashing", pat: ["hash-map", "dfs"], tags: ["Tree", "BST", "Hash Table"], co: ["meta", "amazon"],
    desc: "Given the `root` of a BST and an integer `k`, return `true` if there exist two different nodes whose values sum to `k`.",
    cons: ["The number of nodes is in the range [1, 10^4]"],
    hints: ["Traverse the tree remembering values you have already seen."],
    exp: "Any traversal with a hash set works: for each value check whether k - value was seen earlier.",
    steps: ["DFS through nodes.", "If seen has k - val return true; add val."],
    tc: "O(n)", sc: "O(n)",
    fn: ["findTarget", [["root", "TreeNode"], ["k", "int"]], "bool"],
    tests: [[[[5, 3, 6, 2, 4, null, 7], 9], true], [[[5, 3, 6, 2, 4, null, 7], 28], false], [[[2, 1, 3], 4], true], [[[1], 2], false]],
    js: `
var findTarget = function(root, k) {
    const seen = new Set();
    const dfs = (n) => {
        if (!n) return false;
        if (seen.has(k - n.val)) return true;
        seen.add(n.val);
        return dfs(n.left) || dfs(n.right);
    };
    return dfs(root);
};`,
  },
  // ------------------------------------------------------------ traversal
  {
    t: "Binary Tree Inorder Traversal", d: "E", topic: "tree-traversal", sub: "Depth-first orders", pat: ["dfs"], tags: ["Tree", "Stack"], co: ["microsoft", "amazon", "adobe"],
    desc: "Given the `root` of a binary tree, return the inorder traversal of its nodes' values (left, node, right).",
    cons: ["The number of nodes is in the range [0, 100]"],
    hints: ["Recursion is trivial; try an explicit stack to mirror the call stack."],
    exp: "The iterative version pushes the whole left spine, pops a node to visit it, then continues with its right child.",
    steps: ["Push left spine.", "Pop, record value, move right."],
    tc: "O(n)", sc: "O(h)",
    fn: ["inorderTraversal", [["root", "TreeNode"]], "int[]"],
    tests: [[[[1, null, 2, 3]], [1, 3, 2]], [[[]], []], [[[1, 2, 3, 4, 5, null, 8, null, null, 6, 7, 9]], [4, 2, 6, 5, 7, 1, 3, 9, 8]]],
    js: `
var inorderTraversal = function(root) {
    const res = [], st = [];
    let cur = root;
    while (cur || st.length) {
        while (cur) { st.push(cur); cur = cur.left; }
        cur = st.pop();
        res.push(cur.val);
        cur = cur.right;
    }
    return res;
};`,
  },
  {
    t: "Binary Tree Preorder Traversal", d: "E", topic: "tree-traversal", sub: "Depth-first orders", pat: ["dfs"], tags: ["Tree", "Stack"], co: ["microsoft", "apple"],
    desc: "Given the `root` of a binary tree, return the preorder traversal of its nodes' values (node, left, right).",
    cons: ["The number of nodes is in the range [0, 100]"],
    hints: ["With a stack, push the right child before the left child."],
    exp: "Pop a node, record it, and push its right child then its left child so the left subtree is processed first.",
    steps: ["Stack = [root].", "Pop, record, push right, push left."],
    tc: "O(n)", sc: "O(h)",
    fn: ["preorderTraversal", [["root", "TreeNode"]], "int[]"],
    tests: [[[[1, null, 2, 3]], [1, 2, 3]], [[[]], []], [[[1, 2, 3, 4, 5, null, 8, null, null, 6, 7, 9]], [1, 2, 4, 5, 6, 7, 3, 8, 9]]],
    js: `
var preorderTraversal = function(root) {
    if (!root) return [];
    const res = [], st = [root];
    while (st.length) {
        const n = st.pop();
        res.push(n.val);
        if (n.right) st.push(n.right);
        if (n.left) st.push(n.left);
    }
    return res;
};`,
  },
  {
    t: "Binary Tree Postorder Traversal", d: "E", topic: "tree-traversal", sub: "Depth-first orders", pat: ["dfs"], tags: ["Tree", "Stack"], co: ["microsoft", "amazon"],
    desc: "Given the `root` of a binary tree, return the postorder traversal of its nodes' values (left, right, node).",
    cons: ["The number of nodes is in the range [0, 100]"],
    hints: ["Postorder is the reverse of a 'node, right, left' preorder."],
    exp: "Produce node-right-left order with a stack (push left before right) and reverse the result to obtain left-right-node.",
    steps: ["Modified preorder with left pushed first.", "Reverse the output."],
    tc: "O(n)", sc: "O(h)",
    fn: ["postorderTraversal", [["root", "TreeNode"]], "int[]"],
    tests: [[[[1, null, 2, 3]], [3, 2, 1]], [[[]], []], [[[1, 2, 3, 4, 5, null, 8, null, null, 6, 7, 9]], [4, 6, 7, 5, 2, 9, 8, 3, 1]]],
    js: `
var postorderTraversal = function(root) {
    if (!root) return [];
    const res = [], st = [root];
    while (st.length) {
        const n = st.pop();
        res.push(n.val);
        if (n.left) st.push(n.left);
        if (n.right) st.push(n.right);
    }
    return res.reverse();
};`,
  },
  {
    t: "Binary Tree Level Order Traversal", d: "M", topic: "tree-traversal", sub: "Breadth-first order", pat: ["bfs"], tags: ["Tree", "BFS"], co: ["amazon", "microsoft", "meta", "google", "apple", "adobe"],
    desc: "Given the `root` of a binary tree, return the level order traversal of its nodes' values (left to right, level by level).",
    cons: ["The number of nodes is in the range [0, 2000]"],
    hints: ["Process the queue one level at a time by noting its size before the level starts."],
    exp: "BFS with a queue naturally visits nodes level by level. Snapshot the queue length at the start of each level to know where it ends.",
    steps: ["queue = [root].", "For each level, pop size nodes, record values, enqueue children."],
    tc: "O(n)", sc: "O(w)",
    fn: ["levelOrder", [["root", "TreeNode"]], "int[][]"],
    tests: [[[[3, 9, 20, null, null, 15, 7]], [[3], [9, 20], [15, 7]]], [[[1]], [[1]]], [[[]], []]],
    js: `
var levelOrder = function(root) {
    if (!root) return [];
    const res = [];
    let q = [root];
    while (q.length) {
        res.push(q.map((n) => n.val));
        const next = [];
        for (const n of q) { if (n.left) next.push(n.left); if (n.right) next.push(n.right); }
        q = next;
    }
    return res;
};`,
    py: `
class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []
        res, q = [], deque([root])
        while q:
            level = []
            for _ in range(len(q)):
                n = q.popleft()
                level.append(n.val)
                if n.left: q.append(n.left)
                if n.right: q.append(n.right)
            res.append(level)
        return res`,
  },
  {
    t: "Binary Tree Zigzag Level Order Traversal", d: "M", topic: "tree-traversal", sub: "Breadth-first order", pat: ["bfs"], tags: ["Tree", "BFS"], co: ["amazon", "microsoft", "meta", "flipkart"],
    desc: "Given the `root` of a binary tree, return the zigzag level order traversal: left to right for the first level, right to left for the next, and so on.",
    cons: ["The number of nodes is in the range [0, 2000]"],
    hints: ["Do a normal level order traversal and reverse every other level."],
    exp: "Level order BFS gives each level left to right; reverse the odd-indexed levels to alternate the direction.",
    steps: ["BFS by levels.", "Reverse values of levels with odd index."],
    tc: "O(n)", sc: "O(w)",
    fn: ["zigzagLevelOrder", [["root", "TreeNode"]], "int[][]"],
    tests: [[[[3, 9, 20, null, null, 15, 7]], [[3], [20, 9], [15, 7]]], [[[1]], [[1]]], [[[]], []], [[[1, 2, 3, 4, null, null, 5]], [[1], [3, 2], [4, 5]]]],
    js: `
var zigzagLevelOrder = function(root) {
    if (!root) return [];
    const res = [];
    let q = [root];
    while (q.length) {
        const vals = q.map((n) => n.val);
        res.push(res.length % 2 ? vals.reverse() : vals);
        const next = [];
        for (const n of q) { if (n.left) next.push(n.left); if (n.right) next.push(n.right); }
        q = next;
    }
    return res;
};`,
  },
  {
    t: "Average of Levels in Binary Tree", d: "E", topic: "tree-traversal", sub: "Breadth-first order", pat: ["bfs"], tags: ["Tree", "BFS"], co: ["meta", "amazon"],
    desc: "Given the `root` of a binary tree, return the average value of the nodes on each level as an array.",
    cons: ["The number of nodes is in the range [1, 10^4]"],
    hints: ["Sum each BFS level and divide by its size."],
    exp: "Level order traversal gives the nodes of each level together; average them before moving on.",
    steps: ["BFS by level.", "Push sum / count for each level."],
    tc: "O(n)", sc: "O(w)",
    fn: ["averageOfLevels", [["root", "TreeNode"]], "double[]"],
    cmp: "float",
    tests: [[[[3, 9, 20, null, null, 15, 7]], [3.0, 14.5, 11.0]], [[[3, 9, 20, 15, 7]], [3.0, 14.5, 11.0]], [[[5]], [5.0]]],
    js: `
var averageOfLevels = function(root) {
    const res = [];
    let q = [root];
    while (q.length) {
        res.push(q.reduce((s, n) => s + n.val, 0) / q.length);
        const next = [];
        for (const n of q) { if (n.left) next.push(n.left); if (n.right) next.push(n.right); }
        q = next;
    }
    return res;
};`,
  },
  // ------------------------------------------------------------ heaps
  {
    t: "Kth Largest Element in an Array", d: "M", topic: "heaps", sub: "Size-k min-heap", pat: ["top-k"], tags: ["Heap", "Quickselect"], co: ["meta", "amazon", "microsoft", "google", "apple", "flipkart"],
    desc: "Given an integer array `nums` and an integer `k`, return the `k`-th largest element in the array (in sorted order, not the k-th distinct element).",
    cons: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    hints: ["Keep a min-heap of the k largest elements seen so far.", "Quickselect gives O(n) on average."],
    exp: "A min-heap capped at size k holds the k largest values; its root is the k-th largest. Each push/pop costs O(log k).",
    steps: ["Push each value into a min-heap.", "If size > k, pop the smallest.", "Return the heap root."],
    tc: "O(n log k)", sc: "O(k)",
    fn: ["findKthLargest", [["nums", "int[]"], ["k", "int"]], "int"],
    tests: [[[[3, 2, 1, 5, 6, 4], 2], 5], [[[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], 4], [[[1], 1], 1], [[[-1, -1], 2], -1]],
    js: `
${HEAP}
var findKthLargest = function(nums, k) {
    const h = new Heap((a, b) => a - b);
    for (const x of nums) { h.push(x); if (h.size() > k) h.pop(); }
    return h.peek();
};`,
    py: `
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        heap = []
        for x in nums:
            heapq.heappush(heap, x)
            if len(heap) > k:
                heapq.heappop(heap)
        return heap[0]`,
    alt: [{ name: "Quickselect", time: "O(n) average", space: "O(1)", note: "Partition around a random pivot and recurse into one side only." }],
  },
  {
    t: "Last Stone Weight", d: "E", topic: "heaps", sub: "Max-heap simulation", pat: ["top-k"], tags: ["Heap", "Simulation"], co: ["amazon", "google"],
    desc: "You have stones with positive weights. Each turn, smash the two heaviest stones x <= y: if equal both are destroyed, otherwise the remaining stone weighs y - x. Return the weight of the last stone, or 0 if none remain.",
    cons: ["1 <= stones.length <= 30", "1 <= stones[i] <= 1000"],
    hints: ["You need the two largest values repeatedly: a max-heap."],
    exp: "A max-heap gives the two heaviest stones in O(log n); push back the difference when it is non-zero.",
    steps: ["Heapify all stones as a max-heap.", "Pop two, push the difference if > 0.", "Return the last stone or 0."],
    tc: "O(n log n)", sc: "O(n)",
    fn: ["lastStoneWeight", [["stones", "int[]"]], "int"],
    tests: [[[[2, 7, 4, 1, 8, 1]], 1], [[[1]], 1], [[[2, 2]], 0], [[[10, 4, 2, 10]], 2]],
    js: `
${HEAP}
var lastStoneWeight = function(stones) {
    const h = new Heap((a, b) => b - a);
    stones.forEach((s) => h.push(s));
    while (h.size() > 1) { const y = h.pop(), x = h.pop(); if (y !== x) h.push(y - x); }
    return h.size() ? h.peek() : 0;
};`,
  },
  {
    t: "K Closest Points to Origin", d: "M", topic: "heaps", sub: "Size-k max-heap", pat: ["top-k"], tags: ["Heap", "Geometry"], co: ["meta", "amazon", "google", "microsoft"],
    desc: "Given an array of `points` on the X-Y plane and an integer `k`, return the `k` closest points to the origin (Euclidean distance). The answer may be returned in any order.",
    cons: ["1 <= k <= points.length <= 10^4"],
    hints: ["Compare squared distances to avoid square roots.", "A max-heap of size k keeps the k closest seen so far."],
    exp: "Keep a max-heap of size k keyed by squared distance; when it grows past k, drop the farthest point.",
    steps: ["Push [d², point].", "Pop when size > k.", "Return remaining points."],
    tc: "O(n log k)", sc: "O(k)",
    fn: ["kClosest", [["points", "int[][]"], ["k", "int"]], "int[][]"],
    cmp: "unordered",
    tests: [[[[[1, 3], [-2, 2]], 1], [[-2, 2]]], [[[[3, 3], [5, -1], [-2, 4]], 2], [[3, 3], [-2, 4]]], [[[[0, 1], [1, 0]], 2], [[0, 1], [1, 0]]]],
    js: `
${HEAP}
var kClosest = function(points, k) {
    const d = (p) => p[0] * p[0] + p[1] * p[1];
    const h = new Heap((a, b) => d(b) - d(a));
    for (const p of points) { h.push(p); if (h.size() > k) h.pop(); }
    return h.a;
};`,
  },
  {
    t: "Find Median from Data Stream", d: "H", topic: "heaps", sub: "Two heaps", pat: ["top-k"], tags: ["Heap", "Design"], co: ["google", "amazon", "microsoft", "meta", "apple"],
    desc: "Implement `MedianFinder` with `addNum(num)` to add an integer from a stream and `findMedian()` to return the median of all elements so far.",
    cons: ["-10^5 <= num <= 10^5", "findMedian is called only after at least one addNum", "At most 5 * 10^4 calls"],
    hints: ["Keep the lower half in a max-heap and the upper half in a min-heap.", "Rebalance so their sizes differ by at most one."],
    exp: "The max-heap holds the smaller half and the min-heap the larger half. Their tops are the middle elements, so the median is read in O(1) and each insertion costs O(log n).",
    steps: ["Push into low (max-heap), then move low's top to high.", "If high is larger, move its top back to low.", "Median = low top, or average of both tops."],
    tc: "O(log n) add, O(1) median", sc: "O(n)",
    cls: { className: "MedianFinder", ctor: [], methods: [{ name: "addNum", params: [["num", "int"]], returns: "void" }, { name: "findMedian", params: [], returns: "double" }] },
    cmp: "float",
    tests: [
      [[["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"], [[], [1], [2], [], [3], []]], [null, null, null, 1.5, null, 2.0]],
      [[["MedianFinder", "addNum", "findMedian", "addNum", "findMedian"], [[], [-1], [], [-2], []]], [null, null, -1.0, null, -1.5]],
    ],
    js: `
${HEAP}
class MedianFinder {
    constructor() { this.low = new Heap((a, b) => b - a); this.high = new Heap((a, b) => a - b); }
    addNum(num) {
        this.low.push(num);
        this.high.push(this.low.pop());
        if (this.high.size() > this.low.size()) this.low.push(this.high.pop());
    }
    findMedian() {
        return this.low.size() > this.high.size() ? this.low.peek() : (this.low.peek() + this.high.peek()) / 2;
    }
}`,
  },
  {
    t: "Task Scheduler", d: "M", topic: "heaps", sub: "Greedy scheduling", pat: ["greedy", "top-k"], tags: ["Heap", "Greedy", "Counting"], co: ["meta", "amazon", "microsoft", "google"],
    desc: "Given CPU `tasks` labelled A–Z and a cooldown `n`, identical tasks must be separated by at least `n` intervals. Each interval runs one task or idles. Return the minimum number of intervals needed.",
    cons: ["1 <= tasks.length <= 10^4", "0 <= n <= 100"],
    hints: ["The most frequent task dictates the frame: (maxCount - 1) * (n + 1) + tasksWithMaxCount."],
    exp: "Arrange the most frequent task first with gaps of n; other tasks fill the gaps. The answer is the larger of the frame size and the total number of tasks.",
    steps: ["Count frequencies; mx = max count; ties = number of tasks with count mx.", "Return max(tasks.length, (mx - 1) * (n + 1) + ties)."],
    tc: "O(n)", sc: "O(26)",
    fn: ["leastInterval", [["tasks", "char[]"], ["n", "int"]], "int"],
    tests: [[[["A", "A", "A", "B", "B", "B"], 2], 8], [[["A", "C", "A", "B", "D", "B"], 1], 6], [[["A", "A", "A", "B", "B", "B"], 3], 10], [[["A"], 5], 1]],
    js: `
var leastInterval = function(tasks, n) {
    const cnt = new Array(26).fill(0);
    for (const t of tasks) cnt[t.charCodeAt(0) - 65]++;
    const mx = Math.max(...cnt), ties = cnt.filter((c) => c === mx).length;
    return Math.max(tasks.length, (mx - 1) * (n + 1) + ties);
};`,
  },
  {
    t: "Merge k Sorted Lists", d: "H", topic: "heaps", sub: "K-way merge", pat: ["top-k"], tags: ["Heap", "Linked List", "Divide and Conquer"], co: ["amazon", "google", "meta", "microsoft", "apple", "flipkart"],
    desc: "You are given an array of `k` linked lists, each sorted in ascending order. Merge all of them into one sorted linked list and return it.",
    cons: ["0 <= k <= 10^4", "0 <= lists[i].length <= 500", "The total number of nodes is at most 10^4"],
    hints: ["Keep the current head of each list in a min-heap."],
    exp: "A min-heap holding one node per list always exposes the globally smallest remaining node. Pop it, append it, and push its successor.",
    steps: ["Push all non-null heads.", "Pop the smallest, append, push its next.", "Repeat until the heap is empty."],
    tc: "O(N log k)", sc: "O(k)",
    fn: ["mergeKLists", [["lists", "ListNode[]"]], "ListNode"],
    tests: [[[[[1, 4, 5], [1, 3, 4], [2, 6]]], [1, 1, 2, 3, 4, 4, 5, 6]], [[[]], []], [[[[]]], []], [[[[2], [1]]], [1, 2]]],
    js: `
${HEAP}
var mergeKLists = function(lists) {
    const h = new Heap((a, b) => a.val - b.val);
    for (const l of lists) if (l) h.push(l);
    const dummy = new ListNode(0);
    let tail = dummy;
    while (h.size()) {
        const n = h.pop();
        tail.next = n; tail = n;
        if (n.next) h.push(n.next);
    }
    return dummy.next;
};`,
  },
  // ------------------------------------------------------------ priority queue
  {
    t: "Top K Frequent Elements", d: "M", topic: "priority-queue", sub: "Frequency ranking", pat: ["top-k", "hash-map"], tags: ["Heap", "Hash Table", "Bucket Sort"], co: ["amazon", "meta", "google", "microsoft", "apple", "flipkart"],
    desc: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements in any order. The answer is guaranteed to be unique.",
    cons: ["1 <= nums.length <= 10^5", "k is in the range [1, number of unique elements]"],
    hints: ["Count frequencies first.", "Bucket sort by frequency gives O(n)."],
    exp: "Count each value, then place values into buckets indexed by frequency. Reading buckets from high to low yields the top k without a full sort.",
    steps: ["Count with a hash map.", "buckets[freq].push(value).", "Collect from the highest bucket until k values."],
    tc: "O(n)", sc: "O(n)",
    fn: ["topKFrequent", [["nums", "int[]"], ["k", "int"]], "int[]"],
    cmp: "unordered",
    tests: [[[[1, 1, 1, 2, 2, 3], 2], [1, 2]], [[[1], 1], [1]], [[[4, 4, 5, 5, 5, 6], 1], [5]], [[[3, 0, 1, 0], 1], [0]]],
    js: `
var topKFrequent = function(nums, k) {
    const cnt = new Map();
    for (const x of nums) cnt.set(x, (cnt.get(x) || 0) + 1);
    const buckets = Array.from({ length: nums.length + 1 }, () => []);
    for (const [v, c] of cnt) buckets[c].push(v);
    const res = [];
    for (let f = buckets.length - 1; f >= 0 && res.length < k; f--) res.push(...buckets[f]);
    return res.slice(0, k);
};`,
    py: `
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        return [v for v, _ in Counter(nums).most_common(k)]`,
  },
  {
    t: "Kth Largest Element in a Stream", d: "E", topic: "priority-queue", sub: "Streaming top-k", pat: ["top-k"], tags: ["Heap", "Design"], co: ["amazon", "meta"],
    desc: "Design `KthLargest(k, nums)` with a method `add(val)` that appends `val` to the stream and returns the `k`-th largest element so far.",
    cons: ["1 <= k <= 10^4", "At most 10^4 calls to add", "At least k elements exist when querying"],
    hints: ["A min-heap of size k keeps exactly the k largest values."],
    exp: "Maintain a min-heap of the k largest elements. After each insertion, trim it to size k and return its root.",
    steps: ["Constructor pushes all nums and trims to k.", "add pushes, trims, returns the root."],
    tc: "O(log k) per add", sc: "O(k)",
    cls: { className: "KthLargest", ctor: [["k", "int"], ["nums", "int[]"]], methods: [{ name: "add", params: [["val", "int"]], returns: "int" }] },
    tests: [
      [[["KthLargest", "add", "add", "add", "add", "add"], [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]], [null, 4, 5, 5, 8, 8]],
      [[["KthLargest", "add", "add"], [[1, []], [-3], [-2]]], [null, -3, -2]],
    ],
    js: `
${HEAP}
class KthLargest {
    constructor(k, nums) { this.k = k; this.h = new Heap((a, b) => a - b); nums.forEach((x) => this.add(x)); }
    add(val) {
        this.h.push(val);
        if (this.h.size() > this.k) this.h.pop();
        return this.h.peek();
    }
}`,
  },
  {
    t: "Meeting Rooms II", d: "M", topic: "priority-queue", sub: "Interval scheduling", pat: ["top-k", "merge-intervals"], tags: ["Heap", "Sorting", "Intervals"], co: ["google", "meta", "amazon", "microsoft", "atlassian"],
    desc: "Given an array of meeting time `intervals` `[start, end]`, return the minimum number of conference rooms required.",
    cons: ["1 <= intervals.length <= 10^4", "0 <= start < end <= 10^6"],
    hints: ["Sort by start time and keep a min-heap of end times for rooms in use."],
    exp: "Process meetings by start time. If the earliest-ending room is free by the time the meeting starts, reuse it; otherwise open a new room. The heap size is the answer.",
    steps: ["Sort by start.", "If heap top <= start, pop it.", "Push the meeting's end; track max size."],
    tc: "O(n log n)", sc: "O(n)",
    fn: ["minMeetingRooms", [["intervals", "int[][]"]], "int"],
    tests: [[[[[0, 30], [5, 10], [15, 20]]], 2], [[[[7, 10], [2, 4]]], 1], [[[[1, 5], [2, 6], [3, 7], [8, 9]]], 3], [[[[1, 5], [5, 10]]], 1]],
    js: `
${HEAP}
var minMeetingRooms = function(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const h = new Heap((a, b) => a - b);
    for (const [s, e] of intervals) {
        if (h.size() && h.peek() <= s) h.pop();
        h.push(e);
    }
    return h.size();
};`,
  },
  {
    t: "Furthest Building You Can Reach", d: "M", topic: "priority-queue", sub: "Greedy with heap", pat: ["top-k", "greedy"], tags: ["Heap", "Greedy"], co: ["google", "amazon"],
    desc: "You climb buildings `heights` left to right. Moving to a taller building needs either `diff` bricks or one ladder. Given `bricks` and `ladders`, return the furthest building index you can reach.",
    cons: ["1 <= heights.length <= 10^5", "0 <= bricks <= 10^9", "0 <= ladders <= heights.length"],
    hints: ["Use ladders on the largest climbs; keep the climbs covered by ladders in a min-heap."],
    exp: "Tentatively assign a ladder to every climb, tracking them in a min-heap. When you run out of ladders, convert the smallest ladder climb to bricks. Stop when bricks go negative.",
    steps: ["For each climb d > 0, push d.", "If heap size > ladders, bricks -= pop().", "If bricks < 0 return i."],
    tc: "O(n log L)", sc: "O(L)",
    fn: ["furthestBuilding", [["heights", "int[]"], ["bricks", "int"], ["ladders", "int"]], "int"],
    tests: [[[[4, 2, 7, 6, 9, 14, 12], 5, 1], 4], [[[4, 12, 2, 7, 3, 18, 20, 3, 19], 10, 2], 7], [[[14, 3, 19, 3], 17, 0], 3]],
    js: `
${HEAP}
var furthestBuilding = function(heights, bricks, ladders) {
    const h = new Heap((a, b) => a - b);
    for (let i = 0; i < heights.length - 1; i++) {
        const d = heights[i + 1] - heights[i];
        if (d <= 0) continue;
        h.push(d);
        if (h.size() > ladders) bricks -= h.pop();
        if (bricks < 0) return i;
    }
    return heights.length - 1;
};`,
  },
  {
    t: "Minimum Cost to Connect Sticks", d: "M", topic: "priority-queue", sub: "Huffman-style merging", pat: ["top-k", "greedy"], tags: ["Heap", "Greedy"], co: ["amazon"],
    desc: "You have sticks with positive integer lengths. Connecting two sticks of lengths x and y costs x + y and yields one stick. Return the minimum total cost to connect all sticks into one.",
    cons: ["1 <= sticks.length <= 10^4", "1 <= sticks[i] <= 10^4"],
    hints: ["Always merge the two shortest sticks."],
    exp: "Like building a Huffman tree, merging the two smallest sticks first minimises how often large lengths are re-added to the cost.",
    steps: ["Min-heap of sticks.", "Pop two, add their sum to cost, push the sum."],
    tc: "O(n log n)", sc: "O(n)",
    fn: ["connectSticks", [["sticks", "int[]"]], "int"],
    tests: [[[[2, 4, 3]], 14], [[[1, 8, 3, 5]], 30], [[[5]], 0]],
    js: `
${HEAP}
var connectSticks = function(sticks) {
    const h = new Heap((a, b) => a - b);
    sticks.forEach((s) => h.push(s));
    let cost = 0;
    while (h.size() > 1) { const s = h.pop() + h.pop(); cost += s; h.push(s); }
    return cost;
};`,
  },
  // ------------------------------------------------------------ tries
  {
    t: "Implement Trie (Prefix Tree)", d: "M", topic: "tries", sub: "Trie basics", pat: [], tags: ["Trie", "Design", "String"], co: ["google", "amazon", "microsoft", "meta", "apple"],
    desc: "Implement a trie with `insert(word)`, `search(word)` (is the exact word present) and `startsWith(prefix)` (does any word start with the prefix).",
    cons: ["1 <= word.length, prefix.length <= 2000", "Lowercase English letters", "At most 3 * 10^4 calls"],
    hints: ["Each node maps a character to a child and marks whether a word ends there."],
    exp: "Words share nodes for their common prefixes. Walking character by character from the root answers both exact and prefix queries in O(length).",
    steps: ["insert: create missing children, mark end.", "walk(s): follow children or return null.", "search checks the end mark; startsWith only needs a node."],
    tc: "O(L) per operation", sc: "O(total characters)",
    cls: {
      className: "Trie", ctor: [],
      methods: [
        { name: "insert", params: [["word", "string"]], returns: "void" },
        { name: "search", params: [["word", "string"]], returns: "bool" },
        { name: "startsWith", params: [["prefix", "string"]], returns: "bool" },
      ],
    },
    tests: [
      [[["Trie", "insert", "search", "search", "startsWith", "insert", "search"], [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]], [null, null, true, false, true, null, true]],
      [[["Trie", "insert", "startsWith", "search"], [[], ["dog"], ["do"], ["do"]]], [null, null, true, false]],
    ],
    js: `
class Trie {
    constructor() { this.root = {}; }
    insert(word) { let n = this.root; for (const c of word) n = n[c] || (n[c] = {}); n.end = true; }
    walk(s) { let n = this.root; for (const c of s) { n = n[c]; if (!n) return null; } return n; }
    search(word) { const n = this.walk(word); return !!(n && n.end); }
    startsWith(prefix) { return !!this.walk(prefix); }
}`,
  },
  {
    t: "Design Add and Search Words Data Structure", d: "M", topic: "tries", sub: "Wildcard search", pat: ["dfs", "backtracking"], tags: ["Trie", "Design", "DFS"], co: ["meta", "google", "amazon"],
    desc: "Design `WordDictionary` with `addWord(word)` and `search(word)`, where `search` may contain `.` matching any single letter.",
    cons: ["1 <= word.length <= 25", "Search words contain lowercase letters or '.'", "At most 2 dots per search"],
    hints: ["Store words in a trie.", "On '.', try every child recursively."],
    exp: "A trie handles exact characters directly. A wildcard branches into every child, so search becomes a DFS over the trie.",
    steps: ["addWord inserts into a trie.", "dfs(node, i): on '.', try all children; else follow the matching child.", "At the end, check the end flag."],
    tc: "O(L) add, O(26^d · L) search", sc: "O(total characters)",
    cls: {
      className: "WordDictionary", ctor: [],
      methods: [
        { name: "addWord", params: [["word", "string"]], returns: "void" },
        { name: "search", params: [["word", "string"]], returns: "bool" },
      ],
    },
    tests: [
      [[["WordDictionary", "addWord", "addWord", "addWord", "search", "search", "search", "search"], [[], ["bad"], ["dad"], ["mad"], ["pad"], ["bad"], [".ad"], ["b.."]]], [null, null, null, null, false, true, true, true]],
      [[["WordDictionary", "addWord", "search", "search"], [[], ["a"], ["."], ["a."]]], [null, null, true, false]],
    ],
    js: `
class WordDictionary {
    constructor() { this.root = {}; }
    addWord(word) { let n = this.root; for (const c of word) n = n[c] || (n[c] = {}); n.end = true; }
    search(word) {
        const dfs = (n, i) => {
            if (i === word.length) return !!n.end;
            const c = word[i];
            if (c === ".") return Object.keys(n).some((k) => k !== "end" && dfs(n[k], i + 1));
            return !!n[c] && dfs(n[c], i + 1);
        };
        return dfs(this.root, 0);
    }
}`,
  },
  {
    t: "Word Search II", d: "H", topic: "tries", sub: "Trie + grid DFS", pat: ["backtracking", "dfs"], tags: ["Trie", "Backtracking", "Matrix"], co: ["amazon", "google", "microsoft", "meta", "apple"],
    desc: "Given an `m x n` `board` of characters and a list of `words`, return all words that can be formed by sequentially adjacent (horizontal or vertical) cells, using each cell at most once per word. Return them in any order.",
    cons: ["1 <= m, n <= 12", "1 <= words.length <= 3 * 10^4", "Words are unique"],
    hints: ["Searching each word separately repeats work; put all words in a trie.", "Remove found words from the trie to prune."],
    exp: "Build a trie of all words, then DFS from every cell following trie edges. Reaching a node marked with a word records it; pruning finished branches keeps the search fast.",
    steps: ["Insert words into a trie storing the word at its end node.", "DFS each cell while the trie has the next character.", "Mark visited cells and restore after recursion."],
    tc: "O(m·n·4·3^(L-1))", sc: "O(total characters)",
    fn: ["findWords", [["board", "char[][]"], ["words", "string[]"]], "string[]"],
    cmp: "unordered",
    tests: [[[[["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]], ["oath", "pea", "eat", "rain"]], ["eat", "oath"]], [[[["a", "b"], ["c", "d"]], ["abcb"]], []], [[[["a", "b"], ["c", "d"]], ["ab", "cd", "ac", "bd", "ad"]], ["ab", "cd", "ac", "bd"]]],
    js: `
var findWords = function(board, words) {
    const root = {};
    for (const w of words) { let n = root; for (const c of w) n = n[c] || (n[c] = {}); n.word = w; }
    const m = board.length, n = board[0].length, res = [];
    const dfs = (i, j, node) => {
        const c = board[i][j], next = node[c];
        if (!next) return;
        if (next.word) { res.push(next.word); next.word = null; }
        board[i][j] = "#";
        for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const a = i + di, b = j + dj;
            if (a >= 0 && b >= 0 && a < m && b < n && board[a][b] !== "#") dfs(a, b, next);
        }
        board[i][j] = c;
    };
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) dfs(i, j, root);
    return res;
};`,
  },
  {
    t: "Longest Word in Dictionary", d: "M", topic: "tries", sub: "Prefix chains", pat: ["dfs"], tags: ["Trie", "Hash Table", "Sorting"], co: ["google", "microsoft"],
    desc: "Given an array of strings `words`, return the longest word that can be built one character at a time by other words in `words` (every prefix must be present). If there is a tie, return the lexicographically smallest one.",
    cons: ["1 <= words.length <= 1000", "1 <= words[i].length <= 30"],
    hints: ["Sort the words; a word is buildable if its prefix without the last letter is buildable."],
    exp: "Process words in sorted order so shorter prefixes come first. Keep a set of buildable words; a word joins the set if its one-shorter prefix is already there.",
    steps: ["Sort words.", "If w.length == 1 or set has w.slice(0, -1), add w and update best.", "Prefer longer, then lexicographically smaller."],
    tc: "O(n log n · L)", sc: "O(n · L)",
    fn: ["longestWord", [["words", "string[]"]], "string"],
    tests: [[[["w", "wo", "wor", "worl", "world"]], "world"], [[["a", "banana", "app", "appl", "ap", "apply", "apple"]], "apple"], [[["b", "c", "a"]], "a"]],
    js: `
var longestWord = function(words) {
    words.sort();
    const built = new Set();
    let best = "";
    for (const w of words) {
        if (w.length === 1 || built.has(w.slice(0, -1))) {
            built.add(w);
            if (w.length > best.length) best = w;
        }
    }
    return best;
};`,
  },
  {
    t: "Replace Words", d: "M", topic: "tries", sub: "Shortest prefix lookup", pat: [], tags: ["Trie", "String"], co: ["amazon", "microsoft"],
    desc: "Given a `dictionary` of roots and a `sentence`, replace every word in the sentence with the shortest root that is a prefix of it (if any). Return the resulting sentence.",
    cons: ["1 <= dictionary.length <= 1000", "1 <= sentence.length <= 10^6"],
    hints: ["Insert roots into a trie and stop at the first end marker while walking a word."],
    exp: "A trie of roots finds the shortest matching root by walking a word until the first node that ends a root.",
    steps: ["Build a trie of roots.", "For each word walk the trie; replace on the first end marker."],
    tc: "O(total characters)", sc: "O(dictionary characters)",
    fn: ["replaceWords", [["dictionary", "string[]"], ["sentence", "string"]], "string"],
    tests: [[[["cat", "bat", "rat"], "the cattle was rattled by the battery"], "the cat was rat by the bat"], [[["a", "b", "c"], "aadsfasf absbs bbab cadsfafs"], "a a b c"]],
    js: `
var replaceWords = function(dictionary, sentence) {
    const root = {};
    for (const w of dictionary) { let n = root; for (const c of w) n = n[c] || (n[c] = {}); n.end = true; }
    return sentence.split(" ").map((w) => {
        let n = root;
        for (let i = 0; i < w.length; i++) {
            n = n[w[i]];
            if (!n) break;
            if (n.end) return w.slice(0, i + 1);
        }
        return w;
    }).join(" ");
};`,
  },
  // ------------------------------------------------------------ segment tree
  {
    t: "Range Sum Query - Mutable", d: "M", topic: "segment-tree", sub: "Point update, range query", pat: [], tags: ["Segment Tree", "Fenwick Tree", "Design"], co: ["google", "amazon", "meta"],
    desc: "Given an integer array `nums`, support `update(index, val)` and `sumRange(left, right)` efficiently, interleaved in any order.",
    cons: ["1 <= nums.length <= 3 * 10^4", "At most 3 * 10^4 calls"],
    hints: ["Prefix sums make updates O(n). A segment tree makes both operations O(log n)."],
    exp: "An iterative segment tree stores leaves at positions n..2n-1 and each internal node holds the sum of its children. Updates walk up one path; queries combine O(log n) nodes.",
    steps: ["Build tree[n + i] = nums[i]; tree[i] = tree[2i] + tree[2i + 1].", "update: set the leaf and recompute ancestors.", "query: move l and r inward collecting partial sums."],
    tc: "O(log n) per operation", sc: "O(n)",
    cls: {
      className: "NumArray", ctor: [["nums", "int[]"]],
      methods: [
        { name: "update", params: [["index", "int"], ["val", "int"]], returns: "void" },
        { name: "sumRange", params: [["left", "int"], ["right", "int"]], returns: "int" },
      ],
    },
    tests: [
      [[["NumArray", "sumRange", "update", "sumRange"], [[[1, 3, 5]], [0, 2], [1, 2], [0, 2]]], [null, 9, null, 8]],
      [[["NumArray", "update", "sumRange", "sumRange"], [[[7, 2, 7, 2, 0]], [4, 6], [0, 4], [3, 4]]], [null, null, 24, 8]],
    ],
    js: `
class NumArray {
    constructor(nums) {
        this.n = nums.length;
        this.t = new Array(2 * this.n).fill(0);
        for (let i = 0; i < this.n; i++) this.t[this.n + i] = nums[i];
        for (let i = this.n - 1; i > 0; i--) this.t[i] = this.t[2 * i] + this.t[2 * i + 1];
    }
    update(index, val) {
        let i = index + this.n;
        this.t[i] = val;
        for (i >>= 1; i >= 1; i >>= 1) this.t[i] = this.t[2 * i] + this.t[2 * i + 1];
    }
    sumRange(left, right) {
        let l = left + this.n, r = right + this.n + 1, s = 0;
        while (l < r) {
            if (l & 1) s += this.t[l++];
            if (r & 1) s += this.t[--r];
            l >>= 1; r >>= 1;
        }
        return s;
    }
}`,
  },
  {
    t: "Range Minimum Queries", d: "M", topic: "segment-tree", sub: "Range minimum", pat: [], tags: ["Segment Tree", "Sparse Table"], co: ["google", "flipkart"],
    desc: "Given an array `nums` and a list of `queries` where each query is `[l, r]`, return an array with the minimum of `nums[l..r]` (inclusive) for each query.",
    cons: ["1 <= nums.length <= 10^5", "1 <= queries.length <= 10^5", "0 <= l <= r < nums.length"],
    hints: ["A segment tree answers each range-min in O(log n).", "A sparse table answers in O(1) after O(n log n) preprocessing for static arrays."],
    exp: "Build a segment tree where each node stores the minimum of its range, then answer each query by combining O(log n) node minima.",
    steps: ["Build min segment tree.", "For each [l, r] combine nodes bottom-up.", "Collect answers."],
    tc: "O((n + q) log n)", sc: "O(n)",
    fn: ["rangeMinQueries", [["nums", "int[]"], ["queries", "int[][]"]], "int[]"],
    tests: [[[[5, 2, 8, 1, 9, 3], [[0, 2], [1, 4], [4, 5], [3, 3]]], [2, 1, 3, 1]], [[[7], [[0, 0]]], [7]], [[[4, -1, 6, -3], [[0, 3], [0, 1], [2, 2]]], [-3, -1, 6]]],
    js: `
var rangeMinQueries = function(nums, queries) {
    const n = nums.length, t = new Array(2 * n).fill(Infinity);
    for (let i = 0; i < n; i++) t[n + i] = nums[i];
    for (let i = n - 1; i > 0; i--) t[i] = Math.min(t[2 * i], t[2 * i + 1]);
    return queries.map(([a, b]) => {
        let l = a + n, r = b + n + 1, m = Infinity;
        while (l < r) {
            if (l & 1) m = Math.min(m, t[l++]);
            if (r & 1) m = Math.min(m, t[--r]);
            l >>= 1; r >>= 1;
        }
        return m;
    });
};`,
  },
  {
    t: "My Calendar I", d: "M", topic: "segment-tree", sub: "Interval overlap queries", pat: ["merge-intervals"], tags: ["Segment Tree", "Ordered Set", "Design"], co: ["google", "amazon", "atlassian"],
    desc: "Implement `MyCalendar` with `book(start, end)`, which adds the half-open event `[start, end)` and returns `true` if it does not overlap any existing booking; otherwise it returns `false` and does not add it.",
    cons: ["0 <= start < end <= 10^9", "At most 1000 calls to book"],
    hints: ["Two half-open intervals overlap iff start1 < end2 and start2 < end1.", "A balanced BST or segment tree makes this O(log n)."],
    exp: "Check the new event against booked events using the overlap condition. For large call counts, an ordered structure finds neighbours in O(log n); here a sorted array with binary search works well.",
    steps: ["Binary search the insert position by start.", "Check the previous and next events for overlap.", "Insert when free."],
    tc: "O(n) per booking (O(log n) with a balanced tree)", sc: "O(n)",
    cls: { className: "MyCalendar", ctor: [], methods: [{ name: "book", params: [["start", "int"], ["end", "int"]], returns: "bool" }] },
    tests: [
      [[["MyCalendar", "book", "book", "book"], [[], [10, 20], [15, 25], [20, 30]]], [null, true, false, true]],
      [[["MyCalendar", "book", "book", "book", "book"], [[], [47, 50], [33, 41], [39, 45], [33, 42]]], [null, true, true, false, false]],
    ],
    js: `
class MyCalendar {
    constructor() { this.ev = []; }
    book(start, end) {
        let lo = 0, hi = this.ev.length;
        while (lo < hi) { const m = (lo + hi) >> 1; if (this.ev[m][0] < start) lo = m + 1; else hi = m; }
        if (lo > 0 && this.ev[lo - 1][1] > start) return false;
        if (lo < this.ev.length && this.ev[lo][0] < end) return false;
        this.ev.splice(lo, 0, [start, end]);
        return true;
    }
}`,
  },
  // ------------------------------------------------------------ fenwick tree
  {
    t: "Count of Smaller Numbers After Self", d: "H", topic: "fenwick-tree", sub: "Rank counting", pat: [], tags: ["Fenwick Tree", "Merge Sort", "Segment Tree"], co: ["google", "amazon", "microsoft", "apple"],
    desc: "Given an integer array `nums`, return an array `counts` where `counts[i]` is the number of smaller elements to the right of `nums[i]`.",
    cons: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    hints: ["Scan from the right and count how many already-seen values are smaller.", "A Fenwick tree over compressed values answers prefix counts in O(log n)."],
    exp: "Process elements right to left. A Fenwick tree indexed by value rank stores how many of each value have been seen; a prefix query below the current rank gives the count of smaller elements to its right.",
    steps: ["Compress values to ranks 1..m.", "From the right: counts[i] = query(rank - 1); update(rank, +1)."],
    tc: "O(n log n)", sc: "O(n)",
    fn: ["countSmaller", [["nums", "int[]"]], "int[]"],
    tests: [[[[5, 2, 6, 1]], [2, 1, 1, 0]], [[[-1]], [0]], [[[-1, -1]], [0, 0]], [[[3, 3, 1, 2, 5, 0]], [3, 3, 1, 1, 1, 0]]],
    js: `
var countSmaller = function(nums) {
    const sorted = [...new Set(nums)].sort((a, b) => a - b);
    const rank = new Map(sorted.map((v, i) => [v, i + 1]));
    const bit = new Array(sorted.length + 1).fill(0);
    const update = (i) => { for (; i < bit.length; i += i & -i) bit[i]++; };
    const query = (i) => { let s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; };
    const res = new Array(nums.length);
    for (let i = nums.length - 1; i >= 0; i--) {
        const r = rank.get(nums[i]);
        res[i] = query(r - 1);
        update(r);
    }
    return res;
};`,
  },
  {
    t: "Reverse Pairs", d: "H", topic: "fenwick-tree", sub: "Order statistics", pat: [], tags: ["Fenwick Tree", "Merge Sort", "Divide and Conquer"], co: ["google", "amazon", "flipkart"],
    desc: "Given an integer array `nums`, return the number of reverse pairs: pairs `(i, j)` with `i < j` and `nums[i] > 2 * nums[j]`.",
    cons: ["1 <= nums.length <= 5 * 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
    hints: ["Merge sort lets you count cross pairs between sorted halves with two pointers."],
    exp: "During merge sort, both halves are sorted. For each element of the left half, advance a pointer through the right half while left > 2 * right; the pointer position counts pairs. Then merge normally.",
    steps: ["Recursively sort halves and count inside them.", "Count cross pairs with a moving pointer.", "Merge."],
    tc: "O(n log n)", sc: "O(n)",
    fn: ["reversePairs", [["nums", "int[]"]], "int"],
    tests: [[[[1, 3, 2, 3, 1]], 2], [[[2, 4, 3, 5, 1]], 3], [[[5, 4, 3, 2, 1]], 4], [[[1]], 0]],
    js: `
var reversePairs = function(nums) {
    const sort = (a) => {
        if (a.length < 2) return [a, 0];
        const mid = a.length >> 1;
        const [L, c1] = sort(a.slice(0, mid)), [R, c2] = sort(a.slice(mid));
        let c = c1 + c2, j = 0;
        for (const x of L) { while (j < R.length && x > 2 * R[j]) j++; c += j; }
        const out = []; let p = 0, q = 0;
        while (p < L.length || q < R.length) out.push(q >= R.length || (p < L.length && L[p] <= R[q]) ? L[p++] : R[q++]);
        return [out, c];
    };
    return sort(nums)[1];
};`,
  },
  {
    t: "Count Inversions", d: "M", topic: "fenwick-tree", sub: "Inversion counting", pat: [], tags: ["Fenwick Tree", "Merge Sort"], co: ["amazon", "microsoft", "flipkart", "adobe"],
    desc: "Given an integer array `nums`, return the number of inversions: pairs `(i, j)` with `i < j` and `nums[i] > nums[j]`. This measures how far the array is from sorted.",
    cons: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    hints: ["For each element, count previous elements greater than it with a Fenwick tree over ranks."],
    exp: "Scan left to right. A Fenwick tree over value ranks holds counts of seen elements; the number of seen elements greater than the current one is seen - prefix(rank).",
    steps: ["Compress values.", "For each x: inv += seen - query(rank); update(rank)."],
    tc: "O(n log n)", sc: "O(n)",
    fn: ["countInversions", [["nums", "int[]"]], "long"],
    tests: [[[[2, 4, 1, 3, 5]], 3], [[[1, 2, 3]], 0], [[[5, 4, 3, 2, 1]], 10], [[[1, 1, 1]], 0]],
    js: `
var countInversions = function(nums) {
    const sorted = [...new Set(nums)].sort((a, b) => a - b);
    const rank = new Map(sorted.map((v, i) => [v, i + 1]));
    const bit = new Array(sorted.length + 1).fill(0);
    let inv = 0;
    nums.forEach((x, seen) => {
        let r = rank.get(x), s = 0;
        for (let i = r; i > 0; i -= i & -i) s += bit[i];
        inv += seen - s;
        for (let i = r; i < bit.length; i += i & -i) bit[i]++;
    });
    return inv;
};`,
  },
];
