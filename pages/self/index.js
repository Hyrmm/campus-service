// pages/self/index.js
var app = getApp()
const moudle = require("../../js/comment")
Page({

  data: {
    active: 3,
    hasUserInfo: app.globalData.userInfo.hasUserInfo,
    nickName: app.globalData.userInfo.nickName,
    avatarUrl: app.globalData.userInfo.avatarUrl
  },


  // 微信授权登录
  getUserProfile(e) {
    if (!this.data.hasUserInfo) {
      var self = this
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          console.log(res)
          this.setData({
            avatarUrl: res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName,
            hasUserInfo: true
          })
          //同步下全局数据
          app.globalData.userInfo.hasUserInfo = true
          app.globalData.userInfo.avatarUrl = res.userInfo.avatarUrl
          app.globalData.userInfo.nickName = res.userInfo.nickName
          //缓存下用户数据,方便反复弹框
          try {
            wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
            wx.setStorageSync('nickName', res.userInfo.nickName)
          } catch (e) {}
        }
      })
      console.log(app)
    }
  },
  // tabBar跳转
  tab_bar_change(event) {
    moudle.tabBar_change(event)
  },


  onLoad() {
    // 再同步数据 因为tabbar下,默认数据全部加载好，当在index页面更新的全局数据,本页面的数据绑定以初始化好不会变动，所以要在这进行下初始化
    if (!this.data.hasUserInfo) {
      console.log("重新同步全局数据")
      this.setData({
        hasUserInfo: app.globalData.userInfo.hasUserInfo,
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl
      })
    }
  },
  onShow() {
    // 同步数据,检测绑定状态,显示在tag上
    switch (app.globalData.userInfo.account_status) {
      case 1101:
        this.setData({
          bind_tag_type: "primary",
          bind_tag_content: "正在审核"
        })
        break;
      case 1102:
        this.setData({
          bind_tag_type: "success",
          bind_tag_content: "认证通过"
        })
        break;
      case 1103:
        this.setData({
          bind_tag_type: "danger",
          bind_tag_content: "账户封禁"
        })
        break;
      case 1104:
        this.setData({
          bind_tag_type: "warning",
          bind_tag_content: "审核被拒"
        })
        break;
      default:
        this.setData({
          bind_tag_type: "danger",
          bind_tag_content: "未认证"
        })
        break;
    }
  }
})