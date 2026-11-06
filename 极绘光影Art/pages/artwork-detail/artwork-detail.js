// pages/artwork-detail/artwork-detail.js
Page({
  data: {
    artwork: {
      id: 1,
      user: {
        avatar: 'https://youke1.picui.cn/s1/2025/09/23/68d261d6da4b3.jpg',
        nickname: '创意达人',
        userId: '123456789'
      },
      image: 'https://youke1.picui.cn/s1/2025/09/23/68d2652c56f04.jpg',
      prompt: '梦幻草原中的神秘人，动漫风格，柔和光影',
      negativePrompt: '不要文字，不要模糊',
      createTime: '2小时前',
      likes: 128,
      comments: 23,
      isLiked: false,
      isCollected: false,
      tags: ['动漫', '梦幻', '星空']
    },
    comments: [
      {
        id: 1,
        user: {
          avatar: 'https://youke1.picui.cn/s1/2025/09/23/68d261d72efa2.jpg',
          nickname: '艺术爱好者'
        },
        content: '这个作品太棒了！光影处理得很好',
        createTime: '1小时前',
        likes: 5,
        isLiked: false
      },
      {
        id: 2,
        user: {
          avatar: 'https://youke1.picui.cn/s1/2025/09/23/68d261d7a5fc8.jpg',
          nickname: '设计师小王'
        },
        content: '请问用的什么模型？',
        createTime: '30分钟前',
        likes: 2,
        isLiked: false
      }
    ],
    showComments: false,
    commentInput: '',
    showShare: false,
    showMore: false
  },

  onLoad(options) {
    const { id } = options
    this.loadArtworkDetail(id)
  },

  // 加载作品详情
  loadArtworkDetail(id) {
    wx.showLoading({
      title: '加载中...'
    })

    // 模拟API请求
    setTimeout(() => {
      wx.hideLoading()
      
      // 这里应该根据id从API获取作品详情
      console.log('加载作品详情:', id)
      
      // 模拟数据更新
      this.setData({
        artwork: {
          ...this.data.artwork,
          id: id
        }
      })
    }, 1000)
  },

  // 点赞/取消点赞
  onLike() {
    const artwork = { ...this.data.artwork }
    artwork.isLiked = !artwork.isLiked
    artwork.likes = artwork.isLiked ? artwork.likes + 1 : artwork.likes - 1
    
    this.setData({ artwork })
    
    wx.showToast({
      title: artwork.isLiked ? '已点赞' : '已取消点赞',
      icon: 'none'
    })
  },

  // 收藏/取消收藏
  onCollect() {
    const artwork = { ...this.data.artwork }
    artwork.isCollected = !artwork.isCollected
    
    this.setData({ artwork })
    
    wx.showToast({
      title: artwork.isCollected ? '已收藏' : '已取消收藏',
      icon: 'none'
    })
  },

  // 查看评论
  onViewComments() {
    this.setData({
      showComments: !this.data.showComments
    })
  },

  // 添加评论
  onAddComment() {
    if (!this.data.commentInput.trim()) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none'
      })
      return
    }

    const newComment = {
      id: Date.now(),
      user: {
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        nickname: '我'
      },
      content: this.data.commentInput,
      createTime: '刚刚',
      likes: 0,
      isLiked: false
    }

    this.setData({
      comments: [newComment, ...this.data.comments],
      commentInput: '',
      'artwork.comments': this.data.artwork.comments + 1
    })

    wx.showToast({
      title: '评论成功',
      icon: 'success'
    })
  },

  // 评论输入
  onCommentInput(e) {
    this.setData({
      commentInput: e.detail.value
    })
  },

  // 点赞评论
  onLikeComment(e) {
    const { id } = e.currentTarget.dataset
    const comments = this.data.comments.map(comment => {
      if (comment.id === id) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        }
      }
      return comment
    })
    
    this.setData({ comments })
  },

  // 下载图片
  onDownload() {
    wx.showLoading({
      title: '保存中...'
    })

    wx.downloadFile({
      url: this.data.artwork.image,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.hideLoading()
              wx.showToast({
                title: '保存成功',
                icon: 'success'
              })
            },
            fail: () => {
              wx.hideLoading()
              wx.showToast({
                title: '保存失败，请检查权限',
                icon: 'none'
              })
            }
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        })
      }
    })
  },

  // 分享
  onShare() {
    this.setData({
      showShare: !this.data.showShare
    })
  },

  // 更多操作
  onMore() {
    wx.showActionSheet({
      itemList: ['举报', '复制链接', '生成海报'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.reportArtwork()
            break
          case 1:
            this.copyLink()
            break
          case 2:
            this.generatePoster()
            break
        }
      }
    })
  },

  // 举报作品
  reportArtwork() {
    wx.showModal({
      title: '举报作品',
      content: '确定要举报这个作品吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '举报已提交',
            icon: 'success'
          })
        }
      }
    })
  },

  // 复制链接
  copyLink() {
    wx.setClipboardData({
      data: `https://ai-gallery.com/artwork/${this.data.artwork.id}`,
      success: () => {
        wx.showToast({
          title: '链接已复制',
          icon: 'success'
        })
      }
    })
  },

  // 生成海报
  generatePoster() {
    wx.showToast({
      title: '海报生成功能开发中',
      icon: 'none'
    })
  },

  // 查看用户信息
  onViewUser() {
    wx.navigateTo({
      url: `/pages/profile/profile?userId=${this.data.artwork.user.userId}`
    })
  },

  // 使用相同提示词
  onUsePrompt() {
    wx.navigateTo({
      url: `/pages/create/create?prompt=${encodeURIComponent(this.data.artwork.prompt)}`
    })
  },

  // 预览图片
  onPreviewImage() {
    wx.previewImage({
      urls: [this.data.artwork.image],
      current: this.data.artwork.image
    })
  },

  // 页面分享
  onShareAppMessage() {
    return {
      title: `${this.data.artwork.user.nickname}的AI作品`,
      path: `/pages/artwork-detail/artwork-detail?id=${this.data.artwork.id}`,
      imageUrl: this.data.artwork.image
    }
  }
})
