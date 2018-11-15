
const titleFontSize = 40;
const qrSize = 0.4;
const qrPadding = 0.2;
const round = Math.PI * 2;

let imageInfo = {}

//image polyfill for wx
const MImage = function () {
  if (typeof Image == "function") return new Image();
  const self = this;

  let src = '';
  Object.defineProperty(this, 'src', {
    set(newValue) {
      src = newValue;
      wx.downloadFile({
        url: src, //仅为示例，并非真实的资源
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          self.onload(res.tempFilePath)
          // const fs=wx.getFileSystemManager()
          // fs.readFile({
          //   filePath:res.tempFilePath,
          //   success(data){
          //   },
          //   fail(){
          //     this.onerror||this.onerror()
          //   }
          // })
        },
        fail() {
          this.onerror || this.onerror()
        }
      })
    }
  })

}

class Card {
  constructor(options) {
    const setup = setupCanvas(options.ctx, options.width, options.height);
    this.ctx = setup.ctx;
    let padding = options.padding || 10;
    this.padding = padding;
    this.cWidth = setup.width;
    this.cHeight = setup.height;
    this.width = this.cWidth - padding * 2;
    this.height = this.cHeight - padding * 2;
    this.bannerURL = options.bannerURL; //头部图片地址
    this.qrURL = options.qrURL; //二维码地址
    this.banner = null;
    this.title = options.title;
    this.qr = null;
    this.list = options.list;


    this.init()
  }

  init() {
    this.initImage()
      .then(() => {
        this.draw()
      })
  }

  initImage() {

    return new Promise((resolve, reject) => {
      const banner = new MImage();
      const qr = new MImage();
      let count = 0;
      banner.onload = (data) => {
        this.banner = typeof data == 'string' ? data : banner;

        if (typeof data == 'string') {
          wx.getImageInfo({
            src: data,
            success: (res) => {
              this.bannerWidth = res.width;
              this.bannerHeight = res.height;
              count++;
              if (count == 2) {
                resolve()
              }
            },
            fail() {
              reject()
            }
          })
        } else {
          count++;
          if (count == 2) {
            resolve()
          }
        }

      }
      banner.onerror = (err) => {
        reject(err)
      }
      qr.onload = (data) => {
        this.qr = typeof data == 'string' ? data : qr;
        count++;
        if (count == 2) {
          resolve()
        }
      }
      banner.src = this.bannerURL;
      qr.src = this.qrURL;
    })
  }

  draw() {
    const ctx = this.ctx;
    const w2h = this.banner && this.banner.width ? this.banner.width / this.banner.height : this.bannerWidth / this.bannerHeight;
    ctx.clearRect(0, 0, this.cWidth, this.cHeight);


    //draw border outer
    new Box({
      x: this.padding, y: this.padding, width: this.width, height: this.height, radius: 20
    }).render(this.ctx)

    // draw banner
    const bannerH = this.width / w2h
    ctx.drawImage(this.banner, 0, 0, this.banner.width || this.bannerWidth, this.banner.height || this.bannerHeight, this.padding, this.padding, this.width, bannerH);


    //draw title
    ctx.font = titleFontSize + "px Source Han Sans"
    ctx.textAlign = "center"
    setFillStyle(ctx, "#fff")
    ctx.fillText("淘金一号", this.cWidth / 2, bannerH / 2 + titleFontSize / 2)

    //draw qrcode
    const qrS = qrSize > 1 ? qrSize : qrSize * this.width;
    const qrP = qrPadding > 1 ? qrPadding : qrPadding * qrS;
    ctx.drawImage(this.qr, (this.cWidth - qrS) / 2, bannerH + this.padding + qrP, qrS, qrS);

    //draw bottom items box
    let itemPadding = 10;
    let itemH = 50; //line-height of items
    const boxPadding = this.padding + 10;
    const boxHeight = this.list.length * itemH + 30;
    const boxWidth = this.cWidth - boxPadding * 2
    new Box({
      x: boxPadding,
      y: this.cHeight - boxHeight,
      width: boxWidth,
      height: boxHeight, radius: 10
    }).render(this.ctx)
    let item = null;
    for (let i = 0, l = this.list.length; i < l; i++) {
      item = this.list[i];
      new Item({
        x: itemPadding + boxPadding,
        y: this.cHeight - boxHeight + itemPadding + i * itemH,
        w: boxWidth - itemPadding * 2,
        h: itemH,
        label: item.label,
        value: item.value
      }).render(this.ctx)
    }

    ctx.draw && ctx.draw()
  }

}

//draw box with border and border-radius  shadow options
class Box {
  constructor({ x, y, width, height, radius, hasShadow, style }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.hasShadow = hasShadow;
    this.style = style || '#f1f1f1';
    this.itemCount = 0;
  }

  render(ctx) {
    const r = this.radius;
    const sx = this.x;
    const sy = this.y;

    ctx.beginPath()


    //top left
    ctx.arc(sx + r, sy + r, r, round * (2 / 4), round * (3 / 4))
    //top right
    ctx.arc(sx + this.width - r, sy + r, r, round * (3 / 4), 0)
    //bottom right
    ctx.arc(sx + this.width - r, sy + this.height - r, r, 0, round * (1 / 4))
    //bottom left
    ctx.arc(sx + r, sy + this.height - r, r, round * (1 / 4), round * (2 / 4))
    ctx.closePath()

    ctx.save()
    ctx.shadowColor = "#ccc";
    ctx.shadowBlur = 20;
    setStrokeStyle(ctx, this.style)
    ctx.stroke()
    ctx.restore()

    ctx.clip()

    ctx.fillStyle = "#fff";
    ctx.fill()
  }
}

class Item {
  constructor({ x, y, w, h, label, value, flex = 0.4, labelStyle = "#000", valueStyle = "#666", labelFontSize = 14, valueFontSize = 14 }) {
    this.x = x; this.y = y; this.w = w; this.h = h; this.label = label; this.value = value; this.flex = flex;
    this.labelStyle = labelStyle;
    this.valueStyle = valueStyle;
    this.labelFontSize = labelFontSize;
    this.valueFontSize = valueFontSize;
  }

  render(ctx) {
    ctx.font = `${this.labelFontSize}px Source Han Sans`;
    setFillStyle(ctx, this.labelStyle)
    setTextAlign(ctx, "start")
    ctx.fillText(this.label, this.x, this.y + this.h / 2 + this.labelFontSize / 2)
    ctx.font = `${this.valueFontSize}px Source Han Sans`;
    setFillStyle(ctx, this.valueStyle)
    setTextAlign(ctx, "end")
    ctx.fillText(this.value, this.x + this.w, this.y + this.h / 2 + this.valueFontSize / 2);
    setStrokeStyle(ctx, "#f1f1f1")
    ctx.moveTo(this.x, this.y + this.h);
    ctx.lineTo(this.x + this.w, this.y + this.h);
    ctx.stroke()
  }
}

function setupCanvas(context, sWidth, sHeight) {
  let dW = sWidth, dH = sHeight;
  try {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = context.canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    context.canvas.width = rect.width * dpr;
    context.canvas.height = rect.height * dpr;
    // var ctx = canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    dW = rect.width;
    dH = rect.height;
    context.scale(dpr, dpr);
  } catch (err) {
    wx.getSystemInfo({
      success(res) {
        // var dpr = res.pixelRatio;
        // console.log(res)
        // dW=sWidth*dpr;
        // dH=sHeight*dpr;
        // console.log(context)
        // context._context.canvas.width = dW;
        // context._context.canvas.height = dH;
        // context.scale(1/dpr, 1/dpr);        
      }
    })
  }
  return {
    ctx: context, width: dW, height: dH
  };
}

function setFillStyle(ctx, style) {
  if (ctx.setFillStyle) {
    ctx.setFillStyle(style)
  } else[
    ctx.fillStyle = style
  ]
}
function setStrokeStyle(ctx, style) {
  if (ctx.setStrokeStyle) {
    ctx.setStrokeStyle(style)
  } else[
    ctx.strokeStyle = style
  ]
}

function setTextAlign(ctx, style) {
  let s = '';
  if (style == "end") {
    s = "right"
  } else if (style == "start") {
    s = "left"
  } else {
    s = "center"
  }
  if (ctx.textAlign) {
    ctx.textAlign = s
  } else {
    ctx.setTextAlign(s)
  }
}

export default function drawCard(options) {
  return new Card(options)
}

// const canvasdom = document.querySelector("#canvas")

// drawCard({
//   bannerURL: "https://tse2-mm.cn.bing.net/th?id=OIP.zWhOGf_PgX0nRTLZLmFpGgHaEK&pid=Api",
//   qrURL: "https://tse2-mm.cn.bing.net/th?id=OIP.zWhOGf_PgX0nRTLZLmFpGgHaEK&pid=Api",
//   ctx: canvasdom.getContext("2d"),
//   width: canvasdom.width,
//   height: canvasdom.height,
//   padding: 10,
//   title: "淘金一号",
//   list: [
//     { label: "产品名称", value: "淘金一号" },
//     { label: "基金管理人", value: "杭州码上签财富管理有限公司" },
//     { label: "基金管理人......", value: "杭州码上签财富管理有限公司.........." },
//   ]
// })

