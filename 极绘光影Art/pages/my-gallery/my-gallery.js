// pages/my-gallery/my-gallery.js
Page({
  data: {
    artworks: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop',
        prompt: '梦幻森林中的精灵少女，动漫风格，柔和光影',
        createTime: '2天前',
        likes: 128,
        comments: 23,
        isPublic: true
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
        prompt: '未来城市夜景，赛博朋克风格，霓虹灯效果',
        createTime: '3天前',
        likes: 89,
        comments: 15,
        isPublic: true
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&h=200&fit=crop',
        prompt: '抽象几何图形，渐变色彩，现代艺术风格',
        createTime: '5天前',
        likes: 156,
        comments: 42,
        isPublic: false
      }
    ],
    loading: false,
    refreshing: false,
    hasMore: true,
    page: 1,
    filterType: 'all' // all, public, private
  },

  onLoad() {
    this.loadMyArtworks()
  },

  onShow() {
    // 页面显示时刷新数据
    this.setData({ page: 1, artworks: [] })
    this.loadMyArtworks()
  },

  onPullDownRefresh() {
    this.setData({ 
      refreshing: true, 
      page: 1, 
      artworks: [], 
      hasMore: true 
    })
    this.loadMyArtworks()
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMyArtworks()
    }
  },

  // 加载我的作品
  loadMyArtworks() {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    
    // 模拟API请求
    setTimeout(() => {
      const newArtworks = this.generateMockData()
      const artworks = this.data.page === 1 ? newArtworks : [...this.data.artworks, ...newArtworks]
      
      this.setData({
        artworks,
        loading: false,
        refreshing: false,
        page: this.data.page + 1,
        hasMore: this.data.page < 3 // 模拟只有3页数据
      })
      
      if (this.data.refreshing) {
        wx.stopPullDownRefresh()
      }
    }, 1000)
  },

  // 生成模拟数据
  generateMockData() {
    const mockImages = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop'
    ]
    
    const mockPrompts = [
      '星空下的神秘城堡，魔法风格，梦幻光影',
      '机械猫头鹰，蒸汽朋克风格，金属质感',
      '花园中的蝴蝶精灵，水彩画风格，清新淡雅'
    ]
    
    return Array.from({ length: 3 }, (_, index) => ({
      id: Date.now() + index,
      image: mockImages[index],
      prompt: mockPrompts[index],
      createTime: `${index + 1}天前`,
      likes: Math.floor(Math.random() * 200) + 50,
      comments: Math.floor(Math.random() * 50) + 10,
      isPublic: Math.random() > 0.5
    }))
  },

  // 过滤作品
  onFilterChange(e) {
    const { type } = e.currentTarget.dataset
    this.setData({ filterType: type })
    
    // 这里应该根据过滤条件重新加载数据
    this.filterArtworks(type)
  },

  // 过滤作品数据
  filterArtworks(type) {
    let filteredArtworks = [...this.data.artworks]
    
    if (type === 'public') {
      filteredArtworks = filteredArtworks.filter(item => item.isPublic)
    } else if (type === 'private') {
      filteredArtworks = filteredArtworks.filter(item => !item.isPublic)
    }
    
    // 这里应该更新显示的作品列表
    console.log('过滤作品:', type, filteredArtworks.length)
  },

  // 查看作品详情
  onViewArtwork(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/artwork-detail/artwork-detail?id=${id}`
    })
  },

  // 切换作品公开状态
  onTogglePublic(e) {
    const { id } = e.currentTarget.dataset
    const artworks = this.data.artworks.map(item => {
      if (item.id === id) {
        return { ...item, isPublic: !item.isPublic }
      }
      return item
    })
    this.setData({ artworks })
    
    const artwork = artworks.find(item => item.id === id)
    wx.showToast({
      title: artwork.isPublic ? '已设为公开' : '已设为私密',
      icon: 'none'
    })
  },

  // 删除作品
  onDeleteArtwork(e) {
    const { id } = e.currentTarget.dataset
    
    wx.showModal({
      title: '删除作品',
      content: '确定要删除这个作品吗？删除后无法恢复。',
      confirmColor: '#FF4757',
      success: (res) => {
        if (res.confirm) {
          const artworks = this.data.artworks.filter(item => item.id !== id)
          this.setData({ artworks })
          
          wx.showToast({
            title: '作品已删除',
            icon: 'success'
          })
        }
      }
    })
  },

  // 分享作品
  onShareArtwork(e) {
    const { id } = e.currentTarget.dataset
    const artwork = this.data.artworks.find(item => item.id === id)
    
    wx.showActionSheet({
      itemList: ['分享到微信', '复制链接', '生成海报'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.shareToWeChat(artwork)
            break
          case 1:
            this.copyLink(artwork)
            break
          case 2:
            this.generatePoster(artwork)
            break
        }
      }
    })
  },

  // 分享到微信
  shareToWeChat(artwork) {
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    })
  },

  // 复制链接
  copyLink(artwork) {
    wx.setClipboardData({
      data: `https://ai-gallery.com/artwork/${artwork.id}`,
      success: () => {
        wx.showToast({
          title: '链接已复制',
          icon: 'success'
        })
      }
    })
  },

  // 生成海报
  generatePoster(artwork) {
    wx.showToast({
      title: '海报生成功能开发中',
      icon: 'none'
    })
  },

  // 创建新作品
  onCreateArtwork() {
    wx.switchTab({
      url: '/pages/create/create'
    })
  },

  // 批量操作
  onBatchOperation() {
    wx.showActionSheet({
      itemList: ['批量设为公开', '批量设为私密', '批量删除'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.batchSetPublic(true)
            break
          case 1:
            this.batchSetPublic(false)
            break
          case 2:
            this.batchDelete()
            break
        }
      }
    })
  },

  // 批量设置公开状态
  batchSetPublic(isPublic) {
    const artworks = this.data.artworks.map(item => ({
      ...item,
      isPublic: isPublic
    }))
    this.setData({ artworks })
    
    wx.showToast({
      title: isPublic ? '已批量设为公开' : '已批量设为私密',
      icon: 'success'
    })
  },

  // 批量删除
  batchDelete() {
    wx.showModal({
      title: '批量删除',
      content: '确定要删除所有作品吗？删除后无法恢复。',
      confirmColor: '#FF4757',
      success: (res) => {
        if (res.confirm) {
          this.setData({ artworks: [] })
          wx.showToast({
            title: '已批量删除',
            icon: 'success'
          })
        }
      }
    })
  },

  // 页面分享
  onShareAppMessage() {
    return {
      title: '我的极绘光影作品',
      path: '/pages/my-gallery/my-gallery',
      imageUrl: this.data.artworks[0]?.image || '/images/share-banner.png'
    }
  }
})
