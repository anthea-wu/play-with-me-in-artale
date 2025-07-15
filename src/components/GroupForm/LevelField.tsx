'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import { CreateGroupInput } from '@/lib/validations';

export default function LevelField() {
  const { control, formState: { errors } } = useFormContext<CreateGroupInput>();

  return (
    <Controller
      name="level"
      control={control}
      render={({ field: { onChange, value, ...field } }) => (
        <TextField
          {...field}
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : 0)}
          label="等級"
          inputMode="numeric"
          error={!!errors.level}
          helperText={errors.level?.message ?? ''}
          fullWidth
        />
      )}
    />
  );
}