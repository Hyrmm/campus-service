// pages/secondHand/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  // 导航返回事件
  navBack(){
    wx.navigateBack({
      delta: 0,
    })
  },
  // tab切换事件
  tab_bar_change(event) {
    switch (event.detail) {
      case 0:
        wx.switchTab({
          url: '/pages/index/index',
        })
        break;
      case 3:
        wx.switchTab({
          url: '/pages/msg/index',
        })
        break;
      case 4:
        wx.switchTab({
          url: '/pages/self/index',
        })
        break;
      default:
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})