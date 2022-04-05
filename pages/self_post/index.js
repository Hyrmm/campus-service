// pages/self_post/index.js
Page({
  data: {
    currentMainTabsIndex:0,
    currentSecondTabsIndex:0,
  },
  onLoad: function (options) {

  },
  // 一级类目切换事件
  mainTabsChange(event){
    this.setData({
      currentMainTabsIndex:event.detail.index
    })
  },
  // 二级类目切换事件
  secondTabsChange(event){
    console.log(event)
    this.setData({
      currentSecondTabsIndex:event.currentTarget.dataset.index
    })
  },

  navBack(){
    wx.navigateBack({
      delta: 0,
    })
  }

})