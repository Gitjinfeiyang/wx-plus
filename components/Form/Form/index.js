// components/BetterForm/index.js
import { isEmpty, traverseObjectByProp} from '../input'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    model:{
      type:Object,
      value:{},
      observer(newValue){
        this.data.formItems.forEach((item) => {
          item.refreshValue()
        })
      }
    },
    rules:{
      type:Object,
      value:{},
      observer(){
        this.distributeRule()
      }
    },
    labelWidth:{
      type:Number,
      value:0
    },
    showTip:{ //显示表单内提示
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    formItems:[],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(value,prop){
      let obj=this.properties.model;
      traverseObjectByProp(obj,prop,(item,index,keys) => {
        if(index == keys.length-1){
          item[keys[index]] = value;
        }
      })
      this.triggerEvent("change",this.properties.model)
    },

    distributeRule(){
      let obj = this.properties.rules;
      this.data.formItems.forEach((item) => {
        let rule=[];
        traverseObjectByProp(obj,item.properties.prop,(objItem,index,keys) => {
          if(index == keys.length-1){
            rule=objItem[keys[index]]||[]
          }
        })
        item.setRule(rule,this.properties.showTip)
      })
    },

    //表单验证 是否显示toast
    //@showToast 是否显示信息
    //@mode 全部校验还是仅校验必填 all | required
    validate(options){
      const myOption = Object.assign({ showToast: true, mode: 'all'},options)
      const items=this.data.formItems;
      let results=[],result=null;
      let valid=true;
      for(let i=0; i<items.length; i++){
          let temp = items[i].validateItem(myOption)
          //第一次才进行以下操作
          if(!temp.valid){
            results.push(temp)
            valid = false; 
            result=temp;         
            //如果不用显示表单内提示，遇到invalid即停止验证
            // if(!this.properties.showTip){
            //   break;
            // }
          }
      }
      if (myOption.showToast && result) {
        wx.showToast({
          title: results[0].rule.message,
          icon: "none"
        })
        console.warn(`Form: <${results[0].rule.message}><MODEL.${results[0].prop}> : <${results[0].value}>`)
      }
      return {valid,results};
    },

    //重置表单验证的状态
    resetFields(){
      this.data.formItems.forEach((item) => {
        item.resetField()
      })
    }

  },

  relations:{
    '../FormItem/index':{
      type:'child',
      linked(target){
        //如果没有设置prop，不连接
        if(isEmpty(target.properties.prop)) return;
        this.data.formItems.push(target);
        this.setData({
          formItems:this.data.formItems
        })
        this.distributeRule()        
      },
      linkChanged(target){

      },
      unlinked(target){
        let index=-1;
        for(let i=0; i<this.data.formItems.length; i++){
          if(target === this.data.formItems[i]){
            index=i;
            break;
          }
        }
        if(index>=0){
          this.data.formItems.splice(index,1);
          this.setData({
            formItems:this.data.formItems
          })
        }
      }
    },

  }
})
