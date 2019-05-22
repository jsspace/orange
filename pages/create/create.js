// pages/create/create.js
var utils = require('../../utils/time.js');
const request = require('../../request/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: utils.formatTime(+ new Date(), '-'),
    startTime: '00:00',
    endDate: utils.formatTime(+ new Date(), '-'),
    endTime: '23:59',
    title: '',
    position: '',
    description:'',
    unit:'',
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
  /**
   * 时间改变
   */
  bindDateChange: function (e) {
    const type = e.target.dataset.type

    this.setData({
      [type]: e.detail.value,
    })
  },
  /**
   * 表单数据
   */
  handleFormChange: function (e) {
    const field = e.target.dataset.key;
    this.setData({
      [field]: e.detail.value,
    })
  },
  /**
   * 创建活动
   */
  handleCreate: function () {
    if (!this.data.title) {
      wx.showToast({
        title: '活动标题必填',
      })
      return;
    }
    const startTime = [this.data.startDate, this.data.startTime + ':00'].join(' ')
    const endTime = [this.data.endDate, this.data.endTime + ':00'].join(' ')
    const data = {
      title: this.data.title,
      position: this.data.position,
      description: this.data.description,
      unit: this.data.unit,
      startTime: +new Date(startTime),
      endTime: +new Date(endTime)
    }

    const token = wx.getStorageSync('token');
    request.createActivity(token, data, function (err, res) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(res)
      wx.redirectTo({
        url: '/pages/detail/detail?id=' + res.data.id,
      })
    })
  }
})