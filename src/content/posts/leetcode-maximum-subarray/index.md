---
title: 力扣「最大子数组和」× 游戏客户端：DPS 峰值窗口与 Kadane 算法
published: 2026-08-20
description: 用游戏客户端视角拆解「最大子数组和」：DPS 峰值窗口、Buff 时间段的收益最大化、连招伤害累积。从暴力到 Kadane 算法的 O(n) 推导，讲透"贪心+滚动"思想——为什么打 Boss 时的输出节奏就是这道题。
image: api
tags: [力扣, 算法, 动态规划, Kadane, DPS, 游戏客户端, 面试]
category: 算法与面试
draft: false
---

> 面试官不会只问你算法——他们会追问：「你在游戏里用过这个吗？」本文把「最大子数组和」和游戏客户端场景焊在一起。这是热题 100 系列第 4 篇。

---

## 题目回顾

[LeetCode 53. Maximum Subarray](https://leetcode.cn/problems/maximum-subarray/) — 难度：中等（但思路是经典中的经典）

**给你一个整数数组 `nums`，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。**

```
输入：nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
输出：6
解释：连续子数组 [4, -1, 2, 1] 的和最大，为 6
```

**直观理解**：在一串有正有负的收益序列里，找一段连续区间，让累计收益最大。

---

## 游戏场景：这道题在游戏里到底干什么用？

### 场景一：DPS 峰值窗口（动作游戏 / MMO 战斗）

> 你打 Boss 时每 1 秒记录一次输出（可正可负——负的可能是被击退、转阶段停手、走位损失）。问：**哪个时间段你的累计输出最高？**

```
每帧伤害：[ -2, 1, -3, 4, -1, 2, 1, -5, 4 ]
                └──────┬──────┘
              [4, -1, 2, 1] = 6  ← 最高输出窗口
```

这就是「最大子数组和」的直接映射。战斗回放系统的"伤害曲线分析"、DPS 统计插件的"峰值窗口"就是算这个。

> **面试延伸**：真实 DPS 分析更复杂——窗口大小固定（如"最近 10 秒平均 DPS"）是**滑动窗口**问题；而"找任意长度最大累计段"就是本题。能说清两者的区别，面试官会认可你对问题的分辨力。

### 场景二：Buff 时间段的收益最大化（MMO / RPG）

> 你有一串可叠加的 Buff，每个 Buff 持续若干秒，期间每秒收益不同（攻速、增伤）。问：**叠加哪个连续时间段收益最大？**

```
每秒收益：[ -2, 1, -3, 4, -1, 2, 1, -5, 4 ]
          ↕ 每个时刻叠加中的 Buff 总收益
最优策略：第 4 秒到第 7 秒叠满增伤连招 → 收益 6
```

### 场景三：金币流水的最大盈余段（经济系统）

> 游戏交易行的金币流水记录（买入为负、卖出为正）。找**哪个时间段累计盈余最多**——用于分析经济系统波动、判断是否要开限购。

### 场景四：连招伤害累积（格斗游戏）

> 格斗游戏的连招伤害逐段记录，部分段有负收益（被打断/失误）。找**理论上最大伤害的连续段**——帮玩家找到最优连招节奏。

---

## 解法分析

### 解法一：暴力枚举 — O(n²)

枚举所有子数组起点和终点，逐个求和。

```cpp
int maxSubArray(vector<int>& nums) {
    int n = nums.size(), ans = INT_MIN;
    for (int i = 0; i < n; i++) {
        int sum = 0;
        for (int j = i; j < n; j++) {
            sum += nums[j];
            ans = max(ans, sum);
        }
    }
    return ans;
}
```

**复杂度**：O(n²)——能过小数据，但面试必被要求优化。

### 解法二：Kadane 算法 — O(n) ⭐ 标准答案

**核心思想**：遍历时维护"以当前位置结尾的最大子数组和"，它要么是**当前元素自己**，要么是**前一个最优 + 当前元素**——如果前面的累计是负的，果断丢弃，从当前元素重新开始。

```cpp
int maxSubArray(vector<int>& nums) {
    int curSum = 0;      // 以当前位置结尾的最大和
    int maxSum = INT_MIN; // 全局最大
    for (int x : nums) {
        // 关键：如果之前的累计是负的，从 x 重新开始（丢弃负收益）
        curSum = max(x, curSum + x);
        maxSum = max(maxSum, curSum);
    }
    return maxSum;
}
```

**为什么正确（贪心 + 滚动）**：

```
nums:   -2   1   -3   4   -1   2   1   -5   4
curSum: -2   1   -2   4    3   5   6    1   5
maxSum: -2   1    1   4    4   5   6    6   6
                        ↑
              这里 curSum = max(4, -2+4) = 4  ← 丢弃了前面的负数
```

- 当 `curSum + x < x`（即 curSum < 0）时，**前面的累计对后面是负担**，丢弃重新开始——这就是"负数子数组不值得保留"的贪心
- 每次只依赖前一个状态（`curSum`），空间 O(1)

> **面试必答要点**：
> 1. 为什么遇到负数累计要丢弃？—— 子数组是连续的，前面负累计只会拖累后续，从当前位置重新开始必然更优
> 2. 为什么能保证全局最优？—— `maxSum` 每步都记录历史最大值，Kadane 遍历所有"以 i 结尾的最优"，而全局最优必以某个 i 结尾
> 3. 这也是**动态规划**：`dp[i] = max(nums[i], dp[i-1] + nums[i])`，空间压缩后只剩滚动变量

### 解法三：分治 — O(n log n)（面试加分）

把数组分成两半，最大子数组要么全在左半、要么全在右半、要么跨中间。跨中间的情况从中间向两边扩展求最大和。

```cpp
int maxCross(vector<int>& nums, int l, int m, int r) {
    int leftSum = INT_MIN, sum = 0;
    for (int i = m; i >= l; i--) { sum += nums[i]; leftSum = max(leftSum, sum); }
    int rightSum = INT_MIN; sum = 0;
    for (int i = m + 1; i <= r; i++) { sum += nums[i]; rightSum = max(rightSum, sum); }
    return leftSum + rightSum;
}

int maxSubArrayDC(vector<int>& nums, int l, int r) {
    if (l == r) return nums[l];
    int m = l + (r - l) / 2;
    return max({
        maxSubArrayDC(nums, l, m),
        maxSubArrayDC(nums, m + 1, r),
        maxCross(nums, l, m, r)
    });
}
```

**复杂度**：O(n log n)。能说出来证明你掌握多种解法——面试加分项。

---

## 与游戏开发的更深联系

### Kadane 思想的游戏化理解

Kadane 的核心是"**负收益果断止损，重新开始**"——这简直是游戏里的**节奏管理**：

| 游戏场景 | Kadane 的映射 |
|---|---|
| **连招断点** | 连招被打断（负收益）后，与其硬续不如重新起手 |
| **Buff 管理** | 增伤 Buff 即将过期时，算"续费收益 vs 重新等 CD" |
| **资源规划** | 能量/法力消耗与回复的连续净收益分析 |
| **帧率优化** | 逐帧耗时曲线找"最差连续段"（反向的 Kadane，找最大和 → 找最大卡顿窗口） |

**反向用法（面试亮点）**：把每个数取负再做 Kadane 找最小和，就能找到"最大卡顿窗口"——帧率分析工具定位"连续掉帧最严重的时间段"就是 Kadane 的变形应用。

### 面试怎么答"DP 在游戏里用过吗"

**推荐回答**：

> 「我理解 Kadane 本质是**一维 DP 的空间压缩**：dp[i] = max(nums[i], dp[i-1]+nums[i])，只保留滚动变量。游戏里类似的滚动优化很常见——比如**连招伤害累积**（判断当前连招要不要继续）、**资源净收益分析**（经济系统监控）。做 UE 项目时我在伤害统计模块用过这个思路：找 DPS 峰值窗口来判断战斗节奏是否合理。」

---

## 举一反三（变体题）

| 变体 | 思路 |
|---|---|
| [乘积最大子数组（152）](https://leetcode.cn/problems/maximum-product-subarray/) | 维护最大和最小两个 DP（负数翻转） |
| [环形子数组的最大和（918）](https://leetcode.cn/problems/maximum-sum-circular-subarray/) | 最大值 = max(普通 Kadane, 总和 - 最小子数组和) |
| [最长湍流子数组（978）](https://leetcode.cn/problems/longest-turbulent-subarray/) | 双 DP 交替符号 |
| [买卖股票的最佳时机（121）](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/) | 维护最小买入价 + 最大差值（Kadane 变体） |

---

## 总结：这道题你该带走什么

1. **Kadane 的 O(n) 推导**要能独立走一遍（暴力 → 贪心 → 滚动）
2. 记住核心判断：**curSum < 0 就丢弃重开**
3. 能举 2-3 个游戏场景（DPS 峰值、Buff 收益、连招节奏）
4. 知道它是 DP 的空间压缩，并能扩展讲"反向找卡顿窗口"
5. 变体题（乘积/环形）至少知道思路

把代码放进 IDE，用 `[-2,1,-3,4,-1,2,1,-5,4]`、`[1]`、`[-1]`、`[-2,-1]` 四个用例跑一遍，再想想你打 Boss 的输出曲线——这就是这道题。

---

## 参考资源

- [LeetCode 53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)
- [维基百科 — Kadane's Algorithm](https://en.wikipedia.org/wiki/Maximum_subarray_problem)
- [代码随想录 — 动态规划专题](https://programmercarl.com/)
- [labuladong — 一维 DP](https://labuladong.github.io/algo/)
