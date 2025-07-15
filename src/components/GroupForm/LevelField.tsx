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
          onKeyDown={(e) => {
            if (!/[0-9]/.test(e.key) && 
                !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          label="等級"
          type="number"
          inputProps={{ min: 70 }}
          error={!!errors.level}
          helperText={errors.level?.message ?? ''}
          fullWidth
        />
      )}
    />
  );
}