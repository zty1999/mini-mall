import { request } from "../../request/index.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //页面信息对象
    goodsInfo: {},
    isCollect: false,
  },
  goods_id: 0,
  // 接口获取到的数据
  detailObj: {},
  // 加入购物车的商品对象
  good: {},

  onLoad: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const id = options.goods_id;
    console.log(options);
    console.log(id);
    this.goods_id = id;
    this.getDetail();
    
  },
  //获取详情页数据
  async getDetail() {
    const res = await request({
      url: "/goods/detail",
      data: { goods_id: this.goods_id },
    });
    console.log(res);
    this.detailObj = res.data.message;
     //  获取缓存中的商品收藏的数组
     let collect = wx.getStorageSync("collect") || [];
    //  判断当前商品是否被收藏
    let isCollect = collect.find(i => i.goods_id === this.detailObj.goods_id)
    this.setData({
      goodsInfo: {
        goods_id: this.detailObj.goods_id,
        goods_name: this.detailObj.goods_name,
        pics: this.detailObj.pics,
        goods_price: this.detailObj.goods_price,
        // iphone部分手机 不识别 webp图片格式
        // 最好找到后台 让他进行修改
        // 临时自己改 确保后台存在 1.webp => 1.jpg
        goods_introduce: this.detailObj.goods_introduce.replace(
          /\.webp/g,
          ".jpg"
        ),
      },
      isCollect
    });
    console.log(this.detailObj);
    console.log(this.data.goodsInfo);
  },
  //预览图片
  previewImage(e) {
    console.log(e);
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.detailObj.pics.map((i) => i.pics_mid), // 需要预览的图片http链接列表
    });
  },
  //点击收藏 取消 切换
  handleCollect() {
    let collect = wx.getStorageSync("collect") || [];
    let { isCollect, goodsInfo } = this.data;
    if (collect !== []) {
      let collected = collect.find((i) => i.goods_id === goodsInfo.goods_id);
      if (!collected) {
        isCollect = true;
        collect.push(goodsInfo);
      } else {
        collect.splice(
          collect.find((i) => i.goods_id === goodsInfo.goods_id),
          1
        );
        isCollect = false;
        wx.showToast({ title: "取消成功", icon: "success", mask: true });
      }
    } else {
      isCollect = true;
      collect.push(goodsInfo);
    }
    this.setData({ isCollect, goodsInfo });
    wx.setStorageSync("collect", collect);
    console.log(isCollect);
    console.log(collect);
  },
  //加入购物车
  handleAddCart() {
    this.good.good_name = this.detailObj.goods_name;
    this.good.good_id = this.detailObj.goods_id;
    this.good.good_price = this.detailObj.goods_price;
    this.good.count = 1;
    this.good.checked = true;
    this.good.image = this.detailObj.goods_small_logo;
    //  获取缓存中的购物车 数组
    let cart = wx.getStorageSync("cart") || [];

    //  判断 商品对象是否已经存在于购物车数组中
    const oldGood = cart.find((i) => i.good_id === this.good.good_id);
    if (oldGood) {
      //  已经存在购物车数据 数量加1
      oldGood.count += 1;
    } else {
      //  不存在 第一次添加
      this.good.count = 1;
      cart.push(this.good);
    }
    //  把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    //  弹窗提示
    wx.showToast({
      title: "加入成功",
      icon: "success",
      // true 防止用户 手抖 疯狂点击按钮
      mask: true,
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getDetail();
    wx.stopPullDownRefresh();
  },
});
