'use client';

import { Button, CircularProgress } from '@mui/material';

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export default function SubmitButton({ isSubmitting }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      disabled={isSubmitting}
      fullWidth
      sx={{ mt: 2 }}
    >
      {isSubmitting ? (
        <>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          建立中...
        </>
      ) : (
        '建立組隊'
      )}
    </Button>
  );
}