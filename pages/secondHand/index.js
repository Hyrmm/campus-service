let t
let moudle = require("../../js/comment.js")
const app = getApp()
Page({
  data: {
    goods_data: [{
      goodsTag: "最新",
      data: {},
      left: [],
      right: []
    }, {
      goodsTag: "图书文具",
      data: {},
      left: [],
      right: []
    }, {
      goodsTag: "女饰鞋帽",
      data: {},
      left: [],
      right: []
    }, {
      goodsTag: "男饰鞋帽",
      data: {},
      left: [],
      right: []
    }, {
      goodsTag: "手机数码",
      data: {},
      left: [],
      right: []
    }, {
      goodsTag: "手办乐器",
      data: {},
      left: [],
      right: []
    }, {
      goodsTag: "日用百货",
      data: {},
      left: [],
      right: []
    }, {
      goodsTag: "美妆个护",
      data: {},
      left: [],
      right: []
    }, {
      goodsTag: "运动用品",
      data: {},
      left: [],
      right: []
    }, {
      goodsTag: "其他",
      data: {},
      left: [],
      right: []
    }],
    current_tab_index: 0
  },
  tabs_change: moudle.fangdou2(function (event) {
    this.data.current_tab_index = event.detail.index
    if (this.data.goods_data[this.data.current_tab_index].left.length == 0) {
      console.log(1)
      moudle.get_secondHand_data.call(this, this.data.current_tab_index, 1)
    }
  }, 500),
  onLoad: function (e) {
    t && this.setData({
      goods_data: t
    }), 0 == Object.keys(this.data.goods_data[0].data).length && moudle.get_secondHand_data.call(this, 0, "1");
  },
  navBack() {
    wx.navigateBack({
      delta: 0
    });
  },
  onReady: function () {
    // tab粘性高度计算
    wx.createSelectorQuery().select("#nav").boundingClientRect().exec((res) => {
      this.setData({
        tabs_offset_top: res[0].height
      });
    });
  },

  get_detail(event) {
    let data
    switch (event.currentTarget.dataset.type) {
      case "left":
        data = this.data.goods_data[this.data.current_tab_index].left[event.currentTarget.dataset.index]
        this.data.goods_data[this.data.current_tab_index].left[event.currentTarget.dataset.index].fleaMarketMain.viewNum += 1
        this.setData({
          ['goods_data[' + this.data.current_tab_index + '].left[' + event.currentTarget.dataset.index + '].fleaMarketMain.viewNum']: this.data.goods_data[this.data.current_tab_index].left[event.currentTarget.dataset.index].fleaMarketMain.viewNum
        })
        break
      case "right":
        data = this.data.goods_data[this.data.current_tab_index].right[event.currentTarget.dataset.index]
        this.data.goods_data[this.data.current_tab_index].right[event.currentTarget.dataset.index].fleaMarketMain.viewNum += 1
        this.setData({
          ['goods_data[' + this.data.current_tab_index + '].right[' + event.currentTarget.dataset.index + '].fleaMarketMain.viewNum']: this.data.goods_data[this.data.current_tab_index].right[event.currentTarget.dataset.index].fleaMarketMain.viewNum
        })
        break
    }

    // 访问量请求
    wx.request({
      url: app.globalData.url + "/fleamarket/goods/detail",
      data: {
        token: wx.getStorageSync('token'),
        id: data.fleaMarketMain.id,
        success: (res) => {

        }
      }
    })
    wx.navigateTo({
      url: '/pages/secondHandDetails/index',
      success: (res) => {
        res.eventChannel.emit("data", data)
      }
    })





  },

  onReachBottom: moudle.fangdou2(function (event) {
    let index = this.data.current_tab_index
    if (this.data.goods_data[index].data.hasNext) {
      moudle.get_secondHand_data.call(this, index, this.data.goods_data[index].data.currentPage + 1)

    } else {
      wx.showToast({
        title: '暂无数据',
        icon: "error"
      })
    }
  }, 500),

  onUnload: function () {
    t = this.data.goods_data;
  },
  nav_post() {
    wx.navigateTo({
      url: "/pages/secondHandPost/index"
    });
  }
})