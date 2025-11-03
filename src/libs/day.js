import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

dayjs.tz.setDefault('Asia/Seoul');

export const formatKoreanDate = (dateString) => {
  const date = dayjs.tz(dateString).format('YYYY년 MM월 DD일');
  return date;
};

export const formatUTCDate = (dateString) => {
  const UTC = dayjs(dateString, 'YY/MM/DD').toISOString();
  return UTC;
};
