'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from '@/styles/components/atoms/Button/ToggleButton.module.scss';

import checkbox_off from '/public/button/checkbox_off.svg';
import checkbox_on from '/public/button/checkbox_on.svg';
import radio_off from '/public/button/radiobox_off.svg';
import radio_on from '/public/button/radiobox_on.svg';

const ToggleButton = ({ checked = false, type = 'checkbox', onClick = () => {} }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleClick = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label className={styles.wrapper}>
      <input
        type="checkbox"
        className={styles.hiddenInput}
        checked={isChecked}
        onChange={handleClick}
      />
      {type === 'checkbox' ? (
        <Image
          src={isChecked ? checkbox_on : checkbox_off}
          alt="checkbox"
          className={styles.image}
          width={24}
          height={24}
          onClick={onClick}
        />
      ) : (
        <Image
          src={isChecked ? radio_on : radio_off}
          alt="radio"
          className={styles.image}
          width={24}
          height={24}
          onClick={onClick}
        />
      )}
    </label>
  );
};

export default ToggleButton;
