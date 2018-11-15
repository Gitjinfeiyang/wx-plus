// components/BetterInput/index.js
import behavior from '../input.js'
Component({
  behaviors: [behavior],
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type:String,
      value:'text'
    },
    maxlength:{
      type:Number,
      value:-1
    },
  },



  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
  },

  relations:{
    '../FormItem/index':{
      type:'parent',
      linked(target){
        this.setData({
          parent:target
        })
      },
      linkChanged(target){
        this.setData({
          parent:target
        })
      },
      unlinked(target){
        this.setData({
          parent:null
        })
      }
    }
  }
})
