'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Alert, Paper, IconButton, Snackbar } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
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
  const { submitError, submitSuccess, isSubmitting, privateKey } = useGroupFormContext();
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyPrivateKey = async () => {
    if (privateKey) {
      await navigator.clipboard.writeText(privateKey);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

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

      {
        submitSuccess && 
          privateKey &&
          (
        <Box sx={{ mb: 2 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography 
              onClick={handleCopyPrivateKey}
              variant="body2" 
              sx={{ 
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                flex: 1
              }}
            >
              <strong>點擊保存密碼：</strong>
                <br></br>
              <strong>{privateKey}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'success.contractString' }}>
              此密碼用於修改、刪除此次建立的組隊請求，請妥善保管！
            </Typography>
          </Alert>
        </Box>
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

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="私鑰已複製到剪貼板"
      />
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

    return { privateKey: result.data.privateKey };
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