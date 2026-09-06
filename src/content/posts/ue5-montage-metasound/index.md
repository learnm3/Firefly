---
title: UE5 C++ 动画蒙太奇与 MetaSound：从代码里驱动动画和音频
published: 2026-08-08
description: 以《虚幻5 C++ 游戏开发从入门到秃头》第23集为蓝本，系统梳理 C++ 播放动画蒙太奇（Montage）、AnimNotify 通知回调、动作状态机防打断、MetaSound 程序化音频系统、脚步声与武器音效实现，并延伸面试常考的 Montage vs Sequence 区别、MetaSound vs SoundCue 对比、动画与音频的 C++ 控制链路。
image: ""
tags: [UE5, C++, Montage, MetaSound, 动画, 音频, 游戏开发, 面试]
category: 游戏开发
draft: false
---

> 本文基于 B 站教程《[虚幻5 C++ 游戏开发从入门到秃头](https://www.bilibili.com/video/BV1Wk9EYvEoy)》第 23 集整理，UP 主**黑子的游戏空间**。本集覆盖动画蒙太奇 C++ 播放、MetaSound 程序化音频、脚步声与武器音效等，是让你的角色"动起来并且有声音"的关键一课。

---

## 本章全景

第 8 集你让角色能走路了，第 11 集你让角色能拿武器了，这一集你让角色能**挥剑 + 发出声音**。

本集三个核心主题：

| 模块 | 解决什么问题 |
|---|---|
| **Montage from C++** | 按下攻击键 → 播放挥剑动画，用代码控制动画逻辑而非蓝图 |
| **Sound Notify + MetaSound** | 动画特定帧发出声音（踏地声、挥剑破空声），用程序化音频替代传统 SoundCue |
| **Action State Machine** | 防止"边攻击边走路"——用枚举状态机管理角色的动作优先级 |

---

## 一、Montage（动画蒙太奇）基础

### 1.1 Montage 是什么

在 UE 动画系统中，有三种核心资产：

| 资产 | 用途 | 是否可拆分 |
|---|---|---|
| **Animation Sequence** | 一段连续动画（待机、走路循环） | ❌ 不可分段 |
| **Animation Montage** | 将多段动画拼接，按 Section 分段播放 | ✅ 可分 Section |
| **Blend Space** | 按参数（如速度、方向）混合多个动画 | — |

Montage 的优势在于它专为**一次性的、可被打断的动作**设计——攻击、受击、换弹、互动——这些不是循环动画，而是"触发→播放→结束"的事件。

### 1.2 Montage 关键特性

- **Section**：将 Montage 切分为多个命名段落（`Attack1`、`Attack2`、`AttackEnd`），C++ 可以跳转到任意 Section
- **Slot**：Montage 播放时占据动画蓝图的一个 Slot 节点，与基础运动（走路/待机）混合
- **AnimNotify**：在 Montage 时间轴的特定帧触发 C++ 函数——挥剑的"造成伤害"帧、踏地的"发出声音"帧

---

## 二、C++ 播放 Montage：完整链路

### 2.1 基础代码

```cpp
// 角色头文件
UPROPERTY(EditAnywhere, Category = "Combat")
UAnimMontage* AttackMontage;

void PlayAttackMontage();
```

```cpp
void ASlashCharacter::PlayAttackMontage()
{
    UAnimInstance* AnimInstance = GetMesh()->GetAnimInstance();
    if (!AnimInstance || !AttackMontage) return;

    // 播放蒙太奇（不指定 Section 则从头播放）
    AnimInstance->Montage_Play(AttackMontage);

    // 随机选择连击段落
    const int32 Selection = FMath::RandRange(0, 1);
    FName SectionName = (Selection == 0) ? FName("Attack1") : FName("Attack2");
    AnimInstance->Montage_JumpToSection(SectionName, AttackMontage);
}
```

> **`Montage_Play` vs `Montage_JumpToSection`**：`Montage_Play` 启动播放并返回播放时长；`Montage_JumpToSection` 跳转到指定 Section。通常先 Play 再 Jump——Play 初始化 Montage 实例，Jump 定位到目标段落。

### 2.2 核心 API 速查

```cpp
// 播放
float Length = AnimInstance->Montage_Play(Montage, PlayRate, EMontagePlayReturnType::MontageLength);

// 跳转 Section
AnimInstance->Montage_JumpToSection(SectionName, Montage);

// 暂停/恢复
AnimInstance->Montage_Pause(Montage);
AnimInstance->Montage_Resume(Montage);

// 停止（可设置 BlendOut 时间做平滑过渡）
AnimInstance->Montage_Stop(BlendOutTime, Montage);

// 查询播放状态
bool bIsPlaying = AnimInstance->Montage_IsPlaying(Montage);
float CurrentPos = AnimInstance->Montage_GetPosition(Montage);
FName CurrentSection = AnimInstance->Montage_GetCurrentSection(Montage);

// 设置下一 Section（当前 Section 播完后自动跳转）
AnimInstance->Montage_SetNextSection(CurrentSection, NextSection, Montage);
```

### 2.3 防止攻击被打断：动作状态机

这是本集最重要的设计模式。如果不加约束，角色可能在攻击动画播放期间还能走路——出现"滑步攻击"。

```cpp
UENUM(BlueprintType)
enum class EActionState : uint8
{
    EAS_Unoccupied   UMETA(DisplayName = "Unoccupied"),
    EAS_Attacking    UMETA(DisplayName = "Attacking"),
    EAS_Equipping    UMETA(DisplayName = "Equipping"),
    EAS_HitReacting  UMETA(DisplayName = "HitReacting"),
    EAS_Dead         UMETA(DisplayName = "Dead")
};

// 攻击前检查
bool ASlashCharacter::CanAttack() const
{
    return ActionState == EActionState::EAS_Unoccupied;
}

void ASlashCharacter::Attack()
{
    if (!CanAttack()) return;

    ActionState = EActionState::EAS_Attacking;
    PlayAttackMontage();
}

// AnimNotify 在 Montage 末尾调用
void ASlashCharacter::AttackEnd()
{
    ActionState = EActionState::EAS_Unoccupied;
}
```

**动画蓝图中配合**：读取 `ActionState`，在 `Attacking` 状态时禁止移动输入（`AddMovementInput` 中做 early return）。

> **面试追问：为什么状态机不放动画蓝图里，要放 C++？**
>
> 动画蓝图是**表现层**——负责"怎么播"，C++ 是**逻辑层**——负责"什么时候能做什么"。把 `CanAttack` 放 C++ 意味着你可以在这里加更多条件：是否有耐力、是否被眩晕、武器是否在手上。动画蓝图不应该知道这些游戏逻辑。

---

## 三、AnimNotify：动画和逻辑的桥梁

### 3.1 为什么需要 AnimNotify

Montage 播放时，有些时间点需要执行游戏逻辑：
- 第 0.3 秒：武器碰撞检测开启（开始有伤害）
- 第 0.6 秒：武器碰撞检测关闭（收招）
- 第 0.8 秒：Montage 结束，恢复 `Unoccupied` 状态

这些时间点是**美术驱动的**——动画师调整挥剑节奏——所以应该定义在动画资产上，而非代码里硬编码秒数。

### 3.2 C++ 侧实现

```cpp
// 在 AnimNotify 的 C++ 子类中
UCLASS()
class UAnimNotify_AttackEnd : public UAnimNotify
{
    GENERATED_BODY()

    virtual void Notify(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation) override
    {
        if (MeshComp == nullptr) return;

        ASlashCharacter* Character = Cast<ASlashCharacter>(MeshComp->GetOwner());
        if (Character)
        {
            Character->AttackEnd();
        }
    }
};
```

更灵活的做法是用 `UAnimNotifyState`（有 `NotifyBegin`、`NotifyTick`、`NotifyEnd` 三个阶段），适合"攻击判定窗口"这种持续一段时间的逻辑：

```cpp
UCLASS()
class UAnimNotifyState_WeaponCollision : public UAnimNotifyState
{
    virtual void NotifyBegin(USkeletalMeshComponent* MeshComp,
        UAnimSequenceBase* Animation, float TotalDuration) override
    {
        // 开启武器碰撞检测
    }

    virtual void NotifyEnd(USkeletalMeshComponent* MeshComp,
        UAnimSequenceBase* Animation) override
    {
        // 关闭武器碰撞检测
    }
};
```

---

## 四、MetaSound：UE5 新一代音频系统

### 4.1 MetaSound 解决什么问题

传统 UE 音频使用 **SoundCue**——用节点图编辑音频行为。MetaSound 是它的继任者，核心差异：

| | SoundCue | MetaSound |
|---|---|---|
| 编辑器 | 有限的节点图 | 完整的 DSP 蓝图编辑器 |
| 参数控制 | 有限（通过 SoundClass） | 任意输入参数，C++ 运行时控制 |
| 精度 | 帧级别 | **采样级别**（48kHz 下 0.02ms） |
| 渲染 | 单线程 | 异步并行渲染 |
| 预设系统 | ❌ | ✅ Preset（修改基类自动传播） |
| 数组操作 | ❌ | ✅ WavePlayer 数组 + Random/Shuffle |

一句话总结：MetaSound 把音频变成了**可编程的 DSP 管线**，而不是一个"声音文件播放器"。

### 4.2 创建随机脚步声 MetaSound

```
[MetaSound Editor]
    Input: (无外部输入)
    
    [Wave Player Array] ──────────────────────┐
      ├─ footstep_grass_01.wav               │
      ├─ footstep_grass_02.wav               │
      ├─ footstep_grass_03.wav        [Random Node]
      └─ footstep_grass_04.wav               │
                                              ▼
    [Pitch Shift] ←── Random Float (-200, +200 cents)
         │
         ▼
    [Gain] ←── Random Float (0.8, 1.2)
         │
         ▼
    [Output]
```

运行时每次触发播放，系统随机选一个波形文件、随机偏音高、随机调音量——四五个音效素材就能组合出几十种"不同"的脚步声。

### 4.3 C++ 控制 MetaSound 参数

```cpp
// 生成 MetaSound 并持有 AudioComponent（保留控制权）
UAudioComponent* AudioComp = UGameplayStatics::SpawnSound2D(
    GetWorld(), MetaSoundAsset);

// 动态修改参数
AudioComp->SetFloatParameter(FName("PitchShift"), 1.2f);
AudioComp->SetIntParameter(FName("FootSurface"), 2);     // 0=grass, 1=wood, 2=stone
AudioComp->SetBoolParameter(FName("IsSprinting"), true);
AudioComp->SetTriggerParameter(FName("OnJumpLand"));     // 触发一次性事件

// C++ 中生成带衰减和位置的 3D 音效
UAudioComponent* AudioComp3D = UGameplayStatics::SpawnSoundAtLocation(
    GetWorld(), MetaSoundAsset, HitLocation, FRotator::ZeroRotator,
    1.0f,    // VolumeMultiplier
    1.0f,    // PitchMultiplier
    0.0f,    // StartTime
    AttenuationSettings,  // USoundAttenuation*
    nullptr  // ConcurrencySettings
);
```

### 4.4 AnimNotify + MetaSound 集成

在 Montage 编辑器中，时间轴上添加 **Play MetaSound Notify**，将 MetaSound 资产拖入即可。脚步落地帧放脚步声 MetaSound，挥剑关键帧放破空声音效。

> **更高级的用**法：创建自定义 `UAnimNotify` 子类，在其中用 `SpawnSoundAtLocation` 生成带位置衰减的 3D 音效——这样远处的玩家听到的攻击声会自然变小。

---

## 五、面试延伸

### 5.1 Montage vs Sequence vs BlendSpace

| | Animation Sequence | Montage | Blend Space |
|---|---|---|---|
| 循环播放 | ✅ | ❌（一次性） | ✅ |
| 分段跳转 | ❌ | ✅ Section | ❌ |
| 参数混合 | ❌ | ❌ | ✅ |
| 动画通知 | ✅ | ✅ | ✅ |
| 被打断 | — | ✅ 可 BlendOut | — |
| 典型用途 | 待机/走路 | 攻击/受击/换弹 | 走跑切换/瞄准偏移 |

### 5.2 为什么 Montage 播放要用 Slot

动画蓝图的 AnimGraph 中有一个 **Slot 节点**（通常命名为 `DefaultSlot`）。当 Montage 播放时，它"占据"这个 Slot，与基础运动姿态做叠加混合。这意味着：

- 上半身播攻击动画 + 下半身继续走路 = 上半身 Slot 权重 1.0，下半身 Slot 权重 0.0
- Slot 的 BlendIn/BlendOut 参数控制动画过渡的平滑程度

面试时能说出"Slot 机制如何实现动画分层"会加分。

### 5.3 MetaSound vs SoundCue 选型

**面试标准答案**：

| 场景 | 推荐 |
|---|---|
| 简单音效（UI 按钮、菜单） | SoundCue / 直接 Wave |
| 复杂交互音效（脚步、武器、环境） | MetaSound |
| 需要运行时参数控制 | MetaSound |
| 老项目已有大量 SoundCue | 保持 SoundCue，新需求用 MetaSound |

> MetaSound 是 UE5 的战略方向，SoundCue 不会被移除但不再新增功能。

### 5.4 动作状态机扩展

`EActionState` 的优先级设计是一个容易被深挖的面试点：

```
Dead > HitReacting > Attacking > Equipping > Unoccupied
```

- 死了不能做任何事
- 受击时不能攻击（除非游戏允许"霸体"）
- 攻击中不能换装备
- 只有 `Unoccupied` 时才能发起新动作

一个健壮的动作状态机还应该考虑：状态转换是否可中断（攻击 BlendOut 0.1s vs 受击 BlendOut 0.0s 立即打断）、网络同步下状态冲突如何处理。

---

## 六、常见坑汇总

| 问题 | 原因 | 解决 |
|---|---|---|
| Montage 播放无效果 | 动画蓝图中没有 Slot 节点 | AnimGraph 加 `DefaultSlot` 节点 |
| 攻击中还能移动 | 移动输入没有检查 ActionState | `MoveForward` 开头加 `if (ActionState != EAS_Unoccupied) return;` |
| Montage 播完无法再攻击 | `AttackEnd` AnimNotify 未触发 | 检查 Montage 末尾是否放置了 Notify 轨道 |
| MetaSound 参数设置无效 | 参数名大小写或拼写不匹配 | 从 MetaSound 编辑器复制 Input 节点名 |
| `Montage_JumpToSection` 不生效 | Section 名称不匹配 | 在 Montage 编辑器中确认 Section 名称（区分大小写） |
| 音效没有距离衰减 | 未设置 `SoundAttenuation` | 创建 `SoundAttenuation` 资产并指定给 MetaSound 或 `SpawnSoundAtLocation` |

---

## 七、自测清单

- [ ] Montage 和 Animation Sequence 的核心区别？什么时候用哪个？
- [ ] `Montage_Play` → `Montage_JumpToSection` 的调用顺序？为什么不能反过来？
- [ ] `EActionState` 状态枚举的设计原则？为什么放 C++ 而不是动画蓝图？
- [ ] `UAnimNotify` 和 `UAnimNotifyState` 的区别？
- [ ] MetaSound 比 SoundCue 强在哪里？说三个点。
- [ ] MetaSound 的 Preset 系统解决了什么问题？
- [ ] 如何在 C++ 中动态修改 MetaSound 的播放参数？
- [ ] Montage 的 Slot 机制如何实现"上半身攻击、下半身走路"？
- [ ] 如果攻击 Montage 在播放中被另一个 Montage 打断，BlendOut 参数起什么作用？

---

## 参考资源

- [虚幻5 C++ 游戏开发从入门到秃头 — B站合集](https://www.bilibili.com/video/BV1Wk9EYvEoy)
- [虚幻5---第12部分---蒙太奇（CSDN）](https://blog.csdn.net/bububububuDDD/article/details/157399000)
- [ARPG C++ 学习记录 Section12 — 蒙太奇与 MetaSound](https://www.e-com-net.com/article/1724381266524057600.htm)
- [Epic 官方 - MetaSound 参考指南](https://dev.epicgames.com/documentation/unreal-engine/metasounds-reference-guide-in-unreal-engine)
