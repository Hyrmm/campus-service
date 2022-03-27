// 获取应用实例
const app = getApp()
var temp_local_scool_value
Page({
  data: {
    tab_bar_index: 0,
    local_change_show: false,
    movies: app.globalData.movies,
    local_school: app.globalData.local_school,
    local_default: app.globalData.local_school[0],
    getUserProfile_dialog_show: false
  },
  // 定位切换,弹出切换窗口
  local_change() {
    this.setData({
      local_change_show: true
    })
    // 防止不调用local_school_onChange事件,初始化temp_local_scool_value的值
    temp_local_scool_value = app.globalData.local_school[0]
  },
  // 定位切换监听
  local_school_onChange(event) {
    temp_local_scool_value = event.detail.value
    temp_local_scool_index = event.detail.index
  },
  // 定位切换确认
  local_school_confirm() {
    if (temp_local_scool_value) {
      this.setData({
        local_default: temp_local_scool_value
      })
    }
    try {
      wx.setStorageSync('local_school', this.data.local_default)
    } catch (e) {}
    // 初始化微信登录
    if (!app.globalData.userInfo.hasUserInfo) {
      // 没有缓存登录,弹框提示登录
      this.setData({
        getUserProfile_dialog_show: true
      })
    }

  },
  // tabBar切换
  tab_bar_change(event) {
    switch (event.detail) {
      case 0:
        wx.switchTab({
          url: '/pages/index/index',
        })
        break;
      case 2:
        wx.switchTab({
          url: '/pages/msg/index',
        })
        break;
      case 3:
        wx.switchTab({
          url: '/pages/self/index',
        })
        break;
      default:
        break;
    }
  },
  // 微信授权登录
  getUserProfile(e) {
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
  onLoad() {
    // 初始化定位学校
    try {
      var local_school = wx.getStorageSync('local_school')
      if (!local_school) {
        // 缓存里没有定位数据,弹出定位选择
        this.setData({
          local_change_show: true
        })
      } else {
        // 缓存里有历史定位数据,直接拿缓存默认数据
        this.setData({
          local_default: local_school
        })
        // 初始化微信登录
        if (!app.globalData.userInfo.hasUserInfo) {
          // 没有缓存登录,弹框提示登录
          this.setData({
            getUserProfile_dialog_show: true
          })
        }
      }
    } catch (e) {}


  },
  onReady() {

  },








  //用户下拉刷新行为
  onPullDownRefresh(e) {
    console.log(e)
  },
  //用户上拉触底行为
  onReachBottom() {
    console.log(1)
  },
  //用户滑动页面行为
  onPageScroll(event) {
    console.log(event)
  }
})