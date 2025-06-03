import { useState } from 'react'
import { View, Text, Picker } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

// 引入必要的Taro UI样式
import 'taro-ui/dist/style/components/button.scss'

export default function Compare() {
  const [device1, setDevice1] = useState('')
  const [device2, setDevice2] = useState('')
  const [startDate1, setStartDate1] = useState('')
  const [endDate1, setEndDate1] = useState('')
  const [startDate2, setStartDate2] = useState('')
  const [endDate2, setEndDate2] = useState('')
  const [startTime1, setStartTime1] = useState('00:00')
  const [endTime1, setEndTime1] = useState('23:59')
  const [startTime2, setStartTime2] = useState('00:00')
  const [endTime2, setEndTime2] = useState('23:59')
  const [deviceList] = useState([
    '设备A-12345',
    '设备B-67890',
    '设备C-13579',
    '设备D-24680',
    '设备E-54321'
  ])
  
  useLoad(() => {
    console.log('Compare page loaded.')
    // 初始化当前日期
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const currentDate = `${year}-${month}-${day}`
    setStartDate1(currentDate)
    setEndDate1(currentDate)
    setStartDate2(currentDate)
    setEndDate2(currentDate)
  })
  
  // 设备1选择
  const handleDevice1Change = (e) => {
    const index = e.detail.value
    setDevice1(deviceList[index])
  }
  
  // 设备2选择
  const handleDevice2Change = (e) => {
    const index = e.detail.value
    setDevice2(deviceList[index])
  }
  
  // 开始日期1变更
  const handleStartDate1Change = (e) => {
    setStartDate1(e.detail.value)
  }
  
  // 截止日期1变更
  const handleEndDate1Change = (e) => {
    setEndDate1(e.detail.value)
  }
  
  // 开始日期2变更
  const handleStartDate2Change = (e) => {
    setStartDate2(e.detail.value)
  }
  
  // 截止日期2变更
  const handleEndDate2Change = (e) => {
    setEndDate2(e.detail.value)
  }
  
  // 开始时间1变更
  const handleStartTime1Change = (e) => {
    setStartTime1(e.detail.value)
  }
  
  // 截止时间1变更
  const handleEndTime1Change = (e) => {
    setEndTime1(e.detail.value)
  }
  
  // 开始时间2变更
  const handleStartTime2Change = (e) => {
    setStartTime2(e.detail.value)
  }
  
  // 截止时间2变更
  const handleEndTime2Change = (e) => {
    setEndTime2(e.detail.value)
  }
  
  // 开始对比
  const handleStartCompare = () => {
    if (!device1 || !device2) {
      console.log('请选择设备')
      return
    }
    console.log('开始对比', {
      device1,
      startDate1,
      endDate1,
      startTime1,
      endTime1,
      device2,
      startDate2,
      endDate2,
      startTime2,
      endTime2
    })
    // 这里可以添加跳转到对比结果页面的逻辑
  }

  return (
    <View className='compare-page'>
      {/* 第一台设备选择卡片 */}
      <View className='device-card'>
        <View className='card-title'>第一台设备SN</View>
        <View className='device-selector'>
          <Picker mode='selector' range={deviceList} onChange={handleDevice1Change}>
            <View className='picker-value'>
              {device1 || '点击选择设备'}
            </View>
          </Picker>
        </View>
        
        <View className='date-row'>
          <Text className='date-label'>开始日期</Text>
          <Text className='date-label right'>截至日期</Text>
        </View>
        
        <View className='date-row'>
          <Picker mode='date' value={startDate1} onChange={handleStartDate1Change}>
            <View className='date-picker'>
              {startDate1 || '选择日期'}
            </View>
          </Picker>
          
          <Text className='date-separator'>至</Text>
          
          <Picker mode='date' value={endDate1} onChange={handleEndDate1Change}>
            <View className='date-picker'>
              {endDate1 || '选择日期'}
            </View>
          </Picker>
        </View>
        
        <View className='time-row'>
          <Text className='time-label'>开始时间</Text>
          <Text className='time-label right'>截至时间</Text>
        </View>
        
        <View className='time-row'>
          <Picker mode='time' value={startTime1} onChange={handleStartTime1Change}>
            <View className='time-value'>
              {startTime1}
            </View>
          </Picker>
          <Text className='time-separator'>至</Text>
          <Picker mode='time' value={endTime1} onChange={handleEndTime1Change}>
            <View className='time-value'>
              {endTime1}
            </View>
          </Picker>
        </View>
      </View>
      
      {/* 第二台设备选择卡片 */}
      <View className='device-card'>
        <View className='card-title'>第二台设备SN</View>
        <View className='device-selector'>
          <Picker mode='selector' range={deviceList} onChange={handleDevice2Change}>
            <View className='picker-value'>
              {device2 || '点击选择设备'}
            </View>
          </Picker>
        </View>
        
        <View className='date-row'>
          <Text className='date-label'>开始日期</Text>
          <Text className='date-label right'>截至日期</Text>
        </View>
        
        <View className='date-row'>
          <Picker mode='date' value={startDate2} onChange={handleStartDate2Change}>
            <View className='date-picker'>
              {startDate2 || '选择日期'}
            </View>
          </Picker>
          
          <Text className='date-separator'>至</Text>
          
          <Picker mode='date' value={endDate2} onChange={handleEndDate2Change}>
            <View className='date-picker'>
              {endDate2 || '选择日期'}
            </View>
          </Picker>
        </View>
        
        <View className='time-row'>
          <Text className='time-label'>开始时间</Text>
          <Text className='time-label right'>截至时间</Text>
        </View>
        
        <View className='time-row'>
          <Picker mode='time' value={startTime2} onChange={handleStartTime2Change}>
            <View className='time-value'>
              {startTime2}
            </View>
          </Picker>
          <Text className='time-separator'>至</Text>
          <Picker mode='time' value={endTime2} onChange={handleEndTime2Change}>
            <View className='time-value'>
              {endTime2}
            </View>
          </Picker>
        </View>
      </View>
      
      {/* 对比按钮 */}
      <View className='compare-btn' onClick={handleStartCompare}>
        对比
      </View>
    </View>
  )
}
