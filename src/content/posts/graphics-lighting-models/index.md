---
title: 光照模型完全解析：Phong、Blinn-Phong 与 PBR，从面试到实战
published: 2026-08-21
description: 图形学面试高频考点：冯氏光照模型三要素（环境光/漫反射/镜面反射）、Phong 与 Blinn-Phong 的区别、PBR 核心概念（BRDF/金属度/粗糙度/能量守恒）。附 GLSL 实现、面试标准答案与游戏引擎对比。
image: api
tags: [图形学, 光照, Phong, Blinn-Phong, PBR, 着色器, 面试, 游戏客户端]
category: 图形学
draft: false
---

> 这是求职路线图「阶段二：引擎落地」图形学方向的第二篇产出（承接《[渲染管线完全图解](/posts/graphics-rendering-pipeline/)》）。光照是图形学面试第二高频考点——渲染管线讲"怎么画"，光照讲"画成什么样"。本文从经典冯氏模型讲到现代 PBR，每节附 GLSL 代码和面试标准答案。

---

## 一、为什么需要光照模型

没有光照的世界是扁平的——所有物体只有颜色，没有明暗，看不出立体感。光照模型的目标：**模拟光线与表面的交互，计算每个像素的最终颜色**。

渲染管线里，光照计算发生在**片元着色器**（逐像素）中，输入是法线、位置、UV、材质参数，输出是颜色。

---

## 二、冯氏光照模型（Phong Lighting Model）

经典冯氏模型把光照拆成**三个独立分量**相加：

```
最终颜色 = 环境光(Ambient) + 漫反射(Diffuse) + 镜面反射(Specular)
```

### 2.1 环境光（Ambient）——粗糙的全局近似

真实世界里，光会到处反弹（间接光照）。实时渲染里做完整的光线追踪太贵，于是用一个**常量近似**：假设到处都有一点光。

```glsl
float ambientStrength = 0.1;
vec3 ambient = ambientStrength * lightColor;
```

**本质**：这只是一个 hack——用常数模拟间接光照，让背光面不至于全黑。它不随方向变化，代价极低。

### 2.2 漫反射（Diffuse）——粗糙表面的散射

光线打到粗糙表面会向四面八方散射，观察者看到的是"被反射到各个方向的总光量"。**关键：表面越正对光源，接收的光越多。**

```glsl
// 法线与光源方向的夹角决定亮度：dot(N, L) 越大越亮
vec3 norm = normalize(Normal);
vec3 lightDir = normalize(lightPos - FragPos);
float diff = max(dot(norm, lightDir), 0.0);   // 夹角 > 90° 时取 0
vec3 diffuse = diff * lightColor;
```

**朗伯定律（Lambert's Law）**：漫反射强度 ∝ cosθ = dot(N, L)。**漫反射与观察方向无关**——粗糙表面散射均匀，从哪个角度看都一样。

### 2.3 镜面反射（Specular）——光滑表面的高光

光滑表面把光**集中反射**到特定方向，只有观察方向接近反射方向时才看得到高光。

**Phong 的实现**：计算反射向量 R，与观察方向 V 比较：

```glsl
// R = reflect(-L, N)  —— 入射光关于法线的反射
vec3 viewDir = normalize(viewPos - FragPos);
vec3 reflectDir = reflect(-lightDir, norm);
float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
vec3 specular = spec * specularStrength * lightColor;
```

- **shininess（反光度）**：控制高光大小，越大高光越集中（越"金属"），典型值 32/64/128
- 高光颜色通常等于光源颜色（金属材质可自定义）

### 2.4 完整实现

```glsl
void main() {
    // 环境光
    vec3 ambient = ambientStrength * lightColor;

    // 漫反射
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPos - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;

    // 镜面反射
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = spec * specularStrength * lightColor;

    vec3 result = (ambient + diffuse + specular) * objectColor;
    FragColor = vec4(result, 1.0);
}
```

---

## 三、Blinn-Phong：Phong 的经典优化

**Phong 的缺陷**：当观察方向与反射方向夹角 > 90° 时，`dot(V, R)` 为负，高光瞬间消失——物体边缘出现**高光断裂**。

**Blinn-Phong 的核心改进**：用**半程向量（Halfway Vector）**代替反射向量：

```glsl
// 半程向量：光源方向与观察方向的中间方向
vec3 halfwayDir = normalize(lightDir + viewDir);
float spec = pow(max(dot(norm, halfwayDir), 0.0), shininess);
```

| 对比 | Phong | Blinn-Phong |
|---|---|---|
| 计算对象 | 反射向量 R 与观察方向 V 的点积 | 法线 N 与半程向量 H 的点积 |
| 计算量 | 需要 reflect() | 只需加法+归一化，**更快** |
| 高光质量 | 边缘可能断裂 | 更平滑，无断裂 |
| 高光形状 | — | 同样 shininess 下高光略大（可调大 shininess 修正） |

> **面试标准答案**：Blinn-Phong 用光源与视角方向的半程向量 H 代替 Phong 的反射向量 R，与法线点乘得到高光。因为半程向量只需一次向量加法与归一化（reflect 要两次点乘和一次向量缩放），**计算更快且不会出现高光断裂**，是 Phong 的实际优化版本。游戏引擎（含 UE 的移动管线）默认使用 Blinn-Phong 风格。

**为什么半程向量能近似反射向量**：当 V 接近 R 时，H 接近 N——`dot(N, H)` 高 ⇔ `dot(R, V)` 高。数学上等价，实现上更优。

---

## 四、PBR：物理正确的光照（现代标准）

PBR（Physically Based Rendering，基于物理的渲染）是《鸣潮》《原神》等现代游戏的**标准渲染方案**。核心思想：**用符合物理规律的方式描述材质与光照**，让不同光照环境下材质表现一致。

### 4.1 三大原则

1. **能量守恒**：反射的能量 + 折射/吸收的能量 = 入射能量（不可能反射超过入射的光）
2. **基于微表面**：表面由无数微小平面组成，粗糙度决定微表面朝向分布
3. **基于物理的材质参数**：金属度（Metallic）、粗糙度（Roughness）等可直观调整

### 4.2 BRDF：双向反射分布函数

**BRDF（Bidirectional Reflectance Distribution Function）**：描述"给定入射方向的光，有多少被反射到给定出射方向"。光照计算的核心就是**对 BRDF 的积分**：

```
L_o = ∫ BRDF(wi, wo) × L_i × cosθi dωi
```

**反射率方程**：出射辐射度 = 半球上所有入射光 × BRDF × 入射角余弦的积分。

### 4.3 Cook-Torrance BRDF（金属工作流）

```
f = kd × f_lambert + ks × f_cook-torrance
```

| 项 | 作用 | 公式 |
|---|---|---|
| **漫反射项**（Lambert） | 非金属的漫反射 | `c/π` |
| **法线分布函数 D**（NDF） | 微表面朝向分布，控制高光形状 | GGX/Trowbridge-Reitz |
| **几何遮蔽 G** | 微表面互相遮挡（自阴影） | Smith's Schlick-GGX |
| **菲涅尔 F** | 掠射角反射增强（水面的反射） | Schlick 近似 |

```glsl
// GGX 法线分布函数（高光形状）
float D_GGX(vec3 N, vec3 H, float roughness) {
    float a  = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH * NdotH;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    return a2 / (PI * denom * denom);
}

// Schlick 菲涅尔近似（掠射角反射增强）
vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}
```

### 4.4 金属度（Metallic）与粗糙度（Roughness）

| 参数 | 含义 | 效果 |
|---|---|---|
| **Metallic** 0~1 | 是否金属 | 金属：无漫反射、反射带颜色（F0 用 baseColor）；非金属：有漫反射、反射无色（F0≈0.04） |
| **Roughness** 0~1 | 表面粗糙度 | 0 镜面（清晰高光），1 粗糙（漫反射为主） |
| **BaseColor** | 基础色 | 金属时是反射颜色，非金属时是漫反射颜色 |

**为什么金属没有漫反射**：金属的自由电子会立即吸收并重新发射入射光，所以光无法进入表面内部散射——金属只有镜面反射。

### 4.5 环境光照：IBL 与天空盒

PBR 场景通常配合**基于图像的光照（IBL）**——用预计算的天空盒/环境贴图提供环境光：

- **漫反射 IBL**：预计算辐照度图（Irradiance Map），半球积分
- **镜面 IBL**：预滤波环境图（Prefiltered Environment Map）+ BRDF 查找表（LUT）
- **阴影**：CSM（级联阴影）用于方向光

**UE 的实现**：`SkyLight` + `Reflection Capture` 提供 IBL；Lumen（UE5）做实时全局光照 GI，是 IBL 的进一步扩展。

---

## 五、面试对比总表

| 问题 | 答案 |
|---|---|
| 冯氏三要素 | 环境光（常数近似间接光）+ 漫反射（dot(N,L)，与视角无关）+ 镜面反射（dot(R,V)，与视角有关） |
| Phong vs Blinn-Phong | Blinn 用半程向量 H=(L+V)/|L+V| 替代反射向量 R，更快、无高光断裂 |
| 为什么漫反射与视角无关 | 朗伯散射：粗糙表面均匀散射，各方向亮度相同 |
| PBR 三大原则 | 能量守恒、微表面、物理材质参数 |
| 金属为什么无漫反射 | 自由电子立即重发射入射光，光无法进入表面散射 |
| F0 是什么 | 垂直入射（θ=0）时的菲涅尔反射率：非金属≈0.04，金属=baseColor |
| UE 的 PBR | Metallic/Roughness 工作流 + SkyLight IBL + Lumen GI |

---

## 六、总结：一份面试 Checklist

- [ ] 冯氏光照三要素分别是什么？各模拟什么物理现象？
- [ ] 漫反射为什么与观察方向无关？
- [ ] Phong 高光在什么情况下会断裂？Blinn-Phong 如何解决？
- [ ] 半程向量怎么计算？为什么它能近似反射向量？
- [ ] PBR 的三大原则是什么？
- [ ] BRDF 是什么？反射率方程表达什么？
- [ ] 金属度/粗糙度各自控制什么？金属为什么没有漫反射？
- [ ] 菲涅尔效应是什么？Schlick 近似公式？
- [ ] IBL 是什么？UE 里怎么提供环境光？
- [ ] UE5 的 Lumen 解决什么问题？与 IBL 的关系？

把 Phong 的 GLSL 完整写一遍，再改成 Blinn-Phong，观察高光变化——动手一次胜过背十遍。

---

## 参考资源

- [LearnOpenGL CN — 光照基础（Phong/Blinn-Phong）](https://learnopengl-cn.github.io/02%20Lighting/02%20Basic%20Lighting/)
- [LearnOpenGL CN — 光照贴图/投光物](https://learnopengl-cn.github.io/02%20Lighting/04%20Lighting%20maps/)
- [LearnOpenGL CN — PBR 理论](https://learnopengl-cn.github.io/07%20PBR/01%20Theory/)
- [Unreal Engine — 物理材质（PBR）文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/physically-based-materials-in-unreal-engine)
- [LearnOpenGL — PBR/IBL 系列（英文原版）](https://learnopengl.com/PBR/IBL/Diffuse-irradiance)
