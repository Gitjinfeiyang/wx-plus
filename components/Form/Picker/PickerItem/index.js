// components/Form/Picker/PickerItem/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    label:{
      type:String
    },
    value:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    parent:null,
    selected:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap(){
      if(!this.data.parent) return;
      this.highlight()
      this.data.parent.bindChange({detail:{value:this.properties.value,label:this.properties.label}})
      this.data.parent.hideItemWrapper()
    },
    highlight(){
      this.setData({
        selected:true
      })
    }
  },

  relations:{
    '../index': {
      type: 'parent',
      linked(target) {
        this.setData({
          parent: target
        })
      },
      linkChanged(target) {
        this.setData({
          parent: target
        })
      },
      unlinked(target) {
        this.setData({
          parent: null
        })
      }
    },
  }
})
