// components/BetterInput/index.js
import behavior,{formatTime} from '../input.js'

function stringify(val){
  if(val == undefined){
    return '';
  }
  if(typeof val == 'object'){
    return JSON.stringify(val)
  }
  return val+'';
}

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  behaviors: [behavior],
  /**
   * 组件的属性列表
   */
  properties: {
    
    value:{
      type:String, //用于指定选中后的value
      value:''
    },
    mode:{
      type:String,
      value: 'selector',//selector, multiSelector , time, date, region ,custom
    },
    range:{
      type: Object, //mode 为multiSelector时 range必须为tree ，children
      value:[],
      observer(val){
        //range 变化后，重新匹配选项
        this&&this.setValue(this.data.val)
      }
    },
    label:{
      type:String,
      value:''
    },

    start:{
      type:String,
      value:''
    },
    end:{
      type:String,
      value:''
    },

    fields:{
      type:String,
      value: 'day',//有效值 year,month,day
    },

    title:{ // mode 为 custom时
      type:String,
    },

    popHeight: { // mode 为 custom时 ,无height则为全屏
      type:String
    },

    childrenKey:{
      type:String,
      value:'children'
    },

    customLabel:{ // 自定义未产开状态内容
      type:String,
      observer(val){
        this.setData({
          val
        })
      }
    },

    slot:{ //picktrigger使用slot
      type:Boolean,
      value:false
    }


    
  },



  /**
   * 组件的初始数据
   */
  data: {
    pickerIndexes:'',// number || [] 用于picker组件的定位
    multiRange:[],
    realValue:'', //对于picker val只是view层的，真实的value另外保存

    pickerItems:[],//custom模式
    showCustomWrapper:false,//custom
    currentSelectedItem:null,//custom
    offsetHeight:null,
    lastScrollTop:0,
  },


  ready(){
    if(this.properties.mode === 'custom'&&!this.properties.height){
      const query = wx.createSelectorQuery()
      query.selectViewport().boundingClientRect()
      query.exec((res) => {
        this.setData({
          offsetHeight:res[0].height
        })
      })
      
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showItemWrapper(){
      this.setData({
        showCustomWrapper:true
      })
    },

    hideItemWrapper(){
      this.setData({
        showCustomWrapper: false
      })
    },

    bindcolumnchange({ detail: { column,value}}){
      if(this.properties.mode != 'multiSelector') return;
      let multiRange=this.data.multiRange;
      if(column == multiRange.length -1){

      }else{
        multiRange[column+1] = multiRange[column][value][this.properties.childrenKey]||[]
      }
      this.setData({
        multiRange
      })
    },

    bindChange(e){
      const index=e.detail.value;
      const { mode, range, value, label } = this.properties;      
      switch(mode){
        case 'selector':
          this.setData({
            val:range[index][label],
            pickerIndexes:index,
            realValue:range[index][value]
          })
          break;
        
        case 'multiSelector':
          let pickerIndexes = index;
          let multiRange = this.data.multiRange;
          let text = '';
          let realValue=[]
          let rangeItem={},rangeLabel='',rangeValue='';
          index.forEach((valItem, i) => {
            //如果没有选项，但是valitem会是0
            rangeItem = multiRange[i][valItem];
            if(!multiRange[i][valItem]){
              rangeLabel='';
              rangeValue='';
            }else{
              rangeLabel=rangeItem[label];
              rangeValue=rangeItem[value];
            }
            text+=(' '+rangeLabel||'')
            realValue.push(rangeValue)
          })
          this.setData({
            pickerIndexes, multiRange, val: text,
            realValue
          })
          break;
        
        case 'custom':
          this.setData({
            pickerIndexes: index,
            val: e.detail.label||index,
            realValue: index
          })
          break;
        
        default :
          this.setData({
            pickerIndexes:index,
            val:index,
            realValue:index
          })

      }

      this.onChange({detail:{value:this.data.realValue,label:this.data.val}})
    },

    //overwrite
    setValue(val){
      const { mode, range, value, label } = this.properties;      
      
      //picker 进行值比对时 会统一转换成字符串比较
      switch(mode){
        case 'selector':
          for(let i=0; i<range.length; i++){
            if(stringify(range[i][value]) === stringify(val)){
              this.setData({
                val:range[i][label],
                pickerIndexes:i
              })
              break;
            }
          }
          break;
        case 'multiSelector':
          if(!Array.isArray(val)){
            console.warn("Picker:value must be type of Array when mode is multiSelector,value = "+val);
            return;
          }
          let currentRange=range;
          let pickerIndexes=[]
          let multiRange=[currentRange]
          let text='';
          val.forEach((valItem,index) => {
            pickerIndexes[index]=0
            if((!multiRange[index])||multiRange[index].length<=0){
              multiRange[index]=[]
            }
            let selectI=-1;
            for(let i=0; i<currentRange.length; i++){
              //强等于，所以是数字时要注意类型
              if(stringify(valItem) === stringify(currentRange[i][value])){
                selectI=i;    
                text += (' ' + currentRange[i][label])
              }
            }
            if(selectI<0){
              selectI=0;
            }
              pickerIndexes[index] = selectI;
            currentRange = currentRange[selectI]&&currentRange[selectI][this.properties.childrenKey] || []
              if (index < val.length - 1) {
                multiRange[index + 1] = currentRange
              }
          })
          this.setData({
            pickerIndexes,multiRange,val:text
          })
          break;

        case 'custom':
          Promise.resolve()
            .then(() => {
              for(let i=0; i<this.data.pickerItems.length; i++){
                if(stringify(this.data.pickerItems[i].properties.value) === stringify(val)){
                  this.data.pickerItems[i].highlight()
                  this.setData({
                    pickerIndexes: val, val: this.data.pickerItems[i].properties.label,realVal:val
                  })
                  break;
                }
              }
            })
          break;

        //原则上不应该过滤，但是微信不支持其他时间格式，故统一转换
        case 'date':
          let time = formatTime(val,'YYYY-MM-DD');
          this.setData({
            pickerIndexes: time, val:time, realVal: time
          })
          break;

        default :
          this.setData({
            pickerIndexes:val,val,realVal:val
          })
      }
    },

    bindScroll({detail:{scrollTop,scrollHeight}}){
      if(scrollTop+this.data.offsetHeight >= scrollHeight && scrollTop > this.data.lastScrollTop+100){
        this.setData({
          lastScrollTop:scrollTop
        })
        this.triggerEvent("reachbottom")
      }
    },

  },

  relations: {
    '../FormItem/index': {
      type: 'parent',
      linked(target) {
        this.setData({
          parent: target
        })
      },
      linkChanged(target) {
        this.setData({
          parent:target
        })
      },
      unlinked(target) {
        this.setData({
          parent:null
        })
      }
    },
    './PickerItem/index':{
      type:'child',
      linked(target) {
        this.data.pickerItems.push(target);
        this.setData({
          pickerItems:this.data.pickerItems
        })
      },
      linkChanged(target) {
        
      },
      unlinked(target) {
        for (let i = 0; i < this.data.pickerItems.length; i++) {
          if (this.data.pickerItems[i] == target){
            this.data.pickerItems.splice(i,1);
            break;
          }
        }
        this.setData({
          pickerItems:this.data.pickerItems
        })
      }
    }
  }
})
