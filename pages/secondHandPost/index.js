// pages/secondHandPost/index.js
const FormData = require('../../js/formData')
Page({

  navBack() {
    wx.navigateBack({
      delta: 0,
    })
  },
  data: {
    fileList: [],
    input_foucs: false,
    input_display: false,
    input_value: "",
    input_bottom: 0,
    price_value: "0.00",
    goods_detail: {
      classify: {
        current_select_index: 0,
        list: ["全新", "几乎全新", "轻微使用痕迹", "明显使用痕迹"]
      },
      quality: {
        current_select_index: 0,
        list: ["全新", "几乎全新", "轻微使用痕迹", "明显使用痕迹"]
      },
      type: {
        current_select_index: 0,
        list: ["出售","收购"]
      }
    },

  },
  // 图片上传相关事件
  afterRead(event) {
    this.data.fileList.push({
      url: event.detail.file.url,
      message: '等待上床'
    })
    this.setData({
      fileList: this.data.fileList
    })
  },
  delete(event) {
    this.data.fileList.splice(event.detail.index, 1)
    this.setData({
      fileList: this.data.fileList
    })
    console.log(this.data.fileList)
  },

  // 隐藏input相关事件
  price_OnClick() {
    this.setData({
      input_display: true,
      input_foucs: true
    })
  },
  input_confirm(event) {
    this.setData({
      input_value: event.detail.value,
      price_value: event.detail.value
    })
  },
  input_getValue(event) {},
  input_getFoucs(event) {
    this.setData({
      input_bottom: event.detail.height
    })
  },
  input_lostFoucs(event) {
    this.setData({
      input_display: false,
      input_foucs: false
    })
  },
  boardheightchange(event) {
    this.setData({
      input_bottom: event.detail.height
    })
  },


  // tag点击切换相关
  tab_onclick(event) {
    console.log(event)
    switch (event.currentTarget.dataset.type) {
      case "classify":
        this.data.goods_detail.classify.current_select_index = event.currentTarget.dataset.index
        break
      case "quality":
        this.data.goods_detail.quality.current_select_index = event.currentTarget.dataset.index
        break
      case "type":
        this.data.goods_detail.type.current_select_index = event.currentTarget.dataset.index
        break
    }
    this.setData({
      goods_detail: this.data.goods_detail
    })
  },
  post_confirm() {
    let formData = new FormData()
    // 初始其他表单所需要的数据
    formData.append("title", "自用二手笔记本电脑，配置i9")
    formData.append("content", "自用二手笔记本电脑，配置i9+16g+3060ti，要的联系我.")
    formData.append("price", this.data.price_value)
    formData.append("goodsCondition", "3321")
    formData.append("goodsTag", this.data.goods_detail.quality.list[this.data.goods_detail.quality.current_select_index])
    formData.append("phone", "15357290525")
    formData.append("nickname", app.globalData.userInfo.nickName)
    formData.append("stdId", app.globalData.bind_userInfo.stdId)
    formData.append("avatar", app.globalData.userInfo.avatarUrl)
    formData.append("publishType", "3341")
    // 初始化图片数据
    for (var key in this.data.fileList) {
      formData.appendFile("files", this.data.fileList[key].url)
    }
    let data = formData.getData()
    wx.request({
      url: app.globalData.url + "/fleamarket/goods/publish?token=" + wx.getStorageSync('token'),
      method: "POST",
      data: data.buffer,
      header: {
        'content-type': data.contentType
      },
      success: (res) => {
        console.log(res)
      }
    })




  },
  onLoad: function (options) {
    // 获取tag
    wx.request({
      url: app.globalData.url + "/fleamarket/goods/tag",
      data: {
        token: wx.getStorageSync('token')
      },
      success(res) {
        console.log(res)
      }
    })
  },
})