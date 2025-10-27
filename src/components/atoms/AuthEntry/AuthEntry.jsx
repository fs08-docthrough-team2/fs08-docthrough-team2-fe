import styles from '@/styles/components/atoms/AuthEntry/AuthEntry.module.scss';
import Link from 'next/link';

const entryMap = {
  signup: {
    title: '회원이 아니신가요?',
    link: {
      text: '회원가입하기',
      href: '/auth/signup',
    },
  },
  login: {
    title: '회원이신가요?',
    link: {
      text: '로그인하기',
      href: '/auth/login',
    },
  },
};

const AuthEntry = ({ type = 'signup' }) => {
  const { title, link } = entryMap[type];
  return (
    <div className={styles.authEntry}>
      <div className={styles.title}>{title}</div>
      <Link href={link.href} className={styles.link}>
        {link.text}
      </Link>
    </div>
  );
};

export default AuthEntry;
