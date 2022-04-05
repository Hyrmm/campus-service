const app = getApp()
Page({

  data: {},
  navTo_startSign() {
    wx.navigateTo({
      url: '/pages/sign_start/index',
    })
  },
  navTo_createSign() {
    wx.request({
      url: app.globalData.url + "/quicksign/create",
      data: {},
      success(res) {
        if (res.statusCode == 200 && res.data.code == 200) {
          let data = [String(res.data.data).slice(0, 2), String(res.data.data).slice(2, 4)]
          wx.navigateTo({
            url: '/pages/sign_create/index',
            success(res) {
              res.eventChannel.emit('data', data)
            }
          })
        } else {
          wx.showToast({
            title: '服务器故障',
            icon: "error"
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '服务器故障',
          icon: "error"
        })
      }
    })

  },
  navBack() {
    wx.navigateBack({
      delta: 0,
    })
  },

  onLoad: function (options) {},
})