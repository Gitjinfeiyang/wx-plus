// pages/test/index.js
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
      sex:1,
      product:['list1','itm2'],
      birthday:'2011-10-10',
    },

    rules:{
      name:{required:true,message:"姓名不能为空"},
      info:{
        age: {
          validator: function (value, form) {
            if (value != 18) {
              return false
            }
            return true;
          },
          message:"年龄不等于18"
          },
      },
      sex:{required:true,message:"性别不能为空"}
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

    phoneIn(val){
      return val
    },
    phoneOut(val){
      return val
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onPickerChange(e){
    this.setData({
      'form.sex':e.detail.value
    })
  },

  formChange({detail}){
    this.setData({
      form:detail
    })
  },


  autoInput({detail}){
    // this.data.form.info.age=parseInt(Math.random()*100)
    // this.setData({
    //   form:this.data.form
    // })

    const form=this.selectComponent("#form")
    form.validate(true)
  }
})