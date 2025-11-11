import api from '@/libs/api.js';

export const getProfile = async () => {
  const res = await api.get('/user/profile');
  return res.data;
};

export const updateProfile = async ({ nickName }) => {
  const res = await api.patch('/user/my', { nickName });
  return res.data;
};
