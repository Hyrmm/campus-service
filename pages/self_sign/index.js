const app = getApp()
const moudle = require("../../js/comment")
let create_time_out = null
let create_time_out_time = null
let sign_code = []
Page({

  data: {
    create_time_out: null,
    sign_code: [],
    createSign_isClicked: false,
    startSign_isClicked: false,
    longitude: null,
    latitude: null
  },
  navTo_startSign() {
    wx.navigateTo({
      url: '/pages/sign_start/index',
    })
  },
  navTo_createSign() {
    this.setData({
      createSign_isClicked: true
    })
    wx.showLoading({
      title: "创建中",
      mask: true
    })
    // 判断是否存在历史创建签到
    if (sign_code.length == 0 || create_time_out - (Date.now() - create_time_out_time) <= 0) {
      !(async function () {
        let res = await moudle.get_location.call(this)
        if (res === true) {
          wx.getLocation.call(this, {
            isHighAccuracy: true,
            success: (res) => {
              console.log(res)
              // 更新下坐标 
              this.data.longitude = res.longitude
              this.data.latitude = res.latitude
              wx.request.call(this, {
                url: app.globalData.url + "/quicksign/create",
                data: {
                  longitude: res.longitude,
                  latitude: res.latitude
                },
                success: (res) => {
                  this.setData({
                    createSign_isClicked: false
                  })
                  wx.hideLoading({})
                  if (res.statusCode == 200 && res.data.code == 200) {
                    let data = [
                      [String(res.data.data).slice(0, 2), String(res.data.data).slice(2, 4)]
                    ]
                    wx.navigateTo.call(this, {
                      url: '/pages/sign_create/index',
                      success: (res) => {
                        res.eventChannel.emit('data', data)
                        res.eventChannel.on("data", (res) => {
                          if (res.length != 0) {
                            sign_code = res[0]
                            create_time_out = res[1]
                            create_time_out_time = Date.now()
                          } else {
                            sign_code = []
                            create_time_out = null
                            create_time_out_time = null
                          }
                        })
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '服务器故障',
                      icon: "error"
                    })
                  }
                },
                fail: (res) => {
                  this.setData({
                    createSign_isClicked: false
                  })
                  wx.hideLoading({})
                  wx.showToast({
                    title: '服务器故障',
                    icon: "error"
                  })
                }
              })
            },
            fail: (res) => {
              console.log(res)
              //位置调用频繁,用历史坐标，
              // 这里判断一下是否存在历史坐标信息，不存提示重新获取坐标信息
              if (this.data.longitude && this.data.latitude) {
                // 这里说明是有历史坐标信息,直接带着历史坐标去请求
                wx.request.call(this, {
                  url: app.globalData.url + "/quicksign/create",
                  data: {
                    longitude: this.data.longitude,
                    latitude: this.data.latitude
                  },
                  success: (res) => {
                    this.setData({
                      createSign_isClicked: false
                    })
                    wx.hideLoading({})
                    if (res.statusCode == 200 && res.data.code == 200) {
                      let data = [
                        [String(res.data.data).slice(0, 2), String(res.data.data).slice(2, 4)]
                      ]
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
                  fail: (res) => {
                    this.setData({
                      createSign_isClicked: false
                    })
                    wx.hideLoading({})
                    wx.showToast({
                      title: '服务器故障',
                      icon: "error"
                    })
                  }
                })
              } else {
                // 没有历史历史信息,提示重新去获取
                this.setData({
                  createSign_isClicked: false
                })
                wx.hideLoading({})
                wx.showToast({
                  title: '获取定位失败',
                })
              }

            }
          })
        } else if (res === false) {
          // 曾拒绝过授权,弹出引导页面
          this.setData({
            createSign_isClicked: false
          })
          wx.hideLoading({})
        } else {
          // 从未授权过,弹出授权
          wx.getLocation.call(this, {
            isHighAccuracy: 'true',
            success: (res) => {
              // 用户同意授权了,开始请求
              this.data.longitude = res.longitude
              this.data.latitude = res.latitude
              wx.request.call(this, {
                url: app.globalData.url + "/quicksign/create",
                data: {
                  longitude: res.longitude,
                  latitude: res.latitude,
                },
                success: (res) => {
                  this.setData({
                    createSign_isClicked: false
                  })
                  wx.hideLoading({})
                  if (res.statusCode == 200 && res.data.code == 200) {
                    let data = [
                      [String(res.data.data).slice(0, 2), String(res.data.data).slice(2, 4)]
                    ]
                    wx.navigateTo.call(this, {
                      url: '/pages/sign_create/index',
                      success: (res) => {
                        res.eventChannel.emit('data', data)
                        res.eventChannel.on("data", (res) => {
                          if (res.length != 0) {
                            sign_code = res[0]
                            create_time_out = res[1]
                            create_time_out_time = Date.now()
                          } else {
                            sign_code = []
                            create_time_out = null
                            create_time_out_time = null
                          }
                        })
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '服务器故障',
                      icon: "error"
                    })
                  }
                },
                fail: (res) => {
                  this.setData({
                    createSign_isClicked: false
                  })
                  wx.hideLoading({})
                  wx.showToast({
                    title: '服务器故障',
                    icon: "error"
                  })
                }
              })
            },
            fail: (res) => {
              // 用户拒绝授权了
              this.setData({
                createSign_isClicked: false
              })
              wx.hideLoading({})
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
    } else {
      // 有历史创建
      wx.navigateTo.call(this, {
        url: '/pages/sign_create/index',
        success: (res) => {
          this.setData({
            createSign_isClicked: false
          })
          wx.hideLoading({})
          res.eventChannel.emit('data', [
            [sign_code[0], sign_code[1]], create_time_out - (Date.now() - create_time_out_time)
          ])
          res.eventChannel.on("data", (res) => {
            console.log(res)
            if (res.length != 0) {
              sign_code = res[0]
              create_time_out = res[1]
              create_time_out_time = Date.now()
            } else {
              sign_code = []
              create_time_out = null
              create_time_out_time = null
            }
          })
        }
      })


    }
  },
  navBack() {
    wx.navigateBack({
      delta: 0,
    })
  },

  onLoad: function (options) {},
})