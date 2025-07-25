import React, { useState } from 'react'
import { View, Text, Picker, Input } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { FilterFormData, FilterFormProps } from '../../types/filterForm'
import './index.scss'

// 国家选项数据
const countryOptions = [
  { label: '中国', value: 'china' },
  { label: '美国', value: 'usa' },
  { label: '日本', value: 'japan' },
  { label: '德国', value: 'germany' }
]

// 车间选项数据（基于国家的级联数据）
const workshopOptions: Record<string, Array<{label: string, value: string}>> = {
  china: [
    { label: '上海车间', value: 'shanghai' },
    { label: '北京车间', value: 'beijing' },
    { label: '深圳车间', value: 'shenzhen' }
  ],
  usa: [
    { label: 'New York Workshop', value: 'newyork' },
    { label: 'California Workshop', value: 'california' }
  ],
  japan: [
    { label: '东京车间', value: 'tokyo' },
    { label: '大阪车间', value: 'osaka' }
  ],
  germany: [
    { label: 'Berlin Workshop', value: 'berlin' },
    { label: 'Munich Workshop', value: 'munich' }
  ]
}

// 设备ID选项数据（基于国家和车间的级联数据）
const deviceOptions: Record<string, Record<string, Array<{label: string, value: string}>>> = {
  china: {
    shanghai: [
      { label: 'SH-001', value: 'sh001' },
      { label: 'SH-002', value: 'sh002' },
      { label: 'SH-003', value: 'sh003' },
      { label: 'SH-004', value: 'sh004' }
    ],
    beijing: [
      { label: 'BJ-001', value: 'bj001' },
      { label: 'BJ-002', value: 'bj002' },
      { label: 'BJ-003', value: 'bj003' }
    ],
    shenzhen: [
      { label: 'SZ-001', value: 'sz001' },
      { label: 'SZ-002', value: 'sz002' },
      { label: 'SZ-005', value: 'sz005' }
    ]
  },
  usa: {
    newyork: [
      { label: 'NY-001', value: 'ny001' },
      { label: 'NY-002', value: 'ny002' },
      { label: 'NY-003', value: 'ny003' }
    ],
    california: [
      { label: 'CA-001', value: 'ca001' },
      { label: 'CA-002', value: 'ca002' }
    ]
  },
  japan: {
    tokyo: [
      { label: 'TK-001', value: 'tk001' },
      { label: 'TK-002', value: 'tk002' },
      { label: 'TK-003', value: 'tk003' }
    ],
    osaka: [
      { label: 'OS-001', value: 'os001' },
      { label: 'OS-002', value: 'os002' }
    ]
  },
  germany: {
    berlin: [
      { label: 'BE-001', value: 'be001' },
      { label: 'BE-002', value: 'be002' }
    ],
    munich: [
      { label: 'MU-001', value: 'mu001' },
      { label: 'MU-002', value: 'mu002' },
      { label: 'MU-003', value: 'mu003' }
    ]
  }
}

const FilterForm: React.FC<FilterFormProps> = ({ onQuery, onGoToMine }) => {
  // 筛选表单状态
  const [filterForm, setFilterForm] = useState<FilterFormData>({
    country: '',
    workshop: '',
    deviceId: '',
    startDate: '',
    endDate: ''
  })

  // 选择器索引状态
  const [countryIndex, setCountryIndex] = useState(0)
  const [workshopIndex, setWorkshopIndex] = useState(0)
  const [deviceIndex, setDeviceIndex] = useState(0)

  // 处理国家选择
  const handleCountryChange = (e) => {
    const index = e.detail.value
    const selectedCountry = countryOptions[index]
    setCountryIndex(index)
    setFilterForm(prev => ({
      ...prev,
      country: selectedCountry.label,
      workshop: '', // 清空车间选择
      deviceId: ''  // 清空设备ID选择
    }))
    setWorkshopIndex(0) // 重置车间索引
    setDeviceIndex(0)   // 重置设备ID索引
  }

  // 处理车间选择
  const handleWorkshopChange = (e) => {
    const index = e.detail.value
    const countryValue = countryOptions[countryIndex].value
    const availableWorkshops = workshopOptions[countryValue] || []
    const selectedWorkshop = availableWorkshops[index]
    setWorkshopIndex(index)
    setFilterForm(prev => ({
      ...prev,
      workshop: selectedWorkshop?.label || '',
      deviceId: ''  // 清空设备ID选择
    }))
    setDeviceIndex(0)   // 重置设备ID索引
  }

  // 处理设备ID选择
  const handleDeviceChange = (e) => {
    const index = e.detail.value
    const availableDevices = getAvailableDevices()
    const selectedDevice = availableDevices[index]
    setDeviceIndex(index)
    setFilterForm(prev => ({
      ...prev,
      deviceId: selectedDevice?.label || ''
    }))
  }

  // 获取当前可用的车间选项
  const getAvailableWorkshops = () => {
    const countryValue = countryOptions[countryIndex]?.value
    return workshopOptions[countryValue] || []
  }

  // 获取当前可用的设备ID选项
  const getAvailableDevices = () => {
    const countryValue = countryOptions[countryIndex]?.value
    const workshopValue = getAvailableWorkshops()[workshopIndex]?.value
    
    if (!countryValue || !workshopValue) {
      return []
    }
    
    return deviceOptions[countryValue]?.[workshopValue] || []
  }

  // 处理查询
  const handleQuery = () => {
    onQuery(filterForm)
  }

  return (
    <View className='filter-form'>
      {/* 筛选表单区域 */}
      <View className='filter-section'>
        {/* 国家选择 */}
        <View className='filter-item'>
          <View className='filter-label'>选择国家</View>
          <Picker
            mode='selector'
            range={countryOptions}
            rangeKey='label'
            value={countryIndex}
            onChange={handleCountryChange}
          >
            <View className='picker-input'>
              {filterForm.country || '请选择国家'}
            </View>
          </Picker>
        </View>

        {/* 车间选择 */}
        <View className='filter-item'>
          <View className='filter-label'>选择车间</View>
          <Picker
            mode='selector'
            range={getAvailableWorkshops()}
            rangeKey='label'
            value={workshopIndex}
            onChange={handleWorkshopChange}
            disabled={!filterForm.country}
          >
            <View className={`picker-input ${!filterForm.country ? 'disabled' : ''}`}>
              {filterForm.workshop || '请先选择国家'}
            </View>
          </Picker>
        </View>

        {/* 设备ID选择 */}
        <View className='filter-item'>
          <View className='filter-label'>设备ID</View>
          <Picker
            mode='selector'
            range={getAvailableDevices()}
            rangeKey='label'
            value={deviceIndex}
            onChange={handleDeviceChange}
            disabled={!filterForm.country || !filterForm.workshop}
          >
            <View className={`picker-input ${!filterForm.country || !filterForm.workshop ? 'disabled' : ''}`}>
              {filterForm.deviceId || '请先选择国家和车间'}
            </View>
          </Picker>
        </View>

        {/* 时间区间选择 */}
        <View className='filter-item'>
          <View className='filter-label'>时间区间</View>
          <View className='date-range-section'>
            <View className='date-input-group'>
              <Picker
                mode='date'
                value={filterForm.startDate}
                onChange={(e) => setFilterForm(prev => ({ ...prev, startDate: e.detail.value }))}
              >
                <View className='date-picker'>
                  {filterForm.startDate || '开始日期'}
                </View>
              </Picker>
              <Text className='date-separator'>至</Text>
              <Picker
                mode='date'
                value={filterForm.endDate}
                onChange={(e) => setFilterForm(prev => ({ ...prev, endDate: e.detail.value }))}
              >
                <View className='date-picker'>
                  {filterForm.endDate || '结束日期'}
                </View>
              </Picker>
              {/* 查询按钮 */}
              <AtButton 
                type='primary' 
                className='query-btn-inline' 
                onClick={handleQuery}
                style={{
                  height: '60px',
                  minWidth: '100px',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#fff',
                  backgroundColor: '#1890ff',
                  border: 'none',
                  borderRadius: '8px',
                  marginLeft: '12px'
                }}
              >
                查询
              </AtButton>
              {/* 前往我的按钮移到查询按钮右边 */}
              <AtButton 
                type='secondary' 
                className='mine-btn-inline' 
                onClick={onGoToMine}
                style={{
                  height: '60px',
                  minWidth: '120px',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#333',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  marginLeft: '12px'
                }}
              >
                前往我的
              </AtButton>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default FilterForm 