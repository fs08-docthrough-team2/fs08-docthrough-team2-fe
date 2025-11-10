import styles from '@/styles/components/atoms/Chips/CardStatusChip.module.scss';
import ic_person from '/public/icon/chip/ic_person.svg';
import ic_deadline from '/public/icon/chip/ic_deadline.svg';
import Image from 'next/image';
import clsx from 'clsx';

const statusMap = {
  ISCOMPLETED: {
    label: '모집이 완료된 상태에요',
    icon: ic_person,
  },
  ISCLOSED: {
    label: '챌린지가 마감되었어요',
    icon: ic_deadline,
  },
};

/*
status: ISCOMPLETED | ISCLOSED
*/
const CardStatusChip = ({ status = 'ISCOMPLETED' }) => {
  const { label, icon } = statusMap[status];
  const chipClassName = clsx(styles.chip, styles[status]);
  const labelClassName = clsx(styles.label, styles[status]);

  return (
    <div className={chipClassName}>
      <Image src={icon} alt={label} width={16} height={16} />
      <div className={labelClassName}>{label}</div>
    </div>
  );
};

export default CardStatusChip;
