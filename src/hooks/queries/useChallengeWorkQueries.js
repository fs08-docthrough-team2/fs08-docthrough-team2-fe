import { useQuery } from '@tanstack/react-query';
import {
  getChallengeWorkDetail,
  getChallengeWorkDraftList,
  getChallengeWorkDraftDetail,
} from '@/services/challengeWork.service.js';

export const useGetChallengeWorkDetail = (attendId) => {
  return useQuery({
    queryKey: ['challenge-work-detail', attendId],
    queryFn: () => getChallengeWorkDetail(attendId),
  });
};

export const useGetChallengeWorkDraftList = () => {
  return useQuery({
    queryKey: ['challenge-work-draft-list'],
    queryFn: () => getChallengeWorkDraftList(),
  });
};

export const useGetChallengeWorkDraftDetail = (attendId, options = {}) => {
  return useQuery({
    queryKey: ['challenge-work-draft-detail', attendId],
    queryFn: () => getChallengeWorkDraftDetail(attendId),
    enabled: !!attendId,
    ...options,
  });
};
