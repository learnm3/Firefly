---
title: UE5 C++ 武器系统与 IK 动画重定向：从装备到战斗
published: 2026-08-08
description: 以《虚幻5 C++ 游戏开发从入门到秃头》第11集为蓝本，系统梳理武器类设计、Socket 挂载、装备拾取系统、IK Rig 与 IK Retargeter 动画重定向、角色状态枚举驱动动画蓝图等核心内容，并延伸面试常考的武器系统架构、IK 原理与常见陷阱。
image: ""
tags: [UE5, C++, 武器系统, IK, 动画重定向, 游戏开发, 面试]
category: 游戏开发
draft: false
---

> 本文基于 B 站教程《[虚幻5 C++ 游戏开发从入门到秃头](https://www.bilibili.com/video/BV1Wk9EYvEoy)》第 11 集「Weapon and IK Retargeter」整理，UP 主**黑子的游戏空间**。在原视频基础上补充了面试深度的 IK 原理、武器系统架构设计和实战坑点。

---

## 本章全景

第 11 集是整个系列从"角色基础"跨向"战斗系统"的转折点。你会完成四件事：

1. 创建一个可拾取的武器 Actor
2. 把武器"吸附"到角色右手骨骼上
3. 从 Mixamo 下载攻击动画，通过 IK Rig/Retargeter 重定向到自己角色
4. 用角色状态枚举驱动动画蓝图，区分空手/持武器姿态

---

## 一、武器类：从物品基类派生

### 1.1 继承链

视频中武器不是凭空创建的——它继承自之前章节写的 `AItem` 基类：

```cpp
// AItem 提供了：漂浮效果（Tick 中上下浮动）、旋转动画、
//   重叠检测球体（SphereComponent）、拾取提示 Widget
UCLASS()
class AWeapon : public AItem
{
    GENERATED_BODY()

protected:
    virtual void OnSphereOverlap(UPrimitiveComponent* OverlappedComponent,
        AActor* OtherActor, UPrimitiveComponent* OtherComp,
        int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult) override;

    virtual void OnSphereEndOverlap(UPrimitiveComponent* OverlappedComponent,
        AActor* OtherActor, UPrimitiveComponent* OtherComp,
        int32 OtherBodyIndex) override;
};
```

**为什么用继承而不是组合？** 武器天然"是一个"物品——它也需要漂浮展示、需要碰撞检测来触发拾取。继承 `AItem` 避免了重复代码，C++ 中 `virtual` + `override` 保证子类只需重写差异逻辑。

### 1.2 重写重叠事件

```cpp
void AWeapon::OnSphereOverlap(UPrimitiveComponent* OverlappedComponent,
    AActor* OtherActor, UPrimitiveComponent* OtherComp,
    int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
    // 先执行父类逻辑（显示物品名称等）
    Super::OnSphereOverlap(OverlappedComponent, OtherActor,
        OtherComp, OtherBodyIndex, bFromSweep, SweepResult);

    // 武器的专属逻辑：记录当前可拾取的角色
    ASlashCharacter* SlashCharacter = Cast<ASlashCharacter>(OtherActor);
    if (SlashCharacter)
    {
        SlashCharacter->SetOverlappingItem(this);
    }
}

void AWeapon::OnSphereEndOverlap(UPrimitiveComponent* OverlappedComponent,
    AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex)
{
    Super::OnSphereEndOverlap(OverlappedComponent, OtherActor,
        OtherComp, OtherBodyIndex);

    ASlashCharacter* SlashCharacter = Cast<ASlashCharacter>(OtherActor);
    if (SlashCharacter)
    {
        SlashCharacter->SetOverlappingItem(nullptr);
    }
}
```

> **面试追问：`Super::` 为什么放在开头而不是结尾？**
>
> 父类 `OnSphereOverlap` 负责显示武器名称 UI——这是基础行为，应该无条件执行。子类 `Cast` 失败时父类逻辑已经跑完了，不影响用户体验。如果 `Super::` 放在末尾，且子类逻辑中提前 return，父类逻辑可能被跳过。

---

## 二、Socket：武器挂载的锚点

### 2.1 为什么需要 Socket

你不能把武器直接附着到"骨骼本身"——骨骼有朝向和位置但没有微调能力。Socket 是骨骼上的**可调锚点**，可以在骨骼本地空间内偏移位置和旋转，让武器精确落在手心里。

### 2.2 创建步骤

1. 打开角色骨骼资产（Skeleton Asset）
2. 在骨骼树中找到 `hand_r`（右手），右键 → **Add Socket**
3. 命名 `RightHandSocket`
4. 在 Socket 上右键 → **Add Preview Asset**，选择你的武器网格
5. 调整位置和旋转，使武器看起来像被握持

### 2.3 C++ 挂载

```cpp
void ASlashCharacter::Equip()
{
    if (OverlappingItem == nullptr) return;

    AWeapon* Weapon = Cast<AWeapon>(OverlappingItem);
    if (Weapon == nullptr) return;

    // 关键：SnapToTarget 保证武器对齐到 Socket
    FAttachmentTransformRules TransformRules(
        EAttachmentRule::SnapToTarget, // 位置
        EAttachmentRule::SnapToTarget, // 旋转
        EAttachmentRule::KeepWorld,    // 缩放
        true                           // bWeldSimulatedBodies
    );

    Weapon->GetItemMesh()->AttachToComponent(
        GetMesh(),
        TransformRules,
        FName("RightHandSocket")
    );

    CharacterState = ECharacterState::ECS_EquippedOneHandedWeapon;
    OverlappingItem = nullptr; // 拾取后清空引用
}
```

---

## 三、装备拾取系统

### 3.1 OverlappingItem 管理

在 Character 中维护一个指向当前重叠物品的指针：

```cpp
UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
AItem* OverlappingItem;

void SetOverlappingItem(AItem* Item) { OverlappingItem = Item; }
```

武器进入角色碰撞范围 → 记录在 `OverlappingItem` → 按 E 键触发 `Equip()` → 武器挂载到手上。

### 3.2 输入绑定（Enhanced Input）

```cpp
void ASlashCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    Super::SetupPlayerInputComponent(PlayerInputComponent);

    if (UEnhancedInputComponent* EnhancedInput =
        Cast<UEnhancedInputComponent>(PlayerInputComponent))
    {
        EnhancedInput->BindAction(
            EquipAction,                // UInputAction*
            ETriggerEvent::Triggered,   // 按下触发
            this,
            &ASlashCharacter::Equip
        );
    }
}
```

### 3.3 完整拾取流程

```
武器 Actor（漂浮中）
  │
  ├─ BeginOverlap → OnSphereOverlap → SlashCharacter->SetOverlappingItem(this)
  │   角色进入碰撞球体，指针建立
  │
  ├─ 玩家按 E → EnhancedInput → Equip()
  │   Cast<AWeapon>(OverlappingItem) → AttachToComponent(RightHandSocket)
  │
  └─ EndOverlap → OnSphereEndOverlap → SlashCharacter->SetOverlappingItem(nullptr)
      角色远离，指针清空，防止野指针
```

---

## 四、角色状态枚举：驱动动画蓝图

### 4.1 定义枚举

```cpp
UENUM(BlueprintType)
enum class ECharacterState : uint8
{
    ECS_Unequipped              UMETA(DisplayName = "Unequipped"),
    ECS_EquippedOneHandedWeapon UMETA(DisplayName = "Equipped One-Handed Weapon")
};
```

### 4.2 动画蓝图中使用 BlendPose

```
[动画蓝图 Event Graph]
    CharacterState == ECS_Unequipped?
         ├─ Yes → BlendPose(Idle_Pose, Walk_Pose, ...)  // 空手动作
         └─ No  → BlendPose(CombatIdle, CombatWalk, ...) // 持武器动作

[LinkedAnimGraph]
    将 IK（LookAt, HandIK 等）拆到独立子动画蓝图
    主蓝图调用 LinkedAnimGraph 节点引入
```

`BlendPose` 的本质是按 `BlendOption`（如 `BlendByEnum`）混合多个姿态。通过 `ECharacterState` 做索引，可以干净地把"空手动画"和"持武器动画"分成两条分支，避免状态机层数过深。

> **面试追问：为什么要用 LinkedAnimGraph 拆分子蓝图？**
>
> 大型角色动画系统非常复杂——主运动（跑跳）、上半身 IK（手部瞄准）、LookAt（头部跟随）、武器层——全写在一个 AnimBP 里会导致节点图不可维护。LinkedAnimGraph 让你把每个关注点拆成独立的子 AnimBP，主蓝图通过连线"引入"，每个子蓝图可以独立 Debug 和迭代。

---

## 五、IK Rig 与 IK Retargeter：动画重定向核心

这是本集技术含量最高的部分。场景：你从 Mixamo 下载了一个剑术攻击动画，但 Mixamo 的骨骼（XBot/Mixamo Skeleton）和你角色的骨骼（如 Echo）骨架不一样——骨骼数量不同、命名不同、朝向不同。怎么把这个动画"迁移"到你的角色上？

### 5.1 为什么传统重定向不够

传统骨骼重映射依赖**骨骼名称的一一匹配**。如果源骨架有 65 根骨骼、目标有 82 根，还有很多名称不同（`mixamorig:LeftArm` vs `clavicle_l`），手动映射是噩梦。IK Rig 用**关节链**替代单骨骼映射来解决这个问题。

### 5.2 IK Rig 的核心概念

```
源骨架 (Mixamo)                      目标骨架 (Echo)
    │                                      │
    ├─ RetargetRoot: Hips          ←──→   RetargetRoot: pelvis
    ├─ Chain: Spine (spine_01..07) ←──→   Chain: Spine (spine_01..05)
    ├─ Chain: LeftArm (clavicle→hand) ←─→ Chain: LeftArm (clavicle_l→hand_l)
    ├─ Chain: LeftLeg (thigh→foot)  ←──→   Chain: LeftLeg (thigh_l→foot_l)
    └─ ...                                  ...
```

**关键：两条链的骨骼数量可以不同。** 重定向时系统读取源链的运动偏移（旋转和平移），按比例映射到目标链上，中间骨骼由 IK 解算器自动插值。

### 5.3 创建步骤

1. **为源骨架创建 IK Rig**
   - 右键 Mixamo 骨架 → Create IK Rig
   - 设置 Retarget Root = `Hips`
   - 添加 Retarget Chains：Spine、LeftArm、RightArm、LeftLeg、RightLeg、Neck、Head

2. **为目标骨架创建 IK Rig**
   - 同上，但注意 Echo 有额外的掌骨（Metacarpal Bones）
   - 手部链到手掌为止，**移除掌骨**——否则重定向后手掌会扭曲

3. **创建 IK Retargeter**
   - 选择 Source IK Rig（Mixamo）和 Target IK Rig（Echo）
   - 点击 **Auto Align** → UE5.4+ 自动对齐为 T-Pose
   - 创建新的重定向姿势 → 保存

4. **批量导出动画**
   - 在 IK Retargeter 中选择源动画
   - 右键 → **Retarget Animation Assets** → 导出到目标骨架

### 5.4 原理图解

```
Mixamo 走动画                         Echo 走动画（重定向后）
  手臂30°前摆       ──Retarget──→       手臂30°前摆
  腿15°后摆         ──Retarget──→       腿15°后摆

处理过程（FIKRetargetProcessor::RunRetargeter）：
  1. 读取源姿态（全局空间骨骼变换矩阵）
  2. 对每条 Retarget Chain：
     a. 提取源链的旋转/位移增量
     b. 按链长比例缩放到目标链
     c. IK 解算器插值中间骨骼
  3. 输出目标骨架的全局空间变换
```

> **坑点备忘**：如果左手重定向正确、右手奇怪扭曲，大概率是右手链包含了不该有的骨骼（如 Echo 的掌骨）。在目标 IK Rig 中手动编辑链的起点和终点即可解决。

---

## 六、面试延伸

### 6.1 IK Rig vs Control Rig

| | IK Rig | Control Rig |
|---|---|---|
| 用途 | 重定向、运行时 IK 接触修正 | 创作动画、程序化动画 |
| 编辑方式 | 定义骨骼链 + IK Goal | 蓝图式节点图 |
| 运行位置 | 编辑器 + 运行时 | 编辑器 + Sequencer |

它们是互补关系：IK Rig 负责"搬运和适配动画"，Control Rig 负责"创造和修改动画"。

### 6.2 武器系统架构：面试回答框架

被问到"如何在 UE5 中实现武器系统"时，按这个结构回答：

1. **数据层** — `UENUM` 定义武器类型枚举（手枪/步枪/近战），武器类继承物品基类，用 `UDataAsset` 或 `DataTable` 配置武器属性（伤害、射速、弹夹容量）
2. **挂载层** — 骨骼创建 Socket（`RightHandSocket`、`BackHolster`），`AttachToComponent` + `SnapToTarget` 收枪/拔枪
3. **输入层** — Enhanced Input 绑定射击/换弹/切枪动作，通过枚举 Switch 路由到对应逻辑
4. **动画层** — 角色状态枚举驱动 BlendPose/LinkedAnimGraph，不同武器用不同动画集
5. **网络层**（多人项目） — 武器在服务器 Spawn，通过 Replicated 属性同步到客户端

### 6.3 常见坑汇总

| 问题 | 原因 | 解决 |
|---|---|---|
| 武器挂载后浮在地面 | Location Rule = `KeepRelative` | 改为 `SnapToTarget` |
| 挂载后角色原地转圈 | 武器碰撞未关闭 | `Weapon->SetActorEnableCollision(false)` |
| `AttachToComponent` 第一次无效 | 未焊接模拟体 | `FAttachmentTransformRules(..., true)` |
| IK 重定向手掌扭曲 | Echo 掌骨被包含在链中 | 编辑手部链终点，移除掌骨 |
| 动画重定向后角色 T-Pose 歪斜 | 未先做 Auto Align | UE5.4+ 先点 Auto Align 对齐 T-Pose |
| 拾取后 OverlappingItem 野指针 | 离开碰撞范围未清空 | EndOverlap 中设为 `nullptr` |

---

## 七、自测清单

- [ ] `AWeapon` 为什么继承 `AItem` 而不是直接继承 `AActor`？
- [ ] Socket 和骨骼有什么区别？为什么武器挂载用 Socket 而不是直接 Attach 到骨骼？
- [ ] `FAttachmentTransformRules` 三个参数的推荐值？`bWeldSimulatedBodies` 是做什么的？
- [ ] 从角色走进武器碰撞范围到按下装备键，调用链路是什么？
- [ ] `ECharacterState` 枚举如何驱动动画蓝图切换姿态？
- [ ] IK Rig 的 Retarget Root 和 Retarget Chain 分别是什么？为什么两条链的骨骼数可以不同？
- [ ] 创建 IK Retargeter 的三个关键步骤？
- [ ] Echo 有掌骨而 Mixamo 没有——重定向时怎么处理？
- [ ] `LinkedAnimGraph` 的使用场景和优势？
- [ ] 多人游戏中武器挂载的流程有什么不同？

完成本章后，你应该能独立完成"走近武器→拾取→挂载到手上→切换持武器动画"的完整流程，并理解背后的引擎机制。

---

## 参考资源

- [虚幻5 C++ 游戏开发从入门到秃头 — B站合集](https://www.bilibili.com/video/BV1Wk9EYvEoy)
- [WintermelonC 文档 - Chapter 11](https://wintermelonc.github.io/WintermelonC_Docs/application/unreal_engine/cpp/ch11.html)
- [Epic 官方 - IK Rig 动画重定向](https://dev.epicgames.com/documentation/unreal-engine/ik-rig-animation-retargeting-in-unreal-engine)
- [Epic 官方 - 运行时 IK 重定向](https://dev.epicgames.com/documentation/unreal-engine/runtime-ik-retargeting-in-unreal-engine)
