---
title: GAMES101 作业1 源码精读：MVP 变换矩阵全解（视图平移 · 罗德里格斯 · 透视投影）
published: 2026-10-21
description: GAMES101 作业1 源码逐段精读。从 main 总装车间（命令行参数解析 + 交互循环）出发，讲透三个核心矩阵函数：get_view_matrix 视图平移、get_rotation 罗德里格斯旋转公式（含叉乘矩阵与数值验证）、get_projection_matrix 透视投影（persp2ortho × ortho 合成，以及深度平移项符号的经典坑）。
image: api
tags: [图形学, GAMES101, MVP, 变换, 透视投影, 罗德里格斯公式, Eigen, C++, 光栅化]
category: 图形学
draft: false
---

> 这是 GAMES101 系列的第 5 篇。前一篇《[作业0 全流程实录](/posts/graphics-games101-assignment0/)》把环境搭建、Eigen 入门和齐次坐标讲透了，这一篇正式开始写**作业1**——给三角形填上三个矩阵函数，把它真正画到屏幕上。
>
> 作业1 的代码量不大，但**每个函数都是图形学的支柱**：视图矩阵（相机）、罗德里格斯公式（任意轴旋转）、透视投影（近大远小）。这篇文章把源码逐段拆开，配合数学推导、数值验证和直觉类比，一次性吃透。

---

## 一、作业1 到底要做什么

作业1 的目标是**把屏幕上一个三角形渲染出来，并支持绕轴旋转**，核心是填三个矩阵函数：

| 函数 | 职责 | 类比 |
|---|---|---|
| `get_view_matrix(eye_pos)` | 视图矩阵：把世界坐标系搬到相机坐标系 | 摆好相机 |
| `get_rotation(axis, angle)` | 模型矩阵：绕任意轴旋转三角形 | 摆好物体 |
| `get_projection_matrix(...)` | 投影矩阵：透视 → 屏幕 | 按下快门 |

而 `main` 是**总装车间**：解析命令行参数、搭建场景、每帧调用这三个函数完成渲染。

**场景设定**（写在 main 里）：
- 窗口 700×700
- 相机位置 `eye_pos = (0, 0, 5)`
- 三角形顶点 `(2,0,-2)、(0,2,-2)、(-2,0,-2)`，索引 `{0,1,2}`（一个倒立三角形，在 z=-2 平面）
- 投影参数 `(45, 1, 0.1, 50)`：垂直 fov 45°、宽高比 1（正方形）、近平面 0.1、远平面 50

---

## 二、程序全景：main 就是总装车间

```cpp
int main(int argc, const char** argv){
    float angle = 0;
    bool command_line = false;
    bool use_axis = false;                      // [提高项] 是否绕任意轴旋转
    Eigen::Vector3f axis(0.0f, 0.0f, 1.0f);     // 默认绕 z 轴
    std::string filename = "output.png";
    ...
}
```

### 2.1 命令行参数：程序启动时的"点菜"

`int main(int argc, const char** argv)` 是程序入口：`argc` 是参数个数（**含程序名本身**），`argv` 是参数字符串数组，`argv[0]` 永远是程序名。

| 命令行 | argc | 含义 |
|---|---|---|
| `./Rasterizer -r 45` | 3 | 绕 Z 轴转 45°，输出 output.png |
| `./Rasterizer -r 45 out.png` | 4 | 同上，指定输出文件名 |
| `./Rasterizer -a 1 1 0 45 out.png` | 7 | 提高项：绕轴 (1,1,0) 转 45° |
| 其他组合 | — | `return 0` 直接退出 |

几个新语法点：
- `std::stof(argv[2])`：**string to float**，把命令行文本 `"45"` 转成数字 45
- `std::string(argv[3])`：把 C 风格字符串包装成 C++ 字符串
- `use_axis ? get_rotation(axis, angle) : get_model_matrix(angle)`：**三元运算符**，条件为真取前值，否则取后值

### 2.2 两种模式

- **命令行模式**（`command_line = true`）：算一帧 → `cv::imwrite` 存 PNG → 退出。适合批处理、交作业。
- **交互模式**（默认）：弹窗实时显示，每帧清屏重画，按 `a`/`d` 旋转 ±10°，按 **Esc**（ASCII 码 27）退出循环。

### 2.3 每帧渲染管线：MVP 三连

```cpp
r.set_model(use_axis ? get_rotation(axis, angle) : get_model_matrix(angle));
r.set_view(get_view_matrix(eye_pos));
r.set_projection(get_projection_matrix(45, 1, 0.1, 50));
r.draw(pos_id, ind_id, rst::Primitive::Triangle);
```

三角形顶点每帧依次乘三个矩阵：**Model（原地旋转）→ View（相对相机）→ Projection（透视→屏幕）**，再交给 `draw` 光栅化成像素。

<svg viewBox="0 0 960 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-width:960px;">
  <defs>
    <marker id="pa1" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L7,3 L0,6 z" fill="#2563eb"/></marker>
  </defs>
  <rect x="20" y="35" width="150" height="50" rx="8" fill="#fff" stroke="#94a3b8"/>
  <text x="95" y="57" text-anchor="middle" font-size="14" fill="#111827">三角形顶点</text>
  <text x="95" y="74" text-anchor="middle" font-size="12" fill="#6b7280">模型空间</text>
  <line x1="170" y1="60" x2="220" y2="60" stroke="#2563eb" stroke-width="2" marker-end="url(#pa1)"/>
  <rect x="222" y="35" width="150" height="50" rx="8" fill="#eff6ff" stroke="#2563eb"/>
  <text x="297" y="57" text-anchor="middle" font-size="14" fill="#1e3a8a">Model 模型</text>
  <text x="297" y="74" text-anchor="middle" font-size="12" fill="#3b82f6">get_rotation / get_model_matrix</text>
  <line x1="372" y1="60" x2="422" y2="60" stroke="#2563eb" stroke-width="2" marker-end="url(#pa1)"/>
  <rect x="424" y="35" width="150" height="50" rx="8" fill="#eff6ff" stroke="#2563eb"/>
  <text x="499" y="57" text-anchor="middle" font-size="14" fill="#1e3a8a">View 视图</text>
  <text x="499" y="74" text-anchor="middle" font-size="12" fill="#3b82f6">get_view_matrix(eye_pos)</text>
  <line x1="574" y1="60" x2="624" y2="60" stroke="#2563eb" stroke-width="2" marker-end="url(#pa1)"/>
  <rect x="626" y="35" width="150" height="50" rx="8" fill="#eff6ff" stroke="#2563eb"/>
  <text x="701" y="57" text-anchor="middle" font-size="14" fill="#1e3a8a">Projection 投影</text>
  <text x="701" y="74" text-anchor="middle" font-size="12" fill="#3b82f6">get_projection_matrix(45,1,.1,50)</text>
  <line x1="776" y1="60" x2="826" y2="60" stroke="#2563eb" stroke-width="2" marker-end="url(#pa1)"/>
  <rect x="828" y="35" width="112" height="50" rx="8" fill="#ecfdf5" stroke="#059669"/>
  <text x="884" y="57" text-anchor="middle" font-size="14" fill="#065f46">光栅化</text>
  <text x="884" y="74" text-anchor="middle" font-size="12" fill="#047857">→ 屏幕像素</text>
</svg>

> **类比：拍电影。** Model = 摆好物体，View = 摆好相机，Projection = 按下快门，光栅化 = 胶片成像。之后所有作业都是这条流水线的扩展。

---

## 三、get_view_matrix：把相机摆好（视图矩阵）

```cpp
Eigen::Matrix4f get_view_matrix(Eigen::Vector3f eye_pos)
{
    Eigen::Matrix4f view = Eigen::Matrix4f::Identity();
    Eigen::Matrix4f translate;
    translate << 1, 0, 0, -eye_pos[0],
                 0, 1, 0, -eye_pos[1],
                 0, 0, 1, -eye_pos[2],
                 0, 0, 0, 1;
    view = translate * view;
    return view;
}
```

**功能**：把世界坐标系的点变换到以相机为原点的坐标系。

**原理**：图形学里约定相机永远朝 `-Z` 方向看、位于原点。相机在 `(0,0,5)`，要把世界"搬"到相机坐标系，等价于**把整个世界沿 `-eye_pos` 方向平移**——所以矩阵第 4 列是 `-eye_pos`。

> **直觉类比**：你站在 5 米外拍照，感觉像"我离物体 5 米"；等价地也可以说"物体离我 −5 米"——**相机不动、世界后退**，数学上就是一个平移矩阵。

**关键点**：`Eigen::Matrix4f::Identity()` 是 4×4 单位矩阵（对角线 1、其余 0）；平移矩阵 = 单位矩阵只改第 4 列。本作业相机只有平移（不旋转、不缩放），所以这就是完整的视图矩阵。

---

## 四、get_rotation：罗德里格斯旋转公式

```cpp
Eigen::Matrix4f get_rotation(Eigen::Vector3f axis, float angle){
    Eigen::Matrix4f rotation = Eigen::Matrix4f::Identity();
    // 轴向量长度为 0 时无法定义旋转方向，直接返回单位矩阵。
    if (axis.norm() < 1e-8f) return rotation;
    Eigen::Vector3f a = axis.normalized();
    float rad = angle / 180.0f * MY_PI;
    float c = std::cos(rad);
    float s = std::sin(rad);
    // a 的叉乘矩阵 [a]_x，满足 [a]_x * v = a x v
    Eigen::Matrix3f skew;
    skew <<      0, -a.z(),  a.y(),
             a.z(),       0, -a.x(),
            -a.y(),  a.x(),       0;
    Eigen::Matrix3f R = c * Eigen::Matrix3f::Identity()
                      + (1.0f - c) * (a * a.transpose())
                      + s * skew;
    // 把 3x3 的旋转塞进 4x4 齐次矩阵的左上角，其余部分保持单位矩阵。
    rotation.block<3, 3>(0, 0) = R;
    return rotation;
}
```

### 4.1 两个参数分别是什么

- `axis`：**旋转轴**，任意 3 维向量，如 `(1,1,0)` 表示"绕空间中指向 (1,1,0) 方向的那条直线旋转"
- `angle`：**旋转角度，单位是度**（不是弧度！）

### 4.2 逐行拆解

| 代码 | 作用 | 原理 |
|---|---|---|
| `axis.norm()` | 向量的长度 | `√(x²+y²+z²)`；长度为 0 的向量没有方向，无法定义旋转，直接返回单位矩阵 |
| `axis.normalized()` | 单位化 | 除以自己的长度，变成**单位向量**——罗德里格斯公式要求 `|a|=1` |
| `angle / 180.0f * MY_PI` | 度 → 弧度 | `std::cos/sin` 收弧度；**注意写 `180.0f`，整数除法会让它变成 0** |
| `c` / `s` | cosθ / sinθ | 旋转角度的三角函数 |
| `skew` | 叉乘矩阵 `[a]ₓ` | 满足 `[a]ₓ · v = a × v`，把"叉乘"变成"矩阵乘法" |
| `R = c·I + (1-c)·a·aᵀ + s·[a]ₓ` | 罗德里格斯公式 | 见 4.3 |
| `rotation.block<3,3>(0,0) = R` | 嵌入 4×4 | 把旋转放进齐次矩阵左上角，右下角是 1 |

### 4.3 叉乘矩阵 skew 是什么

叉乘 `a × v` 可以写成矩阵乘法：构造一个 3×3 矩阵 `[a]ₓ`，满足 `[a]ₓ · v = a × v`。它的结构是**从 a 的分量反推出来**的：

```
       [  0   -a.z   a.y ]
[a]ₓ = [ a.z    0   -a.x ]
       [-a.y   a.x    0  ]
```

验证一行：`[a]ₓ · v` 的第 1 个分量 = `0·v.x − a.z·v.y + a.y·v.z`，正好等于 `a × v` 的第 1 个分量 `a.y·v.z − a.z·v.y`。✓

### 4.4 罗德里格斯公式：R = c·I + (1−c)·a·aᵀ + s·[a]ₓ

这是"**绕任意轴旋转**"的终极公式，三项各有分工：

| 项 | 作用 |
|---|---|
| `c·I` | 单位矩阵 × cosθ：保留"没被旋转"的那部分（沿轴的投影） |
| `(1−c)·(a·aᵀ)` | 投影项：`a·aᵀ` 是把向量投影到轴 a 上的矩阵，负责"轴方向分量保持不动" |
| `s·[a]ₓ` | 叉乘项：负责产生"绕轴的旋转分量"（垂直轴方向的偏转） |

**为什么要求 a 是单位向量**：公式里的 `a·aᵀ` 当 `|a|=1` 时才是纯投影算子（投影矩阵要求 `P²=P`）；a 长度不对，旋转角度和结果都会错。

**数值验证**（绕 Z 轴转 90°，a=(0,0,1)）：
- `c=cos90°=0`，`s=sin90°=1`，`a·aᵀ` 只有右下角是 1
- `R = 0·I + 1·(a·aᵀ) + 1·[a]ₓ` = `[[0,-1,0],[1,0,0],[0,0,1]]`
- 验证：`R · (1,0,0)ᵀ = (0,1,0)ᵀ` ✓（X 轴正方向被转到了 Y 轴正方向，逆时针 90°）

### 4.5 最终得到的 rotation 是旋转矩阵吗

是的，但它是**4×4 齐次形式**：`[[R, 0],[0, 1]]`——3×3 旋转块在左上角，最后一列是 0（纯旋转、不平移），右下角是 1。`block<3,3>(0,0)=R` 相当于"**在单位矩阵的左上角贴一块 3×3 旋转矩阵**"，其余部分保持单位矩阵不动。

> **直觉类比**：绕任意轴旋转像拧螺丝——螺丝刀沿轴方向推进（轴的投影分量不变），螺纹让垂直方向转起来（叉乘项产生偏转）。

---

## 五、get_projection_matrix：透视投影

```cpp
Eigen::Matrix4f get_projection_matrix(float eye_fov, float aspect_ratio,
                                      float zNear, float zFar){
    Eigen::Matrix4f projection = Eigen::Matrix4f::Identity();
    float fovY = eye_fov / 180.0f * MY_PI;  // 度 -> 弧度
    float n = zNear;                        // 近平面距离（正数）
    float f = zFar;                         // 远平面距离（正数）
    ...
}
```

### 5.1 四个参数分别是什么

| 参数 | 含义 |
|---|---|
| `eye_fov` | 垂直视场角（度），越大看得越"广"，本作业 45° |
| `aspect_ratio` | 宽高比 = 宽度/高度，本作业 1（正方形窗口） |
| `zNear` | 近平面距离（**正数**，相机到近平面），0.1 |
| `zFar` | 远平面距离（正数），50 |

### 5.2 第 1 步：由视角求近平面的 t / r / l / b

```cpp
float t = std::tan(fovY / 2.0f) * n;   // 近平面半高
float r = aspect_ratio * t;            // 近平面半宽
float l = -r;
float b = -t;
```

- `t`（top）= 近平面半高：相机到近平面距离 n，竖直半张角 fovY/2，直角三角形成立 `tan(fovY/2) = t/n`，所以 `t = tan(fovY/2) · n`
- `r`（right）= 半宽 = 宽高比 × 半高
- 视锥左右上下对称：`l = -r`、`b = -t`

### 5.3 第 2 步：正交投影矩阵（映射到 [-1,1]³）

```cpp
ortho << 2/(r-l), 0,       0,       -(r+l)/(r-l),
         0,       2/(t-b), 0,       -(t+b)/(t-b),
         0,       0,       2/(n-f),  (n+f)/(n-f),
         0,       0,       0,        1;
```

每一行都是"**缩放 + 平移**"：把区间 `[l,r]`（或 `[b,t]`、`[-f,-n]`）线性映射到 `[-1,1]`。

通用公式（以 x 为例）：`x' = 2/(r−l)·x − (r+l)/(r−l)`

- **缩放项 `2/(r−l)`**：把区间长度 (r−l) 缩到标准长度 2，**管"大小"**
- **平移项 `−(r+l)/(r−l)`**：把缩放后的区间中心挪到 0，**管"居中"**。它不含 x，对所有点加同一个常数——这正是"平移"的定义
- 视锥对称时 `r+l=0`，平移项自动为 0

> **直觉类比**：像把照片放进标准相框——缩放把照片缩到标准宽度，平移把照片挪到相框正中间。

**z 行的坑（重点）**：相机空间的可见深度是 `-f ≤ z ≤ -n`（相机朝 −Z 看，深度是负数！），要映射到 `[-1,1]`。代入 `z=-n → -1`、`z=-f → +1` 解线性方程，得到：

- 缩放 `2/(n−f)`，平移 `(n+f)/(n−f)`

> ⚠️ **网上很多解答把平移项写成 `-(n+f)/(n-f)`，符号正好反了**——那样近/远平面会被映射到 `+1.008 / +3.008`，跑到 [-1,1] 外面。作业1 只画线框、z 不参与判断，所以画出来看不出问题；但做作业2 深度测试（z-buffer）时**必须**用 `(n+f)/(n-f)`。

### 5.4 第 3 步：透视 → 正交矩阵（压模）

```cpp
persp2ortho << n, 0, 0,   0,
               0, n, 0,   0,
               0, 0, n+f, n*f,
               0, 0, -1,  0;
```

**作用**：把梯形视锥"压"成长方体——近平面上的点不动，远平面被压到和近平面一样大。

- 前两行乘 n：把 x、y 按深度 z 放大，于是后面的"÷w"自动产生**近大远小**
- **第 4 行的 −1 是关键**：它让 `w = -z`（点到相机的距离），透视除法 `v /= v.w()` 才能成立

### 5.5 第 4 步：合成 projection = ortho * persp2ortho

**乘法顺序 = 执行顺序**：矩阵乘法的规则是**从右往左应用**（列向量约定下），所以点先被 `persp2ortho` 压缩（视锥→长方体），再被 `ortho` 装箱（→ [-1,1]³）。顺序反了整个流程就错了——矩阵乘法不满足交换律。

相乘后的最终矩阵（课件里的"一步到位"形式）：

```
[ n/r,   0,    0,            0         ]
[  0,   n/t,   0,            0         ]
[  0,    0,  −(f+n)/(f−n),  −2fn/(f−n) ]
[  0,    0,   −1,           0          ]
```

注意**第 4 行的 −1 原样保留**——因为 ortho 第 4 行是 `(0,0,0,1)`，乘出来还是 persp2ortho 的第 4 行。`w = −z` 的魔法贯穿到底。

> **直觉类比**：流水线两台机器合成一条产线——`persp2ortho` 是"压模机"（梯形压成长方体），`ortho` 是"装箱机"（塞进标准盒子）；相乘 = 串联成一台机器，点从入口进、直接出标准件。

---

## 六、MVP 三连的意义

把三个矩阵合起来看：`M_total = Projection · View · Model`

- **Model**：物体自己的变换（本作业：绕轴旋转）
- **View**：世界 → 相机坐标系（本作业：反向平移）
- **Projection**：透视 → 裁剪空间 → NDC（本作业：压缩 + 装箱）

所有顶点最后都只做**一次矩阵乘法**：`clip = M_total · p`。这正是齐次坐标的价值——几十个变换合并成一个矩阵，GPU 每帧处理百万顶点也能扛住。

---

## 七、新手坑（精华总结）

| # | 坑 | 说明 |
|---|---|---|
| 1 | **角度 / 弧度** | `std::cos/sin/tan` 收弧度；`45° = 45/180 × π` |
| 2 | **整数除法** | `45 / 180` 在 C++ 是整数除法 = 0，必须写 `45.0f / 180.0f` |
| 3 | **罗德里格斯要求单位向量** | 必须 `axis.normalized()`，否则 `a·aᵀ` 不是纯投影算子 |
| 4 | **零轴保护** | `axis.norm() < 1e-8f` 直接返回单位矩阵，避免除零/NaN |
| 5 | **z 平移项符号** | 深度映射平移项正确写法是 `(n+f)/(n-f)`；`-(n+f)/(n-f)` 是网上流传的错误版 |
| 6 | **矩阵乘法顺序** | 右边的先作用；`ortho * persp2ortho` 是"先压缩后装箱"，反了全错 |
| 7 | **编译器抓不住数学错误** | 符号写反、整数除法都不报错，结果却完全错误——必须手算验证 |
| 8 | **`block<3,3>(0,0)` 嵌入** | 4×4 齐次矩阵 = 3×3 旋转块 + 0 列 + 1，别漏掉右下角的 1 |

---

## 八、小结

作业1 把图形学最核心的**一条流水线**完整跑通了：

1. **视图矩阵**——平移世界到相机坐标系（相机不动、世界后退）
2. **罗德里格斯公式**——`R = c·I + (1−c)·a·aᵀ + s·[a]ₓ`，绕任意轴旋转的万能公式
3. **透视投影**——`ortho · persp2ortho` 两步合成：先压模（近大远小）再装箱（[-1,1]³）

作业1 只画线框，所以**深度值暂时看不出作用**；但它埋的种子（正确的 z 映射、w=−z）会在作业2 的 z-buffer 深度测试里立刻开花结果。

> 下一步就是《[作业2：光栅化与 Z-Buffer](/posts/graphics-rasterization-antialiasing/)》——给三角形填颜色、做深度测试，让遮挡关系真正正确。
