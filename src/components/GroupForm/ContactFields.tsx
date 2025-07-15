'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import { CreateGroupInput } from '@/lib/validations';

export function GameIdField() {
  const { control, formState: { errors } } = useFormContext<CreateGroupInput>();

  return (
    <Controller
      name="gameId"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="遊戲 ID"
          placeholder="請輸入您的遊戲 ID"
          error={!!errors.gameId}
          helperText={errors.gameId?.message || '遊戲 ID 是必填的'}
          fullWidth
        />
      )}
    />
  );
}

export function DiscordIdField() {
  const { control, formState: { errors } } = useFormContext<CreateGroupInput>();

  return (
    <Controller
      name="discordId"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Discord ID (選填)"
          placeholder="例如: username#1234"
          error={!!errors.discordId}
          helperText={errors.discordId?.message}
          fullWidth
        />
      )}
    />
  );
}