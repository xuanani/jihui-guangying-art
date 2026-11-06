// 云函数：文生图调用
const cloud = require('wx-server-sdk');
const axios = require('axios');

cloud.init();

// 文生图API配置
const API_ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
const TASK_QUERY_ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/tasks/';

// 环境变量获取API Key
const API_KEY = process.env.DASHSCOPE_API_KEY;

// 检查API Key是否配置
if (!API_KEY) {
  console.error('未配置DASHSCOPE_API_KEY环境变量');
}

// 创建文生图任务
async function createText2ImageTask(prompt, negativePrompt = '', size = '1024*1024', n = 1) {
  try {
    const response = await axios.post(
      API_ENDPOINT,
      {
        model: 'wanx2.1-t2i-plus',
        input: {
          prompt: prompt,
          negative_prompt: negativePrompt
        },
        parameters: {
          size: size,
          n: n,
          prompt_extend: true,
          watermark: false
        }
      },
      {
        headers: {
          'X-DashScope-Async': 'enable',
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('创建文生图任务失败:', error);
    throw error;
  }
}

// 查询任务结果
async function queryTaskResult(taskId) {
  try {
    const response = await axios.get(`${TASK_QUERY_ENDPOINT}${taskId}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('查询任务结果失败:', error);
    throw error;
  }
}

// 云函数入口
exports.main = async (event, context) => {
  try {
    const { action, prompt, negativePrompt, size, n, taskId } = event;
    
    // 根据action执行不同的操作
    switch (action) {
      case 'create':
        // 创建文生图任务
        return await createText2ImageTask(prompt, negativePrompt, size, n);
        
      case 'query':
        // 查询任务结果
        if (!taskId) {
          throw new Error('任务ID不能为空');
        }
        return await queryTaskResult(taskId);
        
      default:
        throw new Error(`不支持的操作: ${action}`);
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};