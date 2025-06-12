import { View, Text, Image } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { AtGrid, AtCard, AtButton } from 'taro-ui'
import './index.scss'

// 引入必要的Taro UI样式
import 'taro-ui/dist/style/components/grid.scss'
import 'taro-ui/dist/style/components/card.scss'
import 'taro-ui/dist/style/components/button.scss'
import 'taro-ui/dist/style/components/icon.scss'

export default function Service() {
  useLoad(() => {
    // 页面加载完成
  })
  
  // 处理服务点击
  const handleServiceClick = (item, index) => {
    // 这里可以添加跳转到对应服务页面的逻辑
  }
  
  // 处理联系客服
  const handleContactService = () => {
    // 这里可以添加联系客服的逻辑
  }

  return (
    <View className='service-page'>
      <AtCard title='常用服务'>
        <AtGrid
          data={[
            {
              image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
              value: '设备维修'
            },
            {
              image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
              value: '巡检服务'
            },
            {
              image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
              value: '备件订购'
            },
            {
              image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
              value: '设备升级'
            },
            {
              image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
              value: '技术咨询'
            },
            {
              image: 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
              value: '教程资料'
            }
          ]}
          onClick={handleServiceClick}
        />
      </AtCard>
      
      <AtCard title='在线客服' className='customer-service-card'>
        <View className='customer-service'>
          <Text className='service-desc'>如有问题，请联系我们的客服团队</Text>
          <AtButton type='secondary' onClick={handleContactService}>联系客服</AtButton>
        </View>
      </AtCard>
      
      <AtCard title='服务热线' className='service-hotline-card'>
        <View className='service-hotline'>
          <Text className='hotline-number'>400-123-4567</Text>
          <Text className='hotline-time'>工作时间: 周一至周五 9:00-18:00</Text>
        </View>
      </AtCard>
    </View>
  )
}
