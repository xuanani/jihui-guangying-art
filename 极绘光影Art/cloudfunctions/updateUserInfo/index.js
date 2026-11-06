// 云函数：更新用户资料
const cloud = require('wx-server-sdk');

// 初始化云开发环境（无参初始化：使用云函数所在的默认环境）
cloud.init();

// 获取数据库引用
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 获取用户openid
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;
    
    // 获取要更新的用户信息
    const { nickname, avatar, bio } = event;
    
    // 构建更新数据对象
    const updateData = {};
    if (nickname !== undefined) updateData.nickname = nickname;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (bio !== undefined) updateData.bio = bio;
    updateData.updateTime = new Date();
    
    // 更新用户信息
    await db.collection('users')
      .where({
        openid: openid
      })
      .update({
        data: updateData
      });
    
    // 获取更新后的用户信息
    const userResult = await db.collection('users')
      .where({
        openid: openid
      })
      .get();
    
    if (userResult.data.length === 0) {
      throw new Error('用户不存在');
    }
    
    const updatedUser = userResult.data[0];
    
    // 返回更新后的用户信息
    return {
      success: true,
      data: {
        userInfo: {
          userId: updatedUser._id,
          openid: updatedUser.openid,
          nickname: updatedUser.nickname,
          avatar: updatedUser.avatar,
          bio: updatedUser.bio,
          stats: {
            artworks: updatedUser.artworks || 0,
            likes: updatedUser.likes || 0,
            fans: updatedUser.fans || 0
          }
        }
      }
    };
  } catch (error) {
    console.error('更新用户资料失败:', error);
    return {
      success: false,
      message: '更新资料失败，请重试',
      error: error
    };
  }
};