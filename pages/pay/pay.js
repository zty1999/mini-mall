import { request } from "../../request/index.js";

// pages/pay/pay.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: {},
    totalPrice: 0,
    totalNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");

    //  获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart");
    cart = cart.filter((v) => v.checked);
    this.setData({ address, cart });
    //总价格 总数量  数组
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((i) => {
      totalPrice += i.good_price * i.count;
      totalNum += i.count;
    });
    this.setData({ totalPrice, totalNum });
  },
  async handleGetUserInfo(e) {
    //缓存中获取token
    let token = wx.getStorageSync("token");
    // 如果没有token  获取
    if (!token) {
      // 微信授权
      wx.getSetting();
      // console.log(e);
      // const { encryptedData, rawData, iv, signature } = e.detail;
      // const { code }= await wx.login();
      // console.log(code)
      //  //发起网络请求
      //  const token = await request({
      //   url: '/users/wxlogin',
      //   data: {
      //     code,
      //     encryptedData,
      //     rawData,
      //     iv,
      //     signature
      //   },
      //   method:"post",
      // })
      //
      // console.log(token)
      //不是企业号所以获取不到token 先随便设一个
      token = "jdpgpjg[re[ig[erigyythbvdh";
      wx.setStorageSync("token", token);
    }

    // 创建订单/my/orders/create
  },
});
