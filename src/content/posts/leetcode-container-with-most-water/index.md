---
title: 力扣「盛最多水的容器」× 游戏客户端：从地形水体到视野通廊
published: 2026-07-14
description: 把「盛最多水的容器」映射到游戏的开放世界水体生成、哨塔视野计算、关卡掩体布局、城墙建造系统等真实场景，理解贪心双指针为什么「移动较短边」就是全局最优。
image: api
tags: [力扣, 算法, 游戏客户端, 双指针, 贪心, 面试]
category: 算法与面试
draft: false
---

> 这道题的贪心策略只有一句话——「移动较短的那个指针」——但为什么这样不会错过最优解？游戏里的水体系统和视野系统每天都在回答这个问题。

---

## 题目回顾

[LeetCode 11. Container With Most Water](https://leetcode.cn/problems/container-with-most-water/) — 难度：中等

**给定一个长度为 n 的数组 `height`，第 i 条垂线高度为 `height[i]`。找出两条线，使它们与 x 轴围成的容器能容纳最多的水。返回最大水量。**

```
输入: height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
输出: 49
解释: 选择 i=1 (高8) 和 i=8 (高7)，宽度=7，高度=min(8,7)=7，面积=7×7=49
```

面积公式：`min(height[i], height[j]) × (j - i)`

---

## 游戏场景：地形上的「容器」

把 height 数组想象成**游戏地形的横截面**——每个元素是地表某点的海拔高度。这道题变成：「在这条剖面上，哪两个山脊之间能形成最大的洼地/盆地？」

### 场景一：开放世界水体生成——地形注水

> 开放世界游戏（旷野之息 / 原神 / 艾尔登法环）中，关卡设计师需要确定河流和湖泊的位置。给定一条地形剖面的高度数据，最大的天然洼地就是最优的湖泊候选点。

```
地形剖面: [1, 8, 6, 2, 5, 4, 8, 3, 7]
           ↓
山脊在 i=1 (高8) 和 i=6 (高8): 面积 = 8 × 5 = 40
山脊在 i=1 (高8) 和 i=8 (高7): 面积 = 7 × 7 = 49  ← 最大！形成天然洼地
```

```cpp
// 地形分析：找最大洼地容量
int FindLargestBasin(vector<int>& terrain) {
    int left = 0, right = terrain.size() - 1;
    int maxVolume = 0;
    int bestLeft = 0, bestRight = 0;  // 记录最优盆地的山脊位置
    
    while (left < right) {
        int volume = min(terrain[left], terrain[right]) * (right - left);
        if (volume > maxVolume) {
            maxVolume = volume;
            bestLeft = left;
            bestRight = right;
        }
        // 移动较短的山脊——降低高度找更宽的跨度
        if (terrain[left] < terrain[right]) left++;
        else right--;
    }
    return maxVolume;  // 返回容量 + bestLeft/bestRight 用于放置水体
}
```

**进阶思考**：真实的开放世界用二维高度图（Heightmap），这是本题在维度上的推广。但你需要在面试中先讲清楚一维的解法，再提「二维可以用类似的双指针思路在每行/每列上独立运行」。展示你理解复杂度的升级路径。

### 场景二：哨塔视野通廊——RTS/MOBA 视野系统

> 在 RTS 或 MOBA 中，两座己方哨塔之间的矩形区域构成了「视野通廊」。通廊的有效视野面积由**较短的那座哨塔的高度决定**（矮塔是瓶颈），通廊的长度是两座塔之间的距离。

```
哨塔高度: [3, 12, 4, 7, 9, 10, 6, 11, 8]
最大视野通廊: 哨塔高12 × 宽1? 不，哨塔高10 和 高11，宽=2，面积=10×2=20...
仔细算: i=1(高12) 和 i=7(高11)，宽=6，min=11，面积=66 ← 最大！
```

这道题在 RTS 中的业务含义：**你应该把侦察单位部署在哪两座己方哨塔之间，使得能看到的区域最大**。

### 场景三：关卡掩体布局——射击游戏

> 第三人称掩体射击（战争机器 / 全境封锁）中，两堵掩体墙之间的「安全矩形区」保护玩家免受正面火力。安全区的面积 = min(墙A高度, 墙B高度) × 两墙距离。

布置掩体时，你需要最大化玩家可活动的安全区域——这就是求最大容器。

```cpp
// 掩体安全区计算
struct Cover {
    float height;  // 掩体高度
    float x;       // 掩体 x 坐标
};

float MaxSafeZone(vector<Cover>& covers) {
    sort(covers.begin(), covers.end(), 
         [](auto& a, auto& b) { return a.x < b.x; });  // 按 x 排序
    int left = 0, right = covers.size() - 1;
    float maxArea = 0;
    while (left < right) {
        float area = min(covers[left].height, covers[right].height) 
                   * (covers[right].x - covers[left].x);
        maxArea = max(maxArea, area);
        if (covers[left].height < covers[right].height) left++;
        else right--;
    }
    return maxArea;
}
```

### 场景四：城墙建造系统——生存/策略游戏

> 帝国时代 / 冰汽时代中，你可以在地图上任意两点之间建造城墙。城墙的防御面积 = min(两点防御塔高度) × 城墙长度。资源有限的情况下，哪两个点位能给你最大的防御面积？

这就是盛水容器本身——只是把「水」换成了「防御覆盖」。

---

## 解法分析

### 为什么暴力枚举不行？

O(n²) 尝试所有线对——n 最大 10⁵，意味着约 50 亿次比较。在 60FPS 的游戏里，一帧只能用 16ms，这完全不可接受。

```cpp
// 暴力：O(n²) —— 只能当面试的起手式
int maxArea = 0;
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        maxArea = max(maxArea, min(h[i], h[j]) * (j - i));
```

### O(n) 解法：双指针 + 贪心移动较短边

**核心策略**：左右指针从两端向中间移动。每次移动**较短的那个指针**。

```cpp
int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int ans = 0;
    
    while (left < right) {
        int area = min(height[left], height[right]) * (right - left);
        ans = max(ans, area);
        
        if (height[left] < height[right]) {
            left++;   // 左边矮 → 左指针右移
        } else {
            right--;  // 右边矮 → 右指针左移
        }
    }
    return ans;
}
```

### 为什么移动较短边不会错过最优解？——这是面试必考题

这是这道题最核心的证明，面试官一定会问。

> **面积由两部分决定：宽度 × min(height[left], height[right])。**
>
> 假设 `height[left] < height[right]`。如果此时移动较高的右指针（right--），会怎样？
>
> - 宽度减小（从 `right-left` 变成 `right-left-1`）
> - 高度不可能超过 `height[left]`（因为 min 被 left 限制住了）
> - 所以**面积只可能更小，绝不可能更大**
>
> 因此，以当前 `left` 为左端点的所有容器中，`right` 已经是最大宽度的那个——不需要再和其他 right 组合了。

**一句话版本**：「较短的板决定了容器高度的上限。移动它，才有可能突破这个上限；移动较长的板，只会在宽度减小的情况下保持同样的高度上限，毫无意义。」

```
示意图:
         |
    |    |       |
    |    |    |  |
|   |    |    |  |
|   |    |    |  |
0   1    2    3  4

left=0(h=1), right=4(h=5): 面积 = min(1,5)×4 = 4
left 更短 → 右移 left

left=1(h=8), right=4(h=5): 面积 = min(8,5)×3 = 15
right 更短 → 左移 right

left=1(h=8), right=3(h=6): 面积 = min(8,6)×2 = 12
right 更短 → 左移 right

left=1(h=8), right=2(h=3): 面积 = min(8,3)×1 = 3
right 更短 → 左移 right

left=1, right=1 → 结束。最大 = 15
```

---

## 游戏引擎中的实际应用

### UE5：地形水体自动放置

```cpp
// UE5 地形水体系统简化版
// 在一维地形剖面上自动寻找最大洼地
struct FWaterCandidate
{
    int32 LeftPeakIdx;
    int32 RightPeakIdx;
    float Capacity; // min(左峰高, 右峰高) × 距离
};

TArray<FWaterCandidate> FindWaterBasins(
    const TArray<float>& TerrainProfile)
{
    TArray<FWaterCandidate> Basins;
    int32 Left = 0, Right = TerrainProfile.Num() - 1;
    
    float MaxCapacity = 0;
    int32 BestLeft = 0, BestRight = 0;
    
    while (Left < Right)
    {
        float H = FMath::Min(TerrainProfile[Left], TerrainProfile[Right]);
        float Capacity = H * (Right - Left);
        
        if (Capacity > MaxCapacity)
        {
            MaxCapacity = Capacity;
            BestLeft = Left;
            BestRight = Right;
        }
        
        if (TerrainProfile[Left] < TerrainProfile[Right])
            Left++;
        else
            Right--;
    }
    
    // 在 BestLeft 和 BestRight 之间放置湖泊
    Basins.Add({BestLeft, BestRight, MaxCapacity});
    
    // 递归处理左半段和右半段，找到所有可能的洼地
    // （实际项目中对高度图的每一行和每一列分别运行此算法）
    
    return Basins;
}
```

### Unity：哨塔视野网络规划

```csharp
// Unity C# RTS 视野系统
public class WatchtowerPlanner : MonoBehaviour
{
    [System.Serializable]
    public struct Tower
    {
        public Vector2 position;
        public float height;
    }
    
    // 找两座哨塔形成最大视野通廊
    public float FindBestTowerPair(List<Tower> towers)
    {
        // 1. 按 x 坐标排序
        towers.Sort((a, b) => a.position.x.CompareTo(b.position.x));
        
        // 2. 双指针求最大视野面积
        int left = 0, right = towers.Count - 1;
        float maxArea = 0;
        
        while (left < right)
        {
            float h = Mathf.Min(towers[left].height, towers[right].height);
            float w = towers[right].position.x - towers[left].position.x;
            maxArea = Mathf.Max(maxArea, h * w);
            
            if (towers[left].height < towers[right].height)
                left++;
            else
                right--;
        }
        
        return maxArea;
    }
    
    // 应用：在最大视野通廊的中点部署侦察单位
    public Vector2 PlaceScout(List<Tower> towers)
    {
        // 找出最优塔对，在两塔之间部署侦察单位
        // ...
    }
}
```

---

## 变体与追问

### 追问一：不止求最大面积，求前 K 大的容器？

→ 使用**优先队列（堆）**维护前 K 大，双指针扫描过程中把每个面积入堆，保留前 K。

**游戏场景**：不止放一个湖，而是放 K 个湖——地形水体系统需要多个水体候选点。

### 追问二：二维版本——给一个高度图矩阵，找最大容积的盆地？

→ 这是 LeetCode 42「接雨水」和 407「接雨水 II」的领域。一维用双指针，二维用**最小堆 + BFS**。

```cpp
// 二维版本升级路径:
// 一维：双指针 O(n)
// 二维：优先队列 BFS 从边界向内，O(mn log(mn))
```

**面试技巧**：主动说你理解一维和二维的差异，不要说「二维也双指针」——会被秒杀。

### 追问三：如果要求容器底部必须水平（即两条线必须在同一高度）？

→ 退化为「找两个相等的最大值」+ 双指针两侧找相等高度。变简单了。

**游戏场景**：建筑系统——城墙必须两端等高才能架设横梁。

### 追问四：如果线不是垂直线，而是不同宽度的柱子？

→ 宽度变为权重的变体。面积 = min(h[i], h[j]) × (Σ w[i+1..j])。双指针仍可用，但移动策略需要调整——比较 `h[left] × w[left]` vs `h[right] × w[right]` 而非单纯比高度。

**游戏场景**：地形中不同宽度的障碍物之间的可见区域。

---

## 归纳总结

```
┌──────────────────────────────────────────────────────────────┐
│                 「盛最多水的容器」游戏视角                      │
├──────────────────────────────────────────────────────────────┤
│  游戏场景                │  映射                               │
├──────────────────────────────────────────────────────────────┤
│  开放世界水体生成         │  地形剖面 → 最大洼地 → 湖泊位置      │
│  哨塔视野通廊             │  哨塔高度 → 可见矩形面积最大化       │
│  关卡掩体布局             │  掩体墙 → 安全活动区域              │
│  城墙/栅栏建造            │  防御塔 → 最大防御覆盖面积          │
│  AOE 技能最优位置         │  地形约束 → 矩形技能命中面积         │
└──────────────────────────────────────────────────────────────┘
```

### 面试高分回答模板

> 我在做开放世界的关卡编辑器时，需要给关卡设计师自动推荐水体放置位置。输入是地形的一维剖面的高度数据，输出是最大洼地的位置和容量。
>
> 我用双指针从剖面两端向中间扫描。核心贪心策略是：每次移动较短的指针。因为容器面积 = min(两山脊高度) × 距离，较短的山脊是瓶颈。保持短边不变移动长边，宽度减小但高度上限不变——面积只会变小，不可能找到更好的解。
>
> 一维版本 O(n) 跑通后，我把它推广到二维高度图——对每一行和每一列分别运行，提出候选水体区域。更精确的二维版本用了最小堆 BFS，但没有 O(n²) 的双指针对应物，这是算法设计中的典型权衡。

### 关键记忆点

| 维度 | 核心 |
|---|---|
| **算法本质** | 双指针 + 贪心——每次移动较短的指针 |
| **为什么正确** | 较短边是面积瓶颈，保持它不动不可能找到更大面积 |
| **时间复杂度** | O(n)——每个元素最多访问一次 |
| **贪心直觉** | 「不换掉短板，永远不可能变大」 |
| **游戏价值** | 地形水体、视野计算、掩体布局——任何「矩形区域+高度限制」的场景 |
| **延伸题目** | LeetCode 42 (接雨水-一维), 84 (柱状图中最大的矩形), 407 (接雨水 II-二维), 1793 (好子数组的最大分数) |
