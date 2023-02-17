// pages/bind/index.js
var app = getApp()
var college_major = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    college_popup_show: false,
    college_columns: [],
    stdId: "",
    stdName: "",
    phone: "",
    college: "未选择",
    major: "未选择",
    login_button: {
      loading: false,
      disabled: false
    },

  },
  login_button_click() {
    // 提交按钮禁用
    var self = this
    // 表单检测
    // 所有表达不得为空
    if (this.data.stdId != "" && this.data.stdName != "" && this.data.phone != "" && this.data.college != "未选择" && this.data.major != "未选择") {
      // 手机号位数校检(11位) 学号校检(20位) 姓名校检(5位)
      if (this.data.phone.length != 11) {
        this.setData({
          form_testing_show: true,
          form_testing_msg: "手机号位数异常,请检查后再试!"
        })
      } else if (this.data.stdName.length > 5) {
        this.setData({
          form_testing_show: true,
          form_testing_msg: "姓名长度过长,请修改!"
        })
      } else if (this.data.stdId.length >= 20) {
        this.setData({
          form_testing_show: true,
          form_testing_msg: "学号位数异常,请检查后再试!"
        })
      } else {
        // 禁用提交按钮,防止反复提交
        this.setData({
          login_button: {
            loading: true,
            disabled: true
          }
        })
        wx.request({
          url: app.globalData.url + '/registry/student?openIdToken=' + app.globalData.openId,
          method: "POST",
          data: {
            stdId: this.data.stdId,
            stdName: this.data.stdName,
            gender: this.data.gender,
            phone: this.data.phone,
            college: this.data.college,
            major: this.data.major,
            avatarUrl: this.data.avatarUrl,
            nickname: this.data.nickName
          },
          success(res) {
            console.log(res)
            self.setData({
              login_button: {
                loading: false,
                disabled: false
              }
            })
            switch (res.data.code) {
              case 3101:
                // 学号已经被注册
                self.setData({
                  form_testing_show: true,
                  form_testing_msg: "改学号已经被注册,请联系管理处理!"
                })
                break;
              case 3102:
                // 手机号被注册
                self.setData({
                  form_testing_show: true,
                  form_testing_msg: "改手机号已经被注册,请联系管理处理!"
                })
                break;
              default:
                // 正常提交
                // 弹窗2秒成功提示,2秒后跳转至主页
                wx.showToast({
                  title: '认证成功',
                  icon: 'success',
                  duration: 2000,
                  complete: function () {
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 0,
                      })
                    }, 2000)
                  }
                })

                // 同步全局数据,提交绑定成功后,账户默认状态为1101审核状态
                app.globalData.userInfo.account_status = 1101
                break;
            }




          }
        })
      }
    } else {
      this.setData({
        form_testing_show: true,
        form_testing_msg: "存在信息为空,请填写完整在提交!"
      })
    }
  },
  onChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    picker.setColumnValues(1, college_major[value[0]]);
  },
  college_popup_open() {
    this.setData({
      college_popup_show: true
    })
  },
  college_popup_close() {
    this.setData({
      college_popup_show: false
    })
  },
  college_confirm(event) {
    this.setData({
      college: event.detail.value[0],
      major: event.detail.value[1],
      college_popup_show: false
    })
    console.log(this.data)
  },
  // 获取输入框值,更新data中
  get_input_value(e) {
    switch (e.currentTarget.id) {
      case "stdName":
        this.setData({
          stdName: e.detail
        })
        break
      case "stdId":
        this.setData({
          stdId: e.detail
        })
        break;
      case "phone":
        this.setData({
          phone: e.detail
        })
        break;
    }
  },
  navBack() {
    wx.navigateBack({
      delta: 0,
    })
  },
  form_testing_confirm() {
    this.setData({
      form_testing_show: false
    })
  },


  onLoad(options) {
    var self = this
    // 同步全局数据
    this.setData({
      // 是否微信一键登录
      is_login: app.globalData.userInfo.hasUserInfo,
      // 在校绑定状态
      account_status: app.globalData.userInfo.account_status,
      // 微信用户基本信息
      avatarUrl: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName,
      gender: app.globalData.userInfo.gender,
    })

    // 初始化学院及专业数据（当前用户为未绑定时采取获取需要的专业以及学院）
    if (this.data.account_status == 1105) {
      wx.request({
        url: app.globalData.url + "/registry/college",
        success(res) {
          if (res.statusCode == 200) {
            var count = res.data.data.length
            for (var i = 0; i < res.data.data.length; i++) {
              // 注释原因:空的就不要加入setData了 会导致没有数据报错
              // college_major[res.data.data[i].collegeName] = []
              // 根据学院请求获取专业
              wx.request({
                url: app.globalData.url + "/registry/major",
                data: {
                  collegeName: res.data.data[i].collegeName
                },
                success(res) {
                  if (res.statusCode == 200) {
                    // 判断改学院是否有专业,没专业就不加入改学院
                    if (res.data.data.length > 0) {
                      console.log(res.data.data)
                      var current_college = res.data.data[0].collegeName
                      college_major[current_college] = []
                      for (var i = 0; i < res.data.data.length; i++) {
                        college_major[current_college].push(res.data.data[i].majorName)
                      }
                    }
                  }
                  // 计数,等待全部异步调用完成,说明数据整理完毕可以setData
                  count = count - 1
                  if (count == 0) {
                    console.log(college_major)
                    console.log(college_major[Object.keys(college_major)[0]][0])
                    self.setData({
                      college_columns: [{
                          values: Object.keys(college_major),
                          className: 'college',
                        },
                        {
                          className: 'major',
                          values: college_major['软件与通信学院'],
                          defaultIndex: 2,
                        },
                      ],
                    })
                  }
                }
              })
            }
          }
        },
      })
    }
    // 认证通过,获取个人认证信息并展示
    if (this.data.account_status == 1102) {
      self.setData({
        stdName: app.globalData.bind_userInfo["stdName"],
        stdId: app.globalData.bind_userInfo["stdId"],
        gender: app.globalData.bind_userInfo["gender"],
        phone: app.globalData.bind_userInfo["phone"],
        major: app.globalData.bind_userInfo["major"],
        college: app.globalData.bind_userInfo["college"],
        nickName: app.globalData.bind_userInfo["nickname"]
      })


    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})