Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
    cartEdit: false,
  },
  onLoad() {},
  onShow: function () {
    //  获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    //  获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    this.setData({ address, cart });
    this.total();
  },
  //获取收货地址
  async handlechooseAddress() {
    try {
      //  获取 权限状态
      const stated = await wx.getSetting();
      console.log(stated);
      const scopeAdress = stated.authSetting["scope.address"];
      console.log(scopeAdress);
      //  判断 权限状态
      if (scopeAdress === false) {
        await openSetting();
      }
      //  调用获取收货地址的 api
      wx.chooseAddress({
        success: (result) => {
          console.log(result);
          let address = result;
          address.all =
            address.provinceName +
            address.cityName +
            address.countyName +
            address.detailInfo;
          this.setData({ address });
          //  存入到缓存中
          wx.setStorageSync("address", address);
        },
        fail: () => {},
        complete: () => {},
      });
    } catch (error) {
      console.log(error);
    }
  },
  //数据修改后 联动修改页面
  setCart(cart) {
    this.total();
    wx.setStorageSync("cart", cart);
  },
  // 修改购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  total() {
    //结算
    let totalPrice = 0;
    let totalNum = 0;
    let { cart, allChecked } = this.data;

    //购物车数组中被选中的  数组
    const isChecked = cart.filter((i) => i.checked === true);
    //购物车数组中未被选中的
    const notChecked = cart.filter((i) => i.checked === false);
    //全被选中 true 否则 false
    if (notChecked.length === 0) {
      allChecked = true;
    } else {
      allChecked = false;
    }
    //总价格 总数量  数组
    isChecked.forEach((i) => {
      totalPrice += i.good_price * i.count;
      totalNum += i.count;
    });
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice,
    });
  },

  // 点击 + — 商品数量编辑功能
  handleItemNumEdit(e) {
    console.log(e);
    //  获取传递过来的参数
    let { operation, id } = e.currentTarget.dataset;
    //  获取购物车数组
    let { cart } = this.data;
    //  找到需要修改的商品的索引
    const index = cart.findIndex((i) => i.good_id === id);
    if (cart[index].count === 1 && operation === -1) {
      //  数量为1 弹窗提示
      wx.showToast({
        title: "该商品数量不能再少了哟",
        icon: "none",
        // true 防止用户 手抖 疯狂点击按钮
        mask: true,
      });
    } else {
      cart[index].count += operation;
    }
    this.setData({ cart });
    this.setCart(cart);
  },
  //状态 是否选中  更改
  checkboxChange(e) {
    // 获取被修改的商品的id
    const id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let { cart } = this.data;
    console.log("checkbox发生change事件，携带value值为：", id);
    cart.forEach((i) => {
      //点击 该商品  checked值取反
      if (i.good_id === id) {
        i.checked = !i.checked;
      }
    });
    this.setData({ cart });
    this.setCart(cart);
  },

  //全选
  handleItemAllCheck() {
    //  获取data中的数据
    let { cart, allChecked } = this.data;
    //  修改值
    allChecked = !allChecked;
    console.log(allChecked);
    //   循环修改cart数组 中的商品选中状态
    cart.forEach((i) => (i.checked = allChecked));
    console.log(cart);
    this.setData({ cart, allChecked });
    this.setCart(cart);
  },
  //点击编辑按钮
  handleEdit() {
    let { cartEdit } = this.data;
    cartEdit = !cartEdit;
    this.setData({ cartEdit });
  },
  //删除单个商品
  handleDelete(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id;
    let { cart } = this.data;
    let that = this;
    wx.showModal({
      title: "提示",
      content: "确认删除该商品吗？",
      success(res) {
        if (res.confirm) {
          console.log("用户点击确定");
          cart.splice(
            cart.findIndex((i) => i.good_id === id),
            1
          );
          that.setData({ cart });
          that.setCart(cart);
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
  },
  //删除多个商品
  handleAllDelete() {
    const { cart, totalNum } = this.data;
    let that = this;
    wx.showModal({
      title: "提示",
      content: "确认删除这" + totalNum + "件商品吗？",
      success(res) {
        if (res.confirm) {
          //声明i为数组最后一位的index，i>=0表示在数组不为空的情况下，i自减
          // 因为splice方法通过获取下标index定位删除，同时删除多个会造成index错误，所以按照index从最后一位元素开始向前查找删除
          for (let i = cart.length - 1; i >= 0; i--) {
            if (cart[i].checked === true) {
              cart.splice(i, 1);
            }
          }
          that.setData({ cart });
          that.setCart(cart);
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
  },

  // 点击 结算
  async handlePay() {
    // 1 判断收货地址
    const { address, totalNum } = this.data;
    if (!address.userName) {
      await wx.showToast({ title: "您还没有选择收货地址", icon: "none" });
      return;
    }
    // 2 判断用户有没有选购商品
    if (totalNum === 0) {
      await wx.showToast({ title: "您还没有选购商品", icon: "none" });
      return;
    }
    // 3 跳转到 支付页面
    wx.navigateTo({
      url: "/pages/pay/pay",
    });
  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh();
  },
});
