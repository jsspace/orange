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
    location: '',
    description:'',
    unit:'',
    isEdit: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const activityId = options.id;
    
    if (!activityId) return;
    const that = this;
    const token = wx.getStorageSync('token');

    this.setData({
      isEdit: true,
      activityId,
    });
    request.getActivityDetail(token, activityId, function(err, res) {
      if (err || res.code !== 0) {
        return;
      }
      res = res.data;
      that.setData({
        title: res.title,
        location: res.location,
        description: res.description,
        unit: res.unit,
        startDate: utils.formatTime(res.startTime, '-'),
        startTime: utils.formatTime(res.startTime, ':'),
        endDate: utils.formatTime(res.endTime, '-'),
        endTime: utils.formatTime(res.endTime, ':'),
      });
    })
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
      [type]: e.detail.value.trim(),
    })
  },
  /**
   * 表单数据
   */
  handleFormChange: function (e) {
    const field = e.target.dataset.key;
    console.log(e);
    this.setData({
      [field]: e.detail.value.trim(),
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
    const startTime = [this.data.startDate.replace(/\-/g, '/'), this.data.startTime + ':00'].join(' ')
    const endTime = [this.data.endDate.replace(/\-/g, '/'), this.data.endTime + ':00'].join(' ')
    const data = {
      title: this.data.title,
      location: this.data.location || '',
      description: this.data.description,
      unit: this.data.unit,
      startTime: +new Date(startTime),
      endTime: +new Date(endTime)
    }
    console.log(data)
    const that = this;
    const token = wx.getStorageSync('token');
    if (this.data.isEdit) {
      data.activityId = this.data.activityId;
      request.updateActivity(token, data, function (err ,res) {
        if (err || res.code !== 0) {
          wx.showToast({
            title: '修改失败',
          })
          return;
        }
        wx.redirectTo({
          url: '/pages/detail/detail?id=' + that.data.activityId,
        })
      })
      return;
    }
    request.createActivity(token, data, function (err, res) {
      if (err) {
        console.log(err);
        return;
      }
      
      wx.redirectTo({
        url: '/pages/detail/detail?id=' + res.data.id,
      })
    })
  }
})