//index.js
import drawCard from '../../utils/card-share.js'
import UPNG from '../../utils/UPNG.js'
//获取应用实例
const app = getApp()

window=global;

Page({
  data: {
    showCanvas:true,
    image:""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    const query = wx.createSelectorQuery()
    const canvasdom=query.select('#canvas')
    const bound = canvasdom.boundingClientRect()
    const ctx = wx.createCanvasContext('canvas');
    let canvasw,canvash;
    // return;
    query.exec((res) => {
      canvasw=res[0].width;
      canvash=res[0].height;
      drawCard({
        bannerURL: "https://tse2-mm.cn.bing.net/th?id=OIP.zWhOGf_PgX0nRTLZLmFpGgHaEK&pid=Api",
        qrURL: "https://tse4-mm.cn.bing.net/th?id=OIP.DVm65ampLntp4ixWDXlNNAHaHa&w=194&h=194&c=7&o=5&dpr=2&pid=1.7",
        ctx: ctx,
        width: res[0].width,
        height: res[0].height,
        padding: 10,
        title: "淘金一号",
        list: [
          { label: "产品名称", value: "淘金一号" },
          { label: "基金管理人", value: "杭州码上签财富管理有限公司" },
          { label: "基金管理人", value: "杭州码上签财富管理有限公司" },
        ]
      })
      // wx.canvasGetImageData({
      //   canvasId: 'canvas',
      //   x: 0,
      //   y: 0,
      //   width: canvasw,
      //   height: canvash,
      //   success: (res) => {
      //     console.log(res)
      //     let pngData = UPNG.encode([res.data.buffer], res.width, res.height)
      //     let base64 = wx.arrayBufferToBase64(pngData)
      //     this.setData({
      //       showCanvas:false,
      //       image: "data:image/png;base64,"+base64
      //     })
      //   }})
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0, y: 0, width: canvasw, height: canvash, destWidth: canvasw*2, destHeight: canvash*2, canvasId: "canvas", quality: 1,
          success: (res) => {
            this.setData({
              showCanvas: false,
              image: res.tempFilePath
            })
          }
        }, this)
      },1000)
      

    })
  
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
