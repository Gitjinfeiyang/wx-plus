// components/BetterForm/index.js
import {isEmpty} from '../input'

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
      let keys=prop.split('.');
      let obj=this.properties.model;
      let temp=obj;
      for(let i=0; i<keys.length-1; i++){
        temp = temp[keys[i]];
        //如果不存在则初始化为空对象
        if(!temp){
          temp={}
        }
      }
      temp[keys[keys.length-1]]=value;
      this.triggerEvent("change",this.properties.model)
    },

    distributeRule(){
      this.data.formItems.forEach((item) => {
        const prop=item.properties.prop;
        let keys = prop.split('.');
        let obj = this.properties.rules;
        let temp = obj;
        let rule=[];
        for (let i = 0; i < keys.length - 1; i++) {
          temp = temp[keys[i]];
          //如果不存在则初始化为空对象
          if (!temp) {
            temp = {}
          }
        }
        rule=temp[keys[keys.length - 1]]||[];
        item.setRule(rule,this.properties.showTip)
      })
    },

    //表单验证 是否显示toast
    //@showToast 是否显示信息
    //@mode 全部校验还是仅校验必填 all | required
    validate(options){
      const myOption = Object.assign({ showToast: true, mode: 'all'},options)
      const items=this.data.formItems;
      let result=null
      let valid=true;
      for(let i=0; i<items.length; i++){
          let temp = items[i].validateItem(myOption)
          //第一次才进行以下操作
          if((!result)&&!temp.valid){
            valid = false; 
            result=temp;         
            if (myOption.showToast){
              wx.showToast({
                title: result.rule.message,
                icon:"none"
              })
              console.warn(`Form: Invalid value,<${result.prop}>:[${result.value}]`) 
            }
            //如果不用显示表单内提示，遇到invalid即停止验证
            // if(!this.properties.showTip){
            //   break;
            // }
          }
      }
      if(!valid){
        return result
      }
      return {valid};
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
