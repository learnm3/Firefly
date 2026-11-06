---
title: "技术向 01 · UE5 技术检查清单"
order: 20
description: "项目设置 / 材质 / 灯光 / 性能 / MRQ 检查表与控制台命令。"
draft: false
---

> 用途：新建项目、每个作品完成前、性能优化前，照着打勾。
> 环境基准：UE 5.7.4 ｜ RTX 4070 Laptop 8GB ｜ 1080p 为主 ｜ 32GB 内存。

---

## 1. 新建项目基线（10 分钟）

### 项目设置（Project Settings）
| 项 | 建议值 | 为什么 |
| --- | --- | --- |
| Default RHI | **DX12** | Lumen/VSM/Nanite 需要 |
| Shader Model | SM6 | 5.7 默认 |
| Dynamic Global Illumination Method | **Lumen** | 实时 GI |
| Reflection Method | **Lumen** | 实时反射 |
| Shadow Map Method | **Virtual Shadow Maps** | 高精度动态阴影 |
| Nanite | **开启** | 高模免减面 |
| Default Feature → Auto Exposure | **关闭** | 美术手动控制曝光 |
| Default Feature → Motion Blur | **关闭**（静帧） | 画面干净；做镜头再开 |
| Texture Streaming Pool | **3500–4500MB**（`r.Streaming.PoolSize`） | 8GB 显存别设满 |
| 生成 Mesh Distance Fields | **开** | Lumen 软件光追需要 |
| 项目路径 | `E:\TA_Workspace\02_Portfolio\...` | 不放桌面/OneDrive/中文路径 |

### 必开插件
- [ ] Python Editor Script Plugin（UE Python 脚本）
- [ ] Editor Scripting Utilities
- [ ] Niagara
- [ ] Movie Render Queue（MRQ）
- [ ] Modeling Tools Editor Mode
- [ ] 实验性插件（Substrate 等）先不开，稳定优先

### 项目内规范
- [ ] 自动保存 10 分钟
- [ ] 内容目录：`/Game/00_Project/{Maps,Materials,Meshes,Textures,Blueprints,Sequences,VFX}`
- [ ] 资产命名：`M_`（材质）、`MI_`（实例）、`MF_`（函数）、`T_`（贴图）、`SM_`（静态网格）、`SK_`（骨骼网格）、`NS_`（Niagara）、`LS_`（Sequencer）
- [ ] 关闭"自动曝光/自动对焦"等自动项（美术控制）
- [ ] 每个项目放一个 `README.md`：目标、参考、技术点、性能、踩坑

---

## 2. 材质技术检查（每个作品必过）

### 结构
- [ ] 一个**母材质**（Master Material）+ 多个**材质实例**（MI）；不在场景里直接改母材质
- [ ] 参数暴露并分类命名：`Color_`、`Roughness_`、`Metallic_`、`NormalStrength_`、`Tiling_`
- [ ] 常用逻辑封装成**材质函数**（MF_），可复用
- [ ] 贴图统一命名 `T_<对象>_<通道>`（D/N/R/M/ORM），2K 为主
- [ ] 法线贴图设置为 Normal Map 压缩、sRGB 关闭；颜色贴图 sRGB 打开
- [ ] 需要透明时明确 Blend Mode：Opaque（默认）→ Masked → Translucent（最后才用）
- [ ] 关闭 Two Sided / 细分等不需要的开关（增加开销）

### 性能
- [ ] 用 `viewmode shadercomplexity` 看整体复杂度（绿色为主）
- [ ] 单材质指令数：常规 < 200，复杂 < 500（材质编辑器 Stats 面板）
- [ ] 减少贴图采样数（每个采样都是带宽）
- [ ] 用材质质量级别（Quality Level）给远景降级
- [ ] 避免无意义的 `if` 分支；用 `lerp/saturate/step` 代替
- [ ] 半透明材质：面积控制、深度预 pass/排序问题记录

### 检查清单（复制到项目 README）
```markdown
- [ ] 母材质 + 实例结构
- [ ] 参数命名规范 + 参数表（名称/默认值/范围）
- [ ] 贴图 2K 为主、法线 sRGB 关闭
- [ ] 无多余 Blend Mode/Two Sided
- [ ] 着色器复杂度截图
- [ ] 指令数记录
```

---

## 3. 灯光 / 后期检查

### 灯光
- [ ] DirectionalLight（太阳）角度/色温/强度有明确意图
- [ ] SkyLight + SkyAtmosphere（或 HDRI）二选一，不重复
- [ ] 三点布光：主光（Key）/补光（Fill）/轮廓光（Rim）；室内加实际光源（灯、窗）
- [ ] 阴影：VSM 分辨率按需；主光阴影质量最高，补光可关阴影
- [ ] 体积雾：先关，最后加；检查性能和画面脏不脏
- [ ] 每张图记录：主光方向/色温/强度、补光比例、曝光补偿

### 后期（PostProcessVolume）
- [ ] 曝光：手动（Auto Exposure 关）+ 曝光补偿调
- [ ] Bloom：阈值和强度一起调，避免"糊成一片"
- [ ] Color Grading：对比度/饱和度/色温/LUT（可选）
- [ ] 景深/暗角：按构图需要，别默认全开
- [ ] 检查顺序：曝光 → 对比 → 色彩 → Bloom → 景深 → 暗角

### MRQ（出图/出片）
- [ ] 分辨率 1920×1080（作品集静帧可 2K）
- [ ] 抗锯齿：Temporal Sample Count 16（日常）→ 64–128（最终）
- [ ] Anti-Aliasing：TSR/TAA 选一个；Spatial Samples 1–2
- [ ] 输出：PNG/EXR（要调色就 EXR 16-bit）
- [ ] 记录：每帧耗时、总耗时、输出路径
- [ ] 出片前检查：运动模糊/景深是否要开、Sequencer 帧率与镜头

---

## 4. 性能预算（8GB 显存 / 1080p）

| 指标 | 建议上限 | 怎么看 |
| --- | --- | --- |
| 帧时间（实时预览目标 30–60fps） | 16.6ms（60fps）/ 33ms（30fps） | `stat unit` 的 Frame/GPU |
| 显存占用 | **< 7GB**（留 1GB 缓冲） | `stat rhi` / 任务管理器 |
| 纹理流送池 | 3500–4500MB | `stat streaming` |
| Draw Call | < 2000–3000（Nanite 会降低） | `stat scenerendering` |
| 可见三角面 | Nanite 场景 10–20M 级别可接受 | `stat scenerendering` |
| 单材质指令数 | 常规 < 200，复杂 < 500 | 材质编辑器 Stats |
| 半透明 Overdraw | 面积控制，避免全屏半透明 | `viewmode shadercomplexity` |
| VSM 阴影分辨率 | 主光 2048–4096，别全 8192 | `stat gpu` 的 Shadow 项 |
| Lumen 硬件光追 | 8GB 下按需开，开了要复测 | 项目设置 + `stat gpu` |

> **判断瓶颈**：`stat unit` 里 GPU ≈ Frame 且 > Game/Draw → GPU 瓶颈；Game/Draw 高 → CPU 瓶颈。先找最大的那一项，不要瞎优化。

---

## 5. 控制台命令速查

```
stat unit                 # Frame / Game / Draw / GPU 四个时间
stat gpu                  # 各 GPU pass 耗时排序
stat scenerendering       # Draw Call / 三角面 / 可见性
stat rhi                  # 显存 / 资源数量
stat streaming            # 纹理流送池与压力
stat memory               # 内存/显存概览
ProfileGPU                # 单帧 GPU 细分（编辑器内）
viewmode shadercomplexity # 着色器复杂度视图（越红越贵）
r.Streaming.PoolSize 4000 # 临时改流送池
FreezeRendering           # 冻结剔除，检查剔除是否正确（谨慎）
r.ScreenPercentage 70     # 降渲染分辨率（测试 GPU 瓶颈）
```

> 截图记录：执行命令后按 `Print Screen`（或 F9 高分辨率截图）存到 `05_Renders/性能/`。

---

## 6. 资产导入检查（Blender → UE）

- [ ] 单位：Blender Metric 1.0；导出 FBX 勾 `Apply Scalings: FBX All`
- [ ] 缩放：导入 UE 后检查（你踩过 0.01 缩放的坑）
- [ ] 轴向：`-Z Forward / Y Up`（UE 约定）
- [ ] 法线：Blender 里 `Shift+N` 重算；导入后检查是否有黑面
- [ ] UV：至少 1 个 UV 通道；检查拉伸/重叠
- [ ] 材质槽：命名清楚，导入后重新赋 UE 材质
- [ ] 贴图：2K 为主，命名 `T_<对象>_<通道>`，法线 sRGB 关闭
- [ ] 碰撞/插槽：按需
- [ ] 导入后看一次 `stat scenerendering` 的三角面数变化

---

## 7. 每个项目完成前的验收单（复制进 README）

```markdown
## 技术验收（YYYY-MM-DD）
- [ ] 项目设置符合基线（Lumen/VSM/Nanite/SM6/自动曝光关）
- [ ] 母材质 + 实例结构，参数表齐全
- [ ] 灯光意图清晰（主光/补光/轮廓光），3 套方案对比
- [ ] 后期参数有记录
- [ ] MRQ 出图 3 张 + 耗时记录
- [ ] 性能基线：stat unit / stat gpu / 显存 / DrawCall / 三角面
- [ ] 至少 1 项优化并记录前后数据
- [ ] 技术 Breakdown 800 字 + 节点图
- [ ] 资产/工具问题已用 PipeCheck 检查并修复
```

---

## 8. 8GB 显存专项（最容易翻车的点）

1. **贴图**：2K 为主；4K 只给 1–2 张特写；大量 4K 会直接爆显存。
2. **Lumen 硬件光追**：画面更真实但更吃显存；8GB 先做软件光追版本，需要时再开并复测。
3. **VSM**：阴影分辨率/缓存会吃显存；主光最高，其他降。
4. **Nanite**：几何便宜但材质/纹理不便宜；别用 Nanite 堆满 4K 贴图。
5. **纹理流送池**：3500–4500MB，不要设成 8192。
6. **MRQ**：2K/4K 出图会非常慢（每帧几十秒到几分钟），耐心等；一次只渲需要的帧。
7. **后台程序**：浏览器/直播/录屏会抢显存和内存；渲染时关掉。
8. **降级顺序**：分辨率 → 阴影 → 贴图 → 后处理 → 半透明 → Lumen 质量。

---

## 9. 常见问题

| 现象 | 优先检查 |
| --- | --- |
| 打开项目卡 / 编译着色器 0% | DDC 路径与空间、Defender 排除、显卡驱动、其他 GPU 程序 |
| 材质全黑 | 母材质连接/贴图 sRGB/UV 通道/光照是否 Lumen |
| 贴图模糊 | Mipmap/流送池太小/贴图分辨率不够 |
| 透明物体闪烁/排序错 | Blend Mode/半透明排序/深度写入 |
| 阴影缺失或锯齿 | VSM 设置/光源移动性/阴影距离 |
| MRQ 出图发灰 | 色彩空间/EXR 与调色/曝光 |
| 模型导入过大/过小 | 单位/FBX 缩放/Apply Scale |
| UE 崩溃 | 显存爆/插件冲突/显卡驱动；看日志 `Saved/Logs` |

---

*配套：`09_技术向_30天启动.md` ｜ `03_性能记录模板.md`*
