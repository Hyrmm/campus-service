// pages/sign_start/index.js
let app = getApp()
let moudle = require("../../js/comment")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sign_code: [],
  },
  navBack() {
    wx.navigateBack({
      delta: 0,
    })
  },
  keyTap(event) {

    if (this.data.sign_code.length <= 3) {
      if (event.currentTarget.dataset.value != "delete") {
        this.data.sign_code.push(event.currentTarget.dataset.value)
        this.setData({
          sign_code: this.data.sign_code
        })
        if (this.data.sign_code.length == 4) {

          !(async function () {
            let res = await moudle.get_location.call(this)
            if (res) {
              wx.getLocation({
                isHighAccuracy: 'true',
                success: (res) => {
                  console.log(res)
                  wx.request({
                    url: app.globalData.url + "/quicksign/submit",
                    data: {
                      longitude: res.longitude,
                      latitude: res.latitude,
                      signNum: this.data.sign_code.join(""),
                      token: wx.getStorageSync('token'),
                      stdId: app.globalData.bind_userInfo.stdId
                    },
                    success: (res) => {
                      if (res.statusCode == 200 && res.data.code == 200) {
                        wx.showToast({
                          title: '签到成功',
                        })
                        setTimeout(() => {
                          wx.navigateBack({
                            delta: 0,
                          })
                        }, 1500)
                      } else {
                        wx.showToast({
                          title: '服务器故障',
                          icon: "error"
                        })
                        this.setData({
                          sign_code: []
                        })
                      }
                    },
                    fail: (res) => {
                      wx.showToast({
                        title: '服务器故障',
                        icon: "error"
                      })
                      this.setData({
                        sign_code: []
                      })
                    }

                  })
                }
              })
            }
          }.call(this))
        }
      } else {
        this.data.sign_code.pop()
        this.setData({
          sign_code: this.data.sign_code
        })
      }
    }
  },
  onLoad: function (options) {

  },


})