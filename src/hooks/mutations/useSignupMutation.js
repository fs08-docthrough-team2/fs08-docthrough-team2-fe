import api from '@/libs/api.js';
import { useAppMutation } from '@/hooks/shared/queryHooks.js';
import { setAccessToken } from '@/libs/token.js';

const requestSignup = async (formData) => {
  const response = await api.post('/auth/signup', formData);
  return response.data;
};

export const useSignupMutation = (onSuccess) => {
  return useAppMutation(requestSignup, {
    onSuccess: (data) => {
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
      }
      onSuccess?.();
    },
  });
};
