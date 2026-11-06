// app.js
App({
  onLaunch() {
    // 配置TDesign，使用本地字体文件
    if (wx.getSystemInfoSync().platform === 'devtools') {
      // 在开发者工具中，禁用TDesign的在线字体加载
      wx.setStorageSync('tdesignConfig', {
        disableLoadFont: true
      })
    }
    
    // 云开发环境 ID —— 请换成你自己的（云开发控制台 → 设置 → 环境 ID）
    const CLOUD_ENV_ID = 'your-cloud-env-id'

    // 初始化云开发环境；未配置时跳过，避免一启动就报错
    if (CLOUD_ENV_ID && CLOUD_ENV_ID !== 'your-cloud-env-id') {
      wx.cloud.init({
        env: CLOUD_ENV_ID,
        traceUser: true // 记录用户访问记录到用户管理中
      })
    } else {
      console.warn('[极绘光影] 未配置云开发环境 ID：微信登录、资料修改、文生图将不可用。请修改 app.js 中的 CLOUD_ENV_ID。')
    }
    
    // 初始化应用
    this.initApp()
    
    // 检查更新
    this.checkUpdate()
  },

  // 初始化应用
  initApp() {
    // 设置全局配置
    this.globalData = {
      userInfo: null,
      isLoggedIn: false,
      version: '1.0.0'
    }

    // 检查登录状态
    this.checkLoginStatus()
  },

  // 检查登录状态
  checkLoginStatus() {
    const isLoggedIn = wx.getStorageSync('isLoggedIn') || false
    const userInfo = wx.getStorageSync('userInfo') || null
    
    this.globalData.isLoggedIn = isLoggedIn
    this.globalData.userInfo = userInfo
  },

  // 检查更新
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      
      updateManager.onCheckForUpdate(function (res) {
        console.log('检查更新结果:', res.hasUpdate)
      })

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })

      updateManager.onUpdateFailed(function () {
        console.log('更新失败')
      })
    }
  },

  // 设置用户信息
  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo
    this.globalData.isLoggedIn = true
    
    wx.setStorageSync('userInfo', userInfo)
    wx.setStorageSync('isLoggedIn', true)
  },

  // 清除用户信息
  clearUserInfo() {
    this.globalData.userInfo = null
    this.globalData.isLoggedIn = false
    
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('isLoggedIn')
  },

  // 全局数据
  globalData: {
    userInfo: null,
    isLoggedIn: false,
    version: '1.0.0'
  }
})
