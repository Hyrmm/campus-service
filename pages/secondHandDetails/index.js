// pages/secondHandDetails/index.js
const app = getApp()
let moudle = require("../../js/comment")
Page({

  data: {
    fleaMarketMain: {},
    imageList: [],
    scroll_index: 1
  },

  navBack() {
    wx.navigateBack({
      delta: 0,
    })
  },
  bindscroll: moudle.fangdou2(function (event) {
    let scroll_index
    if (event.detail.scrollLeft < (getApp().globalData.systemInfo.screenWidth * 0.90250666666666666666666666666667) - 10) {
      scroll_index = 1
    } else if (event.detail.scrollLeft < ((getApp().globalData.systemInfo.screenWidth * 0.90250666666666666666666666666667) * 2) - 10) {
      scroll_index = 2
    } else {
      scroll_index = 3
    }
    this.setData({
      scroll_index: scroll_index
    })
  }, 200),
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('data', (data) => {
      // 图片处理
      console.log(data)

      function getHeight(url) {
        return new Promise(resolve => {
          wx.getImageInfo({
            src: url,
            success: (res) => {

              let fixWidth = app.globalData.systemInfo.screenWidth * 0.90250666666666666666666666666667
              let rate = res.width / fixWidth
              let height = res.height/rate
              resolve(height)
            }
          })
        })
      }
      !(async function () {
        let maxHeight = 0
        for (let index in data.imageUrlList) {
          let res = await getHeight.call(this, data.imageUrlList[index])
          maxHeight = maxHeight <= res?res:maxHeight
          this.data.imageList.push({
            url: data.imageUrlList[index],
            height: res
          })

        }
        data.fleaMarketMain.maxHeight = maxHeight
        this.setData({
          fleaMarketMain: data.fleaMarketMain,
          imageList: this.data.imageList
        })

      }.call(this))


    })


  },
})