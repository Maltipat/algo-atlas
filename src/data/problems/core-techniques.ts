import type { ProblemDef } from "./builder";

export const coreTechniqueProblems: ProblemDef[] = [
  // ------------------------------------------------------------ two pointers
  {
    t: "3Sum", d: "M", topic: "two-pointers", sub: "Sort + two pointers", pat: ["two-pointers"], tags: ["Array", "Sorting"], co: ["amazon", "google", "meta", "microsoft", "apple", "adobe", "flipkart"],
    desc: "Given an integer array `nums`, return all unique triplets `[nums[i], nums[j], nums[k]]` with distinct indices such that their sum is 0. The order of triplets does not matter.",
    cons: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
    hints: ["Sort the array, fix one element, then solve Two Sum on the rest with two pointers.", "Skip equal neighbours to avoid duplicate triplets."],
    exp: "After sorting, fix nums[i] and search the suffix for pairs summing to -nums[i] with a left and right pointer. Skipping repeated values at every level keeps the triplets unique.",
    steps: ["Sort nums.", "For each i (skipping duplicates), set l = i + 1 and r = n - 1.", "Move pointers by comparing the sum with 0; record and skip duplicates on a match."],
    tc: "O(n²)", sc: "O(1) extra",
    fn: ["threeSum", [["nums", "int[]"]], "int[][]"],
    cmp: "unorderedNested",
    tests: [[[[-1, 0, 1, 2, -1, -4]], [[-1, -1, 2], [-1, 0, 1]]], [[[0, 1, 1]], []], [[[0, 0, 0]], [[0, 0, 0]]], [[[-2, 0, 1, 1, 2]], [[-2, 0, 2], [-2, 1, 1]]]],
    js: `
var threeSum = function(nums) {
    nums.sort((a, b) => a - b);
    const res = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let l = i + 1, r = nums.length - 1;
        while (l < r) {
            const s = nums[i] + nums[l] + nums[r];
            if (s < 0) l++;
            else if (s > 0) r--;
            else {
                res.push([nums[i], nums[l], nums[r]]);
                while (l < r && nums[l] === nums[l + 1]) l++;
                while (l < r && nums[r] === nums[r - 1]) r--;
                l++; r--;
            }
        }
    }
    return res;
};`,
    py: `
class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res = []
        for i in range(len(nums) - 2):
            if i and nums[i] == nums[i - 1]:
                continue
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s < 0: l += 1
                elif s > 0: r -= 1
                else:
                    res.append([nums[i], nums[l], nums[r]])
                    while l < r and nums[l] == nums[l + 1]: l += 1
                    while l < r and nums[r] == nums[r - 1]: r -= 1
                    l += 1; r -= 1
        return res`,
  },
  {
    t: "Container With Most Water", d: "M", topic: "two-pointers", sub: "Opposite-end pointers", pat: ["two-pointers", "greedy"], tags: ["Array"], co: ["amazon", "google", "meta", "microsoft", "adobe"],
    desc: "Given `n` vertical lines with heights `height[i]`, find two lines that together with the x-axis form a container holding the most water. Return the maximum amount of water.",
    cons: ["2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
    hints: ["Start with the widest container.", "Moving the taller line inward can never increase the area."],
    exp: "Begin with pointers at both ends. The area is limited by the shorter line, so the only move that might help is advancing the shorter side.",
    steps: ["l = 0, r = n - 1.", "area = min(h[l], h[r]) * (r - l); update best.", "Move the pointer at the shorter line."],
    tc: "O(n)", sc: "O(1)",
    fn: ["maxArea", [["height", "int[]"]], "int"],
    tests: [[[[1, 8, 6, 2, 5, 4, 8, 3, 7]], 49], [[[1, 1]], 1], [[[4, 3, 2, 1, 4]], 16], [[[1, 2, 1]], 2]],
    js: `
var maxArea = function(height) {
    let l = 0, r = height.length - 1, best = 0;
    while (l < r) {
        best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
        if (height[l] < height[r]) l++; else r--;
    }
    return best;
};`,
  },
  {
    t: "Trapping Rain Water", d: "H", topic: "two-pointers", sub: "Opposite-end pointers", pat: ["two-pointers", "monotonic-stack"], tags: ["Array", "Stack"], co: ["amazon", "google", "meta", "microsoft", "apple", "adobe", "flipkart"],
    desc: "Given `n` non-negative integers representing an elevation map where each bar has width 1, compute how much water it can trap after raining.",
    cons: ["1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
    hints: ["Water above a bar = min(max to its left, max to its right) - its height.", "Process from the side whose running maximum is smaller."],
    exp: "Keep running maxima from the left and right. Whichever side has the smaller maximum determines the water level at that pointer, so you can settle it and move inward.",
    steps: ["l, r at the ends; leftMax = rightMax = 0.", "If h[l] < h[r]: update leftMax, add leftMax - h[l], l++.", "Else do the mirror for r."],
    tc: "O(n)", sc: "O(1)",
    fn: ["trap", [["height", "int[]"]], "int"],
    tests: [[[[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], 6], [[[4, 2, 0, 3, 2, 5]], 9], [[[1]], 0], [[[5, 4, 1, 2]], 1]],
    js: `
var trap = function(height) {
    let l = 0, r = height.length - 1, lm = 0, rm = 0, water = 0;
    while (l < r) {
        if (height[l] < height[r]) { lm = Math.max(lm, height[l]); water += lm - height[l]; l++; }
        else { rm = Math.max(rm, height[r]); water += rm - height[r]; r--; }
    }
    return water;
};`,
    alt: [
      { name: "Prefix maxima arrays", time: "O(n)", space: "O(n)", note: "Precompute leftMax and rightMax arrays, then sum min(leftMax, rightMax) - height." },
      { name: "Monotonic stack", time: "O(n)", space: "O(n)", note: "Fill water layer by layer between a bar and the previous taller bar." },
    ],
  },
  {
    t: "Two Sum II - Input Array Is Sorted", d: "M", topic: "two-pointers", sub: "Opposite-end pointers", pat: ["two-pointers"], tags: ["Array"], co: ["amazon", "adobe", "apple"],
    desc: "Given a 1-indexed array `numbers` sorted in non-decreasing order, find two numbers that add up to `target`. Return their indices `[index1, index2]` (1-indexed, index1 < index2) using only constant extra space.",
    cons: ["2 <= numbers.length <= 3 * 10^4", "Exactly one solution exists"],
    hints: ["If the sum is too small, the left number must grow."],
    exp: "Sortedness lets two pointers replace the hash map: too small means move left forward, too large means move right back.",
    steps: ["l = 0, r = n - 1.", "Compare numbers[l] + numbers[r] with target and move one pointer.", "Return [l + 1, r + 1] on a match."],
    tc: "O(n)", sc: "O(1)",
    fn: ["twoSum", [["numbers", "int[]"], ["target", "int"]], "int[]"],
    tests: [[[[2, 7, 11, 15], 9], [1, 2]], [[[2, 3, 4], 6], [1, 3]], [[[-1, 0], -1], [1, 2]]],
    js: `
var twoSum = function(numbers, target) {
    let l = 0, r = numbers.length - 1;
    while (l < r) {
        const s = numbers[l] + numbers[r];
        if (s === target) return [l + 1, r + 1];
        if (s < target) l++; else r--;
    }
    return [];
};`,
  },
  {
    t: "Remove Duplicates from Sorted Array", d: "E", topic: "two-pointers", sub: "Read/write pointers", pat: ["two-pointers"], tags: ["Array"], co: ["microsoft", "google", "adobe", "flipkart"],
    desc: "Given a sorted integer array `nums`, remove the duplicates in place so that each unique element appears once, keeping the relative order. Return `k`, the number of unique elements (the first `k` slots hold them).",
    cons: ["1 <= nums.length <= 3 * 10^4", "nums is sorted in non-decreasing order"],
    hints: ["A write pointer marks where the next unique value goes."],
    exp: "Because the array is sorted, a value is new exactly when it differs from the last value written. Copy such values forward with a write pointer.",
    steps: ["k = 1.", "For i from 1: if nums[i] !== nums[k - 1], write nums[k++] = nums[i].", "Return k."],
    tc: "O(n)", sc: "O(1)",
    fn: ["removeDuplicates", [["nums", "int[]"]], "int"],
    tests: [[[[1, 1, 2]], 2], [[[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], 5], [[[1]], 1]],
    js: `
var removeDuplicates = function(nums) {
    let k = 1;
    for (let i = 1; i < nums.length; i++) if (nums[i] !== nums[k - 1]) nums[k++] = nums[i];
    return k;
};`,
  },
  {
    t: "Squares of a Sorted Array", d: "E", topic: "two-pointers", sub: "Merge from ends", pat: ["two-pointers"], tags: ["Array", "Sorting"], co: ["meta", "amazon", "google"],
    desc: "Given an integer array `nums` sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order, in O(n).",
    cons: ["1 <= nums.length <= 10^4", "nums is sorted"],
    hints: ["The largest square comes from one of the two ends."],
    exp: "Compare absolute values at both ends and place the larger square at the back of the output, moving that pointer inward.",
    steps: ["l = 0, r = n - 1, write from the end.", "Place the larger of l² and r²; move that pointer."],
    tc: "O(n)", sc: "O(n)",
    fn: ["sortedSquares", [["nums", "int[]"]], "int[]"],
    tests: [[[[-4, -1, 0, 3, 10]], [0, 1, 9, 16, 100]], [[[-7, -3, 2, 3, 11]], [4, 9, 9, 49, 121]], [[[-5, -3, -2]], [4, 9, 25]]],
    js: `
var sortedSquares = function(nums) {
    const n = nums.length, res = new Array(n);
    let l = 0, r = n - 1;
    for (let w = n - 1; w >= 0; w--) {
        if (Math.abs(nums[l]) > Math.abs(nums[r])) { res[w] = nums[l] * nums[l]; l++; }
        else { res[w] = nums[r] * nums[r]; r--; }
    }
    return res;
};`,
  },
  {
    t: "Is Subsequence", d: "E", topic: "two-pointers", sub: "Same-direction pointers", pat: ["two-pointers", "greedy"], tags: ["String"], co: ["google", "adobe"],
    desc: "Given two strings `s` and `t`, return `true` if `s` is a subsequence of `t` (it can be formed by deleting some characters of `t` without reordering).",
    cons: ["0 <= s.length <= 100", "0 <= t.length <= 10^4"],
    hints: ["Greedily match each character of s at its earliest position in t."],
    exp: "Walk through t with a pointer into s. Every time characters match, advance the s pointer. s is a subsequence if the pointer reaches its end.",
    steps: ["i = 0.", "For each c in t: if c === s[i], i++.", "Return i === s.length."],
    tc: "O(|t|)", sc: "O(1)",
    fn: ["isSubsequence", [["s", "string"], ["t", "string"]], "bool"],
    tests: [[["abc", "ahbgdc"], true], [["axc", "ahbgdc"], false], [["", "abc"], true], [["b", ""], false]],
    js: `
var isSubsequence = function(s, t) {
    let i = 0;
    for (const c of t) if (i < s.length && c === s[i]) i++;
    return i === s.length;
};`,
  },
  {
    t: "Merge Sorted Array", d: "E", topic: "two-pointers", sub: "Merge from the back", pat: ["two-pointers"], tags: ["Array", "Sorting"], co: ["meta", "microsoft", "amazon", "apple"],
    desc: "You are given two sorted arrays `nums1` (length `m + n`, the last `n` slots are 0) and `nums2` (length `n`). Merge `nums2` into `nums1` in place so the result is sorted.",
    cons: ["nums1.length == m + n", "0 <= m, n <= 200"],
    hints: ["Fill nums1 from the back so you never overwrite unread values."],
    exp: "Compare the largest unplaced elements of both arrays and write the larger one into the last free slot of nums1, moving backwards.",
    steps: ["i = m - 1, j = n - 1, w = m + n - 1.", "While j >= 0 place the larger of nums1[i] and nums2[j] at w."],
    tc: "O(m + n)", sc: "O(1)",
    fn: ["merge", [["nums1", "int[]"], ["m", "int"], ["nums2", "int[]"], ["n", "int"]], "void"],
    tests: [[[[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3], [1, 2, 2, 3, 5, 6]], [[[1], 1, [], 0], [1]], [[[0], 0, [1], 1], [1]], [[[4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3], [1, 2, 3, 4, 5, 6]]],
    js: `
var merge = function(nums1, m, nums2, n) {
    let i = m - 1, j = n - 1, w = m + n - 1;
    while (j >= 0) nums1[w--] = i >= 0 && nums1[i] > nums2[j] ? nums1[i--] : nums2[j--];
};`,
  },
  // ------------------------------------------------------------ sliding window
  {
    t: "Minimum Window Substring", d: "H", topic: "sliding-window", sub: "Variable window", pat: ["sliding-window", "hash-map"], tags: ["String", "Hash Table"], co: ["meta", "amazon", "google", "microsoft", "atlassian", "flipkart"],
    desc: "Given strings `s` and `t`, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. Return \"\" if there is no such window.",
    cons: ["1 <= s.length, t.length <= 10^5", "The answer is unique"],
    hints: ["Expand the right edge until the window covers t, then shrink the left edge as far as possible.", "Track how many characters still need to be covered."],
    exp: "Keep counts of what t needs and a counter of missing characters. Expand right to satisfy the requirement, then contract left while it stays satisfied, recording the smallest valid window.",
    steps: ["need[c] = counts from t; missing = |t|.", "Expand right: if need[c] > 0, missing--; need[c]--.", "While missing == 0: record window, then release s[left]."],
    tc: "O(|s| + |t|)", sc: "O(alphabet)",
    fn: ["minWindow", [["s", "string"], ["t", "string"]], "string"],
    tests: [[["ADOBECODEBANC", "ABC"], "BANC"], [["a", "a"], "a"], [["a", "aa"], ""], [["aaflslflsldkalskaaa", "aaa"], "aaa"]],
    js: `
var minWindow = function(s, t) {
    const need = new Map();
    for (const c of t) need.set(c, (need.get(c) || 0) + 1);
    let missing = t.length, left = 0, bestL = 0, bestLen = Infinity;
    for (let right = 0; right < s.length; right++) {
        const c = s[right];
        if ((need.get(c) || 0) > 0) missing--;
        need.set(c, (need.get(c) || 0) - 1);
        while (missing === 0) {
            if (right - left + 1 < bestLen) { bestLen = right - left + 1; bestL = left; }
            const d = s[left++];
            need.set(d, need.get(d) + 1);
            if (need.get(d) > 0) missing++;
        }
    }
    return bestLen === Infinity ? "" : s.substr(bestL, bestLen);
};`,
  },
  {
    t: "Longest Repeating Character Replacement", d: "M", topic: "sliding-window", sub: "Variable window", pat: ["sliding-window"], tags: ["String", "Hash Table"], co: ["google", "amazon", "meta"],
    desc: "Given a string `s` of uppercase letters and an integer `k`, you may change at most `k` characters. Return the length of the longest substring containing a single repeated letter after the changes.",
    cons: ["1 <= s.length <= 10^5", "0 <= k <= s.length"],
    hints: ["A window is valid if windowLength - countOfMostFrequentChar <= k."],
    exp: "Grow the window and track the highest single-letter count inside it. When the characters that would need replacing exceed k, slide the left edge forward.",
    steps: ["Expand right and update counts and maxCount.", "If (right - left + 1) - maxCount > k, shrink from the left by one.", "Track the largest window."],
    tc: "O(n)", sc: "O(26)",
    fn: ["characterReplacement", [["s", "string"], ["k", "int"]], "int"],
    tests: [[["ABAB", 2], 4], [["AABABBA", 1], 4], [["AAAA", 0], 4], [["ABCDE", 1], 2]],
    js: `
var characterReplacement = function(s, k) {
    const cnt = new Array(26).fill(0);
    let left = 0, maxCount = 0, best = 0;
    for (let right = 0; right < s.length; right++) {
        maxCount = Math.max(maxCount, ++cnt[s.charCodeAt(right) - 65]);
        if (right - left + 1 - maxCount > k) cnt[s.charCodeAt(left++) - 65]--;
        best = Math.max(best, right - left + 1);
    }
    return best;
};`,
  },
  {
    t: "Permutation in String", d: "M", topic: "sliding-window", sub: "Fixed window", pat: ["sliding-window", "hash-map"], tags: ["String", "Hash Table"], co: ["microsoft", "meta", "amazon"],
    desc: "Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1` as a substring.",
    cons: ["1 <= s1.length, s2.length <= 10^4", "Lowercase English letters"],
    hints: ["Any permutation of s1 has the same letter counts and the same length.", "Slide a window of length |s1| and compare counts."],
    exp: "Slide a fixed-size window over s2 while updating its letter counts incrementally. If the counts ever equal those of s1, a permutation exists.",
    steps: ["Count s1.", "Maintain counts for the current window of s2.", "Compare after each slide."],
    tc: "O(n · 26)", sc: "O(26)",
    fn: ["checkInclusion", [["s1", "string"], ["s2", "string"]], "bool"],
    tests: [[["ab", "eidbaooo"], true], [["ab", "eidboaoo"], false], [["adc", "dcda"], true], [["abc", "ab"], false]],
    js: `
var checkInclusion = function(s1, s2) {
    if (s1.length > s2.length) return false;
    const a = new Array(26).fill(0), b = new Array(26).fill(0);
    for (const c of s1) a[c.charCodeAt(0) - 97]++;
    for (let i = 0; i < s2.length; i++) {
        b[s2.charCodeAt(i) - 97]++;
        if (i >= s1.length) b[s2.charCodeAt(i - s1.length) - 97]--;
        if (a.every((v, j) => v === b[j])) return true;
    }
    return false;
};`,
  },
  {
    t: "Maximum Average Subarray I", d: "E", topic: "sliding-window", sub: "Fixed window", pat: ["sliding-window"], tags: ["Array"], co: ["google", "amazon"],
    desc: "Given an integer array `nums` and an integer `k`, find the contiguous subarray of length `k` with the maximum average and return that average.",
    cons: ["1 <= k <= n <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    hints: ["Update the window sum by adding the new element and removing the oldest one."],
    exp: "Compute the first window's sum, then slide: add the incoming element and subtract the outgoing one. The best sum divided by k is the answer.",
    steps: ["sum = first k elements.", "For i from k: sum += nums[i] - nums[i - k]; track max.", "Return max / k."],
    tc: "O(n)", sc: "O(1)",
    fn: ["findMaxAverage", [["nums", "int[]"], ["k", "int"]], "double"],
    cmp: "float",
    tests: [[[[1, 12, -5, -6, 50, 3], 4], 12.75], [[[5], 1], 5.0], [[[0, 4, 0, 3, 2], 1], 4.0], [[[-1, -2, -3], 2], -1.5]],
    js: `
var findMaxAverage = function(nums, k) {
    let sum = 0;
    for (let i = 0; i < k; i++) sum += nums[i];
    let best = sum;
    for (let i = k; i < nums.length; i++) { sum += nums[i] - nums[i - k]; best = Math.max(best, sum); }
    return best / k;
};`,
  },
  {
    t: "Minimum Size Subarray Sum", d: "M", topic: "sliding-window", sub: "Variable window", pat: ["sliding-window", "binary-search"], tags: ["Array", "Prefix Sum"], co: ["meta", "amazon", "google", "microsoft"],
    desc: "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a contiguous subarray whose sum is at least `target`, or 0 if none exists.",
    cons: ["1 <= target <= 10^9", "1 <= nums.length <= 10^5", "1 <= nums[i] <= 10^4"],
    hints: ["With positive numbers, shrinking a window always decreases its sum."],
    exp: "Expand the right edge adding to the sum. While the sum reaches the target, record the window length and shrink from the left.",
    steps: ["sum = 0, left = 0.", "Add nums[right]; while sum >= target, update best and subtract nums[left++]."],
    tc: "O(n)", sc: "O(1)",
    fn: ["minSubArrayLen", [["target", "int"], ["nums", "int[]"]], "int"],
    tests: [[[7, [2, 3, 1, 2, 4, 3]], 2], [[4, [1, 4, 4]], 1], [[11, [1, 1, 1, 1, 1, 1, 1, 1]], 0], [[15, [1, 2, 3, 4, 5]], 5]],
    js: `
var minSubArrayLen = function(target, nums) {
    let left = 0, sum = 0, best = Infinity;
    for (let right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) { best = Math.min(best, right - left + 1); sum -= nums[left++]; }
    }
    return best === Infinity ? 0 : best;
};`,
  },
  {
    t: "Max Consecutive Ones III", d: "M", topic: "sliding-window", sub: "Variable window", pat: ["sliding-window"], tags: ["Array"], co: ["meta", "google", "microsoft"],
    desc: "Given a binary array `nums` and an integer `k`, return the maximum number of consecutive 1s in the array if you can flip at most `k` 0s.",
    cons: ["1 <= nums.length <= 10^5", "0 <= k <= nums.length"],
    hints: ["Find the longest window containing at most k zeros."],
    exp: "Slide a window that may contain up to k zeros. When the zero count exceeds k, move the left edge until it drops back.",
    steps: ["Count zeros entering the window.", "Shrink while zeros > k.", "Track the largest window."],
    tc: "O(n)", sc: "O(1)",
    fn: ["longestOnes", [["nums", "int[]"], ["k", "int"]], "int"],
    tests: [[[[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2], 6], [[[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3], 10], [[[0, 0, 0], 0], 0]],
    js: `
var longestOnes = function(nums, k) {
    let left = 0, zeros = 0, best = 0;
    for (let right = 0; right < nums.length; right++) {
        if (nums[right] === 0) zeros++;
        while (zeros > k) if (nums[left++] === 0) zeros--;
        best = Math.max(best, right - left + 1);
    }
    return best;
};`,
  },
  {
    t: "Fruit Into Baskets", d: "M", topic: "sliding-window", sub: "At most K distinct", pat: ["sliding-window", "hash-map"], tags: ["Array", "Hash Table"], co: ["google", "amazon"],
    desc: "You walk along a row of fruit trees `fruits[i]` (fruit type) carrying two baskets, each holding one type. Starting from any tree, you pick one fruit per tree moving right and must stop when a third type appears. Return the maximum number of fruits you can pick.",
    cons: ["1 <= fruits.length <= 10^5", "0 <= fruits[i] < fruits.length"],
    hints: ["This is the longest subarray with at most 2 distinct values."],
    exp: "Keep counts of types inside the window. When a third type enters, shrink from the left until only two remain.",
    steps: ["Add fruits[right] to the count map.", "While map has > 2 types, remove fruits[left++].", "Track the best length."],
    tc: "O(n)", sc: "O(1)",
    fn: ["totalFruit", [["fruits", "int[]"]], "int"],
    tests: [[[[1, 2, 1]], 3], [[[0, 1, 2, 2]], 3], [[[1, 2, 3, 2, 2]], 4], [[[3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]], 5]],
    js: `
var totalFruit = function(fruits) {
    const cnt = new Map();
    let left = 0, best = 0;
    for (let right = 0; right < fruits.length; right++) {
        cnt.set(fruits[right], (cnt.get(fruits[right]) || 0) + 1);
        while (cnt.size > 2) {
            const f = fruits[left++];
            cnt.set(f, cnt.get(f) - 1);
            if (cnt.get(f) === 0) cnt.delete(f);
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
};`,
  },
  // ------------------------------------------------------------ prefix sum
  {
    t: "Range Sum Query - Immutable", d: "E", topic: "prefix-sum", sub: "1D prefix sums", pat: ["prefix-sum"], tags: ["Array", "Design"], co: ["meta", "amazon", "google"],
    desc: "Given an integer array `nums`, handle many queries of the form `sumRange(left, right)`: the sum of elements between indices `left` and `right` inclusive.",
    cons: ["1 <= nums.length <= 10^4", "At most 10^4 calls to sumRange"],
    hints: ["Precompute prefix[i] = sum of the first i elements."],
    exp: "With prefix sums, any range sum is prefix[right + 1] - prefix[left], so each query is O(1) after O(n) preprocessing.",
    steps: ["prefix[0] = 0; prefix[i + 1] = prefix[i] + nums[i].", "sumRange(l, r) = prefix[r + 1] - prefix[l]."],
    tc: "O(n) build, O(1) query", sc: "O(n)",
    cls: { className: "NumArray", ctor: [["nums", "int[]"]], methods: [{ name: "sumRange", params: [["left", "int"], ["right", "int"]], returns: "int" }] },
    tests: [
      [[["NumArray", "sumRange", "sumRange", "sumRange"], [[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]]], [null, 1, -1, -3]],
      [[["NumArray", "sumRange"], [[[5]], [0, 0]]], [null, 5]],
    ],
    js: `
class NumArray {
    constructor(nums) {
        this.p = [0];
        for (const x of nums) this.p.push(this.p[this.p.length - 1] + x);
    }
    sumRange(left, right) { return this.p[right + 1] - this.p[left]; }
}`,
  },
  {
    t: "Find Pivot Index", d: "E", topic: "prefix-sum", sub: "Left vs right sums", pat: ["prefix-sum"], tags: ["Array"], co: ["amazon", "adobe"],
    desc: "Given an array `nums`, return the leftmost pivot index: the index where the sum of all numbers strictly to its left equals the sum of all numbers strictly to its right. Return -1 if none exists.",
    cons: ["1 <= nums.length <= 10^4", "-1000 <= nums[i] <= 1000"],
    hints: ["right sum = total - left sum - nums[i]."],
    exp: "Compute the total once. While scanning, maintain the left sum; the right sum follows from the total, so each index is checked in O(1).",
    steps: ["total = sum(nums), left = 0.", "If left === total - left - nums[i], return i.", "left += nums[i]."],
    tc: "O(n)", sc: "O(1)",
    fn: ["pivotIndex", [["nums", "int[]"]], "int"],
    tests: [[[[1, 7, 3, 6, 5, 6]], 3], [[[1, 2, 3]], -1], [[[2, 1, -1]], 0], [[[0]], 0]],
    js: `
var pivotIndex = function(nums) {
    const total = nums.reduce((a, b) => a + b, 0);
    let left = 0;
    for (let i = 0; i < nums.length; i++) {
        if (left === total - left - nums[i]) return i;
        left += nums[i];
    }
    return -1;
};`,
  },
  {
    t: "Subarray Sum Equals K", d: "M", topic: "prefix-sum", sub: "Prefix sum + hash map", pat: ["prefix-sum", "hash-map"], tags: ["Array", "Hash Table"], co: ["meta", "google", "amazon", "microsoft", "atlassian"],
    desc: "Given an array of integers `nums` and an integer `k`, return the total number of contiguous subarrays whose sum equals `k`.",
    cons: ["1 <= nums.length <= 2 * 10^4", "-1000 <= nums[i] <= 1000", "-10^7 <= k <= 10^7"],
    hints: ["sum(i..j) = prefix[j] - prefix[i - 1].", "Count how many earlier prefixes equal currentPrefix - k."],
    exp: "Walk the array keeping a running prefix sum and a map from prefix value to how many times it has occurred. Each time, the number of earlier prefixes equal to prefix - k is the number of subarrays ending here with sum k.",
    steps: ["count = {0: 1}, prefix = 0.", "For x: prefix += x; ans += count[prefix - k]; count[prefix]++."],
    tc: "O(n)", sc: "O(n)",
    fn: ["subarraySum", [["nums", "int[]"], ["k", "int"]], "int"],
    tests: [[[[1, 1, 1], 2], 2], [[[1, 2, 3], 3], 2], [[[1, -1, 0], 0], 3], [[[3, 4, 7, 2, -3, 1, 4, 2], 7], 4]],
    js: `
var subarraySum = function(nums, k) {
    const count = new Map([[0, 1]]);
    let prefix = 0, ans = 0;
    for (const x of nums) {
        prefix += x;
        ans += count.get(prefix - k) || 0;
        count.set(prefix, (count.get(prefix) || 0) + 1);
    }
    return ans;
};`,
    py: `
class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        count = defaultdict(int, {0: 1})
        prefix = ans = 0
        for x in nums:
            prefix += x
            ans += count[prefix - k]
            count[prefix] += 1
        return ans`,
  },
  {
    t: "Contiguous Array", d: "M", topic: "prefix-sum", sub: "Balance trick", pat: ["prefix-sum", "hash-map"], tags: ["Array", "Hash Table"], co: ["meta", "amazon", "google"],
    desc: "Given a binary array `nums`, return the maximum length of a contiguous subarray with an equal number of 0s and 1s.",
    cons: ["1 <= nums.length <= 10^5", "nums[i] is 0 or 1"],
    hints: ["Treat 0 as -1. Equal counts means a subarray sum of 0.", "Store the first index where each prefix sum appears."],
    exp: "Map 0 to -1 so a balanced subarray sums to zero. Two equal prefix sums at indices i and j mean the subarray between them is balanced; keep the earliest index for each prefix to maximise length.",
    steps: ["first = {0: -1}, sum = 0.", "sum += nums[i] ? 1 : -1.", "If sum seen, best = max(best, i - first[sum]); else store i."],
    tc: "O(n)", sc: "O(n)",
    fn: ["findMaxLength", [["nums", "int[]"]], "int"],
    tests: [[[[0, 1]], 2], [[[0, 1, 0]], 2], [[[0, 1, 1, 1, 1, 1, 0, 0, 0]], 6], [[[1, 1, 1]], 0]],
    js: `
var findMaxLength = function(nums) {
    const first = new Map([[0, -1]]);
    let sum = 0, best = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i] ? 1 : -1;
        if (first.has(sum)) best = Math.max(best, i - first.get(sum));
        else first.set(sum, i);
    }
    return best;
};`,
  },
  {
    t: "Subarray Sums Divisible by K", d: "M", topic: "prefix-sum", sub: "Prefix sums modulo k", pat: ["prefix-sum", "hash-map"], tags: ["Array", "Hash Table"], co: ["meta", "amazon"],
    desc: "Given an integer array `nums` and an integer `k`, return the number of non-empty contiguous subarrays whose sum is divisible by `k`.",
    cons: ["1 <= nums.length <= 3 * 10^4", "2 <= k <= 10^4"],
    hints: ["Two prefix sums with the same remainder mod k bound a divisible subarray.", "Normalise negative remainders."],
    exp: "Count prefix-sum remainders. Each new prefix contributes as many subarrays as earlier prefixes with the same remainder.",
    steps: ["count[0] = 1.", "r = ((prefix % k) + k) % k; ans += count[r]; count[r]++."],
    tc: "O(n)", sc: "O(k)",
    fn: ["subarraysDivByK", [["nums", "int[]"], ["k", "int"]], "int"],
    tests: [[[[4, 5, 0, -2, -3, 1], 5], 7], [[[5], 9], 0], [[[-1, 2, 9], 2], 2]],
    js: `
var subarraysDivByK = function(nums, k) {
    const count = new Array(k).fill(0);
    count[0] = 1;
    let prefix = 0, ans = 0;
    for (const x of nums) {
        prefix += x;
        const r = ((prefix % k) + k) % k;
        ans += count[r];
        count[r]++;
    }
    return ans;
};`,
  },
  {
    t: "Range Sum Query 2D - Immutable", d: "M", topic: "prefix-sum", sub: "2D prefix sums", pat: ["prefix-sum"], tags: ["Matrix", "Design"], co: ["meta", "amazon", "google"],
    desc: "Given a 2D matrix, handle many queries `sumRegion(row1, col1, row2, col2)` returning the sum of the rectangle with those corners, each in O(1).",
    cons: ["1 <= m, n <= 200", "At most 10^4 queries"],
    hints: ["P[i][j] = sum of the rectangle from (0,0) to (i-1,j-1).", "Use inclusion–exclusion for queries."],
    exp: "Build a 2D prefix table with one extra row and column of zeros. A rectangle sum is P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1].",
    steps: ["P[i+1][j+1] = m[i][j] + P[i][j+1] + P[i+1][j] - P[i][j].", "Answer queries with inclusion–exclusion."],
    tc: "O(mn) build, O(1) query", sc: "O(mn)",
    cls: { className: "NumMatrix", ctor: [["matrix", "int[][]"]], methods: [{ name: "sumRegion", params: [["row1", "int"], ["col1", "int"], ["row2", "int"], ["col2", "int"]], returns: "int" }] },
    tests: [
      [[["NumMatrix", "sumRegion", "sumRegion", "sumRegion"], [[[[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]], [2, 1, 4, 3], [1, 1, 2, 2], [1, 2, 2, 4]]], [null, 8, 11, 12]],
      [[["NumMatrix", "sumRegion"], [[[[1, 2], [3, 4]]], [0, 0, 1, 1]]], [null, 10]],
    ],
    js: `
class NumMatrix {
    constructor(matrix) {
        const m = matrix.length, n = matrix[0].length;
        this.P = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
        for (let i = 0; i < m; i++)
            for (let j = 0; j < n; j++)
                this.P[i + 1][j + 1] = matrix[i][j] + this.P[i][j + 1] + this.P[i + 1][j] - this.P[i][j];
    }
    sumRegion(r1, c1, r2, c2) {
        const P = this.P;
        return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1];
    }
}`,
  },
  // ------------------------------------------------------------ sorting
  {
    t: "Sort an Array", d: "M", topic: "sorting", sub: "Merge sort", pat: [], tags: ["Sorting", "Divide and Conquer"], co: ["microsoft", "amazon", "apple", "adobe"],
    desc: "Given an array of integers `nums`, sort it in ascending order and return it without using built-in sort functions, in O(n log n) time.",
    cons: ["1 <= nums.length <= 5 * 10^4", "-5 * 10^4 <= nums[i] <= 5 * 10^4"],
    hints: ["Merge sort guarantees O(n log n) regardless of input.", "Quick sort needs a random pivot to avoid worst cases."],
    exp: "Merge sort splits the array in half, sorts each half recursively and merges the two sorted halves in linear time.",
    steps: ["Split at the middle.", "Recursively sort both halves.", "Merge with two pointers."],
    tc: "O(n log n)", sc: "O(n)",
    fn: ["sortArray", [["nums", "int[]"]], "int[]"],
    tests: [[[[5, 2, 3, 1]], [1, 2, 3, 5]], [[[5, 1, 1, 2, 0, 0]], [0, 0, 1, 1, 2, 5]], [[[1]], [1]], [[[-3, 10, -3, 0]], [-3, -3, 0, 10]]],
    js: `
var sortArray = function(nums) {
    if (nums.length <= 1) return nums;
    const mid = nums.length >> 1;
    const a = sortArray(nums.slice(0, mid)), b = sortArray(nums.slice(mid));
    const res = [];
    let i = 0, j = 0;
    while (i < a.length && j < b.length) res.push(a[i] <= b[j] ? a[i++] : b[j++]);
    while (i < a.length) res.push(a[i++]);
    while (j < b.length) res.push(b[j++]);
    return res;
};`,
    alt: [
      { name: "Randomised quick sort", time: "O(n log n) expected", space: "O(log n)", note: "In place, but worst case O(n²) without random pivots." },
      { name: "Counting sort", time: "O(n + range)", space: "O(range)", note: "Works here because values lie in a small fixed range." },
    ],
  },
  {
    t: "Largest Number", d: "M", topic: "sorting", sub: "Custom comparators", pat: ["greedy"], tags: ["Sorting", "String"], co: ["amazon", "microsoft", "google"],
    desc: "Given a list of non-negative integers `nums`, arrange them so they form the largest number and return it as a string.",
    cons: ["1 <= nums.length <= 100", "0 <= nums[i] <= 10^9"],
    hints: ["Order a before b if a + b > b + a as strings.", "Handle the all-zero case."],
    exp: "Sort with a comparator on concatenations: a should come first if ab is larger than ba. This order is transitive, so the sorted concatenation is optimal.",
    steps: ["Convert to strings.", "Sort by (b + a).localeCompare(a + b).", "Return '0' if the first is '0'."],
    tc: "O(n log n · k)", sc: "O(n)",
    fn: ["largestNumber", [["nums", "int[]"]], "string"],
    tests: [[[[10, 2]], "210"], [[[3, 30, 34, 5, 9]], "9534330"], [[[0, 0]], "0"], [[[1]], "1"]],
    js: `
var largestNumber = function(nums) {
    const s = nums.map(String).sort((a, b) => (b + a > a + b ? 1 : b + a < a + b ? -1 : 0));
    return s[0] === "0" ? "0" : s.join("");
};`,
  },
  {
    t: "Meeting Rooms", d: "E", topic: "sorting", sub: "Interval sorting", pat: ["merge-intervals"], tags: ["Sorting", "Intervals"], co: ["meta", "amazon", "google", "microsoft"],
    desc: "Given an array of meeting time intervals `[start, end]`, determine if a person could attend all meetings (no two meetings overlap).",
    cons: ["0 <= intervals.length <= 10^4", "0 <= start < end <= 10^6"],
    hints: ["After sorting by start, only adjacent meetings can overlap."],
    exp: "Sort meetings by start time and check that every meeting starts no earlier than the previous one ends.",
    steps: ["Sort by start.", "If intervals[i][0] < intervals[i-1][1] return false."],
    tc: "O(n log n)", sc: "O(1)",
    fn: ["canAttendMeetings", [["intervals", "int[][]"]], "bool"],
    tests: [[[[[0, 30], [5, 10], [15, 20]]], false], [[[[7, 10], [2, 4]]], true], [[[]], true], [[[[1, 5], [5, 8]]], true]],
    js: `
var canAttendMeetings = function(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < intervals.length; i++) if (intervals[i][0] < intervals[i - 1][1]) return false;
    return true;
};`,
  },
  {
    t: "Relative Sort Array", d: "E", topic: "sorting", sub: "Counting sort", pat: ["hash-map"], tags: ["Sorting", "Counting"], co: ["amazon", "google"],
    desc: "Given arrays `arr1` and `arr2` (distinct elements, all in `arr1`), sort `arr1` so that elements appear in the order given by `arr2`. Elements not in `arr2` go at the end in ascending order.",
    cons: ["1 <= arr1.length, arr2.length <= 1000", "0 <= arr1[i], arr2[i] <= 1000"],
    hints: ["Count occurrences, then emit in arr2's order, then the rest ascending."],
    exp: "A counting array over the small value range lets you emit values in the required order without a comparison sort.",
    steps: ["Count arr1 values.", "For each v in arr2 emit it count[v] times.", "Emit remaining values in ascending order."],
    tc: "O(n + range)", sc: "O(range)",
    fn: ["relativeSortArray", [["arr1", "int[]"], ["arr2", "int[]"]], "int[]"],
    tests: [[[[2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 19], [2, 1, 4, 3, 9, 6]], [2, 2, 2, 1, 4, 3, 3, 9, 6, 7, 19]], [[[28, 6, 22, 8, 44, 17], [22, 28, 8, 6]], [22, 28, 8, 6, 17, 44]]],
    js: `
var relativeSortArray = function(arr1, arr2) {
    const cnt = new Array(1001).fill(0), res = [];
    for (const x of arr1) cnt[x]++;
    for (const x of arr2) while (cnt[x]-- > 0) res.push(x);
    for (let v = 0; v <= 1000; v++) while (cnt[v]-- > 0) res.push(v);
    return res;
};`,
  },
  {
    t: "H-Index", d: "M", topic: "sorting", sub: "Sort then scan", pat: [], tags: ["Sorting", "Counting"], co: ["google", "meta", "amazon"],
    desc: "Given an array `citations` where `citations[i]` is the number of citations of a researcher's `i`-th paper, return their h-index: the maximum `h` such that at least `h` papers have at least `h` citations.",
    cons: ["1 <= n <= 5000", "0 <= citations[i] <= 1000"],
    hints: ["Sort in descending order and find the last position i where citations[i] >= i + 1."],
    exp: "Sorted descending, paper i (0-indexed) supports h = i + 1 if it has at least i + 1 citations. The answer is the largest such h.",
    steps: ["Sort descending.", "Count positions with citations[i] >= i + 1."],
    tc: "O(n log n)", sc: "O(1)",
    fn: ["hIndex", [["citations", "int[]"]], "int"],
    tests: [[[[3, 0, 6, 1, 5]], 3], [[[1, 3, 1]], 1], [[[0]], 0], [[[100]], 1]],
    js: `
var hIndex = function(citations) {
    citations.sort((a, b) => b - a);
    let h = 0;
    while (h < citations.length && citations[h] >= h + 1) h++;
    return h;
};`,
  },
  {
    t: "Minimum Absolute Difference", d: "E", topic: "sorting", sub: "Adjacent pairs after sorting", pat: [], tags: ["Sorting", "Array"], co: ["amazon", "microsoft"],
    desc: "Given an array of distinct integers `arr`, find all pairs with the minimum absolute difference of any two elements. Return the pairs in ascending order, each pair as `[a, b]` with `a < b`.",
    cons: ["2 <= arr.length <= 10^5", "All values are distinct"],
    hints: ["After sorting, the closest pairs are adjacent."],
    exp: "Sort, compute the minimum adjacent gap, then collect every adjacent pair with that gap.",
    steps: ["Sort ascending.", "Find the minimum adjacent difference.", "Collect matching adjacent pairs."],
    tc: "O(n log n)", sc: "O(1) extra",
    fn: ["minimumAbsDifference", [["arr", "int[]"]], "int[][]"],
    tests: [[[[4, 2, 1, 3]], [[1, 2], [2, 3], [3, 4]]], [[[1, 3, 6, 10, 15]], [[1, 3]]], [[[3, 8, -10, 23, 19, -4, -14, 27]], [[-14, -10], [19, 23], [23, 27]]]],
    js: `
var minimumAbsDifference = function(arr) {
    arr.sort((a, b) => a - b);
    let best = Infinity;
    for (let i = 1; i < arr.length; i++) best = Math.min(best, arr[i] - arr[i - 1]);
    const res = [];
    for (let i = 1; i < arr.length; i++) if (arr[i] - arr[i - 1] === best) res.push([arr[i - 1], arr[i]]);
    return res;
};`,
  },
  // ------------------------------------------------------------ binary search
  {
    t: "Binary Search", d: "E", topic: "binary-search", sub: "Classic binary search", pat: ["binary-search"], tags: ["Array", "Binary Search"], co: ["google", "microsoft", "apple", "adobe"],
    desc: "Given a sorted (ascending) array of integers `nums` and an integer `target`, return the index of `target` if it exists, otherwise -1. You must write an O(log n) algorithm.",
    cons: ["1 <= nums.length <= 10^4", "All values are unique", "nums is sorted ascending"],
    hints: ["Compare with the middle element and discard half the range each step.", "Use lo <= hi with mid = lo + (hi - lo) / 2."],
    exp: "Maintain the search range [lo, hi]. The middle element tells you which half could contain the target, so each step halves the range.",
    steps: ["lo = 0, hi = n - 1.", "mid = floor((lo + hi) / 2).", "Return mid on match; otherwise move lo or hi past mid."],
    tc: "O(log n)", sc: "O(1)",
    fn: ["search", [["nums", "int[]"], ["target", "int"]], "int"],
    tests: [[[[-1, 0, 3, 5, 9, 12], 9], 4], [[[-1, 0, 3, 5, 9, 12], 2], -1], [[[5], 5], 0], [[[1, 3], 3], 1]],
    js: `
var search = function(nums, target) {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        const mid = lo + ((hi - lo) >> 1);
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;
    }
    return -1;
};`,
    py: `
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target: return mid
            if nums[mid] < target: lo = mid + 1
            else: hi = mid - 1
        return -1`,
  },
  {
    t: "Search in Rotated Sorted Array", d: "M", topic: "binary-search", sub: "Rotated arrays", pat: ["binary-search"], tags: ["Array", "Binary Search"], co: ["google", "amazon", "meta", "microsoft", "apple", "adobe", "flipkart"],
    desc: "An ascending array of distinct integers was rotated at an unknown pivot. Given the rotated array `nums` and an integer `target`, return the index of `target` or -1, in O(log n).",
    cons: ["1 <= nums.length <= 5000", "All values are unique"],
    hints: ["At least one half around mid is always sorted.", "Check whether the target lies inside the sorted half."],
    exp: "At every step one side of mid is sorted. If the target falls within that sorted side's range, search there; otherwise search the other side.",
    steps: ["Compute mid.", "If nums[lo] <= nums[mid], the left half is sorted: test whether target is in [nums[lo], nums[mid]).", "Otherwise the right half is sorted: test (nums[mid], nums[hi]]."],
    tc: "O(log n)", sc: "O(1)",
    fn: ["search", [["nums", "int[]"], ["target", "int"]], "int"],
    tests: [[[[4, 5, 6, 7, 0, 1, 2], 0], 4], [[[4, 5, 6, 7, 0, 1, 2], 3], -1], [[[1], 0], -1], [[[3, 1], 1], 1], [[[5, 1, 3], 5], 0]],
    js: `
var search = function(nums, target) {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] === target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1; else lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;
        }
    }
    return -1;
};`,
  },
  {
    t: "Find Minimum in Rotated Sorted Array", d: "M", topic: "binary-search", sub: "Rotated arrays", pat: ["binary-search"], tags: ["Array", "Binary Search"], co: ["amazon", "microsoft", "meta", "google"],
    desc: "Given a rotated ascending array `nums` of unique elements, return the minimum element in O(log n).",
    cons: ["1 <= n <= 5000", "All values are unique"],
    hints: ["Compare nums[mid] with nums[hi] to know which side holds the rotation point."],
    exp: "If nums[mid] > nums[hi], the minimum lies right of mid; otherwise it is at mid or to its left. Shrink until lo == hi.",
    steps: ["lo = 0, hi = n - 1.", "While lo < hi: if nums[mid] > nums[hi] lo = mid + 1 else hi = mid.", "Return nums[lo]."],
    tc: "O(log n)", sc: "O(1)",
    fn: ["findMin", [["nums", "int[]"]], "int"],
    tests: [[[[3, 4, 5, 1, 2]], 1], [[[4, 5, 6, 7, 0, 1, 2]], 0], [[[11, 13, 15, 17]], 11], [[[2, 1]], 1]],
    js: `
var findMin = function(nums) {
    let lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] > nums[hi]) lo = mid + 1; else hi = mid;
    }
    return nums[lo];
};`,
  },
  {
    t: "Search Insert Position", d: "E", topic: "binary-search", sub: "Lower bound", pat: ["binary-search"], tags: ["Array", "Binary Search"], co: ["amazon", "google", "adobe"],
    desc: "Given a sorted array of distinct integers and a `target`, return the index if found; otherwise return the index where it would be inserted to keep the order.",
    cons: ["1 <= nums.length <= 10^4", "nums is sorted ascending with distinct values"],
    hints: ["You are looking for the first index with nums[i] >= target."],
    exp: "This is the lower-bound search: shrink [lo, hi) until lo is the first position whose value is at least the target.",
    steps: ["lo = 0, hi = n.", "If nums[mid] < target lo = mid + 1 else hi = mid.", "Return lo."],
    tc: "O(log n)", sc: "O(1)",
    fn: ["searchInsert", [["nums", "int[]"], ["target", "int"]], "int"],
    tests: [[[[1, 3, 5, 6], 5], 2], [[[1, 3, 5, 6], 2], 1], [[[1, 3, 5, 6], 7], 4], [[[1, 3, 5, 6], 0], 0]],
    js: `
var searchInsert = function(nums, target) {
    let lo = 0, hi = nums.length;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] < target) lo = mid + 1; else hi = mid;
    }
    return lo;
};`,
  },
  {
    t: "Find First and Last Position of Element in Sorted Array", d: "M", topic: "binary-search", sub: "Lower and upper bound", pat: ["binary-search"], tags: ["Array", "Binary Search"], co: ["meta", "amazon", "microsoft", "google", "flipkart"],
    desc: "Given an ascending array `nums` and a `target`, return the starting and ending positions of `target`, or `[-1, -1]` if it is absent. Run in O(log n).",
    cons: ["0 <= nums.length <= 10^5", "nums is sorted ascending"],
    hints: ["Run lower-bound for target and for target + 1."],
    exp: "The first position is lowerBound(target). The last position is lowerBound(target + 1) - 1. If the first position does not hold target, it is absent.",
    steps: ["lb(x) returns first index with nums[i] >= x.", "start = lb(target); if out of range or mismatch return [-1, -1].", "Return [start, lb(target + 1) - 1]."],
    tc: "O(log n)", sc: "O(1)",
    fn: ["searchRange", [["nums", "int[]"], ["target", "int"]], "int[]"],
    tests: [[[[5, 7, 7, 8, 8, 10], 8], [3, 4]], [[[5, 7, 7, 8, 8, 10], 6], [-1, -1]], [[[], 0], [-1, -1]], [[[2, 2], 2], [0, 1]]],
    js: `
var searchRange = function(nums, target) {
    const lb = (x) => { let lo = 0, hi = nums.length; while (lo < hi) { const m = (lo + hi) >> 1; if (nums[m] < x) lo = m + 1; else hi = m; } return lo; };
    const start = lb(target);
    if (start === nums.length || nums[start] !== target) return [-1, -1];
    return [start, lb(target + 1) - 1];
};`,
  },
  {
    t: "Koko Eating Bananas", d: "M", topic: "binary-search", sub: "Binary search on the answer", pat: ["binary-search"], tags: ["Binary Search"], co: ["google", "amazon", "meta", "flipkart"],
    desc: "Koko has `piles` of bananas and `h` hours. Each hour she eats up to `k` bananas from one pile (if the pile has fewer, she finishes it and waits). Return the minimum integer `k` that lets her finish all bananas within `h` hours.",
    cons: ["1 <= piles.length <= 10^4", "piles.length <= h <= 10^9", "1 <= piles[i] <= 10^9"],
    hints: ["If speed k works, every larger speed also works.", "Binary search k over [1, max(piles)]."],
    exp: "Feasibility is monotonic in k, so binary search the smallest speed for which the total hours sum(ceil(p / k)) is at most h.",
    steps: ["lo = 1, hi = max(piles).", "hours(mid) <= h → hi = mid, else lo = mid + 1.", "Return lo."],
    tc: "O(n log max)", sc: "O(1)",
    fn: ["minEatingSpeed", [["piles", "int[]"], ["h", "int"]], "int"],
    tests: [[[[3, 6, 7, 11], 8], 4], [[[30, 11, 23, 4, 20], 5], 30], [[[30, 11, 23, 4, 20], 6], 23], [[[1000000000], 2], 500000000]],
    js: `
var minEatingSpeed = function(piles, h) {
    let lo = 1, hi = Math.max(...piles);
    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        let hours = 0;
        for (const p of piles) hours += Math.ceil(p / mid);
        if (hours <= h) hi = mid; else lo = mid + 1;
    }
    return lo;
};`,
  },
  {
    t: "Search a 2D Matrix", d: "M", topic: "binary-search", sub: "Flattened search", pat: ["binary-search"], tags: ["Matrix", "Binary Search"], co: ["microsoft", "amazon", "adobe"],
    desc: "You are given an `m x n` matrix where each row is sorted and the first value of each row is greater than the last value of the previous row. Return `true` if `target` is in the matrix, in O(log(m·n)).",
    cons: ["1 <= m, n <= 100", "-10^4 <= matrix[i][j], target <= 10^4"],
    hints: ["Treat the matrix as one sorted array of length m·n.", "Index k maps to row k / n and column k % n."],
    exp: "Because the rows chain together in sorted order, binary search over virtual indices 0..m·n-1 and convert each index back to a cell.",
    steps: ["lo = 0, hi = m·n - 1.", "v = matrix[floor(mid / n)][mid % n].", "Standard binary search on v."],
    tc: "O(log(m·n))", sc: "O(1)",
    fn: ["searchMatrix", [["matrix", "int[][]"], ["target", "int"]], "bool"],
    tests: [[[[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], true], [[[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], false], [[[[1]], 1], true]],
    js: `
var searchMatrix = function(matrix, target) {
    const m = matrix.length, n = matrix[0].length;
    let lo = 0, hi = m * n - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1, v = matrix[Math.floor(mid / n)][mid % n];
        if (v === target) return true;
        if (v < target) lo = mid + 1; else hi = mid - 1;
    }
    return false;
};`,
  },
  {
    t: "Median of Two Sorted Arrays", d: "H", topic: "binary-search", sub: "Partition search", pat: ["binary-search"], tags: ["Array", "Binary Search", "Divide and Conquer"], co: ["google", "amazon", "microsoft", "apple", "meta", "adobe"],
    desc: "Given two sorted arrays `nums1` and `nums2` of sizes `m` and `n`, return the median of the two sorted arrays. The overall run time should be O(log(m + n)).",
    cons: ["0 <= m, n <= 1000", "1 <= m + n <= 2000"],
    hints: ["Binary search a cut in the smaller array; the cut in the other array is then fixed.", "A valid cut has every left value <= every right value."],
    exp: "Partition both arrays so the left parts together hold half the elements. Binary search the cut position in the shorter array until maxLeft1 <= minRight2 and maxLeft2 <= minRight1; the median comes from the boundary values.",
    steps: ["Ensure nums1 is shorter.", "Binary search i in [0, m]; j = half - i.", "Check boundary conditions and adjust; compute median from the four boundary values."],
    tc: "O(log min(m, n))", sc: "O(1)",
    fn: ["findMedianSortedArrays", [["nums1", "int[]"], ["nums2", "int[]"]], "double"],
    cmp: "float",
    tests: [[[[1, 3], [2]], 2.0], [[[1, 2], [3, 4]], 2.5], [[[], [1]], 1.0], [[[0, 0], [0, 0]], 0.0], [[[1, 2, 7, 9], [3, 4, 5, 6, 8]], 5.0]],
    js: `
var findMedianSortedArrays = function(nums1, nums2) {
    if (nums1.length > nums2.length) [nums1, nums2] = [nums2, nums1];
    const m = nums1.length, n = nums2.length, half = (m + n + 1) >> 1;
    let lo = 0, hi = m;
    while (lo <= hi) {
        const i = (lo + hi) >> 1, j = half - i;
        const l1 = i > 0 ? nums1[i - 1] : -Infinity, r1 = i < m ? nums1[i] : Infinity;
        const l2 = j > 0 ? nums2[j - 1] : -Infinity, r2 = j < n ? nums2[j] : Infinity;
        if (l1 <= r2 && l2 <= r1) {
            if ((m + n) % 2) return Math.max(l1, l2);
            return (Math.max(l1, l2) + Math.min(r1, r2)) / 2;
        }
        if (l1 > r2) hi = i - 1; else lo = i + 1;
    }
    return 0;
};`,
  },
  {
    t: "Find Peak Element", d: "M", topic: "binary-search", sub: "Binary search on slopes", pat: ["binary-search"], tags: ["Array", "Binary Search"], co: ["meta", "google", "microsoft", "amazon"],
    desc: "A peak element is strictly greater than its neighbours. Given `nums` where `nums[i] != nums[i + 1]` and imagining `nums[-1] = nums[n] = -∞`, return the index of a peak in O(log n). The tests here have exactly one peak.",
    cons: ["1 <= nums.length <= 1000", "nums[i] != nums[i + 1]"],
    hints: ["If nums[mid] < nums[mid + 1], a peak exists to the right."],
    exp: "Follow the upward slope: if the right neighbour of mid is larger, a peak must exist to the right; otherwise one exists at mid or to the left.",
    steps: ["lo = 0, hi = n - 1.", "If nums[mid] < nums[mid + 1] lo = mid + 1 else hi = mid.", "Return lo."],
    tc: "O(log n)", sc: "O(1)",
    fn: ["findPeakElement", [["nums", "int[]"]], "int"],
    tests: [[[[1, 2, 3, 1]], 2], [[[1]], 0], [[[1, 2]], 1], [[[3, 2, 1]], 0], [[[1, 3, 5, 4, 2]], 2]],
    js: `
var findPeakElement = function(nums) {
    let lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] < nums[mid + 1]) lo = mid + 1; else hi = mid;
    }
    return lo;
};`,
  },
  {
    t: "Capacity To Ship Packages Within D Days", d: "M", topic: "binary-search", sub: "Binary search on the answer", pat: ["binary-search"], tags: ["Binary Search", "Greedy"], co: ["amazon", "google", "flipkart"],
    desc: "Packages with `weights` must be shipped in order within `days` days. Each day the ship is loaded with consecutive packages without exceeding its capacity. Return the least capacity that ships everything within `days` days.",
    cons: ["1 <= days <= weights.length <= 5 * 10^4", "1 <= weights[i] <= 500"],
    hints: ["The capacity lies between max(weights) and sum(weights).", "Greedily count days needed for a given capacity."],
    exp: "A larger capacity never needs more days, so binary search the smallest capacity whose greedy day count fits.",
    steps: ["lo = max(weights), hi = sum(weights).", "Count days greedily for mid.", "Shrink to the smallest feasible capacity."],
    tc: "O(n log sum)", sc: "O(1)",
    fn: ["shipWithinDays", [["weights", "int[]"], ["days", "int"]], "int"],
    tests: [[[[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5], 15], [[[3, 2, 2, 4, 1, 4], 3], 6], [[[1, 2, 3, 1, 1], 4], 3]],
    js: `
var shipWithinDays = function(weights, days) {
    let lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0);
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        let need = 1, load = 0;
        for (const w of weights) { if (load + w > mid) { need++; load = 0; } load += w; }
        if (need <= days) hi = mid; else lo = mid + 1;
    }
    return lo;
};`,
  },
  {
    t: "Sqrt(x)", d: "E", topic: "binary-search", sub: "Binary search on the answer", pat: ["binary-search"], tags: ["Math", "Binary Search"], co: ["amazon", "apple", "microsoft"],
    desc: "Given a non-negative integer `x`, return the square root of `x` rounded down to the nearest integer, without using built-in exponent functions.",
    cons: ["0 <= x <= 2^31 - 1"],
    hints: ["Find the largest k with k * k <= x."],
    exp: "Binary search k in [0, x]: squares are monotonic, so the largest k whose square does not exceed x is the answer.",
    steps: ["lo = 0, hi = x.", "Use an upper-mid to find the last k with k² <= x."],
    tc: "O(log x)", sc: "O(1)",
    fn: ["mySqrt", [["x", "int"]], "int"],
    tests: [[[4], 2], [[8], 2], [[0], 0], [[1], 1], [[2147395599], 46339]],
    js: `
var mySqrt = function(x) {
    let lo = 0, hi = x;
    while (lo < hi) {
        const mid = Math.floor((lo + hi + 1) / 2);
        if (mid * mid <= x) lo = mid; else hi = mid - 1;
    }
    return lo;
};`,
  },
];
