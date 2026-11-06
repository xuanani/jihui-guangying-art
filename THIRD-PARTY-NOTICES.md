# 第三方组件与素材声明

本项目以 MIT 协议开源（见 [LICENSE](LICENSE)），但**不覆盖**下列第三方内容，它们分别遵循各自的许可条款。

## 随仓库分发的代码

### TDesign Miniprogram

- 组件：`极绘光影Art/miniprogram_npm/tdesign-miniprogram/`（已构建产物，随仓库提交）
- 版本：1.10.1
- 上游：<https://github.com/Tencent/tdesign-miniprogram>
- 许可：MIT

```text
MIT License

Copyright (c) 2021-present TDesign

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## 仅在运行时安装、不随仓库分发的依赖

`cloudfunctions/` 目录未提交 `node_modules`，以下依赖由微信云开发在部署时按 `package.json` 安装，代码仓库中不包含其源码：

| 依赖 | 版本 | 许可 | 上游 |
| --- | --- | --- | --- |
| `wx-server-sdk` | ~2.0.0 | 见 npm 包声明 | <https://www.npmjs.com/package/wx-server-sdk> |
| `axios` | ^1.6.2 | MIT | <https://github.com/axios/axios> |

## 素材与标识（不在代码许可范围内）

- `图片介绍.png`：项目界面截图，仅用于说明项目。
- `极绘光影Art/icon/A.png` ~ `F.png`：tabBar 图标。
- `极绘光影Art/images/1.jpg`：演示用图片。
- 「极绘光影 / AI 画廊」名称与品牌标识：MIT 协议不授予商标权，请勿用于暗示官方背书。

## 演示数据的图片来源

首页 / 详情页的 mock 数据直接引用第三方图床外链（`youke1.picui.cn`、`images.unsplash.com`），仓库中**不存储**这些图片。若你要在自己部署的版本中继续使用，请自行确认对应站点的使用条款；正式产品建议替换为自有素材。

## 生成内容

小程序调用阿里云百炼通义万相生成的图片，其使用须遵守[阿里云百炼服务条款](https://bailian.console.aliyun.com/)，与本仓库的 MIT 许可无关。
