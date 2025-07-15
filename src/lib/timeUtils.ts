// 時間工具函數

// 週天數據
export const WEEKDAYS = [
  { key: 'MON', label: '週一', shortLabel: '一' },
  { key: 'TUE', label: '週二', shortLabel: '二' },
  { key: 'WED', label: '週三', shortLabel: '三' },
  { key: 'THU', label: '週四', shortLabel: '四' },
  { key: 'FRI', label: '週五', shortLabel: '五' },
  { key: 'SAT', label: '週六', shortLabel: '六' },
  { key: 'SUN', label: '週日', shortLabel: '日' },
];

// 取得週天標籤
export const getWeekdayLabel = (key: string, short = false): string => {
  const weekday = WEEKDAYS.find(day => day.key === key);
  return weekday ? (short ? weekday.shortLabel : weekday.label) : key;
};

// 格式化時間段為顯示文字
export const formatTimeSlot = (timeSlot: string): string => {
  const [day, hour] = timeSlot.split('_');
  const weekdayLabel = getWeekdayLabel(day, true);
  return `${weekdayLabel} ${hour}:00`;
};

// 將時間段陣列轉換為緊湊的顯示格式
export const formatAvailableTimes = (availableTimes: string[]): string => {
  if (availableTimes.length === 0) return '無設定時間';
  
  // 按天分組
  const timesByDay: Record<string, number[]> = {};
  
  availableTimes.forEach(timeSlot => {
    const [day, hourStr] = timeSlot.split('_');
    const hour = parseInt(hourStr, 10);
    
    if (!timesByDay[day]) {
      timesByDay[day] = [];
    }
    timesByDay[day].push(hour);
  });
  
  // 對每天的時間排序
  Object.keys(timesByDay).forEach(day => {
    timesByDay[day].sort((a, b) => a - b);
  });
  
  // 生成顯示文字
  const dayStrings: string[] = [];
  
  WEEKDAYS.forEach(({ key, shortLabel }) => {
    if (timesByDay[key]) {
      const hours = timesByDay[key];
      const timeRanges = getTimeRanges(hours);
      dayStrings.push(`${shortLabel}: ${timeRanges}`);
    }
  });
  
  return dayStrings.join(' | ');
};

// 將連續的時間轉換為時間範圍顯示
const getTimeRanges = (hours: number[]): string => {
  if (hours.length === 0) return '';
  
  const ranges: string[] = [];
  let start = hours[0];
  let end = hours[0];
  
  for (let i = 1; i <= hours.length; i++) {
    if (i < hours.length && hours[i] === end + 1) {
      // 連續時間，擴展範圍
      end = hours[i];
    } else {
      // 範圍結束，添加到結果
      if (start === end) {
        ranges.push(`${start.toString().padStart(2, '0')}:00`);
      } else {
        ranges.push(`${start.toString().padStart(2, '0')}:00-${(end + 1).toString().padStart(2, '0')}:00`);
      }
      
      if (i < hours.length) {
        start = hours[i];
        end = hours[i];
      }
    }
  }
  
  return ranges.join(', ');
};

// 取得時間段的簡化顯示（用於卡片標題）
export const getTimesSummary = (availableTimes: string[]): string => {
  if (availableTimes.length === 0) return '時間未設定';
  
  // 統計每天有幾個時段
  const dayCount: Record<string, number> = {};
  
  availableTimes.forEach(timeSlot => {
    const [day] = timeSlot.split('_');
    dayCount[day] = (dayCount[day] || 0) + 1;
  });
  
  const activeDays = Object.keys(dayCount).length;
  const totalSlots = availableTimes.length;
  
  if (activeDays === 1) {
    const day = Object.keys(dayCount)[0];
    const count = dayCount[day];
    return `${getWeekdayLabel(day, true)} ${count}個時段`;
  } else if (activeDays <= 3) {
    // 顯示具體天數
    const dayLabels = Object.keys(dayCount)
      .sort((a, b) => WEEKDAYS.findIndex(w => w.key === a) - WEEKDAYS.findIndex(w => w.key === b))
      .map(day => getWeekdayLabel(day, true));
    return `${dayLabels.join('、')} 共${totalSlots}個時段`;
  } else {
    return `${activeDays}天 共${totalSlots}個時段`;
  }
};

// 檢查時間段是否有重疊（用於篩選）
export const hasTimeOverlap = (times1: string[], times2: string[]): boolean => {
  return times1.some(time => times2.includes(time));
};

// 取得時間段的小時範圍（用於篩選）
export const getHourRange = (availableTimes: string[]): { min: number; max: number } | null => {
  if (availableTimes.length === 0) return null;
  
  const hours = availableTimes.map(timeSlot => {
    const [, hourStr] = timeSlot.split('_');
    return parseInt(hourStr, 10);
  });
  
  return {
    min: Math.min(...hours),
    max: Math.max(...hours)
  };
};