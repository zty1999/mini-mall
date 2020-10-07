import { request } from "../../request/index.js";

// pages/goods_list/goods_list.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true,
      },
      {
        id: 1,
        value: "销量",
        isActive: false,
      },
      {
        id: 2,
        value: "价格",
        isActive: false,
      },
    ],
    goodsList: [],
  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 15,
  },
  // 总页数
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  //url中携带的参数在options中获取
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    console.log(options);
    this.getGoodsList();
  },
  
 // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    const data = res.data.message;
    // 获取 总条数
    const total = data.total;
    console.log(data.total);

    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    console.log(this.totalPages);
    // 拼接数组
    this.setData({
      goodsList: [...this.data.goodsList, ...data.goods],
    });
    console.log(data);
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错
    wx.stopPullDownRefresh();
  },

  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    console.log(e);
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组
    let { tabs } = this.data;
    console.log(this.data);

    // forEach方法遍历数组，数组中下标值等于被点击的下标值，样式变化
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    // 3 赋值到data中
    this.setData({
      tabs,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 1 重置数组
    this.setData({
      goodsList:[]
    })
    // 2 重置页码
    this.QueryParams.pagenum=1;
    // 3 发送请求
    this.getGoodsList();
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("reach bottom");

    //  1 判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      wx.showToast({ title: "没有下一页数据" });
    } else {
      // 还有下一页数据
      this.QueryParams.pagenum++;

      this.getGoodsList();
    }
  },


});
