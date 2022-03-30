let t, a = require("../../js/comment.js");
Page({
    data: {
        goods_data: [ {
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
        } ],
        current_tab_index: 0
    },
    tabs_change: a.fangdou2(function(t) {
        this.data.current_tab_index = t.detail.index, 0 == Object.keys(this.data.goods_data[t.detail.index].data).length && a.get_secondHand_data.call(this, t.detail.index, "1");
    }, 800),
    onLoad: function(e) {
        t && this.setData({
            goods_data: t
        }), 0 == Object.keys(this.data.goods_data[0].data).length && a.get_secondHand_data.call(this, 0, "1");
    },
    navBack() {
        wx.navigateBack({
            delta: 0
        });
    },
    onReady: function() {
        let t = this;
        wx.createSelectorQuery().select("#nav").boundingClientRect().exec(function(a) {
            console.log(a[0].height), t.setData({
                tabs_offset_top: a[0].height
            });
        });
    },
    onReachBottom(t) {
        console.log(this.data.current_tab_index);
    },
    onUnload: function() {
        t = this.data.goods_data;
    },
    nav_post() {
        wx.navigateTo({
            url: "/pages/secondHandPost/index"
        });
    }
})