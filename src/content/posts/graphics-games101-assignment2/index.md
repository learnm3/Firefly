---
title: GAMES101 作业2 源码精读：光栅化与 Z-buffer 全解（叉积判内 · 包围盒遍历 · MSAA 抗锯齿）
published: 2026-10-27
description: GAMES101 作业2 源码逐段精读。从 rasterizer 类设计图出发，讲透两个核心手写函数：insideTriangle 叉积符号法判断点在三角形内、rasterize_triangle 包围盒遍历+深度测试+透视校正插值。提高项 MSAA 多重采样抗锯齿的实现要点与 resolve_samples 求平均原理。
image: api
tags: [图形学, GAMES101, 光栅化, Z-buffer, 三角形, 叉积, 重心坐标, MSAA, 抗锯齿, C++, Eigen]
category: 图形学
draft: false
---

> 这是 GAMES101 系列的第 6 篇。前一篇《[作业1 源码精读：MVP 变换矩阵全解](/posts/graphics-games101-assignment1/)》把视图矩阵、罗德里格斯旋转和透视投影讲透了，这一篇正式进入**作业2**——实现软件光栅化器，把三角形真正"印"到屏幕像素上。
>
> 作业2 的代码量比作业1 大，但**核心逻辑非常清晰**：判断点在不在三角形内（叉积符号法）、找包围盒遍历像素、深度测试决定写不写颜色。提高项 MSAA 把每个像素拆成多个采样点，边缘就平滑了。这篇文章把源码逐段拆开，配合原理图和直觉类比，一次性吃透光栅化。

---

## 一、作业2 到底要做什么

作业2 的目标是**实现软件光栅化器**——不依赖 GPU，纯 CPU 把三角形画到屏幕上。

你要手写的只有两个函数：

| 函数 | 职责 | 类比 |
|---|---|---|
| `insideTriangle(x, y, v)` | 判断像素点是否在三角形内部 | 保安检查围栏 |
| `rasterize_triangle(t)` | 光栅化三角形：包围盒遍历 + 深度测试 | 冲印照片 |

提高项：在 `rasterize_triangle` 里加 MSAA（多重采样抗锯齿），让三角形边缘不再是硬锯齿。

**场景设定**（写在 main 里）：
- 窗口 700×700
- 相机位置 `eye_pos = (0, 0, 5)`
- 三角形 A（近·绿）：`(2,0,-2)、(0,2,-2)、(-2,0,-2)`，z=-2
- 三角形 B（远·蓝）：`(3.5,-1,-5)、(2.5,1.5,-5)、(-1,0.5,-5)`，z=-5
- 投影参数 `(45, 1, 0.1, 50)`

---

## 二、rasterizer 类：光栅化器的设计图

```cpp
class rasterizer {
public:
    rasterizer(int w, int h);                          // 构造：创建画布
    pos_buf_id load_positions(...);                    // 存顶点坐标
    ind_buf_id load_indices(...);                      // 存三角形索引
    col_buf_id load_colors(...);                      // 存顶点颜色
    void set_model/view/projection(...);               // 存三个矩阵
    void clear(Buffers buff);                          // 清屏
    void set_msaa(int samples_per_axis);               // 设置 MSAA 采样数
    void draw(...);                                    // 渲染入口
    void set_pixel(...);                               // 写一个像素
    vector<Vector3f>& frame_buffer();                  // 取出最终图像

private:
    void rasterize_triangle(const Triangle& t);       // ★ 你要写的！
    void resolve_samples();                            // MSAA 求平均
    Matrix4f model, view, projection;                  // 三个矩阵
    vector<Vector3f> frame_buf;                        // 颜色缓冲
    vector<float> depth_buf;                           // 深度缓冲（Z-buffer）
    int ss = 1;                                        // MSAA 每轴采样数
    vector<Vector3f> sample_color_buf;                 // MSAA 样本颜色
    vector<float> sample_depth_buf;                   // MSAA 样本深度
};
```

**公开接口 vs 私有成员**：main 只调用公开接口（load/set/clear/draw），内部数据和工具函数都是私有的。你要填的 `rasterize_triangle` 是私有函数——框架的 `draw` 会自动调它。

---

## 三、整体渲染流水线

框架的 `draw()` 函数已经帮你做完了前面三步，你只需要在最后一步把三角形光栅化成像素：

```
顶点数据 → MVP矩阵变换 → 透视除法 ÷w → 视口变换 → rasterize_triangle → 写像素
          （作业1讲过）   （变成NDC坐标）   （变成屏幕坐标）  （你要写的！）
```

```cpp
// draw 函数里核心的一段
Eigen::Matrix4f mvp = projection * view * model;
for (auto& i : ind) {
    Triangle t;
    // 三个顶点乘 MVP
    Eigen::Vector4f v[] = {
        mvp * to_vec4(buf[i[0]], 1.0f),
        mvp * to_vec4(buf[i[1]], 1.0f),
        mvp * to_vec4(buf[i[2]], 1.0f)
    };
    // 透视除法 ÷w
    for (auto& vec : v) vec /= vec.w();
    // 视口变换：NDC[-1,1] → 屏幕[0,700]
    for (auto & vert : v) {
        vert.x() = 0.5*width*(vert.x()+1.0);
        vert.y() = 0.5*height*(vert.y()+1.0);
        vert.z() = vert.z() * f1 + f2;
    }
    // 光栅化这个三角形（你要写的！）
    rasterize_triangle(t);
}
// MSAA：所有三角形画完后求平均
if (ss > 1) resolve_samples();
```

---

## 四、核心概念速查

### 4.1 Z-buffer（深度缓冲）

每个像素存一个"目前看到的最近深度"。画新三角形时：
- 如果这个像素的新 z 比已存的更近 → 更新深度 + 写颜色
- 如果更远 → 跳过（被挡住了）

> **类比**：像底片背后的深度刻度尺——每画一个像素先查刻度，更近的才能覆盖。

### 4.2 重心坐标（Barycentric Coordinates）

三角形内任意一点 P 可以表示为三个顶点的加权平均：
```
P = c1·v0 + c2·v1 + c3·v2
c1 + c2 + c3 = 1
```
用来插值像素的颜色和深度 z。

> **类比**：像调鸡尾酒——三个顶点是三种原料，c1/c2/c3 是配方比例。

### 4.3 透视校正插值

不能直接用重心坐标线性插值 z，要先除以 w 再插值、最后乘回来——因为透视投影下屏幕线性不等于空间线性（近大远小效应）。

---

## 五、要写的代码详解

### 5.1 insideTriangle：叉积符号法判断点在三角形内

**原理**：对三角形的每条边，计算边向量与点到边起点向量的叉积 z 分量：
- 叉积 > 0：点在边的左侧
- 叉积 < 0：点在边的右侧
- 叉积 = 0：点在边上

**三条边叉积同号（全正或全负）= 点在三角形内部**。

```cpp
static bool insideTriangle(float x, float y, const Vector3f* _v)
{
    // Lambda：计算 (b-a) × (p-a) 的 z 分量
    auto cross = [](const Vector3f& a, const Vector3f& b, float px, float py) {
        return (b.x() - a.x()) * (py - a.y()) - (b.y() - a.y()) * (px - a.x());
    };

    // 三条边分别算叉积
    float c0 = cross(_v[0], _v[1], x, y);   // 边 v0→v1
    float c1 = cross(_v[1], _v[2], x, y);   // 边 v1→v2
    float c2 = cross(_v[2], _v[0], x, y);   // 边 v2→v0

    // 三个全正 或 三个全负 → 在内部
    bool all_pos = (c0 >= 0) && (c1 >= 0) && (c2 >= 0);
    bool all_neg = (c0 <= 0) && (c1 <= 0) && (c2 <= 0);

    return all_pos || all_neg;
}
```

**为什么要两种情况**：三角形顶点可能是顺时针排列（叉积全负）也可能是逆时针排列（叉积全正），两种都算内部。

---

### 5.2 rasterize_triangle：光栅化三角形

**整体流程**：
```
1. 找包围盒（三角形的外接矩形）
2. 遍历包围盒内每个像素
3. 判断像素中心在不在三角形内
4. 在的话：插值深度 z
5. 深度测试：z 比 depth_buf 里的更小？
   → 是：更新深度 + 写颜色
   → 否：跳过
```

```cpp
void rst::rasterizer::rasterize_triangle(const Triangle& t) {
    auto v = t.toVector4();

    // ===== 第1步：找包围盒 =====
    float min_x = std::min({v[0].x(), v[1].x(), v[2].x()});
    float max_x = std::max({v[0].x(), v[1].x(), v[2].x()});
    float min_y = std::min({v[0].y(), v[1].y(), v[2].y()});
    float max_y = std::max({v[0].y(), v[1].y(), v[2].y()});

    // 取整并裁剪到屏幕范围内
    int x0 = std::max(0, (int)std::floor(min_x));
    int x1 = std::min(width - 1, (int)std::ceil(max_x));
    int y0 = std::max(0, (int)std::floor(min_y));
    int y1 = std::min(height - 1, (int)std::ceil(max_y));

    // 三角形颜色
    Eigen::Vector3f color = t.getColor();

    // ===== 第2步：透视校正深度插值 Lambda =====
    auto interpolated_z = [&](float px, float py) {
        auto [alpha, beta, gamma] = computeBarycentric2D(px, py, t.v);
        float w_reciprocal = 1.0f / (alpha / v[0].w() + beta / v[1].w() + gamma / v[2].w());
        float z_interp = alpha * v[0].z() / v[0].w()
                       + beta  * v[1].z() / v[1].w()
                       + gamma * v[2].z() / v[2].w();
        return z_interp * w_reciprocal;
    };

    // ===== 第3步：遍历像素 =====
    for (int y = y0; y <= y1; ++y) {
        for (int x = x0; x <= x1; ++x) {
            float px = x + 0.5f;   // 像素中心坐标
            float py = y + 0.5f;

            // 不在三角形内？跳过
            if (!insideTriangle(px, py, t.v)) continue;

            // 插值深度
            float z = interpolated_z(px, py);
            int idx = get_index(x, y);

            // 深度测试：更近才写
            if (z < depth_buf[idx]) {
                depth_buf[idx] = z;
                set_pixel(Vector3f(x, y, 0), color);
            }
        }
    }
}
```

**为什么要找包围盒**：三角形只占一小块区域，只扫包围盒内的像素就够了，不用扫整个 700×700 屏幕。

**为什么用像素中心 (x+0.5, y+0.5)**：像素是一个方块，我们判断这个方块的中心点在不在三角形内。

---

## 六、提高项：MSAA 多重采样抗锯齿

### 6.1 为什么需要 MSAA

没有 MSAA 时，三角形边缘是硬锯齿——像素要么全绿要么全黑。
MSAA 把每个像素拆成 ss² 个小采样点，每个点独立判断在不在三角形内，最后求平均。边缘像素部分覆盖 → 半透明渐变 → 平滑。

> **类比**：像印刷报纸的半调网点——一个像素里的小墨点，部分着墨部分空白，平均出来就是灰色渐变。

### 6.2 MSAA 实现要点

在 `rasterize_triangle` 里加一个 `else` 分支（ss > 1 时走 MSAA）：

```cpp
else {
    const int n2 = ss * ss;           // 每像素样本数（ss=2→4个）
    const float step = 1.0f / (float)ss;

    for (int y = y0; y <= y1; ++y) {
        for (int x = x0; x <= x1; ++x) {
            int base = get_index(x, y) * n2;  // 该像素样本的起点

            // 每个像素拆成 ss×ss 个采样点
            for (int sy = 0; sy < ss; ++sy) {
                for (int sx = 0; sx < ss; ++sx) {
                    float px = x + (sx + 0.5f) * step;
                    float py = y + (sy + 0.5f) * step;

                    if (!insideTriangle(px, py, t.v)) continue;

                    float z = interpolated_z(px, py);
                    int idx = base + sy * ss + sx;

                    // 每个样本独立深度测试
                    if (z < sample_depth_buf[idx]) {
                        sample_depth_buf[idx] = z;
                        sample_color_buf[idx] = color;
                    }
                }
            }
        }
    }
}
```

### 6.3 resolve_samples：求平均

所有三角形画完后，把每个像素的 ss² 个样本颜色求平均写回 frame_buf：

```cpp
void rst::rasterizer::resolve_samples()
{
    const int n2 = ss * ss;
    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            int base = get_index(x, y) * n2;
            Vector3f sum = Vector3f::Zero();
            for (int k = 0; k < n2; ++k)
                sum += sample_color_buf[base + k];
            set_pixel(Vector3f(x, y, 0), sum / (float)n2);  // 求平均
        }
    }
}
```

---

## 七、关键函数索引

| 函数 | 谁写的 | 作用 |
|---|---|---|
| `load_positions/indices/colors` | 框架 | 存顶点/索引/颜色数据，返回ID |
| `set_model/view/projection` | 框架 | 存三个变换矩阵 |
| `draw` | 框架 | MVP变换→÷w→视口变换→调rasterize_triangle |
| `clear` | 框架 | 清颜色缓冲（填黑）+ 清深度缓冲（填∞） |
| `insideTriangle` | **你写** | 判断点在三角形内（叉积符号法） |
| `rasterize_triangle` | **你写** | 包围盒遍历 + 深度测试 + 写颜色 |
| `computeBarycentric2D` | 框架 | 算重心坐标（插值用） |
| `resolve_samples` | **你写** | MSAA样本求平均 |
| `set_msaa` | 框架 | 设置每轴采样数，分配样本缓冲 |

---

## 八、一句话记忆

- **光栅化 = 冲印照片**：找包围盒（只扫一小块）→ 每个像素中心判断在不在三角形内 → 插值深度 → Z-buffer 深度测试（更近才写）
- **叉积符号法 = 三条边投票**：三个叉积同号 = 在围栏内部
- **Z-buffer = 深度刻度尺**：每个像素记最近深度，更近才覆盖
- **MSAA = 印刷半调网点**：每像素拆成小采样点，部分覆盖→半透明→边缘平滑
