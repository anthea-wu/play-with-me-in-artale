'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useState, useCallback, useRef } from 'react';
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
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  '@media (max-width: 768px)': {
    width: '28px',
    height: '28px',
    minWidth: '28px',
    fontSize: '0.65rem',
  },
}));

const WEEKDAYS = [
  { key: 'MON', label: '週一' },
  { key: 'TUE', label: '週二' },
  { key: 'WED', label: '週三' },
  { key: 'THU', label: '週四' },
  { key: 'FRI', label: '週五' },
  { key: 'SAT', label: '週六' },
  { key: 'SUN', label: '週日' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const formatHour = (hour: number) => {
  return hour.toString().padStart(2, '0') + ':00';
};

const getTimeSlotKey = (day: string, hour: number) => {
  return `${day}_${hour.toString().padStart(2, '0')}`;
};

export default function WeeklyTimeGridField() {
  const { control, formState: { errors } } = useFormContext<CreateGroupInput>();
  
  // 拖拽狀態管理
  const [isDragging, setIsDragging] = useState(false);
  const [dragAction, setDragAction] = useState<'select' | 'deselect'>('select');
  const tableRef = useRef<HTMLTableElement>(null);

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

        // 拖拽開始
        const handleMouseDown = useCallback((day: string, hour: number, event: React.MouseEvent) => {
          event.preventDefault(); // 防止預設的拖拽行為
          
          const timeSlotKey = getTimeSlotKey(day, hour);
          const isCurrentlySelected = selectedTimes.includes(timeSlotKey);
          
          setIsDragging(true);
          setDragAction(isCurrentlySelected ? 'deselect' : 'select');
          
          // 立即處理當前格子
          toggleTimeSlot(day, hour);
        }, [selectedTimes, toggleTimeSlot]);

        // 拖拽過程中
        const handleMouseEnter = useCallback((day: string, hour: number) => {
          if (!isDragging) return;
          
          const timeSlotKey = getTimeSlotKey(day, hour);
          const isCurrentlySelected = selectedTimes.includes(timeSlotKey);
          
          // 根據拖拽動作決定是否要改變狀態
          if (dragAction === 'select' && !isCurrentlySelected) {
            toggleTimeSlot(day, hour);
          } else if (dragAction === 'deselect' && isCurrentlySelected) {
            toggleTimeSlot(day, hour);
          }
        }, [isDragging, dragAction, selectedTimes, toggleTimeSlot]);

        // 拖拽結束
        const handleMouseUp = useCallback(() => {
          setIsDragging(false);
        }, []);

        // 滑鼠離開表格區域
        const handleMouseLeave = useCallback(() => {
          setIsDragging(false);
        }, []);

        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              可遊戲時間 *
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              點擊或拖拽格子選擇您的可遊戲時間（已選擇 {selectedTimes.length} 個時段）
            </Typography>

            <TableContainer component={Paper} sx={{ 
              maxHeight: 400, 
              overflow: 'auto',
              '@media (max-width: 768px)': {
                maxWidth: '100%',
                overflowX: 'auto'
              }
            }}>
              <Table 
                ref={tableRef}
                stickyHeader 
                size="small" 
                sx={{
                  minWidth: 600,
                  '@media (max-width: 768px)': {
                    minWidth: 500
                  }
                }}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      width: 60, 
                      padding: '8px',
                      position: 'sticky',
                      left: 0,
                      backgroundColor: 'background.paper',
                      zIndex: 2
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
                            onMouseDown={(event) => handleMouseDown(day.key, hour, event)}
                            onMouseEnter={() => handleMouseEnter(day.key, hour)}
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