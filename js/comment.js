let app = getApp()
// 失物照片发布时间的字符串化
function getTime(date) {
  //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
  var dateTimeStamp = Date.parse(date)
  var minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
  var hour = minute * 60;
  var day = hour * 24;
  var week = day * 7;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime(); //获取当前时间毫秒
  var diffValue = now - dateTimeStamp; //时间差
  if (diffValue < 0) {
    return "刚刚";
  }
  var minC = diffValue / minute;
  var hourC = diffValue / hour;
  var dayC = diffValue / day;
  var weekC = diffValue / week;
  var monthC = diffValue / month;
  if (monthC >= 1 && monthC < 4) {
    result = " " + parseInt(monthC) + "月前"
  } else if (weekC >= 1 && weekC < 4) {
    result = " " + parseInt(weekC) + "周前"
  } else if (dayC >= 1 && dayC < 7) {
    result = " " + parseInt(dayC) + "天前"
  } else if (hourC >= 1 && hourC < 24) {
    result = " " + parseInt(hourC) + "小时前"
  } else if (minC >= 1 && minC < 60) {
    result = " " + parseInt(minC) + "分钟前"
  } else if (diffValue >= 0 && diffValue <= minute) {
    result = "刚刚"
  } else {
    var datetime = new Date();
    datetime.setTime(dateTimeStamp);
    var Nyear = datetime.getFullYear();
    var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    result = Nyear + "-" + Nmonth + "-" + Ndate
  }

  return result;
}
// 防抖函数
function fangdou(fn, delay) {
  let timer = null
  return function () {
    let self = this
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      fn.apply(self)
    }, delay)
  }
}
// 失物招领的状态字符串化
function getStatus(status_num) {
  let status_str
  switch (status_num) {
    case 3201:
      status_str = "待寻回"
      break;
    case 3202:
      status_str = "已寻回"
      break;
    case 3203:
      status_str = "待认领"
      break;
    case 3204:
      status_str = "已认领"
      break;
    case 3205:
      status_str = "已失效"
      break;
    default:
      status_str = "default"
      break;
  }
  return status_str
}

function get_loseOrFind_data(self, loseOrFind_code, page) {
  // self:页面指针
  // loseOrFind_code:失物或寻物的查询码 3206=>丢了东西=>lose 3207=>捡到东西=>find
  // page:请求第几页数据

  //数据处理模块
  function handle_data(data, loseOrFind_code) {
    // data:待处理的数据
    // loseOrFind_code:失物或寻物的查询码 3206=>丢了东西=>lose 3207=>捡到东西=>find

    // 高度自动化单元
    function get_img_originHeight(imgUrl) {
      return new Promise(resolve => {
        wx.getImageInfo({
          src: imgUrl,
          success: (res) => {
            let origin_img_ratio = res.width / res.height
            resolve((app.globalData.systemInfo.windowWidth * 0.413) / origin_img_ratio)
          }
        })
      })
    }
    // 给当前current_type储存数据
    let current_type = loseOrFind_code == 3206 ? self.loseOrFind_data.lose : self.loseOrFind_data.find
    let current_renderType_left = loseOrFind_code == 3206 ? self.data.lose_left : self.data.find_left
    let current_renderType_right = loseOrFind_code == 3206 ? self.data.lose_right : self.data.find_right
    current_type.total_pages = data.pages
    current_type.total_items = data.total
    current_type.hasNext = data.hasNext
    current_type.current_page = data.currentPage
    current_type.temp_data_list = data.lostFoundMainImgList


      !(async function () {
        // 时间格式化，状态格式化，高度自动化
        for (let item in current_type.temp_data_list) {
          // 判断该项图片数据是否为空,添加默认图
          if (current_type.temp_data_list[item].imgUrl.length == 0) {
            current_type.temp_data_list[item].imgUrl.push("https://grab-1301500159.cos.ap-shanghai.myqcloud.com/miniPrograme/defult_img.jpg")
          }
          // 高度自动化
          let res = await get_img_originHeight(current_type.temp_data_list[item].imgUrl[0])
          current_type.temp_data_list[item].current_img_height = res

          // 时间格式化
          current_type.temp_data_list[item].create_time = getTime(current_type.temp_data_list[item].lostFoundMain.createTime)
          // 状态格式化
          current_type.temp_data_list[item].status = getStatus(current_type.temp_data_list[item].lostFoundMain.status)
        }
        // 时间格式化，状态格式化，高度自动化（结束）
        // 临时数据数据处理好后储存到storage_data_list
        current_type.storage_data_list = current_type.storage_data_list.concat(current_type.temp_data_list)
        // 通过高度累加做归属化处理(warterFall的left,right)
        // 通过遍历计算已经再页面渲染的列表的高度 current_renderType_left current_renderType_right
        let current_renderType_left_totalHeight = 0
        let current_renderType_right_totalHeight = 0
        for (let index1 in current_renderType_left) {
          current_renderType_left_totalHeight += current_renderType_left[index1].current_img_height
        }
        for (let index2 in current_renderType_right) {
          current_renderType_right_totalHeight += current_renderType_right[index2].current_img_height
        }
        // 再去遍历temp_data_list每条的高度,循环遍历累加到某一边高度,循环判断来处理当前元素的归属
        for (let index3 in current_type.temp_data_list) {
          if (current_renderType_left_totalHeight <= current_renderType_right_totalHeight) {
            // 归属left
            // 本次数据推入current_renderType_left，并且累计current_renderType_left_totalHeight
            current_renderType_left.push(current_type.temp_data_list[index3])
            current_renderType_left_totalHeight += current_type.temp_data_list[index3].current_img_height
          } else {
            // 归属right
            // 本次数据推入current_renderType_right，并且累计current_renderType_right_totalHeight
            current_renderType_right.push(current_type.temp_data_list[index3])
            current_renderType_right_totalHeight += current_type.temp_data_list[index3].current_img_height
          }
        }
        // 转到渲染模块
        render_data(current_renderType_left, current_renderType_right, loseOrFind_code)

      }())

  }



  // 数据渲染模块
  function render_data(current_renderType_left, current_renderType_right, loseOrFind_code) {
    // setData不支持内存指针,必须data数据字符名,继续拿loseOrFind_code做处理
    if (loseOrFind_code == 3206) {
      // lose数据渲染
      self.setData({
        lose_left: current_renderType_left,
        lose_right: current_renderType_right
      })
    } else {
      // find渲染
      self.setData({
        find_left: current_renderType_left,
        find_right: current_renderType_right
      })
    }
  }



  // 数据请求模块
  wx.request({
    url: app.globalData.url + "/lost/found/notice/list",
    data: {
      token: wx.getStorageSync('token'),
      noticeType: loseOrFind_code,
      page: page
    },
    success: (res) => {
      // 判端请求状态码
      if (res.statusCode === 200) {
        // 根据数据码判断是否查询到时候
        if (res.data.code === 200) {
          // 查询到了数据
          // 转到数据处理模块
          handle_data(res.data.data, loseOrFind_code)
        } else {
          // 没有查询到数据，弹窗
          wx.showToast({
            title: '暂无数据',
            icon: "error"
          })
          // 改变当前current_types的 hasNext状态
          switch (loseOrFind_code) {
            case "3206":
              self.loseOrFind_data.lose.hasNext = false
              break;
            case "3207":
              self.loseOrFind_data.find.hasNext = false
              break
          }
        }
      } else {
        // 网络出错
        wx.showToast({
          title: '服务器故障',
          icon: "error"
        })
      }
    }
  })

}

function get_loseOrFind_data2(loseOrFind_code, page) {
  // 数据绑定(lose,find)
  let current_data_type = loseOrFind_code == "3206" ? this.data.loseOrFind_data.lose : this.data.loseOrFind_data.find

  // 处理数据
  function data_handle(data) {
    function get_img_originHeight(imgUrl) {
      return new Promise(resolve => {
        wx.getImageInfo({
          src: imgUrl,
          success: (res) => {
            let origin_img_ratio = res.width / res.height
            resolve((app.globalData.systemInfo.windowWidth * 0.413) / origin_img_ratio)
          }
        })
      })
    }
    current_data_type.current_page = data.currentPage
    current_data_type.hasNext = data.hasNext;
    !(async function () {
      for (let index in data.lostFoundMainImgList) {
        // 没有图添加默认图
        if (data.lostFoundMainImgList[index].imgUrl.length == 0) {

          data.lostFoundMainImgList[index].imgUrl.push("https://grab-1301500159.cos.ap-shanghai.myqcloud.com/miniPrograme/defult_img.jpg")
        }
        // 高度
        let res = await get_img_originHeight(data.lostFoundMainImgList[index].imgUrl[0])
        data.lostFoundMainImgList[index].lostFoundMain.height = res
        // 时间
        data.lostFoundMainImgList[index].lostFoundMain.createTime = getTime(data.lostFoundMainImgList[index].lostFoundMain.createTime)
        // 状态
        data.lostFoundMainImgList[index].lostFoundMain.status = getStatus(data.lostFoundMainImgList[index].lostFoundMain.status)
        // 归属
        if (current_data_type.render_data.left.total_height <= current_data_type.render_data.right.total_height) {
          // 左push 累计高度
          current_data_type.render_data.left.data.push(data.lostFoundMainImgList[index])
          current_data_type.render_data.left.total_height += res
          // 左渲染
          data_render.call(this, 0)
        } else {
          // 右push 累计高度
          current_data_type.render_data.right.data.push(data.lostFoundMainImgList[index])
          current_data_type.render_data.right.total_height += res
          // 右渲染
          data_render.call(this, 1)

        }


      }
    }).call(this);



  }

  // 渲染数据
  function data_render(code) {
    switch (loseOrFind_code) {
      case "3206":
        switch (code) {
          case 0:
            this.setData({
              ["loseOrFind_data.lose.render_data.left.data"]: this.data.loseOrFind_data.lose.render_data.left.data
            })
            break
          case 1:
            this.setData({
              ["loseOrFind_data.lose.render_data.right.data"]: this.data.loseOrFind_data.lose.render_data.right.data
            })
            break
        }
        break
      case "3207":
        switch (code) {
          case 0:
            this.setData({
              ["loseOrFind_data.find.render_data.left.data"]: this.data.loseOrFind_data.find.render_data.left.data
            })
            break
          case 1:
            this.setData({
              ["loseOrFind_data.find.render_data.right.data"]: this.data.loseOrFind_data.find.render_data.right.data
            })
            break
        }
    }
  }
  // 请求数据
  wx.request({
    url: app.globalData.url + "/lost/found/notice/list",
    data: {
      token: wx.getStorageSync('token'),
      noticeType: loseOrFind_code,
      page: page
    },
    success: (res) => {
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          data_handle.call(this, res.data.data)
        } else {
          wx.showToast({
            title: '暂无数据',
            icon: "error"
          })
        }
      } else {
        wx.showToast({
          title: '服务器故障',
          icon: "error"
        })
      }
    }
  })

}


function get_comments_data(self, page, mainId) {
  // 数据处理模块
  function handle_data(data, isHasData, isFirstRequest) {
    // 时间格式化封装
    function time_format(commentList_data) {
      for (let index1 = 0; index1 < commentList_data.length; index1++) {
        // 一级格式化
        commentList_data[index1].oneComment.createTime = getTime(commentList_data[index1].oneComment.createTime)
        // 二级格式化
        for (let index2 = 0; index2 < commentList_data[index1].twoCommentList.length; index2++) {
          commentList_data[index1].twoCommentList[index2].createTime = getTime(commentList_data[index1].twoCommentList[index2].createTime)
        }
        // 记录数据，标记此条留言是否展开了二级评论
        commentList_data[index1].oneComment.isOpenSecondComment = false
      }
    }


    if (isHasData == false && isFirstRequest == true) {
      // 第一次请求没有数据(暂无评论,来抢沙发)
      self.data.comments = {
        firstHasData: false,
        hasNext: false
      }
    } else {
      if (isHasData) {
        // 有数据
        // 时间格式化
        time_format(data.commentList)
        if (isFirstRequest) {
          // 第一次请求(page=1)
          // 拷贝数据
          self.data.comments = data
          self.data.comments.firstHasData = true
        } else {
          // 非第一次请求(page>1)

          // 更新数据
          self.data.comments.currentPage = data.currentPage
          self.data.comments.hasNext = data.hasNext

          // 推入数据
          for (let index = 0; index < data.commentList.length; index++) {
            self.data.comments.commentList.push(data.commentList[index])
          }
        }
      } else {
        // 非第一请求且无数据
      }
    }
    render_data(data)
  }
  // 渲染模块
  function render_data() {
    self.setData({
      comments: self.data.comments
    })
  }
  // 请求模块
  wx.request({
    url: app.globalData.url + "/lost/found/comment/list",
    data: {
      id: mainId,
      size: 3,
      page: page,
      token: wx.getStorageSync('token')
    },
    success: (res) => {
      console.log(res)
      if (res.statusCode == 200) {
        let isHasData
        let isFirstRequest = page == 1 ? true : false
        if (res.data.code == 200) {
          isHasData = true
        } else {
          isHasData = false
        }
        // 交付数据处理模块
        handle_data(res.data.data, isHasData, isFirstRequest)
      } else {
        // 服务器故障
        wx.showToast({
          title: '服务器故障',
        })
      }
    }
  })
}

function fangdou2(fn, delay) {
  let timer = null;
  return function (event) {
    if (timer != null) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.call(this, event)

    }, delay)
  };
}

function get_secondHand_data(t, e) {
  // 数据处理
  function a(e) {
    function a(t) {
      return new Promise(resolve => {
        wx.getImageInfo({
          src: t,
          success: t => {
            let a = t.width / t.height;
            resolve(.46 * app.globalData.systemInfo.windowWidth / a);
          }
        });
      });
    }
    this.data.goods_data[t].data = e, async function () {
      let o = 0,
        i = 0;
      // 取得左右当前高度
      for (let index in this.data.goods_data[t].left) {
        o += this.data.goods_data[t].left[index].fleaMarketMain.height
      }
      for (let index in this.data.goods_data[t].right) {
        i += this.data.goods_data[t].right[index].fleaMarketMain.height

      }

      for (let s of e.fleaMarketMain) {
        if (0 != s.imageUrlList.length) {
          let t = await a(s.imageUrlList[0]);
          s.fleaMarketMain.height = t;
        } else s.fleaMarketMain.height = 0;
        switch (s.fleaMarketMain.goodsCondition) {
          case 3321:
            s.fleaMarketMain.goodsCondition = "全新";
            break;

          case 3322:
            s.fleaMarketMain.goodsCondition = "几乎全新";
            break;

          case 3323:
            s.fleaMarketMain.goodsCondition = "轻微使用痕迹";
            break;

          case 3324:
            s.fleaMarketMain.goodsCondition = "明显使用痕迹";
            break;

          default:
            s.fleaMarketMain.goodsCondition = "未知";
        }
        s.fleaMarketMain.createTime = getTime(s.fleaMarketMain.createTime)
        o <= i ? (this.data.goods_data[t].left.push(s), o += s.fleaMarketMain.height) : (this.data.goods_data[t].right.push(s),
          i += s.fleaMarketMain.height);
        this.setData({
          ["goods_data[" + t + "]"]: this.data.goods_data[t]
        }), console.log(this.data.goods_data[t]);
      }
      s.call(this);
    }.call(this);
  }
  // 数据渲染
  function s() {
    this.setData({
      ["goods_data[" + t + "]"]: this.data.goods_data[t]
    }), console.log(this.data.goods_data[t]);
  }
  // 索引为0,为最新,goodsTag为空
  let data
  if (t == 0) {
    data = {
      token: wx.getStorageSync("token"),
      size: "3",
      currentPage: e
    }
  } else {
    data = {
      goodsTag: this.data.goods_data[t].goodsTag,
      token: wx.getStorageSync("token"),
      size: "3",
      currentPage: e
    }
  }
  wx.request({
    url: app.globalData.url + "/fleamarket/goods/list",
    data: data,
    success: t => {
      200 == t.statusCode ? 3333 != t.data.code ? a.call(this, t.data.data) : wx.showToast({
        title: "暂无数据",
        icon: "error"
      }) : wx.showToast({
        title: "服务器故障",
        icon: "error"
      });
    }
  });
}

function secondHandPost_form_limit() {
  if (this.data.textarea_value == "" && this.data.price_value == 0) {
    return [false, "存在某些内容为空,请认真填写"]
  } else if (this.data.goods_detail.type.current_select_index == 0 && this.data.fileList.length == 0) {
    // 出售时图片不能为空
    return [false, "发布出售闲置,至少上传一张图片"]
  }
  return [true]
}

function getLocation() {
  return new Promise(resolve => {
    wx.getSetting.call(this, ({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] === true) {
          resolve(true)

        } else if (res.authSetting['scope.userLocation'] === false) {
          // 用户未授权位置信息 显示窗口去设置
          wx.showModal({
            title: '温馨提示',
            content: '检测当前未授权获取位置信息,是否前往授权页面',
            success(res) {
              if (res.confirm) {
                wx.openSetting({})
              } else {
                wx.navigateBack({
                  delta: 0,
                })
              }
            }
          })
          resolve(false)

        } else {
          resolve("undefined")
        }
      }
    }))
  })

}

// 底部tabBar切换
function tabBar_change(event) {
  switch (event.detail) {
    case 0:
      wx.switchTab({
        url: '/pages/inde2/index',
      })
      break;
    case 2:
      wx.switchTab({
        url: '/pages/msg/index',
      })
      break;
    case 3:
      wx.switchTab({
        url: '/pages/self/index',
      })
      break;
    default:
      break;
  }


}

// 获取服务时,查看当前账户的认证状态
function get_get_userBind_status() {
  switch (app.globalData.userInfo.account_status) {
    case 1105:
      wx.showModal({
        title: "通知",
        content: "检测到您未完成在校认证,请完成在校认证",
        success: function (res) {
          if (res.cancel == true) {
            // 用户点击了取消,重新开启定时轮询 每5分钟去询问是否去认证
          } else if (res.confirm == true) {
            wx.navigateTo({
              url: '/pages/bind/index',
            })
          }
        }
      })
      return false
    case 1101:
      // code:1101=》 审核状态
      wx.showModal({
        title: "通知",
        content: "您的在校认证正在处于审核状态,请耐心等待审核通过",
      })
      return false
    case 1103:
      // code:1103=》 被ban了
      wx.showModal({
        title: "通知",
        content: "你的账户已被封禁,暂停对你的服务",
      })
      return false
    case 1104:
      // code:1104=》 审核拒绝
      wx.showModal({
        title: "通知",
        content: "您的在校认证审核被拒绝,请尝试重新认证",
      })
      return false
    case 1102:
      return true
    case null:
      wx.showModal({
        title: "通知",
        content: "检测到您没有微信登录,请完成完成登录",
      })
      return false
  }
}

// 获取我的发布数据
function get_selfPost_data(type, page) {
  function format_condiction(conditction) {
    switch (conditction) {
      case 3321:
        return "全新";
      case 3322:
        return "几乎全新";
      case 3323:
        return "轻微使用痕迹";
      case 3324:
        return "明显使用痕迹";
      default:
        return "未知";
    }
  }

  function format_time(date) {
    let time = new Date(Date.parse(date))
    return (time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate())
  }

  function format_status(status, publishType) {
    switch (status) {
      case 3311:
        return ["审核中","#07c160"]
      case 3312:
        return ["已驳回","#ee0a24"]
      case 3313:
        if (publishType == 3341) return ["出售中","#ffd23c"]
        return ["收购中","#ffd23c"]
      case 3314:
        return ["已完成","#07c160"]
      case 3315:
        return ["已失效","#ff976a"]
    }


  }

  function render() {
    switch (type) {
      case 0:
        this.setData({
          second_hand_data: current_type
        })
        current_type = this.data.second_hand_data
        break
    }
  }


  // type:要查询的发布类型=>0:闲置 1:失物 2:墙
  // page:页数
  let current_type
  switch (type) {
    case 0:
      current_type = this.data.second_hand_data
      break
  }
  wx.request.call(this, { 
    url: app.globalData.url + "/fleamarket/goods/list",
    data: {
      token: wx.getStorageSync('token'),
      size: 6,
      currentPage: page,
      stdId: app.globalData.bind_userInfo.stdId
    },
    success: (res) => {
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          // 更新数据
          current_type.hasNext = res.data.data.hasNext
          current_type.currentPage = res.data.data.currentPage
          // 渲染
          for (let index in res.data.data.fleaMarketMain) {
            // 格式化日期和状态
            let current_data = res.data.data.fleaMarketMain[index]
            current_data.fleaMarketMain.createTime = format_time(current_data.fleaMarketMain.createTime)
            // 品质格式化
            current_data.fleaMarketMain.goodsCondition = format_condiction(current_data.fleaMarketMain.goodsCondition)
            // 状态格式化
            let format_data=format_status(current_data.fleaMarketMain.status, current_data.fleaMarketMain.publishType)
            current_data.fleaMarketMain.status = format_data[0]
            current_data.fleaMarketMain.status_color =format_data[1]
            current_type.fleaMarketMain.push(current_data)
          }
          render.call(this)
        } else {
          wx.showToast({
            title: '暂无数据',
            icon: "error"
          })
        }
      } else {
        wx.showToast({
          title: '服务器故障',
          icon: "error"
        })
      }
    },
    fail: () => {
      wx.showToast({
        title: '服务器故障',
        icon: "error"
      })
    }
  })



}




module.exports = {
  getTime: getTime,
  fangdou: fangdou,
  getStatus: getStatus,
  get_loseOrFind_data: get_loseOrFind_data,
  get_comments_data: get_comments_data,
  fangdou2: fangdou2,
  get_secondHand_data: get_secondHand_data,
  secondHandPost_form_limit: secondHandPost_form_limit,
  get_loseOrFind_data2: get_loseOrFind_data2,
  get_location: getLocation,
  tabBar_change: tabBar_change,
  get_get_userBind_status: get_get_userBind_status,
  get_selfPost_data: get_selfPost_data
}