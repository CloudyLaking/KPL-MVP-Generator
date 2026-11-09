(() => {
  "use strict";

  const width = 1920;
  const height = 1080;
  // Compose against the reference frame, then scale once for 1080p export.
  const frameWidth = 852;
  const frameHeight = 480;
  const photoLeft = 287;
  const photoWidth = frameWidth - photoLeft;
  const uiFont = '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif';
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const transparency = new WeakMap();
  window.kplHasTransparency = function kplHasTransparency(image) {
    if (transparency.has(image)) return transparency.get(image);
    const sample = document.createElement("canvas");
    sample.width = sample.height = 12;
    const context = sample.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, 12, 12);
    let result = false;
    try {
      const pixels = context.getImageData(0, 0, 12, 12).data;
      result = [0, 11, 132, 143].some(index => pixels[index * 4 + 3] < 96);
    } catch {
      // Remote rectangular photos can still be drawn when pixel access is restricted.
    }
    transparency.set(image, result);
    return result;
  };

  function drawSlice(ctx, name, x, y) {
    const slices = window.kplReferenceSlices;
    const part = slices?.parts?.[name];
    if (!slices?.image?.complete || !slices.image.naturalWidth || part?.length !== 8) return false;
    const [sx, sy, sw, sh, dx, dy, dw, dh] = part;
    ctx.drawImage(slices.image, sx, sy, sw, sh, x ?? dx, y ?? dy, dw, dh);
    return true;
  }

  function gradient(ctx, x0, y0, x1, y1, stops) {
    const fill = ctx.createLinearGradient(x0, y0, x1, y1);
    for (const [position, color] of stops) fill.addColorStop(position, color);
    return fill;
  }

  function rectangle(ctx, x, y, w, h, fill, radius = 0) {
    ctx.fillStyle = fill;
    if (radius) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.fill();
    } else {
      ctx.fillRect(x, y, w, h);
    }
  }

  function polygon(ctx, points, fill) {
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for (const point of points.slice(1)) ctx.lineTo(...point);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function line(ctx, x1, y1, x2, y2, color, stroke = 1) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = stroke;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  function label(ctx, value, x, y, maxWidth, size, fill, weight = 700, face = uiFont) {
    if (!value) return;
    ctx.font = weight + " " + size + "px " + face;
    const initialWidth = ctx.measureText(value).width;
    if (initialWidth > maxWidth) {
      const fittedSize = Math.max(6, Math.floor(size * maxWidth / initialWidth));
      ctx.font = weight + " " + fittedSize + "px " + face;
    }
    if (ctx.measureText(value).width > maxWidth) {
      const characters = Array.from(value);
      while (characters.length && ctx.measureText(characters.join("") + "…").width > maxWidth) {
        characters.pop();
      }
      value = characters.join("") + "…";
    }
    ctx.fillStyle = fill;
    ctx.fillText(value, x, y);
  }

  function drawPortrait(ctx, photo, crop, background, showPortrait) {
    if (background) {
      const scale = Math.max(width / background.naturalWidth, height / background.naturalHeight);
      const w = background.naturalWidth * scale * frameWidth / width;
      const h = background.naturalHeight * scale * frameHeight / height;
      rectangle(ctx, 0, 0, frameWidth, frameHeight, "#08090a");
      ctx.drawImage(background, (frameWidth - w) / 2, (frameHeight - h) / 2, w, h);
    } else {
      rectangle(ctx, 0, 0, frameWidth, frameHeight, gradient(ctx, 0, 0, frameWidth, 0, [
        [0, "#08090a"], [photoLeft / frameWidth, "#181619"], [.7, "#554b43"], [1, "#25232a"]
      ]));
    }
    const sourceWidth = photo?.naturalWidth || photo?.width;
    const sourceHeight = photo?.naturalHeight || photo?.height;
    if (sourceWidth && sourceHeight) {
      const transparent = window.kplHasTransparency(photo);
      const cover = transparent
        ? Math.min(photoWidth / sourceWidth, frameHeight / sourceHeight)
        : Math.max(photoWidth / sourceWidth, frameHeight / sourceHeight);
      const scale = cover * clamp(Number(crop.zoom) || 1, 1, 3);
      const imageWidth = sourceWidth * scale;
      const imageHeight = sourceHeight * scale;
      const x = photoLeft + (photoWidth - imageWidth) / 2
        + clamp(Number(crop.x) || 0, -1, 1) * (transparent ? 140 : (imageWidth - photoWidth) / 2);
      const y = (transparent ? frameHeight - imageHeight : (frameHeight - imageHeight) / 2)
        + clamp(Number(crop.y) || 0, -1, 1) * (transparent ? 125 : (imageHeight - frameHeight) / 2);
      const referenceZoom = clamp(Number(crop.zoom) || 1, 1, 3);
      const referenceFit = photo.kplGrandReferenceStage ? [
        (frameWidth-frameWidth*referenceZoom)/2 + clamp(Number(crop.x)||0,-1,1)*140,
        (frameHeight-frameHeight*referenceZoom)/2 + clamp(Number(crop.y)||0,-1,1)*125,
        frameWidth*referenceZoom, frameHeight*referenceZoom
      ] : null;
      const headFit = referenceFit || transparent && window.kplShared.portraitPosition(photo,
        {headCenter:[566,145],headHeight:166},
        {...crop,x:(Number(crop.x)||0)*140/240,y:(Number(crop.y)||0)*125/135});
      ctx.save();
      ctx.beginPath();
      ctx.rect(photoLeft, 0, photoWidth, frameHeight);
      ctx.clip();
      ctx.drawImage(photo, ...(headFit || [x, y, imageWidth, imageHeight]));
      ctx.restore();
    } else if (showPortrait && !background) {
      ctx.textAlign = "center";
      label(ctx, "选手照片", 557, 238, 260, 25, "#f5dbaa");
      label(ctx, "选择图片后在此预览", 557, 272, 250, 12, "#dbcbb4");
      ctx.textAlign = "left";
    }

    // The original lighting belongs to the default background.
    if (background) return;
    rectangle(ctx, photoLeft, 0, 178, frameHeight, gradient(ctx, photoLeft, 0, 465, 0, [
      [0, "#181619"], [.43, "#1b191b83"], [1, "#15131800"]
    ]));
    rectangle(ctx, 0, 0, frameWidth, frameHeight, gradient(ctx, 0, 0, 0, frameHeight, [
      [0, "#00000000"], [.48, "#03050600"], [1, "#0204076a"]
    ]));
    const matte = ctx.createRadialGradient(40, 459, 20, 40, 459, 356);
    matte.addColorStop(0, "#06080ad9");
    matte.addColorStop(.58, "#05070894");
    matte.addColorStop(1, "#05070800");
    rectangle(ctx, 0, 0, frameWidth, frameHeight, matte);
    const light = ctx.createRadialGradient(607, 11, 0, 607, 11, 290);
    light.addColorStop(0, "#ffe1b64f");
    light.addColorStop(.52, "#ecc49824");
    light.addColorStop(1, "#cc935900");
    rectangle(ctx, 300, 0, 552, 326, light);
  }

  // iQOO Global official wordmark, viewBox 0 0 104 28.
  const sponsorMark = new Path2D("M4.11158 6.0872H0V2H4.11158V6.0872ZM4.11158 26.8723H0V10.1748H4.11158V26.8723ZM16.363 14.4323C16.363 9.82339 20.1215 6.08681 24.7579 6.08681C29.3947 6.08681 33.1532 9.82339 33.1532 14.4323H37.2648C37.2648 7.56634 31.6652 2 24.7579 2C17.8506 2 12.2515 7.56634 12.2515 14.4323C12.2515 21.299 17.8506 26.8649 24.7579 26.8649H24.7587V22.7777H24.7579C20.1215 22.7777 16.363 19.0412 16.363 14.4323ZM49.5155 14.4323C49.5155 19.0411 53.2743 22.7777 57.9107 22.7777C62.5471 22.7777 66.3056 19.0411 66.3056 14.4323C66.3056 9.82338 62.5471 6.0868 57.9107 6.0868C53.2743 6.0868 49.5155 9.82338 49.5155 14.4323ZM45.4038 14.4323C45.4038 7.56634 51.003 2 57.9103 2C64.8183 2 70.4171 7.56634 70.4171 14.4323C70.4171 21.299 64.8183 26.8649 57.9103 26.8649C51.003 26.8649 45.4038 21.299 45.4038 14.4323ZM24.4878 17.0494L34.6912 27.2446L37.6059 24.3619L27.4029 14.167L24.4878 17.0494ZM82.6677 14.4323C82.6677 19.0411 86.4262 22.7777 91.0626 22.7777C95.699 22.7777 99.4575 19.0411 99.4575 14.4323C99.4575 9.82338 95.699 6.0868 91.0626 6.0868C86.4262 6.0868 82.6677 9.82338 82.6677 14.4323ZM78.5562 14.4323C78.5562 7.56634 84.1553 2 91.0622 2C97.9703 2 103.569 7.56634 103.569 14.4323C103.569 21.299 97.9703 26.8649 91.0622 26.8649C84.1553 26.8649 78.5562 21.299 78.5562 14.4323Z");

  function drawSponsorMark(ctx, left, top, scale, fill = null) {
    ctx.save();
    ctx.translate(left, top);
    ctx.scale(scale * 296 / 104, scale * 73 / 25.25);
    ctx.translate(0, -2);
    ctx.fillStyle = fill ?? gradient(ctx, 0, 2, 0, 27.25, [
      [0, "#eac88a"], [.16, "#dfbd80"], [.6, "#bc995f"], [1, "#9b7b49"]
    ]);
    ctx.fill(sponsorMark);
    ctx.restore();
  }

  function drawTitle(ctx) {
    if (drawSlice(ctx, "title")) return;
    drawSponsorMark(ctx, 16, 51, 1);
    const metal = gradient(ctx, 0, 134, 0, 282, [
      [0, "#ecd09a"], [.11, "#e2c28a"], [.55, "#c5a36b"], [1, "#9d7e4d"]
    ]);

    polygon(ctx, [[6, 281], [16, 274], [16, 141], [10, 134], [44, 134],
      [67, 182], [91, 134], [120, 134], [116, 140], [116, 274], [123, 281],
      [87, 281], [95, 274], [95, 161], [67, 212], [38, 160], [38, 274], [46, 281]], metal);
    polygon(ctx, [[128, 134], [160, 134], [184, 232], [208, 141], [201, 134],
      [230, 134], [203, 281], [162, 281]], metal);
    const p = new Path2D("M233 134H315V190Q316 208 294 224L264 247L273 244L267 250V277L271 281H230L242 275V141Z M265 155V224Q293 205 294 189V155Z");
    ctx.fillStyle = metal;
    ctx.fill(p, "evenodd");
  }

  function drawEventHeading(ctx, event) {
    const title = !event || event === "2026 KPL 年度总决赛" ? "KPL GRAND FINALS 2026" : event;
    if (title === "KPL GRAND FINALS 2026" && drawSlice(ctx, "heading")) {
      drawSlice(ctx, "heading-left");
      drawSlice(ctx, "heading-right");
      return;
    }
    ctx.save();
    ctx.translate(425, 13.4);
    ctx.scale(1.16, .79);
    ctx.textAlign = "center";
    label(ctx, title, 0, 0, 187, 12.4, "#171310d9", 900, 'Arial, sans-serif');
    ctx.restore();
    if (!drawSlice(ctx, "heading-left")) {
      line(ctx, 294, 18, 325, 18, "#29201765", .65);
    }
    if (!drawSlice(ctx, "heading-right")) {
      line(ctx, 546, 18, 651, 18, "#29201788", .65);
      ctx.strokeStyle = "#2d261fd1";
      ctx.lineWidth = .85;
      const ornament = new Path2D("M550 16Q558 18 561 13Q561 9 557 12L554 16M557 16L565 15");
      ctx.stroke(ornament);
    }
  }

  function drawIdentityBase(ctx) {
    const paper = gradient(ctx, 15, 0, 317, 0, [
      [0, "#cfac72"], [.13, "#f2f0ec"], [.83, "#f4f2ee"], [1, "#cbbba1"]
    ]);
    const curl = gradient(ctx, 270, 306, 330, 334, [
      [0, "#75542e"], [.55, "#e2bd74"], [1, "#8c693d"]
    ]);
    ctx.fillStyle = curl;
    ctx.fill(new Path2D("M263 333.5C278 333 293 329.5 306.6 322C313.3 318.4 319.4 313.8 315.4 311.7C313.4 310.5 310.4 310.6 306.8 311.5L309 308.8C315.5 307.1 326.8 308.9 328.2 312.9C328.5 317.1 316.3 322.7 304.2 326.2C309.8 325.4 317.7 325.8 321.3 328.2C308.9 333 286.7 334.2 263 334.4L263 333.8C277.8 333.5 297.5 332.1 309.9 328.9C306.1 327.5 296.7 328.9 289.5 330.6C282.7 332.2 272.6 333.6 263 333.5Z"));

    const nameplate = new Path2D("M15 302H314C312 311 307 317 299 323C292 328 281 332.5 262 333.5H15Z");
    ctx.fillStyle = paper;
    ctx.fill(nameplate);
    ctx.fillStyle = "#c8a160";
    ctx.fill(new Path2D("M15 301.5H314L313 302.8H15Z M15 333.2H267L262 334.3H15Z"));
    rectangle(ctx, 17, 304, 28, 28, gradient(ctx, 16, 304, 45, 332, [
      [0, "#e8cb8f"], [.38, "#c6a46c"], [1, "#927343"]
    ]), 1.5);
    rectangle(ctx, 18.8, 306, 23, 23, "#fffaf0", 4);
    rectangle(ctx, 22, 309, 16.6, 17, "#b8955d", 1.5);
    ctx.fillStyle = "#fff9e8";
    ctx.fill(new Path2D("M22 313Q25 315 28 315L30.6 317.5L33 315Q36 315 39 313L38 316Q35 317 34 320L33 326H28L27.5 320Q26 317 22.4 316Z"));
    polygon(ctx, [[31, 312], [33, 314], [31, 316], [29, 314]], "#fff9e8");
    ctx.strokeStyle = "#608b74";
    ctx.lineWidth = 1;
    ctx.stroke(new Path2D("M47 331Q45 323 47 316Q49 308 55 306 M300 318Q305 313 307 306"));
  }

  function drawIdentity(ctx, data) {
    const referenceTeam = data.team === "北京JDG";
    const referencePlayer = data.player?.replaceAll("（", "(").replaceAll("）", ")") === "无畏(杨涛)";
    if (referenceTeam && referencePlayer && drawSlice(ctx, "identity")) return;
    if (!drawSlice(ctx, "identityBlank")) drawIdentityBase(ctx);
    const alias = data.realName && !/[（(]/.test(data.player || "") ? "(" + data.realName + ")" : "";
    const identity = [data.team, (data.player || "") + alias].filter(Boolean).join(".");
    const nameWithAlias = /^(.*?)([（(][^）)]+[）)])$/.exec(identity);
    if (nameWithAlias) {
      const [, name, alias] = nameWithAlias;
      label(ctx, name, 73, 319, 173, 15.5, "#1c1b19", 850);
      label(ctx, alias, 73 + Math.min(ctx.measureText(name).width, 173) + 1, 321.3, 48, 10.3, "#1c1b19", 850);
    } else {
      label(ctx, identity || "填写战队与选手 ID", 73, 319, 223, 15.5, "#1c1b19", 850);
    }
    if (data.teamLogo) window.kplShared.drawLogo(ctx, data.teamLogo, [49, 306, 21, 22]);
    if (data.role) {
      rectangle(ctx, 19, 306, 23, 23, "#fffaf0", 3);
      window.kplShared.drawRole(ctx, data.role, [21, 308, 19, 19], "#b8955d");
    }
  }

  function drawHero(ctx, hero, photo, useReferenceHero, crop) {
    if (useReferenceHero && drawSlice(ctx, "hero")) return;
    if (!hero && !photo) return;
    const trim = gradient(ctx, 12, 350, 86, 466, [
      [0, "#f3d998"], [.46, "#9d7948"], [1, "#e4c67a"]
    ]);
    rectangle(ctx, 11, 349, 78, 117, trim, 4);
    rectangle(ctx, 13, 351, 74, 113, "#17292a", 3);

    if (photo) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(13, 351, 74, 113, 3);
      ctx.clip();
      window.kplShared.drawHero(ctx, photo, [13, 351, 74, 113], crop);
      ctx.restore();
    } else {
      const teal = gradient(ctx, 15, 355, 85, 462, [[0, "#3a6266"], [.56, "#203e40"], [1, "#172326"]]);
      rectangle(ctx, 13, 351, 74, 113, teal, 3);
      polygon(ctx, [[50, 359], [79, 397], [50, 432], [21, 397]], "#c59c61");
      polygon(ctx, [[50, 364], [75, 397], [50, 427], [25, 397]], "#3b6768");
      polygon(ctx, [[50, 374], [63, 398], [50, 416], [37, 398]], "#ddbb80");
    }
    if (hero) {
      rectangle(ctx, 13, 440, 74, 24, gradient(ctx, 0, 440, 0, 464, [[0, "#15131200"], [1, "#151312ed"]]));
      ctx.textAlign = "center";
      label(ctx, hero, 50, 454, 65, 11, "#fff3d4", 850);
      ctx.textAlign = "left";
    }
  }

  function drawMedals(ctx, hasHero, honors) {
    if (!Array.isArray(honors) || !Array.isArray(window.kplHonorCatalog)) return;
    const twoRows = honors.length > 5, overflow = honors.length > 10;
    window.kplShared.drawHonors(ctx, honors, [hasHero ? 99 : 12, 341, hasHero ? 224 : 311, 73], {
      diameter: twoRows ? 22 : 31,
      columns: overflow ? 7 : 5,
      firstX: overflow ? (hasHero ? 115 : 38) : (hasHero ? 117 : 28) + (twoRows ? 10 : 0),
      firstY: twoRows ? 357 : 381,
      stepX: overflow && hasHero ? 32 : twoRows ? 39.5 : 50,
      stepY: 37,
      countSize: 8.5,
      countColor: "#c4bcae"
    });
  }

  // The display numerals use upright stems and the reference frame's wide proportions.
  // Glyph coordinates are in pixels at the 852 × 480 composition size.
  const metricGlyphs = Object.fromEntries(Object.entries({
    "0": [13.3, "M.5 5.2C1.4 1.8 3.8 0 7 0H8.2C11.7 0 13.1 1.7 12.3 5C11.5 8.4 9.2 10 6 10H4.7C1.2 10-.3 8.3.5 5.2ZM3.3 5.2C2.9 7 3.6 7.9 5.5 7.9H6.1C8 7.9 9 6.9 9.5 4.9C10 3 9.2 2.1 7.5 2.1H6.9C5 2.1 3.8 3.1 3.3 5.2Z"],
    "1": [10.9, "M1.8 2.2L7.2.1H9.5L7.6 7.8H10.2L9.7 10H.1L.7 7.8H4.9L6.1 3.2L1.2 4.8Z"],
    "2": [12.5, "M1.3 3.3C2.2 1 4.2 0 8 0C11.6 0 12.6 1.3 12.1 3.2C11.6 5.1 9.7 5.6 7.1 6.4L4 7.8H11L10.4 10H.1L.7 7.9L6.4 5C8 4.3 9.1 3.9 9.3 3.1C9.5 2.4 8.9 2.1 7.2 2.1C5.6 2.1 4.7 2.5 4.1 3.3Z"],
    "3": [12, "M1.5 3.1C2.2 1 4.5 0 8 0C11.5 0 12.6 1.4 12.1 3C11.8 4.1 10.9 4.7 9.6 4.9C11.1 5.2 11.7 6 11.3 7.3C10.8 9.1 8.6 10 5.1 10C1.9 10 .1 9 .2 7H3C3 7.7 3.8 8 5.7 8C7.4 8 8.4 7.7 8.6 7C8.8 6.3 8.1 6 6.5 6H4.6L5.1 4H7C8.4 4 9.2 3.7 9.4 3C9.6 2.4 9 2 7.3 2C5.8 2 4.8 2.4 4.5 3.1Z"],
    "4": [12.4, "M7.8 0H11.2L9.5 6.2H11.9L11.4 8.2H9L8.5 10H5.8L6.3 8.2H.1L.6 6.2ZM4 6.2H6.8L7.7 3Z"],
    "5": [12, "M3 0H12L11.5 2.1H4.8L4.2 3.7C5.1 3.4 6 3.2 7.5 3.2C10.3 3.2 11.6 4.5 11.1 6.6C10.6 8.9 8.5 10 4.9 10C1.9 10 .3 9 .2 7.1H3C3.2 7.7 3.9 8 5.4 8C7.1 8 8.2 7.6 8.4 6.6C8.6 5.7 7.9 5.3 6.4 5.3C5.2 5.3 4.4 5.6 3.8 6H1.1Z"],
    "6": [12.7, "M.6 5.5C1.5 1.6 4 0 8.1 0C10.9 0 12.7.9 12.6 2.9H9.8C9.7 2.3 9 2 7.5 2C5.6 2 4.5 2.8 3.8 4.2C4.9 3.6 6.2 3.4 7.4 3.4C10.5 3.4 12 4.5 11.4 6.7C10.8 8.9 8.6 10 5 10C1.4 10-.2 8.6.6 5.5ZM3.4 6.7C3.2 7.6 4 8 5.5 8C7.2 8 8.4 7.5 8.6 6.7C8.8 5.8 8.1 5.4 6.5 5.4C4.9 5.4 3.6 5.9 3.4 6.7Z"],
    "7": [10.7, "M1.3 0H10.7L10.1 2.1L4.2 10H1L7.1 2.2H.7Z"],
    "8": [12.3, "M2.2 2.8C2.6 1 4.8 0 8.2 0C11.4 0 12.8 1 12.4 2.7C12.1 3.8 11.3 4.4 10.1 4.8C11.3 5.1 11.8 5.8 11.5 7.1C10.9 9 8.7 10 5.1 10C1.7 10 0 9 .4 7.2C.7 6 1.7 5.2 3.2 4.8C2.3 4.4 2 3.7 2.2 2.8ZM4.8 2.9C4.7 3.6 5.3 3.9 7 3.9C8.5 3.9 9.5 3.5 9.7 2.8C9.9 2.2 9.2 1.9 7.6 1.9C6 1.9 5 2.2 4.8 2.9ZM3.2 6.9C3 7.7 3.8 8.1 5.6 8.1C7.3 8.1 8.5 7.7 8.7 6.9C8.8 6.2 8 5.9 6.3 5.9C4.5 5.9 3.4 6.2 3.2 6.9Z"],
    "9": [12.7, "M1.1 3.3C1.7 1.1 4 0 7.6 0C11.3 0 13 1.4 12.2 4.5C11.2 8.4 8.7 10 4.6 10C1.7 10 0 9.1.1 7.2H2.9C3 7.7 3.8 8 5.2 8C7.1 8 8.4 7.2 9 5.7C7.9 6.2 6.7 6.5 5.4 6.5C2.2 6.5.6 5.5 1.1 3.3ZM3.8 3.4C3.7 4.2 4.4 4.6 6.1 4.6C7.8 4.6 9 4.1 9.2 3.3C9.4 2.4 8.6 2 7 2C5.3 2 4 2.6 3.8 3.4Z"],
    "/": [8.1, "M5.9 0H8.5L2.9 10H.3Z"],
    ".": [4.2, "M.8 7.4H4.1L3.4 10H.1Z"],
    "%": [14.4, "M.5 2.8C.9.9 2.3 0 4.3 0C6.3 0 7.1 1.1 6.7 2.8C6.2 4.6 4.8 5.5 2.8 5.5C.8 5.5.1 4.4.5 2.8ZM2.2 2.8C2 3.6 2.3 4 3.2 4C4 4 4.7 3.5 4.9 2.8C5.1 1.9 4.7 1.6 3.9 1.6C3 1.6 2.4 2 2.2 2.8ZM10.8 0H13L4.3 10H2.2ZM7.7 7.3C8.1 5.5 9.5 4.6 11.5 4.6C13.5 4.6 14.4 5.7 13.9 7.4C13.5 9.1 12.1 10 10.1 10C8.1 10 7.3 9 7.7 7.3ZM9.5 7.4C9.3 8.2 9.6 8.5 10.5 8.5C11.3 8.5 12 8.1 12.2 7.3C12.4 6.5 12 6.1 11.2 6.1C10.3 6.1 9.7 6.5 9.5 7.4Z"],
    "-": [6, "M.8 4.2H5.9L5.3 6.3H.3Z"],
    "+": [8.7, "M3.8 1.4H5.9L5.2 4.1H8.2L7.7 6.2H4.7L4 8.9H1.9L2.6 6.2H.1L.7 4.1H3.1Z"]
  }).map(([character, [advance, outline]]) => {
    const path = new Path2D();
    // The source outlines were sketched with a lean. Remove it around mid-height.
    const upright = character === "/" ? undefined : new DOMMatrix([1, 0, .25, 1, -1.25, 0]);
    path.addPath(new Path2D(outline), upright);
    return [character, { advance, path }];
  }));

  // Native-size luminance coverage sampled from visible glyphs in the reference frame.
  const referenceMetricRows = {
    "0": ["0001577772000", "009fffffffc20", "0afffccceffe2", "4ffd20000bffa", "aff4000000ffc", "aff4000000efd", "7ff9000004ffc", "1fffb5357fff6", "04fffffffff80", "0028deeee9400"],
    "1": ["0000595000", "000affa000", "03cfff9010", "2fffef9010", "5fa4ff9000", "4802ff9000", "0002ff9000", "3558ffb553", "9ffffffff9", "8eeeeddde8"],
    "2": ["00266666200", "0bfffffffb0", "bffd979dffa", "aba00000ffd", "0000147dff9", "009ffffffb0", "0efeb964100", "8ff94433453", "cfffffffffb", "bdeeeeeedf7"],
    "4": ["000000168400", "000003dffa00", "00005ffff800", "0008ffcff800", "00cff61ff900", "3efc201ff800", "fffcabcffeb3", "fffffffffff5", "2323324ffa02", "0000001de701"],
    "7": ["45666666667", "6ffffffffff", "0bccccbdffe", "00000009ff4", "000000cfc00", "00000dfc000", "00008ff1000", "0000efa0000", "0002ffb0000", "0003ef90000"],
    "9": ["001577874000", "06effffffe40", "4ffeb87beff2", "7ff500005ffa", "5ffd7677effc", "08ffffffcafd", "001566520bfb", "3eb83003bff5", "0cffffffffa0", "006bededb500"],
    "/": ["00000683", "00008ff2", "0000dfa0", "0006ff20", "000dfb00", "006ff300", "00dfc000", "05ff4000", "0dfc0000", "3ef30000"],
    ".": ["000", "000", "000", "000", "000", "000", "000", "997", "ffd", "dda"],
    "%": ["048831000296011", "6ffff6000ef6010", "fd01ef00af60100", "fc00bf07fa00000", "afeef82fc047300", "07de71ff1afffa0", "00000df35f839f5", "01009f709f102f6", "0008fa005fe9ef2", "003ec00006efe50"]
  };

  for (const [character, rows] of Object.entries(referenceMetricRows)) {
    const glyph = metricGlyphs[character];
    const bitmap = document.createElement("canvas");
    bitmap.width = rows[0].length;
    bitmap.height = rows.length;
    const context = bitmap.getContext("2d");
    const pixels = context.createImageData(bitmap.width, bitmap.height);
    rows.forEach((row, y) => {
      Array.from(row, (coverage, x) => {
        const index = (y * bitmap.width + x) * 4;
        pixels.data.set([255, 250, 242, parseInt(coverage, 16) * 17], index);
      });
    });
    context.putImageData(pixels, 0, 0);
    glyph.bitmap = bitmap;
    glyph.advance = bitmap.width + (character === "/" ? 0 : .75);
  }

  function drawMetricValue(ctx, value, x, y, maxWidth) {
    const glyphs = Array.from(value, character => metricGlyphs[character]);
    if (glyphs.some(glyph => !glyph)) {
      label(ctx, value, x, y + 5, maxWidth, 14, "#fff8eb", 800, "Arial, sans-serif");
      return;
    }

    const totalWidth = glyphs.reduce((sum, glyph) => sum + glyph.advance, 0);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(Math.min(1, maxWidth / totalWidth), 1);
    ctx.fillStyle = "#fff8eb";
    for (const glyph of glyphs) {
      if (glyph.bitmap) ctx.drawImage(glyph.bitmap, 0, 0);
      else ctx.fill(glyph.path, "evenodd");
      ctx.translate(glyph.advance, 0);
    }
    ctx.restore();
  }

  function drawMetrics(ctx, data, hasHero) {
    const stats = [
      ["KDA", data.kda, "metric-kda"],
      ["伤害占比", data.damage, "metric-damage"],
      ["承伤占比", data.tank, "metric-tank"],
      ["参团率", data.participation]
    ].filter(([, value]) => value);

    const start = hasHero ? 99 : 16;
    const section = stats.length <= 3 ? 80.5 : (322 - start) / stats.length;
    line(ctx, start, 418, 324, 418, "#dbb97a32", .6);
    stats.forEach(([name, value, slice], index) => {
      const x = start + section * index;
      const chipWidth = Math.min(section - 10, 61);
      if (!slice || chipWidth < 60 || !drawSlice(ctx, slice, x, 435)) {
        rectangle(ctx, x, 437, chipWidth, 13, gradient(ctx, x, 0, x + chipWidth, 0, [
          [0, "#9e7946"], [.34, "#dbb67b"], [1, "#e6ca93"]
        ]), 2);
        line(ctx, x + 2, 437.7, x + chipWidth - 2, 437.7, "#fae9c988", .65);
        label(ctx, name, x + 4, 443.5, chipWidth - 7, 9.8, "#fff8e9", 850);
      }
      drawMetricValue(ctx, value, x + 3.5, 459, section - 8);
    });
  }

  function drawProductBase(ctx) {
    rectangle(ctx, 332, 420, 506, 37, gradient(ctx, 332, 0, 838, 0, [
      [0, "#b79b61"], [.036, "#f5efe3"], [.76, "#eeece8"], [.84, "#d2c4a5"], [1, "#bb995f"]
    ]), 4);
    rectangle(ctx, 337, 422, 415, 33, gradient(ctx, 337, 0, 752, 0, [
      [0, "#f8f7f1"], [.7, "#ecebe7"], [1, "#e6e3db"]
    ]), 2);
    line(ctx, 339, 453, 339, 425, "#5e8a72b5", 1.2);
    line(ctx, 751, 452, 751, 426, "#648a79", 1.25);
    drawSponsorMark(ctx, 363, 431, .215, "#111213");
    label(ctx, "16", 434, 439, 28, 17, "#111213", 800, 'Arial, sans-serif');
    line(ctx, 467, 448, 467, 429, "#42403b", .7);
    rectangle(ctx, 776, 412, 23, 52, gradient(ctx, 776, 412, 799, 464, [
      [0, "#b9bac1"], [.12, "#34363e"], [.88, "#484954"], [1, "#191c25"]
    ]), 4);
    rectangle(ctx, 778, 414, 19, 48, "#1d2028", 3);
    rectangle(ctx, 779, 415, 13, 16, "#3b3d46", 3);
    rectangle(ctx, 783, 416.4, 24, 48, gradient(ctx, 783, 416, 807, 465, [
      [0, "#edece9"], [.34, "#a5a5aa"], [1, "#cfceca"]
    ]), 4);
    rectangle(ctx, 786, 418, 13, 16, "#cbcbd1", 3);
    rectangle(ctx, 792, 423.5, 21.5, 44.5, gradient(ctx, 792, 424, 814, 468, [
      [0, "#f3f2ec"], [.29, "#c6c7c3"], [.57, "#e4e3db"], [1, "#a1a19d"]
    ]), 4);
    rectangle(ctx, 793, 425, 16, 15, gradient(ctx, 793, 425, 809, 440, [
      [0, "#eaeae6"], [1, "#a8a9a5"]
    ]), 4);
    for (const [x, y, radius] of [[781, 417.5, 1.7], [781, 423, 1.7], [788.5, 422, 2.2], [788.5, 428, 2.2],
      [796.5, 428.3, 2.4], [802.8, 430.3, 2.4], [796.4, 434.2, 2.3]]) {
      ctx.beginPath();
      ctx.arc(x, y, radius + .7, 0, 2 * Math.PI);
      ctx.fillStyle = "#dbdcdb";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#252830";
      ctx.fill();
      rectangle(ctx, x - .4, y - .7, .7, .7, "#b6c1d4");
    }
    rectangle(ctx, 802, 435.8, 1.8, 1.7, "#f5ead1", .6);
    ctx.strokeStyle = "#ffffff60";
    ctx.lineWidth = .8;
    ctx.stroke(new Path2D("M793 446Q799 448 808 443M793 451Q804 456 813 448M794 463Q806 461 813 455"));
    line(ctx, 793, 443, 793, 464, "#ffffff7a", .6);
    line(ctx, 813, 441, 813, 464, "#70726c95", .6);
  }

  function drawMatchRibbon(ctx, data) {
    const referenceBanner = data.banner?.replace(/\s/g, "") === "无限稳帧用iQOO团战节奏我做主";
    if (!referenceBanner || !drawSlice(ctx, "product")) {
      if (!drawSlice(ctx, "productBlank")) drawProductBase(ctx);
      const game = data.game && (/^\d+$/.test(data.game) ? "第 " + data.game + " 局" : data.game);
      const match = [data.stage, game, data.score].filter(Boolean).join("  |  ");
      ctx.save();
      ctx.translate(480, 439);
      ctx.scale(1.09, 1);
      label(ctx, data.banner || match || "本局最佳选手", 0, 0, 243, 14.5, "#1a1a17", 800);
      ctx.restore();
    }
    ctx.textAlign = "right";
    label(ctx, "非官方制作", 837, 471, 94, 7.5, "#ebd9b9", 700);
    ctx.textAlign = "left";
  }

  window.renderCard = function renderCard(canvas, data = {}, photo, crop = {}, heroPhoto = null) {
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.scale(width / frameWidth, height / frameHeight);
    ctx.textBaseline = "middle";
    const showPortrait = data.showPortrait !== false;
    drawPortrait(ctx, showPortrait ? photo : null, crop, data.background, showPortrait);
    drawEventHeading(ctx, data.event);
    drawTitle(ctx);
    drawIdentity(ctx, data);
    drawHero(ctx, data.hero, heroPhoto, data.useReferenceHero, data.heroCrop);
    const hasHero = Boolean(data.hero || heroPhoto || data.useReferenceHero);
    drawMedals(ctx, hasHero, data.honors);
    drawMetrics(ctx, data, hasHero);
    drawMatchRibbon(ctx, data);
    ctx.restore();
  };
})();
