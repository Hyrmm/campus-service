// pages/sign_start/index.js
let app = getApp()
let moudle = require("../../js/comment")
Page({
  data: {
    sign_code: [],
    longitude: null,
    latitude: null
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
          wx.showLoading({
            title: "提交中",
            mask: true
          });
          !(async function () {
            let res = await moudle.get_location.call(this)
            if (res === true) {
              wx.getLocation({
                isHighAccuracy: 'true',
                success: (res) => {
                  this.data.longitude = res.longitude
                  this.data.latitude = res.latitude
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
                      } else if (res.data.code == 3403) {
                        wx.hideLoading({})
                        wx.showToast({
                          title: '不在有效范围内',
                          icon: "error"
                        })
                        this.setData({
                          sign_code: []
                        })

                      } else {
                        wx.hideLoading({})
                        wx.showToast({
                          title: '签到码无效',
                          icon: "error"
                        })
                        this.setData({
                          sign_code: []
                        })

                      }
                    },
                    fail: (res) => {
                      wx.hideLoading({})
                      wx.showToast({
                        title: '服务器故障',
                        icon: "error"
                      })
                      this.setData({
                        sign_code: []
                      })

                    }

                  })
                },
                fail: (res) => {
                  // 频率太高直接用储存的坐标
                  // 这里判断一下是否存在历史坐标信息，不存提示重新获取坐标信息
                  if (this.data.longitude && this.data.latitude) {
                    // 这里说明是有历史坐标信息,直接带着历史坐标去请求
                    wx.request({
                      url: app.globalData.url + "/quicksign/submit",
                      data: {
                        longitude: this.data.longitude,
                        latitude: this.data.latitude,
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
                        } else if (res.data.code == 3403) {
                          wx.hideLoading({})
                          wx.showToast({
                            title: '不在有效范围内',
                            icon: "error"
                          })
                          this.setData({
                            sign_code: []
                          })

                        } else {
                          wx.hideLoading({})
                          wx.showToast({
                            title: '签到码无效',
                            icon: "error"
                          })
                          this.setData({
                            sign_code: []
                          })

                        }
                      },
                      fail: (res) => {
                        wx.hideLoading({})
                        wx.showToast({
                          title: '服务器故障',
                          icon: "error"
                        })
                        this.setData({
                          sign_code: []
                        })
                      }

                    })
                  } else {
                    // 没有历史历史信息,提示重新去获取
                    this.setData({
                      sign_code: []
                    })
                    wx.hideLoading({})
                    wx.showToast({
                      title: '获取定位失败',
                    })
                  }

                }
              })
            } else if (res === false) {
              wx.hideLoading({})
              this.setData({
                sign_code: []
              })
            } else {
              // 未弹出过授权,弹出授权
              wx.getLocation({
                isHighAccuracy: 'true',
                success: (res) => {
                  // 用户同意授权了,开始请求
                  this.data.longitude = res.longitude
                  this.data.latitude = res.latitude
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
                      } else if (res.data.code == 3403) {
                        wx.hideLoading({})
                        wx.showToast({
                          title: '不在有效范围内',
                          icon: "error"
                        })
                        this.setData({
                          sign_code: []
                        })
                      } else {
                        wx.hideLoading({})
                        wx.showToast({
                          title: '签到码无效',
                          icon: "error"
                        })
                        this.setData({
                          sign_code: []
                        })
                      }
                    },
                    fail: (res) => {
                      wx.hideLoading({})
                      wx.showToast({
                        title: '服务器故障',
                        icon: "error"
                      })
                      this.setData({
                        sign_code: []
                      })
                    }

                  })
                },
                fail: (res) => {
                  // 用户拒绝授权了，或者即使授权了也会因为获取位置信息失败还回调fail(先不做处理吧)
                  wx.showModal({
                    title: '温馨提示',
                    content: '检测到你拒绝授权位置信息，是否前往重新授权，反之无法进行签到',
                    success(res) {
                      if (res.confirm) {
                        wx.openSetting({})
                      } else {
                        wx.navigateBack({
                          delta: 0,
                        })
                      }
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