'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { CreateGroupInput } from '@/lib/validations';

export default function MapField() {
  const { control, formState: { errors } } = useFormContext<CreateGroupInput>();

  return (
    <Controller
      name="map"
      control={control}
      render={({ field }) => (
        <FormControl fullWidth error={!!errors.map}>
          <InputLabel id="map-label">地圖</InputLabel>
          <Select
            {...field}
            labelId="map-label"
            label="地圖"
            value={field.value || ''}
          >
            <MenuItem value="DT">DT (Dragon Tower)</MenuItem>
            <MenuItem value="PW">PW (Phoenix Wing)</MenuItem>
            <MenuItem value="CD">CD (Crystal Dungeon)</MenuItem>
          </Select>
          {errors.map && (
            <FormHelperText>
              {errors.map.message || '地圖是必填的'}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}