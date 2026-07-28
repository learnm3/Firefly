---
title: 力扣「移动零」× 游戏客户端：从粒子回收到编队整理
published: 2026-07-14
description: 把「移动零」映射到游戏的粒子系统回收、编队死亡单位整理、背包空位压缩、渲染剔除队列等真实场景，理解双指针如何把 O(n²) 的后移操作优化成 O(n)。
image: api
tags: [力扣, 算法, 游戏客户端, 双指针, 数组, 面试]
category: 算法与面试
draft: false
---

> 就地操作 + 保持相对顺序——这八个字在游戏引擎里意味着「不重新分配内存」和「不破坏显示顺序」。粒子系统、编队、背包都在用同一个技巧。

---

## 题目回顾

[LeetCode 283. Move Zeroes](https://leetcode.cn/problems/move-zeroes/) — 难度：简单

**给定一个数组，将所有 0 移动到末尾，同时保持非零元素的相对顺序。必须原地操作，不能复制数组。**

```
输入: nums = [0, 1, 0, 3, 12]
输出: [1, 3, 12, 0, 0]
```

---

## 游戏场景：零不只是数字——它是「无效项」

在游戏里，「0」几乎从不代表数字零。它代表**空槽位、已死亡、已回收、已失效**。这道题的本质是：**把所有「有效项」紧凑排列到前面，把「无效项」挤到最后。**

### 场景一：粒子系统——死亡粒子回收

这是游戏引擎中最真实也最高频的应用。

> 粒子系统（Unity ParticleSystem / UE Niagara）每帧管理数千到数万个粒子。每个粒子有一个 `life` 字段。当 `life <= 0`，粒子死亡，应该被回收以供新粒子使用。

最简单的实现是遍历粒子数组，把死亡粒子删掉——但**频繁从数组中间删除会导致 O(n²) 的移动开销**。更优的做法是：

> 把活着的粒子紧凑到数组前面，死亡粒子自然被推到末尾。然后新粒子直接在末尾分配，无需任何内存操作。

```cpp
// 粒子系统：每帧整理死亡粒子
struct Particle {
    float life;
    float3 position;
    float3 velocity;
    // ...
};

void CompactParticles(vector<Particle>& particles) {
    int aliveIdx = 0;
    for (int i = 0; i < particles.size(); i++) {
        if (particles[i].life > 0) { // "非零" = 还活着
            swap(particles[aliveIdx], particles[i]);
            aliveIdx++;
        }
        // life <= 0 → 留在后面，等待被新粒子覆盖
    }
    // 现在 particles[0..aliveIdx-1] 是活粒子
    // particles[aliveIdx..] 是已回收空间，新粒子直接写到这里
}
```

这就是移动零的双指针解法，一行都不差。粒子系统的 `aliveIdx` 就是 `insertPos`。

### 场景二：编队系统——死亡单位整理

> 即时战略 / 自走棋 / SRPG 中，一个编队（小队）是一个 `Unit[]` 数组。战斗中单位死亡后，需要把死亡单位移到数组末尾，保持存活单位的原始编队顺序。

```
编队初始: [弓兵, 挂了的枪兵, 挂了的骑兵, 法师, 挂了的盾兵, 牧师]
整理后:   [弓兵, 法师, 牧师, 挂了的枪兵, 挂了的骑兵, 挂了的盾兵]
                            ↑ 存活单位相对顺序不变
```

```cpp
// 编队死亡单位整理
void CompactSquad(vector<Unit>& squad) {
    int alivePos = 0;
    for (int i = 0; i < squad.size(); i++) {
        if (squad[i].isAlive) {
            swap(squad[alivePos++], squad[i]);
        }
    }
}
```

**面试加分点**：主动提到「对于大量单位，swap 比逐元素后移更高效」——因为在最坏情况下（全存活），swap 只做 O(n) 次交换，而逐元素后移最坏 O(n²)。

### 场景三：背包/仓库整理——空槽位压缩

> 玩家背包有 100 个格子，中间散布着空位。整理背包时，把物品紧凑到前面，空位留到最后。

```
背包: [剑, 空, 盾, 空, 空, 药水, 空]
整理: [剑, 盾, 药水, 空, 空, 空, 空]
```

这和移动零完全等价——`0` 是空槽位，`非0` 是实际物品。游戏中「一键整理背包」就是这个算法。

### 场景四：渲染剔除队列

> 渲染管线的视锥体剔除阶段，每个物体会被标记为 `visible = 1` 或 `culled = 0`。剔除后需要把可见物体紧凑到前面，不可见物体推到后面——保持可见物体的提交顺序不变（这对透明排序至关重要）。

```cpp
// 渲染队列剔除后整理
void CompactDrawList(vector<DrawCommand>& commands) {
    int visiblePos = 0;
    for (int i = 0; i < commands.size(); i++) {
        if (commands[i].visible) {
            swap(commands[visiblePos++], commands[i]);
        }
    }
    // 只提交 commands[0..visiblePos-1]
}
```

### 场景五：音频混音——静音源剔除

> 音频引擎每帧遍历所有活跃音源。静音或已播放完毕的音源 (`volume = 0`) 需要移到队列末尾，减少混音计算量。

---

## 解法分析

### 解法一：两遍扫描——直观但操作多

第一遍：把所有非零元素复制到前面。第二遍：把剩余位置填零。

```cpp
void moveZeroes(vector<int>& nums) {
    int insertPos = 0;
    // 第一遍：非零元素前移
    for (int i = 0; i < nums.size(); i++) {
        if (nums[i] != 0) {
            nums[insertPos++] = nums[i];
        }
    }
    // 第二遍：尾部填零
    while (insertPos < nums.size()) {
        nums[insertPos++] = 0;
    }
}
```

| 维度 | 分析 |
|---|---|
| 操作次数 | 总共 n 次写入（非零写入 + 零填充） |
| 优点 | 极其直观，三行逻辑 |
| 缺点 | 非零元素被「复制」而非「交换」——如果元素很大（如粒子结构体），复制开销高 |

### 解法二：双指针交换——操作更少

维护一个 `insertPos` 指针，指向「下一个非零元素应该放的位置」。遍历数组，遇到非零就交换到 `insertPos`，`insertPos++`。

```cpp
void moveZeroes(vector<int>& nums) {
    int insertPos = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (nums[i] != 0) {
            swap(nums[insertPos++], nums[i]);
        }
    }
}
```

```
演示: [0, 1, 0, 3, 12]

i=0: nums[0]=0 → 跳过
i=1: nums[1]=1 → swap(nums[0], nums[1]) → [1, 0, 0, 3, 12], insertPos=1
i=2: nums[2]=0 → 跳过
i=3: nums[3]=3 → swap(nums[1], nums[3]) → [1, 3, 0, 0, 12], insertPos=2
i=4: nums[4]=12 → swap(nums[2], nums[4]) → [1, 3, 12, 0, 0], insertPos=3

完成 ✓
```

| 维度 | 分析 |
|---|---|
| 时间复杂度 | O(n) |
| 空间复杂度 | O(1)，原地操作 |
| 写操作次数 | 非零元素个数次 swap，而非 n 次 |
| 关键细节 | `insertPos` 永远 ≤ `i`，所以 swap 不会把已放置好的元素打乱 |

### 两种解法怎么选？

```
┌──────────────────────────────────────────────────────────────┐
│            两遍扫描                      vs         双指针交换  │
├──────────────────────────────────────────────────────────────┤
│  元素小（int/float）      → 均可，差距可忽略                   │
│  元素大（Particle/Unit）  → 双指针更好——swap 比 copy+fill 少写  │
│  零很少（稀疏）            → 双指针交换更少                     │
│  零很多（密集）            → 两遍扫描更少（直接覆盖，不 swap）    │
│  面试                     → 先说两遍扫描，再说双指针优化         │
└──────────────────────────────────────────────────────────────┘
```

### 为什么能保证相对顺序？

因为 `insertPos` 始终 ≤ `i`。`insertPos` 指向的是「已经被处理过但被跳过的零区域」的第一个位置。当我们把 `nums[i]` 和 `nums[insertPos]` 交换时：

- `nums[insertPos]` 一定是 0（因为我们只在遇到 0 时不移动 `insertPos`）
- 所有在 `insertPos` 之前的非零元素已经按原始顺序排好
- 新交换过来的 `nums[i]` 自然排在它们后面

---

## 游戏引擎中的实际应用

### UE5：Niagara 粒子回收

```cpp
// UE5 Niagara 粒子系统简化版
struct FNiagaraParticle {
    FVector Position;
    FVector Velocity;
    float Life;
    // ... 其他属性约 200 字节
};

void CompactParticleArray(TArray<FNiagaraParticle>& Particles)
{
    int32 AliveIdx = 0;
    for (int32 i = 0; i < Particles.Num(); i++)
    {
        if (Particles[i].Life > 0.0f)
        {
            // 只 swap，不分配内存，不调用构造/析构
            Particles.SwapMemory(AliveIdx, i);
            AliveIdx++;
        }
    }
    
    // 粒子诞生时直接写入 Particles[AliveCount++]
    // 无需分配新内存——回收的死亡粒子槽位自动复用
}
```

**核心性能点**：`SwapMemory` 是内存级别的交换，不调用构造/析构函数。粒子结构体通常数百字节，copy+fill 两遍扫描的开销远高于 swap。

### Unity：编队死亡单位整理

```csharp
// Unity C# 自走棋编队系统
public class SquadManager : MonoBehaviour
{
    public List<Unit> units; // 编队单位列表
    
    public void CompactDeadUnits()
    {
        int aliveIdx = 0;
        for (int i = 0; i < units.Count; i++)
        {
            if (units[i].IsAlive)
            {
                // C# 的 List 没有 SwapMemory，但引用类型 swap 极快
                (units[aliveIdx], units[i]) = (units[i], units[aliveIdx]);
                aliveIdx++;
            }
        }
    }
    
    // 新单位加入时：直接替换末尾的死亡单位槽位
    public void SpawnUnit(Unit newUnit)
    {
        // 先整理一次确保死亡单位在末尾
        CompactDeadUnits();
        int aliveCount = units.Count(u => u.IsAlive);
        if (aliveCount < units.Count)
        {
            units[aliveCount] = newUnit; // 复用死亡槽位
        }
        else
        {
            units.Add(newUnit); // 没有死亡槽位，扩增
        }
    }
}
```

---

## 变体与追问

### 追问一：不止移动零，把某个特定值全部移到末尾？

→ 把 `if (nums[i] != 0)` 改成 `if (nums[i] != target)`。完全一样。

**游戏场景**：把背包中所有「已过期」的道具移到末尾。

### 追问二：把零移到开头而不是末尾？

→ 从后往前遍历，`insertPos` 指向末尾：

```cpp
int insertPos = nums.size() - 1;
for (int i = nums.size() - 1; i >= 0; i--) {
    if (nums[i] != 0) {
        swap(nums[insertPos--], nums[i]);
    }
}
```

**游戏场景**：优先级队列——把高优先级物品放到前面。

### 追问三：不止零，把所有偶数移到前面，奇数移到后面，各自保持相对顺序？

→ 这是同一道题的推广版。双指针依然适用：先扫一遍移偶数，再扫一遍……但两次扫描会破坏相对顺序。

正确做法：**双指针，一个从左找奇数，一个从右找偶数，保证相对顺序需要额外空间**——这已经不是 O(1) 空间的题了，你要能指出这个限制。

### 追问四：大数据量 + 元素很大时，swap 的开销接受不了怎么办？

→ 不要 swap 元素本身，改用**间接索引**——维护一个 `int indices[]`，只排序索引不移动数据。渲染管线中 `DrawCommand` 典型场景。

```cpp
// 间接索引优化：不动数据本身
vector<int> indices(data.size());
iota(indices.begin(), indices.end(), 0);
int insertPos = 0;
for (int i = 0; i < indices.size(); i++) {
    if (data[indices[i]].isValid) {
        swap(indices[insertPos++], indices[i]);
    }
}
// data 完全不动，只通过 indices 访问
```

---

## 归纳总结

```
┌───────────────────────────────────────────────────────────┐
│                  「移动零」游戏视角                          │
├───────────────────────────────────────────────────────────┤
│  游戏场景              │  映射                              │
├───────────────────────────────────────────────────────────┤
│  粒子系统死亡回收        │  零=死亡粒子，非零=存活粒子         │
│  编队死亡单位整理        │  零=死亡单位，非零=存活单位         │
│  背包一键整理            │  零=空格子，非零=物品              │
│  渲染剔除队列            │  零=被裁剪，非零=可见物体          │
│  音频静音源剔除          │  零=静音/已结束，非零=活跃音源      │
│  任务/成就队列清理       │  零=已完成，非零=未完成            │
└───────────────────────────────────────────────────────────┘
```

### 面试高分回答模板

> 我在做游戏的粒子系统时，需要高效回收死亡粒子。粒子数组可能有上万个元素，每个粒子结构体几百字节。如果直接在数组中间删除死亡粒子，后续所有元素都要前移——O(n²) 完全不可接受。
>
> 我用双指针做了原地整理：一个 `aliveIdx` 指向下一个存活粒子应放的槽位，遍历数组时遇到存活粒子就 swap 到前面。这样 O(n) 时间，O(1) 空间，而且 swap 比 copy+fill 少了一半的写操作——对于 200 字节的粒子结构体，差异是显著的。
>
> 新粒子诞生时，直接在 `aliveCount` 位置写入，无需分配新内存——死亡粒子腾出的槽位被自动复用。

### 关键记忆点

| 维度 | 核心 |
|---|---|
| **算法本质** | 双指针原地分区——`insertPos` 指向「已整理区域」的边界 |
| **时间复杂度** | O(n)，每个元素访问一次 |
| **空间复杂度** | O(1)，原地操作 |
| **核心直觉** | `insertPos` 始终 ≤ `i`，它永远指向「下一个有效元素应该去的位置」 |
| **游戏价值** | 粒子回收、编队整理、背包压缩——任何「无效项后移且保持有效项顺序」的场景 |
| **变体方向** | 移到开头 / 多值分类 / 大元素间接索引 / 保持双序列顺序 |
| **延伸题目** | LeetCode 26 (删除有序数组重复项), 27 (移除元素), 75 (颜色分类-荷兰国旗), 80 (删除有序数组重复项 II) |
