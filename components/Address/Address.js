// components/Address/Address.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    address:{
      type: Object,
      value:{}
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    ChooseAddress(e) {
      console.log(e);
      this.triggerEvent("chooseAddress")
      
    },
  }
})
