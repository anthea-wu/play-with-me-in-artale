'use client';

import {ReactNode, createContext, useContext, useState} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateGroupSchema, CreateGroupInput } from '@/lib/validations';

interface GroupFormContextType {
  submitError: string | null;
  submitSuccess: boolean;
  isSubmitting: boolean;
  privateKey: string | null;
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
  onSubmit: (data: CreateGroupInput) => Promise<{ privateKey: string }>;
  onSuccess?: () => void;
}

export default function GroupFormProvider({ children, onSubmit, onSuccess }: GroupFormProviderProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  const methods = useForm<CreateGroupInput>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      level: 70,
      gameId: '',
      discordId: '',
      availableTimes: [],
    }
  });

  const handleSubmit = async (data: CreateGroupInput) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const result = await onSubmit(data);
      setPrivateKey(result.privateKey);
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
    <GroupFormContext.Provider value={{ submitError, submitSuccess, isSubmitting, privateKey }}>
      <FormProvider {...methods}>
        <form onSubmit={(e) => { e.preventDefault(); methods.handleSubmit(handleSubmit)(e); }}>
          {children}
        </form>
      </FormProvider>
    </GroupFormContext.Provider>
  );
}