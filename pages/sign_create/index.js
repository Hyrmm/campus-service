// pages/sign_create/index.js
Page({

  data: {
    sign_code: []
  },
  navBack() {
    wx.navigateBack({
      delta: 0,
    })
  },
  onLoad() {
    let eventChanner = this.getOpenerEventChannel()
    eventChanner.on('data', (data)=>{
      this.setData({
        sign_code:data
      })
    })
  }

})