// components/SwipeListItem/index.js
//小程序无法阻止默认行为，左右滑动无法禁止上下滑动，使用swiper满足功能需要
const app=getApp();
const margin=200; //px
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    prevMargin:0,
    current:0, //0 1
    id:'swiper'+parseInt(Math.random()*10000),
    height:'0px',
    ready:false
  },

  ready(){
    const query = this.createSelectorQuery()
    const content = query.select('#' + this.data.id)
    content.boundingClientRect()
    query.exec((res) => {
      if(res && res[0]){
        this.setData({
          height:res[0].height+'px',
          ready:true
        })
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    currentChange({detail:{current}}){
      if(current == 1){
        this.setData({
          current
        })
      }else{
        this.setData({
          current
        })
      }
    },

    onCancel(){
      this.toIndex()
      this.triggerEvent("cancel")            
    },
    onConfirm(){
      this.toIndex()
      this.triggerEvent("confirm")
    },
    toIndex(){
      this.setData({
        current: 0
      })
    }

  }
})
