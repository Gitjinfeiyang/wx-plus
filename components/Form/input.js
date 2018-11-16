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
      type:String //options
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
      this.triggerEvent("change",e.detail,{value:e.detail.value})
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