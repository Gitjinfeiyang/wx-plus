// components/AddressSelect/index.js
import { address} from './address.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:{
      type:Object,
      observer(value){
        this.initValue(value)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    form:{
      value: ['', ''],
      address:{
        country:{
          code:'',
          name:''
        },
        province:{code:'',name:''},
        city: { code: '', name: ''},
        area: { code: '', name: ''},
        detail:''
      }      
    },
    address,
  },

  ready(){
  },

  /**
   * 组件的方法列表
   */
  methods: {
    formChange({detail}){
      this.setData({
        form:detail
      })
    },

    onCountryChange({detail}){
      let names=detail.label.trim().split(" ");
      this.setData({
        'form.address':{
          country:{
            name:names[0]=='其他'?'':names[0],
            code:detail.value[0]
          },
          province:{
            name:names[1],
            code:detail.value[1]
          },
          city:{
            name:names[2],
            code:detail.value[3]
          }
        }
      })
    },

    save(){
      this.triggerEvent('change',this.data.form.address)
    },

    initValue(value){
      this.setData({
        'form.address': value
      })
      const {country,province}=value;
      this.setData({
        'form.value':[country.code||'',province.code||'']
      })
    }
  }
})
