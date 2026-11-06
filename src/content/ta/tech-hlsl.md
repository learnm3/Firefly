---
title: "技术向 02 · HLSL 自定义节点模板"
order: 21
description: "Rim Light / Dissolve / 扫描线 / 三平面 / 后处理材质模板。"
draft: false
---

> 用途：第 2 周写 Shader 时直接抄结构、改参数；面试前复习原理。
> 说明：所有模板都是**单输出** Custom Node；需要多通道时输出 Float3/Float4，再在材质里用 Component Mask 拆。
> 输入引脚在 Custom Node 的 Details 面板 → **Inputs** 里添加（名称 + 类型），代码里直接用名称。

---

## 0. Custom Node 基本用法（5 分钟）

1. 材质编辑器右键 → 搜索 `Custom` → 放置 Custom 节点。
2. Details 面板：
   - `Description`：写清效果名（如 `RimLight`）。
   - `Output Type`：`CMOT Float 3`（颜色）或 `CMOT Float 1`（遮罩）。
   - `Inputs`：点 `+` 添加输入，命名（如 `Normal`，类型 Float3）。
   - `Code`：写 HLSL，`return` 对应输出类型。
3. 把材质节点连到对应输入；改完点 **Apply**，看 Stats 面板的指令数。
4. 出问题先看 **Compile** 错误信息，再用 `Preview Material Quality Level` 逐级测试。

**通用技巧**
- 除法前 `max(x, 1e-4)` 防除零；颜色结果 `saturate` 或手动限幅。
- 能用 `lerp/step/smoothstep` 就别写 `if`。
- 每个效果都记录：**参数表 + 指令数 + 截图**，否则不算完成。

---

## 1. 模板 1 · Rim Light（菲涅尔边缘光）

**效果**：角色/物体轮廓出现一圈光，逆光时最有氛围。
**输出类型**：`CMOT Float 3`，接 **Emissive Color**。

**输入**
| 名称 | 类型 | 从哪来 |
| --- | --- | --- |
| Normal | Float3 | `VertexNormalWS` |
| WorldPos | Float3 | `AbsoluteWorldPosition` |
| CameraPos | Float3 | `CameraPosition` |
| RimColor | Float3 | `VectorParameter` |
| RimPower | Float1 | `ScalarParameter`（2–8） |
| RimIntensity | Float1 | `ScalarParameter`（0–5） |

**代码**
```hlsl
float3 N = normalize(Normal);
float3 V = normalize(CameraPos - WorldPos);
float rim = pow(1.0 - saturate(dot(N, V)), max(RimPower, 0.001));
return RimColor * (rim * RimIntensity);
```

**调参**：RimPower 越大边缘越窄；RimIntensity 别过曝；配合 Bloom 阈值会更"发光"。
**进阶**：乘一个颜色渐变（Ramp）做冷暖分离；乘遮罩只在头发/布料上出现。
**性能**：极便宜（几次点乘 + pow），放心用。

---

## 2. 模板 2 · Dissolve 溶解（带边缘发光）

**效果**：物体逐渐溶解，边缘有一圈亮边；常用于技能/传送/消失。
**输出类型**：`CMOT Float 3`；材质 **Blend Mode = Masked**。
**通道约定**：`R = Mask（不透明度遮罩）`，`G = Edge（边缘强度）`，`B = 0`。

**输入**
| 名称 | 类型 | 从哪来 |
| --- | --- | --- |
| Noise | Float1 | 用 `Texture Sample` 采样一张噪声图，取 R 通道（或 Noise 节点） |
| T | Float1 | `ScalarParameter`：溶解进度 0→1 |
| Soft | Float1 | `ScalarParameter`：遮罩软边（0.01–0.1） |
| EdgeWidth | Float1 | `ScalarParameter`：发光边宽（0.02–0.15） |
| EdgeSharpness | Float1 | `ScalarParameter`：边缘锐度（1–8） |

**代码**
```hlsl
float n = saturate(Noise);
float d = n - T;
// 遮罩：d > Soft 时保留（1），d < -Soft 时消失（0）
float mask = smoothstep(-Soft, Soft, d);
// 边缘：只在 d 接近 0 的带内为 1
float edge = 1.0 - saturate(abs(d) / max(EdgeWidth, 1e-4));
edge = pow(edge, max(EdgeSharpness, 1.0)) * step(0.0, mask);
return float3(mask, edge, 0.0);
```

**材质里怎么接**
- Custom 节点输出 → `Component Mask`（R）→ **Opacity Mask**。
- 同一个输出 → `Component Mask`（G）→ 乘 `EdgeColor`（VectorParameter）→ **Emissive Color**。
- 噪声贴图建议用平铺噪声（Tileable Noise），UV 用 `TexCoord`，两套 UV 叠加更自然。
- 要做"烧焦"效果：边缘乘深色 + 内部 BaseColor 变暗。

**性能**：多一次噪声贴图采样；Masked 材质会有额外开销，面积大时注意。

---

## 3. 模板 3 · 扫描线 / UV 流动

**效果**：科技感扫描线、能量流动、雷达波。
**输出类型**：`CMOT Float 1`，乘到 Emissive/Color 上。

**输入**
| 名称 | 类型 | 从哪来 |
| --- | --- | --- |
| UV | Float2 | `TexCoord` |
| Time | Float1 | `Time` 节点 |
| Speed | Float1 | `ScalarParameter`（0.1–3） |
| Frequency | Float1 | `ScalarParameter`（1–20） |
| Threshold | Float1 | `ScalarParameter`（0.5–0.95） |

**代码**
```hlsl
float s = sin((UV.y * Frequency - Time * Speed) * 6.2831853);
float line = smoothstep(Threshold, 1.0, s);
return line;
```

**变体**
- 水平流动：把 `UV.y` 换成 `UV.x`。
- 双向扫描：`abs(sin(...))` 再 smoothstep。
- 加一层噪声让线不完美：`line *= lerp(0.6, 1.0, noise)`。
- 用 `frac` 做硬边：`step(0.95, frac(UV.y * Frequency - Time * Speed))`。

**性能**：三角函数略贵但可接受；大面积使用时用材质质量级别降级。

---

## 4. 模板 4 · Triplanar 三平面映射（节点版，不用 HLSL）

**为什么用节点**：三平面要采样 3 次贴图，用节点更直观、好调、不容易写错采样器。
**用途**：没有 UV 的资产（扫描/建模废 UV/大世界）也能贴图，且无接缝。

**节点步骤**
1. `Absolute World Position` → 拆 `X/Y/Z` 三个分量（Component Mask）。
2. 组合三套 UV：
   - UV_X = Append(Y, Z)
   - UV_Y = Append(X, Z)
   - UV_Z = Append(X, Y)
3. 三个 `Texture Sample` 用同一张贴图，分别接三套 UV。
4. `VertexNormalWS` → 取 `abs` → 加一个 `Power`（BlendSharpness，4–8）→ 得到三轴权重。
5. 权重相加后 `Divide` 归一化（或按 UE 教程用 `Dot` 归一化）。
6. 三个采样结果 × 权重 → `Add` → 输出。
7. 贴图 Tiling：在 UV 上乘 `Tiling`（ScalarParameter），三套用同一个值。

**参数表**：Tiling（1–10）、BlendSharpness（2–8）、贴图（颜色/法线各一套）。
**性能**：3 次贴图采样，比普通 UV 贵 3 倍；远景/小物体用普通 UV。
**注意**：法线三平面要做切线空间转换，第一次先只做颜色，别一上来就搞法线。

---

## 5. 模板 5 · 后处理材质 · 暗角 + 简单描边

**暗角（Vignette）**
1. 新建材质，`Material Domain = Post Process`。
2. 节点：`ScreenPosition`（或 `TextureCoordinate`）→ 减 0.5 → 长度 → `SmoothStep(0.2, 0.8, len)` → 取反 → 乘暗角强度。
3. 输出到 `Emissive Color`，Blend 用默认（后处理材质输出即叠加）。
4. 参数：VignetteIntensity、VignetteRadius。

**描边（简化版）**
1. 后处理材质，`SceneTexture: PostProcessInput0` 采样当前画面。
2. 用 `SceneTexture: SceneDepth` 做深度差（相邻像素）→ 边缘检测；或 `SceneTexture: WorldNormal` 法线差。
3. 边缘 × 描边颜色 → 叠加到原图。
4. 先做深度描边（简单），再做 Normal 描边（效果更好）。
> 描边对性能敏感，1080p 全屏后处理要测帧时间；8GB 显存下别叠太多后处理。

---

## 6. 调试与性能技巧

| 问题 | 处理 |
| --- | --- |
| 编译报错 | 看错误行号；检查输入名与类型；HLSL 不认的语法（如 `float3x3` 初始化写法） |
| 结果全黑/全白 | 检查连线和输出类型；用 `return 1.0`/`return 0.0` 二分定位 |
| 效果在远处闪 | 精度问题：用 `saturate`/`max` 限幅，避免大数相除 |
| 材质太贵 | Stats 看指令数；减少采样；合并节点；用材质质量级别 |
| 半透明排序错 | 记录问题；用 Masked 替代；或分层/深度预 pass |
| 想快速验证 | `Preview Material Quality Level` 逐级测；`viewmode shadercomplexity` 看红色区域 |

**每个 Shader 的交付格式**
```
效果名：
参数表：参数 / 默认值 / 范围 / 影响
节点图：截图
指令数：__（材质 Stats）
性能：__ms 或"可忽略"（stat gpu 对比）
原理：3 行以内
踩坑：1–2 条
```

---

## 7. 练习顺序（配合 30 天计划）

| 天 | 模板 | 交付 |
| --- | --- | --- |
| D9 | 模板 1 Rim Light | GIF + 参数表 |
| D10 | 模板 2 Dissolve | GIF + 代码 + 边界说明 |
| D11 | 模板 3 扫描线 | 2 个 GIF（扫描线/能量流） |
| D12 | 模板 4 Triplanar | 对比图（有 UV vs 无 UV 接缝） |
| D13 | 模板 5 后处理 | 暗角 + 描边 GIF |
| D14 | 全部整理进 Material Lab v0.1 | 一页文档 + 性能表 |

---

*下一篇：`03_性能记录模板.md`*
