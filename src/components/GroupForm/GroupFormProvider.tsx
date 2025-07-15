'use client';

import { ReactNode, createContext, useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateGroupSchema, CreateGroupInput } from '@/lib/validations';

interface GroupFormContextType {
  submitError: string | null;
  submitSuccess: boolean;
  isSubmitting: boolean;
}

const GroupFormContext = createContext<GroupFormContextType | null>(null);

export const useGroupFormContext = () => {
  const context = useContext(GroupFormContext);
  if (!context) {
    throw new Error('useGroupFormContext must be used within GroupFormProvider');
  }
  return context;
};

interface GroupFormProviderProps {
  children: ReactNode;
  onSubmit: (data: CreateGroupInput) => Promise<void>;
  onSuccess?: () => void;
}

export default function GroupFormProvider({ children, onSubmit, onSuccess }: GroupFormProviderProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<CreateGroupInput>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      level: 70,
    }
  });

  const handleSubmit = async (data: CreateGroupInput) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await onSubmit(data);
      setSubmitSuccess(true);
      methods.reset();
      onSuccess?.();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '建立組隊失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GroupFormContext.Provider value={{ submitError, submitSuccess, isSubmitting }}>
      <FormProvider {...methods}>
        <form onSubmit={(e) => { e.preventDefault(); methods.handleSubmit(handleSubmit)(e); }}>
          {children}
        </form>
      </FormProvider>
    </GroupFormContext.Provider>
  );
}