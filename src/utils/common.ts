import dayjs from 'dayjs';

export const dateStringToNumber = (value: string) => new Date(value).getTime();

export const getDateHourAndMinute = (time: number | null) => {
  if (time === null) {
    return '';
  }
  return dayjs(time).format('HH:mm');
};
