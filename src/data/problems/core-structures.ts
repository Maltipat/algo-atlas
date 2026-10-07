import type { ProblemDef } from "./builder";

export const coreStructureProblems: ProblemDef[] = [
  // ------------------------------------------------------------ linked list
  {
    t: "Reverse Linked List", d: "E", topic: "linked-list", sub: "Pointer reversal", pat: [], tags: ["Linked List", "Recursion"], co: ["amazon", "microsoft", "apple", "google", "meta", "adobe"],
    desc: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
    cons: ["The number of nodes is in the range [0, 5000]", "-5000 <= Node.val <= 5000"],
    hints: ["Keep track of the previous node while walking forward.", "Save next before you overwrite the pointer."],
    exp: "Walk the list once, pointing each node's `next` back to the previous node. Three references are enough: prev, cur and the saved next.",
    steps: ["prev = null, cur = head.", "While cur: next = cur.next; cur.next = prev; prev = cur; cur = next.", "Return prev."],
    tc: "O(n)", sc: "O(1)",
    fn: ["reverseList", [["head", "ListNode"]], "ListNode"],
    tests: [[[[1, 2, 3, 4, 5]], [5, 4, 3, 2, 1]], [[[1, 2]], [2, 1]], [[[]], []], [[[7]], [7]]],
    js: `
var reverseList = function(head) {
    let prev = null, cur = head;
    while (cur) {
        const next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
};`,
    py: `
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev, cur = None, head
        while cur:
            cur.next, prev, cur = prev, cur, cur.next
        return prev`,
    alt: [{ name: "Recursive", time: "O(n)", space: "O(n)", note: "Reverse the rest, then hook head behind its old next node." }],
  },
  {
    t: "Merge Two Sorted Lists", d: "E", topic: "linked-list", sub: "Merging", pat: ["two-pointers"], tags: ["Linked List", "Recursion"], co: ["amazon", "microsoft", "apple", "google", "adobe", "flipkart"],
    desc: "You are given the heads of two sorted linked lists `list1` and `list2`. Merge them into one sorted list by splicing together their nodes and return the head of the merged list.",
    cons: ["The number of nodes in both lists is in the range [0, 50]", "Both lists are sorted in non-decreasing order"],
    hints: ["A dummy head node removes special cases for the first node."],
    exp: "Use a dummy node and a tail pointer. Repeatedly attach the smaller of the two current heads, then attach whatever remains.",
    steps: ["dummy = new node; tail = dummy.", "While both lists remain, attach the smaller head and advance.", "Attach the leftover list."],
    tc: "O(m + n)", sc: "O(1)",
    fn: ["mergeTwoLists", [["list1", "ListNode"], ["list2", "ListNode"]], "ListNode"],
    tests: [[[[1, 2, 4], [1, 3, 4]], [1, 1, 2, 3, 4, 4]], [[[], []], []], [[[], [0]], [0]], [[[5], [1, 2, 3]], [1, 2, 3, 5]]],
    js: `
var mergeTwoLists = function(list1, list2) {
    const dummy = new ListNode(0);
    let tail = dummy;
    while (list1 && list2) {
        if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; }
        else { tail.next = list2; list2 = list2.next; }
        tail = tail.next;
    }
    tail.next = list1 || list2;
    return dummy.next;
};`,
  },
  {
    t: "Linked List Cycle", d: "E", topic: "linked-list", sub: "Cycle detection", pat: ["fast-slow-pointers"], tags: ["Linked List", "Two Pointers"], co: ["amazon", "microsoft", "google", "apple", "adobe"],
    desc: "Given `head`, the head of a linked list, determine if the list has a cycle in it. A cycle exists if some node can be reached again by continuously following `next`. Return `true` if there is a cycle.",
    cons: ["The number of nodes is in the range [0, 10^4]", "pos is -1 or a valid index in the list"],
    hints: ["Two runners at different speeds must meet if the track is circular."],
    exp: "Floyd's tortoise and hare: move slow by one step and fast by two. If there is a cycle, fast eventually laps slow and they meet; otherwise fast reaches null.",
    steps: ["slow = fast = head.", "While fast and fast.next: advance slow by 1 and fast by 2.", "If they meet, return true. Return false when fast ends."],
    tc: "O(n)", sc: "O(1)",
    fn: ["hasCycle", [["head", "ListNode"]], "bool"],
    runnable: false,
    notes: ["pos = 1: the tail connects back to the node at index 1.", "pos = -1: no cycle."],
    tests: [[[[3, 2, 0, -4]], true], [[[1]], false]],
    js: `
var hasCycle = function(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }
    return false;
};`,
  },
  {
    t: "Remove Nth Node From End of List", d: "M", topic: "linked-list", sub: "Two-pointer gap", pat: ["two-pointers", "fast-slow-pointers"], tags: ["Linked List"], co: ["meta", "amazon", "microsoft", "google"],
    desc: "Given the `head` of a linked list, remove the `n`-th node from the end of the list and return its head.",
    cons: ["The number of nodes is sz, 1 <= sz <= 30", "1 <= n <= sz"],
    hints: ["Move one pointer n steps ahead, then move both until the lead reaches the end.", "A dummy node handles removing the head."],
    exp: "Keep a gap of n nodes between two pointers. When the leading pointer reaches the last node, the trailing pointer sits just before the node to delete.",
    steps: ["dummy.next = head; fast = slow = dummy.", "Advance fast n times.", "Advance both until fast.next is null.", "slow.next = slow.next.next."],
    tc: "O(n)", sc: "O(1)",
    fn: ["removeNthFromEnd", [["head", "ListNode"], ["n", "int"]], "ListNode"],
    tests: [[[[1, 2, 3, 4, 5], 2], [1, 2, 3, 5]], [[[1], 1], []], [[[1, 2], 1], [1]], [[[1, 2], 2], [2]]],
    js: `
var removeNthFromEnd = function(head, n) {
    const dummy = new ListNode(0, head);
    let fast = dummy, slow = dummy;
    for (let i = 0; i < n; i++) fast = fast.next;
    while (fast.next) { fast = fast.next; slow = slow.next; }
    slow.next = slow.next.next;
    return dummy.next;
};`,
  },
  {
    t: "Middle of the Linked List", d: "E", topic: "linked-list", sub: "Fast and slow pointers", pat: ["fast-slow-pointers"], tags: ["Linked List"], co: ["amazon", "adobe"],
    desc: "Given the `head` of a singly linked list, return the middle node. If there are two middle nodes, return the second one.",
    cons: ["The number of nodes is in the range [1, 100]"],
    hints: ["When the fast pointer has walked the whole list, the slow pointer is halfway."],
    exp: "Advance slow one step and fast two steps. When fast can no longer move, slow is the middle node.",
    steps: ["slow = fast = head.", "While fast and fast.next: slow = slow.next; fast = fast.next.next.", "Return slow."],
    tc: "O(n)", sc: "O(1)",
    fn: ["middleNode", [["head", "ListNode"]], "ListNode"],
    tests: [[[[1, 2, 3, 4, 5]], [3, 4, 5]], [[[1, 2, 3, 4, 5, 6]], [4, 5, 6]], [[[1]], [1]]],
    js: `
var middleNode = function(head) {
    let slow = head, fast = head;
    while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
    return slow;
};`,
  },
  {
    t: "Palindrome Linked List", d: "E", topic: "linked-list", sub: "Reverse half", pat: ["fast-slow-pointers"], tags: ["Linked List", "Two Pointers"], co: ["meta", "amazon", "microsoft"],
    desc: "Given the `head` of a singly linked list, return `true` if it is a palindrome.",
    cons: ["The number of nodes is in the range [1, 10^5]", "0 <= Node.val <= 9"],
    hints: ["Find the middle, reverse the second half, then compare both halves."],
    exp: "Locate the middle with fast and slow pointers, reverse the second half in place, and walk both halves together comparing values.",
    steps: ["Find the middle.", "Reverse from the middle.", "Compare node by node."],
    tc: "O(n)", sc: "O(1)",
    fn: ["isPalindrome", [["head", "ListNode"]], "bool"],
    tests: [[[[1, 2, 2, 1]], true], [[[1, 2]], false], [[[1]], true], [[[1, 2, 3, 2, 1]], true]],
    js: `
var isPalindrome = function(head) {
    let slow = head, fast = head;
    while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
    let prev = null;
    while (slow) { const n = slow.next; slow.next = prev; prev = slow; slow = n; }
    let a = head, b = prev;
    while (b) { if (a.val !== b.val) return false; a = a.next; b = b.next; }
    return true;
};`,
  },
  {
    t: "Add Two Numbers", d: "M", topic: "linked-list", sub: "Digit lists", pat: [], tags: ["Linked List", "Math"], co: ["amazon", "microsoft", "google", "meta", "apple", "adobe"],
    desc: "Two non-empty linked lists represent two non-negative integers with their digits stored in reverse order. Add the two numbers and return the sum as a linked list in the same format.",
    cons: ["The number of nodes in each list is in the range [1, 100]", "0 <= Node.val <= 9"],
    hints: ["Add digit by digit like on paper, carrying into the next node."],
    exp: "Walk both lists together summing digits plus carry. Each new node stores sum % 10, and the carry continues until both lists and the carry are exhausted.",
    steps: ["dummy, carry = 0.", "While l1 or l2 or carry: sum digits, append sum % 10, carry = floor(sum / 10)."],
    tc: "O(max(m, n))", sc: "O(max(m, n))",
    fn: ["addTwoNumbers", [["l1", "ListNode"], ["l2", "ListNode"]], "ListNode"],
    notes: ["342 + 465 = 807."],
    tests: [[[[2, 4, 3], [5, 6, 4]], [7, 0, 8]], [[[0], [0]], [0]], [[[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]], [8, 9, 9, 9, 0, 0, 0, 1]]],
    js: `
var addTwoNumbers = function(l1, l2) {
    const dummy = new ListNode(0);
    let tail = dummy, carry = 0;
    while (l1 || l2 || carry) {
        const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
        carry = Math.floor(sum / 10);
        tail.next = new ListNode(sum % 10);
        tail = tail.next;
        l1 = l1 && l1.next;
        l2 = l2 && l2.next;
    }
    return dummy.next;
};`,
  },
  {
    t: "Reorder List", d: "M", topic: "linked-list", sub: "Split, reverse, weave", pat: ["fast-slow-pointers"], tags: ["Linked List"], co: ["meta", "amazon", "microsoft"],
    desc: "Given the head of a list L0 → L1 → … → Ln, reorder it in place to L0 → Ln → L1 → Ln-1 → L2 → … without changing node values.",
    cons: ["The number of nodes is in the range [1, 5 * 10^4]"],
    hints: ["Split at the middle, reverse the second half, then interleave."],
    exp: "Combine three building blocks: find the middle, reverse the second half, and weave the two halves together one node at a time.",
    steps: ["Find the middle and cut the list.", "Reverse the second half.", "Alternate nodes from both halves."],
    tc: "O(n)", sc: "O(1)",
    fn: ["reorderList", [["head", "ListNode"]], "void"],
    tests: [[[[1, 2, 3, 4]], [1, 4, 2, 3]], [[[1, 2, 3, 4, 5]], [1, 5, 2, 4, 3]], [[[1]], [1]]],
    js: `
var reorderList = function(head) {
    let slow = head, fast = head;
    while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }
    let second = slow.next, prev = null;
    slow.next = null;
    while (second) { const n = second.next; second.next = prev; prev = second; second = n; }
    let first = head;
    second = prev;
    while (second) {
        const a = first.next, b = second.next;
        first.next = second;
        second.next = a;
        first = a;
        second = b;
    }
};`,
  },
  {
    t: "Reverse Nodes in k-Group", d: "H", topic: "linked-list", sub: "Group reversal", pat: [], tags: ["Linked List", "Recursion"], co: ["microsoft", "amazon", "google", "meta"],
    desc: "Given the `head` of a linked list, reverse the nodes of the list `k` at a time and return the modified list. Nodes left over at the end (fewer than `k`) stay in their original order.",
    cons: ["The number of nodes is n, 1 <= k <= n <= 5000"],
    hints: ["First check that k nodes remain before reversing.", "Keep a pointer to the node before each group so you can reconnect it."],
    exp: "Process the list group by group. For each complete group of k nodes, reverse it in place and stitch it between the previous group's tail and the next group's head.",
    steps: ["dummy before head; groupPrev = dummy.", "Find the k-th node; stop if missing.", "Reverse the group and reconnect; move groupPrev to the new tail."],
    tc: "O(n)", sc: "O(1)",
    fn: ["reverseKGroup", [["head", "ListNode"], ["k", "int"]], "ListNode"],
    tests: [[[[1, 2, 3, 4, 5], 2], [2, 1, 4, 3, 5]], [[[1, 2, 3, 4, 5], 3], [3, 2, 1, 4, 5]], [[[1, 2, 3, 4], 4], [4, 3, 2, 1]], [[[1], 1], [1]]],
    js: `
var reverseKGroup = function(head, k) {
    const dummy = new ListNode(0, head);
    let groupPrev = dummy;
    while (true) {
        let kth = groupPrev;
        for (let i = 0; i < k && kth; i++) kth = kth.next;
        if (!kth) break;
        const groupNext = kth.next;
        let prev = groupNext, cur = groupPrev.next;
        while (cur !== groupNext) { const n = cur.next; cur.next = prev; prev = cur; cur = n; }
        const tail = groupPrev.next;
        groupPrev.next = kth;
        groupPrev = tail;
    }
    return dummy.next;
};`,
  },
  {
    t: "Remove Duplicates from Sorted List", d: "E", topic: "linked-list", sub: "Traversal", pat: [], tags: ["Linked List"], co: ["adobe", "microsoft"],
    desc: "Given the `head` of a sorted linked list, delete all duplicates such that each element appears only once. Return the sorted list.",
    cons: ["The number of nodes is in the range [0, 300]", "The list is sorted in ascending order"],
    hints: ["Duplicates are adjacent in a sorted list."],
    exp: "Because equal values are adjacent, skip every next node whose value equals the current node's value.",
    steps: ["cur = head.", "While cur and cur.next: if equal, cur.next = cur.next.next; else cur = cur.next."],
    tc: "O(n)", sc: "O(1)",
    fn: ["deleteDuplicates", [["head", "ListNode"]], "ListNode"],
    tests: [[[[1, 1, 2]], [1, 2]], [[[1, 1, 2, 3, 3]], [1, 2, 3]], [[[]], []]],
    js: `
var deleteDuplicates = function(head) {
    let cur = head;
    while (cur && cur.next) {
        if (cur.val === cur.next.val) cur.next = cur.next.next;
        else cur = cur.next;
    }
    return head;
};`,
  },
  {
    t: "Odd Even Linked List", d: "M", topic: "linked-list", sub: "Relinking", pat: [], tags: ["Linked List"], co: ["microsoft", "amazon"],
    desc: "Given the `head` of a singly linked list, group all nodes at odd positions together followed by the nodes at even positions, and return the reordered list. Relative order inside each group stays the same.",
    cons: ["The number of nodes is in the range [0, 10^4]"],
    hints: ["Build two chains as you walk: odd and even. Attach even after odd at the end."],
    exp: "Maintain the tail of the odd chain and the tail of the even chain, alternately relinking nodes, then connect the odd tail to the even head.",
    steps: ["odd = head, even = head.next, evenHead = even.", "While even and even.next: relink odd and even forward.", "odd.next = evenHead."],
    tc: "O(n)", sc: "O(1)",
    fn: ["oddEvenList", [["head", "ListNode"]], "ListNode"],
    tests: [[[[1, 2, 3, 4, 5]], [1, 3, 5, 2, 4]], [[[2, 1, 3, 5, 6, 4, 7]], [2, 3, 6, 7, 1, 5, 4]], [[[]], []]],
    js: `
var oddEvenList = function(head) {
    if (!head) return head;
    let odd = head, even = head.next;
    const evenHead = even;
    while (even && even.next) {
        odd.next = even.next; odd = odd.next;
        even.next = odd.next; even = even.next;
    }
    odd.next = evenHead;
    return head;
};`,
  },
  {
    t: "Rotate List", d: "M", topic: "linked-list", sub: "Circular linking", pat: [], tags: ["Linked List"], co: ["microsoft", "adobe", "amazon"],
    desc: "Given the `head` of a linked list, rotate the list to the right by `k` places.",
    cons: ["The number of nodes is in the range [0, 500]", "0 <= k <= 2 * 10^9"],
    hints: ["Close the list into a ring, then break it at the right spot.", "Only k % length rotations matter."],
    exp: "Measure the length and connect the tail to the head. The new tail is length - k % length - 1 steps from the old head; break the ring after it.",
    steps: ["Compute length and tail.", "k %= length; if 0 return head.", "Walk to the new tail, set new head, break the link."],
    tc: "O(n)", sc: "O(1)",
    fn: ["rotateRight", [["head", "ListNode"], ["k", "int"]], "ListNode"],
    tests: [[[[1, 2, 3, 4, 5], 2], [4, 5, 1, 2, 3]], [[[0, 1, 2], 4], [2, 0, 1]], [[[], 3], []], [[[1, 2], 2000000000], [1, 2]]],
    js: `
var rotateRight = function(head, k) {
    if (!head || !head.next) return head;
    let len = 1, tail = head;
    while (tail.next) { tail = tail.next; len++; }
    k %= len;
    if (k === 0) return head;
    let newTail = head;
    for (let i = 0; i < len - k - 1; i++) newTail = newTail.next;
    const newHead = newTail.next;
    newTail.next = null;
    tail.next = head;
    return newHead;
};`,
  },
  // ------------------------------------------------------------ stack
  {
    t: "Valid Parentheses", d: "E", topic: "stack", sub: "Bracket matching", pat: [], tags: ["Stack", "String"], co: ["amazon", "google", "meta", "microsoft", "apple", "adobe", "flipkart", "atlassian"],
    desc: "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid: open brackets must be closed by the same type of bracket and in the correct order.",
    cons: ["1 <= s.length <= 10^4", "s consists of brackets only"],
    hints: ["The most recent unmatched opening bracket must be closed first.", "Last in, first out: use a stack."],
    exp: "Push opening brackets. For a closing bracket, the top of the stack must be its matching opener. The string is valid when every closer matched and the stack ends empty.",
    steps: ["Map each closer to its opener.", "Push openers; for closers pop and compare.", "Return stack is empty."],
    tc: "O(n)", sc: "O(n)",
    fn: ["isValid", [["s", "string"]], "bool"],
    tests: [[["()"], true], [["()[]{}"], true], [["(]"], false], [["([)]"], false], [["{[]}"], true], [["(("], false]],
    js: `
var isValid = function(s) {
    const pair = { ")": "(", "]": "[", "}": "{" };
    const stack = [];
    for (const c of s) {
        if (c in pair) { if (stack.pop() !== pair[c]) return false; }
        else stack.push(c);
    }
    return stack.length === 0;
};`,
    py: `
class Solution:
    def isValid(self, s: str) -> bool:
        pair = {")": "(", "]": "[", "}": "{"}
        stack = []
        for c in s:
            if c in pair:
                if not stack or stack.pop() != pair[c]:
                    return False
            else:
                stack.append(c)
        return not stack`,
  },
  {
    t: "Min Stack", d: "M", topic: "stack", sub: "Stack design", pat: [], tags: ["Stack", "Design"], co: ["amazon", "microsoft", "google", "meta", "adobe"],
    desc: "Design a stack that supports `push`, `pop`, `top`, and retrieving the minimum element in constant time via `getMin`. Each method must run in O(1).",
    cons: ["-2^31 <= val <= 2^31 - 1", "pop, top and getMin are always called on a non-empty stack", "At most 3 * 10^4 calls"],
    hints: ["Store, alongside each value, the minimum of the stack at the time it was pushed."],
    exp: "Every entry remembers the minimum of all entries beneath it and itself. The current minimum is then always stored in the top entry.",
    steps: ["push(val): push [val, min(val, currentMin)].", "pop: remove the top pair.", "top / getMin read the top pair."],
    tc: "O(1) per operation", sc: "O(n)",
    cls: {
      className: "MinStack", ctor: [],
      methods: [
        { name: "push", params: [["val", "int"]], returns: "void" },
        { name: "pop", params: [], returns: "void" },
        { name: "top", params: [], returns: "int" },
        { name: "getMin", params: [], returns: "int" },
      ],
    },
    tests: [
      [[["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"], [[], [-2], [0], [-3], [], [], [], []]], [null, null, null, null, -3, null, 0, -2]],
      [[["MinStack", "push", "push", "getMin", "push", "getMin", "pop", "getMin"], [[], [5], [3], [], [7], [], [], []]], [null, null, null, 3, null, 3, null, 3]],
      [[["MinStack", "push", "push", "pop", "getMin"], [[], [1], [1], [], []]], [null, null, null, null, 1]],
    ],
    js: `
class MinStack {
    constructor() { this.s = []; }
    push(val) {
        const m = this.s.length ? Math.min(val, this.s[this.s.length - 1][1]) : val;
        this.s.push([val, m]);
    }
    pop() { this.s.pop(); }
    top() { return this.s[this.s.length - 1][0]; }
    getMin() { return this.s[this.s.length - 1][1]; }
}`,
  },
  {
    t: "Daily Temperatures", d: "M", topic: "stack", sub: "Monotonic stack", pat: ["monotonic-stack"], tags: ["Stack", "Array"], co: ["amazon", "google", "meta", "microsoft"],
    desc: "Given an array of integers `temperatures`, return an array `answer` such that `answer[i]` is the number of days you have to wait after day `i` to get a warmer temperature. If there is no future warmer day, use 0.",
    cons: ["1 <= temperatures.length <= 10^5", "30 <= temperatures[i] <= 100"],
    hints: ["Keep a stack of days that have not yet found a warmer day.", "A new warmer day resolves every colder day on top of the stack."],
    exp: "Maintain a stack of indices with decreasing temperatures. When today's temperature beats the top, pop it and record the waiting time. Each index is pushed and popped at most once.",
    steps: ["stack = [], ans = zeros.", "For each i: while stack top is colder, pop j and set ans[j] = i - j.", "Push i."],
    tc: "O(n)", sc: "O(n)",
    fn: ["dailyTemperatures", [["temperatures", "int[]"]], "int[]"],
    tests: [[[[73, 74, 75, 71, 69, 72, 76, 73]], [1, 1, 4, 2, 1, 1, 0, 0]], [[[30, 40, 50, 60]], [1, 1, 1, 0]], [[[30, 60, 90]], [1, 1, 0]], [[[90, 80, 70]], [0, 0, 0]]],
    js: `
var dailyTemperatures = function(temperatures) {
    const ans = new Array(temperatures.length).fill(0), stack = [];
    for (let i = 0; i < temperatures.length; i++) {
        while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
            const j = stack.pop();
            ans[j] = i - j;
        }
        stack.push(i);
    }
    return ans;
};`,
    py: `
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        ans, stack = [0] * len(temperatures), []
        for i, t in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < t:
                j = stack.pop()
                ans[j] = i - j
            stack.append(i)
        return ans`,
  },
  {
    t: "Evaluate Reverse Polish Notation", d: "M", topic: "stack", sub: "Expression evaluation", pat: [], tags: ["Stack", "Math"], co: ["amazon", "google", "microsoft", "atlassian"],
    desc: "You are given an array of strings `tokens` that represents an arithmetic expression in Reverse Polish Notation. Evaluate the expression and return its value. Division truncates toward zero.",
    cons: ["1 <= tokens.length <= 10^4", "tokens[i] is an operator (+, -, *, /) or an integer"],
    hints: ["Operands wait on a stack until an operator arrives."],
    exp: "Push numbers. On an operator, pop the right operand then the left operand, apply the operator, and push the result.",
    steps: ["For each token: if operator, pop b then a, push a op b.", "Otherwise push the number.", "Return the single remaining value."],
    tc: "O(n)", sc: "O(n)",
    fn: ["evalRPN", [["tokens", "string[]"]], "int"],
    tests: [[[["2", "1", "+", "3", "*"]], 9], [[["4", "13", "5", "/", "+"]], 6], [[["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]], 22], [[["3", "-4", "/"]], 0]],
    js: `
var evalRPN = function(tokens) {
    const st = [];
    for (const t of tokens) {
        if (t === "+" || t === "-" || t === "*" || t === "/") {
            const b = st.pop(), a = st.pop();
            if (t === "+") st.push(a + b);
            else if (t === "-") st.push(a - b);
            else if (t === "*") st.push(a * b);
            else st.push(Math.trunc(a / b));
        } else st.push(Number(t));
    }
    return st[0] + 0;
};`,
  },
  {
    t: "Next Greater Element I", d: "E", topic: "stack", sub: "Monotonic stack", pat: ["monotonic-stack", "hash-map"], tags: ["Stack", "Hash Table"], co: ["amazon", "flipkart"],
    desc: "`nums1` is a subset of `nums2`. For each `x` in `nums1`, find the first element to the right of `x` in `nums2` that is greater than `x`, or -1 if none exists.",
    cons: ["1 <= nums1.length <= nums2.length <= 1000", "All values are unique"],
    hints: ["Precompute the next greater element for every value in nums2 with a monotonic stack."],
    exp: "Scan nums2 with a decreasing stack; when a larger value arrives it is the next greater element of everything it pops. Store results in a map and answer nums1 by lookup.",
    steps: ["For each v in nums2: while stack top < v, map[pop] = v; push v.", "Answer = nums1.map(x => map.get(x) ?? -1)."],
    tc: "O(m + n)", sc: "O(n)",
    fn: ["nextGreaterElement", [["nums1", "int[]"], ["nums2", "int[]"]], "int[]"],
    tests: [[[[4, 1, 2], [1, 3, 4, 2]], [-1, 3, -1]], [[[2, 4], [1, 2, 3, 4]], [3, -1]], [[[1], [1]], [-1]]],
    js: `
var nextGreaterElement = function(nums1, nums2) {
    const next = new Map(), st = [];
    for (const v of nums2) {
        while (st.length && st[st.length - 1] < v) next.set(st.pop(), v);
        st.push(v);
    }
    return nums1.map((x) => (next.has(x) ? next.get(x) : -1));
};`,
  },
  {
    t: "Largest Rectangle in Histogram", d: "H", topic: "stack", sub: "Monotonic stack", pat: ["monotonic-stack"], tags: ["Stack", "Array"], co: ["google", "amazon", "microsoft", "meta", "adobe"],
    desc: "Given an array of integers `heights` representing a histogram's bar heights where each bar has width 1, return the area of the largest rectangle in the histogram.",
    cons: ["1 <= heights.length <= 10^5", "0 <= heights[i] <= 10^4"],
    hints: ["For each bar, the widest rectangle of its height extends to the nearest shorter bar on each side.", "An increasing stack gives both boundaries when a bar is popped."],
    exp: "Keep a stack of indices with increasing heights. When a shorter bar arrives, pop taller bars: each popped bar's rectangle spans from the new stack top + 1 to the current index - 1.",
    steps: ["Append a sentinel height 0.", "For each i: while heights[top] > heights[i], pop and compute area with width i - newTop - 1.", "Push i."],
    tc: "O(n)", sc: "O(n)",
    fn: ["largestRectangleArea", [["heights", "int[]"]], "int"],
    tests: [[[[2, 1, 5, 6, 2, 3]], 10], [[[2, 4]], 4], [[[1, 1, 1, 1]], 4], [[[6, 2, 5, 4, 5, 1, 6]], 12]],
    js: `
var largestRectangleArea = function(heights) {
    const h = [...heights, 0], st = [];
    let best = 0;
    for (let i = 0; i < h.length; i++) {
        while (st.length && h[st[st.length - 1]] > h[i]) {
            const height = h[st.pop()];
            const left = st.length ? st[st.length - 1] : -1;
            best = Math.max(best, height * (i - left - 1));
        }
        st.push(i);
    }
    return best;
};`,
  },
  {
    t: "Decode String", d: "M", topic: "stack", sub: "Nested parsing", pat: [], tags: ["Stack", "String", "Recursion"], co: ["google", "amazon", "microsoft", "atlassian"],
    desc: "Given an encoded string where `k[encoded]` means `encoded` repeated exactly `k` times, return the decoded string. Encodings can be nested.",
    cons: ["1 <= s.length <= 30", "1 <= k <= 300", "The input is always valid"],
    hints: ["When you see '[', save the current string and count; when you see ']', repeat and restore."],
    exp: "Use a stack of (previous string, repeat count) frames. A closing bracket pops a frame and appends the repeated current string to the saved prefix.",
    steps: ["Build numbers digit by digit.", "On '[' push [cur, num] and reset.", "On ']' pop and set cur = prev + cur.repeat(k)."],
    tc: "O(output length)", sc: "O(output length)",
    fn: ["decodeString", [["s", "string"]], "string"],
    tests: [[["3[a]2[bc]"], "aaabcbc"], [["3[a2[c]]"], "accaccacc"], [["2[abc]3[cd]ef"], "abcabccdcdcdef"], [["10[a]"], "aaaaaaaaaa"]],
    js: `
var decodeString = function(s) {
    const st = [];
    let cur = "", num = 0;
    for (const c of s) {
        if (c >= "0" && c <= "9") num = num * 10 + Number(c);
        else if (c === "[") { st.push([cur, num]); cur = ""; num = 0; }
        else if (c === "]") { const [prev, k] = st.pop(); cur = prev + cur.repeat(k); }
        else cur += c;
    }
    return cur;
};`,
  },
  {
    t: "Asteroid Collision", d: "M", topic: "stack", sub: "Simulation with stack", pat: [], tags: ["Stack", "Simulation"], co: ["amazon", "google", "flipkart"],
    desc: "Asteroids move in a row: positive values move right, negative move left, and the absolute value is the size. When two collide, the smaller explodes; equal sizes both explode. Return the state after all collisions.",
    cons: ["2 <= asteroids.length <= 10^4", "asteroids[i] != 0"],
    hints: ["Only a right-moving asteroid followed by a left-moving one can collide."],
    exp: "Process asteroids left to right with a stack of survivors. A left-moving asteroid keeps destroying smaller right-moving ones on top of the stack until it is destroyed, ties, or the stack top is not right-moving.",
    steps: ["For each a: while a < 0 and top > 0, resolve the collision.", "Push a if it survives."],
    tc: "O(n)", sc: "O(n)",
    fn: ["asteroidCollision", [["asteroids", "int[]"]], "int[]"],
    tests: [[[[5, 10, -5]], [5, 10]], [[[8, -8]], []], [[[10, 2, -5]], [10]], [[[-2, -1, 1, 2]], [-2, -1, 1, 2]]],
    js: `
var asteroidCollision = function(asteroids) {
    const st = [];
    for (const a of asteroids) {
        let alive = true;
        while (alive && a < 0 && st.length && st[st.length - 1] > 0) {
            const top = st[st.length - 1];
            if (top < -a) st.pop();
            else { if (top === -a) st.pop(); alive = false; }
        }
        if (alive) st.push(a);
    }
    return st;
};`,
  },
  {
    t: "Simplify Path", d: "M", topic: "stack", sub: "Path parsing", pat: [], tags: ["Stack", "String"], co: ["meta", "microsoft", "atlassian"],
    desc: "Given an absolute Unix-style path, convert it to its simplified canonical path. `.` means the current directory, `..` moves up one level, and multiple slashes count as one.",
    cons: ["1 <= path.length <= 3000", "path is a valid absolute Unix path"],
    hints: ["Split on '/' and treat directories as a stack."],
    exp: "Split the path into parts. Skip empty parts and '.', pop on '..', and push any other name. Join the stack with '/' and prefix a slash.",
    steps: ["parts = path.split('/').", "Apply stack rules per part.", "Return '/' + stack.join('/')."],
    tc: "O(n)", sc: "O(n)",
    fn: ["simplifyPath", [["path", "string"]], "string"],
    tests: [[["/home/"], "/home"], [["/home//foo/"], "/home/foo"], [["/a/./b/../../c/"], "/c"], [["/../"], "/"], [["/.../a/../b/c/../d/./"], "/.../b/d"]],
    js: `
var simplifyPath = function(path) {
    const st = [];
    for (const p of path.split("/")) {
        if (p === "" || p === ".") continue;
        if (p === "..") st.pop();
        else st.push(p);
    }
    return "/" + st.join("/");
};`,
  },
  // ------------------------------------------------------------ queue
  {
    t: "Sliding Window Maximum", d: "H", topic: "queue", sub: "Monotonic deque", pat: ["sliding-window", "monotonic-stack"], tags: ["Queue", "Deque", "Sliding Window"], co: ["amazon", "google", "microsoft", "meta", "flipkart"],
    desc: "You are given an array `nums` and a window of size `k` moving from left to right one step at a time. Return the maximum of each window.",
    cons: ["1 <= nums.length <= 10^5", "1 <= k <= nums.length"],
    hints: ["A smaller element to the left of a larger one can never be a window maximum again.", "Keep a deque of indices with decreasing values."],
    exp: "Maintain a deque of indices whose values are decreasing. Drop indices that fall out of the window from the front and smaller values from the back; the front is always the current maximum.",
    steps: ["For each i: pop front if it is i - k.", "Pop back while nums[back] <= nums[i]; push i.", "Once i >= k - 1, record nums[front]."],
    tc: "O(n)", sc: "O(k)",
    fn: ["maxSlidingWindow", [["nums", "int[]"], ["k", "int"]], "int[]"],
    tests: [[[[1, 3, -1, -3, 5, 3, 6, 7], 3], [3, 3, 5, 5, 6, 7]], [[[1], 1], [1]], [[[9, 8, 7, 6], 2], [9, 8, 7]], [[[1, -1], 1], [1, -1]]],
    js: `
var maxSlidingWindow = function(nums, k) {
    const dq = [], res = [];
    let head = 0;
    for (let i = 0; i < nums.length; i++) {
        if (head < dq.length && dq[head] === i - k) head++;
        while (dq.length > head && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
        dq.push(i);
        if (i >= k - 1) res.push(nums[dq[head]]);
    }
    return res;
};`,
    py: `
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        dq, res = deque(), []
        for i, x in enumerate(nums):
            if dq and dq[0] == i - k:
                dq.popleft()
            while dq and nums[dq[-1]] <= x:
                dq.pop()
            dq.append(i)
            if i >= k - 1:
                res.append(nums[dq[0]])
        return res`,
  },
  {
    t: "Implement Queue using Stacks", d: "E", topic: "queue", sub: "Queue design", pat: [], tags: ["Queue", "Stack", "Design"], co: ["microsoft", "amazon", "apple"],
    desc: "Implement a first-in-first-out queue using only two stacks. Support `push`, `pop`, `peek` and `empty`.",
    cons: ["1 <= x <= 9", "At most 100 calls", "pop and peek are only called on a non-empty queue"],
    hints: ["Use one stack for incoming elements and one for outgoing elements.", "Only move elements when the outgoing stack is empty."],
    exp: "Pushes go to the input stack. When you need the front and the output stack is empty, pour the input stack into it, reversing the order. Each element moves at most once, so operations are amortised O(1).",
    steps: ["push → in.push(x).", "pop/peek → if out empty, move all from in to out; then use out's top.", "empty → both stacks empty."],
    tc: "Amortised O(1)", sc: "O(n)",
    cls: {
      className: "MyQueue", ctor: [],
      methods: [
        { name: "push", params: [["x", "int"]], returns: "void" },
        { name: "pop", params: [], returns: "int" },
        { name: "peek", params: [], returns: "int" },
        { name: "empty", params: [], returns: "bool" },
      ],
    },
    tests: [
      [[["MyQueue", "push", "push", "peek", "pop", "empty"], [[], [1], [2], [], [], []]], [null, null, null, 1, 1, false]],
      [[["MyQueue", "push", "pop", "empty"], [[], [5], [], []]], [null, null, 5, true]],
      [[["MyQueue", "push", "push", "push", "pop", "push", "pop", "pop", "peek"], [[], [1], [2], [3], [], [4], [], [], []]], [null, null, null, null, 1, null, 2, 3, 4]],
    ],
    js: `
class MyQueue {
    constructor() { this.in = []; this.out = []; }
    push(x) { this.in.push(x); }
    move() { if (!this.out.length) while (this.in.length) this.out.push(this.in.pop()); }
    pop() { this.move(); return this.out.pop(); }
    peek() { this.move(); return this.out[this.out.length - 1]; }
    empty() { return !this.in.length && !this.out.length; }
}`,
  },
  {
    t: "Number of Recent Calls", d: "E", topic: "queue", sub: "Queue as time window", pat: ["sliding-window"], tags: ["Queue", "Design"], co: ["google", "amazon"],
    desc: "Implement `RecentCounter`, which counts recent requests. `ping(t)` adds a request at time `t` (milliseconds, strictly increasing) and returns how many requests happened in the inclusive range `[t - 3000, t]`.",
    cons: ["1 <= t <= 10^9", "Each call uses a strictly larger t", "At most 10^4 calls"],
    hints: ["Old requests never become relevant again."],
    exp: "Keep timestamps in a queue. On each ping, append t and drop from the front everything older than t - 3000; the queue length is the answer.",
    steps: ["Push t.", "While front < t - 3000, dequeue.", "Return size."],
    tc: "Amortised O(1)", sc: "O(window)",
    cls: { className: "RecentCounter", ctor: [], methods: [{ name: "ping", params: [["t", "int"]], returns: "int" }] },
    tests: [
      [[["RecentCounter", "ping", "ping", "ping", "ping"], [[], [1], [100], [3001], [3002]]], [null, 1, 2, 3, 3]],
      [[["RecentCounter", "ping", "ping"], [[], [1], [5000]]], [null, 1, 1]],
    ],
    js: `
class RecentCounter {
    constructor() { this.q = []; this.head = 0; }
    ping(t) {
        this.q.push(t);
        while (this.q[this.head] < t - 3000) this.head++;
        return this.q.length - this.head;
    }
}`,
  },
  {
    t: "Design Circular Queue", d: "M", topic: "queue", sub: "Ring buffer", pat: [], tags: ["Queue", "Design", "Array"], co: ["microsoft", "amazon", "apple", "atlassian"],
    desc: "Design a circular queue of capacity `k` supporting `enQueue`, `deQueue`, `Front`, `Rear`, `isEmpty` and `isFull`. `Front`/`Rear` return -1 when empty; `enQueue`/`deQueue` return whether they succeeded.",
    cons: ["1 <= k <= 1000", "0 <= value <= 1000", "At most 3000 calls"],
    hints: ["Store a head index and a size; the tail index is (head + size - 1) % k."],
    exp: "Use a fixed array with a head pointer and element count. Wrapping indices with modulo reuses freed slots without shifting elements.",
    steps: ["enQueue writes at (head + size) % k.", "deQueue advances head.", "Rear reads (head + size - 1) % k."],
    tc: "O(1) per operation", sc: "O(k)",
    cls: {
      className: "MyCircularQueue", ctor: [["k", "int"]],
      methods: [
        { name: "enQueue", params: [["value", "int"]], returns: "bool" },
        { name: "deQueue", params: [], returns: "bool" },
        { name: "Front", params: [], returns: "int" },
        { name: "Rear", params: [], returns: "int" },
        { name: "isEmpty", params: [], returns: "bool" },
        { name: "isFull", params: [], returns: "bool" },
      ],
    },
    tests: [
      [[["MyCircularQueue", "enQueue", "enQueue", "enQueue", "enQueue", "Rear", "isFull", "deQueue", "enQueue", "Rear"], [[3], [1], [2], [3], [4], [], [], [], [4], []]], [null, true, true, true, false, 3, true, true, true, 4]],
      [[["MyCircularQueue", "Front", "isEmpty", "deQueue"], [[2], [], [], []]], [null, -1, true, false]],
    ],
    js: `
class MyCircularQueue {
    constructor(k) { this.a = new Array(k); this.k = k; this.head = 0; this.size = 0; }
    enQueue(v) { if (this.size === this.k) return false; this.a[(this.head + this.size) % this.k] = v; this.size++; return true; }
    deQueue() { if (!this.size) return false; this.head = (this.head + 1) % this.k; this.size--; return true; }
    Front() { return this.size ? this.a[this.head] : -1; }
    Rear() { return this.size ? this.a[(this.head + this.size - 1) % this.k] : -1; }
    isEmpty() { return this.size === 0; }
    isFull() { return this.size === this.k; }
}`,
  },
  {
    t: "Time Needed to Buy Tickets", d: "E", topic: "queue", sub: "Queue simulation", pat: [], tags: ["Queue", "Simulation"], co: ["amazon", "google"],
    desc: "People stand in a queue to buy tickets; person `i` wants `tickets[i]` tickets. Each second the front person buys one ticket and, if they need more, goes to the back. Return the time taken for the person at position `k` to finish.",
    cons: ["1 <= tickets.length <= 100", "1 <= tickets[i] <= 100", "0 <= k < tickets.length"],
    hints: ["People before k buy at most tickets[k] tickets; people after k buy at most tickets[k] - 1."],
    exp: "Instead of simulating, count contributions directly: anyone at or before k contributes min(t, tickets[k]), anyone after contributes min(t, tickets[k] - 1).",
    steps: ["For each i add min(tickets[i], i <= k ? tickets[k] : tickets[k] - 1)."],
    tc: "O(n)", sc: "O(1)",
    fn: ["timeRequiredToBuy", [["tickets", "int[]"], ["k", "int"]], "int"],
    tests: [[[[2, 3, 2], 2], 6], [[[5, 1, 1, 1], 0], 8], [[[1], 0], 1], [[[84, 49, 5, 24, 70, 77, 87, 8], 3], 154]],
    js: `
var timeRequiredToBuy = function(tickets, k) {
    let t = 0;
    for (let i = 0; i < tickets.length; i++) t += Math.min(tickets[i], i <= k ? tickets[k] : tickets[k] - 1);
    return t;
};`,
  },
  {
    t: "First Unique Character in a String", d: "E", topic: "queue", sub: "Frequency + order", pat: ["hash-map"], tags: ["Queue", "Hash Table", "String"], co: ["amazon", "microsoft", "google", "apple", "flipkart"],
    desc: "Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return -1.",
    cons: ["1 <= s.length <= 10^5", "s consists of only lowercase English letters"],
    hints: ["Count frequencies in one pass, then scan again in order."],
    exp: "A first pass counts each character. A second pass in original order returns the first index whose character count is 1.",
    steps: ["Count characters.", "Return the first index with count 1, else -1."],
    tc: "O(n)", sc: "O(1)",
    fn: ["firstUniqChar", [["s", "string"]], "int"],
    tests: [[["leetcode"], 0], [["loveleetcode"], 2], [["aabb"], -1], [["z"], 0]],
    js: `
var firstUniqChar = function(s) {
    const cnt = new Array(26).fill(0);
    for (const c of s) cnt[c.charCodeAt(0) - 97]++;
    for (let i = 0; i < s.length; i++) if (cnt[s.charCodeAt(i) - 97] === 1) return i;
    return -1;
};`,
  },
  // ------------------------------------------------------------ hashing
  {
    t: "Group Anagrams", d: "M", topic: "hashing", sub: "Canonical keys", pat: ["hash-map"], tags: ["Hash Table", "String", "Sorting"], co: ["amazon", "google", "meta", "microsoft", "apple", "adobe"],
    desc: "Given an array of strings `strs`, group the anagrams together. You can return the groups in any order.",
    cons: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "Lowercase English letters"],
    hints: ["Anagrams share the same sorted string or the same letter-count signature."],
    exp: "Map each word to a canonical key (its sorted letters or a 26-count signature) and collect words with equal keys in a hash map.",
    steps: ["For each word compute its key.", "Append the word to map[key].", "Return the map's values."],
    tc: "O(n · k log k)", sc: "O(n · k)",
    fn: ["groupAnagrams", [["strs", "string[]"]], "string[][]"],
    cmp: "unorderedNested",
    tests: [[[["eat", "tea", "tan", "ate", "nat", "bat"]], [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]], [[[""]], [[""]]], [[["a"]], [["a"]]], [[["abc", "bca", "xyz", "zyx", "q"]], [["abc", "bca"], ["xyz", "zyx"], ["q"]]]],
    js: `
var groupAnagrams = function(strs) {
    const groups = new Map();
    for (const s of strs) {
        const key = s.split("").sort().join("");
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(s);
    }
    return [...groups.values()];
};`,
    py: `
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = defaultdict(list)
        for s in strs:
            groups["".join(sorted(s))].append(s)
        return list(groups.values())`,
  },
  {
    t: "Longest Consecutive Sequence", d: "M", topic: "hashing", sub: "Set lookups", pat: ["hash-map"], tags: ["Hash Table", "Union Find"], co: ["google", "amazon", "meta", "microsoft", "flipkart"],
    desc: "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence. Your algorithm must run in O(n) time.",
    cons: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    hints: ["Only start counting from numbers that begin a sequence (x - 1 is not present)."],
    exp: "Put all numbers in a set. For each number that has no predecessor, walk forward x+1, x+2, ... while present. Each number is visited a constant number of times.",
    steps: ["set = new Set(nums).", "For each x without x - 1: count the run length.", "Track the maximum."],
    tc: "O(n)", sc: "O(n)",
    fn: ["longestConsecutive", [["nums", "int[]"]], "int"],
    tests: [[[[100, 4, 200, 1, 3, 2]], 4], [[[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], 9], [[[]], 0], [[[1, 0, 1, 2]], 3]],
    js: `
var longestConsecutive = function(nums) {
    const set = new Set(nums);
    let best = 0;
    for (const x of set) {
        if (set.has(x - 1)) continue;
        let len = 1;
        while (set.has(x + len)) len++;
        best = Math.max(best, len);
    }
    return best;
};`,
  },
  {
    t: "Isomorphic Strings", d: "E", topic: "hashing", sub: "Bijection maps", pat: ["hash-map"], tags: ["Hash Table", "String"], co: ["google", "amazon", "adobe"],
    desc: "Given two strings `s` and `t`, determine if they are isomorphic: characters in `s` can be replaced consistently to get `t`, and no two characters map to the same character.",
    cons: ["1 <= s.length <= 5 * 10^4", "t.length == s.length"],
    hints: ["You need the mapping to be consistent in both directions."],
    exp: "Maintain two maps, s→t and t→s. Any conflict in either direction means the strings are not isomorphic.",
    steps: ["For each index check or set both mappings.", "Return false on conflict."],
    tc: "O(n)", sc: "O(alphabet)",
    fn: ["isIsomorphic", [["s", "string"], ["t", "string"]], "bool"],
    tests: [[["egg", "add"], true], [["foo", "bar"], false], [["paper", "title"], true], [["badc", "baba"], false]],
    js: `
var isIsomorphic = function(s, t) {
    const a = new Map(), b = new Map();
    for (let i = 0; i < s.length; i++) {
        if ((a.has(s[i]) && a.get(s[i]) !== t[i]) || (b.has(t[i]) && b.get(t[i]) !== s[i])) return false;
        a.set(s[i], t[i]);
        b.set(t[i], s[i]);
    }
    return true;
};`,
  },
  {
    t: "Ransom Note", d: "E", topic: "hashing", sub: "Frequency counting", pat: ["hash-map"], tags: ["Hash Table", "String"], co: ["microsoft", "apple"],
    desc: "Given two strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be constructed using the letters from `magazine`, each letter used at most once.",
    cons: ["1 <= lengths <= 10^5", "Lowercase English letters"],
    hints: ["Count the magazine's letters and spend them while reading the note."],
    exp: "Count available letters in the magazine, then decrement for each letter in the note. A negative count means a letter is missing.",
    steps: ["Count magazine letters.", "Decrement for note letters; fail on negative."],
    tc: "O(m + n)", sc: "O(1)",
    fn: ["canConstruct", [["ransomNote", "string"], ["magazine", "string"]], "bool"],
    tests: [[["a", "b"], false], [["aa", "ab"], false], [["aa", "aab"], true], [["code", "decoder"], true]],
    js: `
var canConstruct = function(ransomNote, magazine) {
    const cnt = new Array(26).fill(0);
    for (const c of magazine) cnt[c.charCodeAt(0) - 97]++;
    for (const c of ransomNote) if (--cnt[c.charCodeAt(0) - 97] < 0) return false;
    return true;
};`,
  },
  {
    t: "Contains Duplicate II", d: "E", topic: "hashing", sub: "Index maps", pat: ["hash-map", "sliding-window"], tags: ["Hash Table", "Sliding Window"], co: ["amazon", "adobe"],
    desc: "Given an integer array `nums` and an integer `k`, return `true` if there are two distinct indices `i` and `j` with `nums[i] == nums[j]` and `abs(i - j) <= k`.",
    cons: ["1 <= nums.length <= 10^5", "0 <= k <= 10^5"],
    hints: ["Remember the last index at which each value appeared."],
    exp: "Store each value's most recent index. When a value reappears, check whether the distance to its last index is at most k.",
    steps: ["For each i: if last[nums[i]] exists and i - last <= k return true.", "Update last[nums[i]] = i."],
    tc: "O(n)", sc: "O(n)",
    fn: ["containsNearbyDuplicate", [["nums", "int[]"], ["k", "int"]], "bool"],
    tests: [[[[1, 2, 3, 1], 3], true], [[[1, 0, 1, 1], 1], true], [[[1, 2, 3, 1, 2, 3], 2], false]],
    js: `
var containsNearbyDuplicate = function(nums, k) {
    const last = new Map();
    for (let i = 0; i < nums.length; i++) {
        if (last.has(nums[i]) && i - last.get(nums[i]) <= k) return true;
        last.set(nums[i], i);
    }
    return false;
};`,
  },
  {
    t: "Happy Number", d: "E", topic: "hashing", sub: "Cycle detection with sets", pat: ["fast-slow-pointers", "hash-map"], tags: ["Hash Table", "Math"], co: ["google", "apple", "adobe"],
    desc: "A happy number is defined by repeatedly replacing the number with the sum of the squares of its digits. If the process reaches 1 the number is happy; if it loops forever without reaching 1 it is not. Return whether `n` is happy.",
    cons: ["1 <= n <= 2^31 - 1"],
    hints: ["The sequence either reaches 1 or enters a cycle.", "Detect the cycle with a set or with fast and slow pointers."],
    exp: "Treat the digit-square sum as a 'next' function. Floyd's cycle detection runs a slow and a fast sequence; if they meet at something other than 1, the number is not happy.",
    steps: ["next(x) = sum of squared digits.", "slow = n, fast = next(n); advance until fast == 1 or slow == fast."],
    tc: "O(log n)", sc: "O(1)",
    fn: ["isHappy", [["n", "int"]], "bool"],
    tests: [[[19], true], [[2], false], [[1], true], [[7], true], [[4], false]],
    js: `
var isHappy = function(n) {
    const next = (x) => { let s = 0; while (x > 0) { const d = x % 10; s += d * d; x = Math.floor(x / 10); } return s; };
    let slow = n, fast = next(n);
    while (fast !== 1 && slow !== fast) { slow = next(slow); fast = next(next(fast)); }
    return fast === 1;
};`,
  },
  {
    t: "Word Pattern", d: "E", topic: "hashing", sub: "Bijection maps", pat: ["hash-map"], tags: ["Hash Table", "String"], co: ["amazon", "atlassian"],
    desc: "Given a `pattern` and a string `s`, determine if `s` follows the same pattern: there is a bijection between letters in `pattern` and non-empty words in `s`.",
    cons: ["1 <= pattern.length <= 300", "s contains words separated by single spaces"],
    hints: ["Split s into words; the counts must match first.", "Check the mapping in both directions."],
    exp: "Like isomorphic strings, but between letters and words. Two maps catch both kinds of inconsistency.",
    steps: ["words = s.split(' '); lengths must match.", "Maintain letter→word and word→letter maps."],
    tc: "O(n)", sc: "O(n)",
    fn: ["wordPattern", [["pattern", "string"], ["s", "string"]], "bool"],
    tests: [[["abba", "dog cat cat dog"], true], [["abba", "dog cat cat fish"], false], [["aaaa", "dog cat cat dog"], false], [["abba", "dog dog dog dog"], false]],
    js: `
var wordPattern = function(pattern, s) {
    const words = s.split(" ");
    if (words.length !== pattern.length) return false;
    const a = new Map(), b = new Map();
    for (let i = 0; i < words.length; i++) {
        const p = pattern[i], w = words[i];
        if ((a.has(p) && a.get(p) !== w) || (b.has(w) && b.get(w) !== p)) return false;
        a.set(p, w);
        b.set(w, p);
    }
    return true;
};`,
  },
  {
    t: "Intersection of Two Arrays", d: "E", topic: "hashing", sub: "Set operations", pat: ["hash-map"], tags: ["Hash Table", "Array"], co: ["meta", "amazon"],
    desc: "Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must be unique, in any order.",
    cons: ["1 <= nums1.length, nums2.length <= 1000", "0 <= nums[i] <= 1000"],
    hints: ["Put one array into a set and filter the other."],
    exp: "A set from nums1 allows O(1) membership checks. Collect members of nums2 found in it into a result set to keep values unique.",
    steps: ["a = Set(nums1).", "Return unique values of nums2 present in a."],
    tc: "O(m + n)", sc: "O(m)",
    fn: ["intersection", [["nums1", "int[]"], ["nums2", "int[]"]], "int[]"],
    cmp: "unordered",
    tests: [[[[1, 2, 2, 1], [2, 2]], [2]], [[[4, 9, 5], [9, 4, 9, 8, 4]], [9, 4]], [[[1, 2], [3]], []]],
    js: `
var intersection = function(nums1, nums2) {
    const a = new Set(nums1);
    return [...new Set(nums2.filter((x) => a.has(x)))];
};`,
  },
];
