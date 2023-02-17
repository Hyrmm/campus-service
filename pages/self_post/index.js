const app = getApp()
let moudle = require("../../js/comment")
Page({



  data: {
    currentMainTabsIndex: 0,
    currentSecondTabsIndex: 0,
    second_hand_data: {
      currentPage: 1,
      fleaMarketMain: [],
      hasNext: true,
    }
  },
  onLoad: function (options) {
    // 默认闲置的所有发布信息

    moudle.get_selfPost_data.call(this, 0, 1)



  },
  get_detail(event) {
    switch (event.currentTarget.dataset.type) {
      case 0:
        wx.navigateTo({
          url: '/pages/secondHandDetails/index',
          success: (res) => {
            res.eventChannel.emit("data",this.data.second_hand_data.fleaMarketMain[event.currentTarget.dataset.index])
          }
        })
        break
    }

  },

  // 一级类目切换事件
  mainTabsChange(event) {
    this.setData({
      currentMainTabsIndex: event.detail.index
    })
  },
  // 二级类目切换事件
  secondTabsChange(event) {
    console.log(event)
    this.setData({
      currentSecondTabsIndex: event.currentTarget.dataset.index
    })
  },

  navBack() {
    wx.navigateBack({
      delta: 0,
    })
  }

})