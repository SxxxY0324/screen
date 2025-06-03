import { View, Text } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import { AtButton, AtAvatar, AtList, AtListItem } from 'taro-ui';
import { useAppContext } from '../../store/AppContext';
import './index.scss';

// 引入必要的样式
import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/list.scss';
import 'taro-ui/dist/style/components/icon.scss';

export default function Mine() {
  const { state, dispatch } = useAppContext();
  
  useLoad(() => {
    console.log('Mine page loaded.');
  });

  // 模拟登录操作
  const handleLogin = () => {
    dispatch({ 
      type: 'SET_USER_INFO', 
      payload: { 
        name: '测试用户',
        avatar: 'https://jdc.jd.com/img/200' 
      } 
    });
    dispatch({ type: 'SET_LOGIN_STATUS', payload: true });
  };

  // 模拟退出登录
  const handleLogout = () => {
    dispatch({ type: 'SET_USER_INFO', payload: null });
    dispatch({ type: 'SET_LOGIN_STATUS', payload: false });
  };

  return (
    <View className='mine-page'>
      <View className='user-card'>
        {state.isLogin ? (
          <>
            <View className='user-info'>
              <AtAvatar circle image={state.userInfo?.avatar} />
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
        <AtListItem title='个人设置' arrow='right' />
        <AtListItem title='消息通知' arrow='right' />
        <AtListItem title='帮助中心' arrow='right' />
        <AtListItem title='关于我们' arrow='right' />
      </AtList>
    </View>
  );
}
