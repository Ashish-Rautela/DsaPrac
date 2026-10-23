// Parser and merger for user provided Visa OA LeetCode questions
const fs = require('fs');
const path = require('path');

const csvBlock1 = `Difficulty,Title,Frequency,Acceptance Rate,Link,Topics
HARD,Text Justification,100.0,0.00524533758074244,https://leetcode.com/problems/text-justification,"Array, String, Simulation"
HARD,Length of Longest V-Shaped Diagonal Segment,98.0,0.005587725588621967,https://leetcode.com/problems/length-of-longest-v-shaped-diagonal-segment,"Array, Dynamic Programming, Memoization, Matrix"
MEDIUM,Longest Substring Without Repeating Characters,95.7,0.004001913168512742,https://leetcode.com/problems/longest-substring-without-repeating-characters,"Hash Table, String, Sliding Window"
EASY,Two Sum,94.5,0.005803622308911278,https://leetcode.com/problems/two-sum,"Array, Hash Table"
MEDIUM,Rotating the Box,94.5,0.008247366067811563,https://leetcode.com/problems/rotating-the-box,"Array, Two Pointers, Matrix"
MEDIUM,Minimum Operations to Write the Letter Y on a Grid,91.9,0.006407234000461606,https://leetcode.com/problems/minimum-operations-to-write-the-letter-y-on-a-grid,"Array, Hash Table, Matrix, Counting"
MEDIUM,3Sum,90.5,0.004007312932178484,https://leetcode.com/problems/3sum,"Array, Two Pointers, Sorting"
MEDIUM,LRU Cache,89.1,0.004825722825290219,https://leetcode.com/problems/lru-cache,"Hash Table, Linked List, Design, Doubly-Linked List"
MEDIUM,Find the Length of the Longest Common Prefix,87.5,0.006232793561692155,https://leetcode.com/problems/find-the-length-of-the-longest-common-prefix,"Array, Hash Table, String, Trie"
EASY,Split the Array,85.8,0.006188068208742038,https://leetcode.com/problems/split-the-array,"Array, Hash Table, Counting"
EASY,Best Time to Buy and Sell Stock,84.0,0.005752124029839985,https://leetcode.com/problems/best-time-to-buy-and-sell-stock,"Array, Dynamic Programming"
MEDIUM,Merge Intervals,84.0,0.0053025648312917985,https://leetcode.com/problems/merge-intervals,"Array, Sorting, Quicksort"
HARD,Block Placement Queries,79.9,0.004097031700798273,https://leetcode.com/problems/block-placement-queries,"Array, Binary Search, Binary Indexed Tree, Segment Tree, Ordered Set"
MEDIUM,Number of Black Blocks,79.9,0.004099050735381835,https://leetcode.com/problems/number-of-black-blocks,"Array, Hash Table, Enumeration"
MEDIUM,Group Anagrams,77.5,0.007344438860866744,https://leetcode.com/problems/group-anagrams,"Array, Hash Table, String, Sorting"
EASY,Create Target Array in the Given Order,77.5,0.008667022915812794,https://leetcode.com/problems/create-target-array-in-the-given-order,"Array, Simulation"
MEDIUM,Number of Adjacent Elements With the Same Color,77.5,0.006007614991207266,https://leetcode.com/problems/number-of-adjacent-elements-with-the-same-color,Array
HARD,Trapping Rain Water,75.0,0.0068422555189191535,https://leetcode.com/problems/trapping-rain-water,"Array, Two Pointers, Dynamic Programming, Stack, Monotonic Stack"
MEDIUM,Simplify Path,75.0,0.00516868674314678,https://leetcode.com/problems/simplify-path,"String, Stack"
MEDIUM,Longest Palindromic Substring,72.1,0.0038866757720046586,https://leetcode.com/problems/longest-palindromic-substring,"Two Pointers, String, Dynamic Programming, Manacher"
EASY,Valid Parentheses,72.1,0.004534117415370311,https://leetcode.com/problems/valid-parentheses,"String, Stack, Bracket Sequences"
EASY,Divisor Game,72.1,0.007278277484394171,https://leetcode.com/problems/divisor-game,"Math, Dynamic Programming, Brainteaser, Game Theory, Impartial Game"
MEDIUM,Count Nodes With the Highest Score,72.1,0.0053082110179184135,https://leetcode.com/problems/count-nodes-with-the-highest-score,"Array, Tree, Depth-First Search, Binary Tree, DP on Trees"
EASY,Two Furthest Houses With Different Colors,72.1,0.007162970697684508,https://leetcode.com/problems/two-furthest-houses-with-different-colors,"Array, Greedy"
HARD,Earliest Possible Day of Full Bloom,72.1,0.007112995129611748,https://leetcode.com/problems/earliest-possible-day-of-full-bloom,"Array, Greedy, Sorting"
MEDIUM,Match Alphanumerical Pattern in Matrix I,72.1,0.006459627329192546,https://leetcode.com/problems/match-alphanumerical-pattern-in-matrix-i,"Array, Hash Table, String, Matrix"
MEDIUM,Maximum Number of Events That Can Be Attended,72.1,0.003914849616051443,https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended,"Array, Greedy, Sorting, Heap (Priority Queue)"
EASY,Odd String Difference,72.1,0.006236947579369265,https://leetcode.com/problems/odd-string-difference,"Array, Hash Table, String"
MEDIUM,Number of Islands,72.1,0.006531446094380534,https://leetcode.com/problems/number-of-islands,"Array, Depth-First Search, Breadth-First Search, Union-Find, Matrix"
HARD,Largest Rectangle in Histogram,72.1,0.005106156360578037,https://leetcode.com/problems/largest-rectangle-in-histogram,"Array, Stack, Monotonic Stack, Range Minimum/Maximum Query"
MEDIUM,Number of Divisible Triplet Sums,72.1,0.006760607582224454,https://leetcode.com/problems/number-of-divisible-triplet-sums,"Array, Hash Table"
HARD,Maximum Sum of Alternating Subsequence With Distance at Least K,72.1,0.0031079877893665734,https://leetcode.com/problems/maximum-sum-of-alternating-subsequence-with-distance-at-least-k,"Array, Dynamic Programming, Segment Tree"
MEDIUM,Maximum Subarray,68.8,0.00539935960170864,https://leetcode.com/problems/maximum-subarray,"Array, Divide and Conquer, Dynamic Programming"
MEDIUM,Minimum Absolute Difference Between Elements With Constraint,65.0,0.0037557167706079504,https://leetcode.com/problems/minimum-absolute-difference-between-elements-with-constraint,"Array, Binary Search, Ordered Set"
MEDIUM,Beautiful Arrangement,65.0,0.006500476970937324,https://leetcode.com/problems/beautiful-arrangement,"Array, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask"
MEDIUM,Exclusive Time of Functions,65.0,0.0066286737307372735,https://leetcode.com/problems/exclusive-time-of-functions,"Array, Stack"
MEDIUM,Spiral Matrix,60.6,0.005814592762393077,https://leetcode.com/problems/spiral-matrix,"Array, Matrix, Simulation"
MEDIUM,Minimum Time Difference,60.6,0.0062764512961918486,https://leetcode.com/problems/minimum-time-difference,"Array, Math, String, Sorting"
EASY,Reverse Linked List,60.6,0.00811609901650509,https://leetcode.com/problems/reverse-linked-list,"Linked List, Recursion"
HARD,Longest Valid Parentheses,60.6,0.004136907959177225,https://leetcode.com/problems/longest-valid-parentheses,"String, Dynamic Programming, Stack, Bracket Sequences"
MEDIUM,Grid Teleportation Traversal,60.6,0.002413287660320242,https://leetcode.com/problems/grid-teleportation-traversal,"Array, Hash Table, Breadth-First Search, Matrix"
MEDIUM,Subarray Sum Equals K,60.6,0.004835081459239531,https://leetcode.com/problems/subarray-sum-equals-k,"Array, Hash Table, Prefix Sum"
MEDIUM,Rotate Image,60.6,0.008083482348106776,https://leetcode.com/problems/rotate-image,"Array, Math, Matrix"
MEDIUM,Number of Perfect Pairs,60.6,0.0034693733401141434,https://leetcode.com/problems/number-of-perfect-pairs,"Array, Math, Two Pointers, Sorting"
MEDIUM,Divide Players Into Teams of Equal Skill,60.6,0.006889964857989562,https://leetcode.com/problems/divide-players-into-teams-of-equal-skill,"Array, Hash Table, Two Pointers, Sorting"
HARD,Count Palindromic Subsequences,60.6,0.004216031836270609,https://leetcode.com/problems/count-palindromic-subsequences,"String, Dynamic Programming"
MEDIUM,Top K Frequent Elements,55.2,0.006757427099969737,https://leetcode.com/problems/top-k-frequent-elements,"Array, Hash Table, Divide and Conquer, Sorting, Heap (Priority Queue), Bucket Sort, Counting, Quickselect"
EASY,Merge Two Sorted Lists,55.2,0.006901788792707732,https://leetcode.com/problems/merge-two-sorted-lists,"Linked List, Recursion"
MEDIUM,Sort Colors,55.2,0.007029502241457977,https://leetcode.com/problems/sort-colors,"Array, Two Pointers, Sorting, Quicksort, Bubble Sort"
MEDIUM,Matrix Block Sum,55.2,0.007714084887128863,https://leetcode.com/problems/matrix-block-sum,"Array, Matrix, Prefix Sum"
MEDIUM,Gas Station,55.2,0.00488887332723141,https://leetcode.com/problems/gas-station,"Array, Greedy"
HARD,Minimum Cost Path with Teleportations,55.2,0.004499712939103035,https://leetcode.com/problems/minimum-cost-path-with-teleportations,"Array, Dynamic Programming, Matrix"
MEDIUM,Maximum OR,55.2,0.0043163511880789365,https://leetcode.com/problems/maximum-or,"Array, Greedy, Bit Manipulation, Prefix Sum"
MEDIUM,Minimum Number of Swaps to Make the String Balanced,55.2,0.007811478727324349,https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced,"Two Pointers, String, Stack, Greedy, Bracket Sequences"
MEDIUM,Minimum Cost to Move Between Indices,55.2,0.004930644225188624,https://leetcode.com/problems/minimum-cost-to-move-between-indices,"Array, Greedy, Prefix Sum"
EASY,Longest Common Prefix,48.2,0.004853662441250515,https://leetcode.com/problems/longest-common-prefix,"Array, String, Trie"
MEDIUM,Walls and Gates,48.2,0.006424436050153536,https://leetcode.com/problems/walls-and-gates,"Array, Breadth-First Search, Matrix"
MEDIUM,Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit,48.2,0.0058152531455910065,https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit,"Array, Queue, Sliding Window, Heap (Priority Queue), Ordered Set, Monotonic Queue"
HARD,Word Ladder,48.2,0.004677986038849575,https://leetcode.com/problems/word-ladder,"Hash Table, String, Breadth-First Search, Bidirectional Search"
MEDIUM,Restore IP Addresses,48.2,0.005736171163508679,https://leetcode.com/problems/restore-ip-addresses,"String, Backtracking"
MEDIUM,Container With Most Water,48.2,0.006103881997278695,https://leetcode.com/problems/container-with-most-water,"Array, Two Pointers, Greedy"
MEDIUM,Number of Matching Subsequences,48.2,0.005055066604706061,https://leetcode.com/problems/number-of-matching-subsequences,"Array, Hash Table, String, Binary Search, Dynamic Programming, Trie, Sorting"
EASY,Balanced Binary Tree,48.2,0.005939479771825136,https://leetcode.com/problems/balanced-binary-tree,"Tree, Depth-First Search, Binary Tree"
HARD,Find Median from Data Stream,48.2,0.005512005325213046,https://leetcode.com/problems/find-median-from-data-stream,"Two Pointers, Design, Sorting, Heap (Priority Queue), Data Stream"
EASY,Happy Number,48.2,0.006042661170976193,https://leetcode.com/problems/happy-number,"Hash Table, Math, Two Pointers, Floyd's Cycle Finding Algorithm"
EASY,Add Strings,48.2,0.005226780590060729,https://leetcode.com/problems/add-strings,"Math, String, Simulation"
MEDIUM,Design Memory Allocator,48.2,0.00510366503208994,https://leetcode.com/problems/design-memory-allocator,"Array, Hash Table, Design, Simulation"
EASY,Number of Changing Keys,48.2,0.008071000312888467,https://leetcode.com/problems/number-of-changing-keys,String
MEDIUM,Best Time to Buy and Sell Stock using Strategy,48.2,0.005938619634736009,https://leetcode.com/problems/best-time-to-buy-and-sell-stock-using-strategy,"Array, Sliding Window, Prefix Sum"
MEDIUM,Sell Diminishing-Valued Colored Balls,48.2,0.0030454709177399923,https://leetcode.com/problems/sell-diminishing-valued-colored-balls,"Array, Math, Binary Search, Greedy, Sorting, Heap (Priority Queue)"
MEDIUM,Hand of Straights,48.2,0.005846811017822949,https://leetcode.com/problems/hand-of-straights,"Array, Hash Table, Greedy, Sorting"
MEDIUM,Palindrome Partitioning,48.2,0.007480986300468137,https://leetcode.com/problems/palindrome-partitioning,"String, Dynamic Programming, Backtracking"
MEDIUM,Count Ways To Build Good Strings,48.2,0.005878960636150449,https://leetcode.com/problems/count-ways-to-build-good-strings,Dynamic Programming
HARD,Minimize Malware Spread II,48.2,0.0046305710061254664,https://leetcode.com/problems/minimize-malware-spread-ii,"Array, Hash Table, Depth-First Search, Breadth-First Search, Union-Find, Graph Theory"
HARD,Minimize Malware Spread,48.2,0.004354806557800992,https://leetcode.com/problems/minimize-malware-spread,"Array, Hash Table, Depth-First Search, Breadth-First Search, Union-Find, Graph Theory"
EASY,Plus One,38.6,0.005076999933832628,https://leetcode.com/problems/plus-one,"Array, Math"
EASY,Image Smoother,38.6,0.006997763831782442,https://leetcode.com/problems/image-smoother,"Array, Matrix"
EASY,Valid Anagram,38.6,0.006876761115836623,https://leetcode.com/problems/valid-anagram,"Hash Table, String, Sorting"
HARD,Best Time to Buy and Sell Stock III,38.6,0.005496297664936471,https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii,"Array, Dynamic Programming"
MEDIUM,Find Peak Element,38.6,0.004726738434319998,https://leetcode.com/problems/find-peak-element,"Array, Binary Search"
HARD,Sliding Window Maximum,38.6,0.004936743580253868,https://leetcode.com/problems/sliding-window-maximum,"Array, Queue, Sliding Window, Heap (Priority Queue), Monotonic Queue, Range Minimum/Maximum Query"
MEDIUM,Candy Crush,38.6,0.0077582419350945096,https://leetcode.com/problems/candy-crush,"Array, Two Pointers, Matrix, Simulation"
MEDIUM,Partition Equal Subset Sum,38.6,0.00500968585954677,https://leetcode.com/problems/partition-equal-subset-sum,"Array, Dynamic Programming, Knapsack Problem, 0-1 Knapsack"
EASY,Substrings of Size Three with Distinct Characters,38.6,0.007726609574233126,https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters,"Hash Table, String, Sliding Window, Counting"
MEDIUM,Number of Subarrays That Match a Pattern I,38.6,0.006814021145249414,https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-i,"Array, Rolling Hash, String Matching, Hash Function"
MEDIUM,Edit Distance,38.6,0.006145645987478657,https://leetcode.com/problems/edit-distance,"String, Dynamic Programming"
MEDIUM,Brightest Position on Street,38.6,0.006066923558278168,https://leetcode.com/problems/brightest-position-on-street,"Array, Sorting, Prefix Sum, Ordered Set"
EASY,Contains Duplicate,38.6,0.006479969925061093,https://leetcode.com/problems/contains-duplicate,"Array, Hash Table, Sorting"
MEDIUM,Sum Root to Leaf Numbers,38.6,0.007049694889734956,https://leetcode.com/problems/sum-root-to-leaf-numbers,"Tree, Depth-First Search, Binary Tree"
HARD,LFU Cache,38.6,0.005051298260124657,https://leetcode.com/problems/lfu-cache,"Hash Table, Linked List, Design, Doubly-Linked List"
MEDIUM,Longest Increasing Subsequence,38.6,0.006009849100357148,https://leetcode.com/problems/longest-increasing-subsequence,"Array, Binary Search, Dynamic Programming, Longest Increasing Subsequence"
MEDIUM,Sort Characters By Frequency,38.6,0.007589009936179747,https://leetcode.com/problems/sort-characters-by-frequency,"Hash Table, String, Sorting, Heap (Priority Queue), Bucket Sort, Counting"
MEDIUM,Best Time to Buy and Sell Stock II,38.6,0.007176548537234189,https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii,"Array, Dynamic Programming, Greedy"
MEDIUM,Product of Array Except Self,38.6,0.006937997644098914,https://leetcode.com/problems/product-of-array-except-self,"Array, Prefix Sum"
EASY,Check if Array Is Sorted and Rotated,38.6,0.005781119909115533,https://leetcode.com/problems/check-if-array-is-sorted-and-rotated,Array
MEDIUM,Kth Largest Element in an Array,38.6,0.0069417407625481185,https://leetcode.com/problems/kth-largest-element-in-an-array,"Array, Divide and Conquer, Sorting, Heap (Priority Queue), Quickselect"
EASY,Reverse Vowels of a String,38.6,0.006261267216966836,https://leetcode.com/problems/reverse-vowels-of-a-string,"Two Pointers, String"
EASY,Valid Palindrome II,38.6,0.004491378326989291,https://leetcode.com/problems/valid-palindrome-ii,"Two Pointers, String, Greedy"
MEDIUM,Ugly Number II,38.6,0.004986939248088983,https://leetcode.com/problems/ugly-number-ii,"Hash Table, Math, Dynamic Programming, Heap (Priority Queue)"
MEDIUM,Unique Paths,38.6,0.006736982781760037,https://leetcode.com/problems/unique-paths,"Math, Dynamic Programming, Combinatorics"
MEDIUM,Restore the Array From Adjacent Pairs,38.6,0.007519800411848565,https://leetcode.com/problems/restore-the-array-from-adjacent-pairs,"Array, Hash Table, Depth-First Search"
MEDIUM,Letter Combinations of a Phone Number,38.6,0.006703752908400718,https://leetcode.com/problems/letter-combinations-of-a-phone-number,"Hash Table, String, Backtracking"
HARD,Reconstruct Itinerary,38.6,0.00451424329518969,https://leetcode.com/problems/reconstruct-itinerary,"Array, String, Depth-First Search, Graph Theory, Sorting, Heap (Priority Queue), Eulerian Circuit, Eulerian Path, Semi-Eulerian Graph"
EASY,Add Binary,38.6,0.005880362727200201,https://leetcode.com/problems/add-binary,"Math, String, Bit Manipulation, Simulation"
EASY,Last Stone Weight,38.6,0.006684676057431623,https://leetcode.com/problems/last-stone-weight,"Array, Heap (Priority Queue)"
MEDIUM,Count Mentions Per User,38.6,0.005059025442400909,https://leetcode.com/problems/count-mentions-per-user,"Array, Math, Sorting, Simulation"
HARD,Maximal Rectangle,38.6,0.006008945139648856,https://leetcode.com/problems/maximal-rectangle,"Array, Dynamic Programming, Stack, Matrix, Monotonic Stack"
EASY,Add Digits,38.6,0.006936166335992227,https://leetcode.com/problems/add-digits,"Math, Simulation, Number Theory"
HARD,Candy,38.6,0.004941951655854013,https://leetcode.com/problems/candy,"Array, Greedy"
EASY,Alternating Digit Sum,38.6,0.006974729367740285,https://leetcode.com/problems/alternating-digit-sum,Math
MEDIUM,Next Greater Element II,38.6,0.006933402844927012,https://leetcode.com/problems/next-greater-element-ii,"Array, Stack, Monotonic Stack"
MEDIUM,Word Search,38.6,0.004831305354330426,https://leetcode.com/problems/word-search,"Array, String, Backtracking, Depth-First Search, Matrix"
EASY,Merge Sorted Array,38.6,0.005590676308414726,https://leetcode.com/problems/merge-sorted-array,"Array, Two Pointers, Sorting"
EASY,Valid Palindrome,38.6,0.005452924144923419,https://leetcode.com/problems/valid-palindrome,"Two Pointers, String"
EASY,First Unique Character in a String,38.6,0.006654133469797843,https://leetcode.com/problems/first-unique-character-in-a-string,"Hash Table, String, Queue, Counting"
MEDIUM,Count Good Numbers,38.6,0.0058222729736982885,https://leetcode.com/problems/count-good-numbers,"Math, Recursion"
MEDIUM,Non-overlapping Intervals,38.6,0.005789033558071696,https://leetcode.com/problems/non-overlapping-intervals,"Array, Dynamic Programming, Greedy, Sorting"
MEDIUM,Maximal Score After Applying K Operations,38.6,0.006424646438526507,https://leetcode.com/problems/maximal-score-after-applying-k-operations,"Array, Greedy, Heap (Priority Queue)"
EASY,Flood Fill,38.6,0.006904095730316484,https://leetcode.com/problems/flood-fill,"Array, Depth-First Search, Breadth-First Search, Matrix"
MEDIUM,Meeting Rooms II,38.6,0.0052845025342410645,https://leetcode.com/problems/meeting-rooms-ii,"Array, Two Pointers, Greedy, Sorting, Heap (Priority Queue), Prefix Sum"
MEDIUM,Word Break,38.6,0.005002421308462843,https://leetcode.com/problems/word-break,"Array, Hash Table, String, Dynamic Programming, Trie, Memoization, Brute-Force Search"
HARD,Word Break II,38.6,0.005638990982253106,https://leetcode.com/problems/word-break-ii,"Array, Hash Table, String, Dynamic Programming, Backtracking, Trie, Memoization"
MEDIUM,Maximum Palindromes After Operations,38.6,0.004751480317086812,https://leetcode.com/problems/maximum-palindromes-after-operations,"Array, Hash Table, String, Greedy, Sorting, Counting"
MEDIUM,Jump Game VI,38.6,0.004664612780363944,https://leetcode.com/problems/jump-game-vi,"Array, Dynamic Programming, Queue, Heap (Priority Queue), Monotonic Queue"
MEDIUM,Path With Minimum Effort,38.6,0.006418618224264974,https://leetcode.com/problems/path-with-minimum-effort,"Array, Binary Search, Depth-First Search, Breadth-First Search, Union-Find, Heap (Priority Queue), Matrix, Dijkstra's Algorithm"
MEDIUM,Capacity To Ship Packages Within D Days,38.6,0.0074817924197012635,https://leetcode.com/problems/capacity-to-ship-packages-within-d-days,"Array, Binary Search"
MEDIUM,Minimum Suffix Flips,38.6,0.007400386520366243,https://leetcode.com/problems/minimum-suffix-flips,"String, Greedy"
MEDIUM,Longest Common Subsequence,38.6,0.005966797731631741,https://leetcode.com/problems/longest-common-subsequence,"String, Dynamic Programming, Longest Common Subsequence"
MEDIUM,Minimize Maximum of Array,38.6,0.004662871335606378,https://leetcode.com/problems/minimize-maximum-of-array,"Array, Binary Search, Dynamic Programming, Greedy, Prefix Sum"
MEDIUM,Binary Tree Level Order Traversal,38.6,0.0073655251794703044,https://leetcode.com/problems/binary-tree-level-order-traversal,"Tree, Breadth-First Search, Binary Tree"
HARD,Word Search II,38.6,0.0039031239842126893,https://leetcode.com/problems/word-search-ii,"Array, String, Backtracking, Trie, Matrix"
MEDIUM,Kth Largest Sum in a Binary Tree,38.6,0.00589235855305924,https://leetcode.com/problems/kth-largest-sum-in-a-binary-tree,"Tree, Breadth-First Search, Sorting, Binary Tree"
MEDIUM,Longest Non-decreasing Subarray From Two Arrays,38.6,0.003169559261030634,https://leetcode.com/problems/longest-non-decreasing-subarray-from-two-arrays,"Array, Dynamic Programming"
MEDIUM,Search in Rotated Sorted Array,38.6,0.004579983309321303,https://leetcode.com/problems/search-in-rotated-sorted-array,"Array, Binary Search"
MEDIUM,Unique Length-3 Palindromic Subsequences,38.6,0.007375495136319772,https://leetcode.com/problems/unique-length-3-palindromic-subsequences,"Hash Table, String, Bit Manipulation, Prefix Sum"
HARD,Best Time to Buy and Sell Stock IV,38.6,0.005157275450572116,https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv,"Array, Dynamic Programming"
MEDIUM,Jump Game,38.6,0.004166922431437539,https://leetcode.com/problems/jump-game,"Array, Dynamic Programming, Greedy"
MEDIUM,String Compression,38.6,0.006096653063718315,https://leetcode.com/problems/string-compression,"Two Pointers, String"
EASY,Distribute Elements Into Two Arrays I,38.6,0.00837088478814224,https://leetcode.com/problems/distribute-elements-into-two-arrays-i,"Array, Two Pointers, Simulation"
MEDIUM,Count the Number of Good Subarrays,38.6,0.006576765085915954,https://leetcode.com/problems/count-the-number-of-good-subarrays,"Array, Hash Table, Sliding Window"
MEDIUM,Using a Robot to Print the Lexicographically Smallest String,38.6,0.0062238787865421304,https://leetcode.com/problems/using-a-robot-to-print-the-lexicographically-smallest-string,"Hash Table, String, Stack, Greedy"
MEDIUM,Max Consecutive Ones III,38.6,0.006860489539277908,https://leetcode.com/problems/max-consecutive-ones-iii,"Array, Binary Search, Sliding Window, Prefix Sum"
EASY,Lexicographically Smallest Palindrome,38.6,0.008194820255121762,https://leetcode.com/problems/lexicographically-smallest-palindrome,"Two Pointers, String, Greedy"
HARD,First Missing Positive,38.6,0.004397277393285868,https://leetcode.com/problems/first-missing-positive,"Array, Hash Table"
MEDIUM,Asteroid Collision,38.6,0.004932937660708313,https://leetcode.com/problems/asteroid-collision,"Array, Stack, Simulation"
MEDIUM,4Sum,38.6,0.004194282566466615,https://leetcode.com/problems/4sum,"Array, Two Pointers, Sorting"
MEDIUM,Permutations,38.6,0.008243487193524981,https://leetcode.com/problems/permutations,"Array, Backtracking"
MEDIUM,Course Schedule II,38.6,0.005644355072448565,https://leetcode.com/problems/course-schedule-ii,"Depth-First Search, Breadth-First Search, Graph Theory, Topological Sort"
HARD,Longest Increasing Path in a Matrix,38.6,0.005718818434353904,https://leetcode.com/problems/longest-increasing-path-in-a-matrix,"Array, Dynamic Programming, Depth-First Search, Breadth-First Search, Graph Theory, Topological Sort, Memoization, Matrix, Directed Acyclic Graph"
MEDIUM,Next Permutation,38.6,0.004639580440319954,https://leetcode.com/problems/next-permutation,"Array, Two Pointers"`;

const csvBlock2 = `ID,URL,Title,Difficulty,Acceptance %,Frequency %
1,https://leetcode.com/problems/two-sum,Two Sum,Easy,57.8%,100.0%
3,https://leetcode.com/problems/longest-substring-without-repeating-characters,Longest Substring Without Repeating Characters,Medium,39.4%,100.0%
5,https://leetcode.com/problems/longest-palindromic-substring,Longest Palindromic Substring,Medium,38.2%,75.0%
14,https://leetcode.com/problems/longest-common-prefix,Longest Common Prefix,Easy,47.9%,62.5%
15,https://leetcode.com/problems/3sum,3Sum,Medium,39.4%,87.5%
20,https://leetcode.com/problems/valid-parentheses,Valid Parentheses,Easy,44.5%,75.0%
42,https://leetcode.com/problems/trapping-rain-water,Trapping Rain Water,Hard,67.7%,75.0%
49,https://leetcode.com/problems/group-anagrams,Group Anagrams,Medium,72.9%,75.0%
53,https://leetcode.com/problems/maximum-subarray,Maximum Subarray,Medium,53.5%,75.0%
1025,https://leetcode.com/problems/divisor-game,Divisor Game,Easy,72.1%,75.0%
66,https://leetcode.com/problems/plus-one,Plus One,Easy,50.2%,37.5%
68,https://leetcode.com/problems/text-justification,Text Justification,Hard,51.5%,100.0%
121,https://leetcode.com/problems/best-time-to-buy-and-sell-stock,Best Time to Buy and Sell Stock,Easy,57.0%,87.5%
2049,https://leetcode.com/problems/count-nodes-with-the-highest-score,Count Nodes With the Highest Score,Medium,52.9%,75.0%
2078,https://leetcode.com/problems/two-furthest-houses-with-different-colors,Two Furthest Houses With Different Colors,Easy,71.7%,75.0%
151,https://leetcode.com/problems/reverse-words-in-a-string,Reverse Words in a String,Medium,57.0%,37.5%
2136,https://leetcode.com/problems/earliest-possible-day-of-full-bloom,Earliest Possible Day of Full Bloom,Hard,71.2%,75.0%
3046,https://leetcode.com/problems/split-the-array,Split the Array,Easy,61.6%,100.0%
3078,https://leetcode.com/problems/match-alphanumerical-pattern-in-matrix-i,Match Alphanumerical Pattern in Matrix I,Medium,65.3%,75.0%
1353,https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended,Maximum Number of Events That Can Be Attended,Medium,39.0%,75.0%
1389,https://leetcode.com/problems/create-target-array-in-the-given-order,Create Target Array in the Given Order,Easy,86.5%,87.5%
2451,https://leetcode.com/problems/odd-string-difference,Odd String Difference,Easy,62.1%,75.0%
739,https://leetcode.com/problems/daily-temperatures,Daily Temperatures,Medium,68.9%,37.5%
286,https://leetcode.com/problems/walls-and-gates,Walls and Gates,Medium,64.1%,62.5%
207,https://leetcode.com/problems/course-schedule,Course Schedule,Medium,51.8%,50.0%
2593,https://leetcode.com/problems/find-score-of-an-array-after-marking-all-elements,Find Score of an Array After Marking All Elements,Medium,64.5%,37.5%
25,https://leetcode.com/problems/reverse-nodes-in-k-group,Reverse Nodes in k-Group,Hard,66.6%,37.5%
1497,https://leetcode.com/problems/check-if-array-pairs-are-divisible-by-k,Check If Array Pairs Are Divisible by k,Medium,46.2%,50.0%
54,https://leetcode.com/problems/spiral-matrix,Spiral Matrix,Medium,57.2%,62.5%
543,https://leetcode.com/problems/diameter-of-binary-tree,Diameter of Binary Tree,Easy,65.8%,50.0%
661,https://leetcode.com/problems/image-smoother,Image Smoother,Easy,69.4%,50.0%
1861,https://leetcode.com/problems/rotating-the-box,Rotating the Box,Medium,82.5%,100.0%
146,https://leetcode.com/problems/lru-cache,LRU Cache,Medium,47.6%,87.5%
3043,https://leetcode.com/problems/find-the-length-of-the-longest-common-prefix,Find the Length of the Longest Common Prefix,Medium,62.3%,87.5%
3161,https://leetcode.com/problems/block-placement-queries,Block Placement Queries,Hard,41.4%,75.0%
200,https://leetcode.com/problems/number-of-islands,Number of Islands,Medium,64.7%,75.0%
1438,https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit,Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit,Medium,57.8%,50.0%
189,https://leetcode.com/problems/rotate-array,Rotate Array,Medium,45.2%,37.5%
347,https://leetcode.com/problems/top-k-frequent-elements,Top K Frequent Elements,Medium,66.8%,50.0%
127,https://leetcode.com/problems/word-ladder,Word Ladder,Hard,46.0%,50.0%
242,https://leetcode.com/problems/valid-anagram,Valid Anagram,Easy,68.3%,37.5%
123,https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii,Best Time to Buy and Sell Stock III,Hard,54.2%,37.5%
93,https://leetcode.com/problems/restore-ip-addresses,Restore IP Addresses,Medium,56.4%,50.0%
3459,https://leetcode.com/problems/length-of-longest-v-shaped-diagonal-segment,Length of Longest V-Shaped Diagonal Segment,Hard,56.2%,100.0%
539,https://leetcode.com/problems/minimum-time-difference,Minimum Time Difference,Medium,62.6%,62.5%
162,https://leetcode.com/problems/find-peak-element,Find Peak Element,Medium,47.1%,37.5%
11,https://leetcode.com/problems/container-with-most-water,Container With Most Water,Medium,60.4%,50.0%
239,https://leetcode.com/problems/sliding-window-maximum,Sliding Window Maximum,Hard,49.0%,37.5%
723,https://leetcode.com/problems/candy-crush,Candy Crush,Medium,77.6%,50.0%
71,https://leetcode.com/problems/simplify-path,Simplify Path,Medium,50.9%,75.0%
416,https://leetcode.com/problems/partition-equal-subset-sum,Partition Equal Subset Sum,Medium,49.7%,37.5%
2672,https://leetcode.com/problems/number-of-adjacent-elements-with-the-same-color,Number of Adjacent Elements With the Same Color,Medium,59.9%,75.0%
3071,https://leetcode.com/problems/minimum-operations-to-write-the-letter-y-on-a-grid,Minimum Operations to Write the Letter Y on a Grid,Medium,64.7%,87.5%
206,https://leetcode.com/problems/reverse-linked-list,Reverse Linked List,Easy,80.8%,62.5%
2768,https://leetcode.com/problems/number-of-black-blocks,Number of Black Blocks,Medium,42.0%,75.0%
1876,https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters,Substrings of Size Three with Distinct Characters,Easy,76.9%,37.5%
56,https://leetcode.com/problems/merge-intervals,Merge Intervals,Medium,52.3%,75.0%
21,https://leetcode.com/problems/merge-two-sorted-lists,Merge Two Sorted Lists,Easy,68.5%,50.0%
3034,https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-i,Number of Subarrays That Match a Pattern I,Medium,68.8%,37.5%
213,https://leetcode.com/problems/house-robber-ii,House Robber II,Medium,45.2%,37.5%
792,https://leetcode.com/problems/number-of-matching-subsequences,Number of Matching Subsequences,Medium,50.6%,50.0%
72,https://leetcode.com/problems/edit-distance,Edit Distance,Medium,60.9%,37.5%
2021,https://leetcode.com/problems/brightest-position-on-street,Brightest Position on Street,Medium,60.7%,37.5%
217,https://leetcode.com/problems/contains-duplicate,Contains Duplicate,Easy,64.5%,37.5%
129,https://leetcode.com/problems/sum-root-to-leaf-numbers,Sum Root to Leaf Numbers,Medium,70.1%,37.5%
460,https://leetcode.com/problems/lfu-cache,LFU Cache,Hard,49.7%,37.5%
300,https://leetcode.com/problems/longest-increasing-subsequence,Longest Increasing Subsequence,Medium,59.7%,37.5%
110,https://leetcode.com/problems/balanced-binary-tree,Balanced Binary Tree,Easy,58.7%,50.0%
295,https://leetcode.com/problems/find-median-from-data-stream,Find Median from Data Stream,Hard,54.7%,50.0%
451,https://leetcode.com/problems/sort-characters-by-frequency,Sort Characters By Frequency,Medium,75.5%,37.5%
32,https://leetcode.com/problems/longest-valid-parentheses,Longest Valid Parentheses,Hard,39.1%,50.0%
122,https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii,Best Time to Buy and Sell Stock II,Medium,71.3%,50.0%
75,https://leetcode.com/problems/sort-colors,Sort Colors,Medium,70.0%,50.0%
2817,https://leetcode.com/problems/minimum-absolute-difference-between-elements-with-constraint,Minimum Absolute Difference Between Elements With Constraint,Medium,37.9%,62.5%
238,https://leetcode.com/problems/product-of-array-except-self,Product of Array Except Self,Medium,69.1%,50.0%
1752,https://leetcode.com/problems/check-if-array-is-sorted-and-rotated,Check if Array Is Sorted and Rotated,Easy,57.5%,37.5%
84,https://leetcode.com/problems/largest-rectangle-in-histogram,Largest Rectangle in Histogram,Hard,50.3%,75.0%
202,https://leetcode.com/problems/happy-number,Happy Number,Easy,59.9%,50.0%
215,https://leetcode.com/problems/kth-largest-element-in-an-array,Kth Largest Element in an Array,Medium,69.1%,37.5%
345,https://leetcode.com/problems/reverse-vowels-of-a-string,Reverse Vowels of a String,Easy,61.7%,37.5%
680,https://leetcode.com/problems/valid-palindrome-ii,Valid Palindrome II,Easy,44.5%,37.5%
167,https://leetcode.com/problems/two-sum-ii-input-array-is-sorted,Two Sum II - Input Array Is Sorted,Medium,65.4%,37.5%
264,https://leetcode.com/problems/ugly-number-ii,Ugly Number II,Medium,49.7%,37.5%
62,https://leetcode.com/problems/unique-paths,Unique Paths,Medium,67.0%,37.5%
3552,https://leetcode.com/problems/grid-teleportation-traversal,Grid Teleportation Traversal,Medium,23.9%,62.5%
1743,https://leetcode.com/problems/restore-the-array-from-adjacent-pairs,Restore the Array From Adjacent Pairs,Medium,75.1%,37.5%
1314,https://leetcode.com/problems/matrix-block-sum,Matrix Block Sum,Medium,76.7%,50.0%
134,https://leetcode.com/problems/gas-station,Gas Station,Medium,48.3%,50.0%
17,https://leetcode.com/problems/letter-combinations-of-a-phone-number,Letter Combinations of a Phone Number,Medium,66.4%,37.5%
560,https://leetcode.com/problems/subarray-sum-equals-k,Subarray Sum Equals K,Medium,47.7%,62.5%
332,https://leetcode.com/problems/reconstruct-itinerary,Reconstruct Itinerary,Hard,44.7%,37.5%
67,https://leetcode.com/problems/add-binary,Add Binary,Easy,58.3%,50.0%
415,https://leetcode.com/problems/add-strings,Add Strings,Easy,52.2%,50.0%
2502,https://leetcode.com/problems/design-memory-allocator,Design Memory Allocator,Medium,50.4%,37.5%
48,https://leetcode.com/problems/rotate-image,Rotate Image,Medium,80.4%,62.5%
1046,https://leetcode.com/problems/last-stone-weight,Last Stone Weight,Easy,66.6%,37.5%
3433,https://leetcode.com/problems/count-mentions-per-user,Count Mentions Per User,Medium,50.8%,37.5%
3019,https://leetcode.com/problems/number-of-changing-keys,Number of Changing Keys,Easy,80.8%,50.0%
3652,https://leetcode.com/problems/best-time-to-buy-and-sell-stock-using-strategy,Best Time to Buy and Sell Stock using Strategy,Medium,59.7%,50.0%
85,https://leetcode.com/problems/maximal-rectangle,Maximal Rectangle,Hard,59.2%,37.5%
258,https://leetcode.com/problems/add-digits,Add Digits,Easy,69.1%,37.5%
135,https://leetcode.com/problems/candy,Candy,Hard,48.8%,37.5%
2544,https://leetcode.com/problems/alternating-digit-sum,Alternating Digit Sum,Easy,69.2%,37.5%
503,https://leetcode.com/problems/next-greater-element-ii,Next Greater Element II,Medium,68.7%,37.5%
79,https://leetcode.com/problems/word-search,Word Search,Medium,47.7%,37.5%
88,https://leetcode.com/problems/merge-sorted-array,Merge Sorted Array,Easy,55.2%,37.5%
994,https://leetcode.com/problems/rotting-oranges,Rotting Oranges,Medium,59.0%,37.5%
974,https://leetcode.com/problems/subarray-sums-divisible-by-k,Subarray Sums Divisible by K,Medium,56.5%,37.5%
128,https://leetcode.com/problems/longest-consecutive-sequence,Longest Consecutive Sequence,Medium,47.2%,37.5%
3651,https://leetcode.com/problems/minimum-cost-path-with-teleportations,Minimum Cost Path with Teleportations,Hard,45.4%,50.0%
125,https://leetcode.com/problems/valid-palindrome,Valid Palindrome,Easy,53.7%,37.5%
387,https://leetcode.com/problems/first-unique-character-in-a-string,First Unique Character in a String,Easy,65.8%,37.5%
2964,https://leetcode.com/problems/number-of-divisible-triplet-sums,Number of Divisible Triplet Sums,Medium,67.6%,75.0%
3649,https://leetcode.com/problems/number-of-perfect-pairs,Number of Perfect Pairs,Medium,34.4%,50.0%
1648,https://leetcode.com/problems/sell-diminishing-valued-colored-balls,Sell Diminishing-Valued Colored Balls,Medium,30.3%,50.0%
2491,https://leetcode.com/problems/divide-players-into-teams-of-equal-skill,Divide Players Into Teams of Equal Skill,Medium,68.9%,62.5%
1922,https://leetcode.com/problems/count-good-numbers,Count Good Numbers,Medium,57.9%,37.5%
846,https://leetcode.com/problems/hand-of-straights,Hand of Straights,Medium,58.2%,37.5%
435,https://leetcode.com/problems/non-overlapping-intervals,Non-overlapping Intervals,Medium,57.4%,37.5%
131,https://leetcode.com/problems/palindrome-partitioning,Palindrome Partitioning,Medium,74.3%,50.0%
2530,https://leetcode.com/problems/maximal-score-after-applying-k-operations,Maximal Score After Applying K Operations,Medium,64.1%,37.5%
733,https://leetcode.com/problems/flood-fill,Flood Fill,Easy,68.6%,37.5%
253,https://leetcode.com/problems/meeting-rooms-ii,Meeting Rooms II,Medium,52.7%,37.5%
139,https://leetcode.com/problems/word-break,Word Break,Medium,49.6%,37.5%
140,https://leetcode.com/problems/word-break-ii,Word Break II,Hard,55.8%,37.5%
3035,https://leetcode.com/problems/maximum-palindromes-after-operations,Maximum Palindromes After Operations,Medium,47.2%,37.5%
2680,https://leetcode.com/problems/maximum-or,Maximum OR,Medium,43.4%,50.0%
1696,https://leetcode.com/problems/jump-game-vi,Jump Game VI,Medium,46.5%,37.5%
1631,https://leetcode.com/problems/path-with-minimum-effort,Path With Minimum Effort,Medium,63.6%,37.5%
526,https://leetcode.com/problems/beautiful-arrangement,Beautiful Arrangement,Medium,64.9%,62.5%
2484,https://leetcode.com/problems/count-palindromic-subsequences,Count Palindromic Subsequences,Hard,41.5%,62.5%
1963,https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced,Minimum Number of Swaps to Make the String Balanced,Medium,78.0%,50.0%
636,https://leetcode.com/problems/exclusive-time-of-functions,Exclusive Time of Functions,Medium,66.3%,62.5%
1011,https://leetcode.com/problems/capacity-to-ship-packages-within-d-days,Capacity To Ship Packages Within D Days,Medium,74.3%,37.5%
1529,https://leetcode.com/problems/minimum-suffix-flips,Minimum Suffix Flips,Medium,74.0%,37.5%
3915,https://leetcode.com/problems/maximum-sum-of-alternating-subsequence-with-distance-at-least-k,Maximum Sum of Alternating Subsequence With Distance at Least K,Hard,32.2%,75.0%
1143,https://leetcode.com/problems/longest-common-subsequence,Longest Common Subsequence,Medium,59.3%,37.5%
2439,https://leetcode.com/problems/minimize-maximum-of-array,Minimize Maximum of Array,Medium,46.6%,37.5%
102,https://leetcode.com/problems/binary-tree-level-order-traversal,Binary Tree Level Order Traversal,Medium,73.0%,37.5%
212,https://leetcode.com/problems/word-search-ii,Word Search II,Hard,38.6%,37.5%
2583,https://leetcode.com/problems/kth-largest-sum-in-a-binary-tree,Kth Largest Sum in a Binary Tree,Medium,59.0%,37.5%
2771,https://leetcode.com/problems/longest-non-decreasing-subarray-from-two-arrays,Longest Non-decreasing Subarray From Two Arrays,Medium,31.3%,37.5%
33,https://leetcode.com/problems/search-in-rotated-sorted-array,Search in Rotated Sorted Array,Medium,45.2%,37.5%
2466,https://leetcode.com/problems/count-ways-to-build-good-strings,Count Ways To Build Good Strings,Medium,58.9%,50.0%
1930,https://leetcode.com/problems/unique-length-3-palindromic-subsequences,Unique Length-3 Palindromic Subsequences,Medium,73.8%,37.5%`;

function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

function normalizeDifficulty(diff) {
  if (!diff) return 'Medium';
  const lower = diff.toLowerCase();
  if (lower.startsWith('easy')) return 'Easy';
  if (lower.startsWith('hard')) return 'Hard';
  return 'Medium';
}

function extractSlug(url) {
  if (!url) return '';
  const match = url.match(/\/problems\/([^/]+)/);
  return match ? match[1] : '';
}

function runMerge() {
  const questionMap = new Map();

  // Process Block 1: Difficulty,Title,Frequency,Acceptance Rate,Link,Topics
  const lines1 = csvBlock1.trim().split('\n');
  for (let i = 1; i < lines1.length; i++) {
    const row = parseCSVLine(lines1[i]);
    if (row.length < 5) continue;
    const [difficulty, title, freqStr, accRateStr, link, topicsStr] = row;
    const slug = extractSlug(link) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const topics = topicsStr
      ? topicsStr.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Algorithms'];

    const freq = parseFloat(freqStr) || 50;

    questionMap.set(slug, {
      questionId: `visa-${slug}`,
      slug,
      title: title.trim(),
      difficulty: normalizeDifficulty(difficulty),
      leetcodeUrl: link.trim(),
      topics,
      frequency: freq,
      frequencyPercent: `${freq.toFixed(1)}%`,
      acceptanceRate: accRateStr,
      source: 'csv1',
    });
  }

  // Process Block 2: ID,URL,Title,Difficulty,Acceptance %,Frequency %
  const lines2 = csvBlock2.trim().split('\n');
  for (let i = 1; i < lines2.length; i++) {
    const row = parseCSVLine(lines2[i]);
    if (row.length < 4) continue;
    const [id, url, title, difficulty, accPercent, freqPercent] = row;
    const slug = extractSlug(url) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (questionMap.has(slug)) {
      const existing = questionMap.get(slug);
      existing.leetcodeId = id;
      if (accPercent) existing.acceptancePercent = accPercent;
      if (freqPercent) existing.frequencyPercent = freqPercent;
    } else {
      questionMap.set(slug, {
        questionId: `visa-${slug}`,
        slug,
        leetcodeId: id,
        title: title.trim(),
        difficulty: normalizeDifficulty(difficulty),
        leetcodeUrl: url.trim(),
        topics: ['Algorithms'],
        frequency: parseFloat(freqPercent) || 40,
        frequencyPercent: freqPercent || '40.0%',
        acceptancePercent: accPercent || '50.0%',
        source: 'csv2',
      });
    }
  }

  const allQuestions = Array.from(questionMap.values());

  // Sort primarily by frequency descending
  allQuestions.sort((a, b) => (b.frequency || 0) - (a.frequency || 0));

  // Starter free questions (high frequency foundational/interview staples)
  // Exactly 3 free questions
  const freeSlugs = new Set([
    'two-sum',
    'longest-substring-without-repeating-characters',
    'valid-parentheses',
  ]);

  const finalQuestions = allQuestions.map((q) => {
    const isFree = freeSlugs.has(q.slug);
    const acceptance = q.acceptancePercent || '45-65%';

    const description = `Visa Online Assessment recurring problem pattern. Frequently appears in Visa SWE Intern & New Grad technical screenings. Tests core mastery of ${q.topics.join(', ')} with strict time/space complexity bounds.

Algorithmic Breakdown & Key Takeaways:
- Primary Data Structure: ${q.topics[0] || 'Arrays/Hash Maps'}
- Common Invariants: Identify monotonic properties, prefix state caching, or boundary constraints.
- Optimized Complexity Target: Aim for O(N) or O(N log N) optimal runtime to avoid TLE on hidden edge cases.
- LeetCode Reference: ${q.leetcodeUrl}`;

    return {
      questionId: q.questionId,
      company: 'VISA',
      title: q.title,
      difficulty: q.difficulty,
      topics: q.topics,
      leetcodeUrl: q.leetcodeUrl,
      leetcodeId: q.leetcodeId || null,
      frequency: q.frequency,
      frequencyPercent: q.frequencyPercent,
      acceptancePercent: q.acceptancePercent || null,
      description,
      isPremium: !isFree,
    };
  });

  console.log(`Merged total of ${finalQuestions.length} unique Visa OA questions.`);
  const freeCount = finalQuestions.filter((q) => !q.isPremium).length;
  const premiumCount = finalQuestions.filter((q) => q.isPremium).length;
  console.log(`Free starter questions: ${freeCount}, Premium questions: ${premiumCount}`);

  // Write to questionsData.json
  const outPath = path.resolve(__dirname, 'questionsData.json');
  fs.writeFileSync(outPath, JSON.stringify(finalQuestions, null, 2), 'utf-8');
  console.log(`Successfully generated: ${outPath}`);
}

runMerge();
