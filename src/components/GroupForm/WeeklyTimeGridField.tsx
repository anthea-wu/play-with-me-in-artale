'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useState, useCallback, useRef, useEffect } from 'react';
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
  Card,
  CardContent,
  styled
} from '@mui/material';
import { CreateGroupInput } from '@/lib/validations';

const TimeCell = styled(TableCell)<{ selected?: boolean; isDragging?: boolean }>(({ theme, selected, isDragging }) => ({
  padding: '2px',
  width: '28px',
  height: '28px',
  minWidth: '28px',
  cursor: 'pointer',
  border: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  backgroundColor: selected ? theme.palette.primary.main : 'transparent',
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  fontSize: '0.65rem',
  transition: 'all 0.2s ease',
  position: 'relative',
  '&:hover': {
    backgroundColor: selected 
      ? theme.palette.primary.dark 
      : theme.palette.action.hover,
  },
  // 觸控裝置優化
  '&:active': {
    backgroundColor: selected 
      ? theme.palette.primary.dark 
      : theme.palette.action.selected,
    transform: isDragging ? 'none' : 'scale(0.95)', // 拖拽時不要縮放效果
  },
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  WebkitTouchCallout: 'none',
  WebkitTapHighlightColor: 'transparent',
  // 桌面設備保持正常觸控行為
  touchAction: 'auto',
  // 增加觸控目標大小
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-4px',
    left: '-4px',
    right: '-4px',
    bottom: '-4px',
    zIndex: -1,
  },
  '@media (max-width: 768px)': {
    // 手機設備才禁用觸控手勢
    touchAction: 'none',
    overscrollBehavior: 'contain',
    WebkitOverflowScrolling: 'touch',
  },
}));

const WEEKDAYS = [
  { key: 'MON', label: '一' },
  { key: 'TUE', label: '二' },
  { key: 'WED', label: '三' },
  { key: 'THU', label: '四' },
  { key: 'FRI', label: '五' },
  { key: 'SAT', label: '六' },
  { key: 'SUN', label: '日' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

// 觸控常數
const TOUCH_THRESHOLD = 8; // 觸控移動閾值（px）
const LONG_PRESS_DURATION = 300; // 長按時間（ms）

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
  const fieldRef = useRef<{ value: string[]; onChange: (value: string[]) => void } | null>(null);

  // 觸控狀態管理
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const [touchMoveCount, setTouchMoveCount] = useState(0);
  const [isLongPress, setIsLongPress] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastProcessedCell = useRef<string | null>(null);

  // 拖拽結束
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 滑鼠離開表格區域
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 切換時間格子狀態
  const toggleTimeSlot = useCallback((day: string, hour: number) => {
    if (!fieldRef.current) return;
    
    const selectedTimes = fieldRef.current.value || [];
    const timeSlotKey = getTimeSlotKey(day, hour);
    const newSelectedTimes = selectedTimes.includes(timeSlotKey)
      ? selectedTimes.filter((time: string) => time !== timeSlotKey)
      : [...selectedTimes, timeSlotKey];
    fieldRef.current.onChange(newSelectedTimes);
  }, []);

  // 統一的拖拽開始邏輯
  const startDrag = useCallback((day: string, hour: number) => {
    if (!fieldRef.current) return;
    
    const selectedTimes = fieldRef.current.value || [];
    const timeSlotKey = getTimeSlotKey(day, hour);
    const isCurrentlySelected = selectedTimes.includes(timeSlotKey);
    
    setIsDragging(true);
    setDragAction(isCurrentlySelected ? 'deselect' : 'select');
    
    // 立即處理當前格子
    toggleTimeSlot(day, hour);
  }, [toggleTimeSlot]);

  // 統一的拖拽過程邏輯
  const processDrag = useCallback((day: string, hour: number) => {
    if (!isDragging || !fieldRef.current) return;
    
    const selectedTimes = fieldRef.current.value || [];
    const timeSlotKey = getTimeSlotKey(day, hour);
    const isCurrentlySelected = selectedTimes.includes(timeSlotKey);
    
    // 根據拖拽動作決定是否要改變狀態
    if (dragAction === 'select' && !isCurrentlySelected) {
      toggleTimeSlot(day, hour);
    } else if (dragAction === 'deselect' && isCurrentlySelected) {
      toggleTimeSlot(day, hour);
    }
  }, [isDragging, dragAction, toggleTimeSlot]);

  // 滑鼠事件
  const handleMouseDown = useCallback((day: string, hour: number, event: React.MouseEvent) => {
    event.preventDefault();
    startDrag(day, hour);
  }, [startDrag]);

  const handleMouseEnter = useCallback((day: string, hour: number) => {
    processDrag(day, hour);
  }, [processDrag]);

  // 改進的觸控事件處理

  // 檢測是否為手機設備
  const isMobileDevice = useCallback(() => {
    return window.innerWidth <= 768 || 'ontouchstart' in window;
  }, []);

  // 1. 觸控開始 - 加入長按檢測
  const handleTouchStart = useCallback((day: string, hour: number, event: React.TouchEvent) => {
    // 只在手機設備上處理觸控事件
    if (!isMobileDevice()) {
      return;
    }

    const touch = event.touches[0];
    
    // 手機設備需要阻止預設行為
    event.preventDefault();
    
    // 記錄起始位置
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setTouchMoveCount(0);
    setIsLongPress(false);
    lastProcessedCell.current = null;
    
    // 設置長按定時器
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      // 長按震動回饋（如果支援）
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      // 開始拖拽
      startDrag(day, hour);
    }, LONG_PRESS_DURATION);
  }, [startDrag, isMobileDevice]);

  // 2. 觸控移動 - 加入滑動檢測
  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    // 只在手機設備上處理
    if (!isMobileDevice() || !touchStartPos) return;
    
    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.y);
    
    setTouchMoveCount(prev => prev + 1);
    
    // 手機設備：阻止預設行為，防止頁面滑動
    event.preventDefault();
    
    // 如果移動距離超過閾值，取消長按
    if ((deltaX > TOUCH_THRESHOLD || deltaY > TOUCH_THRESHOLD) && longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
      
      // 如果不是在拖拽模式，且移動幅度較大，可能是想要滾動
      if (!isDragging && (deltaX > TOUCH_THRESHOLD * 2 || deltaY > TOUCH_THRESHOLD * 2)) {
        // 重置狀態並退出
        setTouchStartPos(null);
        setTouchMoveCount(0);
        return;
      }
    }
    
    // 只有在拖拽模式下才處理格子選取
    if (!isDragging) return;
    
    // 防抖處理：避免在同一個格子上重複觸發
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elementBelow && elementBelow.getAttribute('data-time-slot')) {
      const timeSlotKey = elementBelow.getAttribute('data-time-slot')!;
      
      // 如果是同一個格子，跳過
      if (lastProcessedCell.current === timeSlotKey) {
        return;
      }
      
      lastProcessedCell.current = timeSlotKey;
      const [day, hour] = timeSlotKey.split('_');
      processDrag(day, parseInt(hour));
    }
  }, [touchStartPos, isDragging, processDrag, isMobileDevice]);

  // 3. 觸控結束 - 清理狀態
  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    // 只在手機設備上處理
    if (!isMobileDevice()) return;

    // 清理長按定時器
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    // 如果是短按且沒有拖拽，執行點擊
    if (!isLongPress && touchMoveCount < 3 && !isDragging) {
      const touch = event.changedTouches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (elementBelow && elementBelow.getAttribute('data-time-slot')) {
        const timeSlotKey = elementBelow.getAttribute('data-time-slot')!;
        const [day, hour] = timeSlotKey.split('_');
        toggleTimeSlot(day, parseInt(hour));
      }
    }
    
    // 重置狀態
    setIsDragging(false);
    setTouchStartPos(null);
    setTouchMoveCount(0);
    setIsLongPress(false);
    lastProcessedCell.current = null;
  }, [isLongPress, touchMoveCount, isDragging, toggleTimeSlot, isMobileDevice]);

  // 表格容器的改進
  const handleTableTouchMove = useCallback((event: React.TouchEvent) => {
    // 只在手機設備上處理
    if (!isMobileDevice()) return;

    // 只有在拖拽時才阻止滑動
    if (isDragging) {
      event.preventDefault();
    }
    
    handleTouchMove(event);
  }, [isDragging, handleTouchMove, isMobileDevice]);

  // cleanup effect
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  // 刪除時間標籤
  const handleDeleteTimeSlot = useCallback((timeSlotToDelete: string) => {
    if (!fieldRef.current) return;
    
    const selectedTimes = fieldRef.current.value || [];
    const newSelectedTimes = selectedTimes.filter((time: string) => time !== timeSlotToDelete);
    fieldRef.current.onChange(newSelectedTimes);
  }, []);

  return (
    <Controller
      name="availableTimes"
      control={control}
      render={({ field }) => {
        // 將 field 存到 ref 中供事件處理器使用
        fieldRef.current = field;
        const selectedTimes = field.value || [];

        const renderDesktopView = () => (
          <Box 
            sx={{ 
              position: 'relative',
              touchAction: 'auto',
            }}
          >
            <TableContainer 
              component={Paper} 
              sx={{ 
                maxHeight: 400, 
                overflow: 'auto',
                touchAction: 'auto',
              }}
            >
            <Table 
              ref={tableRef}
              stickyHeader 
              size="small" 
              sx={{
                minWidth: 480,
                touchAction: 'auto',
              }}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchMove={handleTableTouchMove}
              onTouchEnd={handleTouchEnd}
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
                        width: 40, 
                        padding: '8px',
                        fontSize: '0.75rem'
                      }}
                    >
                      {day.label}
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
                      zIndex: 1
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
                          isDragging={isDragging}
                          data-time-slot={timeSlotKey}
                          onMouseDown={(event) => handleMouseDown(day.key, hour, event)}
                          onMouseEnter={() => handleMouseEnter(day.key, hour)}
                          onTouchStart={(event) => handleTouchStart(day.key, hour, event)}
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
          </Box>
        );

        const renderMobileView = () => (
          <Box 
            sx={{ 
              position: 'relative',
              touchAction: 'none',
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {WEEKDAYS.map(day => {
                const daySelectedTimes = selectedTimes.filter(time => time.startsWith(day.key));
                
                return (
                  <Box key={day.key}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        mb: 1,
                        overflow: 'hidden'
                      }}
                    >
                      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            mb: 1, 
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}
                        >
                          星期{day.label} ({daySelectedTimes.length} 時段)
                        </Typography>
                        
                        <Box 
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(6, 1fr)',
                            gap: 0.5,
                            maxWidth: '100%'
                          }}
                          onTouchMove={handleTableTouchMove}
                          onTouchEnd={handleTouchEnd}
                        >
                          {HOURS.map(hour => {
                            const timeSlotKey = getTimeSlotKey(day.key, hour);
                            const isSelected = selectedTimes.includes(timeSlotKey);
                            
                            return (
                              <Box
                                key={timeSlotKey}
                                data-time-slot={timeSlotKey}
                                onMouseDown={(event) => handleMouseDown(day.key, hour, event)}
                                onMouseEnter={() => handleMouseEnter(day.key, hour)}
                                onTouchStart={(event) => handleTouchStart(day.key, hour, event)}
                                sx={{
                                  padding: '4px 2px',
                                  textAlign: 'center',
                                  cursor: 'pointer',
                                  border: 1,
                                  borderColor: 'divider',
                                  borderRadius: 1,
                                  backgroundColor: isSelected 
                                    ? 'primary.main' 
                                    : 'transparent',
                                  color: isSelected 
                                    ? 'primary.contrastText' 
                                    : 'text.primary',
                                  fontSize: '0.65rem',
                                  minHeight: '32px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  transition: 'all 0.2s ease',
                                  userSelect: 'none',
                                  WebkitUserSelect: 'none',
                                  MozUserSelect: 'none',
                                  msUserSelect: 'none',
                                  WebkitTouchCallout: 'none',
                                  WebkitTapHighlightColor: 'transparent',
                                  touchAction: 'none',
                                  '&:active': {
                                    backgroundColor: isSelected 
                                      ? 'primary.dark' 
                                      : 'action.selected',
                                    transform: isDragging ? 'none' : 'scale(0.95)',
                                  },
                                  '&:hover': {
                                    backgroundColor: isSelected 
                                      ? 'primary.dark' 
                                      : 'action.hover',
                                  }
                                }}
                              >
                                <Box sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                                  {hour.toString().padStart(2, '0')}
                                </Box>
                                <Box sx={{ fontSize: '0.6rem', lineHeight: 1 }}>
                                  :00
                                </Box>
                                {isSelected && (
                                  <Box sx={{ fontSize: '0.8rem', lineHeight: 1, mt: 0.25 }}>
                                    ●
                                  </Box>
                                )}
                              </Box>
                            );
                          })}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                );
              })}
            </Box>
          </Box>
        );

        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              可遊戲時間 *
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              點擊或拖拽格子選擇您的可遊戲時間（已選擇 {selectedTimes.length} 個時段）
              <br />
              <Box component="span" sx={{ '@media (max-width: 768px)': { display: 'inline' }, '@media (min-width: 769px)': { display: 'none' } }}>
                手機：長按後拖拽選取多個時段
              </Box>
            </Typography>

            {/* 響應式視圖切換 */}
            <Box sx={{ 
              '@media (min-width: 769px)': { display: 'block' },
              '@media (max-width: 768px)': { display: 'none' }
            }}>
              {renderDesktopView()}
            </Box>
            
            <Box sx={{ 
              '@media (min-width: 769px)': { display: 'none' },
              '@media (max-width: 768px)': { display: 'block' }
            }}>
              {renderMobileView()}
            </Box>

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
                        onDelete={() => handleDeleteTimeSlot(timeSlot)}
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