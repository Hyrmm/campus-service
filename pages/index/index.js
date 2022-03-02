// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    //搜索框的值
    value:"",
    //tab-bar当前选中索引
    active:0

  },
  tab_bar_change(event){
    console.log(app.tab_bar_url_list[event.detail])
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo() {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //用户下拉刷新行为
  onPullDownRefresh(e){
    console.log(e)
  },
  //用户上拉触底行为
  onReachBottom(){
    console.log(1)
  },
  //用户滑动页面行为
  onPageScroll(event){
    console.log(event)
  }
})
