import { View, Text, Image } from '@tarojs/components';
import { useLoad, switchTab } from '@tarojs/taro';
import { AtButton, AtList, AtListItem } from 'taro-ui';
import { useAppContext } from '../../store/AppContext';
import { useState } from 'react';
import './index.scss';

// 引入必要的样式
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/list.scss';
import 'taro-ui/dist/style/components/icon.scss';

// 默认头像图片（替换为稳定可用的图片URL）
const DEFAULT_AVATAR = 'https://img.yzcdn.cn/vant/cat.jpeg';

export default function Mine() {
  const { state, dispatch } = useAppContext();
  const [imageError, setImageError] = useState(false);
  
  useLoad(() => {
    // 页面加载完成
  });

  // 模拟登录操作
  const handleLogin = () => {
    dispatch({ 
      type: 'SET_USER_INFO', 
      payload: { 
        name: '测试用户',
        avatar: DEFAULT_AVATAR // 使用默认头像
      } 
    });
    dispatch({ type: 'SET_LOGIN_STATUS', payload: true });
  };

  // 模拟退出登录
  const handleLogout = () => {
    dispatch({ type: 'SET_USER_INFO', payload: null });
    dispatch({ type: 'SET_LOGIN_STATUS', payload: false });
    setImageError(false);
  };

  // 跳转到首页
  const goToHome = () => {
    switchTab({ url: '/pages/index/index' });
  };

  // 处理图片加载错误
  const handleImageError = () => {
    setImageError(true);
  };

  // 获取要显示的头像URL
  const getAvatarUrl = () => {
    if (imageError || !state.userInfo?.avatar) {
      return DEFAULT_AVATAR;
    }
    return state.userInfo.avatar;
  };

  return (
    <View className='mine-page'>
      <View className='user-card'>
        {state.isLogin ? (
          <>
            <View className='user-info'>
              <View className='user-avatar-circle'>
                <Image 
                  className='avatar-img' 
                  src={getAvatarUrl()}
                  mode='aspectFill'
                  onError={handleImageError}
                />
              </View>
              <Text className='username'>{state.userInfo?.name}</Text>
            </View>
            <AtButton type='secondary' size='small' onClick={handleLogout}>退出登录</AtButton>
          </>
        ) : (
          <View className='login-section'>
            <Text className='login-tip'>您尚未登录</Text>
            <AtButton type='primary' onClick={handleLogin}>登录</AtButton>
          </View>
        )}
      </View>

      <AtList>
        <AtListItem title='返回首页' arrow='right' onClick={goToHome} />
        <AtListItem title='个人设置' arrow='right' />
        <AtListItem title='消息通知' arrow='right' />
        <AtListItem title='帮助中心' arrow='right' />
        <AtListItem title='关于我们' arrow='right' />
      </AtList>
    </View>
  );
}
