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

      {submitSuccess && privateKey && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            組隊請求已成功建立！3秒後將自動跳轉到組隊列表...
          </Alert>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>重要！請保存您的私鑰：</strong>
            </Typography>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                bgcolor: 'grey.100', 
                display: 'flex', 
                alignItems: 'center',
                gap: 1
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  flex: 1
                }}
              >
                {privateKey}
              </Typography>
              <IconButton 
                onClick={handleCopyPrivateKey}
                size="small"
                title="複製私鑰"
              >
                <ContentCopy />
              </IconButton>
            </Paper>
            <Typography variant="body2" sx={{ mt: 1, color: 'warning.main' }}>
              此私鑰用於修改或刪除您的組隊請求，請妥善保管！
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

    // 3秒後導航到組隊列表
    setTimeout(() => {
      router.push('/groups');
    }, 3000);

    // 返回包含 privateKey 的結果
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