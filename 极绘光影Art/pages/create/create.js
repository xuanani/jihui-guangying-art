// pages/create/create.js
Page({
  data: {
    prompt: '',
    negativePrompt: '',
    selectedTags: [],
    availableTags: [
      { id: 'realistic', name: '写实', color: 'blue', selected: false },
      { id: 'anime', name: '动漫', color: 'pink', selected: false },
      { id: 'cinematic', name: '电影感', color: 'purple', selected: false },
      { id: 'fantasy', name: '梦幻', color: 'green', selected: false },
      { id: 'sci-fi', name: '科幻', color: 'orange', selected: false },
      { id: 'oil-painting', name: '油画', color: 'red', selected: false },
      { id: 'watercolor', name: '水彩', color: 'cyan', selected: false },
      { id: 'sketch', name: '素描', color: 'grey', selected: false }
    ],
    generating: false,
    generatedImage: null,
    generationProgress: 0,
    showResult: false,
    inspirationExamples: [
      {        
        image: 'https://youke1.picui.cn/s1/2025/09/23/68d265332ea61.jpg',
        title: '梦幻海洋鲸鱼',
        prompt: '森林中的精灵少女，梦幻光影，动漫风格'
      },
      {
        image: 'https://youke1.picui.cn/s1/2025/09/23/68d2653387327.jpg',
        title: '未来科技终端',
        prompt: '抽象几何图形，渐变色彩，现代艺术'
      }
    ]
  },

  onLoad() {
    // 页面加载时的初始化
    this.setData({
      prompt: '',
      negativePrompt: '',
      selectedTags: [],
      generating: false,
      generatedImage: null,
      generationProgress: 0,
      showResult: false
    })
  },

  // 输入提示词
  onPromptInput(e) {
    this.setData({
      prompt: e.detail.value
    })
  },

  // 输入负面提示词
  onNegativePromptInput(e) {
    this.setData({
      negativePrompt: e.detail.value
    })
  },

  // 选择标签
  onTagSelect(e) {
    const { tag } = e.currentTarget.dataset
    const availableTags = this.data.availableTags.map(item => {
      if (item.id === tag.id) {
        return { ...item, selected: !item.selected }
      }
      return item
    })
    
    const selectedTags = availableTags.filter(item => item.selected)
    
    this.setData({ 
      availableTags,
      selectedTags 
    })
  },

  // 添加标签到提示词
  addTagToPrompt(tagName) {
    const prompt = this.data.prompt + (this.data.prompt ? '，' : '') + tagName
    this.setData({ prompt })
  },

  // 生成图片
  async generateImage() {
    if (!this.data.prompt.trim()) {
      wx.showToast({
        title: '请输入描述内容',
        icon: 'none'
      })
      return
    }

    if (this.data.generating) return

    this.setData({
      generating: true,
      generationProgress: 0,
      showResult: false
    })

    try {
      // 1. 创建文生图任务
      const createResult = await wx.cloud.callFunction({
        name: 'text2image',
        data: {
          action: 'create',
          prompt: this.data.prompt,
          negativePrompt: this.data.negativePrompt,
          size: '1024*1024',
          n: 1
        }
      })

      if (!createResult.result || !createResult.result.output) {
        throw new Error('创建任务失败');
      }

      const taskId = createResult.result.output.task_id;
      console.log('创建任务成功，taskId:', taskId);

      // 2. 定期查询任务结果
      await this.queryTaskResult(taskId);
    } catch (error) {
      console.error('生成图片失败:', error);
      this.setData({
        generating: false,
        generationProgress: 0
      })
      wx.showToast({
        title: '生成失败，请重试',
        icon: 'none'
      })
    }
  },

  // 查询任务结果
  async queryTaskResult(taskId) {
    // 显示进度更新
    const progressInterval = setInterval(() => {
      if (this.data.generationProgress < 90) {
        this.setData({
          generationProgress: Math.floor(this.data.generationProgress + Math.random() * 10)
        })
      }
    }, 1000)

    try {
      // 循环查询直到任务完成
      let taskComplete = false;
      while (!taskComplete && this.data.generating) {
        // 每隔3秒查询一次
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const queryResult = await wx.cloud.callFunction({
          name: 'text2image',
          data: {
            action: 'query',
            taskId: taskId
          }
        })

        if (!queryResult.result || !queryResult.result.output) {
          throw new Error('查询任务结果失败');
        }

        const taskStatus = queryResult.result.output.task_status;
        const taskOutput = queryResult.result.output;

        console.log('任务状态:', taskStatus);
        
        if (taskStatus === 'SUCCEEDED') {
          // 任务成功完成
          if (taskOutput.results && taskOutput.results.length > 0 && taskOutput.results[0].url) {
            this.setData({
              generationProgress: 100,
              generatedImage: taskOutput.results[0].url,
              generating: false,
              showResult: true
            })
            taskComplete = true;
            wx.showToast({
              title: '生成完成！',
              icon: 'success'
            })
          } else {
            throw new Error('生成结果为空');
          }
        } else if (taskStatus === 'FAILED') {
          // 任务失败
          throw new Error('生成失败: ' + (taskOutput.message || '未知错误'));
        } else if (taskStatus === 'CANCELED') {
          // 任务取消
          throw new Error('任务已取消');
        }
        // 其他状态（PENDING/RUNNING）继续查询
      }
    } catch (error) {
      throw error;
    } finally {
      clearInterval(progressInterval);
    }
  },

  // 重新生成图片
  onRegenerate() {
    if (this.data.generating) return;
    
    wx.showLoading({
      title: '重新生成中...',
    })
    
    // 延迟一下，避免用户快速点击
    setTimeout(() => {
      wx.hideLoading();
      this.generateImage();
    }, 300)
  },

  // 查看灵感示例
  onViewExample(e) {
    const { example } = e.currentTarget.dataset
    wx.showModal({
      title: example.title,
      content: `提示词：${example.prompt}`,
      showCancel: false,
      confirmText: '使用此提示词',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            prompt: example.prompt
          })
        }
      }
    })
  },

  // 清空输入
  onClear() {
    this.setData({
      prompt: '',
      negativePrompt: '',
      selectedTags: []
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
