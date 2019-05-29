// pages/create/create.js
var utils = require('../../utils/time.js');
const request = require('../../request/index.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    startDate: utils.formatTime(+new Date(), '-'),
    startTime: '00:00',
    endDate: utils.formatTime(+new Date(), '-'),
    endTime: '23:59',
    title: '',
    location: '',
    description: '',
    unit: '',
    isEdit: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const activityId = options.id;

    if (!activityId) return;

    this.setData({
      isEdit: true,
      activityId,
    });

  },
  /**
   * 
   * 修改页请求活动信息
   */
  getActivityDetailInEditPage: function() {
    const that = this;
    const token = wx.getStorageSync('token');

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
   * 时间改变监听函数
   */
  bindDateChange: function(e) {
    const type = e.target.dataset.type

    this.setData({
      [type]: e.detail.value.trim(),
    })
  },
  /**
   * 表单数据
   */
  handleFormChange: function(e) {
    const field = e.target.dataset.key;

    this.setData({
      [field]: e.detail.value.trim(),
    })
  },
  /**
   * 创建活动
   */
  handleCreate: function() {
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

    if (data.endTime < data.startTime) {
      wx.showToast({
        title: '结束时间不能早于开始时间',
      })
      return;
    }

    const that = this;
    const token = wx.getStorageSync('token');
    if (this.data.isEdit) {
      data.activityId = this.data.activityId;
      request.updateActivity(token, data, function(err, res) {
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
    request.createActivity(token, data, function(err, res) {
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