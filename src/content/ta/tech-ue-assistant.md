---
title: "技术向 · UE 学习助手使用说明"
order: 24
description: "UE Python 小工具：搭场景 / 改曝光 / 改色温 / 截图 / 记笔记。"
draft: false
---

> 一个 UE 5.7 Python 小工具，帮你完成 P2 的灯光/曝光任务：搭测试场景、改曝光/色温、截图、记笔记、打开视频引导页。
> 配套页面：[P2灯光任务_视频引导.html](C:/Users/11060/Desktop/TA/TA学习系统_v2/技术向/P2灯光任务_视频引导.html)

## 安装 / 位置

文件已在项目里：
`E:\TA_Workspace\02_Portfolio\P2_NeonStreet\Content\Python\ta_guide.py`

不需要编译、不需要装插件；UE 的 Python 插件已随引擎加载（日志里能看到 LogPython）。

## 用法（UE 打开时）

1. 打开 UE → Window → Output Log。
2. Output Log 左下角输入框从 `Cmd` 切到 **Python**。
3. 粘贴并回车：

```
import sys; sys.path.append(r"E:/TA_Workspace/02_Portfolio/P2_NeonStreet/Content/Python"); import ta_guide; ta_guide.help()
```

4. 然后按需执行（每次一行）：

```
ta_guide.setup_lighting_scene()
ta_guide.exposure(-1)
ta_guide.exposure(0.5)
ta_guide.temperature(3200)
ta_guide.temperature(6500)
ta_guide.shot("01_exposure_-1")
ta_guide.log_note("曝光 -1.0：暗部更黑，霓虹更突出")
ta_guide.open_guide()
ta_guide.open_video("BV1VTtyzeENo")
```

## 说明

- 只影响当前打开的关卡，不改项目设置。
- `setup_lighting_scene()` 只在场景为空时用；重复执行会提示已有测试 Actor，可先 `clear_test_actors()`。
- 截图默认存到 `E:\TA_Workspace\05_Renders\P2_基线\`。
- 笔记追加到 `E:\TA_Workspace\06_Docs\notes\p2_lighting_log.md`。
- 菜单会自动尝试注册到 **Tools → TA 学习助手**；如果没出现，用上面的命令即可。
- v0.1 以"能跑"为目标；如果报错，把 Output Log 里的红字截图发我，我来修。

## 后续可扩展（P5 作品集工具的思路）

- 把曝光/色温对比做成"一键三连拍"（自动改参数 + 截图 + 写笔记）。
- 读取场景里所有灯光，生成灯光清单表（类型/强度/色温/阴影）。
- 加一个"性能基线"按钮：截图 stat unit / stat gpu 并记录。
