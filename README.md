# KPL MVP 制作台

在浏览器里制作静态的单局 MVP 卡片。选择版式，分别填写战队和选手 ID，上传人物或英雄图片，再导出 1920 × 1080 PNG。照片在浏览器内处理。

[打开云海观象台的制作台](https://meteostation.top/tools/kpl-mvp/) · [45 个赛事版本的画质检查](QUALITY_AUDIT.md)

## 本地预览

需要 Node.js 22 或以上版本。在仓库根目录运行：

```sh
node preview.cjs
```

打开 http://127.0.0.1:8174/ 。页面使用本地代码，预览服务从云海观象台读取赛事素材、界面样式和公开站点配置。这个预览需要联网，素材请求与上传照片分开。

## 目录

- `dist/index.html`、`dist/style.css` 和 `dist/editor.js` 负责界面和编辑。
- `dist/render*.js` 负责各版式的画布绘制和合成。
- `dist/event-assets.js` 等配置文件记录版式参数、示例和参考链接。
- [素材来源](SOURCE_CREDITS.md) 记录转播、原画、图标和字体的出处。

本项目是非官方制作工具。部分早期转播的清晰度和原字形存在限制，1920 × 1080 是导出尺寸。
