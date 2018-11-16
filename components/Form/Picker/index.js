// components/BetterInput/index.js
import behavior,{formatTime} from '../input.js'

Component({
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
        this&&this.data.parent&&this.data.parent.setChildValue()
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
        multiRange[column+1] = multiRange[column][value].children||[]
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
          index.forEach((valItem, i) => {
            text+=(' '+multiRange[i][valItem][label]||'')
            realValue.push(multiRange[i][valItem][value])
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

      this.onChange({detail:{value:this.data.realValue}})
    },

    //overwrite
    setValue(val){
      const { mode, range, value, label } = this.properties;      
      
      switch(mode){
        case 'selector':
          for(let i=0; i<range.length; i++){
            if(range[i][value] == val){
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
              if(valItem == currentRange[i][value]){
                selectI=i;    
                text += (' ' + currentRange[i][label])
              }
            }
            if(selectI<0){
              selectI=0;
            }
              pickerIndexes[index] = selectI;
              currentRange = currentRange[selectI].children || []
              if (index < val.length - 1) {
                multiRange[index + 1] = currentRange
              }
          })
          this.setData({
            pickerIndexes,multiRange,val:text
          })
          break;

        case 'custom':
          for(let i=0; i<this.data.pickerItems.length; i++){
            if(this.data.pickerItems[i].properties.value == val){
              this.data.pickerItems[i].highlight()
              this.setData({
                pickerIndexes: val, val: this.data.pickerItems[i].properties.label, realVal: val
              })
              break;
            }
          }
          break;

        default :
          this.setData({
            pickerIndexes:val,val,realVal:val
          })
      }

    }
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
