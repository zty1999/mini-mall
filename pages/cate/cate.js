import { request } from "../../request/index.js";

Page({
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0,
  },
  // 接口的返回数据
  Cates: [],
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  获取本地存储中的数据
    const cates = wx.getStorageSync("cates");
    // 判断
    if (!cates || cates === undefined || cates === null) {
      // 不存在  发送请求获取数据
      this.getCates();
    } else if (Date.now() - cates.time > 1000 * 300) {
      //数据存储时间超过5分钟重新请求数据  1000毫秒单位表示1秒
      this.getCates();
    } else {
      //  不超过 可以使用旧的数据
      console.log(cates);
      this.Cates = cates.data;
      let leftMenuList = this.Cates.map((v) => v.cat_name);
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent,
      });
    }
  },

  //获取分类页面数据
  async getCates() {
    // 1 使用es7的async await来发送请求
    const res = await request({ url: "/categories" });
    this.Cates = res.data.message;
    // 把接口的数据存入到本地存储中  设置time（存储的时间）和data
    // wx.setStorageSync("cates", this.Cates);
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    // 左侧的大菜单数据
    let leftMenuList = this.Cates.map((v) => v.cat_name);
    // 右侧的子菜单数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent,
    });
    console.log(this.Cates);
    console.log(leftMenuList);
    console.log(rightContent);
  },

  // 左侧菜单的点击事件
  handleItemTap(e) {
    /* 
    1 获取被点击的标题身上的索引
    2 给data中的currentIndex赋值
    3 根据不同的索引来渲染右侧的商品内容
     */
    const index = e.currentTarget.dataset.index;
    console.log(e);

    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0,
    });
  },
   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad()
    wx.stopPullDownRefresh();
  },
});
