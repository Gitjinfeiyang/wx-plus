// pages/test/index.js
let focusing=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      name:'this is name',
      info:{
        age:'11',
      },
      sex:null,
      product:['list1','itm2'],
      birthday:'2011-10-10',
      address:{
        detail:'滨江区',
        country:{
          name:'中国',
          code:'CHINA'
        },
        province:{
          name:'',
          code:''
        }
      }
    },

    rules:{
      name:[{required:true,message:"姓名不能为空"}],
      info:{
        age: [{required:true,message:"年龄必填"},{
          validator: function (value, form) {
            if (value != 18) {
              return false
            }
            return true;
          },
          message:"年龄不等于18"
          }],
      },
      sex:[{required:true,message:"性别不能为空"}]
    },

    sexList:[
      { value: 1, label: '男' },
      {value:0,label:'女'},
    ],
    tree:[
      {name:'List 1',value:'list1',children:[
        { name: 'Item 1', value: 'item1' },
        {name:'Item 2',value:'item2'},
      ]},
      {
        name: 'List 2', value: 'list2', children: [
          { name: 'Item 3', value: 'item3' },
          { name: 'Item 4', value: 'item4' },
        ]
      },
    ],

    //model -> view 将手机号码分段
    phoneIn(val){
      const phoneArr = val.split('');
      for (let i = 0; i < phoneArr.length; i++) {
        if (i == 3 || i == 8) {
          phoneArr.splice(i, 0, ' ');
          i++;
        }
      }
      let phone = phoneArr.join('')
      return phone
    },
    //view -> model 去除空格
    phoneOut(val){
      return val.replace(/ /g, '')      
    },


    moneyInput(value){
        return moneyNum(value)
    },

    moneyOutput(value){
      return value.replace(/,/g,'');
    },

    dateOutput(value){
      return new Date(value).getTime()
    },



    valid:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  dateChange({ detail: { value } }) {
    this.setData({
      'form.info.age': parseInt((Date.now() - new Date(value).getTime()) / 1000 / 60 / 60 / 24 / 30/12)
    })
  },

  onPickerChange(e){
    this.setData({
      'form.sex':e.detail.value
    })
  },

  addressChange({detail}){
    const p = this.selectComponent("#addressPicker")
    this.setData({
      'form.address':detail
    })
    p.hideItemWrapper()
  },

  formChange({detail}){
    this.setData({
      form:detail
    })
    const form = this.selectComponent("#form")
    // this.setData({
      form.validate({ showToast: false, mode: 'all' })
    // })
    
  },


  autoInput({detail}){
    // this.data.form.info.age=parseInt(Math.random()*100)
    // this.setData({
    //   form:this.data.form
    // })

    const form=this.selectComponent("#form")
    form.validate()
  }
})





function moneyNum(value) {
  let val = 0;
  val = parseFloat(value)
  if (isNaN(val)) {
    val = 0
    return '';
  }
  let valStr = val.toFixed(2);
  let arr = valStr.split(".");
  let right = '.' + arr[1];
  let left = arr[0].split('');
  for (let i = left.length - 3; i > 0; i -= 2) {
    left.splice(i, 0, ',');
    i--;
  }
  let str = left.join("") + right;

  return str
}