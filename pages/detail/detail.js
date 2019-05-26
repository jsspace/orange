// pages/detail/detail.js
const request = require('../../request/index.js');
const formatTime = require('../../utils/time.js');
var base64 = require("../images/base64");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      timeIcon: base64.timeIcon,
      locationIcon: base64.locationIcon,
      userIcon: base64.userIcon
    });
    this.getActivityDetail(options.id);
    this.setData({
      activityId: options.id,
    });
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

  // 获取活动详情
  getActivityDetail: function (id) {
    var that = this;
    var token = wx.getStorageSync('token');
    request.getActivityDetail(token, id, function(err, res) {
      if (err) {
        console.error(err);
        return;
      }
      // set data
      res.data.startTime = formatTime.formatTime(res.data.startTime);
      res.data.endTime = formatTime.formatTime(res.data.endTime);
      that.setData({
        activity: res.data
      });
    })
  },
  handleEdit: function () {
    wx.navigateTo({
      url: '/pages/create/create?id=' + this.data.activityId,
    })
  },
  handleDelete: function () {
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除此活动？',
      success(res) {
        if (res.confirm) {
          that.deleteActivity();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 删除活动
  deleteActivity: function () {
    const token = wx.getStorageSync('token')
    request.deleteActivity(token, this.data.activityId, function (err, data) {
      if (err || data.code !== 0) {
        wx.showToast({
          title: '删除失败',
        })
        return;
      }
      wx.redirectTo({
        url: '/pages/index/index',
      })
    })
  }
})