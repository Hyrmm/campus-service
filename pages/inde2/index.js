const app = getApp()
const moudle = require("../../js/comment")
Page({

  data: {
    getUserProfile_dialog_show: false,
    bind_userInfo: "未认证",
    tab_bar_index: 0
  },
  // 微信授权登录
  getUserProfile(e) {
    console.log("33333")
    this.setData({
      getUserProfile_dialog_show: false
    })
    console.log(this.data.hasUserInfo)
    if (!this.data.hasUserInfo) {
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          //同步下全局数据
          app.globalData.userInfo.hasUserInfo = true
          app.globalData.userInfo.gender = String(res.userInfo.gender)
          app.globalData.userInfo.avatarUrl = res.userInfo.avatarUrl
          app.globalData.userInfo.nickName = res.userInfo.nickName
          //缓存下用户数据,方便反复弹框
          try {
            wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
            wx.setStorageSync('nickName', res.userInfo.nickName)
            wx.setStorageSync('gender', String(res.userInfo.gender))
          } catch (e) {}

        }
      })
    }
  },
  // tab切换
  tab_bar_change(event) {
    moudle.tabBar_change(event)
  },
  onLoad: function (options) {

    let self = this

    app.watch('bind_userInfo', (v) => {
      console.log(v)
      self.setData({
        bind_userInfo: v.stdName
      })
    })
    // 检测是否微信登陆
    let interval_id = setInterval(() => {
      if (!app.globalData.userInfo.hasUserInfo) {
        if (!this.data.getUserProfile_dialog_show) {
          this.setData({
            getUserProfile_dialog_show: true
          })
        }
      } else {
        clearInterval(interval_id)
      }
    }, 5000)

  },
  nav_to(event) {
    if (event.currentTarget.dataset.type == "sign") {
      wx.navigateTo({
        url: '/pages/self_sign/index',
      })
    } else if (moudle.get_get_userBind_status()) {
      switch (event.currentTarget.dataset.type) {
        case "course":
          break
        case "secondHand":
          wx.navigateTo({
            url: '/pages/secondHand/index',
          })
          break
        case "loseFind":
          wx.navigateTo({
            url: '/pages/loseGoods/index',
          })
          break
      }
    }
  }
})