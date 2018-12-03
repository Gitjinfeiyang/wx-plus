// components/Dialog/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:'提示'
    },
    clickOutside:{//点击遮罩区关闭
      type:Boolean,
      value:true
    },
    show:{
      type:Boolean,
      value:true,
      observer(val){
        if(val){
          setTimeout(() => {
            this.setData({
              dialogShow:val
            })
          },0)
        }else{
          this.setData({
            dialogShow: val
          })
        }
      }
    },
    confirmButton:{
      type:Object,
      value:{
        text:'确定',
        show:true
      }
    },
    cancelButton:{
      type:Object,
      value:{
        text:"取消",
        show:true
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dialogShow:false,
    triggerEvent:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onConfirm(){
      this.animationClose()
      this.data.triggerEvent='confirm'
      setTimeout(() => {
        this.transitionEnd()
      },350)
    },
    onCancel(){
      this.animationClose()
      this.data.triggerEvent = 'cancel'
      setTimeout(() => {
        this.transitionEnd()
      }, 350)
    },
    onClickMask(){
      if(!this.properties.clickOutside) return;
      this.onCancel()
    },
    animationClose(){
      this.setData({
        dialogShow: false
      })
    },
    transitionEnd(){
      this.triggerEvent(this.data.triggerEvent)      
    }
  }
})
