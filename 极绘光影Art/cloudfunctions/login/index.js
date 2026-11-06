// 云函数：用户登录
const cloud = require('wx-server-sdk');

// 初始化云开发环境（无参初始化：使用云函数所在的默认环境）
cloud.init();

// 获取数据库引用
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 1. 获取微信登录信息（openid等）
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;
    
    // 2. 检查用户是否已存在
    const userCollection = db.collection('users');
    const userResult = await userCollection.where({
      openid: openid
    }).get();
    
    let userInfo;
    let isNewUser = false;
    
    if (userResult.data.length === 0) {
      // 3. 如果用户不存在，创建新用户
      const now = new Date();
      const newUser = {
        openid: openid,
        nickname: '新用户' + Math.floor(Math.random() * 10000),
        avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLpIiaaR0d7W8ibqGt0sJf1qPwQwW3HcPZJ02p6cJqgSibDZc58uibx8Xic/132',
        bio: '',
        artworks: 0,
        likes: 0,
        fans: 0,
        followings: 0,
        createTime: now,
        updateTime: now
      };
      
      const addResult = await userCollection.add({
        data: newUser
      });
      
      // 获取新增的用户信息
      const addedUser = await userCollection.doc(addResult._id).get();
      userInfo = addedUser.data;
      isNewUser = true;
    } else {
      // 4. 如果用户已存在，获取用户信息
      userInfo = userResult.data[0];
    }
    
    // 5. 返回登录结果
    return {
      success: true,
      data: {
        userInfo: {
          userId: userInfo._id,
          openid: userInfo.openid,
          nickname: userInfo.nickname,
          avatar: userInfo.avatar,
          bio: userInfo.bio,
          stats: {
            artworks: userInfo.artworks || 0,
            likes: userInfo.likes || 0,
            fans: userInfo.fans || 0
          }
        },
        isNewUser: isNewUser,
        openid: openid,
        unionid: wxContext.UNIONID // 只有在用户绑定了微信开放平台账号时才会返回
      }
    };
  } catch (error) {
    console.error('登录失败:', error);
    return {
      success: false,
      message: '登录失败，请重试',
      error: error
    };
  }
};