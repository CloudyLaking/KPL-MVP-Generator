(() => {
  "use strict";

  // Logical coordinates follow the 2025 Challenger Cup game-four broadcast graphic.
  const frameWidth = 852;
  const frameHeight = 480;
  const width = 1920;
  const height = 1080;
  const photoLeft = 213;
  const photoRight = 683;
  const defaultKeyword = "力挽狂澜";
  const defaultBanner = "十人团战超丝滑 MVP稳稳拿";
  const keywordSlices = {
    [defaultKeyword]: "keyword",
    "关键节奏": "keyword-key-tempo",
    "火力全开": "keyword-fire"
  };
  const chinese = '"KplCJK", "Microsoft YaHei", sans-serif';

  function drawSlice(ctx, name, x, y) {
    const atlas = window.kplChallenge2025Slices;
    const part = atlas?.parts?.[name];
    if (!atlas?.image?.complete || !atlas.image.naturalWidth || part?.length !== 8) return false;
    const [sx, sy, sw, sh, dx, dy, dw, dh] = part;
    ctx.drawImage(atlas.image, sx, sy, sw, sh, x ?? dx, y ?? dy, dw, dh);
    return true;
  }

  function gradient(ctx, x0, y0, x1, y1, stops) {
    const fill = ctx.createLinearGradient(x0, y0, x1, y1);
    for (const [position, color] of stops) fill.addColorStop(position, color);
    return fill;
  }

  function rounded(ctx, x, y, w, h, radius, fill) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function polygon(ctx, vertices, fill) {
    ctx.beginPath();
    ctx.moveTo(...vertices[0]);
    for (const vertex of vertices.slice(1)) ctx.lineTo(...vertex);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function label(ctx, value, x, y, available, size, fill, weight = 800, family = chinese) {
    if (!value) return;
    ctx.font = weight + " " + size + "px " + family;
    const measured = ctx.measureText(value).width;
    if (measured > available) ctx.font = weight + " " + size * available / measured + "px " + family;
    ctx.fillStyle = fill;
    ctx.fillText(value, x, y);
  }

  function displayLabel(ctx, value, x, centerY, available, inkHeight, fill) {
    if (!value) return;
    ctx.save();
    ctx.textBaseline = "alphabetic";
    ctx.font = '700 100px "KplDisplayCJK", ' + chinese;
    let metrics = ctx.measureText(value);
    const cap = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    // The reference uses an upright display face with this observed width ratio.
    const designWidth = .795;
    let size = 100 * inkHeight / cap;
    size *= Math.min(1, available / (metrics.width * size / 100 * designWidth));
    ctx.font = '700 ' + size + 'px "KplDisplayCJK", ' + chinese;
    metrics = ctx.measureText(value);
    ctx.fillStyle = fill;
    ctx.textBaseline = "alphabetic";
    ctx.translate(x, centerY + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2);
    ctx.scale(designWidth, 1);
    ctx.fillText(value, 0, 0);
    ctx.restore();
  }

  function clamp(value, low, high) {
    return Math.min(high, Math.max(low, value));
  }

  function sourceDimensions(image) {
    return [image?.naturalWidth || image?.width, image?.naturalHeight || image?.height];
  }

  function drawPortrait(ctx, photo, crop) {
    const stage = gradient(ctx, 0, 0, 852, 394, [
      [0, "#2c2830"], [.49, "#29282d"], [1, "#201e25"]
    ]);
    ctx.fillStyle = stage;
    ctx.fillRect(0, 0, frameWidth, frameHeight);
    polygon(ctx, [[0, 424], [410, 260], [697, 480], [0, 480]], "#1e1c22");
    polygon(ctx, [[578, 0], [582, 0], [509, 312], [506, 309]], "#615b6c29");
    polygon(ctx, [[764, 0], [769, 0], [702, 197], [700, 192]], "#615b6c22");

    const [sourceWidth, sourceHeight] = sourceDimensions(photo);
    if (sourceWidth && sourceHeight) {
      const cropWidth = photoRight - photoLeft;
      const zoom = clamp(Number(crop.zoom) || 1, 1, 3);
      const transparent = window.kplHasTransparency(photo);
      const cover = transparent
        ? Math.min(cropWidth / sourceWidth, frameHeight / sourceHeight)
        : Math.max(cropWidth / sourceWidth, frameHeight / sourceHeight);
      const imageWidth = sourceWidth * cover * zoom;
      const imageHeight = sourceHeight * cover * zoom;
      const x = photoLeft + (cropWidth - imageWidth) / 2
        + clamp(Number(crop.x) || 0, -1, 1) * (transparent ? 140 : (imageWidth - cropWidth) / 2);
      const y = (transparent ? frameHeight - imageHeight : (frameHeight - imageHeight) / 2)
        + clamp(Number(crop.y) || 0, -1, 1) * (transparent ? 125 : (imageHeight - frameHeight) / 2);
      const referenceFit = photo.kplReferenceStage ? [
        (frameWidth-frameWidth*zoom)/2+(Number(crop.x)||0)*140,
        (frameHeight-frameHeight*zoom)/2+(Number(crop.y)||0)*125,
        frameWidth*zoom,frameHeight*zoom
      ] : null;
      const headFit = referenceFit || transparent && window.kplShared.portraitPosition(photo,
        {headCenter:[413,122],headHeight:149},
        {...crop,x:(Number(crop.x)||0)*140/240,y:(Number(crop.y)||0)*125/135});
      ctx.save();
      ctx.beginPath();
      ctx.rect(photoLeft, 0, cropWidth, frameHeight);
      ctx.clip();
      ctx.drawImage(photo, ...(headFit || [x, y, imageWidth, imageHeight]));
      ctx.restore();

      ctx.fillStyle = gradient(ctx, photoLeft, 0, photoLeft + 117, 0, [
        [0, "#29272d"], [.24, "#29272de8"], [.68, "#29272d63"], [1, "#29272d00"]
      ]);
      ctx.fillRect(photoLeft, 0, 117, frameHeight);
      ctx.fillStyle = gradient(ctx, photoRight - 120, 0, photoRight, 0, [
        [0, "#24232900"], [.3, "#24232942"], [.74, "#242329d9"], [1, "#242329"]
      ]);
      ctx.fillRect(photoRight - 120, 0, 120, frameHeight);
    } else {
      ctx.textAlign = "center";
      label(ctx, "选择选手照片", 448, 243, 250, 22, "#d3cbd8");
      ctx.textAlign = "left";
    }

    const edge = ctx.createRadialGradient(445, 240, 133, 445, 240, 494);
    edge.addColorStop(0, "#0c081400");
    edge.addColorStop(1, "#100b1a45");
    ctx.fillStyle = edge;
    ctx.fillRect(0, 0, frameWidth, frameHeight);
  }

  function drawTitle(ctx) {
    if (drawSlice(ctx, "title")) return;
    label(ctx, "iQOO", 20, 48, 232, 64, "#fbfbfc", 600, '"Arial", sans-serif');
    ctx.save();
    ctx.translate(12, 116);
    ctx.transform(1, 0, -.17, 1, 0, 0);
    const silver = gradient(ctx, 0, -45, 0, 44, [
      [0, "#f7f8fa"], [.48, "#f2f3f6"], [.78, "#aaa8b2"], [1, "#55515d"]
    ]);
    label(ctx, "MVP", 0, 0, 250, 111, silver, 900, '"Arial Black", Arial, sans-serif');
    ctx.restore();
  }

  function drawKeyword(ctx, keyword) {
    const slice = keywordSlices[keyword];
    if (slice && drawSlice(ctx, slice)) return;
    ctx.textAlign = "right";
    displayLabel(ctx, keyword, 832, 52, 226, 73, "#6114bb");
    ctx.textAlign = "left";
  }

  function drawHero(ctx, hero, photo, useReferenceHero, crop) {
    if (useReferenceHero && drawSlice(ctx, "hero")) return;
    if (!hero && !photo) return;
    const left = 22;
    const top = 356;
    const size = 103;
    const [sourceWidth, sourceHeight] = sourceDimensions(photo);
    if (sourceWidth && sourceHeight) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(left, top, size, size, 4);
      ctx.clip();
      window.kplShared.drawHero(ctx, photo, [left, top, size, size], crop);
      ctx.restore();
    } else {
      rounded(ctx, left, top, size, size, 4, gradient(ctx, left, top, left + size, top + size, [
        [0, "#4d426a"], [1, "#2c2438"]
      ]));
      ctx.textAlign = "center";
      label(ctx, hero, left + size / 2, top + size / 2, size - 16, 21, "#e3dbee");
      ctx.textAlign = "left";
    }
  }

  function drawIdentity(ctx, data) {
    if (data.teamLogo) {
      window.kplShared.drawLogo(ctx, data.teamLogo, [132, 357, 61, 64]);
    } else if (data.team && (data.team !== "北京WB" || !drawSlice(ctx, "badge"))) {
      ctx.beginPath();
      ctx.ellipse(162, 389, 29, 29, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "#b98be1";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.textAlign = "center";
      label(ctx, data.team, 162, 389, 46, 15, "#fcf9ff");
      ctx.textAlign = "left";
    }

    ctx.fillStyle = "#e4e0e6";
    ctx.fillRect(195.8, 355, 1.2, 65);
    if (data.player !== "听悦" || !drawSlice(ctx, "player")) {
      displayLabel(ctx, data.player || "选手 ID", 209, 389, 137, 73, "#fff");
    }

    if (!drawSlice(ctx, "identity-base")) {
      rounded(ctx, 132.5, 435.8, 22, 22, 4, "#514951");
      rounded(ctx, 134.5, 437.8, 18, 18, 2, "#242027");
      polygon(ctx, [[134, 451], [150, 437], [155, 437], [155, 442], [137, 458], [134, 458]], "#6120b4");
      polygon(ctx, [[158, 436], [268, 436], [260, 450], [249, 458], [158, 458]], "#5b12b6");
    }

    if (data.realName !== "吴佐" || !drawSlice(ctx, "real-name")) {
      ctx.textAlign = "center";
      label(ctx, data.realName, 200, 447.1, 74, 13.2, "#fff", 850);
      ctx.textAlign = "left";
    }
    if (data.role) {
      rounded(ctx, 134.3, 437.5, 19.8, 19.5, 2, "#584e63");
      window.kplShared.drawRole(ctx, data.role, [135, 439, 18, 16], "#fff");
    }
  }

  function drawStats(ctx, data) {
    const stats = [
      ["KDA", data.kda, "label-kda", "2/0/10", "number-kda"],
      ["参团率", data.participation, "label-participation", "92.3%", "number-participation"],
      data.damage ? ["输出占比", data.damage, "label-damage", "37.3%", "number-damage"] : ["承伤占比", data.tank, ""]
    ].filter(([, value]) => value);

    stats.forEach(([name, value, slice, referenceValue, numberSlice], index) => {
      const top = 178 + index * 71.5;
      if (!slice || !drawSlice(ctx, slice, 764, top)) {
        rounded(ctx, 764, top, 67, 13.5, 7, gradient(ctx, 764, 0, 831, 0, [
          [0, "#f4f4f4"], [1, "#bbbcc4"]
        ]));
        ctx.textAlign = "center";
        label(ctx, name, 797.5, top + 6.7, 54, 9.1, "#19191b", 850);
      }

      if (value === referenceValue && drawSlice(ctx, numberSlice, undefined, top + 18)) return;
      if (window.kplDrawNumerals?.(ctx, value, {
        box: [682, top + 18, 832, top + 57], color: "#fff", align: "right", maxWidth: 149,
        inkHeight: 34.7, inkCenterY: top + 38.4, glyphGap: name === "KDA" ? 4.7 : 4.1
      }, "challenge2025")) return;
      ctx.textAlign = "right";
      ctx.save();
      ctx.translate(832, top + 38.5);
      ctx.scale(.99, 1);
      label(ctx, value, 0, 0, 149, 46, "#fff", 700, 'Bahnschrift, "Arial Narrow", Arial, sans-serif');
      ctx.restore();
      ctx.textAlign = "left";
    });
  }

  function drawProduct(ctx, banner) {
    const useOriginal = banner.replace(/\s/g, "") === defaultBanner.replace(/\s/g, "");
    if (useOriginal && drawSlice(ctx, "product")) return;
    if (!drawSlice(ctx, "product-blank")) {
      ctx.fillStyle = gradient(ctx, 536, 0, 833, 0, [
        [0, "#6514c9"], [.46, "#35166c"], [1, "#27212c"]
      ]);
      ctx.fillRect(529, 417, 304, 40);
      rounded(ctx, 499, 409, 19, 51, 4, gradient(ctx, 499, 409, 518, 460, [
        [0, "#dedde3"], [.48, "#888895"], [1, "#e7e6e9"]
      ]));
      rounded(ctx, 520, 408, 19, 52, 4, "#f5f3f5");
      rounded(ctx, 523, 411, 13, 15, 4, "#232225");
    }
    label(ctx, banner, 548, 437, 281, 21.4, "#fff", 850);
  }

  window.renderChallengeCup2025 = function renderChallengeCup2025(canvas, data = {}, photo, crop = {}, heroPhoto) {
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.scale(width / frameWidth, height / frameHeight);
    ctx.textBaseline = "middle";
    drawPortrait(ctx, photo, crop);
    drawTitle(ctx);
    drawKeyword(ctx, data.keyword ?? defaultKeyword);
    drawHero(ctx, data.hero, heroPhoto, data.useChallengeReferenceHero, data.heroCrop);
    drawIdentity(ctx, data);
    drawStats(ctx, data);
    drawProduct(ctx, data.banner || defaultBanner);
    ctx.textAlign = "right";
    label(ctx, "非官方制作", 831, 471, 95, 7.4, "#d1c8d6", 700);
    ctx.restore();
  };
})();
