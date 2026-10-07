import type { ProblemDef } from "./builder";

export const foundationProblems: ProblemDef[] = [
  // ------------------------------------------------------------ programming basics
  {
    t: "Fizz Buzz", d: "E", topic: "programming-basics", sub: "Loops & conditionals", pat: [], tags: ["Simulation", "Math"], co: ["microsoft", "apple"],
    desc: "Given an integer `n`, return a string array `answer` (1-indexed) where `answer[i]` is \"FizzBuzz\" if `i` is divisible by 3 and 5, \"Fizz\" if divisible by 3, \"Buzz\" if divisible by 5, and `i` as a string otherwise.",
    cons: ["1 <= n <= 10^4"],
    hints: ["Check divisibility by 15 before checking 3 or 5 on their own.", "Build the output in a single pass from 1 to n."],
    exp: "Walk from 1 to n and decide each entry with modulo checks. The order of the checks matters: a number divisible by 15 is also divisible by 3, so test the combined case first.",
    steps: ["Create an empty result list.", "For each i in 1..n, test i % 15, then i % 3, then i % 5.", "Push the matching word, or the number converted to a string."],
    tc: "O(n)", sc: "O(1) extra",
    fn: ["fizzBuzz", [["n", "int"]], "string[]"],
    tests: [[[3], ["1", "2", "Fizz"]], [[5], ["1", "2", "Fizz", "4", "Buzz"]], [[15], ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]], [[1], ["1"]]],
    js: `
var fizzBuzz = function(n) {
    const out = [];
    for (let i = 1; i <= n; i++) {
        if (i % 15 === 0) out.push("FizzBuzz");
        else if (i % 3 === 0) out.push("Fizz");
        else if (i % 5 === 0) out.push("Buzz");
        else out.push(String(i));
    }
    return out;
};`,
    py: `
class Solution:
    def fizzBuzz(self, n: int) -> List[str]:
        out = []
        for i in range(1, n + 1):
            if i % 15 == 0: out.append("FizzBuzz")
            elif i % 3 == 0: out.append("Fizz")
            elif i % 5 == 0: out.append("Buzz")
            else: out.append(str(i))
        return out`,
  },
  {
    t: "Running Sum of 1d Array", d: "E", topic: "programming-basics", sub: "Arrays & loops", pat: ["prefix-sum"], tags: ["Array"], co: ["adobe"],
    desc: "Given an array `nums`, return its running sum, where `runningSum[i] = nums[0] + nums[1] + ... + nums[i]`.",
    cons: ["1 <= nums.length <= 1000", "-10^6 <= nums[i] <= 10^6"],
    hints: ["Each running sum equals the previous running sum plus the current element."],
    exp: "Keep an accumulator while scanning the array. This is the simplest form of a prefix sum, which later topics build on.",
    steps: ["Initialise sum = 0.", "For each element add it to sum and record sum."],
    tc: "O(n)", sc: "O(n) for the output",
    fn: ["runningSum", [["nums", "int[]"]], "int[]"],
    tests: [[[[1, 2, 3, 4]], [1, 3, 6, 10]], [[[1, 1, 1, 1, 1]], [1, 2, 3, 4, 5]], [[[3, 1, 2, 10, 1]], [3, 4, 6, 16, 17]], [[[-5]], [-5]]],
    js: `
var runningSum = function(nums) {
    const out = [];
    let sum = 0;
    for (const x of nums) { sum += x; out.push(sum); }
    return out;
};`,
  },
  {
    t: "Richest Customer Wealth", d: "E", topic: "programming-basics", sub: "Nested loops", pat: [], tags: ["Array", "Matrix"], co: ["amazon"],
    desc: "You are given an `m x n` grid `accounts` where `accounts[i][j]` is the amount of money customer `i` has in bank `j`. A customer's wealth is the total across all their accounts. Return the wealth of the richest customer.",
    cons: ["1 <= m, n <= 50", "1 <= accounts[i][j] <= 100"],
    hints: ["Sum each row, then track the maximum row sum."],
    exp: "Compute each customer's total with an inner loop and keep the largest total seen so far.",
    steps: ["For every row compute the sum of its values.", "Update the best answer with the row sum."],
    tc: "O(m·n)", sc: "O(1)",
    fn: ["maximumWealth", [["accounts", "int[][]"]], "int"],
    tests: [[[[[1, 2, 3], [3, 2, 1]]], 6], [[[[1, 5], [7, 3], [3, 5]]], 10], [[[[2, 8, 7], [7, 1, 3], [1, 9, 5]]], 17]],
    js: `
var maximumWealth = function(accounts) {
    let best = 0;
    for (const row of accounts) best = Math.max(best, row.reduce((a, b) => a + b, 0));
    return best;
};`,
  },
  {
    t: "Find Numbers with Even Number of Digits", d: "E", topic: "programming-basics", sub: "Digit manipulation", pat: [], tags: ["Array", "Math"], co: ["flipkart"],
    desc: "Given an array `nums` of integers, return how many of them contain an even number of digits.",
    cons: ["1 <= nums.length <= 500", "1 <= nums[i] <= 10^5"],
    hints: ["Count digits by repeatedly dividing by 10, or convert to a string."],
    exp: "Count the digits of each number and increment the answer when the digit count is even.",
    steps: ["For each number count its digits.", "Increase the counter when the count is even."],
    tc: "O(n · d)", sc: "O(1)",
    fn: ["findNumbers", [["nums", "int[]"]], "int"],
    tests: [[[[12, 345, 2, 6, 7896]], 2], [[[555, 901, 482, 1771]], 1], [[[100000]], 1], [[[1]], 0]],
    js: `
var findNumbers = function(nums) {
    let count = 0;
    for (let x of nums) {
        let digits = 0;
        while (x > 0) { digits++; x = Math.floor(x / 10); }
        if (digits % 2 === 0) count++;
    }
    return count;
};`,
  },
  // ------------------------------------------------------------ basic math
  {
    t: "Palindrome Number", d: "E", topic: "basic-math", sub: "Digit manipulation", pat: [], tags: ["Math"], co: ["amazon", "microsoft", "adobe"],
    desc: "Given an integer `x`, return `true` if `x` reads the same backward as forward, and `false` otherwise. Solve it without converting the integer to a string.",
    cons: ["-2^31 <= x <= 2^31 - 1"],
    hints: ["Negative numbers are never palindromes.", "Reverse only half of the number and compare it with the other half."],
    exp: "Build the reversed lower half of the number digit by digit until it is at least as large as the remaining upper half. For even digit counts the halves must match; for odd counts drop the middle digit.",
    steps: ["Reject negatives and numbers ending in 0 (except 0).", "Move digits from x into rev until rev >= x.", "Compare x with rev or rev/10."],
    tc: "O(log₁₀ n)", sc: "O(1)",
    fn: ["isPalindrome", [["x", "int"]], "bool"],
    tests: [[[121], true], [[-121], false], [[10], false], [[0], true], [[1221], true], [[12321], true]],
    js: `
var isPalindrome = function(x) {
    if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
    let rev = 0;
    while (x > rev) { rev = rev * 10 + (x % 10); x = Math.floor(x / 10); }
    return x === rev || x === Math.floor(rev / 10);
};`,
    py: `
class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0 or (x % 10 == 0 and x != 0):
            return False
        rev = 0
        while x > rev:
            rev = rev * 10 + x % 10
            x //= 10
        return x == rev or x == rev // 10`,
  },
  {
    t: "Count Primes", d: "M", topic: "basic-math", sub: "Sieve of Eratosthenes", pat: [], tags: ["Math", "Number Theory"], co: ["amazon", "microsoft", "apple"],
    desc: "Given an integer `n`, return the number of prime numbers that are strictly less than `n`.",
    cons: ["0 <= n <= 5 * 10^6"],
    hints: ["Testing each number by trial division is too slow for large n.", "Mark multiples of each prime starting from p*p."],
    exp: "The Sieve of Eratosthenes marks every composite number below n by crossing out multiples of each prime. Starting from p*p is enough because smaller multiples were already crossed out by smaller primes.",
    steps: ["Create a boolean array of size n, all true.", "For p from 2 while p*p < n, if p is prime mark p*p, p*p+p, ... as composite.", "Count the remaining true entries from 2 upward."],
    tc: "O(n log log n)", sc: "O(n)",
    fn: ["countPrimes", [["n", "int"]], "int"],
    tests: [[[10], 4], [[0], 0], [[1], 0], [[2], 0], [[100], 25], [[1000], 168]],
    js: `
var countPrimes = function(n) {
    if (n < 3) return 0;
    const composite = new Uint8Array(n);
    let count = 0;
    for (let p = 2; p < n; p++) {
        if (composite[p]) continue;
        count++;
        for (let m = p * p; m < n; m += p) composite[m] = 1;
    }
    return count;
};`,
    alt: [{ name: "Trial division", time: "O(n√n)", space: "O(1)", note: "Check every number up to √k. Fine for tiny n, far too slow for 5 million." }],
  },
  {
    t: "Pow(x, n)", d: "M", topic: "basic-math", sub: "Fast exponentiation", pat: [], tags: ["Math", "Recursion"], co: ["google", "amazon", "meta", "microsoft"],
    desc: "Implement `pow(x, n)`, which calculates `x` raised to the power `n`.",
    cons: ["-100.0 < x < 100.0", "-2^31 <= n <= 2^31 - 1", "-10^4 <= x^n <= 10^4"],
    hints: ["x^n = (x^2)^(n/2) when n is even.", "Handle negative n by inverting x."],
    exp: "Binary exponentiation squares the base and halves the exponent each step, multiplying the result whenever the current bit of n is set. This turns n multiplications into about log n.",
    steps: ["If n < 0, set x = 1/x and n = -n.", "While n > 0: if n is odd multiply result by x; square x; halve n."],
    tc: "O(log n)", sc: "O(1)",
    fn: ["myPow", [["x", "double"], ["n", "int"]], "double"],
    cmp: "float",
    tests: [[[2.0, 10], 1024.0], [[2.1, 3], 9.261], [[2.0, -2], 0.25], [[1.0, 2147483647], 1.0], [[-2.0, 3], -8.0]],
    js: `
var myPow = function(x, n) {
    let N = n;
    if (N < 0) { x = 1 / x; N = -N; }
    let result = 1;
    while (N > 0) {
        if (N % 2 === 1) result *= x;
        x *= x;
        N = Math.floor(N / 2);
    }
    return result;
};`,
  },
  {
    t: "Reverse Integer", d: "M", topic: "basic-math", sub: "Overflow handling", pat: [], tags: ["Math"], co: ["apple", "adobe", "amazon"],
    desc: "Given a signed 32-bit integer `x`, return `x` with its digits reversed. If reversing `x` causes the value to go outside the signed 32-bit range `[-2^31, 2^31 - 1]`, return 0.",
    cons: ["-2^31 <= x <= 2^31 - 1"],
    hints: ["Pop digits with % 10 and push them onto the result.", "Check the range before returning."],
    exp: "Pop the last digit of x and push it onto the reversed number. In fixed-width languages you must check for overflow before each push; in JavaScript you can check the final value.",
    steps: ["Record the sign and work with |x|.", "Pop and push digits.", "Return 0 if the result leaves the 32-bit range."],
    tc: "O(log x)", sc: "O(1)",
    fn: ["reverse", [["x", "int"]], "int"],
    tests: [[[123], 321], [[-123], -321], [[120], 21], [[1534236469], 0], [[0], 0]],
    js: `
var reverse = function(x) {
    const sign = x < 0 ? -1 : 1;
    let n = Math.abs(x), rev = 0;
    while (n > 0) { rev = rev * 10 + (n % 10); n = Math.floor(n / 10); }
    rev *= sign;
    if (rev > 2147483647 || rev < -2147483648) return 0;
    return rev;
};`,
  },
  {
    t: "Plus One", d: "E", topic: "basic-math", sub: "Carry propagation", pat: [], tags: ["Array", "Math"], co: ["google", "adobe"],
    desc: "You are given a large integer represented as an array `digits`, most significant digit first, with no leading zeros. Increment the integer by one and return the resulting array of digits.",
    cons: ["1 <= digits.length <= 100", "0 <= digits[i] <= 9"],
    hints: ["Walk from the last digit, turning 9s into 0s.", "If every digit was 9, prepend a 1."],
    exp: "Add one at the end and propagate the carry left. The first digit that is not 9 absorbs the carry and we can stop.",
    steps: ["Scan from the right.", "If digit < 9, increment and return.", "Otherwise set it to 0 and continue.", "If the loop finishes, prepend 1."],
    tc: "O(n)", sc: "O(1) (O(n) when all 9s)",
    fn: ["plusOne", [["digits", "int[]"]], "int[]"],
    tests: [[[[1, 2, 3]], [1, 2, 4]], [[[4, 3, 2, 1]], [4, 3, 2, 2]], [[[9]], [1, 0]], [[[9, 9, 9]], [1, 0, 0, 0]]],
    js: `
var plusOne = function(digits) {
    for (let i = digits.length - 1; i >= 0; i--) {
        if (digits[i] < 9) { digits[i]++; return digits; }
        digits[i] = 0;
    }
    return [1, ...digits];
};`,
  },
  {
    t: "Excel Sheet Column Number", d: "E", topic: "basic-math", sub: "Base conversion", pat: [], tags: ["Math", "String"], co: ["microsoft", "google"],
    desc: "Given a string `columnTitle` that represents a column title as it appears in a spreadsheet (A → 1, B → 2, ..., Z → 26, AA → 27), return its corresponding column number.",
    cons: ["1 <= columnTitle.length <= 7", "columnTitle consists only of uppercase English letters"],
    hints: ["Treat the title as a base-26 number where digits run from 1 to 26."],
    exp: "Process characters left to right, multiplying the running value by 26 and adding the current letter's value.",
    steps: ["result = 0", "For each char c: result = result * 26 + (c - 'A' + 1)."],
    tc: "O(n)", sc: "O(1)",
    fn: ["titleToNumber", [["columnTitle", "string"]], "int"],
    tests: [[["A"], 1], [["AB"], 28], [["ZY"], 701], [["FXSHRXW"], 2147483647]],
    js: `
var titleToNumber = function(columnTitle) {
    let result = 0;
    for (const c of columnTitle) result = result * 26 + (c.charCodeAt(0) - 64);
    return result;
};`,
  },
  {
    t: "Add Digits", d: "E", topic: "basic-math", sub: "Digital root", pat: [], tags: ["Math"], co: ["adobe"],
    desc: "Given an integer `num`, repeatedly add all its digits until the result has only one digit, and return it.",
    cons: ["0 <= num <= 2^31 - 1"],
    hints: ["Simulate first, then look for a pattern with modulo 9."],
    exp: "The repeated digit sum is the digital root, which equals 1 + (num - 1) % 9 for positive numbers and 0 for zero.",
    steps: ["Return 0 for num = 0.", "Otherwise return 1 + (num - 1) % 9."],
    tc: "O(1)", sc: "O(1)",
    fn: ["addDigits", [["num", "int"]], "int"],
    tests: [[[38], 2], [[0], 0], [[9], 9], [[10], 1], [[999999], 9]],
    js: `
var addDigits = function(num) {
    if (num === 0) return 0;
    return 1 + ((num - 1) % 9);
};`,
    alt: [{ name: "Simulation", time: "O(log n)", space: "O(1)", note: "Sum digits in a loop until one digit remains." }],
  },
  {
    t: "Greatest Common Divisor of Strings", d: "E", topic: "basic-math", sub: "GCD", pat: [], tags: ["Math", "String"], co: ["google", "microsoft"],
    desc: "For two strings `s` and `t`, we say `t` divides `s` if `s` is `t` concatenated with itself one or more times. Given `str1` and `str2`, return the largest string `x` such that `x` divides both.",
    cons: ["1 <= str1.length, str2.length <= 1000", "Both strings consist of uppercase English letters"],
    hints: ["If str1 + str2 !== str2 + str1 there is no answer.", "Otherwise the answer has length gcd(len1, len2)."],
    exp: "A common divisor exists exactly when the two concatenation orders are equal. In that case the longest divisor is the prefix whose length is the GCD of the two lengths.",
    steps: ["Compare str1+str2 with str2+str1.", "Compute g = gcd(|str1|, |str2|) with Euclid's algorithm.", "Return str1.slice(0, g)."],
    tc: "O(m + n)", sc: "O(m + n)",
    fn: ["gcdOfStrings", [["str1", "string"], ["str2", "string"]], "string"],
    tests: [[["ABCABC", "ABC"], "ABC"], [["ABABAB", "ABAB"], "AB"], [["LEET", "CODE"], ""], [["AAAA", "AA"], "AA"]],
    js: `
var gcdOfStrings = function(str1, str2) {
    if (str1 + str2 !== str2 + str1) return "";
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    return str1.slice(0, gcd(str1.length, str2.length));
};`,
  },
  // ------------------------------------------------------------ basic recursion
  {
    t: "Fibonacci Number", d: "E", topic: "basic-recursion", sub: "Recursion basics", pat: ["dynamic-programming"], tags: ["Recursion", "Memoization"], co: ["amazon", "apple"],
    desc: "The Fibonacci numbers satisfy `F(0) = 0`, `F(1) = 1` and `F(n) = F(n - 1) + F(n - 2)` for `n > 1`. Given `n`, calculate `F(n)`.",
    cons: ["0 <= n <= 30"],
    hints: ["The plain recursive solution recomputes the same values many times.", "You only ever need the previous two values."],
    exp: "The recursive definition is a good introduction to base cases, but it takes exponential time. Iterating while keeping the last two values gives linear time and constant space.",
    steps: ["Handle n < 2 directly.", "Iterate from 2 to n keeping (a, b) = (F(i-2), F(i-1))."],
    tc: "O(n)", sc: "O(1)",
    fn: ["fib", [["n", "int"]], "int"],
    tests: [[[2], 1], [[3], 2], [[4], 3], [[0], 0], [[30], 832040]],
    js: `
var fib = function(n) {
    if (n < 2) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
    return b;
};`,
    py: `
class Solution:
    def fib(self, n: int) -> int:
        a, b = 0, 1
        for _ in range(n):
            a, b = b, a + b
        return a`,
    alt: [{ name: "Naive recursion", time: "O(2ⁿ)", space: "O(n)", note: "Direct translation of the definition. Each call branches twice." }],
  },
  {
    t: "Power of Three", d: "E", topic: "basic-recursion", sub: "Recursive reduction", pat: [], tags: ["Math", "Recursion"], co: ["google"],
    desc: "Given an integer `n`, return `true` if it is a power of three. Otherwise, return `false`.",
    cons: ["-2^31 <= n <= 2^31 - 1"],
    hints: ["Reduce the problem: n is a power of three if n is 1, or n is divisible by 3 and n/3 is a power of three."],
    exp: "Divide by three while the number is divisible. A power of three ends at exactly 1.",
    steps: ["Return false for n < 1.", "While n % 3 === 0, divide n by 3.", "Return n === 1."],
    tc: "O(log₃ n)", sc: "O(1)",
    fn: ["isPowerOfThree", [["n", "int"]], "bool"],
    tests: [[[27], true], [[0], false], [[-1], false], [[1], true], [[45], false], [[1162261467], true]],
    js: `
var isPowerOfThree = function(n) {
    if (n < 1) return false;
    while (n % 3 === 0) n /= 3;
    return n === 1;
};`,
  },
  {
    t: "Reverse String", d: "E", topic: "basic-recursion", sub: "Recursion on arrays", pat: ["two-pointers"], tags: ["String", "Recursion"], co: ["apple", "microsoft"],
    desc: "Write a function that reverses a string given as an array of characters `s`. Modify the input array in place with O(1) extra memory.",
    cons: ["1 <= s.length <= 10^5", "s[i] is a printable ASCII character"],
    hints: ["Swap the outer pair, then solve the same problem for the inner part."],
    exp: "Swapping the first and last character and recursing on the middle is the recursive view. The iterative two-pointer loop does the same work without call-stack overhead.",
    steps: ["Set l = 0 and r = n - 1.", "Swap s[l] and s[r], then move both pointers inward until they meet."],
    tc: "O(n)", sc: "O(1)",
    fn: ["reverseString", [["s", "char[]"]], "void"],
    tests: [[[["h", "e", "l", "l", "o"]], ["o", "l", "l", "e", "h"]], [[["H", "a", "n", "n", "a", "h"]], ["h", "a", "n", "n", "a", "H"]], [[["a"]], ["a"]]],
    js: `
var reverseString = function(s) {
    let l = 0, r = s.length - 1;
    while (l < r) { [s[l], s[r]] = [s[r], s[l]]; l++; r--; }
};`,
  },
  {
    t: "K-th Symbol in Grammar", d: "M", topic: "basic-recursion", sub: "Recursive structure", pat: [], tags: ["Recursion", "Bit Manipulation"], co: ["meta", "amazon"],
    desc: "Build a table of `n` rows. Row 1 is `0`. Each next row replaces every `0` with `01` and every `1` with `10`. Given `n` and `k`, return the `k`-th (1-indexed) symbol in row `n`.",
    cons: ["1 <= n <= 30", "1 <= k <= 2^(n - 1)"],
    hints: ["The k-th symbol comes from the ceil(k/2)-th symbol of the previous row.", "Even positions flip their parent's value."],
    exp: "Each symbol has a parent in the row above. If k is odd it equals its parent; if k is even it is the parent's complement. Recurse up to row 1.",
    steps: ["Base case: n = 1 returns 0.", "parent = kthGrammar(n - 1, ceil(k / 2)).", "Return parent if k is odd, else 1 - parent."],
    tc: "O(n)", sc: "O(n) recursion",
    fn: ["kthGrammar", [["n", "int"], ["k", "int"]], "int"],
    tests: [[[1, 1], 0], [[2, 1], 0], [[2, 2], 1], [[4, 5], 1], [[30, 434991989], 0]],
    js: `
var kthGrammar = function(n, k) {
    if (n === 1) return 0;
    const parent = kthGrammar(n - 1, Math.ceil(k / 2));
    return k % 2 === 1 ? parent : 1 - parent;
};`,
  },
  {
    t: "Sum of All Subset XOR Totals", d: "E", topic: "basic-recursion", sub: "Include / exclude recursion", pat: ["backtracking"], tags: ["Recursion", "Bit Manipulation"], co: ["amazon"],
    desc: "The XOR total of an array is the bitwise XOR of all its elements (0 if empty). Given `nums`, return the sum of XOR totals over every subset of `nums`.",
    cons: ["1 <= nums.length <= 12", "1 <= nums[i] <= 20"],
    hints: ["At each index you either include the element or skip it.", "Carry the running XOR through the recursion."],
    exp: "Explore the include/exclude decision tree. Each leaf corresponds to one subset, and its running XOR is that subset's total.",
    steps: ["dfs(i, acc): if i === n return acc.", "Return dfs(i + 1, acc ^ nums[i]) + dfs(i + 1, acc)."],
    tc: "O(2ⁿ)", sc: "O(n)",
    fn: ["subsetXORSum", [["nums", "int[]"]], "int"],
    tests: [[[[1, 3]], 6], [[[5, 1, 6]], 28], [[[3, 4, 5, 6, 7, 8]], 480]],
    js: `
var subsetXORSum = function(nums) {
    const dfs = (i, acc) => (i === nums.length ? acc : dfs(i + 1, acc ^ nums[i]) + dfs(i + 1, acc));
    return dfs(0, 0);
};`,
    alt: [{ name: "Bitwise OR trick", time: "O(n)", space: "O(1)", note: "Every bit set in any element contributes to exactly half the subsets: answer = (OR of all) << (n - 1)." }],
  },
  // ------------------------------------------------------------ arrays
  {
    t: "Two Sum", d: "E", topic: "arrays", sub: "Hashing in arrays", pat: ["hash-map"], tags: ["Array", "Hash Table"], co: ["google", "amazon", "microsoft", "meta", "apple", "adobe", "flipkart"],
    desc: "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. Each input has exactly one solution, and you may not use the same element twice. Return the indices in increasing order.",
    cons: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i], target <= 10^9", "Exactly one valid answer exists"],
    hints: ["A brute-force double loop works but takes O(n²).", "For each number, the partner you need is target - num. How can you look that up in O(1)?"],
    exp: "Scan the array once while remembering every value you have seen in a hash map from value to index. For the current number, check whether its complement is already in the map; if it is, you have the pair.",
    steps: ["Create an empty map value → index.", "For each index i, compute need = target - nums[i].", "If need is in the map, return [map[need], i].", "Otherwise store nums[i] → i and continue."],
    tc: "O(n)", sc: "O(n)",
    fn: ["twoSum", [["nums", "int[]"], ["target", "int"]], "int[]"],
    notes: ["nums[0] + nums[1] = 2 + 7 = 9"],
    tests: [[[[2, 7, 11, 15], 9], [0, 1]], [[[3, 2, 4], 6], [1, 2]], [[[3, 3], 6], [0, 1]], [[[-1, -2, -3, -4, -5], -8], [2, 4]], [[[0, 4, 3, 0], 0], [0, 3]]],
    js: `
var twoSum = function(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const need = target - nums[i];
        if (seen.has(need)) return [seen.get(need), i];
        seen.set(nums[i], i);
    }
    return [];
};`,
    py: `
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, x in enumerate(nums):
            if target - x in seen:
                return [seen[target - x], i]
            seen[x] = i
        return []`,
    alt: [
      { name: "Brute force", time: "O(n²)", space: "O(1)", note: "Try every pair. Simple, but too slow for 10⁴ elements in a timed interview." },
      { name: "Sort + two pointers", time: "O(n log n)", space: "O(n)", note: "Sort (value, index) pairs and move pointers inward. Useful when the input is already sorted." },
    ],
  },
  {
    t: "Maximum Subarray", d: "M", topic: "arrays", sub: "Kadane's algorithm", pat: ["dynamic-programming", "greedy"], tags: ["Array", "Kadane"], co: ["google", "amazon", "microsoft", "apple", "adobe", "flipkart"],
    desc: "Given an integer array `nums`, find the contiguous subarray with the largest sum and return its sum.",
    cons: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    hints: ["If the running sum becomes negative, it can only hurt any subarray that extends it.", "Track the best sum ending at each index."],
    exp: "Kadane's algorithm keeps the best sum of a subarray ending at the current index: either extend the previous subarray or start fresh at the current element. The answer is the maximum of these values.",
    steps: ["cur = best = nums[0].", "For each next x: cur = max(x, cur + x).", "best = max(best, cur)."],
    tc: "O(n)", sc: "O(1)",
    fn: ["maxSubArray", [["nums", "int[]"]], "int"],
    notes: ["The subarray [4,-1,2,1] has the largest sum 6."],
    tests: [[[[-2, 1, -3, 4, -1, 2, 1, -5, 4]], 6], [[[1]], 1], [[[5, 4, -1, 7, 8]], 23], [[[-3, -2, -5]], -2], [[[-1, 3, -2, 5, -10, 4]], 6]],
    js: `
var maxSubArray = function(nums) {
    let cur = nums[0], best = nums[0];
    for (let i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);
        best = Math.max(best, cur);
    }
    return best;
};`,
    py: `
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        cur = best = nums[0]
        for x in nums[1:]:
            cur = max(x, cur + x)
            best = max(best, cur)
        return best`,
    alt: [{ name: "Divide and conquer", time: "O(n log n)", space: "O(log n)", note: "Best of left half, right half, and the best crossing subarray." }],
  },
  {
    t: "Best Time to Buy and Sell Stock", d: "E", topic: "arrays", sub: "Running minimum", pat: ["greedy", "sliding-window"], tags: ["Array"], co: ["amazon", "microsoft", "meta", "google", "flipkart"],
    desc: "You are given an array `prices` where `prices[i]` is the price of a stock on day `i`. Choose one day to buy and a later day to sell to maximise profit. Return the maximum profit, or 0 if no profit is possible.",
    cons: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    hints: ["For each selling day, the best buying day is the cheapest day before it."],
    exp: "Track the minimum price seen so far. Selling today yields price - minSoFar; keep the best such value.",
    steps: ["minPrice = Infinity, best = 0.", "For each price: best = max(best, price - minPrice); minPrice = min(minPrice, price)."],
    tc: "O(n)", sc: "O(1)",
    fn: ["maxProfit", [["prices", "int[]"]], "int"],
    notes: ["Buy on day 2 (price 1) and sell on day 5 (price 6), profit = 5."],
    tests: [[[[7, 1, 5, 3, 6, 4]], 5], [[[7, 6, 4, 3, 1]], 0], [[[2, 4, 1]], 2], [[[3]], 0], [[[1, 2, 4, 2, 5, 7, 2, 4, 9, 0]], 8]],
    js: `
var maxProfit = function(prices) {
    let minPrice = Infinity, best = 0;
    for (const p of prices) {
        best = Math.max(best, p - minPrice);
        minPrice = Math.min(minPrice, p);
    }
    return best;
};`,
    py: `
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        lo, best = float("inf"), 0
        for p in prices:
            best = max(best, p - lo)
            lo = min(lo, p)
        return best`,
  },
  {
    t: "Rotate Array", d: "M", topic: "arrays", sub: "In-place manipulation", pat: ["two-pointers"], tags: ["Array"], co: ["microsoft", "amazon", "adobe"],
    desc: "Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative. Do it in place.",
    cons: ["1 <= nums.length <= 10^5", "0 <= k <= 10^5"],
    hints: ["k can be larger than n, so reduce it with k % n.", "Reversing the whole array and then both parts gives the rotation."],
    exp: "Rotating right by k is the same as reversing the whole array, then reversing the first k elements and the remaining n - k elements separately.",
    steps: ["k = k % n.", "Reverse nums[0..n-1].", "Reverse nums[0..k-1] and nums[k..n-1]."],
    tc: "O(n)", sc: "O(1)",
    fn: ["rotate", [["nums", "int[]"], ["k", "int"]], "void"],
    tests: [[[[1, 2, 3, 4, 5, 6, 7], 3], [5, 6, 7, 1, 2, 3, 4]], [[[-1, -100, 3, 99], 2], [3, 99, -1, -100]], [[[1, 2], 3], [2, 1]], [[[1], 0], [1]]],
    js: `
var rotate = function(nums, k) {
    const n = nums.length;
    k %= n;
    const rev = (l, r) => { while (l < r) { [nums[l], nums[r]] = [nums[r], nums[l]]; l++; r--; } };
    rev(0, n - 1);
    rev(0, k - 1);
    rev(k, n - 1);
};`,
  },
  {
    t: "Product of Array Except Self", d: "M", topic: "arrays", sub: "Prefix and suffix products", pat: ["prefix-sum"], tags: ["Array", "Prefix Sum"], co: ["amazon", "meta", "microsoft", "apple", "google"],
    desc: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is the product of all elements of `nums` except `nums[i]`. Solve it in O(n) without using division.",
    cons: ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30"],
    hints: ["answer[i] = (product of everything left of i) × (product of everything right of i).", "You can fill the left products into the output, then sweep from the right with a running product."],
    exp: "Compute prefix products from the left into the result array, then sweep from the right keeping a running suffix product and multiply it in. No division is needed, so zeros are handled naturally.",
    steps: ["res[i] = product of nums[0..i-1].", "Sweep right to left with suffix = 1: res[i] *= suffix; suffix *= nums[i]."],
    tc: "O(n)", sc: "O(1) extra (output excluded)",
    fn: ["productExceptSelf", [["nums", "int[]"]], "int[]"],
    tests: [[[[1, 2, 3, 4]], [24, 12, 8, 6]], [[[-1, 1, 0, -3, 3]], [0, 0, 9, 0, 0]], [[[2, 3]], [3, 2]], [[[0, 0]], [0, 0]]],
    js: `
var productExceptSelf = function(nums) {
    const n = nums.length, res = new Array(n).fill(1);
    for (let i = 1; i < n; i++) res[i] = res[i - 1] * nums[i - 1];
    let suffix = 1;
    for (let i = n - 1; i >= 0; i--) { res[i] *= suffix; suffix *= nums[i]; }
    return res;
};`,
    py: `
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        res = [1] * n
        for i in range(1, n):
            res[i] = res[i - 1] * nums[i - 1]
        suffix = 1
        for i in range(n - 1, -1, -1):
            res[i] *= suffix
            suffix *= nums[i]
        return res`,
  },
  {
    t: "Merge Intervals", d: "M", topic: "arrays", sub: "Intervals", pat: ["merge-intervals"], tags: ["Array", "Sorting"], co: ["google", "meta", "amazon", "microsoft", "atlassian", "flipkart"],
    desc: "Given an array of `intervals` where `intervals[i] = [start, end]`, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the input intervals, sorted by start.",
    cons: ["1 <= intervals.length <= 10^4", "0 <= start <= end <= 10^4"],
    hints: ["Sort by start time first.", "After sorting, an interval overlaps the previous merged one only if its start ≤ previous end."],
    exp: "Once intervals are sorted by start, overlaps can only happen with the most recently merged interval. Extend its end when they overlap, otherwise start a new merged interval.",
    steps: ["Sort intervals by start.", "Push the first interval to the result.", "For each next interval, if start <= last.end set last.end = max(last.end, end); else push it."],
    tc: "O(n log n)", sc: "O(n)",
    fn: ["merge", [["intervals", "int[][]"]], "int[][]"],
    tests: [[[[[1, 3], [2, 6], [8, 10], [15, 18]]], [[1, 6], [8, 10], [15, 18]]], [[[[1, 4], [4, 5]]], [[1, 5]]], [[[[1, 4], [0, 4]]], [[0, 4]]], [[[[1, 4], [2, 3]]], [[1, 4]]], [[[[5, 6]]], [[5, 6]]]],
    js: `
var merge = function(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const res = [intervals[0].slice()];
    for (let i = 1; i < intervals.length; i++) {
        const last = res[res.length - 1], [s, e] = intervals[i];
        if (s <= last[1]) last[1] = Math.max(last[1], e);
        else res.push([s, e]);
    }
    return res;
};`,
    py: `
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort()
        res = [intervals[0][:]]
        for s, e in intervals[1:]:
            if s <= res[-1][1]:
                res[-1][1] = max(res[-1][1], e)
            else:
                res.append([s, e])
        return res`,
  },
  {
    t: "Contains Duplicate", d: "E", topic: "arrays", sub: "Hashing in arrays", pat: ["hash-map"], tags: ["Array", "Hash Table"], co: ["amazon", "apple", "adobe", "microsoft"],
    desc: "Given an integer array `nums`, return `true` if any value appears at least twice, and `false` if every element is distinct.",
    cons: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    hints: ["A set remembers what you have already seen."],
    exp: "Insert values into a hash set as you scan; the first value already in the set is a duplicate.",
    steps: ["Create an empty set.", "For each value, return true if it is in the set, else add it."],
    tc: "O(n)", sc: "O(n)",
    fn: ["containsDuplicate", [["nums", "int[]"]], "bool"],
    tests: [[[[1, 2, 3, 1]], true], [[[1, 2, 3, 4]], false], [[[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], true], [[[7]], false]],
    js: `
var containsDuplicate = function(nums) {
    const seen = new Set();
    for (const x of nums) { if (seen.has(x)) return true; seen.add(x); }
    return false;
};`,
    alt: [{ name: "Sort and compare neighbours", time: "O(n log n)", space: "O(1)", note: "After sorting, duplicates sit next to each other." }],
  },
  {
    t: "Move Zeroes", d: "E", topic: "arrays", sub: "In-place manipulation", pat: ["two-pointers"], tags: ["Array"], co: ["meta", "apple", "microsoft"],
    desc: "Given an integer array `nums`, move all `0`s to the end while keeping the relative order of the non-zero elements. Do this in place.",
    cons: ["1 <= nums.length <= 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
    hints: ["Keep a write pointer for the next non-zero position."],
    exp: "A slow pointer marks where the next non-zero value belongs. Swap each non-zero element into that slot; zeros naturally collect at the end.",
    steps: ["write = 0.", "For each read index, if nums[read] !== 0 swap it with nums[write] and increment write."],
    tc: "O(n)", sc: "O(1)",
    fn: ["moveZeroes", [["nums", "int[]"]], "void"],
    tests: [[[[0, 1, 0, 3, 12]], [1, 3, 12, 0, 0]], [[[0]], [0]], [[[1, 0, 1]], [1, 1, 0]], [[[4, 2, 4, 0, 0, 3, 0, 5, 1, 0]], [4, 2, 4, 3, 5, 1, 0, 0, 0, 0]]],
    js: `
var moveZeroes = function(nums) {
    let w = 0;
    for (let r = 0; r < nums.length; r++) {
        if (nums[r] !== 0) { [nums[w], nums[r]] = [nums[r], nums[w]]; w++; }
    }
};`,
  },
  {
    t: "Majority Element", d: "E", topic: "arrays", sub: "Voting algorithm", pat: [], tags: ["Array", "Counting"], co: ["amazon", "google", "adobe"],
    desc: "Given an array `nums` of size `n`, return the majority element, which appears more than ⌊n / 2⌋ times. The majority element always exists.",
    cons: ["1 <= n <= 5 * 10^4", "-10^9 <= nums[i] <= 10^9"],
    hints: ["Pair each majority element with a different element; the majority still has some left over.", "Boyer–Moore voting keeps one candidate and a counter."],
    exp: "Boyer–Moore voting: when the counter is zero, adopt the current element as the candidate; matching elements increase the counter, others decrease it. The majority survives the cancellations.",
    steps: ["count = 0, cand = null.", "For x: if count == 0 then cand = x; count += (x == cand ? 1 : -1).", "Return cand."],
    tc: "O(n)", sc: "O(1)",
    fn: ["majorityElement", [["nums", "int[]"]], "int"],
    tests: [[[[3, 2, 3]], 3], [[[2, 2, 1, 1, 1, 2, 2]], 2], [[[1]], 1], [[[6, 5, 5]], 5]],
    js: `
var majorityElement = function(nums) {
    let cand = 0, count = 0;
    for (const x of nums) {
        if (count === 0) cand = x;
        count += x === cand ? 1 : -1;
    }
    return cand;
};`,
  },
  {
    t: "Sort Colors", d: "M", topic: "arrays", sub: "Dutch national flag", pat: ["two-pointers"], tags: ["Array", "Sorting"], co: ["microsoft", "amazon", "adobe", "flipkart"],
    desc: "Given an array `nums` with values 0, 1 and 2 (red, white, blue), sort it in place so that equal colours are adjacent in the order 0, 1, 2. Do not use a library sort.",
    cons: ["1 <= nums.length <= 300", "nums[i] is 0, 1, or 2"],
    hints: ["Maintain three regions: zeros at the front, twos at the back, ones in the middle.", "When you swap in a 2 from the back, do not advance the scanning pointer."],
    exp: "Dijkstra's Dutch national flag partition keeps low, mid and high pointers. Elements before low are 0, after high are 2, and between low and mid are 1. A single pass sorts the array.",
    steps: ["low = mid = 0, high = n - 1.", "If nums[mid] == 0 swap with low, advance both.", "If 1, advance mid.", "If 2 swap with high and decrement high."],
    tc: "O(n)", sc: "O(1)",
    fn: ["sortColors", [["nums", "int[]"]], "void"],
    tests: [[[[2, 0, 2, 1, 1, 0]], [0, 0, 1, 1, 2, 2]], [[[2, 0, 1]], [0, 1, 2]], [[[0]], [0]], [[[1, 2, 0, 0, 2, 1, 1]], [0, 0, 1, 1, 1, 2, 2]]],
    js: `
var sortColors = function(nums) {
    let lo = 0, mid = 0, hi = nums.length - 1;
    while (mid <= hi) {
        if (nums[mid] === 0) { [nums[lo], nums[mid]] = [nums[mid], nums[lo]]; lo++; mid++; }
        else if (nums[mid] === 1) mid++;
        else { [nums[mid], nums[hi]] = [nums[hi], nums[mid]]; hi--; }
    }
};`,
  },
  {
    t: "Next Permutation", d: "M", topic: "arrays", sub: "Permutations", pat: ["two-pointers"], tags: ["Array"], co: ["google", "microsoft", "adobe", "flipkart"],
    desc: "Rearrange `nums` in place into the lexicographically next greater permutation. If no such permutation exists (the array is in descending order), rearrange it into ascending order.",
    cons: ["1 <= nums.length <= 100", "0 <= nums[i] <= 100"],
    hints: ["Find the rightmost index i with nums[i] < nums[i+1].", "Swap it with the smallest larger element to its right, then reverse the suffix."],
    exp: "The suffix after the pivot is non-increasing, so it is already the largest arrangement of those elements. Increase the pivot minimally by swapping in the next larger value from the suffix, then reverse the suffix to make it as small as possible.",
    steps: ["Find pivot i scanning from the right.", "If found, find j > i from the right with nums[j] > nums[i] and swap.", "Reverse nums[i+1..]."],
    tc: "O(n)", sc: "O(1)",
    fn: ["nextPermutation", [["nums", "int[]"]], "void"],
    tests: [[[[1, 2, 3]], [1, 3, 2]], [[[3, 2, 1]], [1, 2, 3]], [[[1, 1, 5]], [1, 5, 1]], [[[1, 3, 2]], [2, 1, 3]], [[[2, 3, 1, 3, 3]], [2, 3, 3, 1, 3]]],
    js: `
var nextPermutation = function(nums) {
    let i = nums.length - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    if (i >= 0) {
        let j = nums.length - 1;
        while (nums[j] <= nums[i]) j--;
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    let l = i + 1, r = nums.length - 1;
    while (l < r) { [nums[l], nums[r]] = [nums[r], nums[l]]; l++; r--; }
};`,
  },
  {
    t: "Set Matrix Zeroes", d: "M", topic: "arrays", sub: "Matrix problems", pat: [], tags: ["Array", "Matrix"], co: ["microsoft", "amazon", "meta"],
    desc: "Given an `m x n` integer matrix, if an element is 0, set its entire row and column to 0. Do it in place.",
    cons: ["1 <= m, n <= 200", "-2^31 <= matrix[i][j] <= 2^31 - 1"],
    hints: ["Record which rows and columns contain a zero before modifying anything.", "For O(1) space, use the first row and column as markers."],
    exp: "First collect the zero rows and columns, then zero them out in a second pass. Changing values during the first pass would create false markers.",
    steps: ["Collect sets of rows and columns that contain 0.", "Zero every cell whose row or column is in a set."],
    tc: "O(m·n)", sc: "O(m + n)",
    fn: ["setZeroes", [["matrix", "int[][]"]], "void"],
    tests: [[[[[1, 1, 1], [1, 0, 1], [1, 1, 1]]], [[1, 0, 1], [0, 0, 0], [1, 0, 1]]], [[[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]], [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]], [[[[1]]], [[1]]]],
    js: `
var setZeroes = function(matrix) {
    const rows = new Set(), cols = new Set();
    matrix.forEach((row, i) => row.forEach((v, j) => { if (v === 0) { rows.add(i); cols.add(j); } }));
    for (let i = 0; i < matrix.length; i++)
        for (let j = 0; j < matrix[0].length; j++)
            if (rows.has(i) || cols.has(j)) matrix[i][j] = 0;
};`,
  },
  {
    t: "Spiral Matrix", d: "M", topic: "arrays", sub: "Matrix problems", pat: [], tags: ["Array", "Matrix", "Simulation"], co: ["microsoft", "amazon", "google", "apple"],
    desc: "Given an `m x n` matrix, return all of its elements in spiral order, starting at the top-left and moving clockwise.",
    cons: ["1 <= m, n <= 10", "-100 <= matrix[i][j] <= 100"],
    hints: ["Keep four boundaries: top, bottom, left, right.", "After each side, shrink the boundary you just walked."],
    exp: "Walk the outer ring (top row, right column, bottom row, left column), then shrink the boundaries and repeat. Guard the bottom and left walks so a single remaining row or column is not visited twice.",
    steps: ["top=0, bottom=m-1, left=0, right=n-1.", "Walk each side and update the corresponding boundary.", "Stop when the boundaries cross."],
    tc: "O(m·n)", sc: "O(1) extra",
    fn: ["spiralOrder", [["matrix", "int[][]"]], "int[]"],
    tests: [[[[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], [1, 2, 3, 6, 9, 8, 7, 4, 5]], [[[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]], [[[[7], [9], [6]]], [7, 9, 6]]],
    js: `
var spiralOrder = function(matrix) {
    const res = [];
    let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
    while (top <= bottom && left <= right) {
        for (let j = left; j <= right; j++) res.push(matrix[top][j]);
        top++;
        for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);
        right--;
        if (top <= bottom) { for (let j = right; j >= left; j--) res.push(matrix[bottom][j]); bottom--; }
        if (left <= right) { for (let i = bottom; i >= top; i--) res.push(matrix[i][left]); left++; }
    }
    return res;
};`,
  },
  {
    t: "Rotate Image", d: "M", topic: "arrays", sub: "Matrix problems", pat: [], tags: ["Array", "Matrix"], co: ["microsoft", "amazon", "apple", "adobe"],
    desc: "You are given an `n x n` 2D matrix representing an image. Rotate the image by 90 degrees clockwise, in place.",
    cons: ["1 <= n <= 20", "-1000 <= matrix[i][j] <= 1000"],
    hints: ["A clockwise rotation equals a transpose followed by reversing each row."],
    exp: "Transposing swaps rows and columns; reversing each row then mirrors horizontally. Together they produce a 90° clockwise rotation without extra memory.",
    steps: ["Swap matrix[i][j] with matrix[j][i] for j > i.", "Reverse every row."],
    tc: "O(n²)", sc: "O(1)",
    fn: ["rotate", [["matrix", "int[][]"]], "void"],
    tests: [[[[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], [[7, 4, 1], [8, 5, 2], [9, 6, 3]]], [[[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]], [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]], [[[[1]]], [[1]]]],
    js: `
var rotate = function(matrix) {
    const n = matrix.length;
    for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++) [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    for (const row of matrix) row.reverse();
};`,
  },
  {
    t: "Pascal's Triangle", d: "E", topic: "arrays", sub: "2D arrays", pat: ["dynamic-programming"], tags: ["Array"], co: ["amazon", "adobe", "apple"],
    desc: "Given an integer `numRows`, return the first `numRows` rows of Pascal's triangle, where each number is the sum of the two numbers directly above it.",
    cons: ["1 <= numRows <= 30"],
    hints: ["Each row starts and ends with 1.", "row[j] = prev[j - 1] + prev[j]."],
    exp: "Build rows one by one from the previous row. This is a first taste of building answers from smaller answers, the core idea of dynamic programming.",
    steps: ["Start with [[1]].", "For each next row, put 1 at both ends and fill the middle from the previous row."],
    tc: "O(n²)", sc: "O(n²) for the output",
    fn: ["generate", [["numRows", "int"]], "int[][]"],
    tests: [[[5], [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]], [[1], [[1]]], [[3], [[1], [1, 1], [1, 2, 1]]]],
    js: `
var generate = function(numRows) {
    const res = [[1]];
    for (let i = 1; i < numRows; i++) {
        const prev = res[i - 1], row = [1];
        for (let j = 1; j < i; j++) row.push(prev[j - 1] + prev[j]);
        row.push(1);
        res.push(row);
    }
    return res;
};`,
  },
  {
    t: "Missing Number", d: "E", topic: "arrays", sub: "Math on arrays", pat: ["bit-manipulation"], tags: ["Array", "Math"], co: ["amazon", "microsoft", "apple"],
    desc: "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing.",
    cons: ["1 <= n <= 10^4", "All numbers are unique"],
    hints: ["The sum 0 + 1 + ... + n has a closed form.", "XOR also cancels matching pairs."],
    exp: "The expected sum of 0..n is n(n+1)/2. Subtracting the actual sum leaves the missing number.",
    steps: ["expected = n * (n + 1) / 2.", "Return expected - sum(nums)."],
    tc: "O(n)", sc: "O(1)",
    fn: ["missingNumber", [["nums", "int[]"]], "int"],
    tests: [[[[3, 0, 1]], 2], [[[0, 1]], 2], [[[9, 6, 4, 2, 3, 5, 7, 0, 1]], 8], [[[1]], 0]],
    js: `
var missingNumber = function(nums) {
    const n = nums.length;
    return (n * (n + 1)) / 2 - nums.reduce((a, b) => a + b, 0);
};`,
  },
  {
    t: "Maximum Product Subarray", d: "M", topic: "arrays", sub: "Kadane's algorithm", pat: ["dynamic-programming"], tags: ["Array", "Kadane"], co: ["amazon", "microsoft", "google", "flipkart"],
    desc: "Given an integer array `nums`, find a contiguous non-empty subarray that has the largest product, and return the product.",
    cons: ["1 <= nums.length <= 2 * 10^4", "-10 <= nums[i] <= 10"],
    hints: ["A negative number can turn the smallest product into the largest.", "Track both the maximum and minimum product ending at each index."],
    exp: "Extend Kadane's idea by tracking both the maximum and minimum products ending at each position, since multiplying by a negative swaps them.",
    steps: ["hi = lo = best = nums[0].", "For each x: candidates are x, hi*x, lo*x; update hi and lo.", "best = max(best, hi)."],
    tc: "O(n)", sc: "O(1)",
    fn: ["maxProduct", [["nums", "int[]"]], "int"],
    tests: [[[[2, 3, -2, 4]], 6], [[[-2, 0, -1]], 0], [[[-2, 3, -4]], 24], [[[-2]], -2], [[[0, 2]], 2]],
    js: `
var maxProduct = function(nums) {
    let hi = nums[0], lo = nums[0], best = nums[0];
    for (let i = 1; i < nums.length; i++) {
        const x = nums[i], a = hi * x, b = lo * x;
        hi = Math.max(x, a, b);
        lo = Math.min(x, a, b);
        best = Math.max(best, hi);
    }
    return best;
};`,
  },
  {
    t: "First Missing Positive", d: "H", topic: "arrays", sub: "Index as hash", pat: [], tags: ["Array", "Cyclic Sort"], co: ["amazon", "google", "microsoft", "meta"],
    desc: "Given an unsorted integer array `nums`, return the smallest positive integer that is not present. Your algorithm must run in O(n) time and use O(1) auxiliary space.",
    cons: ["1 <= nums.length <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1"],
    hints: ["The answer is always in the range [1, n + 1].", "Try placing each value v in index v - 1."],
    exp: "Use the array itself as a hash table: cyclically swap each value v in [1, n] into position v - 1. Afterwards the first index i where nums[i] !== i + 1 gives the answer.",
    steps: ["For each i, while 1 <= nums[i] <= n and nums[nums[i]-1] !== nums[i], swap them.", "Return the first i + 1 with nums[i] !== i + 1, or n + 1."],
    tc: "O(n)", sc: "O(1)",
    fn: ["firstMissingPositive", [["nums", "int[]"]], "int"],
    tests: [[[[1, 2, 0]], 3], [[[3, 4, -1, 1]], 2], [[[7, 8, 9, 11, 12]], 1], [[[1]], 2], [[[2, 2]], 1]],
    js: `
var firstMissingPositive = function(nums) {
    const n = nums.length;
    for (let i = 0; i < n; i++) {
        while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
            const j = nums[i] - 1;
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
    }
    for (let i = 0; i < n; i++) if (nums[i] !== i + 1) return i + 1;
    return n + 1;
};`,
  },
  {
    t: "Insert Interval", d: "M", topic: "arrays", sub: "Intervals", pat: ["merge-intervals"], tags: ["Array"], co: ["google", "meta", "microsoft", "atlassian"],
    desc: "You are given a sorted array of non-overlapping `intervals` and a `newInterval`. Insert `newInterval` so that the array stays sorted and non-overlapping, merging where necessary, and return the result.",
    cons: ["0 <= intervals.length <= 10^4", "intervals is sorted by start"],
    hints: ["Split the work into three phases: intervals entirely before, overlapping, and entirely after."],
    exp: "Copy every interval that ends before the new one starts, absorb all overlapping intervals into the new one by expanding its bounds, then copy the rest.",
    steps: ["Push intervals with end < new.start.", "Merge while interval.start <= new.end.", "Push the merged interval and the remaining ones."],
    tc: "O(n)", sc: "O(n)",
    fn: ["insert", [["intervals", "int[][]"], ["newInterval", "int[]"]], "int[][]"],
    tests: [[[[[1, 3], [6, 9]], [2, 5]], [[1, 5], [6, 9]]], [[[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]], [[1, 2], [3, 10], [12, 16]]], [[[], [5, 7]], [[5, 7]]], [[[[1, 5]], [6, 8]], [[1, 5], [6, 8]]]],
    js: `
var insert = function(intervals, newInterval) {
    const res = [];
    let [s, e] = newInterval, i = 0;
    while (i < intervals.length && intervals[i][1] < s) res.push(intervals[i++]);
    while (i < intervals.length && intervals[i][0] <= e) {
        s = Math.min(s, intervals[i][0]);
        e = Math.max(e, intervals[i][1]);
        i++;
    }
    res.push([s, e]);
    while (i < intervals.length) res.push(intervals[i++]);
    return res;
};`,
  },
  {
    t: "Best Time to Buy and Sell Stock II", d: "M", topic: "arrays", sub: "Greedy on arrays", pat: ["greedy"], tags: ["Array"], co: ["amazon", "microsoft", "flipkart"],
    desc: "You are given `prices` where `prices[i]` is the price of a stock on day `i`. You may buy and sell many times but hold at most one share at a time. Return the maximum profit.",
    cons: ["1 <= prices.length <= 3 * 10^4", "0 <= prices[i] <= 10^4"],
    hints: ["Any profitable multi-day climb equals the sum of its one-day gains."],
    exp: "Collect every positive day-to-day difference. Summing all upward steps equals the profit of buying at every valley and selling at every peak.",
    steps: ["profit = 0", "For i from 1: profit += max(0, prices[i] - prices[i-1])."],
    tc: "O(n)", sc: "O(1)",
    fn: ["maxProfit", [["prices", "int[]"]], "int"],
    tests: [[[[7, 1, 5, 3, 6, 4]], 7], [[[1, 2, 3, 4, 5]], 4], [[[7, 6, 4, 3, 1]], 0]],
    js: `
var maxProfit = function(prices) {
    let profit = 0;
    for (let i = 1; i < prices.length; i++) profit += Math.max(0, prices[i] - prices[i - 1]);
    return profit;
};`,
  },
  // ------------------------------------------------------------ strings
  {
    t: "Valid Anagram", d: "E", topic: "strings", sub: "Character counting", pat: ["hash-map"], tags: ["String", "Hash Table", "Sorting"], co: ["amazon", "google", "meta", "microsoft", "adobe"],
    desc: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s` (uses exactly the same letters with the same counts), and `false` otherwise.",
    cons: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters"],
    hints: ["Different lengths can never be anagrams.", "Count letters in s, then subtract counts for t."],
    exp: "Use a 26-slot frequency array: add for each letter of s and subtract for each letter of t. All slots must end at zero.",
    steps: ["Return false if lengths differ.", "Fill a count array from s and drain it with t.", "Check every slot is zero."],
    tc: "O(n)", sc: "O(1) (26 letters)",
    fn: ["isAnagram", [["s", "string"], ["t", "string"]], "bool"],
    tests: [[["anagram", "nagaram"], true], [["rat", "car"], false], [["a", "ab"], false], [["listen", "silent"], true]],
    js: `
var isAnagram = function(s, t) {
    if (s.length !== t.length) return false;
    const cnt = new Array(26).fill(0);
    for (let i = 0; i < s.length; i++) {
        cnt[s.charCodeAt(i) - 97]++;
        cnt[t.charCodeAt(i) - 97]--;
    }
    return cnt.every((c) => c === 0);
};`,
    py: `
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return len(s) == len(t) and Counter(s) == Counter(t)`,
  },
  {
    t: "Valid Palindrome", d: "E", topic: "strings", sub: "Two pointers on strings", pat: ["two-pointers"], tags: ["String"], co: ["meta", "microsoft", "amazon", "apple"],
    desc: "A phrase is a palindrome if, after converting uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string `s`, return `true` if it is a palindrome.",
    cons: ["1 <= s.length <= 2 * 10^5", "s consists of printable ASCII characters"],
    hints: ["Use two pointers from both ends and skip characters that are not letters or digits."],
    exp: "Move a left and right pointer toward each other, skipping non-alphanumeric characters and comparing the rest case-insensitively. This avoids building a cleaned copy.",
    steps: ["l = 0, r = n - 1.", "Skip non-alphanumerics on both sides.", "Compare lowercase characters; mismatch means false."],
    tc: "O(n)", sc: "O(1)",
    fn: ["isPalindrome", [["s", "string"]], "bool"],
    tests: [[["A man, a plan, a canal: Panama"], true], [["race a car"], false], [[" "], true], [["0P"], false], [["ab_a"], true]],
    js: `
var isPalindrome = function(s) {
    const ok = (c) => /[a-z0-9]/i.test(c);
    let l = 0, r = s.length - 1;
    while (l < r) {
        while (l < r && !ok(s[l])) l++;
        while (l < r && !ok(s[r])) r--;
        if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
        l++; r--;
    }
    return true;
};`,
  },
  {
    t: "Longest Substring Without Repeating Characters", d: "M", topic: "strings", sub: "Sliding window on strings", pat: ["sliding-window", "hash-map"], tags: ["String", "Hash Table", "Sliding Window"], co: ["amazon", "google", "meta", "microsoft", "apple", "adobe", "atlassian"],
    desc: "Given a string `s`, find the length of the longest substring without duplicate characters.",
    cons: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces"],
    hints: ["Maintain a window [left, right] that never contains duplicates.", "Remember the last index of each character so you can jump left forward."],
    exp: "Slide a window over the string. When the incoming character already appears inside the window, move the left edge just past its previous occurrence. The window length at each step is a candidate answer.",
    steps: ["Map char → last index; left = 0.", "For each right: if char seen at index >= left, set left = last + 1.", "Update last index and best = max(best, right - left + 1)."],
    tc: "O(n)", sc: "O(min(n, alphabet))",
    fn: ["lengthOfLongestSubstring", [["s", "string"]], "int"],
    notes: ["The answer is \"abc\", with length 3."],
    tests: [[["abcabcbb"], 3], [["bbbbb"], 1], [["pwwkew"], 3], [[""], 0], [["abba"], 2], [["dvdf"], 3]],
    js: `
var lengthOfLongestSubstring = function(s) {
    const last = new Map();
    let left = 0, best = 0;
    for (let right = 0; right < s.length; right++) {
        const c = s[right];
        if (last.has(c) && last.get(c) >= left) left = last.get(c) + 1;
        last.set(c, right);
        best = Math.max(best, right - left + 1);
    }
    return best;
};`,
    py: `
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last, left, best = {}, 0, 0
        for right, c in enumerate(s):
            if c in last and last[c] >= left:
                left = last[c] + 1
            last[c] = right
            best = max(best, right - left + 1)
        return best`,
  },
  {
    t: "Longest Palindromic Substring", d: "M", topic: "strings", sub: "Expand around center", pat: ["two-pointers", "dynamic-programming"], tags: ["String", "Dynamic Programming"], co: ["amazon", "microsoft", "google", "adobe", "flipkart"],
    desc: "Given a string `s`, return the longest palindromic substring in `s`. The test cases have a unique answer.",
    cons: ["1 <= s.length <= 1000", "s consists of digits and English letters"],
    hints: ["Every palindrome mirrors around a center.", "There are 2n - 1 centers: each character and each gap between characters."],
    exp: "Expand outward from each of the 2n - 1 centers while the characters match, and keep the longest span found. It is simpler than a DP table and uses constant space.",
    steps: ["For each i expand around (i, i) and (i, i + 1).", "Track the best [start, end].", "Return s.slice(start, end + 1)."],
    tc: "O(n²)", sc: "O(1)",
    fn: ["longestPalindrome", [["s", "string"]], "string"],
    tests: [[["cbbd"], "bb"], [["a"], "a"], [["racecarx"], "racecar"], [["forgeeksskeegfor"], "geeksskeeg"], [["abacdfgdcaba"], "aba"]],
    js: `
var longestPalindrome = function(s) {
    let start = 0, end = 0;
    const expand = (l, r) => {
        while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
        if (r - l - 2 > end - start) { start = l + 1; end = r - 1; }
    };
    for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1); }
    return s.slice(start, end + 1);
};`,
    alt: [{ name: "Manacher's algorithm", time: "O(n)", space: "O(n)", note: "Reuses mirrored palindrome radii. Rarely expected in interviews, but good to know it exists." }],
  },
  {
    t: "Reverse Words in a String", d: "M", topic: "strings", sub: "String parsing", pat: ["two-pointers"], tags: ["String"], co: ["microsoft", "amazon", "apple"],
    desc: "Given an input string `s`, reverse the order of the words. A word is a sequence of non-space characters. Return the words in reverse order joined by a single space, with no leading or trailing spaces.",
    cons: ["1 <= s.length <= 10^4", "s contains at least one word"],
    hints: ["Split on spaces and drop empty pieces."],
    exp: "Tokenise the string into words while ignoring extra spaces, reverse the list, and join with single spaces.",
    steps: ["Split by ' ' and filter out empty strings.", "Reverse and join with ' '."],
    tc: "O(n)", sc: "O(n)",
    fn: ["reverseWords", [["s", "string"]], "string"],
    tests: [[["the sky is blue"], "blue is sky the"], [["  hello world  "], "world hello"], [["a good   example"], "example good a"]],
    js: `
var reverseWords = function(s) {
    return s.split(" ").filter(Boolean).reverse().join(" ");
};`,
  },
  {
    t: "Longest Common Prefix", d: "E", topic: "strings", sub: "String comparison", pat: [], tags: ["String"], co: ["google", "amazon", "adobe", "apple"],
    desc: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.",
    cons: ["1 <= strs.length <= 200", "0 <= strs[i].length <= 200"],
    hints: ["Compare characters column by column across all strings."],
    exp: "Vertical scanning checks the i-th character of every string and stops at the first mismatch or the end of the shortest string.",
    steps: ["For i over the first string's characters, check every other string at i.", "Return the prefix up to the first mismatch."],
    tc: "O(S) total characters", sc: "O(1)",
    fn: ["longestCommonPrefix", [["strs", "string[]"]], "string"],
    tests: [[[["flower", "flow", "flight"]], "fl"], [[["dog", "racecar", "car"]], ""], [[["alone"]], "alone"], [[["ab", "a"]], "a"]],
    js: `
var longestCommonPrefix = function(strs) {
    for (let i = 0; i < strs[0].length; i++) {
        for (const s of strs) if (s[i] !== strs[0][i]) return strs[0].slice(0, i);
    }
    return strs[0];
};`,
  },
  {
    t: "Roman to Integer", d: "E", topic: "strings", sub: "String parsing", pat: [], tags: ["String", "Math"], co: ["amazon", "microsoft", "apple", "adobe"],
    desc: "Given a Roman numeral `s`, convert it to an integer. Subtractive forms such as IV (4) and CM (900) are used where a smaller symbol precedes a larger one.",
    cons: ["1 <= s.length <= 15", "s is a valid Roman numeral in the range [1, 3999]"],
    hints: ["If a symbol is smaller than the one after it, subtract it; otherwise add it."],
    exp: "Scan left to right. A symbol followed by a larger one is subtracted; everything else is added.",
    steps: ["Map symbols to values.", "For each i, subtract v[i] if v[i] < v[i+1], else add it."],
    tc: "O(n)", sc: "O(1)",
    fn: ["romanToInt", [["s", "string"]], "int"],
    tests: [[["III"], 3], [["LVIII"], 58], [["MCMXCIV"], 1994], [["IX"], 9]],
    js: `
var romanToInt = function(s) {
    const v = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let total = 0;
    for (let i = 0; i < s.length; i++) {
        if (i + 1 < s.length && v[s[i]] < v[s[i + 1]]) total -= v[s[i]];
        else total += v[s[i]];
    }
    return total;
};`,
  },
  {
    t: "Valid Palindrome II", d: "E", topic: "strings", sub: "Two pointers on strings", pat: ["two-pointers", "greedy"], tags: ["String"], co: ["meta", "microsoft"],
    desc: "Given a string `s`, return `true` if `s` can be a palindrome after deleting at most one character from it.",
    cons: ["1 <= s.length <= 10^5", "s consists of lowercase English letters"],
    hints: ["At the first mismatch you must delete either the left or the right character.", "Check both remaining substrings."],
    exp: "Use two pointers. On the first mismatch, the only options are to skip the left or the right character; check whether either remaining range is a palindrome.",
    steps: ["Move l and r inward while characters match.", "On mismatch return isPal(l+1, r) || isPal(l, r-1)."],
    tc: "O(n)", sc: "O(1)",
    fn: ["validPalindrome", [["s", "string"]], "bool"],
    tests: [[["aba"], true], [["abca"], true], [["abc"], false], [["deeee"], true], [["eccer"], true]],
    js: `
var validPalindrome = function(s) {
    const isPal = (l, r) => { while (l < r) { if (s[l] !== s[r]) return false; l++; r--; } return true; };
    let l = 0, r = s.length - 1;
    while (l < r) {
        if (s[l] !== s[r]) return isPal(l + 1, r) || isPal(l, r - 1);
        l++; r--;
    }
    return true;
};`,
  },
  {
    t: "Count and Say", d: "M", topic: "strings", sub: "Run-length encoding", pat: [], tags: ["String", "Simulation"], co: ["meta", "amazon"],
    desc: "The count-and-say sequence starts with \"1\". Each next term describes the previous term by reading off runs of identical digits: \"1\" → \"11\" (one 1) → \"21\" (two 1s) → \"1211\". Given `n`, return the `n`-th term.",
    cons: ["1 <= n <= 30"],
    hints: ["Generate terms iteratively using run-length encoding."],
    exp: "Starting from \"1\", convert each term into the next by walking runs of equal digits and appending count + digit.",
    steps: ["cur = '1'.", "Repeat n - 1 times: build the run-length encoding of cur."],
    tc: "O(total length)", sc: "O(length of term)",
    fn: ["countAndSay", [["n", "int"]], "string"],
    tests: [[[1], "1"], [[4], "1211"], [[5], "111221"], [[6], "312211"]],
    js: `
var countAndSay = function(n) {
    let cur = "1";
    for (let k = 1; k < n; k++) {
        let next = "", i = 0;
        while (i < cur.length) {
            let j = i;
            while (j < cur.length && cur[j] === cur[i]) j++;
            next += String(j - i) + cur[i];
            i = j;
        }
        cur = next;
    }
    return cur;
};`,
  },
  {
    t: "Integer to Roman", d: "M", topic: "strings", sub: "Greedy construction", pat: ["greedy"], tags: ["String", "Math"], co: ["amazon", "microsoft", "adobe"],
    desc: "Given an integer `num` between 1 and 3999, convert it to a Roman numeral.",
    cons: ["1 <= num <= 3999"],
    hints: ["Include the subtractive pairs (CM, CD, XC, XL, IX, IV) in your table of symbols."],
    exp: "Greedily take the largest symbol that fits, appending it and subtracting its value, using a table that already contains the six subtractive pairs.",
    steps: ["List values from 1000 down to 1, including 900, 400, 90, 40, 9, 4.", "While num >= value, append symbol and subtract."],
    tc: "O(1)", sc: "O(1)",
    fn: ["intToRoman", [["num", "int"]], "string"],
    tests: [[[3749], "MMMDCCXLIX"], [[58], "LVIII"], [[1994], "MCMXCIV"], [[4], "IV"]],
    js: `
var intToRoman = function(num) {
    const table = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    let res = "";
    for (const [v, s] of table) while (num >= v) { res += s; num -= v; }
    return res;
};`,
  },
  {
    t: "Zigzag Conversion", d: "M", topic: "strings", sub: "Simulation", pat: [], tags: ["String", "Simulation"], co: ["amazon", "adobe"],
    desc: "The string `s` is written in a zigzag pattern on `numRows` rows (down the rows, then diagonally back up) and then read line by line. Return the string read row by row.",
    cons: ["1 <= s.length <= 1000", "1 <= numRows <= 1000"],
    hints: ["Keep one string builder per row and a direction that flips at the top and bottom rows."],
    exp: "Simulate the pen moving between rows: append each character to its current row, bouncing direction at row 0 and the last row, then concatenate the rows.",
    steps: ["If numRows == 1 return s.", "Append chars to rows[r]; flip direction at the edges.", "Join rows."],
    tc: "O(n)", sc: "O(n)",
    fn: ["convert", [["s", "string"], ["numRows", "int"]], "string"],
    tests: [[["PAYPALISHIRING", 3], "PAHNAPLSIIGYIR"], [["PAYPALISHIRING", 4], "PINALSIGYAHRPI"], [["A", 1], "A"]],
    js: `
var convert = function(s, numRows) {
    if (numRows === 1) return s;
    const rows = new Array(Math.min(numRows, s.length)).fill("");
    let r = 0, dir = 1;
    for (const c of s) {
        rows[r] += c;
        if (r === 0) dir = 1;
        else if (r === numRows - 1) dir = -1;
        r += dir;
    }
    return rows.join("");
};`,
  },
];
