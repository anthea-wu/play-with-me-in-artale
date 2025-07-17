'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  Typography
} from '@mui/material';

interface DeleteGroupDialogProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  onSuccess: () => void;
}

export function DeleteGroupDialog({ open, onClose, groupId, onSuccess }: DeleteGroupDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState('');

  const handleClose = () => {
    setPrivateKey('');
    setError(null);
    onClose();
  };

  const handleDeleteGroup = async () => {
    if (!privateKey) {
      setError('請輸入私鑰');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ privateKey }),
      });

      if (response.ok) {
        onSuccess();
        handleClose();
      } else {
        const result = await response.json();
        setError(result.error || '刪除組隊失敗');
      }
    } catch {
      setError('刪除組隊時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        刪除組隊請求
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            請輸入您在創建組隊時獲得的私鑰來確認刪除：
          </Typography>
          
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>注意：</strong>刪除後無法恢復，請確認您真的要刪除此組隊請求。
            </Typography>
          </Alert>

          <TextField
            label="私鑰"
            fullWidth
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="請輸入您的私鑰"
            type="password"
            error={!!error && !privateKey}
            helperText={!!error && !privateKey ? '請輸入私鑰' : ''}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          取消
        </Button>
        
        <Button
          onClick={handleDeleteGroup}
          disabled={loading || !privateKey}
          color="error"
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? '刪除中...' : '確認刪除'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}