# 版式与画质检查

逐一检查制作台的 45 个赛事版本。每个版本分别导出原示例、换人物并改数据的版本。核对标题笔画、人物遮罩、英雄裁切、数据对齐、荣誉和广告层级。输出均为 1920 × 1080 PNG。

## 本次修订

- **2018 王者荣耀冠军杯国际邀请赛** 从同届决赛回放提取 0–9、斜线、小数点和百分号，制作专用数字图层，校正较长 KDA 的字距与宽度。 [来源](https://www.bilibili.com/video/BV1z7411T76v/)
- **2023 KPL 夏季赛** 将默认英雄限定在已有英雄区，移除遮住红色统计区的护膝残影，恢复 K/D/A、伤害和承伤字段。 [来源](https://www.sina.cn/news/detail/4944522536552605.html)
- **2024 KPL 春季赛** 使用 1806 × 1015 的赛后原帧与同版转场，补齐蓝色 P 的竖画、内孔和右弧，消除缺口与接缝。 [来源](https://www.sina.cn/news/detail/5022042942081067.html)
- **2024 王者荣耀冠军邀请赛** 清除金色 P 内侧误叠入的一小段英雄轮廓，保留原字标和光纹。
- **2024 挑战者杯淘汰赛** 用同轮比赛 2000 × 1122 的无遮挡参考恢复整组金色 MVP，去除 P 内孔、竖笔和右上角的拼接痕。 [来源](https://community-cn.honor.com/cngm/game/topicdetail/topicid-3639342166147072)
- **2026 挑战者杯决赛** 从原转播提取完整紫色 MVP，在英雄层上方绘制，恢复 M 底部以及 V、P 中被错误覆盖的笔画。 [来源](https://www.sina.cn/news/detail/5301857308122173.html)
- **2026 KPL 春季赛** 修正默认英雄和替换英雄的可见范围，恢复被盾牌挡住的 iQOO MVP 标题。左上场景纹理由官方赛后图的无人物区域补回。 [来源](https://www.sina.cn/news/detail/5263756067079840.html)

## 画质边界

- 2019 秋决官方回放可播放 1920 × 1080，当前可稳定落地并核对的原帧为 852 × 480，因此该版保留既有图层。
- 部分 2018–2021 年参考帧约为 480p，导出尺寸高于参考帧并不会补回原有纹理。个别版式仍有原人物完全遮挡的底纹和需近似的字形。
- 2023 挑战者杯编辑版的数字仍可见原帧提取留下的毛边，尤其是百分号。
- 标题、字形和数据区按原帧处理。英雄挡住标题的位置若与转播原帧一致，按该版式的原层级保留。

下表是核对时可落地的参考帧尺寸，便于定位素材。局部使用更清晰的同版参考时见上方修订记录。

| 赛事版本 | 对照帧尺寸 | 转播出处 |
| --- | --- | --- |
| 2018 KPL 春季赛 · 经典版 | 1920 × 1080 | [参考帧](https://www.youtube.com/watch?v=TJlEhgHa9k4&t=2421s) |
| 2018 KPL 秋季赛 · 经典版 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV177411N7cP/?p=4&t=3197) |
| 2019 KPL 春季赛 · 经典版 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV1S4411V7hS/?p=1&t=1285) |
| 2019 KPL 秋季赛 · 决赛版 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV1YJ411r785/?p=8&t=1822) |
| 2018 王者荣耀冠军杯国际邀请赛 · 决赛版 | 858 × 480 | [参考帧](https://www.bilibili.com/video/BV1z7411T76v/?p=1&t=1515.5) |
| 2019 王者荣耀世界冠军杯 · 决赛版 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV164411X7Wf/?p=3&t=1449.5) |
| 2020 王者荣耀世界冠军杯 · 决赛版 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV1WC4y1t7B3/?p=3&t=1789.5) |
| 2020 KPL 春季赛 · 决赛版 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV1Kp4y1Q792/?p=3&t=1362) |
| 2020 KPL 秋季赛 · 常规赛版 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV1zh411X7Vw/?p=3&t=1926.5) |
| 2020 KPL 秋季赛 · 决赛版 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV1W5411H7xx/?p=3&t=2610.5) |
| 2020 王者荣耀冬季冠军杯 · 决赛版 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV1eN411d7Hu/?p=2&t=1945.5) |
| 2021 KPL 春季赛 · 决赛版 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV1wU4y1V7gF/?p=3&t=2174.5) |
| 2021 王者荣耀世界冠军杯 · 决赛版 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV1SQ4y1h78q/?p=3&t=1838.5) |
| 2021 KPL 秋季赛 · 决赛版 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV14a41167WE/?p=6&t=1424.5) |
| 2022 KPL 春季赛 · 常规赛 | 1054 × 577 | [参考帧](https://www.sina.cn/news/detail/4756833325023802.html) |
| 2022 KPL 夏季赛 · 常规赛 | 1089 × 590 | [参考帧](https://www.sina.cn/news/detail/4799187348622665.html) |
| 2021 挑战者杯 · 决赛 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV1vb4y1H7BM/?p=4&t=1621) |
| 2022 挑战者杯 · 决赛 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV1yR4y197aW/?p=4&t=2151) |
| 2022 王者荣耀世界冠军杯 · 决赛 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV13R4y1U7St/?p=5&t=1504) |
| 2023 KPL 春季赛 · 季后赛 | 1920 × 1080 | [参考帧](https://www.sina.cn/news/detail/4898898696473485.html) |
| 2023 KPL 夏季赛 · 决赛 | 1509 × 846 | [参考帧](https://www.sina.cn/news/detail/4944522536552605.html) |
| 2023 挑战者杯 · 决赛 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV1KG41197uY/?p=4&t=1934) |
| 2023 王者荣耀世界冠军杯 · 决赛 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV15b4y1F78v/?p=4&t=1521) |
| 2024 KPL 春季赛 · 常规赛 | 1806 × 1015 | [参考帧](https://www.sina.cn/news/detail/5022042942081067.html) |
| 2024 KPL 夏季赛 · 常规赛 | 1451 × 787 | [参考帧](https://www.sina.cn/news/detail/5071356717432855.html) |
| 2024 KPL 夏季赛 · 决赛 | 1920 × 1080 | [参考帧](https://www.huya.com/video/play/1013768082.html) |
| 2024 王者荣耀季中邀请赛（EWC）· 决赛 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV15E4m1d7SX/?p=3&t=1177) |
| 2024 KPL 年度总决赛 · 擂台赛 | 1920 × 1080 | [参考帧](https://www.sina.cn/news/detail/5091295801115448.html) |
| 2024 王者荣耀冠军邀请赛 · 决赛 | 1600 × 900 | [参考帧](https://www.oneesports.gg/honor-of-kings/black-shrew-esports-kc-2024-champ/) |
| 2024 挑战者杯 · 淘汰赛 | 1470 × 825 | [参考帧](https://www.sina.cn/news/detail/5116593398881096.html) |
| 2024 挑战者杯 · 决赛 | 852 × 480 | [参考帧](https://www.bilibili.com/video/BV1w8cceKERC/?p=4&t=1378) |
| 2025 KPL 春季赛 · 常规赛 | 1449 × 807 | [参考帧](https://www.sina.cn/news/detail/regular.html) |
| 2025 KPL 春季赛 · 决赛 | 1920 × 1080 | [参考帧](https://www.sina.cn/news/detail/5164843775039613.html) |
| 2025 KPL 夏季赛 · 常规赛 | 1497 × 843 | [参考帧](https://www.sina.cn/news/detail/5187710697869514.html) |
| 2025 KPL 夏季赛 · 决赛 | 1464 × 825 | [参考帧](https://www.sina.cn/news/detail/final.html) |
| 2025 KPL 年度总决赛 · 浅白实景照片版 | 1920 × 1080 | [参考帧](https://www.sina.cn/news/detail/5225374351101072.html) |
| 2025 KPL 年度总决赛 · 淘汰赛 | 1920 × 1080 | [参考帧](https://www.sina.cn/news/detail/5228305622238799.html) |
| 2025 王者荣耀世界冠军杯 KIC · 决赛 | 1920 × 1080 | [参考帧](https://www.youtube.com/watch?v=Nyz_MSyKiw8&t=10136s) |
| 2025 挑战者杯 · 淘汰赛 | 1920 × 1080 | [参考帧](https://www.sina.cn/news/detail/5242323774212264.html) |
| 2026 挑战者杯 · 常规版 | 2096 × 1179 | [参考帧](https://www.sina.cn/news/detail/5293514608871455.html) |
| 2026 挑战者杯 · 决赛 | 978 × 552 | [参考帧](https://www.sina.cn/news/detail/5301857308122173.html) |
| 2025 挑战者杯 · 决赛版 | 2160 × 1212 | [参考帧](https://www.bilibili.com/opus/1153254824165244929) |
| 2026 KPL 春季赛 · 常规赛 | 1515 × 855 | [参考帧](https://www.sina.cn/news/detail/5263756067079840.html) |
| 2026 KPL 夏季赛 · 决赛 | 1379 × 771 | [参考帧](https://www.sina.cn/news/detail/5342420499695909.html) |
| 2026 KPL 年度总决赛 · 擂台赛 | 2154 × 1215 | [参考帧](https://www.sina.cn/news/detail/5355472617997429.html) |
