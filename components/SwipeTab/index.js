// components/SwipeTab/index.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar:{
      type:Array,
      value:[],
      observer(value){
        this&&this.calcNeedDisplayBar(value)
      }
    },
    flex:{ //tabbar是否单行显示,否则可横向滚动
      type:Boolean,
      value:true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    current:0,
    needDisplayBar:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    currentChange({ detail: { current } }){
      this.setData({
        current
      })
    },
    swipeToIndex({currentTarget:{dataset:{index}}}){
      this.setData({
        current:parseInt(index)
      })
    },
    calcNeedDisplayBar(value){
      let needDisplayBar=true;
      if(value.length<=1){
        needDisplayBar=false;
      }
        this.setData({
          needDisplayBar
        })
    }
  }

})
