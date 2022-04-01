// pages/secondHandPost/index.js
const FormData = require('../../js/formData')
const moudle = require("../../js/comment")
var app = getApp()
Page({

  navBack() {
    wx.navigateBack({
      delta: 0,
    })
  },
  data: {
    fileList: [],
    textarea_value: "",
    input_foucs: false,
    input_display: false,
    input_value: "",
    input_bottom: 0,
    price_value: "0.00",
    goods_detail: {
      classify: {
        current_select_index: 0,
        list: ["图书文具", "女饰鞋帽", "手办乐器", "手机数码", "日用百货", "男饰鞋帽", "美妆个护", "运动用品", "其他"],
        value: ["图书文具", "女饰鞋帽", "手办乐器", "手机数码", "日用百货", "男饰鞋帽", "美妆个护", "运动用品", "其他"]
      },
      quality: {
        current_select_index: 0,
        list: ["全新", "几乎全新", "轻微使用痕迹", "明显使用痕迹"],
        value: ["3321", "3322", "3323", "3324"]
      },
      type: {
        current_select_index: 0,
        list: ["出售", "收购"],
        value: ["3341", "3342"]
      }
    },
    form_testing_show: false,
    form_testing_msg: "",
    is_post_cilcked: true

  },


  form_testing_confirm() {
    this.setData({
      form_testing_show: false
    })
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
  // textarea相关事件
  textarea_blur(event) {
    this.data.textarea_value = event.detail.value
  },
  // 隐藏input相关事件
  price_OnClick() {
    this.data.input_which = 1
    this.setData({
      input_display: true,
      input_foucs: true
    })
  },
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
    this.setData({
      price_value: event.detail.value
    })
  },
  boardheightchange(event) {
    this.setData({
      input_bottom: event.detail.height
    })
  },
  // tag点击切换相关
  tab_onclick(event) {
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
  post_confirm: moudle.fangdou2.call(this, function () {
    this.setData({
      is_post_cilcked: false
    })
    wx.showLoading({
      title: '发布中',
    })
    // 表单校检
    let res = moudle.secondHandPost_form_limit.call(this)
    if (res[0]) {
      let formData = new FormData()
      // 初始其他表单所需要的数据
      formData.append("title", this.data.textarea_value.length >= 10 ? this.data.textarea_value.slice(0, 10) : this.data.textarea_value)
      formData.append("content", this.data.textarea_value)
      formData.append("price", this.data.price_value)
      formData.append("nickname", app.globalData.userInfo.nickName)
      formData.append("phone", app.globalData.bind_userInfo.phone)
      formData.append("stdId", app.globalData.bind_userInfo.stdId)
      formData.append("avatar", app.globalData.userInfo.avatarUrl)
      formData.append("goodsCondition", this.data.goods_detail.quality.value[this.data.goods_detail.quality.current_select_index])
      formData.append("goodsTag", this.data.goods_detail.classify.value[this.data.goods_detail.classify.current_select_index])
      formData.append("publishType", this.data.goods_detail.type.value[this.data.goods_detail.type.current_select_index])

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
          wx.hideLoading()
          if (res.statusCode == 200) {
            wx.showToast({
              title: '发布成功',
            })
          } else {
            wx.showToast({
              title: '发布失败',
              icon: "error"
            })
          }
          setTimeout(function () {
            wx.navigateBack({
              delta: 0,
            })
          }, 1500)
        }
      })
    } else {
      wx.hideLoading()
      this.setData({
        form_testing_show: true,
        form_testing_msg: res[1]
      })
    }




  }, 800),

  onLoad: function (options) {},
})