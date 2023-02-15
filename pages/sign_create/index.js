// pages/sign_create/index.js
const app = getApp()
Page({

  data: {
    is_sign_complete: false,
    sign_code: [],
    sign_data_teacher: [],
    sign_data_planner: [],
    animation_duration: "300s",
    time: 300000,
    sign_complete_isClicked: false
  },
  navBack() {
    wx.navigateBack({
      delta: 0,
    })
  },
  // 提前结束签到
  sign_complete(event) {
    this.setData({
      sign_complete_isClicked: true
    })
    if (event.currentTarget.dataset.type == 0) {
      // 老师
      wx.request.call(this, {
        url: app.globalData.url + "/quicksign/statistics/version/two",
        data: {
          signNum: this.data.sign_code[0] + this.data.sign_code[1]
        },
        success: (res) => {
          this.setData({
            sign_complete_isClicked: false
          })
          if (res.statusCode == 200) {
            if (res.data.code == 200) {
              this.setData({
                sign_data_teacher: res.data.data
              })
            } else if (res.data.code == 3401) {
              wx.showToast({
                title: '暂无统计信息',
                icon: "error"
              })
            } else {
              wx.showToast({
                title: '暂无数据',
                icon: "error"
              })
            }
            this.setData({
              is_sign_complete: true,
              sign_code: ["结", "束"],
              create_timeOut_time: this.data.create_timeOut_time - 300000
            })
          } else {
            wx.showToast({
              title: '网络异常',
              icon: "error"
            })
          }
        },
        fail: (res) => {
          this.setData({
            sign_complete_isClicked: false
          })
          wx.showToast({
            title: '网络异常',
            icon: "error"
          })
        }
      })
    } else {
      // 策划人
      wx.request.call(this, {
        url: app.globalData.url + "/quicksign/statistics/active",
        data: {
          signNum: this.data.sign_code[0] + this.data.sign_code[1]
        },
        success: (res) => {
          this.setData({
            sign_complete_isClicked: false
          })
          if (res.statusCode == 200) {
            if (res.data.code == 200) {
              this.setData({
                sign_data_planner: res.data.data
              })
            } else {
              wx.showToast({
                title: '暂无统计信息',
                icon: "error"
              })
            }
            this.setData({
              is_sign_complete: true,
              sign_code: ["结", "束"],
              create_timeOut_time: this.data.create_timeOut_time - 300000
            })
          } else {
            wx.showToast({
              title: '网络异常',
              icon: "error"
            })
          }
        },
        fail: (res) => {
          this.setData({
            sign_complete_isClicked: false
          })
          wx.showToast({
            title: '网络异常',
            icon: "error"
          })
        }
      })
    }



  },
  onLoad() {
    let eventChanner = this.getOpenerEventChannel()
    eventChanner.on('data', (data) => {
      if (data.length == 1) {
        // 新发起的签到
        this.data.create_timeOut_time = Date.now()
        setTimeout(() => {
          this.setData({
            is_sign_complete: true,
            sign_code: ["结", "束"]
          })
        }, 300000)
      } else {
        // 历史余留的签到
        wx.showModal({
          title: '温馨提示',
          content: '检测到你存在历史创建签到未结束,继续完成历史签到',
        })
        this.data.create_timeOut_time = (Date.now() - (300000 - data[1]))
        this.setData({
          animation_duration: String(data[1] / 1000) + "s",
          time: data[1]
        })
        setTimeout(() => {
          this.setData({
            is_sign_complete: true,
            sign_code: ["结", "束"]
          })
        }, data[1])
      }
      this.setData({
        sign_code: data[0]
      })

    })
  },
  onUnload() {
    let eventChanner = this.getOpenerEventChannel()
    let remain_time = 300000 - (Date.now() - this.data.create_timeOut_time)
    if (remain_time > 0) {
      // 记录剩余时间
      eventChanner.emit('data', [this.data.sign_code, remain_time])
    } else {
      eventChanner.emit('data', [])
    }
  }

})