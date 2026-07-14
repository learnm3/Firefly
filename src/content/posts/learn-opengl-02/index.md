---
title: 现代 OpenGL 入门（二）：创建第一个窗口
published: 2026-07-11
description: 配置 GLFW + GLAD，理解渲染循环与双缓冲机制，写出你的第一个 OpenGL 程序——一个青色的空白窗口。
image: api
tags: [OpenGL, 图形学, GLFW, GLAD, 窗口]
category: 图形学
draft: false
---

> 本文是对 [LearnOpenGL CN — 创建窗口](https://learnopengl-cn.github.io/01%20Getting%20started/02%20Creating%20a%20window/) 的学习笔记。我们将从零开始搭建开发环境，并写出第一个 OpenGL 程序。

---

## 为什么需要 GLFW 和 GLAD

在直接写 OpenGL 代码之前，你需要两个基础设施：

| 库 | 作用 | 为什么不能直接用 OpenGL |
|---|---|---|
| **GLFW** | 创建窗口、创建 OpenGL 上下文、处理键盘/鼠标输入 | OpenGL 只管渲染，不管窗口——窗口是操作系统的事，OpenGL 不碰 |
| **GLAD** | 在运行时加载 OpenGL 函数指针 | OpenGL 函数的地址由显卡驱动决定，编译时无法确定 |

这两个库是每个现代 OpenGL 程序的起点。无论你的程序多复杂，第一件事永远是 `glfwInit()` 然后 `gladLoadGLLoader()`。

---

## 第一步：GLFW — 窗口和上下文

GLFW（Graphics Library Framework）是一个专门为 OpenGL 设计的 C 库。它能帮你处理所有平台相关的脏活累活——创建窗口、管理 OpenGL 上下文、接收输入事件——让你用同一套代码在 Windows、Linux 和 macOS 上运行。

### 初始化与配置

```cpp
glfwInit();
glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);   // 主版本号
glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);   // 次版本号 → OpenGL 3.3
glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);  // 核心模式

#ifdef __APPLE__
glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);  // macOS 必须
#endif
```

`glfwWindowHint` 是一个关键函数——它在**创建窗口之前**为 OpenGL 上下文设置选项。这里我们指定了三件事：

- 使用 **OpenGL 3.3**（最稳定、最广泛支持的现代版本）
- 使用 **Core-Profile**（立即渲染模式被彻底禁用）
- macOS 上需要额外声明向前兼容

> `glfwWindowHint` 的所有选项都可以在 [GLFW 官方文档](https://www.glfw.org/docs/latest/window.html) 中查阅。

### 创建窗口

```cpp
GLFWwindow* window = glfwCreateWindow(800, 600, "LearnOpenGL", NULL, NULL);
if (window == NULL)
{
    std::cout << "Failed to create GLFW window" << std::endl;
    glfwTerminate();
    return -1;
}
glfwMakeContextCurrent(window);
```

`glfwCreateWindow` 会同时创建窗口和它关联的 OpenGL 上下文。参数依次是：

| 参数 | 含义 |
|---|---|
| `800, 600` | 窗口宽高 |
| `"LearnOpenGL"` | 窗口标题 |
| `NULL` | 全屏模式的目标显示器（NULL = 窗口模式） |
| `NULL` | 资源共享窗口（高级用法，暂不需要） |

`glfwMakeContextCurrent(window)` 将这个窗口的 OpenGL 上下文设为**当前线程的活动上下文**。之后所有 OpenGL 调用都作用于这个上下文。

---

## 第二步：GLAD — 加载 OpenGL 函数

这一步最容易忽略，也最容易出错。原因在于：**OpenGL 本身只是一个规范，所有函数的具体地址由显卡驱动在运行时提供。** 你的操作系统和显卡型号决定了每个 gl 函数的实际内存地址，编译时编译器完全不知道它们在哪。

### 没有 GLAD 的噩梦

如果没有 GLAD，你需要对每个 OpenGL 函数手动做这件事：

```c
// 对每一个 OpenGL 函数都要这样做……
typedef void (*PFNGLCLEARPROC)(GLbitfield mask);
PFNGLCLEARPROC glClear = (PFNGLCLEARPROC)wglGetProcAddress("glClear");

typedef void (*PFNGLGENBUFFERSPROC)(GLsizei n, GLuint* buffers);
PFNGLGENBUFFERSPROC glGenBuffers = (PFNGLGENBUFFERSPROC)wglGetProcAddress("glGenBuffers");
// ……成百上千个函数，写到天荒地老
```

而且 `wglGetProcAddress` 是 Windows 专属的——Linux 用 `glXGetProcAddress`，每个平台都不一样。

### GLAD 的解决方案

GLAD 是一个**运行时函数加载器**，会在程序初始化时自动解析所有 OpenGL 函数指针：

```cpp
if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
{
    std::cout << "Failed to initialize GLAD" << std::endl;
    return -1;
}
```

`glfwGetProcAddress` 是 GLFW 提供的跨平台函数地址查询器，GLAD 用它一次性加载所有函数。这之后，你就能像调用普通 C 函数一样调用 `glGenBuffers`、`glClear` 等了。

> ⚠️ **顺序非常重要**：必须**先 `glfwMakeContextCurrent`，再 `gladLoadGLLoader`** — OpenGL 上下文必须先存在，函数加载才有意义。

### 如何获取 GLAD

访问 [GLAD 在线生成器](https://glad.dav1d.de/)，选择：

- 语言：**C/C++**
- API：**OpenGL (gl)**，版本 **3.3+**
- Profile：**Core**
- 勾选 **"Generate a loader"**

下载后把 `glad.c` 加入项目，`glad/` 和 `KHR/` 头文件放入 include 目录即可。

---

## 第三步：视口（Viewport）

```cpp
glViewport(0, 0, 800, 600);
```

OpenGL 内部使用**归一化设备坐标（NDC）**，范围是 `(-1.0, -1.0)` 到 `(1.0, 1.0)`。`glViewport` 告诉 OpenGL 如何将 NDC 映射到实际窗口的像素位置。

同时需要注册一个回调函数，在用户拖拽窗口大小时自动更新视口：

```cpp
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
    glViewport(0, 0, width, height);
}

glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
```

这样无论用户怎么拉伸窗口，渲染画面都不会变形。

---

## 第四步：渲染循环

现在可以进入程序的核心——**渲染循环（Render Loop）**：

```cpp
while (!glfwWindowShouldClose(window))
{
    processInput(window);

    glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);

    glfwSwapBuffers(window);
    glfwPollEvents();
}
```

这个循环会一直运行，直到用户关闭窗口。每帧执行四件事：

### 一帧的四个步骤

```
┌──────────────────────────────────────────┐
│  ① processInput()  检测用户输入           │
│  ② glClear()       清除上一帧画面         │
│  ③ (渲染命令)      绘制本帧内容           │
│  ④ glfwSwapBuffers() + glfwPollEvents()  │
└──────────────────────────────────────────┘
```

#### ① 处理输入

```cpp
void processInput(GLFWwindow* window)
{
    if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
        glfwSetWindowShouldClose(window, true);
}
```

检查 ESC 键是否被按下，如果是则标记窗口应该关闭。下一轮循环时 `glfwWindowShouldClose` 就会返回 `true`。

#### ② 清除颜色缓冲

```cpp
glClearColor(0.2f, 0.3f, 0.3f, 1.0f);  // 设置清屏颜色
glClear(GL_COLOR_BUFFER_BIT);            // 执行清屏
```

这是双缓冲渲染的标准开场动作——覆盖上一帧的全部像素，从一个干净的画布开始。颜色通道范围是 0.0 到 1.0（不是 0 到 255），第四个参数是透明度。

#### ③ 执行渲染命令

当前这节代码中还没有实际的绘制命令，所以清除后窗口就是一片纯色。

#### ④ 双缓冲交换 + 事件轮询

`glfwSwapBuffers(window)` 和 `glfwPollEvents()` 通常成对出现，放在每帧的末尾。

---

## 核心概念：双缓冲

单缓冲有一个致命的视觉问题：

```
单缓冲（有闪烁）：
  帧缓冲区 ──→ 从上到下逐像素绘制 ──→ 直接显示在屏幕上
  用户看到的是"正在绘制中"的半成品画面 → 画面撕裂/闪烁

双缓冲（无闪烁）：
  前缓冲 ──→ 显示在屏幕上（用户看到的）
  后缓冲 ──→ 在后台默默绘制（用户看不到）
  
  glfwSwapBuffers() 在绘制完成后交换两者 → 画面瞬间"切换"完成
```

用一张图来表示：

```
┌─────────────────────────────────────┐
│          双缓冲机制                   │
│                                      │
│  前缓冲 (Front)                       │
│  ┌──────────────────┐  ← 显示器正在   │
│  │ 用户看到的内容    │     显示的帧    │
│  └──────────────────┘                 │
│                                      │
│  后缓冲 (Back)                        │
│  ┌──────────────────┐  ← 你的渲染命   │
│  │ glClear + 绘制    │     令都在这里   │
│  └──────────────────┘     执行        │
│                                      │
│  glfwSwapBuffers() → 前后交换         │
└─────────────────────────────────────┘
```

这就是为什么你在渲染循环中不需要担心画面闪烁——双缓冲替你解决了。

---

## 第五步：清理

```cpp
glfwTerminate();
return 0;
```

`glfwTerminate()` 释放 GLFW 分配的所有资源（窗口、上下文等）。

---

## 完整代码

```cpp
#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <iostream>

void framebuffer_size_callback(GLFWwindow* window, int width, int height);
void processInput(GLFWwindow* window);

const unsigned int SCR_WIDTH  = 800;
const unsigned int SCR_HEIGHT = 600;

int main()
{
    // ====== 初始化 GLFW ======
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
#ifdef __APPLE__
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
#endif

    // ====== 创建窗口 ======
    GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT,
                                          "LearnOpenGL", NULL, NULL);
    if (window == NULL)
    {
        std::cout << "Failed to create GLFW window" << std::endl;
        glfwTerminate();
        return -1;
    }
    glfwMakeContextCurrent(window);

    // ====== 初始化 GLAD ======
    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
    {
        std::cout << "Failed to initialize GLAD" << std::endl;
        return -1;
    }

    // ====== 设置视口 ======
    glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);
    glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);

    // ====== 渲染循环 ======
    while (!glfwWindowShouldClose(window))
    {
        processInput(window);

        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    // ====== 清理 ======
    glfwTerminate();
    return 0;
}

void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
    glViewport(0, 0, width, height);
}

void processInput(GLFWwindow* window)
{
    if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
        glfwSetWindowShouldClose(window, true);
}
```

---

## 程序启动流程总结

```
glfwInit() + glfwWindowHint()    →  初始化 GLFW，设置上下文属性
glfwCreateWindow()               →  创建窗口和 OpenGL 上下文
glfwMakeContextCurrent()         →  激活上下文到当前线程
gladLoadGLLoader()               →  加载所有 OpenGL 函数指针
glViewport() + 回调注册           →  设置视口映射
while (!shouldClose) {            →  渲染循环（每帧执行）
    processInput()                →  检测 ESC / 其他按键
    glClear()                     →  清空上一帧
    (渲染命令)                     →  绘制新内容
    glfwSwapBuffers()             →  交换前后缓冲
    glfwPollEvents()              →  处理系统事件
}
glfwTerminate()                   →  释放资源
```

运行这段代码，你会看到一个 **800×600 的青灰色空白窗口**。按 ESC 关闭。

下一章我们将真正开始画东西——渲染第一个三角形。

---

> 📖 本文基于 [LearnOpenGL CN — 创建窗口](https://learnopengl-cn.github.io/01%20Getting%20started/02%20Creating%20a%20window/) 学习整理，原作者 Joey de Vries，中文翻译 gjy_1992 和 Krasjet。
