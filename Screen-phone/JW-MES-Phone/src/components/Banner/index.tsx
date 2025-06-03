import { Swiper, SwiperItem, View, Image } from '@tarojs/components'
import './index.scss'

// 轮播图数据类型
export interface BannerItem {
  id: number;
  imageUrl: string;
  title: string;
}

interface BannerProps {
  data: BannerItem[];
  onBannerClick?: (id: number) => void;
}

const Banner: React.FC<BannerProps> = ({ data, onBannerClick }) => {
  const handleClick = (id: number) => {
    if (onBannerClick) {
      onBannerClick(id)
    }
  }

  return (
    <View className='banner-container'>
      <Swiper
        className='banner-swiper'
        indicatorColor='#999'
        indicatorActiveColor='#1890FF'
        circular
        indicatorDots
        autoplay
      >
        {data.map(banner => (
          <SwiperItem key={banner.id} onClick={() => handleClick(banner.id)}>
            <View className='banner-item'>
              <Image className='banner-image' src={banner.imageUrl} mode='aspectFill' />
              <View className='banner-title'>{banner.title}</View>
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  )
}

export default Banner 