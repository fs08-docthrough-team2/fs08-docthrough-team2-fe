import styles from '@/styles/components/organisms/PostHeader/PostHeader.module.scss';
import Image from 'next/image';

import img_logo from '/public/image/img_logo.svg';
import Button from '@/components/atoms/Button/Button';
import Link from 'next/link';

const PostHeader = () => {
  return (
    <header className={styles.postHeader}>
      <Link href="/">
        <Image src={img_logo} alt="logo" width={120} height={27} />
      </Link>
      <div className={styles.buttonWrapper}>
        <Button variant="tonal" size="sm" icon="quit" children="포기" />
        <Button variant="outline" size="md" children="임시저장" />
        <Button variant="solid" size="post" children="제출하기" />
      </div>
      <div className={styles.mobileButtonWrapper}>
        <Button variant="tonal" size="sm" icon="quit" children="포기" />
        <Button variant="outline" size="postMobile" children="임시저장" />
        <Button variant="solid" size="post" children="제출하기" />
      </div>
    </header>
  );
};

export default PostHeader;
