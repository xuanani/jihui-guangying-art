// pages/profile/profile.js
Page({
  data: {
    userInfo: {
      avatar: 'https://youke1.picui.cn/s1/2025/09/23/68d261dc4eb26.jpg',
      nickname: '创意达人',
      userId: '20250923',
      bio: '热爱AI艺术创作，擅长将想象力转化为视觉作品。希望通过我的创作带给大家美的享受和灵感启发。'
    },
    isLoggedIn: true,
    stats: {
      artworks: 12,
      likes: 1200,
      fans: 89
    },
    myArtworks: [
      {
        id: 1,
        image: 'https://youke1.picui.cn/s1/2025/09/23/68d2652c56f04.jpg',
        createTime: '2天前'
      },
      {
        id: 2,
        image: 'https://youke1.picui.cn/s1/2025/09/23/68d2652dd2879.jpg',
        createTime: '3天前'
      },
      {
        id: 3,
        image: 'https://youke1.picui.cn/s1/2025/09/23/68d265339b7de.jpg',
        createTime: '5天前'
      },
      {
        id: 4,
        image: 'https://youke1.picui.cn/s1/2025/09/23/68d265332ea61.jpg',
        createTime: '1周前'
      },
      {
        id: 5,
        image: 'https://youke1.picui.cn/s1/2025/09/23/68d2653387327.jpg',
        createTime: '1周前'
      }
    ],
    menuItems: [
      {
        id: 'favorites',
        title: '我的收藏',
        icon: 'heart',
        iconColor: '#FF4757',
        bgColor: '#FFE6E6'
      },
      {
        id: 'comments',
        title: '我的评论',
        icon: 'chat',
        iconColor: '#2ED573',
        bgColor: '#E6F7E6'
      },
      {
        id: 'downloads',
        title: '下载记录',
        icon: 'download',
        iconColor: '#9C88FF',
        bgColor: '#F0E6FF'
      }
    ],
    settingsItems: [
      {
        id: 'privacy',
        title: '隐私设置',
        icon: 'lock-on',
        iconColor: '#FFA502',
        bgColor: '#FFF4E6'
      },
      {
        id: 'about',
        title: '关于我们',
        icon: 'info-circle',
        iconColor: '#FF6B6B',
        bgColor: '#FFE6E6'
      },
      {
        id: 'logout',
        title: '退出登录',
        icon: 'logout',
        iconColor: '#95A5A6',
        bgColor: '#F5F5F5'
      }
    ]
  },

  onLoad(options) {
    // 如果是查看其他用户
    if (options.userId && options.userId !== this.data.userInfo.userId) {
      this.loadOtherUserInfo(options.userId)
    } else {
      this.checkLoginStatus()
    }
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadUserData()
  },

  // 检查登录状态
  checkLoginStatus() {
    const app = getApp();
    const isLoggedIn = app.globalData.isLoggedIn || false;
    const userInfo = app.globalData.userInfo || null;
    
    this.setData({
      isLoggedIn,
      userInfo: userInfo ? userInfo : null,
      stats: userInfo && userInfo.stats ? userInfo.stats : { artworks: 0, likes: 0, fans: 0 }
    })
    
    if (!isLoggedIn) {
      this.setData({
        myArtworks: []
      })
    }
  },

  // 微信登录
  async onWeChatLogin() {
    wx.showLoading({
      title: '登录中...'
    })

    try {
      // 1. 获取微信用户授权信息
      const userProfile = await new Promise((resolve, reject) => {
        wx.getUserProfile({
          desc: '用于完善用户资料',
          success: (res) => resolve(res.userInfo),
          fail: (err) => reject(err)
        })
      })

      // 2. 调用云函数登录
      const loginResult = await wx.cloud.callFunction({
        name: 'login'
      })

      if (!loginResult.result || !loginResult.result.success) {
        throw new Error(loginResult.result?.message || '登录失败');
      }

      // 3. 处理登录结果
      const { userInfo, isNewUser } = loginResult.result.data;
      
      // 合并微信用户信息
      const finalUserInfo = {
        ...userInfo,
        nickname: userProfile.nickName,
        avatar: userProfile.avatarUrl,
        gender: userProfile.gender,
        country: userProfile.country,
        province: userProfile.province,
        city: userProfile.city,
        language: userProfile.language
      };

      // 4. 更新全局用户信息
      const app = getApp();
      app.setUserInfo(finalUserInfo);

      // 5. 更新页面数据
      this.setData({
        isLoggedIn: true,
        userInfo: finalUserInfo,
        stats: userInfo.stats || { artworks: 0, likes: 0, fans: 0 }
      })

      // 6. 加载用户数据
      this.loadUserData()

      // 7. 提示登录成功
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })

      // 如果是新用户，可以显示引导信息
      if (isNewUser) {
        wx.showModal({
          title: '欢迎',
          content: '很高兴认识你！现在开始你的AI创作之旅吧～',
          showCancel: false
        })
      }

    } catch (error) {
      console.error('登录失败:', error);
      wx.hideLoading()
      
      // 判断错误类型，给出相应提示
      if (error.errMsg && error.errMsg.includes('auth deny')) {
        wx.showToast({
          title: '请授权后重试',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        })
      }
    } finally {
      wx.hideLoading()
    }
  },

  // 加载用户数据
  loadUserData() {
    if (!this.data.isLoggedIn) return
    
    // 模拟加载用户作品
    this.loadMyArtworks()
  },

  // 加载我的作品
  loadMyArtworks() {
    // 模拟API请求
    setTimeout(() => {
      // 这里应该从API获取用户的作品数据
      console.log('加载用户作品数据')
    }, 500)
  },

  // 加载其他用户信息
  loadOtherUserInfo(userId) {
    wx.showLoading({
      title: '加载中...'
    })

    // 模拟加载其他用户信息
    setTimeout(() => {
      wx.hideLoading()
      
      const otherUserInfo = {
        avatar: 'https://youke1.picui.cn/s1/2025/09/23/68d261d72efa2.jpg',
        nickname: '数字艺术家',
        userId: userId
      }
      
      this.setData({
        userInfo: otherUserInfo,
        isLoggedIn: false,
        stats: { artworks: 8, likes: 650, fans: 45 }
      })
      
      this.loadOtherUserArtworks(userId)
    }, 1000)
  },

  // 加载其他用户作品
  loadOtherUserArtworks(userId) {
    // 模拟加载其他用户作品
    const otherUserArtworks = [
      {
        id: 6,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
        createTime: '1天前'
      },
      {
        id: 7,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
        createTime: '3天前'
      }
    ]
    
    this.setData({
      myArtworks: otherUserArtworks
    })
  },

  // 编辑个人资料
  onEditProfile() {
    if (!this.data.isLoggedIn) {
      this.onWeChatLogin()
      return
    }

    wx.showActionSheet({
      itemList: ['修改头像', '修改昵称', '修改简介'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.changeAvatar()
            break
          case 1:
            this.changeNickname()
            break
          case 2:
            this.changeBio()
            break
        }
      }
    })
  },

  // 修改头像
  async changeAvatar() {
    try {
      // 选择图片
      const res = await wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera']
      });
      
      const tempFilePath = res.tempFiles[0].tempFilePath;
      
      wx.showLoading({
        title: '上传中...'
      });
      
      // 上传图片到云存储
      const cloudPath = `users/avatars/${Date.now()}_${Math.random().toString(36).substring(2)}.${tempFilePath.match(/\.(\w+)$/)[1]}`;
      const uploadResult = await wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: tempFilePath
      });
      
      // 获取上传后的图片URL
      const fileID = uploadResult.fileID;
      
      // 调用云函数更新用户头像
      const updateResult = await wx.cloud.callFunction({
        name: 'updateUserInfo',
        data: {
          avatar: fileID
        }
      });
      
      if (updateResult.result && updateResult.result.success) {
        // 更新本地和全局用户信息
        const updatedUserInfo = updateResult.result.data.userInfo;
        const app = getApp();
        app.setUserInfo(updatedUserInfo);
        
        this.setData({
          userInfo: updatedUserInfo
        })
        
        wx.showToast({
          title: '头像已更新',
          icon: 'success'
        })
      } else {
        throw new Error(updateResult.result?.message || '更新失败');
      }
    } catch (error) {
      console.error('修改头像失败:', error);
      wx.showToast({
        title: '修改失败，请重试',
        icon: 'none'
      })
    } finally {
      wx.hideLoading();
    }
  },

  // 修改昵称
  async changeNickname() {
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '请输入新昵称',
      success: async (res) => {
        if (res.confirm && res.content) {
          try {
            wx.showLoading({
              title: '更新中...'
            });
            
            // 调用云函数更新用户昵称
            const updateResult = await wx.cloud.callFunction({
              name: 'updateUserInfo',
              data: {
                nickname: res.content
              }
            });
            
            if (updateResult.result && updateResult.result.success) {
              // 更新本地和全局用户信息
              const updatedUserInfo = updateResult.result.data.userInfo;
              const app = getApp();
              app.setUserInfo(updatedUserInfo);
              
              this.setData({
                userInfo: updatedUserInfo
              })
              
              wx.showToast({
                title: '昵称已更新',
                icon: 'success'
              })
            } else {
              throw new Error(updateResult.result?.message || '更新失败');
            }
          } catch (error) {
            console.error('修改昵称失败:', error);
            wx.showToast({
              title: '修改失败，请重试',
              icon: 'none'
            })
          } finally {
            wx.hideLoading();
          }
        }
      }
    })
  },

  // 修改简介
  async changeBio() {
    wx.showModal({
      title: '修改简介',
      editable: true,
      placeholderText: '请输入个人简介',
      success: async (res) => {
        if (res.confirm && res.content) {
          try {
            wx.showLoading({
              title: '更新中...'
            });
            
            // 调用云函数更新用户简介
            const updateResult = await wx.cloud.callFunction({
              name: 'updateUserInfo',
              data: {
                bio: res.content
              }
            });
            
            if (updateResult.result && updateResult.result.success) {
              // 更新本地和全局用户信息
              const updatedUserInfo = updateResult.result.data.userInfo;
              const app = getApp();
              app.setUserInfo(updatedUserInfo);
              
              this.setData({
                userInfo: updatedUserInfo
              })
              
              wx.showToast({
                title: '简介已更新',
                icon: 'success'
              })
            } else {
              throw new Error(updateResult.result?.message || '更新失败');
            }
          } catch (error) {
            console.error('修改简介失败:', error);
            wx.showToast({
              title: '修改失败，请重试',
              icon: 'none'
            })
          } finally {
            wx.hideLoading();
          }
        }
      }
    })
  },

  // 查看我的画廊
  onViewMyGallery() {
    wx.navigateTo({
      url: '/pages/my-gallery/my-gallery'
    })
  },

  // 菜单项点击
  onMenuItemTap(e) {
    const { id } = e.currentTarget.dataset
    
    switch (id) {
      case 'favorites':
        wx.showToast({
          title: '收藏功能开发中',
          icon: 'none'
        })
        break
      case 'comments':
        wx.showToast({
          title: '评论功能开发中',
          icon: 'none'
        })
        break
      case 'downloads':
        wx.showToast({
          title: '下载记录功能开发中',
          icon: 'none'
        })
        break
    }
  },

  // 设置项点击
  onSettingsItemTap(e) {
    const { id } = e.currentTarget.dataset
    
    switch (id) {
      case 'privacy':
        wx.navigateTo({
          url: '/pages/settings/settings?type=privacy'
        })
        break
      case 'about':
        wx.navigateTo({
          url: '/pages/settings/settings?type=about'
        })
        break
      case 'logout':
        this.onLogout()
        break
    }
  },

  // 退出登录
  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            // 清除登录状态
            wx.removeStorageSync('isLoggedIn')
            wx.removeStorageSync('userInfo')
            
            // 重置用户状态
            this.setData({
              isLoggedIn: false,
              userInfo: {
                avatar: '/images/default-avatar.png',
                nickname: '未登录',
                userId: '',
                bio: ''
              },
              stats: {
                artworks: 0,
                likes: 0,
                followers: 0
              },
              myArtworks: []
            })
            
            // 清除全局用户信息
            const app = getApp()
            app.clearUserInfo()
            
            wx.showToast({
              title: '已退出登录',
              icon: 'success'
            })
          } catch (error) {
            console.error('退出登录失败:', error)
            wx.showToast({
              title: '退出失败，请重试',
              icon: 'none'
            })
          }
        }
      }
    })
  },

  // 查看作品详情
  onViewArtwork(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/artwork-detail/artwork-detail?id=${id}`
    })
  },



  // 页面分享
  onShareAppMessage() {
    return {
      title: `${this.data.userInfo?.nickname || '用户'}的个人画廊`,
      path: `/pages/profile/profile?userId=${this.data.userInfo?.userId || ''}`,
      imageUrl: this.data.userInfo?.avatar || '/images/share-banner.png'
    }
  }
})
