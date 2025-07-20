'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText, Chip, Box } from '@mui/material';
import { CreateGroupInput } from '@/lib/validations';

export default function MapField() {
  const { control, formState: { errors } } = useFormContext<CreateGroupInput>();

  return (
    <Controller
      name="maps"
      control={control}
      render={({ field }) => (
        <FormControl fullWidth error={!!errors.maps}>
          <InputLabel id="map-label">地圖</InputLabel>
          <Select
            {...field}
            labelId="map-label"
            label="地圖"
            multiple
            value={field.value || []}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            <MenuItem value="DT">DT</MenuItem>
            <MenuItem value="PW">PW</MenuItem>
            <MenuItem value="CD">CD</MenuItem>
          </Select>
            <FormHelperText>
              {errors.maps?.message ?? ''}
            </FormHelperText>
        </FormControl>
      )}
    />
  );
}