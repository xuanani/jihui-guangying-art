// pages/home/home.js
Page({
  data: {
    artworks: [
      {
          id: 1,
          user: {
            avatar: 'https://youke1.picui.cn/s1/2025/09/23/68d261d6da4b3.jpg',
            nickname: '创意达人',
            id: '123456789'
          },
          image: 'https://youke1.picui.cn/s1/2025/09/23/68d2652c56f04.jpg',
          prompt: '梦幻森林中的精灵少女，动漫风格，柔和光影',
          createTime: '2小时前',
          likes: 128,
          comments: 23,
          isLiked: false,
          isCollected: false
        },
        {
          id: 2,
          user: {
            avatar: 'https://youke1.picui.cn/s1/2025/09/23/68d261d72efa2.jpg',
            nickname: '数字艺术家',
            id: '987654321'
          },
          image: 'https://youke1.picui.cn/s1/2025/09/23/68d2652dcb3e2.jpg',
          prompt: '未来城市夜景，赛博朋克风格，霓虹灯效果',
          createTime: '4小时前',
          likes: 89,
          comments: 15,
          isLiked: false,
          isCollected: false
        },
        {
          id: 3,
          user: {
            avatar: 'https://youke1.picui.cn/s1/2025/09/23/68d261d7a5fc8.jpg',
            nickname: '灵感收集者',
            id: '456789123'
          },
          image: 'https://youke1.picui.cn/s1/2025/09/23/68d2652db71be.jpg',
          prompt: '抽象几何图形，渐变色彩，现代艺术风格',
          createTime: '6小时前',
          likes: 156,
          comments: 42,
          isLiked: false,
          isCollected: false
        }
    ],
    loading: false,
    refreshing: false,
    hasMore: true,
    page: 1
  },

  onLoad() {
    this.loadArtworks()
  },

  onShow() {
    // 页面显示时保留现有数据，不触发加载动画
  },

  onPullDownRefresh() {
    this.setData({ 
      refreshing: true, 
      page: 1, 
      artworks: [], 
      hasMore: true 
    })
    this.loadArtworks()
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadArtworks()
    }
  },

  // 加载作品数据
  loadArtworks() {
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
    // 定义本地头像和图片路径（按顺序排列）
    const localAvatars = ['https://youke1.picui.cn/s1/2025/09/23/68d261d77ef52.jpg', 'https://youke1.picui.cn/s1/2025/09/23/68d261d791ea1.jpg', 'https://youke1.picui.cn/s1/2025/09/23/68d261db67e1b.jpg', 'https://youke1.picui.cn/s1/2025/09/23/68d261dba4799.jpg', 'https://youke1.picui.cn/s1/2025/09/23/68d261dc63a17.jpg', 'https://youke1.picui.cn/s1/2025/09/23/68d261dc4eb26.jpg'];
    const localImages = ['https://youke1.picui.cn/s1/2025/09/23/68d2652da5780.jpg', 'https://youke1.picui.cn/s1/2025/09/23/68d2652dd2879.jpg', 'https://youke1.picui.cn/s1/2025/09/23/68d2653164698.jpg', 'https://youke1.picui.cn/s1/2025/09/23/68d265332ea61.jpg', 'https://youke1.picui.cn/s1/2025/09/23/68d2653387327.jpg', 'https://youke1.picui.cn/s1/2025/09/23/68d265339b7de.jpg'];
    
    // 获取当前已使用的头像和图片
    const usedAvatars = this.data.artworks.map(item => item.user.avatar);
    const usedImages = this.data.artworks.map(item => item.image);
    
    // 过滤出未使用的头像和图片
    const availableAvatars = localAvatars.filter(avatar => !usedAvatars.includes(avatar));
    const availableImages = localImages.filter(image => !usedImages.includes(image));
    
    // 如果没有足够的未使用资源，则使用所有资源
    const avatarPool = availableAvatars.length > 0 ? availableAvatars : localAvatars;
    const imagePool = availableImages.length > 0 ? availableImages : localImages;
    
    const mockUsers = [
      { nickname: 'AI画家', avatar: avatarPool[0] },
      { nickname: '创意大师', avatar: avatarPool[1] },
      { nickname: '数字艺术', avatar: avatarPool[2] }
    ]
    
    const mockPrompts = [
      '星空下的神秘少女，魔法风格，梦幻光影',
      '温柔猫耳女孩，可爱风格，温暖场景',
      '蓝调雪山，水彩画风格，画面干净'
    ]
    
    return Array.from({ length: 3 }, (_, index) => ({
      id: Date.now() + index,
      user: {
        avatar: mockUsers[index % mockUsers.length].avatar,
        nickname: mockUsers[index % mockUsers.length].nickname
      },
      image: imagePool[index % imagePool.length],
      prompt: mockPrompts[index % mockPrompts.length],
      createTime: `${index + 1}天前`,
      likes: Math.floor(Math.random() * 200) + 50,
      comments: Math.floor(Math.random() * 50) + 10,
      isLiked: false,
      isCollected: false
    }))
  },

  // 点赞/取消点赞
  onLike(e) {
    const { id } = e.currentTarget.dataset
    const artworks = this.data.artworks.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isLiked: !item.isLiked,
          likes: item.isLiked ? item.likes - 1 : item.likes + 1
        }
      }
      return item
    })
    this.setData({ artworks })
    
    // 显示提示
    wx.showToast({
      title: artworks.find(item => item.id === id).isLiked ? '已点赞' : '已取消点赞',
      icon: 'none'
    })
  },

  // 收藏/取消收藏
  onCollect(e) {
    const { id } = e.currentTarget.dataset
    const artworks = this.data.artworks.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isCollected: !item.isCollected
        }
      }
      return item
    })
    this.setData({ artworks })
    
    // 显示提示
    wx.showToast({
      title: artworks.find(item => item.id === id).isCollected ? '已收藏' : '已取消收藏',
      icon: 'none'
    })
  },

  // 查看作品详情
  onViewArtwork(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/artwork-detail/artwork-detail?id=${id}`
    })
  },

  // 查看用户信息
  onViewUser(e) {
    const { userId } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/profile/profile?userId=${userId}`
    })
  },

  // 搜索功能
  onSearch() {
    wx.showToast({
      title: '搜索功能开发中',
      icon: 'none'
    })
  },


})
