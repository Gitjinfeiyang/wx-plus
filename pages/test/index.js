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
      birthday:'2011-10-10'
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


    onNameInput(val) {
      console.log(val)
      return val.replace(/ /g, '').split('').join(' ')
    },
    onNameOutput(val) {
      return val
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onPickerChange(e){
    console.log(e)
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