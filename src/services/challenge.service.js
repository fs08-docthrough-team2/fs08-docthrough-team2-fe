// mutation을 위한 api
import api from '@/libs/api.js';

export const createChallenge = async (payload) => {
  const response = await api.post('/challenge/create', payload);
  return response.data;
};
