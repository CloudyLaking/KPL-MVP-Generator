(() => {
  "use strict";

  const frameWidth = 852;
  const frameHeight = 480;
  const width = 1920;
  const height = 1080;
  const chinese = '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif';
  const identityFont = '"Segoe UI", ' + chinese;
  const statFields = [["kda", "K/D/A"], ["damage", "伤害占比"], ["tank", "承伤占比"], ["participation", "参团率"]];
  // BEGIN CLASSIC IDENTITY R4
  const classicIdentityType = {"glyphs":{" ":[0,0,71,21,-10,-10,51.0],"!":[73,0,51,131,-10,-121,31.0],"\"":[126,0,74,134,-10,-124,54.0],"#":[202,0,122,129,-10,-119,102.0],"$":[326,0,164,157,-10,-132,144.0],"%":[492,0,204,143,-10,-127,184.0],"&":[698,0,178,133,-10,-121,158.0],"'":[878,0,53,134,-10,-124,33.0],"(":[933,0,71,160,-10,-131,51.0],")":[0,162,71,160,-10,-131,51.0],"*":[73,162,76,132,-10,-122,56.0],"+":[151,162,95,96,-10,-86,75.0],",":[248,162,50,51,-10,-23,30.0],"-":[300,162,89,73,-10,-63,69.0],".":[391,162,50,32,-10,-22,30.0],"/":[443,162,71,152,-10,-127,51.0],"0":[516,162,159,132,-10,-122,139.0],"1":[677,162,159,131,-10,-121,139.0],"2":[838,162,159,132,-10,-122,139.0],"3":[0,324,159,131,-10,-121,139.0],"4":[161,324,159,131,-10,-121,139.0],"5":[322,324,159,131,-10,-121,139.0],"6":[483,324,159,134,-10,-122,139.0],"7":[644,324,159,131,-10,-121,139.0],"8":[805,324,159,134,-10,-122,139.0],"9":[0,460,159,134,-10,-122,139.0],":":[161,460,50,90,-10,-80,30.0],";":[213,460,50,108,-10,-80,30.0],"<":[265,460,79,100,-10,-90,59.0],"=":[346,460,89,84,-10,-74,69.0],">":[437,460,79,100,-10,-90,59.0],"?":[518,460,161,132,-10,-122,141.0],"@":[681,460,124,134,-10,-124,104.0],"A":[807,460,155,131,-10,-121,135.0],"B":[0,596,162,131,-10,-121,142.0],"C":[164,596,166,132,-10,-122,146.0],"D":[332,596,164,131,-10,-121,144.0],"E":[498,596,138,131,-10,-121,118.0],"F":[638,596,138,131,-10,-121,118.0],"G":[778,596,164,132,-10,-122,144.0],"H":[0,730,161,131,-10,-121,141.0],"I":[163,730,65,131,-10,-121,45.0],"J":[230,730,145,131,-10,-121,125.0],"K":[377,730,152,131,-10,-121,132.0],"L":[531,730,135,131,-10,-121,115.0],"M":[668,730,200,131,-10,-121,180.0],"N":[0,863,161,131,-10,-121,141.0],"O":[163,863,166,132,-10,-122,146.0],"P":[331,863,150,131,-10,-121,130.0],"Q":[483,863,166,132,-10,-122,146.0],"R":[651,863,158,131,-10,-121,138.0],"S":[811,863,168,131,-10,-121,148.0],"T":[0,997,147,131,-10,-121,127.0],"U":[149,997,168,131,-10,-121,148.0],"V":[319,997,155,131,-10,-121,135.0],"W":[476,997,225,131,-10,-121,205.0],"X":[703,997,160,131,-13,-121,137.0],"Y":[865,997,149,131,-10,-121,129.0],"Z":[0,1130,147,131,-10,-121,127.0],"[":[149,1130,62,160,-10,-132,42.0],"\\":[213,1130,71,152,-10,-127,51.0],"]":[286,1130,62,160,-10,-132,42.0],"^":[350,1130,83,127,-10,-117,63.0],"_":[435,1130,83,26,-10,-10,63.0],"`":[520,1130,65,137,-10,-127,45.0],"a":[587,1130,134,99,-10,-89,114.0],"b":[723,1130,136,131,-10,-121,116.0],"c":[861,1130,135,99,-10,-89,115.0],"d":[0,1292,136,131,-10,-121,116.0],"e":[138,1292,136,99,-10,-89,116.0],"f":[276,1292,83,131,-10,-121,63.0],"g":[361,1292,138,133,-10,-89,118.0],"h":[501,1292,136,131,-10,-121,116.0],"i":[639,1292,56,131,-10,-121,36.0],"j":[697,1292,65,165,-10,-121,45.0],"k":[764,1292,119,131,-10,-121,99.0],"l":[885,1292,58,131,-10,-121,38.0],"m":[0,1459,200,99,-10,-89,180.0],"n":[202,1459,138,99,-10,-89,118.0],"o":[342,1459,135,99,-10,-89,115.0],"p":[479,1459,135,131,-10,-89,115.0],"q":[616,1459,136,131,-10,-89,116.0],"r":[754,1459,129,99,-10,-89,109.0],"s":[885,1459,136,99,-10,-89,116.0],"t":[0,1592,114,115,-10,-105,94.0],"u":[116,1592,136,99,-10,-89,116.0],"v":[254,1592,121,99,-10,-89,101.0],"w":[377,1592,169,99,-13,-89,145.0],"x":[548,1592,122,99,-10,-89,102.0],"y":[672,1592,114,133,-10,-89,94.0],"z":[788,1592,121,99,-10,-89,101.0],"{":[911,1592,67,160,-10,-129,47.0],"|":[0,1754,48,161,-10,-129,28.0],"}":[50,1754,67,160,-10,-129,47.0],"~":[119,1754,109,91,-10,-81,89.0]},"sourceGlyphs":{"H":[230,1754,24,33,-2,-31,26],"e":[256,1754,21,25,-2,-23,24],"r":[279,1754,20,25,-2,-23,20],"o":[301,1754,22,25,-2,-23,24]},"period":[325,1754,10,9],"sourceSize":160,"nativeSize":38.52832799315776,"widthRatio":0.6404793277236815,"trackingNative":5.0545031143944925,"strokeBlend":0.6595393184588649,"blurNative":0.744594617578424,"alphaGamma":0.8860738645262176,"image":"./_art/render-classic.js/30d42d673e96b89898497c5775b9cbaddfc6091a7a0cad2cf668cbb5aca988b2.png"};
  const identityAtlas = new Image();
  identityAtlas.src = classicIdentityType.image;
  window.kplClassicIdentityReady = identityAtlas.decode().then(() => {
    window.dispatchEvent(new Event("kplassetload"));
  });
  const identityRasters = new Map();
  const identityNativeScale = 1920 / 852;
  const identityCjk = '"Microsoft YaHei", "KplCJK", sans-serif';

  function identityPlane(width) {
    const value = document.createElement("canvas");
    value.width = width; value.height = 86;
    return value;
  }

  function identitySoftening(canvas, stroke = 0, blur = 0, gamma = 1) {
    const ctx=canvas.getContext("2d",{willReadFrequently:true});
    if(stroke){
      const pixels=ctx.getImageData(0,0,canvas.width,canvas.height),original=new Uint8ClampedArray(pixels.data);
      for(let y=1;y<canvas.height-1;y++)for(let x=1;x<canvas.width-1;x++){
        const index=(y*canvas.width+x)*4;let maximum=0;
        for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)maximum=Math.max(maximum,original[((y+dy)*canvas.width+x+dx)*4+3]);
        pixels.data[index+3]=original[index+3]*(1-stroke)+maximum*stroke;
        pixels.data[index]=pixels.data[index+1]=pixels.data[index+2]=255;
      }
      ctx.putImageData(pixels,0,0);
    }
    if(blur){const copy=identityPlane(canvas.width);copy.getContext("2d").drawImage(canvas,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.filter=`blur(${blur}px)`;ctx.drawImage(copy,0,0);ctx.filter="none";}
    if(gamma!==1){const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);for(let n=3;n<pixels.data.length;n+=4)pixels.data[n]=255*Math.pow(pixels.data[n]/255,gamma);ctx.putImageData(pixels,0,0);}
    return canvas;
  }

  function identityRaster(text, mode = "title", color = "#ffffff") {
    if(!identityAtlas.naturalWidth)return null;
    const key=[mode,color,text].join("|");
    if(identityRasters.has(key))return identityRasters.get(key);
    const size = mode==="real" ? 15.6 : mode==="region" ? 11.1 : 15.3;
    const measurement=document.createElement("canvas").getContext("2d");
    measurement.font=`400 ${size*identityNativeScale}px ${identityCjk}`;
    const type=classicIdentityType,scale=type.nativeSize/type.sourceSize;
    const pieces=[...text].map(character=>{
      const sourceGlyph=mode==="title"&&type.sourceGlyphs[character];
      const glyph=mode==="title"&&character!=="."&&!sourceGlyph&&type.glyphs[character];
      const advance=mode==="title"&&character==="." ? 11.0
        : sourceGlyph ? sourceGlyph[6] : glyph ? glyph[6]*scale*type.widthRatio+type.trackingNative
        : measurement.measureText(character).width;
      return {character,glyph,sourceGlyph,advance};
    });
    const width=Math.ceil(pieces.reduce((total,piece)=>total+piece.advance,0)+24);
    const latin=identityPlane(width),cjk=identityPlane(width),dot=identityPlane(width);
    const l=latin.getContext("2d"),c=cjk.getContext("2d"),d=dot.getContext("2d");
    c.fillStyle="white";c.textBaseline="alphabetic";c.font=measurement.font;
    let cursor=12;
    for(const piece of pieces){
      if(mode==="title"&&piece.character===".")d.drawImage(identityAtlas,...type.period,cursor-2,45,type.period[2],type.period[3]);
      else if(piece.sourceGlyph){const [x,y,w,h,left,top]=piece.sourceGlyph;d.drawImage(identityAtlas,x,y,w,h,cursor+left,52+top,w,h);}
      else if(piece.glyph){const [x,y,w,h,left,top]=piece.glyph;l.drawImage(identityAtlas,x,y,w,h,cursor+left*scale*type.widthRatio,50+top*scale,w*scale*type.widthRatio,h*scale);}
      else c.fillText(piece.character,cursor,50);
      cursor+=piece.advance;
    }
    const result=identityPlane(width),brush=result.getContext("2d",{willReadFrequently:true});
    brush.drawImage(identitySoftening(latin,type.strokeBlend,type.blurNative,type.alphaGamma),0,0);
    brush.drawImage(identitySoftening(cjk,0,.75,1),0,0);
    brush.drawImage(dot,0,0);
    brush.globalCompositeOperation="source-in";brush.fillStyle=color;brush.fillRect(0,0,result.width,result.height);brush.globalCompositeOperation="source-over";
    const pixels=brush.getImageData(0,0,result.width,result.height).data;
    let left=result.width,top=result.height,right=0,bottom=0;
    for(let y=0;y<result.height;y++)for(let x=0;x<result.width;x++)if(pixels[(y*result.width+x)*4+3]>2){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x+1);bottom=Math.max(bottom,y+1);}
    if(right<=left)return null;
    left=Math.max(0,left-1);top=Math.max(0,top-1);right=Math.min(result.width,right+1);bottom=Math.min(result.height,bottom+1);
    const cropped=document.createElement("canvas");cropped.width=right-left;cropped.height=bottom-top;cropped.getContext("2d").drawImage(result,left,top,cropped.width,cropped.height,0,0,cropped.width,cropped.height);
    const raster={image:cropped,baseline:50-top,width:cropped.width/identityNativeScale,height:cropped.height/identityNativeScale};
    identityRasters.set(key,raster);if(identityRasters.size>64)identityRasters.delete(identityRasters.keys().next().value);
    return raster;
  }

  function drawSourceIdentity(ctx,text,layout) {
    const raster=identityRaster(text);if(!raster)return false;
    const [center,,available]=layout.ribbonName;
    const fit=Math.min(1,available/raster.width);
    ctx.drawImage(raster.image,center-raster.width*fit/2,456-raster.baseline/identityNativeScale,raster.width*fit,raster.height);
    return true;
  }

  function drawSourcePersonal(ctx,text,mode) {
    const raster=identityRaster(text,mode,mode==="real"?"#ecebec":"#dad8dc");if(!raster)return false;
    const x=mode==="real"?50.6:109.2,baseline=mode==="real"?452.9:451.3;
    ctx.drawImage(raster.image,x,baseline-raster.baseline/identityNativeScale,raster.width,raster.height);
    return true;
  }
  // END CLASSIC IDENTITY R4
  const layouts = {
    classic2018spring: {
      club: /^(hero|hero久竞)$/i,
      clubName: "Hero",
      portrait: [300, 460, 250],
      panel: [452, 107, 366, 272],
      hero: [662, 114, 153, 256],
      stat: {
        left: 471, center: 603.5, labelMid: [137, 225, 313], baseline: [177, 270, 363],
        digitHeight: 23, kda: [493, 524.5, 550.5, 581.5, 612], kdaHeight: 22, slashBottom: 180
      },
      ribbonName: [527.5, 450.5, 177, 18],
      personal: [50, 448, 53, 16],
      region: [109, 448, 54, 11],
      honorWall: false
    },
    classic2018fall: {
      club: /^(hero|hero久竞)$/i,
      clubName: "Hero",
      portrait: [284, 459, 260],
      panel: [414, 87, 417, 289],
      hero: [665, 104, 151, 254],
      stat: {
        left: 437, center: 572.5, labelMid: [119, 212, 310], baseline: [162, 257, 348],
        digitHeight: 25, kda: [448.5, 498, 536, 569, 601.5], kdaHeight: 25, slashBottom: 163, firstKdaLeft: 441
      },
      ribbonName: [512, 449.5, 177, 20],
      personal: [37, 449, 66, 18],
      region: [114, 450, 53, 12],
      honorWall: true
    },
    classic2019spring: {
      club: /^(武汉)?estarpro$/i,
      clubName: "eStarPro",
      portrait: [271.5, 432, 214],
      panel: [414, 87, 417, 289],
      hero: [662, 98, 158, 266],
      stat: {
        left: 437, center: 572.5, labelMid: [119, 212, 310], baseline: [162, 257, 348],
        digitHeight: 25, kda: [447.5, 498.5, 535.5, 568.5, 601], kdaHeight: 25, slashBottom: 163
      },
      ribbonName: [512.5, 449.5, 177, 20],
      personal: [37, 449, 66, 18],
      region: [113, 450, 53, 12],
      honorWall: false
    },
    classic2019fall: {
      club: /^(成都)?ag(超玩会)?$/i,
      clubName: "AG超玩会",
      portrait: [301, 451, 202],
      panel: [426, 87, 416, 289],
      hero: [677, 103, 150, 254],
      stat: {
        left: 449, center: 567, labelMid: [119, 212.5, 310], baseline: [166, 259, 351],
        digitHeight: 25, kda: [472.5, 509, 542, 575, 609], kdaHeight: 28,
        slashBottom: 164, goldSlash: true
      },
      ribbonName: [504, 446.5, 177, 20],
      personal: [35, 447, 60, 18],
      region: [101, 448, 53, 12],
      honorWall: true
    }
  };

  const transparency = new WeakMap();
  let portraitLayer;

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function sourceDimensions(image) {
    if (image?.complete === false) return [0, 0];
    return [image?.naturalWidth || image?.width, image?.naturalHeight || image?.height];
  }

  function slice(ctx, assets, name, centerY) {
    const part = assets?.parts?.[name];
    if (!assets?.atlas?.complete || !assets.atlas.naturalWidth || part?.length !== 8) return false;
    const [sx, sy, sw, sh, x, y, w, h] = part;
    ctx.drawImage(assets.atlas, sx, sy, sw, sh, x, centerY === undefined ? y : centerY - h / 2, w, h);
    return true;
  }

  function label(ctx, text, x, y, maxWidth, size, fill, weight = 700, family = chinese) {
    if (!text) return;
    ctx.font = weight + " " + size + "px " + family;
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y, maxWidth);
  }

  function polygon(ctx, vertices, color) {
    ctx.beginPath();
    ctx.moveTo(...vertices[0]);
    for (const vertex of vertices.slice(1)) ctx.lineTo(...vertex);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawBackground(ctx, assets) {
    const [assetWidth, assetHeight] = sourceDimensions(assets?.background);
    if (assetWidth && assetHeight) {
      ctx.drawImage(assets.background, 0, 0, frameWidth, frameHeight);
      return;
    }
    const arena = ctx.createRadialGradient(474, 177, 15, 474, 177, 370);
    arena.addColorStop(0, "#07528a");
    arena.addColorStop(.58, "#082342");
    arena.addColorStop(1, "#040a13");
    ctx.fillStyle = arena;
    ctx.fillRect(0, 0, frameWidth, frameHeight);
    polygon(ctx, [[0, 0], [192, 0], [247, 105], [209, 417], [0, 417]], "#202020");
    polygon(ctx, [[0, 417], [611, 417], [650, 480], [0, 480]], "#1b1b20");
    label(ctx, "KPL", 61, 53, 93, 28, "#f2f5fe", 900, "Arial, sans-serif");
    label(ctx, "本局最佳", 27, 142, 156, 32, "#eac578", 900);
    ctx.fillStyle = "#d83f33";
    ctx.fillRect(62, 199, 67, 2);
    ctx.fillStyle = "#255dd2";
    ctx.fillRect(62, 334, 67, 2);
  }

  function hasClearEdges(image) {
    if (transparency.has(image)) return transparency.get(image);
    const test = document.createElement("canvas");
    test.width = test.height = 12;
    const ctx = test.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, 12, 12);
    let transparent = true;
    try {
      const data = ctx.getImageData(0, 0, 12, 12).data;
      transparent = [0, 11, 132, 143].some(index => data[index * 4 + 3] < 96);
    } catch {
      // Use the original image if the browser prevents alpha sampling.
    }
    transparency.set(image, transparent);
    return transparent;
  }

  function drawPortrait(ctx, photo, crop, layout) {
    const [sourceWidth, sourceHeight] = sourceDimensions(photo);
    if (!(sourceWidth && sourceHeight)) return;
    const [center, targetHeight, targetWidth] = layout.portrait;
    const zoom = clamp(Number(crop.zoom) || 1, .5, 3);
    const scale = Math.min(targetHeight / sourceHeight, targetWidth / sourceWidth) * zoom;
    const photoWidth = sourceWidth * scale;
    const photoHeight = sourceHeight * scale;
    const x = center - photoWidth / 2 + clamp(Number(crop.x) || 0, -1, 1) * 140;
    const y = frameHeight - photoHeight + clamp(Number(crop.y) || 0, -1, 1) * 125;
    if (hasClearEdges(photo)) {
      ctx.drawImage(photo, x, y, photoWidth, photoHeight);
      return;
    }

    // Blend the edges of ordinary rectangular uploads into the venue.
    if (!portraitLayer) {
      portraitLayer = document.createElement("canvas");
      portraitLayer.width = width;
      portraitLayer.height = height;
    }
    const layer = portraitLayer.getContext("2d");
    layer.save();
    layer.setTransform(width / frameWidth, 0, 0, height / frameHeight, 0, 0);
    layer.clearRect(0, 0, frameWidth, frameHeight);
    layer.drawImage(photo, x, y, photoWidth, photoHeight);
    layer.globalCompositeOperation = "destination-in";
    const sides = layer.createLinearGradient(x, 0, x + photoWidth, 0);
    sides.addColorStop(0, "transparent");
    sides.addColorStop(.13, "black");
    sides.addColorStop(.87, "black");
    sides.addColorStop(1, "transparent");
    layer.fillStyle = sides;
    layer.fillRect(x, y, photoWidth, photoHeight);
    const vertical = layer.createLinearGradient(0, y, 0, y + photoHeight, 0);
    vertical.addColorStop(0, "transparent");
    vertical.addColorStop(.08, "black");
    vertical.addColorStop(.95, "black");
    vertical.addColorStop(1, y + photoHeight < frameHeight ? "transparent" : "black");
    layer.fillStyle = vertical;
    layer.fillRect(x, y, photoWidth, photoHeight);
    layer.restore();
    ctx.drawImage(portraitLayer, 0, 0, frameWidth, frameHeight);
  }

  function drawPanel(ctx, assets, layout, rowCount) {
    const [x, y, w, h] = layout.panel;
    const divider = layout.hero[0] - 10;
    if (slice(ctx, assets, "stats")) {
      if (rowCount === 4) {
        ctx.fillStyle = "#0b0b0b";
        ctx.fillRect(x + 2, y + 2, divider - x + 4, h - 4);
        ctx.fillStyle = "#262528";
        for (let index = 1; index < rowCount; index++) {
          ctx.fillRect(x + 2, y + h * index / rowCount, divider - x + 4, .75);
        }
      }
      return;
    }
    const border = ctx.createLinearGradient(x, y, x, y + h);
    border.addColorStop(0, "#28508e");
    border.addColorStop(1, "#5b2153");
    ctx.fillStyle = border;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#0d0e10";
    ctx.fillRect(x + 1.3, y + 1.3, w - 2.6, h - 2.6);
    ctx.fillStyle = "#262528";
    ctx.fillRect(divider, y + 2, .8, h - 4);
    for (let index = 1; index < rowCount; index++) {
      ctx.fillRect(x + 2, y + h * index / rowCount, divider - x - 2, .75);
    }
  }

  function drawHero(ctx, assets, layout, data, photo) {
    if (data.useClassicReferenceHero && slice(ctx, assets, "hero")) return;
    const [x, y, w, h] = layout.hero;
    const [sourceWidth, sourceHeight] = sourceDimensions(photo);
    if (sourceWidth && sourceHeight) {
      window.kplShared.drawHero(ctx, photo, [x, y, w, h], data.heroCrop);
      return;
    }
    if (!data.hero) return;
    ctx.fillStyle = "#171720";
    ctx.fillRect(x, y, w, h);
    ctx.textAlign = "center";
    label(ctx, data.hero, x + w / 2, y + h / 2, w - 22, 23, "#e8d2a0");
    ctx.textAlign = "left";
  }

  function drawGlyphs(ctx, characters, center, bottom, height, maxWidth, align = "center") {
    const { atlas, glyphs } = window.kplClassicGlyphs;
    const scaleY = height / 25;
    const advances = characters.map((character, index) => {
      const next = characters[index + 1];
      const gap = next ? (character === "." || next === "." ? 3.5 : 4.5) : 0;
      return glyphs[character][8] + gap;
    });
    const total = advances.reduce((sum, advance) => sum + advance, 0);
    const scaleX = Math.min(scaleY, maxWidth / total);
    let x = align === "left" ? center : center - total * scaleX / 2;
    characters.forEach((character, index) => {
      const [sx, sy, sw, sh, w, h, inset, baseline] = glyphs[character];
      ctx.drawImage(atlas, sx, sy, sw, sh, x - inset * scaleX, bottom - baseline * scaleY, w * scaleX, h * scaleY);
      x += advances[index] * scaleX;
    });
  }

  function drawStats(ctx, assets, layout, stats) {
    const { left, center, labelMid, baseline, digitHeight, kda, kdaHeight, slashBottom, goldSlash } = layout.stat;
    const glyphAtlas = window.kplClassicGlyphs?.atlas;
    const glyphsReady = glyphAtlas?.complete && glyphAtlas.naturalWidth;
    const compact = stats.length > 3;
    stats.forEach(([key, name, value], index) => {
      const originalRow = !compact && key === statFields[index][0];
      const rowTop = layout.panel[1] + layout.panel[3] * index / 4;
      const labelY = compact ? rowTop + 18 : labelMid[index];
      const bottom = compact ? rowTop + 55 : baseline[index];
      if (!slice(ctx, assets, key + "Label", originalRow ? undefined : labelY)) {
        label(ctx, name, left, labelY, 114, 14, "#f0eeee", 400);
      }
      if (originalRow && assets?.text?.[key] === value && slice(ctx, assets, key + "Value")) return;

      const factor = compact ? .8 : 1;
      const maxWidth = 2 * (layout.hero[0] - center - 7);
      if (key === "kda" && glyphsReady && /^\d+\/\d+\/\d+$/.test(value)) {
        const score = value.split("/");
        [0, 2, 4].forEach((slot, i) => drawGlyphs(ctx, [...score[i]], i === 0 && layout.stat.firstKdaLeft ? layout.stat.firstKdaLeft : kda[slot], bottom, kdaHeight * factor, 36, i === 0 && layout.stat.firstKdaLeft ? "left" : "center"));
        const slash = goldSlash ? "/" : "slashGray";
        const slashY = bottom + slashBottom - baseline[0];
        for (const slot of [1, 3]) drawGlyphs(ctx, [slash], kda[slot], slashY, 25 * factor, 18);
      } else if (glyphsReady && /^[\d.]+%$/.test(value)) {
        drawGlyphs(ctx, [...value], center, bottom, digitHeight * factor, maxWidth);
      } else {
        ctx.textAlign = "center";
        const isKda = key === "kda";
        label(ctx, value, isKda ? (kda[0] + kda[4]) / 2 : center, bottom - 12,
          isKda ? kda[4] - kda[0] + 30 : maxWidth, 31 * factor, "#f0d59a", 400, identityFont);
        ctx.textAlign = "left";
      }
    });
  }

  function drawIdentity(ctx, assets, layout, data) {
    const usesReferenceClub = layout.club.test(data.team || "");
    if (data.teamLogo) {
      window.kplShared.drawLogo(ctx, data.teamLogo, [54, 220, 83, 92], "#f7f7f7");
    } else if (data.team && (!usesReferenceClub || !slice(ctx, assets, "club"))) {
      ctx.textAlign = "center";
      label(ctx, data.team, 95, 267, 138, 24, "#f7f8fc", 900);
      ctx.textAlign = "left";
    }
    const title = [usesReferenceClub ? layout.clubName : data.team, data.player].filter(Boolean).join(".");
    ctx.textAlign = "center";
    if (title !== assets?.text?.ribbonName || !slice(ctx, assets, "ribbonName")) {
      if (data.template === "classic2018spring") {
        drawSourceIdentity(ctx, title, layout);
      } else {
        ctx.letterSpacing = ".7px";
        label(ctx, title, ...layout.ribbonName, "#f0eef0", 400, identityFont);
      }
      ctx.letterSpacing = "0px";
    }
    ctx.textAlign = "left";
    if (data.realName !== assets?.text?.realName || !slice(ctx, assets, "realName")) {
      if(data.template!=="classic2018spring" || !drawSourcePersonal(ctx,data.realName,"real"))label(ctx, data.realName, ...layout.personal, "#ecebec", 400);
    }
    if (data.region !== assets?.text?.region || !slice(ctx, assets, "region")) {
      if(data.template!=="classic2018spring" || !drawSourcePersonal(ctx,data.region,"region"))label(ctx, data.region, ...layout.region, "#dad8dc", 400);
    }
  }

  window.renderClassicKpl = function renderClassicKpl(canvas, data = {}, photo, crop = {}, heroPhoto) {
    const layout = layouts[data.template] || layouts.classic2018spring;
    const assets = window.kplClassicAssets?.[data.template];
    const stats = statFields.map(([key, name]) => [key, name, data[key]]).filter(([, , value]) => value);
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.scale(width / frameWidth, height / frameHeight);
    ctx.textBaseline = "middle";
    drawBackground(ctx, assets);
    drawIdentity(ctx, assets, layout, data);
    drawPortrait(ctx, photo, crop, layout);
    if (layout.honorWall) {
      if (data.honors?.length) {
        const autumn2019 = data.template === "classic2019fall";
        window.kplShared.drawHonors(ctx, data.honors, [29, 346, 137, 67], {
          classic: true, diameter: 20, columns: 14, stepX: 36.5,
          firstX: autumn2019 && data.honors.length === 1 ? 92.5 : 51.5,
          firstY: autumn2019 && data.honors.length <= 4 ? 399 : 400,
          countOffset: autumn2019 && data.honors.length <= 4 ? -20.5 : -16.5,
          countSize: 8.5, countWeight: 400, countColor: "#ead6a5"
        });
      } else if (data.useClassicReferenceHonors) slice(ctx, assets, "honors");
    }
    drawPanel(ctx, assets, layout, Math.max(3, stats.length));
    drawHero(ctx, assets, layout, data, heroPhoto);
    drawStats(ctx, assets, layout, stats);
    slice(ctx, assets, "product");
    ctx.textAlign = "right";
    label(ctx, "非官方制作", 837, 471, 95, 7.4, "#c2bec7", 700);
    ctx.restore();
  };
})();
