---
title: 算法手撕高频专题：笔试面试必会的 8 类模板题
published: 2026-08-28
description: 游戏客户端笔试面试的手撕代码专项：链表反转/环形链表、二叉树遍历/LCA、快排归并、二分变体、LRU、TopK、滑动窗口、双指针。每类给出代码模板、复杂度分析、易错点与面试追问，专为"看得懂但写不出"的同学准备。
image: api
tags: [算法, 手撕代码, 链表, 二叉树, 排序, 二分, 滑动窗口, 面试, 游戏客户端]
category: 算法
draft: false
---

> 这是求职路线图「阶段一/四：算法」的系统产出，也是面试题库 al-* 类别的展开。调研库洛面经发现：**手撕算法是"凉经"最常见的挂点**——笔试靠它筛人，技术面也会现场手写。本文整理游戏客户端笔试面试最高频的 8 类模板题，每类给完整代码 + 模板 + 易错点。

---

## 〇、手撕代码的准备方法

1. **先背模板**：每种题型记住核心骨架（下面每节都有）
2. **手写练习**：在白纸/记事本上默写，不看答案
3. **讲出思路**：面试要边说边写——先讲复杂度再动手
4. **边界条件**：空输入、单元素、首尾元素——写前先想

> **面试习惯**：开始写之前说「我用双指针，时间 O(n)、空间 O(1)」，写完说「我检查一下边界：空链表、单节点」。这个习惯比代码本身更让面试官加分。

---

## 一、链表反转（迭代 + 递归）

**难度**：简单 · 出现率 ★★★★★

```cpp
// 迭代版：三指针
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* next = curr->next;   // 先保存后继
        curr->next = prev;             // 反转指向
        prev = curr;                   // 移动 prev
        curr = next;                   // 移动 curr
    }
    return prev;   // 新头
}

// 递归版
ListNode* reverseListRec(ListNode* head) {
    if (!head || !head->next) return head;   // 空/单节点
    ListNode* newHead = reverseListRec(head->next);
    head->next->next = head;   // 反转指向
    head->next = nullptr;
    return newHead;
}
```

**模板要点**：迭代三指针 `prev/curr/next`，先存后继再反转。**易错点**：忘记保存 next；返回 prev 而非 head。

**面试追问**：反转区间 [left, right]（LeetCode 92）、K 个一组反转（25）。

---

## 二、环形链表（快慢指针）

**难度**：中等 · 出现率 ★★★★☆

```cpp
// 判断是否有环
bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;          // 慢指针走 1 步
        fast = fast->next->next;    // 快指针走 2 步
        if (slow == fast) return true;   // 相遇即有环
    }
    return false;
}

// 找环入口（进阶）
ListNode* detectCycle(ListNode* head) {
    ListNode* slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) break;   // 第一次相遇
    }
    if (!fast || !fast->next) return nullptr;   // 无环
    slow = head;                   // 慢指针回到头
    while (slow != fast) {         // 再走，相遇点即环入口
        slow = slow->next;
        fast = fast->next;
    }
    return slow;
}
```

**模板要点**：快慢指针，快走 2 慢走 1；**环入口定理**：第一次相遇后，慢指针回头部，两指针同速再走，相遇点即入口。**易错点**：while 条件要判 `fast && fast->next` 防空指针。

---

## 三、二叉树遍历（迭代版必会）

**难度**：中等 · 出现率 ★★★★☆

```cpp
struct TreeNode {
    int val;
    TreeNode* left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// 前序迭代：栈，先右后左入栈
vector<int> preorder(TreeNode* root) {
    vector<int> res;
    stack<TreeNode*> st;
    if (root) st.push(root);
    while (!st.empty()) {
        TreeNode* node = st.top(); st.pop();
        res.push_back(node->val);
        if (node->right) st.push(node->right);   // 先右
        if (node->left) st.push(node->left);     // 后左 → 左先出
    }
    return res;
}

// 中序迭代：一路向左入栈
vector<int> inorder(TreeNode* root) {
    vector<int> res;
    stack<TreeNode*> st;
    TreeNode* cur = root;
    while (cur || !st.empty()) {
        while (cur) { st.push(cur); cur = cur->left; }   // 走到最左
        cur = st.top(); st.pop();
        res.push_back(cur->val);
        cur = cur->right;   // 转向右子树
    }
    return res;
}

// 层序：队列
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> res;
    queue<TreeNode*> q;
    if (root) q.push(root);
    while (!q.empty()) {
        int size = q.size();
        vector<int> level;
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        res.push_back(level);
    }
    return res;
}
```

**模板要点**：前序用栈（右先左后入栈）；中序用"走到最左 + 出栈 + 转右"；层序用队列按层计数。**易错点**：递归版大家都会，面试一定要能写迭代版。

**面试追问**：最近公共祖先 LCA（递归 + 状态返回）、二叉树深度。

---

## 四、快速排序与归并排序

**难度**：中等 · 出现率 ★★★★★（笔试手写最高频）

```cpp
// 快排：分治，平均 O(n log n)，最坏 O(n²)
int partition(vector<int>& nums, int l, int r) {
    int pivot = nums[r];          // 选最右为基准
    int i = l - 1;
    for (int j = l; j < r; j++) {
        if (nums[j] <= pivot) {
            i++;
            swap(nums[i], nums[j]);
        }
    }
    swap(nums[i + 1], nums[r]);
    return i + 1;
}

void quickSort(vector<int>& nums, int l, int r) {
    if (l >= r) return;
    int p = partition(nums, l, r);
    quickSort(nums, l, p - 1);
    quickSort(nums, p + 1, r);
}

// 归并：稳定，O(n log n)，需要 O(n) 额外空间
void merge(vector<int>& nums, int l, int m, int r) {
    vector<int> tmp(r - l + 1);
    int i = l, j = m + 1, k = 0;
    while (i <= m && j <= r)
        tmp[k++] = nums[i] <= nums[j] ? nums[i++] : nums[j++];
    while (i <= m) tmp[k++] = nums[i++];
    while (j <= r) tmp[k++] = nums[j++];
    for (int t = 0; t < tmp.size(); t++) nums[l + t] = tmp[t];
}

void mergeSort(vector<int>& nums, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(nums, l, m);
    mergeSort(nums, m + 1, r);
    merge(nums, l, m, r);
}
```

**面试必答**：

| | 快排 | 归并 |
|---|---|---|
| 稳定性 | 不稳定 | 稳定 |
| 空间 | O(log n)（递归栈） | O(n) |
| 最坏 | O(n²)（有序数组+固定 pivot） | O(n log n) |
| 优化 | 随机 pivot / 三数取中 | — |

**易错点**：快排 partition 的边界（`i` 从 `l-1` 开始）；归并的中间点用 `l + (r-l)/2` 防溢出。

---

## 五、二分查找及其变体

**难度**：中等 · 出现率 ★★★★☆

```cpp
// 标准二分（左闭右闭）
int binarySearch(vector<int>& nums, int target) {
    int l = 0, r = nums.size() - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;   // 防溢出
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}

// 变体：找第一个 >= target 的位置（lower_bound）
int lowerBound(vector<int>& nums, int target) {
    int l = 0, r = nums.size();      // 左闭右开
    while (l < r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] < target) l = mid + 1;
        else r = mid;
    }
    return l;
}
```

**模板要点**：**背一种写法并统一**。左闭右闭 `while(l<=r)` + `l=mid+1/r=mid-1`；左闭右开 `while(l<r)` + `l=mid+1/r=mid`。**易错点**：mid 计算防溢出（`l+(r-l)/2`）、边界条件的 while 符号。

**面试追问**：旋转排序数组找目标（33）、找峰值（162）。

---

## 六、LRU 缓存（双向链表 + 哈希表）

**难度**：中等 · 出现率 ★★★★☆（设计题之王）

```cpp
class LRUCache {
    int cap;
    list<pair<int,int>> lru;                    // 双向链表：头部最新
    unordered_map<int, list<pair<int,int>>::iterator> mp;   // key → 节点

public:
    LRUCache(int capacity) : cap(capacity) {}

    int get(int key) {
        if (!mp.count(key)) return -1;
        auto it = mp[key];
        lru.splice(lru.begin(), lru, it);       // 移到头部（O(1)）
        return it->second;
    }

    void put(int key, int value) {
        if (mp.count(key)) {
            auto it = mp[key];
            it->second = value;
            lru.splice(lru.begin(), lru, it);   // 移到头部
            return;
        }
        if (lru.size() == cap) {                // 满了删尾部
            mp.erase(lru.back().first);
            lru.pop_back();
        }
        lru.push_front({key, value});
        mp[key] = lru.begin();
    }
};
```

**模板要点**：`list`（双向链表，O(1) 头尾操作）+ `unordered_map`（O(1) 定位）。`splice` 把节点移到头部。**易错点**：满时先删 mp 再删链表；迭代器失效。

**为什么不用单向链表**：删除尾部节点需要前驱指针，双向链表才能 O(1)。

---

## 七、TopK 问题（堆 / 快速选择）

**难度**：中等 · 出现率 ★★★★☆

```cpp
// 堆方案：找第 K 大 → 维护大小为 K 的小顶堆
// O(n log K)
int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    for (int x : nums) {
        minHeap.push(x);
        if (minHeap.size() > k) minHeap.pop();   // 只保留 K 个最大的
    }
    return minHeap.top();
}

// 快速选择：基于快排 partition，只递归一侧
// 平均 O(n)，最坏 O(n²)
int quickSelect(vector<int>& nums, int l, int r, int k) {
    if (l == r) return nums[l];
    int p = partition(nums, l, r);   // 复用快排 partition
    if (p == k) return nums[p];
    else if (p < k) return quickSelect(nums, p + 1, r, k);
    else return quickSelect(nums, l, p - 1, k);
}
// 调用：findKthLargest(nums, k) → quickSelect(nums, 0, n-1, n-k)
```

**模板要点**：TopK 最大用小顶堆（堆顶是第 K 大），TopK 最小用大顶堆。**易错点**：方向搞反——找第 K 大维护的是小顶堆。

**面试追问**：海量数据（内存放不下）→ 分治 + 哈希分桶；流式数据 → 堆。

---

## 八、滑动窗口与双指针

**难度**：中等 · 出现率 ★★★★☆（笔试编程题高频）

```cpp
// 模板：最长无重复子串（LeetCode 3）
int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> window;   // 字符 → 出现次数
    int l = 0, ans = 0;
    for (int r = 0; r < s.size(); r++) {
        window[s[r]]++;
        while (window[s[r]] > 1) {     // 出现重复 → 收缩左边界
            window[s[l]]--;
            l++;
        }
        ans = max(ans, r - l + 1);
    }
    return ans;
}

// 模板：两数之和（有序数组，双指针）
vector<int> twoSumSorted(vector<int>& nums, int target) {
    int l = 0, r = nums.size() - 1;
    while (l < r) {
        int sum = nums[l] + nums[r];
        if (sum == target) return {l, r};
        else if (sum < target) l++;
        else r--;
    }
    return {};
}
```

**模板要点**：滑动窗口 = 右指针扩展 + 满足条件后左指针收缩 + 更新答案。**易错点**：收缩循环用 while 而非 if（可能有多个重复）；窗口内数据更新要对称（加/减都要）。

**面试追问**：滑动窗口最大值（单调队列）、三数之和（排序+双指针）。

---

## 九、总结：面试 Checklist

- [ ] 链表反转：迭代三指针能默写吗？
- [ ] 环形链表：快慢指针 + 环入口定理？
- [ ] 二叉树前/中/层序迭代版能写吗？
- [ ] 快排/归并：稳定性、空间、最坏复杂度？
- [ ] 二分：左闭右闭 vs 左闭右开统一写法？
- [ ] LRU：为什么用双向链表 + 哈希？
- [ ] TopK：堆方向别搞反？
- [ ] 滑动窗口：收缩用 while？更新对称？
- [ ] 写前先讲复杂度？写完检查边界？

**最后建议**：把上面 8 类模板各默写 3 遍（每次间隔一天），然后去 LeetCode 找对应题号刷 2-3 题巩固。手撕题没有捷径——**肌肉记忆 + 边界意识**。

---

## 参考资源

- [LeetCode 热题 100（经典题单）](https://leetcode.cn/studyplan/top-100-liked/)
- [代码随想录（模板化刷题方法论）](https://programmercarl.com/)
- [labuladong 算法笔记（滑动窗口/双指针模板）](https://labuladong.github.io/algo/)
- [OI Wiki（算法基础）](https://oi-wiki.org/)
