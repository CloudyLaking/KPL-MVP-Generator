(() => {
  "use strict";

  const font = '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif';
  const loaded = new Map();

  window.getKplEventAssets = function getKplEventAssets(layout) {
    if (!loaded.has(layout.id)) {
      const background = new Image();
      const atlas = new Image();
      const path = "./event-" + layout.id.toLowerCase();
      background.src = path + "-background.jpg";
      atlas.src = path + "-parts.png";
      const assets = { background, atlas, available: false };
      assets.ready = Promise.all([background.decode(), atlas.decode()]).then(() => { assets.available = true; });
      loaded.set(layout.id, assets);
    }
    return loaded.get(layout.id);
  };

  // BEGIN CITY 2020 NUMERALS
  const cityNumeralType = {"banks":{"kda":{"8":[0,0,11,13,0,-12,11],"1":[13,0,8,14,0,-13,11],"2":[23,0,11,14,-1,-13,11],"/":[36,0,11,18,-1,-13,12],"3":[49,0,12,13,-1,-12,11],"4":[63,0,12,13,-1,-12,11],"0":[77,0,12,14,-1,-13,11],"5":[91,0,11,14,-1,-13,11],"6":[104,0,12,14,-1,-13,11],"7":[118,0,11,14,-1,-13,11],"9":[131,0,11,14,-1,-13,11]},"percent":{"2":[144,0,11,14,-1,-13,11],"4":[157,0,12,14,-1,-13,11],".":[171,0,4,4,0,-3,4],"9":[177,0,11,14,-1,-13,11],"%":[190,0,16,14,0,-13,15],"1":[208,0,8,14,0,-13,11],"7":[218,0,11,14,-1,-13,11],"3":[231,0,11,14,-1,-13,11],"6":[244,0,12,14,-1,-13,11],"0":[258,0,12,14,-1,-13,11],"5":[272,0,11,14,-1,-13,11],"8":[285,0,11,13,0,-12,11]}},"image":"./_art/render-event.js/9e5e9f239b7eea3ab3d76bba55135dc352a37c8c895a72d76e4603e59ebb5573.png"};
  const cityNumberAtlas = new Image();
  cityNumberAtlas.src = cityNumeralType.image;
  window.kplCityTypeReady = cityNumberAtlas.decode().then(() => window.dispatchEvent(new Event("kplassetload")));
  const cityNumberCache = new Map();
  function drawCityNumerals(ctx, text, field, layout, key) {
    if (!layout.cityNumerals || !["kda","damage","tank","mvpCount"].includes(key) || !cityNumberAtlas.naturalWidth) return false;
    const kind = key === "kda" ? "kda" : "percent", glyphs = cityNumeralType.banks[kind];
    if (![...text].every(ch => glyphs[ch])) return false;
    const cacheKey = kind + ":" + text;
    let raster = cityNumberCache.get(cacheKey);
    if (!raster) {
      const layer = document.createElement("canvas");
      layer.width = Math.ceil([...text].reduce((sum,ch) => sum + glyphs[ch][6],0) + 12); layer.height = 42;
      const brush = layer.getContext("2d", {willReadFrequently:true});
      let cursor = 5;
      for (const ch of text) {
        const [x,y,w,h,left,top,advance] = glyphs[ch];
        brush.drawImage(cityNumberAtlas,x,y,w,h,cursor+left,25+top,w,h);
        cursor += advance;
      }
      brush.globalCompositeOperation="source-in";
      brush.fillStyle=kind === "kda" ? "#fffed5" : "#ffffdd";
      brush.fillRect(0,0,layer.width,layer.height);
      brush.globalCompositeOperation="source-over";
      const pixels = brush.getImageData(0,0,layer.width,layer.height).data;
      let left=layer.width,right=0,top=layer.height,bottom=0;
      for(let y=0;y<layer.height;y++)for(let x=0;x<layer.width;x++)if(pixels[(y*layer.width+x)*4+3]>130){
        left=Math.min(left,x);right=Math.max(right,x+1);top=Math.min(top,y);bottom=Math.max(bottom,y+1);
      }
      raster={image:layer,left,right,top,bottom,baseline:25};
      cityNumberCache.set(cacheKey,raster);
      if(cityNumberCache.size>80)cityNumberCache.delete(cityNumberCache.keys().next().value);
    }
    const metrics = window.kplTypeGlyphs.fieldMetrics[layout.id]?.[key];
    const xScale = 960/852, yScale = 540/480;
    const fit = Math.min(1,(field.maxWidth || field.box[2]-field.box[0])/((raster.right-raster.left)*xScale));
    const right = metrics?.bounds[2] ?? field.box[2];
    const anchor = field.align === "center" ? (field.box[0]+field.box[2])/2 : right;
    const left = field.align === "center" ? anchor-(raster.left+raster.right)/2*xScale*fit : right-raster.right*xScale*fit;
    const center = field.inkCenterY ?? (metrics ? (metrics.bounds[1]+metrics.bounds[3])/2 : (field.box[1]+field.box[3])/2);
    const baseline = center + (kind === "kda" ? 4 : 6)*yScale;
    ctx.save();
    ctx.shadowColor="rgba(0,0,0,.9)";ctx.shadowBlur=1.2;ctx.shadowOffsetY=1;
    ctx.drawImage(raster.image,left,baseline-raster.baseline*yScale,raster.image.width*xScale*fit,raster.image.height*yScale);
    ctx.restore();
    return true;
  }
  // END CITY 2020 NUMERALS
  function dimensions(box) {
    return [box[0], box[1], box[2] - box[0], box[3] - box[1]];
  }

  function honorPlacement(layout, count) {
    if (layout.id === "league2025annual") return {
      diameter: 38, columns: count > 8 ? 2 : 8, firstX: count > 8 ? 870 : 542.5,
      firstY: count > 8 ? 95 : 443.5, stepX: 54.5, stepY: 50, countSize: 9
    };
    if (layout.id === "league2025annualLight") return {
      diameter: 39, columns: count > 7 ? 2 : 7, firstX: count > 7 ? 850 : 538,
      firstY: count > 7 ? 35 : 438, stepX: 54.5, stepY: 50, countSize: 9,
      countColor: "#ffffff",
      backdrop: count > 7 ? {box: [817, 10, 126, 356], color: "rgba(48,62,79,.56)"} : null
    };
    if (layout.id === "league2026spring") return {
      diameter: 34, columns: 7, firstX: 927.5 - (Math.min(count, 7) - 1) * 47.5,
      firstY: count > 7 ? 471 : 476, stepX: 47.5, stepY: 42, countSize: 8, shadow: count > 7
    };
    if (layout.id === "league2026summer") return {
      diameter: 34, columns: 14, firstX: 925.5 - (count - 1) * 47.5,
      firstY: 452, stepX: 47.5, countSize: 8, shadow: count > 3
    };
    return {};
  }

  function slice(ctx, atlas, layout, key, box) {
    ctx.drawImage(atlas, ...layout.parts[key], ...dimensions(box));
  }

  function portraitPosition(layout, photo, crop, demo) {
    const fitted = !demo && window.kplShared.portraitPosition(photo, layout.portraitFit, crop);
    if (fitted) return [fitted[0],fitted[1],fitted[0]+fitted[2],fitted[1]+fitted[3]];
    const [x, y, w, h] = dimensions(layout.portraitBox);
    const zoom = Number(crop.zoom) || 1;
    const scale = demo ? zoom : Math.min(w / photo.width, h / photo.height) * zoom;
    const dw = demo ? w * scale : photo.width * scale;
    const dh = demo ? h * scale : photo.height * scale;
    const left = x + (w - dw) / 2 + (Number(crop.x) || 0) * 240;
    const bottom = y + h + (Number(crop.y) || 0) * 135;
    return [left, bottom - dh, left + dw, bottom];
  }

  function drawHero(ctx, layout, photo, crop, assets) {
    if (!photo?.width || !layout.hero) return;
    ctx.save();
    if(layout.heroFit?.clip){ctx.beginPath();ctx.rect(...dimensions(layout.heroFit.clip));ctx.clip();}
    const [x, y, w, h] = dimensions(layout.hero);
    const paint = brush => {
      const source = photo.kplHeroFace || window.kplDemoHeroFaces?.[photo.kplHeroKey];
      const anchor = layout.heroAnchor;
      if (source && anchor && layout.heroMode === "cutout") {
        const scale = anchor.height / source.sourceFaceHeight * (Number(crop?.zoom) || 1);
        const left = anchor.center[0] - source.faceCenter[0] * scale + (.5-Number(crop?.x ?? .5)) * w;
        const top = anchor.center[1] - source.faceCenter[1] * scale + (.5-Number(crop?.y ?? .5)) * h;
        brush.drawImage(photo, left, top, photo.width * scale, photo.height * scale);
      } else window.kplShared.drawHero(brush, photo, [x, y, w, h], crop, layout.heroPolygon);
    };
    if (layout.parts.heroSlotMask) {
      const layer = document.createElement("canvas");
      layer.width = 1920; layer.height = 1080;
      const brush = layer.getContext("2d");
      brush.scale(2, 2);
      paint(brush);
      brush.globalCompositeOperation = "destination-in";
      slice(brush, assets.atlas, layout, "heroSlotMask", [0, 0, 960, 540]);
      ctx.drawImage(layer, 0, 0, 960, 540);
    } else paint(ctx);
    ctx.restore();
  }

  function textValue(layout, key, data) {
    const field = layout.fields[key];
    if (key === "heroCaption" && data.heroCaption) return data.heroCaption;
    if (field.literal) return field.literal;
    const team = layout.latin ? data.latinTeam || data.team : data.team;
    const player = layout.latin ? data.latinPlayer || data.player : data.player;
    const realName = layout.latin ? data.latinRealName || data.realName : data.realName;
    if (key === "identity") {
      const name = [team, player].filter(Boolean).join(layout.joiner ?? ".");
      const withRealName = field.includeRealName || layout.identityFormat?.includes("{realName}");
      return withRealName && realName ? name + " (" + realName + ")" : name;
    }
    if (key === "teamLogo") return data.team || "";
    const value = key === "team" ? team : key === "player" ? player : key === "realName" ? realName : data[key];
    if (field.teamPrefix) {
      const prefix = data.team === layout.sample.team ? field.referenceTeamPrefix || team : team;
      return [prefix, value].filter(Boolean).join(".");
    }
    return value ? (field.prefix || "") + value + (field.suffix || "") : "";
  }

  function drawText(ctx, text, field) {
    const [x, y, w, h] = dimensions(field.textBox || field.box);
    const align = field.align || "left";
    ctx.fillStyle = field.color || "#fff";
    ctx.textBaseline = "middle";
    const face = (field.italic ? "italic " : "") + (field.weight || 700) + " ";
    const family = field.fontFamily || font;
    ctx.letterSpacing = (field.tracking || 0) + "px";
    if (field.vertical) {
      const characters = Array.from(text);
      const size = field.verticalSize || Math.min(w, h / characters.length);
      ctx.textAlign = "center";
      ctx.font = face + size + "px " + family;
      characters.forEach((character, index) => {
        ctx.fillText(character, x + w / 2, y + size * (index + .5), w);
      });
      return;
    }
    ctx.textAlign = align;
    ctx.textBaseline = "alphabetic";
    if (field.smallCapsScale && /^[\w. -]+$/.test(text)) {
      ctx.letterSpacing = "0px";
      ctx.font = face + "100px " + family;
      const capital = ctx.measureText("H");
      const capHeight = field.inkHeight || h - 2;
      const size = 100 * capHeight / (capital.actualBoundingBoxAscent + capital.actualBoundingBoxDescent);
      const tracking = field.tracking || 0;
      const pieces = [...text].map(character => {
        const scale = /[a-z]/.test(character) ? field.smallCapsScale : 1;
        ctx.font = face + size * scale + "px " + family;
        return { text: character.toUpperCase(), size: size * scale, width: ctx.measureText(character.toUpperCase()).width };
      });
      const naturalWidth = pieces.reduce((sum, piece) => sum + piece.width, 0) + tracking * (pieces.length - 1);
      const ratio = Math.min(field.fontWidthRatio || 1, (field.maxWidth || w) / naturalWidth);
      const anchor = align === "right" ? x + w : align === "center" ? field.textAnchorX ?? x + w / 2 : x;
      const start = align === "right" ? anchor - naturalWidth * ratio : align === "center" ? anchor - naturalWidth * ratio / 2 : anchor;
      const baseline = field.inkBottom ?? (field.inkCenterY ?? y + h / 2) + capHeight / 2;
      ctx.save();
      ctx.translate(start, baseline);
      ctx.scale(ratio, 1);
      ctx.textAlign = "left";
      ctx.letterSpacing = "0px";
      let cursor = 0;
      for (const piece of pieces) {
        ctx.font = face + piece.size + "px " + family;
        ctx.fillText(piece.text, cursor, 0);
        cursor += piece.width + tracking;
      }
      ctx.restore();
      return start + naturalWidth * ratio;
    }
    let size = field.size || h * 1.25;
    ctx.font = face + size + "px " + family;
    let metrics = ctx.measureText(text);
    const inkHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    if (inkHeight > 0 && !field.size) size *= (field.inkHeight || h - 2) / inkHeight;
    ctx.font = face + size + "px " + family;
    metrics = ctx.measureText(text);
    const available = field.maxWidth || w;
    const naturalWidthRatio = field.fontWidthRatio || 1;
    let widthRatio = Math.min(naturalWidthRatio, available / Math.max(metrics.width, 1));
    const minimumRatio = naturalWidthRatio * (field.minWidthRatio || .65);
    if (widthRatio < minimumRatio) {
      size *= widthRatio / minimumRatio;
      ctx.font = face + size + "px " + family;
      metrics = ctx.measureText(text);
      widthRatio = minimumRatio;
    }
    ctx.textBaseline = "alphabetic";
    const baseline = (field.inkCenterY ?? y + h / 2) + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
    const anchor = align === "right" ? x + w : align === "center" ? field.textAnchorX ?? x + w / 2 : x;
    ctx.save();
    ctx.translate(anchor, baseline);
    ctx.scale(widthRatio, 1);
    if (field.blur) ctx.filter = `blur(${field.blur}px)`;
    if (field.strokeWidth) {
      ctx.strokeStyle = field.strokeColor || "#000";
      ctx.lineWidth = field.strokeWidth;
      ctx.lineJoin = "round";
      ctx.strokeText(text, 0, 0);
    }
    if (field.shadowColor) {
      ctx.shadowColor = field.shadowColor;
      ctx.shadowOffsetX = field.shadowOffsetX || 0;
      ctx.shadowOffsetY = field.shadowOffsetY || 0;
      ctx.shadowBlur = field.shadowBlur || 0;
    }
    ctx.fillText(text, 0, 0);
    ctx.restore();
    return align === "right" ? x + w : align === "center" ? anchor + metrics.width * widthRatio / 2 : x + metrics.width * widthRatio;
  }

  function drawNumerals(ctx, text, field, template) {
    const atlas = window.kplTypeGlyphs;
    const family = atlas?.glyphs?.[atlas.templates?.[template]];
    if (!atlas?.atlas?.naturalWidth || !family || !/^[\d./%+KM-]+$/.test(text)) return false;
    const glyphs = [...text].map(character => family[character]);
    if (glyphs.some(glyph => !glyph)) return false;
    const [x, y, w, h] = dimensions(field.box);
    const gap = field.glyphGap ?? 1.7;
    const width = glyphs.reduce((sum, glyph) => sum + glyph[8], 0) + gap * Math.max(0, glyphs.length - 1);
    const scaleY = (field.inkHeight || h - 2) / (atlas.height || 25);
    const scaleX = Math.min(scaleY, (field.maxWidth || w) / width);
    const align = field.align || "left";
    let left = align === "right" ? x + w - width * scaleX
      : align === "center" ? x + w / 2 - width * scaleX / 2 : x;
    const baseline = field.inkCenterY != null ? field.inkCenterY + (atlas.height || 25) * scaleY / 2 : field.inkBottom ?? y + h - 1;
    const layer = document.createElement("canvas");
    layer.width = Math.ceil(width * 3 + 12);
    const referenceBaseline = field.slashScale ? 92 : 82;
    layer.height = field.slashScale ? 115 : 100;
    const brush = layer.getContext("2d");
    let cursor = 4;
    for (const [index, glyph] of glyphs.entries()) {
      const [sx, sy, sw, sh, gw, gh, inset, bottom, inkWidth] = glyph;
      const slash = text[index] === "/";
      const rise = slash ? field.slashScale || 1 : 1;
      const drop = slash ? (field.slashDrop || 0) / scaleY * 3 : 0;
      brush.drawImage(atlas.atlas, sx, sy, sw, sh, cursor - inset * 3, referenceBaseline - bottom * 3 * rise + drop, gw * 3, gh * 3 * rise);
      cursor += (inkWidth + gap) * 3;
    }
    brush.globalCompositeOperation = "source-in";
    brush.fillStyle = field.color || "#fff";
    brush.fillRect(0, 0, layer.width, layer.height);
    ctx.drawImage(layer, left - 4 / 3 * scaleX, baseline - referenceBaseline / 3 * scaleY,
      layer.width / 3 * scaleX, layer.height / 3 * scaleY);
    return true;
  }
  window.kplDrawNumerals = drawNumerals;

  window.renderEventKpl = function renderEventKpl(canvas, layout, assets, data, photo, crop, heroPhoto, demo) {
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.scale(2, 2);
    ctx.drawImage(assets.background, 0, 0, 960, 540);
    if (layout.parts.cleanPlatePatch) slice(ctx, assets.atlas, layout, "cleanPlatePatch", [0,0,960,540]);
    if (!layout.heroOverForeground && data.useEventReferenceHero && layout.parts.referenceHero) {
      slice(ctx, assets.atlas, layout, "referenceHero", layout.referenceHeroBox);
    } else if (!layout.heroOverForeground && heroPhoto) {
      drawHero(ctx, layout, heroPhoto, data.heroCrop, assets);
    }
    if (layout.parts.fixedOverHero) slice(ctx, assets.atlas, layout, "fixedOverHero", layout.fixedOverHeroBox);
    if (demo || photo?.width) {
      const box = portraitPosition(layout, photo, crop, demo);
      if (demo) slice(ctx, assets.atlas, layout, "portrait", box);
      else {
        ctx.save();
        if (layout.portraitFit?.clip) {ctx.beginPath();ctx.rect(...dimensions(layout.portraitFit.clip));ctx.clip();}
        ctx.drawImage(photo, ...dimensions(box));
        ctx.restore();
      }
    }
    for(const part of layout.portraitForeground || [])slice(ctx,assets.atlas,layout,part.key,part.box);
    for (const [index, box] of (layout.foreground || []).entries()) {
      slice(ctx, assets.atlas, layout, "foreground" + index, box);
    }
    if (layout.heroOverForeground) {
      if (data.useEventReferenceHero) slice(ctx, assets.atlas, layout, "referenceHero", layout.referenceHeroBox);
      else if (heroPhoto) drawHero(ctx, layout, heroPhoto, data.heroCrop, assets);
    }
    for (const part of layout.extraForeground || []) slice(ctx, assets.atlas, layout, part.key, part.box);
    const originalPortrait = demo && !Number(crop.x) && !Number(crop.y) && Number(crop.zoom) === 1;
    let playerRight = 0;
    for (const [key, sourceField] of Object.entries(layout.fields)) {
      const field = { ...sourceField };
      const type = window.kplTypeGlyphs;
      const numericStyle = type?.families?.[type.templates?.[layout.id]];
      const ink = type?.fieldMetrics?.[layout.id]?.[key];
      if (!(layout.cityNumerals && key === "rank") && numericStyle && ["kda", "damage", "tank", "participation", "economy", "control", "conversion", "gpm", "totalGold", "totalDamage", "mvpCount", "rank"].includes(key)) {
        field.fontFamily = numericStyle.family;
        field.weight = numericStyle.weight;
        field.italic = numericStyle.italic;
        if (ink?.height > 2 && ink.height < (field.box[3] - field.box[1]) * 1.4) {
          field.inkHeight ??= ink.height;
          field.inkBottom ??= ink.bounds[3];
        }
      }
      if (key === "player" && !field.vertical) field.maxWidth = Math.min(field.maxWidth || field.box[2] - field.box[0], 950 - field.box[0]);
      const playerBox = layout.fields.player?.box;
      const sharesPlayerRow = playerBox && field.box[1] < playerBox[3] && field.box[3] > playerBox[1];
      if (key === "realName" && sharesPlayerRow && playerRight > field.box[0]) {
        field.box = [playerRight + 4, field.box[1], Math.min(955, playerRight + 4 + field.box[2] - field.box[0]), field.box[3]];
      }
      const text = textValue(layout, key, data);
      if (!text) continue;
      const sameText = text === textValue(layout, key, layout.sample);
      if (key === "teamLogo" && data.teamLogo) {
        const mono = field.monochrome ?? /^(kpl2020|kpl2021spring|icc2018|world2019|world2020)/.test(layout.id);
        window.kplShared.drawLogo(ctx, data.teamLogo, dimensions(field.box), mono ? field.color : null);
      } else if (sameText && (!field.overPortrait || originalPortrait || key === "teamLogo")) {
        slice(ctx, assets.atlas, layout, key, field.box);
      } else if (key !== "teamLogo") {
        const numeric = drawCityNumerals(ctx, text, field, layout, key) || drawNumerals(ctx, text, field, layout.id);
        const edge = numeric ? 0 : drawText(ctx, text, field);
        if (key === "player") playerRight = edge || 0;
      } else if (!layout.fields.team && !layout.fields.identity) {
        drawText(ctx, text, { ...field, size: 16, align: "center" });
      }
    }
    if (data.teamLogo && !layout.fields.teamLogo && layout.logoBox) {
      if (layout.parts.logoClear) {
        const [x,y,w,h] = layout.logoBox;
        slice(ctx, assets.atlas, layout, "logoClear", [x,y,x+w,y+h]);
      }
      window.kplShared.drawLogo(ctx, data.teamLogo, layout.logoBox);
    }
    if (layout.roleBox && layout.parts.roleReference) {
      const [x, y, w, h] = layout.roleBox;
      slice(ctx, assets.atlas, layout, data.role ? "roleClear" : "roleReference", [x, y, x+w, y+h]);
      if (data.role) {
        const padding = layout.roleFramed === false ? 0 : w >= 30 ? 4 : 2;
        window.kplShared.drawRole(ctx, data.role, [x+padding,y+padding,w-2*padding,h-2*padding], layout.roleColor || "#fff");
      }
    }
    if (layout.honorBox && layout.parts.honorReference) {
      const [x, y, w, h] = layout.honorBox;
      if(layout.honorClearMode!=="transparent" || demo)slice(ctx, assets.atlas, layout, data.honors?.length ? "honorClear" : "honorReference", [x, y, x+w, y+h]);
      if (data.honors?.length) window.kplShared.drawHonors(ctx, data.honors, layout.honorBox, honorPlacement(layout, data.honors.length));
    }
    const watermark = layout.id === "league2026spring" && data.honors?.length > 7
      ? {x:15,y:532,align:"left"} : layout.watermark || {x:945,y:532,align:"right"};
    ctx.textAlign = watermark.align;
    ctx.textBaseline = "bottom";
    ctx.font = "700 9px " + font;
    ctx.strokeStyle = "#211d20";
    ctx.lineWidth = 2;
    ctx.strokeText("非官方制作", watermark.x, watermark.y);
    ctx.fillStyle = "#eee";
    ctx.fillText("非官方制作", watermark.x, watermark.y);
    ctx.restore();
  };
})();
