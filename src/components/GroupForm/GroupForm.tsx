'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { Box, Typography, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { CreateGroupInput } from '@/lib/validations';
import GroupFormProvider, { useGroupFormContext } from './GroupFormProvider';
import JobField from './JobField';
import LevelField from './LevelField';
import MapField from './MapField';
import WeeklyTimeGridField from './WeeklyTimeGridField';
import { GameIdField, DiscordIdField } from './ContactFields';
import SubmitButton from './SubmitButton';
import DoneAllIcon from '@mui/icons-material/DoneAll';

interface GroupFormProps {
  onSuccess?: () => void;
}

function GroupFormContent() {
  const router = useRouter();
  const { submitError, submitSuccess, isSubmitting, privateKey } = useGroupFormContext();
  const [shouldCopy, setShouldCopy] = useState(false);
  const [hadCopied, setHadCopied] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (submitSuccess && privateKey) {
      setDialogOpen(true);
    }
  }, [submitSuccess, privateKey]);

  const handleCopyPrivateKey = async () => {
    if (privateKey) {
      await navigator.clipboard.writeText(privateKey);
      setCopySuccess(true);
      setHadCopied(true);
      setShouldCopy(false);
      setTimeout(() => setCopySuccess(false), 2000);
      setDialogOpen(false);
      await router.push('/groups');
    }
  };

  const handleCloseDialog = () => {
    if (!hadCopied) {
      setShouldCopy(true);
    }
    else {
      setDialogOpen(false);
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

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        keepMounted
      >
        <DialogTitle color="success.dark">
            <DoneAllIcon sx={{ mr: 1 }} />
          建立成功
        </DialogTitle>
        <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
                請妥善保管以下密碼，此密碼用於修改、刪除此次建立的組隊請求：
            </Typography>
            <Box
                onClick={handleCopyPrivateKey}
            >
                <Typography
                    color={shouldCopy ? 'error.main' : 'success.light'}
                    fontFamily='monospace'
                    fontWeight='bold'
                >
                    {privateKey}
                </Typography>
                <Typography variant="body2" color='textSecondary'>
                  點擊複製到剪貼板
                </Typography>
            </Box>
        </DialogContent>
      </Dialog>

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
        message="已複製到剪貼板"
      />
    </Box>
  );
}

export default function GroupForm({ onSuccess }: GroupFormProps) {

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