// pages/loseGoods/index.js
var app = getApp()
const moudle = require("../../js/comment.js")
let db_data = {}
Page({
  data: {
    movies: app.globalData.movies,
    loseOrFind_data: {
      lose: {
        current_page: 1,
        hasNext: true,
        code: "3206",
        lostFoundMainImgList: [],
        render_data: {
          left: {
            total_height: 0,
            data: []

          },
          right: {
            total_height: 0,
            data: []
          }
        }
      },
      find: {
        current_page: 1,
        hasNext: true,
        code: "3207",
        lostFoundMainImgList: [],
        render_data: {
          left: {
            total_height: 0,
            data: []
          },
          right: {
            total_height: 0,
            data: []
          }
        }
      }
    },
    current_tabs_index: 0
  },
  navBack() {
    wx.navigateBack({
      delta: 0,
    })
  },
  // 
  get_details(event) {
    let data
    switch (event.currentTarget.dataset.type) {
      case "lose_left":
        data = this.data.loseOrFind_data.lose.render_data.left.data[event.currentTarget.dataset.index]
        break;
      case "lose_right":
        data = this.data.loseOrFind_data.lose.render_data.right.data[event.currentTarget.dataset.index]
        break
      case "find_left":
        data = this.data.loseOrFind_data.find.render_data.left.data[event.currentTarget.dataset.index]
        break;
      case "find_right":
        data = this.data.loseOrFind_data.find.render_data.right.data[event.currentTarget.dataset.index]
        break
    }
    wx.navigateTo({
      url: '/pages/loseGoodsDetails/index',
      success: (res) => {
        res.eventChannel.emit("data", data)
      }
    })
  },
  lose_goods_post(event) {
    if (app.globalData.userInfo.account_status && app.globalData.userInfo.account_status == 1102) {
      wx.navigateTo.call(this, {
        url: '/pages/loseGoodsPost/index',
        success: (res) => {
          res.eventChannel.emit('current_type_index', {
            index: event.currentTarget.id
          })
          res.eventChannel.on("data", (data) => {
            if (data == "3206") {
              this.setData({
                  ["loseOrFind_data.lose.render_data.left.data"]: [],
                  ["loseOrFind_data.lose.render_data.right.data"]: []
                }

              )
            } else {
              this.setData({
                ["loseOrFind_data.find.render_data.left.data"]: [],
                ["loseOrFind_data.find.render_data.right.data"]: []
              })
            }
            moudle.get_loseOrFind_data2.call(this, data, 1)
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '未完成认证或未通过认证，无法发布内容!',
        success(res) {

        }
      })
    }


  },
  tabs_change(event) {
    this.data.current_tabs_index = event.detail.index
    let loseOrFind_code = this.data.current_tabs_index == 0 ? "3206" : "3207"
    let loseOrFind_type_data = this.data.current_tabs_index == 0 ? this.data.loseOrFind_data.lose : this.data.loseOrFind_data.find
    if (loseOrFind_type_data.render_data.left.data.length == 0) {
      // 当前没有数据就去请求
      moudle.get_loseOrFind_data2.call(this, loseOrFind_code, 1)
    }





  },
  onLoad: function (options) {
    moudle.get_loseOrFind_data2.call(this, "3206", 1)
  },
  onReady: function () {
    // 获取nav高度,适配tabs offset_top
    let self = this
    wx.createSelectorQuery().select('#nav').boundingClientRect().exec(function (res) {
      self.setData({
        tabs_offset_top: res[0].height
      })
    })
  },
  onReachBottom: moudle.fangdou(function () {
    let loseOrFind_code = this.data.current_tabs_index == 0 ? "3206" : "3207"
    let current_type = this.data.current_tabs_index == 0 ? this.data.loseOrFind_data.lose : this.data.loseOrFind_data.find
    // 判断当前current_type的hasNext,从而觉得是否去请求，节流操作
    if (current_type.hasNext) {
      moudle.get_loseOrFind_data2.call(this, loseOrFind_code, current_type.current_page + 1)
    } else {
      wx.showToast({
        title: '暂无数据',
        icon: "error"
      })
    }
  }, 250),
  onUnload: function () {
    // 页面销毁前数据备份和数据初始化
    // 已渲染数据缓存,节流
    db_data = this.data
    db_loseOrFind_data = this.loseOrFind_data
    // 初始化tabs当前index和是否为第一次切换
    current_tabs_index = 0
    first_tab = true
  },
})