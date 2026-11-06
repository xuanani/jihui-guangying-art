// pages/settings/settings.js
Page({
  data: {
    settingType: 'privacy', // privacy, about
    privacySettings: {
      showProfile: true,
      allowComments: true,
      allowFollows: true,
      showArtworks: true
    },
    aboutInfo: {
      version: '1.0.0',
      build: '20250923',
      developer: 'xuanani',
      license: 'MIT License',
      copyright: 'Copyright (c) 2026 xuanani',
      repo: 'https://github.com/xuanani/jihui-guangying-art',
      email: 'xuanani@foxmail.com'
    },
    feedback: {
      content: '',
      contact: ''
    },
    showFeedback: false
  },

  onLoad(options) {
    const { type = 'privacy' } = options
    this.setData({ settingType: type })
    
    // 根据类型设置页面标题
    wx.setNavigationBarTitle({
      title: type === 'privacy' ? '隐私设置' : '关于我们'
    })
  },

  // 隐私设置相关
  onPrivacyToggle(e) {
    const { key } = e.currentTarget.dataset
    const privacySettings = { ...this.data.privacySettings }
    privacySettings[key] = !privacySettings[key]
    
    this.setData({ privacySettings })
    
    // 保存设置到本地存储
    wx.setStorageSync('privacySettings', privacySettings)
    
    wx.showToast({
      title: '设置已保存',
      icon: 'success'
    })
  },

  // 关于我们相关：只保留真实可用的联系方式
  onContactSupport() {
    wx.showActionSheet({
      itemList: ['复制邮箱', '打开项目主页'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.copyEmail()
            break
          case 1:
            this.onOpenRepo()
            break
        }
      }
    })
  },

  // 复制邮箱
  copyEmail() {
    wx.setClipboardData({
      data: this.data.aboutInfo.email,
      success: () => {
        wx.showToast({
          title: '邮箱已复制',
          icon: 'success'
        })
      }
    })
  },

  // 打开项目主页（小程序内无法直接跳转外部浏览器，改为复制链接）
  onOpenRepo() {
    const { repo } = this.data.aboutInfo
    wx.showModal({
      title: '项目主页',
      content: `${repo}\n\n小程序内无法直接打开外部网页，将复制链接到剪贴板。`,
      showCancel: false,
      confirmText: '复制链接',
      success: () => {
        wx.setClipboardData({
          data: repo,
          success: () => {
            wx.showToast({
              title: '链接已复制',
              icon: 'success'
            })
          }
        })
      }
    })
  },

  // 检查更新
  onCheckUpdate() {
    wx.showLoading({
      title: '检查中...'
    })

    // 模拟检查更新
    setTimeout(() => {
      wx.hideLoading()
      wx.showModal({
        title: '检查更新',
        content: '当前已是最新版本',
        showCancel: false,
        confirmText: '确定'
      })
    }, 2000)
  },

  // 意见反馈
  onFeedback() {
    this.setData({ showFeedback: true })
  },

  // 反馈内容输入
  onFeedbackInput(e) {
    this.setData({
      'feedback.content': e.detail.value
    })
  },

  // 联系方式输入
  onContactInput(e) {
    this.setData({
      'feedback.contact': e.detail.value
    })
  },

  // 提交反馈
  onSubmitFeedback() {
    const { content, contact } = this.data.feedback
    
    if (!content.trim()) {
      wx.showToast({
        title: '请输入反馈内容',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '提交中...'
    })

    // 模拟提交反馈
    setTimeout(() => {
      wx.hideLoading()
      this.setData({
        showFeedback: false,
        feedback: { content: '', contact: '' }
      })
      
      wx.showToast({
        title: '反馈已提交，感谢您的建议',
        icon: 'success'
      })
    }, 2000)
  },

  // 取消反馈
  onCancelFeedback() {
    this.setData({
      showFeedback: false,
      feedback: { content: '', contact: '' }
    })
  },

  // 用户协议
  onUserAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '这里是用户协议的内容...',
      showCancel: false,
      confirmText: '我知道了'
    })
  },

  // 隐私政策
  onPrivacyPolicy() {
    wx.showModal({
      title: '隐私政策',
      content: '这里是隐私政策的内容...',
      showCancel: false,
      confirmText: '我知道了'
    })
  },

  // 清除缓存
  onClearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '清除中...'
          })

          // 模拟清除缓存
          setTimeout(() => {
            wx.hideLoading()
            wx.showToast({
              title: '缓存已清除',
              icon: 'success'
            })
          }, 1500)
        }
      }
    })
  },

  // 注销账户
  onDeleteAccount() {
    wx.showModal({
      title: '注销账户',
      content: '注销后将无法恢复，确定要继续吗？',
      confirmColor: '#FF4757',
      success: (res) => {
        if (res.confirm) {
          wx.showModal({
            title: '最后确认',
            content: '请再次确认是否注销账户',
            confirmColor: '#FF4757',
            success: (res2) => {
              if (res2.confirm) {
                wx.showLoading({
                  title: '注销中...'
                })

                setTimeout(() => {
                  wx.hideLoading()
                  
                  // 清除所有数据
                  wx.clearStorageSync()
                  
                  wx.showToast({
                    title: '账户已注销',
                    icon: 'success'
                  })
                  
                  // 返回首页
                  setTimeout(() => {
                    wx.reLaunch({
                      url: '/pages/home/home'
                    })
                  }, 1500)
                }, 3000)
              }
            }
          })
        }
      }
    })
  },

  // 页面分享
  onShareAppMessage() {
    return {
      title: '极绘光影 - 用AI创作精美图片',
      path: '/pages/home/home',
      imageUrl: '/images/share-banner.png'
    }
  }
})
