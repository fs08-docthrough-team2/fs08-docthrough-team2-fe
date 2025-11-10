import api from '@/libs/api.js';

export const getProfile = async () => {
  const res = await api.get('/user/my');
  return res.data;
};
