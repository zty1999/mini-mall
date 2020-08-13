//index.js
//获取应用实例
const app = getApp();
import { request } from "../../request/index.js";
Page({
  data: {
    //轮播图
    swiperList: [],
    //导航
    cateList: [],
    //楼层
    floorList: [],




    motto: "Hello World",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
  },
  // 获取轮播图数据
  getSwiperList() {
    request({ url: "/home/swiperdata" }).then((result) => {
      this.setData({
        swiperList: result.data.message,
      });
    });
  },
  // 获取 分类导航数据
  getCateList() {
    request({ url: "/home/catitems" }).then((result) => {
      this.setData({
        cateList: result.data.message,
      });
    });
  },
  // 获取 楼层数据
  getFloorList() {
    request({ url: "/home/floordata" }).then((result) => {
      this.setData({
        floorList: result.data.message,
      });
    });
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: "../logs/logs",
    });
  },
  //页面开始加载触发
  onLoad: function () {
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();




    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: (res) => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });
        },
      });
    }
  },
  getUserInfo: function (e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
  },
});
