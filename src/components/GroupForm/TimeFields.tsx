'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { CreateGroupInput } from '@/lib/validations';

export function StartTimeField() {
  const { control, formState: { errors } } = useFormContext<CreateGroupInput>();

  return (
    <Controller
      name="startTime"
      control={control}
      render={({ field }) => (
        <DateTimePicker
          label="開始時間"
          value={field.value ? dayjs(field.value) : null}
          onChange={(newValue) => {
            field.onChange(newValue?.toISOString() || '');
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors.startTime,
              helperText: errors.startTime?.message || '開始時間是必填的',
            },
          }}
        />
      )}
    />
  );
}

export function EndTimeField() {
  const { control, formState: { errors } } = useFormContext<CreateGroupInput>();

  return (
    <Controller
      name="endTime"
      control={control}
      render={({ field }) => (
        <DateTimePicker
          label="結束時間"
          value={field.value ? dayjs(field.value) : null}
          onChange={(newValue) => {
            field.onChange(newValue?.toISOString() || '');
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors.endTime,
              helperText: errors.endTime?.message || '結束時間是必填的',
            },
          }}
        />
      )}
    />
  );
}