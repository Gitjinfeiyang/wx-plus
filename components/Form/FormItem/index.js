// components/FormItem/index.js
import { isEmpty, isEqual, traverseObjectByProp} from '../input'

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
    rule:[],
    isRequired:false,
    valid:null,
    invalidRule:null,
    showTip:true,
    firstTime:true,
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
      if ((!this.properties.prop) || this.properties.prop === '') return;      
      let dirtyVal= this.properties.output(options.value,this.properties.prop)
      //formitem只接受从model来的数据
      // this.setData({ event,value:options.value })
      if(!this.data.parent) return;
      //即时校验
      this.data.parent.onChange(dirtyVal,this.properties.prop)
    },
    //using for init value from model
    refreshValue(){
      let val=this.getParentValue()
      if(isEqual(val,this.data.value) || val == undefined) return;
      //刷新验证
      this.setChildValue(val)
      if(!this.data.firstTime){
        this.validateItem({ mode: 'all' })
      }else{
        this.data.firstTime=false;      
      }
    },    
    getParentValue(){
      if(!this.data.parent) return;
      if((!this.properties.prop)||this.properties.prop==='') return;
      let obj = this.data.parent.properties.model;
      let temp=null;
      traverseObjectByProp(obj,this.properties.prop,(item,index,keys) => {
        if(index == keys.length-1){
          temp=item[keys[index]]
        }
      })
      return temp;
    },
    setChildValue(value){   
      if(!this.data.child) return;
      if ((!this.properties.prop) || this.properties.prop === '') return;
      //如果child不存在，formitem的值不初始化
      this.setData({
        value: value
      })
      let dirtyVal = this.properties.input(value, this.properties.prop) 
      this.data.child.setValue(dirtyVal)
    },

    setRule(rule,showTip){
      let isRequired=false;
      rule.forEach((item) => {
        if(item.required){
          isRequired=true;
        }
      })
      this.setData({
        rule,isRequired,showTip
      })
    },

    validateItem({mode}){
      let valid=true;
      const rules=this.data.rule;
      let invalidRule=null;
      let item={}
      for(let i=0; i<rules.length; i++){
        item=rules[i]
        if (item.validator && mode == 'all') {
          if (!item.validator(this.data.value)) {
            valid = false;
            invalidRule = item;
          }
        } else if (item.required) {
          if (isEmpty(this.data.value)) {
            valid = false;
            invalidRule = item;
          }
        }

        if(!valid){
          break;
        }
      }
      this.setData({
        valid,invalidRule
      })
      return {
        valid,
        rule:invalidRule,
        prop:this.properties.prop,
        value:this.data.value
      }
    },

    resetField(){
      this.setData({
        valid:true,
      })
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
        // this.setData({
        //   child: target
        // })
        // this.refreshValue()        
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
        // this.refreshValue()
      },
      linkChanged(target) {
        // this.setData({
        //   parent: target,
        //   labelWidth: target.data.labelWidth
        // })
        // this.refreshValue()
      },
      unlinked(target) {
        this.setData({
          parent:null
        })
      }
    }
  }
})
