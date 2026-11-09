/* Host-shell presentation only. No form values, image assets or canvas rendering are changed. */
(() => {
  const root = document.getElementById("kpl-tool");
  if (!root) return;
  const pairs = [
    ["KPL MVP 制作台", "KPL MVP Studio"],
    ["选择赛事版式，上传图片并填写单局数据。", "Choose a layout, upload a portrait and enter match stats."],
    ["上传的图片仅在浏览器中处理。", "Uploaded images stay in your browser."],
    ["赛事模板", "Templates"], ["版式", "Layout"], ["赛事版本", "Event version"],
    ["整幅背景", "Full background"], ["选择背景图片", "Choose background image"],
    ["建议使用 16:9 图片。图片居中裁切，铺满整张卡片；更换背景后会自动隐藏示例人物。", "A 16:9 image works best. The image is center cropped to fill the card, and the sample portrait is hidden automatically."],
    ["叠加选手照片", "Overlay player portrait"], ["恢复原背景", "Restore original background"],
    ["正在读取背景图片…", "Loading background image…"], ["已使用自定义背景。", "Custom background loaded."],
    ["背景图片读取失败，请换一张 JPG、PNG 或 WebP。", "Background image could not load. Try another JPG, PNG or WebP."],
    ["选手照片", "Player portrait"], ["选择图片", "Choose image"], ["缩放", "Scale"],
    ["左右位置", "Horizontal position"], ["上下位置", "Vertical position"],
    ["重置裁切", "Reset position"], ["恢复赛事示例", "Restore event sample"],
    ["比赛与选手", "Match and player"], ["赛事", "Event"], ["选手本名", "Real name"],
    ["阶段", "Stage"], ["局次", "Game"], ["系列赛比分", "Series score"],
    ["右下横条文案（留空显示赛况）", "Footer text (blank for match details)"],
    ["右下横条文案（留空使用原文案）", "Footer text (blank for original text)"],
    ["本局表现词", "Performance phrase"], ["地区", "Region"], ["战队", "Team"], ["选手 ID", "Player ID"],
    ["战队队标", "Team logo"], ["局内位置", "Lane"], ["使用参考队标", "Original logo"], ["使用参考位置", "Original lane"],
    ["英文显示（国际赛事可选）", "English display (optional)"], ["英文战队", "English team name"],
    ["英文选手 ID", "English player ID"], ["英文真名", "English real name"], ["英雄英文显示", "English hero caption"],
    ["官方英雄", "Hero"], ["皮肤", "Skin"], ["卡片上的英雄名", "Hero name on card"],
    ["自定义英雄图（可选）", "Custom hero image (optional)"], ["英雄缩放", "Hero scale"],
    ["英雄横向焦点", "Hero horizontal focus"], ["英雄纵向焦点", "Hero vertical focus"],
    ["恢复所选英雄图", "Restore selected hero"], ["自定义英雄", "Custom hero"],
    ["荣誉墙", "Honors"], ["在本版的荣誉区域显示徽章，可以调整顺序和次数。", "Choose badges, then adjust their order and counts."],
    ["示例荣誉沿用原片；添加徽章后可自行编辑。", "Sample honors follow the broadcast. Add badges to customize them."],
    ["无畏样式", "Wuwei example"], ["一诺样式", "Yinuo example"], ["清空", "Clear"],
    ["展示全部荣誉", "Show all honors"], ["添加", "Add"], ["卡片荣誉", "Card honors"], ["选择荣誉徽章", "Choose an honor badge"],
    ["荣誉墙参考样式", "Honor examples"], ["单局数据", "Match stats"],
    ["击杀", "Kills"], ["死亡", "Deaths"], ["助攻", "Assists"],
    ["伤害占比 %", "Damage %"], ["承伤占比 %", "Damage taken %"], ["参团率 %", "Participation %"],
    ["经济占比 %", "Gold share %"], ["控制占比 %", "Control %"], ["伤害转化比", "Damage conversion"],
    ["最佳次数", "MVP count"], ["总排名", "Overall rank"], ["分均经济", "Gold per minute"],
    ["总经济", "Total gold"], ["总伤害", "Total damage"], ["选填", "Optional"],
    ["成品预览", "Card preview"], ["下载 PNG", "Download PNG"], ["单局 MVP 卡片预览", "MVP card preview"],
    ["查看转播参考", "Broadcast reference"],
    ["对抗路", "Clash"], ["打野", "Jungle"], ["中路", "Mid"], ["发育路", "Farm"], ["游走", "Roam"],
    ["支持 JPG、PNG、WebP。可在预览中拖动照片，也可用下方滑块调整。", "Supports JPG, PNG and WebP. Drag the portrait or use the position controls."],
    ["透明人物 PNG 会直接叠在场馆背景上。可拖动人物，或用滑块调整位置和大小。", "Transparent portraits overlay the venue. Drag the player or adjust position and scale."],
    ["选择英雄和皮肤即可加载官方图片。", "Choose a hero and skin to load the official artwork."],
    ["这套版式的英雄原画与背景合成，沿用转播原图。", "This layout uses the hero artwork from the original broadcast."],
    ["正在读取图片…", "Loading image…"], ["图片读取失败，请换一张 JPG、PNG 或 WebP。", "Image could not load. Try another JPG, PNG or WebP."],
    ["已选当前模板的转播图。", "Original broadcast artwork selected."], ["已使用本赛事参考英雄。", "Original event hero artwork selected."],
    ["可手动填写英雄名，或选择自定义图片。", "Enter a hero name or choose a custom image."],
    ["已使用官方图片。", "Official artwork loaded."], ["正在读取官方图片…", "Loading official artwork…"],
    ["官方图片暂时无法读取，可以上传自定义图片。", "Official artwork is unavailable. You can upload an image."],
    ["已使用自定义图片。", "Custom image loaded."], ["英雄图读取失败，请换一张图片。", "Hero image could not load. Try another image."],
    ["正在读取赛事模板…", "Loading event layout…"], ["模板图片读取失败。", "Layout images could not load."],
    ["赛事示例读取失败，请稍后重试。", "The event sample could not load. Please try again."],
    ["导出失败，请重试。", "Export failed. Please try again."], ["已导出赛事示例。", "Event sample exported."], ["已导出卡片。", "Card exported."]
  ];
  const forward = new Map(pairs);
  const reverse = new Map(pairs.map(([zh, en]) => [en, zh]));
  let observer;
  let queued = false;
  function english() { return document.documentElement.lang.toLowerCase().startsWith("en"); }
  function translate(text, en) {
    const table = en ? forward : reverse;
    if (table.has(text)) return table.get(text);
    let match;
    if (en && (match = /^载入(.+)示例$/.exec(text))) return `Load ${match[1]} sample`;
    if (!en && (match = /^Load (.+) sample$/.exec(text))) return `载入${match[1]}示例`;
    if (en && (match = /^同一版式共 (\d+) 个赛事版本，切换后保留各赛事的背景、字体和细节。$/.exec(text))) return `${match[1]} event versions share this layout, with their own backgrounds, type and details.`;
    if (!en && (match = /^(\d+) event versions share this layout, with their own backgrounds, type and details\.$/.exec(text))) return `同一版式共 ${match[1]} 个赛事版本，切换后保留各赛事的背景、字体和细节。`;
    if (en && (match = /^查看转播参考（(.+)）$/.exec(text))) return `Broadcast reference (${match[1]})`;
    if (!en && (match = /^Broadcast reference \((.+)\)$/.exec(text))) return `查看转播参考（${match[1]}）`;
    return text;
  }
  function shouldSkip(node) {
    const parent = node.parentElement;
    if (!parent || parent.closest("script,style,textarea,.maintenance-notice")) return true;
    const option = parent.closest("option");
    // Names of events, players, teams, heroes and skins stay exactly as catalogued.
    if (option && option.value && option.closest("[data-no-translate]")) return true;
    return false;
  }
  function apply() {
    queued = false;
    observer?.disconnect();
    const en = english();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (shouldSkip(node)) continue;
      const raw = node.nodeValue, text = raw.trim();
      const changed = translate(text, en);
      if (changed !== text) node.nodeValue = raw.replace(text, changed);
    }
    for (const element of root.querySelectorAll("[placeholder],[aria-label],[title]")) {
      for (const name of ["placeholder", "aria-label", "title"]) {
        const text = element.getAttribute(name);
        if (!text) continue;
        const changed = translate(text, en);
        if (changed !== text) element.setAttribute(name, changed);
      }
    }
    document.title = en ? "CloudyLake · KPL MVP Studio" : "云海观象台 · KPL MVP 制作台";
    observer?.observe(root, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:["placeholder","aria-label","title"]});
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(apply);
  }
  function headerOffset() {
    const header = document.querySelector(".floating-site-header");
    if (header) document.body.style.setProperty("--kpl-preview-top", `${Math.ceil(header.getBoundingClientRect().bottom + 12)}px`);
  }
  function initialize() {
    observer = new MutationObserver(schedule);
    apply();
    headerOffset();
    const header = document.querySelector(".floating-site-header");
    if (header) new ResizeObserver(headerOffset).observe(header);
    window.addEventListener("resize", headerOffset, {passive:true});
    window.addEventListener("scroll", headerOffset, {passive:true});
    document.addEventListener("cloudylake:language", () => { apply(); headerOffset(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, {once:true});
  else initialize();
})();
