const loginUtil = require('../../utils/login.js');
const request = require('../../request/index.js');
const formatTime = require('../../utils/time.js');

var SHOE_TIMES = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasAuth: false,
    activityList: [],
    queueList: [],
    currentTab: 0,
    height: 500,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.afertLoad();
  },

  // afterLoad
  afertLoad: function () {
    var that = this;
    wx.showShareMenu({
      withShareTicket: true
    })
    loginUtil.login(function (err, token) {
      if (err) {
        console.log(err);
        return;
      }
      that.getQueueList();
      that.getUserInfo(token);
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  goToSharePage: function (e) {
    // 分享按钮不跳转
    if (e.target.dataset.id !== undefined) {
      return;
    }
    
    wx.navigateTo({
      url: '/pages/share/share?id=' + e.currentTarget.dataset.id,
    })
  },

  // 计算高度
  execSwiperHeight: function () {
    const that = this;
    const query = wx.createSelectorQuery()
    var selector = '';

    if (this.data.currentTab === 0) {
      selector = '#follow'
    } else {
      selector = '#create'
    }

    query.select(selector).boundingClientRect(function (res) {
      if (!res) return
      that.setData({
        height: res.height
      })
    }).exec()
  },

  onScroll: function (e) {
    var current = e.detail.current;
    const that = this;
    if (current === 0) {
      this.getQueueList();
    } else {
      this.getActivityList();
    }
    wx.setStorage({
      key: 'currentTab',
      data: current
    })
    this.setData({
      currentTab: current
    }, function () {
      that.execSwiperHeight()
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
    var token = wx.getStorageSync('token')
    if (SHOE_TIMES > 1) {
      if (this.data.currentTab === 0) {
        this.getQueueList(token)
      } else {
        this.getActivityList(token)
      }
    }
    SHOE_TIMES++
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  // 去创建活动
  gotoCreate: function() {
    wx.navigateTo({
      url: '/pages/create/create',
    })
  },
  // 去活动详情
  gotoDetail: function(e) {
    // 分享按钮不跳转
    if (e.target.dataset.id !== undefined) {
      return;
    }
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  handleGetUserInfo: function(e) {
    console.log(e);
  },
  // 显示报名列表
  showQueueList: function(e) {
    var that = this;
    that.setData({
      currentTab: 0,
    });
  },
  // 显示创建列表
  showActivityList: function(e) {
    var that = this;
    that.setData({
      currentTab: 1,
    });
  },
  // 分享
  onShareAppMessage: function(e) {
    if (!e.target) {
      return {
        title: '简单，方便的发起报名，就在橙子报名',
        path: 'pages/index/index',
        imageUrl: 'https://cdn.webfem.com/webfem/5abf6aa0-7c9b-11e9-b71c-8991f1dd05b3',
      }
    }
    const activityId = e.target.dataset.id;
    const activityTitle = e.target.dataset.title;
    return {
      title: '我在橙子报名发起了一个活动，快来参加吧',
      path: 'pages/share/share?id=' + activityId,
      imageUrl: 'https://cdn.webfem.com/webfem/5abf6aa0-7c9b-11e9-b71c-8991f1dd05b3',
      success: function (e) {
        console.log(e);
      }
    }
  },
  // 获取所有列表
  getActivityList: function(token) {
    var that = this;
    request.getActivityList(token, function(err, res) {
      if (err) {
        console.log(err);
        return;
      }
      // 这里是说token失效
      if (res.code !== 0) {
        loginUtil.codeToken(function(err, token) {
          if (err) {
            console.log(err);
            return;
          }
          that.getActivityList(token);
          that.getUserInfo(token);
        })
        return;
      }
      const list = res.data.forEach(function(item) {
        item.startTime = formatTime.formatTime(item.startTime)
      })
      that.setData({
        activityList: res.data
      }, () => {
        that.execSwiperHeight()
      });
    })
  },
  // 获取用户信息
  getUserInfo: function(token) {
    var that = this;
    request.getUserInfo(token, function(err, data) {
      if (err) {
        that.setData({
          hasAuth: false,
        })
        return;
      }
      
      if (data.data && data.data.username) {
        that.setData({
          hasAuth: true,
        })
        return;
      }
      that.setData({
        hasAuth: false,
      })
    })
  },
  // 微信授权
  handleGetUserInfo: function(userInfo) {
    console.log(userInfo);
    var that = this;
    if (userInfo.detail) {
      that.setData({
        hasAuth: true
      })
      const rawData = JSON.parse(userInfo.detail.rawData);
      var data = {
        username: rawData.nickName,
        profile: rawData.avatarUrl,
      }
      that.updateUserInfo(data)
    }
  },
  // 更新用户信息
  updateUserInfo: function(data) {
    var token = wx.getStorageSync('token');
    if (!token) return;

    request.updateUserInfo(token, data, function(err, data) {
      console.log(data);
      wx.navigateTo({
        url: '/pages/create/create',
      })
    })
  },
  // 显示我报名的活动
  getQueueList: function(token) {
    var that = this;
    request.getQueueList(token, function (err, res) {
      if (err) {
        console.log(err);
        return;
      }
      // 这里是说token失效
      if (res.code !== 0) {
        loginUtil.codeToken(function (err, token) {
          if (err) {
            console.log(err);
            return;
          }
          that.getQueueList(token);
          that.getUserInfo(token);
        })
        return;
      }
      const list = res.data.forEach(function (item) {
        item.startTime = formatTime.formatTime(item.startTime)
      })
      that.setData({
        queueList: res.data.filter(item => !!item.activityInfo)
      }, function () {
        that.execSwiperHeight()
      });
    })
  }
})