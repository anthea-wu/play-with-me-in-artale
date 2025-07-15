'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { CreateGroupInput } from '@/lib/validations';

export default function JobField() {
  const { control, formState: { errors } } = useFormContext<CreateGroupInput>();

  return (
    <Controller
      name="job"
      control={control}
      render={({ field }) => (
        <FormControl fullWidth error={!!errors.job}>
          <InputLabel id="job-label">職業</InputLabel>
          <Select
            {...field}
            labelId="job-label"
            label="職業"
            value={field.value || ''}
          >
            <MenuItem value="龍騎士">龍騎士</MenuItem>
            <MenuItem value="祭司">祭司</MenuItem>
          </Select>
          {errors.job && (
            <FormHelperText>
              {errors.job.message || '職業是必填的'}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}