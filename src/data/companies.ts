import type { Company, InterviewQuestion } from "@/types";

const iq = (company: string, n: number, type: InterviewQuestion["type"], question: string, answerOutline: string, problemSlug?: string): InterviewQuestion => ({
  id: `${company}-q${n}`, company, type, question, answerOutline, problemSlug,
});

export const companies: Company[] = [
  {
    slug: "google", name: "Google", color: "#4285F4",
    description: "Google's loop leans on graphs, dynamic programming and clean reasoning about complexity. Interviewers expect you to discuss trade-offs and test your own code.",
    process: ["Recruiter screen", "1–2 technical phone screens (45 min, shared doc)", "Onsite: 4–5 rounds of coding and Googleyness", "Hiring committee review"],
    focusTopics: [{ topic: "dynamic-programming", weight: 22 }, { topic: "bfs", weight: 15 }, { topic: "dfs", weight: 14 }, { topic: "arrays", weight: 13 }, { topic: "binary-search", weight: 12 }, { topic: "strings", weight: 10 }, { topic: "heaps", weight: 8 }, { topic: "tries", weight: 6 }],
    questions: [
      iq("google", 1, "Coding", "Given a list of words in a sorted alien dictionary, derive the alphabet order.", "Compare adjacent words to extract edges, run Kahn's algorithm, handle the invalid-prefix case and cycles.", "alien-dictionary"),
      iq("google", 2, "Coding", "Find the minimum eating speed so all piles are finished within h hours.", "Binary search the speed between 1 and max(piles); feasibility is monotonic.", "koko-eating-bananas"),
      iq("google", 3, "Conceptual", "When would you choose BFS over Dijkstra, and when is 0-1 BFS appropriate?", "BFS for unit weights, Dijkstra for non-negative weights, 0-1 BFS with a deque when weights are only 0 or 1."),
      iq("google", 4, "Design", "Design an autocomplete service for a search box.", "Trie or prefix index with top-k suggestions per node, ranking by frequency, caching hot prefixes, sharding by prefix."),
      iq("google", 5, "Behavioral", "Tell me about a time you simplified a complex system.", "STAR format: the complexity, the measurable impact, how you brought others along."),
    ],
  },
  {
    slug: "amazon", name: "Amazon", color: "#FF9900",
    description: "Amazon mixes practical coding (arrays, trees, graphs) with heavy emphasis on the Leadership Principles. Expect at least one behavioural question in every round.",
    process: ["Online assessment (2 coding problems + work style survey)", "Phone screen", "Onsite loop: 4–5 rounds incl. a Bar Raiser", "Debrief against Leadership Principles"],
    focusTopics: [{ topic: "arrays", weight: 20 }, { topic: "binary-trees", weight: 14 }, { topic: "bfs", weight: 12 }, { topic: "hashing", weight: 12 }, { topic: "heaps", weight: 10 }, { topic: "dynamic-programming", weight: 12 }, { topic: "sliding-window", weight: 10 }, { topic: "linked-list", weight: 10 }],
    questions: [
      iq("amazon", 1, "Coding", "Return the minutes until all oranges rot, or -1.", "Multi-source BFS from all rotten oranges, count fresh ones, count levels.", "rotting-oranges"),
      iq("amazon", 2, "Coding", "Find the k closest points to the origin.", "Max-heap of size k on squared distance, or quickselect for O(n) average.", "k-closest-points-to-origin"),
      iq("amazon", 3, "Coding", "Merge k sorted linked lists.", "Min-heap of list heads, or pairwise divide-and-conquer merging.", "merge-k-sorted-lists"),
      iq("amazon", 4, "Behavioral", "Describe a time you disagreed with your manager (Have Backbone; Disagree and Commit).", "Data you brought, how you raised it, the decision, and how you committed afterwards."),
      iq("amazon", 5, "Design", "Design a system that tracks the top 10 best-selling products in real time.", "Stream counts per product, a heap or count-min sketch for heavy hitters, windowed aggregation, cache results."),
    ],
  },
  {
    slug: "microsoft", name: "Microsoft", color: "#00A4EF",
    description: "Microsoft interviews favour linked lists, trees, strings and matrix problems, with an emphasis on correctness and edge cases.",
    process: ["Recruiter call", "Online or phone technical screen", "Onsite: 4 rounds including an 'As Appropriate' interview", "Team match"],
    focusTopics: [{ topic: "arrays", weight: 16 }, { topic: "linked-list", weight: 15 }, { topic: "strings", weight: 15 }, { topic: "binary-trees", weight: 14 }, { topic: "dynamic-programming", weight: 12 }, { topic: "stack", weight: 10 }, { topic: "sorting", weight: 9 }, { topic: "backtracking", weight: 9 }],
    questions: [
      iq("microsoft", 1, "Coding", "Return a matrix's elements in spiral order.", "Four shrinking boundaries; guard the bottom and left passes for single rows/columns.", "spiral-matrix"),
      iq("microsoft", 2, "Coding", "Reverse a linked list in groups of k.", "Check k nodes exist, reverse the group, reconnect with the previous group's tail.", "reverse-nodes-in-k-group"),
      iq("microsoft", 3, "Conceptual", "Explain the difference between a stack overflow and a heap allocation failure.", "Call stack depth vs dynamic memory exhaustion; recursion depth limits vs large allocations."),
      iq("microsoft", 4, "Coding", "Implement a circular queue.", "Fixed array with head and size; modulo arithmetic for wrap-around.", "design-circular-queue"),
      iq("microsoft", 5, "Behavioral", "Tell me about a bug you shipped and what you learned.", "Ownership, root cause analysis, the process change you made."),
    ],
  },
  {
    slug: "meta", name: "Meta", color: "#0866FF",
    description: "Meta's coding rounds are fast-paced: usually two medium problems in 45 minutes. Speed with arrays, strings, trees and graphs matters as much as optimality.",
    process: ["Recruiter screen", "Technical screen (2 problems, 45 min)", "Onsite: 2 coding, 1 system design, 1 behavioural", "Team matching"],
    focusTopics: [{ topic: "arrays", weight: 18 }, { topic: "strings", weight: 15 }, { topic: "binary-trees", weight: 14 }, { topic: "bfs", weight: 12 }, { topic: "hashing", weight: 12 }, { topic: "two-pointers", weight: 11 }, { topic: "prefix-sum", weight: 9 }, { topic: "heaps", weight: 9 }],
    questions: [
      iq("meta", 1, "Coding", "Return the values visible from the right side of a binary tree.", "BFS taking the last node per level, or DFS visiting right first and recording the first node at each depth.", "binary-tree-right-side-view"),
      iq("meta", 2, "Coding", "Count subarrays whose sum equals k.", "Prefix sums with a hash map of counts; seed with {0: 1}.", "subarray-sum-equals-k"),
      iq("meta", 3, "Coding", "Can the string become a palindrome after deleting at most one character?", "Two pointers; on mismatch check both skip options.", "valid-palindrome-ii"),
      iq("meta", 4, "Design", "Design a news feed ranking pipeline.", "Candidate generation, feature store, ranking model, fan-out on write vs read, caching."),
      iq("meta", 5, "Behavioral", "Describe a project where you moved fast and what trade-offs you made.", "Scope decisions, risks accepted, how you mitigated them."),
    ],
  },
  {
    slug: "apple", name: "Apple", color: "#A2AAAD",
    description: "Apple teams interview differently by group, but most include practical data structure questions, bit manipulation and design discussion tied to the team's domain.",
    process: ["Recruiter call", "Hiring manager screen", "Technical phone screen", "Onsite: 5–8 conversations with the team"],
    focusTopics: [{ topic: "arrays", weight: 17 }, { topic: "strings", weight: 14 }, { topic: "linked-list", weight: 13 }, { topic: "binary-trees", weight: 13 }, { topic: "bit-manipulation", weight: 11 }, { topic: "dynamic-programming", weight: 12 }, { topic: "hashing", weight: 10 }, { topic: "tries", weight: 10 }],
    questions: [
      iq("apple", 1, "Coding", "Reverse the bits of a 32-bit unsigned integer.", "Shift result left and append n & 1 thirty-two times; return as unsigned.", "reverse-bits"),
      iq("apple", 2, "Coding", "Implement a trie with insert, search and startsWith.", "Nested maps or 26-child arrays with an end flag.", "implement-trie-prefix-tree"),
      iq("apple", 3, "Conceptual", "How does a hash map handle collisions?", "Chaining vs open addressing, load factor, resizing, worst-case behaviour."),
      iq("apple", 4, "Design", "Design an LRU cache for image thumbnails on device.", "Hash map + doubly linked list, memory budget, eviction policy, thread safety."),
      iq("apple", 5, "Behavioral", "Tell me about a product detail you cared about that others overlooked.", "The detail, why it mattered to users, how you advocated for it."),
    ],
  },
  {
    slug: "adobe", name: "Adobe", color: "#FA0F00",
    description: "Adobe interviews in India and the US focus on arrays, strings, linked lists and DP, often with follow-ups on optimising space.",
    process: ["Online test (aptitude + coding)", "2–3 technical rounds", "Director / hiring manager round", "HR round"],
    focusTopics: [{ topic: "arrays", weight: 20 }, { topic: "strings", weight: 15 }, { topic: "dynamic-programming", weight: 15 }, { topic: "linked-list", weight: 12 }, { topic: "binary-trees", weight: 12 }, { topic: "sorting", weight: 9 }, { topic: "stack", weight: 9 }, { topic: "basic-math", weight: 8 }],
    questions: [
      iq("adobe", 1, "Coding", "Find the contiguous subarray with the largest sum.", "Kadane's algorithm; discuss the all-negative case.", "maximum-subarray"),
      iq("adobe", 2, "Coding", "Sort an array of 0s, 1s and 2s in one pass.", "Dutch national flag with low, mid, high pointers.", "sort-colors"),
      iq("adobe", 3, "Coding", "Find the longest palindromic substring.", "Expand around 2n - 1 centres; mention Manacher for O(n).", "longest-palindromic-substring"),
      iq("adobe", 4, "Conceptual", "Explain virtual functions and how dynamic dispatch works in C++.", "vtable per class, vptr per object, cost of indirection."),
      iq("adobe", 5, "Behavioral", "Why Adobe, and which product would you improve?", "Specific product knowledge, a concrete improvement, user empathy."),
    ],
  },
  {
    slug: "flipkart", name: "Flipkart", color: "#2874F0",
    description: "Flipkart's machine coding and problem-solving rounds emphasise DP, graphs and greedy problems at medium-to-hard difficulty, plus low-level design.",
    process: ["Online coding assessment", "Problem-solving / DSA round", "Machine coding round (90 min)", "Hiring manager round"],
    focusTopics: [{ topic: "dynamic-programming", weight: 20 }, { topic: "arrays", weight: 16 }, { topic: "greedy", weight: 13 }, { topic: "bfs", weight: 12 }, { topic: "binary-search", weight: 12 }, { topic: "heaps", weight: 10 }, { topic: "stack", weight: 9 }, { topic: "fenwick-tree", weight: 8 }],
    questions: [
      iq("flipkart", 1, "Coding", "Find the cheapest flight price with at most k stops.", "Bellman-Ford with k + 1 rounds from copies, or BFS with pruning by stops.", "cheapest-flights-within-k-stops"),
      iq("flipkart", 2, "Coding", "Find the minimum number of jumps to reach the end.", "Greedy BFS over reachable windows.", "jump-game-ii"),
      iq("flipkart", 3, "Coding", "Count inversions in an array.", "Merge sort counting or a Fenwick tree over ranks.", "count-inversions"),
      iq("flipkart", 4, "Design", "Machine coding: build an in-memory parking lot with slot allocation.", "Entities, strategy for slot selection, concurrency, extensibility, tests."),
      iq("flipkart", 5, "Behavioral", "Describe a time you handled a production incident under pressure.", "Detection, mitigation, communication, post-mortem."),
    ],
  },
  {
    slug: "atlassian", name: "Atlassian", color: "#0052CC",
    description: "Atlassian values readable, well-structured code. Coding rounds often grow a simple problem into a richer one, followed by design and values interviews.",
    process: ["Recruiter screen", "Coding round (practical problem, extended in stages)", "System design", "Values and management interviews"],
    focusTopics: [{ topic: "arrays", weight: 17 }, { topic: "hashing", weight: 15 }, { topic: "strings", weight: 14 }, { topic: "stack", weight: 12 }, { topic: "topological-sort", weight: 11 }, { topic: "sliding-window", weight: 11 }, { topic: "heaps", weight: 10 }, { topic: "binary-trees", weight: 10 }],
    questions: [
      iq("atlassian", 1, "Coding", "Merge overlapping meeting intervals.", "Sort by start and sweep; extend the last merged interval when overlapping.", "merge-intervals"),
      iq("atlassian", 2, "Coding", "Validate a string of brackets.", "Stack of openers; match each closer against the top.", "valid-parentheses"),
      iq("atlassian", 3, "Coding", "Given task dependencies, decide whether all tasks can complete.", "Kahn's algorithm; cycle means impossible.", "course-schedule"),
      iq("atlassian", 4, "Design", "Design a rate limiter for a public REST API.", "Token bucket vs sliding window log, distributed counters, headers for clients."),
      iq("atlassian", 5, "Behavioral", "Tell me about a time you were open with a teammate about a difficult issue (Open Company, No Bullshit).", "Situation, what you said, outcome, relationship afterwards."),
    ],
  },
];

export const companiesBySlug: Record<string, Company> = Object.fromEntries(companies.map((c) => [c.slug, c]));
