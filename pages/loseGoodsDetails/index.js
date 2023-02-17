// pages/loseGoodsDetails/index.js
var app = getApp()
const moudle = require("../../js/comment.js")
const FormData = require('../../js/formData')
let e = null;
Page({

  /**
   * 页面的初始数据
   */
  bindscroll(a) {
    let n = this;
    null !== e && clearTimeout(e), e = setTimeout(function () {
      console.log(a.detail.scrollLeft), a.detail.scrollLeft < .7819565217391304 * app.globalData.systemInfo.screenWidth - 10 ? n.setData({
        scroll_index: 1
      }) : a.detail.scrollLeft <= .7819565217391304 * app.globalData.systemInfo.screenWidth * 2 - 10 ? n.setData({
        scroll_index: 2
      }) : n.setData({
        scroll_index: 3
      });
    }, 200);
  },
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
      "mainId": this.data.lostFoundMain.id,
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
    bottom: 0,
    msg_show: false,
    img_list: [],
    scroll_Maxheight: 0,
    scroll_index: 1
  },
  // 联系我
  contect_me() {
    this.setData({
      msg_show: true
    })
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

      function o(src) {
        return new Promise(e => {
          wx.getImageInfo({
            src: src,
            success: a => {
              console.log(a);
              let n = .7819565217391304 * app.globalData.systemInfo.screenWidth,
                o = a.width / n,
                s = a.height / o;
              e(s);
            }
          });
        });
      }
      self.setData({
        address: data.lostFoundMain.address,
        create_time: data.create_time,
        goodsType: data.lostFoundMain.goodsType,
        goodsDetail: data.goodsDetail,
        status: data.status,
        lostFoundMain: data.lostFoundMain,
      }) 
      !(async function () {
        let t = 0;
        for (let a in data.imgUrl) {
          let s = await o(data.imgUrl[a]);
          t = t >= s ? t : s, self.data.img_list.push({
            url: data.imgUrl[a],
            height: s
          });
        }
        self.setData({
          scroll_Maxheight: t,
          img_list: self.data.img_list
        });
      }())
      moudle.get_comments_data(self, 1, self.data.lostFoundMain.id)
    })

  },

})