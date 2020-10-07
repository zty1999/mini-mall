// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    collectNums: 0
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userinfo=wx.getStorageSync("userinfo");
    const collectNums=wx.getStorageSync("collect").length || 0;
    console.log(userinfo,collectNums)
    this.setData({userinfo,collectNums});
  },

   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onShow();
    wx.stopPullDownRefresh();
  },

})