/**
 * English Language Resources
 */
export const en = {
  // Navigation Menu
  nav: {
    monitoring: 'Real-time Monitoring',
    maintenance: 'Maintenance Management', 
    analysis: 'Performance Analysis',
    ai: 'AI',
    country: 'China',
    workshop: 'Workshop',
    device: 'Device',
    allWorkshops: 'All Workshops',
    allDevices: 'All Devices',
    selectedWorkshops: '{count} Workshops Selected',
    selectedDevices: '{count} Devices Selected'
  },
  
  // Time Range Options
  timeRange: {
    none: 'None',
    today: 'Today',
    yesterday: 'Yesterday',
    dayBeforeYesterday: 'Day Before Yesterday',
    thisWeek: 'This Week',
    lastWeek: 'Last Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    thisQuarter: 'This Quarter',
    lastQuarter: 'Last Quarter',
    thisYear: 'This Year',
    lastYear: 'Last Year'
  },
  
  // Monitoring Metrics
  monitor: {
    efficiency: 'Efficiency',
    cutTime: 'Cut Time',
    energy: 'Energy Consumption',
    cutSpeed: 'Cut Speed',
    perimeter: 'Perimeter',
    cutSets: 'Cut Sets',
    
    // Device Status
    status: {
      cutting: 'Cutting',
      standby: 'Standby', 
      unplanned: 'Unplanned Downtime',
      planned: 'Planned Downtime'
    },
    
    // Units
    units: {
      efficiency: '%',
      cutTime: 'h',
      energy: 'kW·h',
      cutSpeed: 'm/s',
      perimeter: 'm',
      cutSets: 'sets',
      speed: 'm/s',
      duration: 'h'
    },
    
    // Status Monitor Panel
    statusPanel: {
      title: 'Device Status Overview',
      operationTitle: 'Device Operation Details',
      noDeviceData: 'No Device Data Available'
    }
  },
  
  // Table
  table: {
    headers: {
      index: 'No.',
      workshop: 'Workshop', 
      deviceId: 'Device ID',
      speed: 'Speed(m/s)',
      duration: 'Runtime(h)',
      blade: 'Blade',
      grindingRod: 'Grinding Rod',
      faultCode: 'Fault Code',
      startTime: 'Start Time'
    },
    loadMore: 'Load More',
    loading: 'Loading...',
    noData: 'No Data Available'
  },
  
  // Maintenance Management
  maintenance: {
    // Metric Cards
    metrics: {
      faultCount: 'Fault Devices',
      faultTimes: 'Fault Times',
      faultDuration: 'Fault Duration',
      avgFaultTime: 'Avg Fault Time'
    },
    
    // Units
    units: {
      devices: 'Units',
      times: 'Times',
      hours: 'H'
    },
    
    // Panel Titles
    panels: {
      bladeLife: 'Blade & Grinding Rod Life',
      faultList: 'Current Device Fault List'
    }
  },
  
  // Performance Analysis
  analysis: {
    // Chart Titles
    charts: {
      efficiency: 'Efficiency MU',
      perimeter: 'Perimeter (M)',
      cutTime: 'Cut Time (H)',
      cutSpeed: 'Cut Speed (m/s)'
    }
  },
  
  // Common
  common: {
    loading: 'Loading...',
    error: 'Load Failed',
    retry: 'Retry',
    confirm: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    reset: 'Reset',
    refresh: 'Refresh',
    export: 'Export',
    import: 'Import',
    select: 'Select',
    selectAll: 'Select All',
    clear: 'Clear'
  },
  
  // Message Prompts
  messages: {
    loadSuccess: 'Loaded Successfully',
    loadError: 'Load Failed',
    saveSuccess: 'Saved Successfully',
    saveError: 'Save Failed',
    deleteSuccess: 'Deleted Successfully',
    deleteError: 'Delete Failed',
    networkError: 'Network Connection Failed',
    serverError: 'Server Error',
    dataError: 'Data Format Error',
    permissionError: 'Insufficient Permissions'
  }
};

export default en; 