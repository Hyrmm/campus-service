// pages/loseGoodsDetails/index.js
const app = getApp()
const moudle = require("../../js/comment.js")
const FormData = require('../../js/formData')
Page({

  /**
   * 页面的初始数据
   */
  navBack() {
    wx.navigateBack({
      delta: 0,
    })
  },
  secondComments_tap(event) {
    this.data.input_which = 2
    this.data.secondComments_index = event.currentTarget.dataset.index
    this.setData({
      input_foucs: true,
      input_display: true
    })
  },
  comments_tap(event) {
    this.data.input_which = 1
    this.setData({
      input_foucs: true,
      input_display: true
    })
  },
  input_getFoucs(event) {
    this.setData({
      bottom: event.detail.height,
    })
  },
  input_lostFoucs() {
    this.setData({
      input_display: false,
      input_foucs: false
    })
  },
  input_getValue(event) {
    this.data.input_value = event.detail.value
    console.log(this.data.input_value)
  },
  boardheightchange(event) {
    this.setData({
      bottom: event.detail.height
    })
  },
  input_confirm(event) {
    let data = this.data.input_which == 1 ? {
      // 一级留言
      "mainId": this.lostFoundMain.id,
      "fromStdId": app.globalData.bind_userInfo.stdId,
      "fromNickname": wx.getStorageSync('nickName'),
      "fromAvatar": wx.getStorageSync('avatarUrl'),
      "content": this.data.input_value,
      "isLz": this.data.lostFoundMain.publisherStdId == app.globalData.bind_userInfo.stdId ? "1" : "0"
    } : {
      // 二级留言
      parentCommentId: this.data.comments.commentList[this.data.secondComments_index].oneComment.id,
      fromStdId: app.globalData.bind_userInfo.stdId,
      toStdId: this.data.comments.commentList[this.data.secondComments_index].oneComment.fromStdId,
      fromNickname: wx.getStorageSync('nickName'),
      toNickname: this.data.comments.commentList[this.data.secondComments_index].oneComment.fromNickname,
      fromAvatar: wx.getStorageSync('avatarUrl'),
      toAvatar: this.data.comments.commentList[this.data.secondComments_index].oneComment.fromAvatar,
      content: this.data.input_value,
      isLz: this.data.lostFoundMain.publisherStdId == app.globalData.bind_userInfo.stdId ? "1" : "0"
    }
    let url = this.data.input_which == 1 ? "/lost/found/comment/one/publish?token=" : "/lost/found/comment/two/publish?token="
    let self = this
    wx.request({
      url: app.globalData.url + url + wx.getStorageSync('token'),
      method: "POST",
      header: {
        "content-type": "application/json"
      },
      data: data,
      success(res) {
        moudle.get_comments_data(self, 1, self.data.lostFoundMain.id)
      }
    })
  },
  data: {
    movies: [],
    input_which: 1,
    input_foucs: false,
    input_display: false,
    input_value: "",
    bottom: 0
  },
  // 展开二级留言事件
  openSecondComment(event) {
    this.data.comments.commentList[event.currentTarget.dataset.index].oneComment.isOpenSecondComment = true
    this.setData({
      comments: this.data.comments
    })
    console.log(this.data.comments)
  },
  // 展开更多一级留言事件
  nextCommentPage: moudle.fangdou(function () {
    let self = this
    moudle.get_comments_data(self, this.data.comments.currentPage + 1, self.data.lostFoundMain.id)
  }, 200),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('data', function (data) {
      console.log(data)
      self.setData({
        address: data.lostFoundMain.address,
        create_time: data.create_time,
        goodsType: data.lostFoundMain.goodsType,
        goodsDetail: data.goodsDetail,
        status: data.status,
        lostFoundMain: data.lostFoundMain
      })
      for (let index in data.imgUrl) {
        self.data.movies.push({
          "url": data.imgUrl[index]
        })
      }
      self.setData({
        movies: self.data.movies
      })
      moudle.get_comments_data(self, 1, self.data.lostFoundMain.id)
    })

  },

})