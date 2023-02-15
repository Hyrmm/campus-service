App({
  // 全局数据
  globalData: {
    userInfo: {
      hasUserInfo: false,
      nickName: "登录/注册",
      gender: "0",
      avatarUrl: "https://grab-1301500159.cos.ap-shanghai.myqcloud.com/miniPrograme/selfAvatar.png",
      account_status: null
    },
    bind_userInfo: {},
    movies: [{
        url: 'https://grab-1301500159.cos.ap-shanghai.myqcloud.com/miniPrograme/1.png'
      },
      {
        url: 'https://grab-1301500159.cos.ap-shanghai.myqcloud.com/miniPrograme/2.png'
      },
      {
        url: 'https://grab-1301500159.cos.ap-shanghai.myqcloud.com/miniPrograme/3.png'
      },
    ],
    url: "http://hyrm.club:8001",

  },
  onLaunch() {
    var self = this
    // 检测微信登录缓存
    try {
      var gender = wx.getStorageSync('gender')
      var avatarUrl = wx.getStorageSync('avatarUrl')
      var nickName = wx.getStorageSync('nickName')
      if (nickName) {
        // 同步全局数据
        this.globalData.userInfo.hasUserInfo = true
        this.globalData.userInfo.avatarUrl = avatarUrl
        this.globalData.userInfo.nickName = nickName
        this.globalData.userInfo.gender = gender
      }
    } catch (e) {}

    // 轮询是否登录, 再去调用是否绑定
    var interval = function () {

      if (self.globalData.userInfo.hasUserInfo) {
        wx.login({
          success(res) {
            wx.request({
              url: self.globalData.url + '/login/student/by/wechat',
              data: {
                code: res.code
              },
              success(res) {
                // 储存当前用户账户状态
                self.globalData.userInfo.account_status = res.data.code
                try {
                  wx.setStorageSync("token", res.data.data)
                } catch (error) {}
                switch (res.data.code) {
                  case 1101:
                    // code:1101=》 审核状态
                    wx.showModal({
                      title: "通知",
                      content: "你的在校认证正在处于审核状态",
                    })
                    break
                  case 1102:
                    // code:1102=》 认证通过
                    // 绑定下认证信息,保存至全局数据
                    wx.request({
                      url: self.globalData.url + "/login/student/info/get",
                      data: {
                        token: wx.getStorageSync("token")
                      },
                      success(res) {
                        res.data.data.gender = (res.data.data.gender == 0) ? "男" : "女"
                        self.globalData.bind_userInfo = {
                          stdName: res.data.data.stdName,
                          stdId: res.data.data.stdId,
                          gender: res.data.data.gender,
                          phone: res.data.data.phone,
                          major: res.data.data.major,
                          college: res.data.data.college,
                          nickName: res.data.data.nickname
                        }
                      }
                    })
                    break
                  case 1103:
                    // code:1103=》 被ban了
                    wx.showModal({
                      title: "通知",
                      content: "你的在校认证正在处于封禁状态",
                    })
                    break
                  case 1104:
                    // code:1104=》 审核拒绝
                    wx.showModal({
                      title: "通知",
                      content: "你的在校认证审核被拒绝",
                    })
                    break
                  case 1105:
                    // code:1105=》 没绑定
                    // 弹窗,没绑定,通知去绑定
                    self.globalData.openId = res.data.data
                    wx.showModal({
                      title: "通知",
                      content: "当前检测到未完成“学生在校认证”,是否前往在校认证?",
                      success: function (res) {
                        if (res.cancel == true) {
                          // 用户点击了取消,重新开启定时轮询 每5分钟去询问是否去认证
                          intervalId = setInterval(interval, 300000)
                        } else if (res.confirm == true) {
                          wx.navigateTo({
                            url: '/pages/bind/index',
                          })
                        }
                      }
                    })
                    break;
                }
              }
            })
          }
        })
        clearInterval(intervalId)
      } else {}
    }
    // 第一次250毫秒轮询检测是否微信登录,在去请求当前账户认证状态
    var intervalId = setInterval(interval, 250)
    // 获取设备数据
    this.globalData.systemInfo = wx.getSystemInfoSync()
  },
  watch: function (key, method) {
    var obj = this.globalData;
    //加个前缀生成隐藏变量，防止死循环发生
    let ori = obj[key]; //obj[key]这个不能放在Object.defineProperty里
    if (ori) { //处理已经声明的变量，绑定处理
      method(ori);
    }
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this['_' + key] = value;
        method(value);
      },
      get: function () {
        // 在其他界面调用key值的时候，这里就会执行。
        if (typeof this['_' + key] == 'undefined') {
          if (ori) {
            //这里读取数据的时候隐藏变量和 globalData设置不一样，所以要做同步处理
            this['_' + key] = ori;
            return ori;
          } else {
            return undefined;
          }
        } else {
          return this['_' + key];
        }
      }
    })
  },
})