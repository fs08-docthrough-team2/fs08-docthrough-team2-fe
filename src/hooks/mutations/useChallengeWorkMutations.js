import { useMutation } from '@tanstack/react-query';
import {
  createChallengeWork,
  createChallengeWorkDraft,
  LikeToggle,
  deleteChallengeWork,
  updateChallengeWork,
} from '@/services/challengeWork.service.js';

export const useCreateChallengeWorkMutation = () => {
  return useMutation({
    mutationFn: createChallengeWork,
  });
};

export const useCreateChallengeWorkDraftMutation = () => {
  return useMutation({
    mutationFn: createChallengeWorkDraft,
  });
};

export const useUpdateChallengeWorkMutation = () => {
  return useMutation({
    mutationFn: updateChallengeWork,
  });
};

export const useLikeToggleMutation = () => {
  return useMutation({
    mutationFn: LikeToggle,
  });
};

export const useDeleteChallengeWorkMutation = () => {
  return useMutation({
    mutationFn: deleteChallengeWork,
  });
};
