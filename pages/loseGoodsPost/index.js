// pages/loseGoodsPost/index.js
var app = getApp()
const FormData = require('../../js/formData')
const moudle = require("../../js/comment.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs1: true,
    tabs2: false,
    fileList: [],
    current_type_index: 0,
    switchActive: true,
    form_testing_show: false,
    form_testing_msg: "",
    post_detail: "",
    post_phone: "",
    post_title: "",
    detail_foucs: false
  },

  // 获取输入框值,更新data中
  get_input_value(e) {
    switch (e.currentTarget.id) {
      case "detail":
        this.setData({
          post_detail: e.detail
        })
        break
      case "phone":
        this.setData({
          post_phone: e.detail
        })
        break;
      case "address":
        this.setData({
          post_address: e.detail
        })
    }
  },
  navBack() {
    wx.navigateBack({
      delta: 0,
    })
  },
  tabs1_change(event) {
    this.setData({
      tabs1: true,
      tabs2: false
    })
  },
  tabs2_change(event) {
    this.setData({
      tabs1: false,
      tabs2: true
    })
  },
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
  type_tap(event) {
    let index = event.currentTarget.dataset.index
    this.setData({
      current_type_index: index,
      post_title: this.data.type_dict[index]["goodsType"]
    })

  },
  switchHandle() {
    if (this.data.switchActive) {
      this.setData({
        switchActive: false
      })
    } else {
      this.setData({
        switchActive: true
      })
    }
  },
  get_detail_foucs() {
    this.setData({
      detail_foucs: true
    })
  },
  // 表单提交
  post_confirm: moudle.fangdou(function () {
    let self = this
    // 表单校检
    this.setData({
      post_disabled: true,
      post_loading: true

    })
    if (this.data.post_title != "" && this.data.post_detail != "" && this.data.post_phone != "" && this.data.post_address != "") {
      // 手机号码校检
      if (this.data.post_phone.length == 11) {
        let formData = new FormData()
        // 初始其他表单所需要的数据
        formData.append("nickname", wx.getStorageSync('nickName'))
        formData.append("avatar", wx.getStorageSync('avatarUrl'))
        formData.append("publisherStdId", app.globalData.bind_userInfo.stdId)
        formData.append("goodsType", this.data.post_title)
        formData.append("goodsDetail", this.data.post_detail)
        formData.append("phone", this.data.post_phone)
        formData.append("address", this.data.post_address)
        formData.append("noticeType", (this.data.tabs1 === true) ? "3207" : "3206")
        // 初始化图片数据
        for (var key in this.data.fileList) {
          formData.appendFile("files", this.data.fileList[key].url)
        }
        let data = formData.getData()
        wx.request({
          url: app.globalData.url + "/lost/found/notice/publish?token=" + wx.getStorageSync('token'),
          method: "POST",
          header: {
            'content-type': data.contentType
          },
          data: data.buffer,
          success(res) {
            if (res.statusCode === 200) {
              wx.showToast({
                title: '发布成功',
                duration: 2000
              })
              setTimeout(function () {
                wx.navigateBack()
              }, 2000)
            } else {
              self.setData({
                post_loading: false,
                post_disabled: false
              })
              self.setData({
                form_testing_show: true,
                form_testing_msg: "提交失败,请检查网络后再试!",
              })
            }
          }
        })
      } else {
        this.setData({
          form_testing_show: true,
          form_testing_msg: "手机号位数异常,请检查后再试!"
        })
        this.setData({
          post_disabled: false,
          post_loading: false

        })
      }
    } else {
      this.setData({
        form_testing_show: true,
        form_testing_msg: "存在信息为空,请填写完整在提交!"
      })
      this.setData({
        post_disabled: false,
        post_loading: false

      })
    }
  }, 200),
  // 弹框通知确认
  form_testing_confirm() {
    this.setData({
      form_testing_show: false
    })
  },

  onLoad: function (options) {
    // 监听上一个页面传来的数据
    let self = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('current_type_index', function (data) {
      console.log(data)
      if (data.index == "find_post") {
        self.setData({
          current_type_index: 1,
          tabs1: true,
          tabs2: false
        })
      } else {
        self.setData({
          current_type_index: 0,
          tabs1: false,
          tabs2: true
        })
      }
    })

    // 获取物品type数据
    wx.request({
      url: app.globalData.url + "/lost/found/goodsType/list",
      data: {
        token: wx.getStorageSync("token")
      },
      success(res) {
        self.data.type_dict = res.data.data
        console.log(self.data.type_dict)
        self.setData({
          type_dict: self.data.type_dict
        })
      }
    })
    // 获取认证信息
    this.data.bind_userInfo = app.globalData.bind_userInfo
  },

})