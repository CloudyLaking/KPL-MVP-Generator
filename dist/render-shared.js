(() => {
  "use strict";

  const images = new Map();
  const badges = new Map();
  const portraitHeads = new WeakMap();
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

  function image(source) {
    if (!source) return null;
    if (!images.has(source)) {
      const asset = new Image();
      asset.onload = () => window.dispatchEvent(new Event("kplassetload"));
      asset.src = source;
      images.set(source, asset);
    }
    return images.get(source);
  }

  function portraitHead(photo) {
    if (photo.kplPortraitHead) return photo.kplPortraitHead;
    if (portraitHeads.has(photo)) return portraitHeads.get(photo);
    const sw = photo.naturalWidth || photo.width, sh = photo.naturalHeight || photo.height;
    if (!sw || !sh || !window.kplHasTransparency?.(photo)) return null;
    const factor = Math.min(1, 320 / Math.max(sw, sh));
    const sample = document.createElement("canvas");
    sample.width = Math.round(sw * factor); sample.height = Math.round(sh * factor);
    const ctx = sample.getContext("2d", {willReadFrequently:true});
    ctx.drawImage(photo, 0, 0, sample.width, sample.height);
    let pixels;
    try { pixels = ctx.getImageData(0,0,sample.width,sample.height).data; } catch { return null; }
    const w = sample.width, h = sample.height;
    let x0=w, y0=h, x1=0, y1=0;
    for(let y=0;y<h;y++) for(let x=0;x<w;x++) if(pixels[(y*w+x)*4+3]>96){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
    if (x1<=x0 || y1<=y0) return null;
    const skin = new Uint8Array(w*h), visited = new Uint8Array(w*h);
    const limit = Math.min(h, Math.ceil(y0+(y1-y0)*.48));
    for(let y=y0;y<limit;y++) for(let x=x0;x<=x1;x++){
      const i=(y*w+x)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2];
      const cb=128-.168736*r-.331264*g+.5*b, cr=128+.5*r-.418688*g-.081312*b;
      if(pixels[i+3]>128 && r>55 && g>30 && b>15 && cr>132 && cr<181 && cb>72 && cb<132 && r>g*.95 && r>b*1.04)skin[y*w+x]=1;
    }
    let best=null;
    for(let index=0;index<skin.length;index++) if(skin[index]&&!visited[index]){
      const stack=[index];visited[index]=1;let count=0,l=w,t=h,r=0,b=0;
      while(stack.length){const i=stack.pop(),x=i%w,y=Math.floor(i/w);count++;l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);
        for(const n of [x>0?i-1:-1,x<w-1?i+1:-1,y>0?i-w:-1,y<h-1?i+w:-1]) if(n>=0&&skin[n]&&!visited[n]){visited[n]=1;stack.push(n);}}
      const score=count*(1-(t-y0)/Math.max(1,y1-y0));
      if(r-l>(x1-x0)*.09 && b-t>(y1-y0)*.055 && (!best || score>best.score))best={l,t,r,b,score};
    }
    let cx=(x0+x1)/2, crown=y0, chin=y0+Math.min((y1-y0)*.28,(x1-x0)*.65);
    if(best){cx=(best.l+best.r)/2;chin=best.b;
      const widths=[];
      for(let y=best.t;y<=best.b;y++){
        let left=w,right=-1;for(let x=best.l;x<=best.r;x++)if(skin[y*w+x]){left=Math.min(left,x);right=Math.max(right,x);}
        widths.push(Math.max(0,right-left+1));
      }
      const peak=Math.max(...widths.slice(0,Math.ceil(widths.length*.68)));
      const start=Math.floor(widths.length*.45);
      for(let n=start;n<widths.length-3;n++)if(widths[n]<peak*.65&&widths[n+1]<peak*.65&&widths[n+2]<peak*.65){chin=best.t+n+1;break;}
      chin=Math.min(best.b,chin+peak*.14);
      const half=(best.r-best.l)*.72;
      crown=best.t-(chin-best.t)*.3;
      outer:for(let y=y0;y<best.t;y++)for(let x=Math.max(x0,Math.floor(cx-half));x<=Math.min(x1,cx+half);x++)if(pixels[(y*w+x)*4+3]>128){crown=y;break outer;}}
    const result={headCenter:[cx/factor,(crown+chin)/2/factor],headHeight:(chin-crown)/factor};
    portraitHeads.set(photo,result);return result;
  }

  function portraitPosition(photo, fit, crop = {}) {
    const head=portraitHead(photo);
    if (!head || !fit?.headHeight) return null;
    const scale=fit.headHeight/head.headHeight*(Number(crop.zoom)||1);
    const left=fit.headCenter[0]-head.headCenter[0]*scale+(Number(crop.x)||0)*240;
    const top=fit.headCenter[1]-head.headCenter[1]*scale+(Number(crop.y)||0)*135;
    return [left,top,(photo.naturalWidth||photo.width)*scale,(photo.naturalHeight||photo.height)*scale];
  }

  function selectedLogo(id) {
    return window.kplTeamCatalog?.find(team => team.id === id);
  }

  function drawLogo(ctx, id, box, color) {
    const source = selectedLogo(id);
    const asset = image(source?.image);
    if (!asset?.naturalWidth) return false;
    const [x, y, w, h] = box;
    const scale = Math.min(w / asset.naturalWidth, h / asset.naturalHeight);
    const width = asset.naturalWidth * scale;
    const height = asset.naturalHeight * scale;
    let painted = asset;
    if (color) {
      painted = document.createElement("canvas"); painted.width = asset.naturalWidth; painted.height = asset.naturalHeight;
      const brush = painted.getContext("2d"); brush.drawImage(asset, 0, 0);
      brush.globalCompositeOperation = "source-in"; brush.fillStyle = color; brush.fillRect(0,0,painted.width,painted.height);
    }
    ctx.drawImage(painted, x + (w - width) / 2, y + (h - height) / 2, width, height);
    return true;
  }

  function drawRole(ctx, id, box, color = "#fff") {
    const role = window.kplRoleCatalog?.find(item => item.id === id);
    const asset = image(role?.image);
    if (!asset?.naturalWidth) return false;
    const tint = document.createElement("canvas");
    tint.width = asset.naturalWidth;
    tint.height = asset.naturalHeight;
    const layer = tint.getContext("2d");
    layer.drawImage(asset, 0, 0);
    layer.globalCompositeOperation = "source-in";
    layer.fillStyle = color;
    layer.fillRect(0, 0, tint.width, tint.height);
    const [x, y, w, h] = box;
    const scale = Math.min(w / tint.width, h / tint.height);
    ctx.drawImage(tint, x + (w - tint.width * scale) / 2, y + (h - tint.height * scale) / 2,
      tint.width * scale, tint.height * scale);
    return true;
  }

  function drawHero(ctx, photo, box, crop = {}, polygon) {
    if (!photo?.width) return;
    const [x, y, w, h] = box;
    const sourceWidth = photo.naturalWidth || photo.width;
    const sourceHeight = photo.naturalHeight || photo.height;
    const zoom = clamp(Number(crop.zoom) || 1, .25, 4);
    if (window.kplHasTransparency?.(photo)) {
      const scale = Math.max(w / sourceWidth, h / sourceHeight) * zoom;
      const width = sourceWidth * scale, height = sourceHeight * scale;
      const focusX = Number.isFinite(Number(crop.x)) ? Number(crop.x) : .5;
      const focusY = Number.isFinite(Number(crop.y)) ? Number(crop.y) : .5;
      ctx.save();
      if(polygon?.length){ctx.beginPath();ctx.moveTo(...polygon[0]);for(const point of polygon.slice(1))ctx.lineTo(...point);ctx.closePath();ctx.clip();}
      ctx.drawImage(photo, x + (w - width) / 2 + (.5-focusX) * w,
        y + h - height + (.5-focusY) * h, width, height);
      ctx.restore();
      return;
    }
    const scale = Math.max(w / sourceWidth, h / sourceHeight) * Math.max(1, zoom);
    const sw = w / scale;
    const sh = h / scale;
    const focusX = Number.isFinite(Number(crop.x)) ? Number(crop.x) : .5;
    const focusY = Number.isFinite(Number(crop.y)) ? Number(crop.y) : .35;
    const sx = clamp(sourceWidth * focusX - sw / 2, 0, sourceWidth - sw);
    const sy = clamp(sourceHeight * focusY - sh / 2, 0, sourceHeight - sh);
    ctx.save();
    if (polygon?.length) {
      ctx.beginPath();
      ctx.moveTo(...polygon[0]);
      for (const point of polygon.slice(1)) ctx.lineTo(...point);
      ctx.closePath();
      ctx.clip();
    }
    ctx.drawImage(photo, sx, sy, sw, sh, x, y, w, h);
    ctx.restore();
  }

  function badge(honor) {
    if (badges.has(honor.id)) return badges.get(honor.id);
    const bitmap = document.createElement("canvas");
    bitmap.width = honor.rows[0].length;
    bitmap.height = honor.rows.length;
    const ctx = bitmap.getContext("2d");
    const pixels = ctx.createImageData(bitmap.width, bitmap.height);
    const color = honor.tone === "silver" ? [223, 225, 230] : [226, 193, 119];
    honor.rows.forEach((row, y) => Array.from(row).forEach((value, x) => {
      pixels.data.set([...color, parseInt(value, 16) * 17], (y * bitmap.width + x) * 4);
    }));
    ctx.putImageData(pixels, 0, 0);
    badges.set(honor.id, bitmap);
    return bitmap;
  }

  function drawHonorBadge(ctx, glyph, cx, cy, diameter) {
    const asset = image(glyph.image);
    if (!asset?.naturalWidth && !glyph.rows) return false;
    const source = asset?.naturalWidth ? asset : badge(glyph);
    const registration = asset?.naturalWidth ? glyph.registrationDiameter || glyph.ringDiameter : 32;
    const anchor = asset?.naturalWidth ? glyph.anchor : [17, 17];
    const scale = diameter / registration;
    ctx.drawImage(source, cx - anchor[0] * scale, cy - anchor[1] * scale,
      source.width * scale, source.height * scale);
    return true;
  }

  function drawHonors(ctx, selected, box, options = {}) {
    const honors = (selected || []).map(item => ({
      ...item, glyph: window.kplHonorCatalog?.find(honor => honor.id === item.id)
    })).filter(item => item.glyph);
    if (!honors.length) return;
    const [x, y, w, h] = box;
    const diameter = options.diameter || 22.5;
    const columns = options.columns || 5;
    const rows = Math.ceil(honors.length / columns);
    const stepX = options.stepX || 34;
    const stepY = options.stepY || 35;
    const firstX = options.firstX ?? x + diameter / 2;
    const firstY = options.firstY ?? y + h - diameter / 2 - 10 - (rows - 1) * stepY;
    ctx.save();
    if (options.backdrop) {
      ctx.fillStyle = options.backdrop.color;
      ctx.fillRect(...options.backdrop.box);
    }
    if (options.shadow) {
      ctx.shadowColor = "rgba(0,0,0,.8)";
      ctx.shadowBlur = 3;
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    honors.forEach((item, index) => {
      const cx = firstX + stepX * (index % columns);
      const cy = firstY + stepY * Math.floor(index / columns);
      const glyph = options.classic ? item.glyph.classic || item.glyph : item.glyph;
      drawHonorBadge(ctx, glyph, cx, cy, options.classic && item.glyph.classic ? glyph.registrationDiameter : diameter);
      if (options.classic || item.count > 1) {
        ctx.font = (options.countWeight || 700) + " " + (options.countSize || 8) + "px " + (options.classic ? '"Microsoft YaHei", serif' : 'Arial, sans-serif');
        ctx.fillStyle = options.countColor || "#d5c6a8";
        const count = options.classic ? item.count + (item.glyph.classicUnit || "届") : "×" + item.count;
        ctx.fillText(count, cx, cy + (options.countOffset ?? diameter / 2 + 5));
      }
    });
    ctx.restore();
  }

  const honorImages = (window.kplHonorCatalog || []).flatMap(glyph => [glyph.image, glyph.classic?.image]).filter(Boolean);
  window.kplHonorAssetsReady = Promise.all(honorImages.map(source => image(source).decode()));
  window.kplShared = { image, drawHero, drawLogo, drawRole, drawHonors, drawHonorBadge, portraitHead, portraitPosition };
})();
