// pages/loseGoods/index.js
const moudle = require("../../js/comment.js")
let current_tabs_index = 0
let first_tab = true
let db_loseOrFind_data = {
  lose: {
    temp_data_list: [],
    storage_data_list: [],
    total_pages: null,
    total_items: null,
    hasNext: null,
    current_page: 1
  },
  find: {
    temp_data_list: [],
    storage_data_list: [],
    total_pages: null,
    total_items: null,
    hasNext: null,
    current_page: 1
  }
}
let db_data = {
  lose_left: [],
  lose_right: [],
  find_left: [],
  find_right: []
}
Page({
  loseOrFind_data: {
    lose: {
      temp_data_list: [],
      storage_data_list: [],
      total_pages: null,
      total_items: null,
      hasNext: null,
      current_page: 1
    },
    find: {
      temp_data_list: [],
      storage_data_list: [],
      total_pages: null,
      total_items: null,
      hasNext: null,
      current_page: 1
    }
  },
  data: {
    movies: app.globalData.movies,
    lose_left: [],
    lose_right: [],
    find_left: [],
    find_right: []
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
        data = this.data.lose_left[event.currentTarget.dataset.index]
        break;
      case "lose_right":
        data = this.data.lose_right[event.currentTarget.dataset.index]
        break
      case "find_left":
        data = this.data.find_left[event.currentTarget.dataset.index]
        break;
      case "find_right":
        data = this.data.find_right[event.currentTarget.dataset.index]
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
    wx.navigateTo({
      url: '/pages/loseGoodsPost/index',
      success: function (res) {
        res.eventChannel.emit('current_type_index', {
          index: event.currentTarget.id
        })
      }
    })
  },
  tabs_change(event) {
    let self = this
    current_tabs_index = event.detail.index
    // 从进入页面第一次切换tabs，加载find数据
    if (current_tabs_index == 1 && first_tab) {
      first_tab = false
      if (db_data.find_left.length == 0 && db_data.find_right.length == 0) {
        // 无历史缓存
        moudle.get_loseOrFind_data(self, "3207", 1)
      } else {
        this.setData({
          find_left: db_data.find_left,
          find_right: db_data.find_right
        })
      }
    }


  },
  onLoad: function (options) {
    var self = this
    // 读取备份数据db_loseOrFind_data
    this.loseOrFind_data = db_loseOrFind_data
    // 初加载lose渲染数据,根据缓存去加载
    if (db_data.lose_left.length == 0 && db_data.lose_right.length == 0) {
      // 无历史缓存
      moudle.get_loseOrFind_data(self, "3206", this.loseOrFind_data.lose.current_page)
    } else {
      // 有历史缓存 性能考虑只渲染当前tabs内容（lose）
      this.setData({
        lose_left: db_data.lose_left,
        lose_right: db_data.lose_right
      })
    }

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
    var self = this
    // 根据当前current_tabs_index 去得到当前current_type的loseOrFind_code，current_page
    let loseOrFind_code = current_tabs_index == 0 ? "3206" : "3207"
    let current_type = current_tabs_index == 0 ? this.loseOrFind_data.lose : this.loseOrFind_data.find
    // 判断当前current_type的hasNext,从而觉得是否去请求，节流操作
    if (current_type.hasNext) {
      moudle.get_loseOrFind_data(self, loseOrFind_code, current_type.current_page + 1)
    } else {
      wx.showToast({
        title: '暂无数据',
        icon: "error"
      })
    }

  }, 1200),
  onUnload: function () {
    // 页面销毁前数据备份和数据初始化
    // 已渲染数据缓存,节流
    db_data = this.data
    db_loseOrFind_data = this.loseOrFind_data
    // 初始化tabs当前index和是否为第一次切换
    current_tabs_index = 0
    first_tab = true
  }
})