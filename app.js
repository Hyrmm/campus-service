// app.js
App({
  onLaunch(options) {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null
  },
  tab_bar_url_list:["./pages/index/index",]
  
})
