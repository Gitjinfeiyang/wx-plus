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

    //触发值变化的事件
    trigger:{
      type:String,
      value:'change',//change || blur
    }
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
    onFocus(e){
      if(this.data.parent){
        this.data.parent.setChildValue(this.data.parent.data.value)
      }
    },
    onBlur(e){
      this.onChange(e)
    }
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
