'use client';

import styles from '@/styles/components/atoms/Button/Button.module.scss';
import clsx from 'clsx';
import Image from 'next/image';

import ic_quit from '/public/icon/ic_quit.svg';
import ic_arrow_right from '/public/icon/ic_arrow_right.svg';
import ic_click from '/public/icon/ic_click.svg';
import ic_document from '/public/icon/ic_document.svg';
import ic_plus from '/public/icon/ic_plus.svg';

/*
variant: tonal | outline | transparent | solid | filled
size: xs | sm | md | lg | pill
icon: quit | arrowRight | click | document | plus
*/
const Button = ({
  children,
  variant = 'tonal',
  size = 'md',
  icon = null,
  disabled = false,
  onClick = () => {},
}) => {
  let iconImg = null;
  switch (icon) {
    case 'quit':
      iconImg = <Image src={ic_quit} alt="quit" width={24} height={24} />;
      break;
    case 'challenge':
      iconImg = <Image src={ic_arrow_right} alt="challenge" width={24} height={24} />;
      break;
    case 'link':
      iconImg = <Image src={ic_click} alt="link" width={24} height={24} />;
      break;
    case 'document':
      iconImg = <Image src={ic_document} alt="document" width={24} height={24} />;
      break;
    case 'newChallenge':
      iconImg = <Image src={ic_plus} alt="newChallenge" width={16} height={16} />;
      break;
    default:
      break;
  }

  const className = clsx(styles.button, styles[variant], styles[size], {
    [styles.disabled]: disabled,
  });

  return (
    <div>
      <button className={className} onClick={onClick} disabled={disabled}>
        <div className={styles.btnContent}>{children}</div>
        {iconImg}
      </button>
    </div>
  );
};

export default Button;
