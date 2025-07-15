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
      render={({ field }) => (
        <TextField
          {...field}
          label="等級"
          type="number"
          inputProps={{ min: 70 }}
          error={!!errors.level}
          helperText={errors.level?.message || '等級是必填的'}
          fullWidth
        />
      )}
    />
  );
}