import { useMutation } from '@tanstack/react-query';

export const useAppMutation = (mutationFn, options = {}) => {
  const mutation = useMutation({
    mutationFn,
    ...options,
  });
  return mutation;
};
