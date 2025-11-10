import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

dayjs.tz.setDefault('Asia/Seoul');

export const formatKoreanDate = (dateString) => {
  if (!dateString || dateString.trim() === '') {
    return '';
  }

  const date = dayjs.tz(dateString).format('YYYY년 MM월 DD일');
  return date;
};

export const formatUTCDate = (dateString) => {
  if (!dateString || dateString.trim() === '') {
    return '';
  }
  const date = dayjs(dateString, 'YY/MM/DD', true);
  if (!date.isValid()) {
    return '';
  }
  return date.toISOString();
};

export const formatYYMMDD = (dateString) => {
  if (!dateString) return '';
  const date = dayjs(dateString);
  return date.isValid() ? date.format('YY/MM/DD') : '';
};

export const formatToKoreanTime = (date) => {
  if (!date) return '';
  return dayjs.utc(date).tz('Asia/Seoul').format('YY/MM/DD HH:mm');
};

export const formatToKoreanHyphenDate = (date) => {
  if (!date) return '';
  return dayjs.utc(date).tz('Asia/Seoul').format('YY-MM-DD');
};
