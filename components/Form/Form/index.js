// components/BetterForm/index.js
function isEmpty(val){
  if(val == null) return true;
  val=val+'';
  if(val.length<=0) return true;
}
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
      value:{}
    },
    labelWidth:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    formItems:[],
    showToast:false,
    valid:true
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
      }
      temp[keys[keys.length-1]]=value;
      this.triggerEvent("change",this.properties.model)
    },

    //表单验证 是否显示toast
    validate(showToast=true){
      this.setData({
        showToast,
        valid:true
      })
      this.validateObj(this.properties.rules,this.properties.model)
      return this.data.valid;
    },

    validateObj(rules,model){
      if(typeof rules!='object' || !this.data.valid) return;

      if(!rules.message){
        const keys=Object.keys(rules);
        keys.forEach((key) => {
          if(model[key]!=undefined){
            this.validateObj(rules[key],model[key])
          }
        })
      }else{
        //通过message判断是validater配置  
        let valid=true;
        let message=rules.message;
        if(rules.validator){
          let v = rules.validator(model, this.properties.model)
          if (v === false) {
            valid = v;
            if (this.data.showToast && !valid) {
              wx.showToast({
                title: message,
                icon: 'none'
              })
              console.warn("Form:" + message + "; value:[ " + model + " ]")
            }
          }
        }else{
          if (rules.required && isEmpty(model)) {
            valid = false;
            if (this.data.showToast && !valid) {
              wx.showToast({
                title: message,
                icon: 'none'
              })
              console.warn("Form:" + message + "; value:[ " + model + " ]")
            }
          }
        }
        this.setData({
          valid
        })
      }

    }
  },

  relations:{
    '../FormItem/index':{
      type:'child',
      linked(target){
        this.data.formItems.push(target);
        this.setData({
          formItems:this.data.formItems
        })
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
