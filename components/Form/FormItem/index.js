// components/FormItem/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    prop: {
      type: String,
      value: ''
    },
    label:{
      type:String,
      value:''
    },
    input:{ //value被设置到view层调用 只在model主动变化时触发
      type:Function,
      value: function (val, prop){
        return val;
      }
    },
    output:{//view触发change时调用
      type:Function,
      value: function (val, prop){
        return val;
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    event: null,
    triggerChange:null,
    parent:null,
    child:null,
    labelWidth:0,
    value:'',
  },

  ready() {
    if (((!this.properties.prop) || (this.properties.prop.length <= 0))&&this.data.parent) {
      console.warn("FormItem:请填写合法的prop")
    }
    if(this.data.parent){
      this.setData({
        labelWidth:this.data.parent.properties.labelWidth
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event,options){
      let dirtyVal= this.properties.output(options.value,this.properties.prop)
      //formitem只接受从model来的数据
      // this.setData({ event,value:options.value })
      if(!this.data.parent) return;
      this.data.parent.onChange(dirtyVal,this.properties.prop)
    },
    //using for init value from model
    refreshValue(){
      let val=this.getParentValue()
      if(val === this.data.value) return;
      //当formitem与child连接时，child还没有与child的child连接，如果此时set，会找不到child的child,例如pickeritem
      //过滤未定义值
      if(val == undefined) val='';
      Promise.resolve()
        .then(() => {
          this.setChildValue(val)
        })
    },    
    getParentValue(){
      if(!this.data.parent) return;
      if((!this.properties.prop)||this.properties.prop=='') return;
      let keys = this.properties.prop.split('.');
      let obj = this.data.parent.properties.model;
      let temp = obj;
      for (let i = 0; i < keys.length; i++) {
        temp = temp[keys[i]];
      }
      return temp;
    },
    setChildValue(value){
      if(!this.data.child) return;
      //如果child不存在，formitem的值不初始化
      this.setData({
        value: value
      })
      let dirtyVal = this.properties.input(value, this.properties.prop)  
      this.data.child.setValue(dirtyVal)
    }
  },

  relations: {
    '../Input/index': {
      type: 'child',
      linked(target) {
        this.setData({
          child:target
        })
        this.refreshValue()
      },
      linkChanged(target) {
        this.setData({
          child: target
        })
        this.refreshValue()        
      },
      unlinked(target) {
        this.setData({
          child:null
        })
      }
    },

    '../Picker/index': {
      type: 'child',
      linked(target) {
        this.setData({
          child: target
        })
        this.refreshValue()
      },
      linkChanged(target) {
        this.setData({
          child: target
        })
        this.refreshValue()
      },
      unlinked(target) {
        this.setData({
          child:null
        })
      }
    },

    '../Form/index': {
      type: 'parent',
      linked(target) {
        this.setData({
          parent: target,
          labelWidth:target.data.labelWidth
        })
        this.refreshValue()
      },
      linkChanged(target) {
        this.setData({
          parent: target,
          labelWidth: target.data.labelWidth
        })
        this.refreshValue()
      },
      unlinked(target) {
        this.setData({
          parent:null
        })
      }
    }
  }
})
