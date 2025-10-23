import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Seoul');

export const formatKoreanDate = (dateString) => {
  const date = dayjs.tz(dateString).format('YYYY년 MM월 DD일');
  console.log(date);
  return date;
};
