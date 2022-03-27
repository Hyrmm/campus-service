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
          // 判断该项图片数据是否为空,为空给予默认高度100

          // 高度自动化
          if (current_type.temp_data_list[item].imgUrl.length != 0) {
            // 不为空
            let res = await get_img_originHeight(current_type.temp_data_list[item].imgUrl[0])
            current_type.temp_data_list[item].current_img_height = res
          } else {
            current_type.temp_data_list[item].current_img_height = 100
          }
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









module.exports = {
  getTime: getTime,
  fangdou: fangdou,
  getStatus: getStatus,
  get_loseOrFind_data: get_loseOrFind_data,
  get_comments_data: get_comments_data
}