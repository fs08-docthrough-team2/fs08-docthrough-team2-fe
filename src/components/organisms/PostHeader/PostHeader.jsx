import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/atoms/Button/Button';

import img_logo from '/public/image/img_logo.svg';
import styles from '@/styles/components/organisms/PostHeader/PostHeader.module.scss';

const PostHeader = ({
  onQuitClick = () => {},
  onDraftSaveClick = () => {},
  onSubmitClick = () => {},
}) => {
  return (
    <header className={styles.postHeader}>
      <Link href="/">
        <Image src={img_logo} alt="logo" width={120} height={27} />
      </Link>
      <div className={styles.buttonWrapper}>
        <Button variant="tonal" size="sm" icon="quit" children="포기" onClick={onQuitClick} />
        <Button variant="outline" size="md" children="임시저장" onClick={onDraftSaveClick} />
        <Button variant="solid" size="post" children="제출하기" onClick={onSubmitClick} />
      </div>
      <div className={styles.mobileButtonWrapper}>
        <Button variant="tonal" size="sm" icon="quit" children="포기" onClick={onQuitClick} />
        <Button
          variant="outline"
          size="postMobile"
          children="임시저장"
          onClick={onDraftSaveClick}
        />
        <Button variant="solid" size="post" children="제출하기" onClick={onSubmitClick} />
      </div>
    </header>
  );
};

export default PostHeader;
