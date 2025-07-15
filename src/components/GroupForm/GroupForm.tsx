'use client';

import { useRouter } from 'next/navigation';
import { Box, Typography, Alert } from '@mui/material';
import { CreateGroupInput } from '@/lib/validations';
import GroupFormProvider, { useGroupFormContext } from './GroupFormProvider';
import JobField from './JobField';
import LevelField from './LevelField';
import MapField from './MapField';
import WeeklyTimeGridField from './WeeklyTimeGridField';
import { GameIdField, DiscordIdField } from './ContactFields';
import SubmitButton from './SubmitButton';

interface GroupFormProps {
  onSuccess?: () => void;
}

function GroupFormContent() {
  const { submitError, submitSuccess, isSubmitting } = useGroupFormContext();

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        建立組隊請求
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          組隊請求已成功建立！3秒後將自動跳轉到組隊列表...
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <JobField />
        <LevelField />
        <MapField />
        <WeeklyTimeGridField />
        <GameIdField />
        <DiscordIdField />
        <SubmitButton isSubmitting={isSubmitting} />
      </Box>
    </Box>
  );
}

export default function GroupForm({ onSuccess }: GroupFormProps) {
  const router = useRouter();

  const handleSubmit = async (data: CreateGroupInput) => {
    const response = await fetch('/api/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create group');
    }

    // 3秒後導航到組隊列表
    setTimeout(() => {
      router.push('/groups');
    }, 3000);
  };

  const handleSuccess = () => {
    onSuccess?.();
  };

  return (
    <GroupFormProvider onSubmit={handleSubmit} onSuccess={handleSuccess}>
      <GroupFormContent />
    </GroupFormProvider>
  );
}