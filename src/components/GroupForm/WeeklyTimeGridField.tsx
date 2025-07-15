'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Chip,
  styled
} from '@mui/material';
import { CreateGroupInput } from '@/lib/validations';

// 時間格子的樣式化組件
const TimeCell = styled(TableCell)<{ selected?: boolean }>(({ theme, selected }) => ({
  padding: '2px',
  width: '32px',
  height: '32px',
  minWidth: '32px',
  cursor: 'pointer',
  border: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  backgroundColor: selected ? theme.palette.primary.main : 'transparent',
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  fontSize: '0.75rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: selected 
      ? theme.palette.primary.dark 
      : theme.palette.action.hover,
  },
  userSelect: 'none',
  // 響應式設計：在小螢幕上調整格子大小
  '@media (max-width: 768px)': {
    width: '28px',
    height: '28px',
    minWidth: '28px',
    fontSize: '0.65rem',
  },
}));

// 週天數據
const WEEKDAYS = [
  { key: 'MON', label: '週一' },
  { key: 'TUE', label: '週二' },
  { key: 'WED', label: '週三' },
  { key: 'THU', label: '週四' },
  { key: 'FRI', label: '週五' },
  { key: 'SAT', label: '週六' },
  { key: 'SUN', label: '週日' },
];

// 生成 24 小時陣列
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// 格式化時間顯示
const formatHour = (hour: number) => {
  return hour.toString().padStart(2, '0') + ':00';
};

// 生成時間格子的 key
const getTimeSlotKey = (day: string, hour: number) => {
  return `${day}_${hour.toString().padStart(2, '0')}`;
};

export default function WeeklyTimeGridField() {
  const { control, formState: { errors } } = useFormContext<CreateGroupInput>();

  return (
    <Controller
      name="availableTimes"
      control={control}
      render={({ field }) => {
        const selectedTimes = field.value || [];
        
        const toggleTimeSlot = (day: string, hour: number) => {
          const timeSlotKey = getTimeSlotKey(day, hour);
          const newSelectedTimes = selectedTimes.includes(timeSlotKey)
            ? selectedTimes.filter(time => time !== timeSlotKey)
            : [...selectedTimes, timeSlotKey];
          field.onChange(newSelectedTimes);
        };

        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              可遊戲時間 *
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              點擊格子選擇您的可遊戲時間（已選擇 {selectedTimes.length} 個時段）
            </Typography>

            <TableContainer component={Paper} sx={{ 
              maxHeight: 400, 
              overflow: 'auto',
              // 響應式設計：在小螢幕上允許橫向滾動
              '@media (max-width: 768px)': {
                maxWidth: '100%',
                overflowX: 'auto'
              }
            }}>
              <Table stickyHeader size="small" sx={{
                minWidth: 600, // 確保表格最小寬度
                '@media (max-width: 768px)': {
                  minWidth: 500
                }
              }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      width: 60, 
                      padding: '8px',
                      position: 'sticky',
                      left: 0,
                      backgroundColor: 'background.paper',
                      zIndex: 1
                    }}>
                      時間
                    </TableCell>
                    {WEEKDAYS.map(day => (
                      <TableCell 
                        key={day.key} 
                        align="center" 
                        sx={{ 
                          width: 50, 
                          padding: '8px',
                          '@media (max-width: 768px)': {
                            width: 40,
                            fontSize: '0.75rem'
                          }
                        }}
                      >
                        <Box component="span" sx={{
                          '@media (max-width: 768px)': {
                            display: 'block',
                            fontSize: '0.65rem'
                          }
                        }}>
                          {day.label}
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {HOURS.map(hour => (
                    <TableRow key={hour}>
                      <TableCell sx={{ 
                        fontSize: '0.75rem', 
                        padding: '2px 8px',
                        position: 'sticky',
                        left: 0,
                        backgroundColor: 'background.paper',
                        zIndex: 1,
                        '@media (max-width: 768px)': {
                          fontSize: '0.65rem'
                        }
                      }}>
                        {formatHour(hour)}
                      </TableCell>
                      {WEEKDAYS.map(day => {
                        const timeSlotKey = getTimeSlotKey(day.key, hour);
                        const isSelected = selectedTimes.includes(timeSlotKey);
                        
                        return (
                          <TimeCell
                            key={timeSlotKey}
                            selected={isSelected}
                            onClick={() => toggleTimeSlot(day.key, hour)}
                          >
                            {isSelected ? '●' : ''}
                          </TimeCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {selectedTimes.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  已選擇時段：
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selectedTimes.slice(0, 10).map(timeSlot => {
                    const [day, hour] = timeSlot.split('_');
                    const dayLabel = WEEKDAYS.find(d => d.key === day)?.label || day;
                    return (
                      <Chip
                        key={timeSlot}
                        label={`${dayLabel} ${hour}:00`}
                        size="small"
                        variant="outlined"
                        onDelete={() => {
                          const newSelectedTimes = selectedTimes.filter(time => time !== timeSlot);
                          field.onChange(newSelectedTimes);
                        }}
                      />
                    );
                  })}
                  {selectedTimes.length > 10 && (
                    <Chip
                      label={`+${selectedTimes.length - 10} 更多`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            )}

            {errors.availableTimes && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {errors.availableTimes.message}
              </Typography>
            )}
          </Box>
        );
      }}
    />
  );
}