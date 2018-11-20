const behavior = Behavior({
  behaviors: [],
  properties: {
    model: {
      type: String, //options
      observer(value){
        if (!this.data.parent) {
          this.setValue(value)
        }
      }
    },
    placeholder:{
      type:String, //options
      value:''
    }, 
    disabled: {
      type: Boolean,
      value: false
    },
  },
  data: {
    val:'',
    parent:null
  },
  ready(){
    //if input don't have parent(FormItem), using the model property as value
    // if(!this.data.parent){
    //   this.setValue(this.properties.model)
    // }
  },
  methods: {

    //trigger change event and notice parent to change
    onChange(e) {
      this.triggerEvent("change",e.detail,{value:e.detail.value,label:e.detail.label})
      if(!this.data.parent) return;
      this.data.parent.onChange(e,{ value: e.detail.value })
    },

    //method to set value
    setValue(value) {
      this.setData({
        val:value
      })
    }
  },

  
})

export default behavior;

const addZero = (value) => {
  if (!value || isNaN(value)) {
    return '00'
  }

  if (value < 10) {
    return '0' + value
  } else {
    return value
  }
}
export const formatTime = (value, pattern, start = 0) => {
  if (!value) {
    return
  }
  pattern = pattern || 'YYYY-MM-DD hh:mm:ss'
  let time = new Date(value)
  let year = time.getFullYear()
  let month = addZero(time.getMonth() + 1)
  let date = addZero(time.getDate())
  let hours = addZero(time.getHours())
  let minutes = addZero(time.getMinutes())
  let seconds = addZero(time.getSeconds())
  let formatTime = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds

  let length = pattern.length
  return formatTime.substr(start, length)
}

export function isEmpty(val) {
  if (val == null) return true;
  val = val + '';
  if (val.length <= 0) return true;
  return false;
}

export function isEqual(val1,val2){
  let type1=typeof val1;
  let type2 = typeof val2;
  if(type1 === type2){
    if(type1 === 'object'){
      return JSON.stringify(val1) === JSON.stringify(val2)
    }else{
      return val1 === val2
    }
  }else{
    return false;
  }
}

export function traverseObjectByProp(obj,prop,callback){
  //支持[]，用于支持数组
  let keys = prop.replace(/]/g, '').replace(/\[/g, '.').split('.');
  let temp=obj;
  const max=keys.length-1;
  for (let i = 0; i < keys.length-1; i++) {
    callback(temp,i,keys)
    temp = temp[keys[i]];
    //如果不存在则初始化为空对象
    if (!temp) {
      temp = {}
    }
  }
  callback(temp,max,keys);
  temp=temp[keys[max]]  
}