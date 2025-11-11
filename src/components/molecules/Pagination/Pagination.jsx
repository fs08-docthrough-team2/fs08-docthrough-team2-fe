import styles from '@/styles/components/molecules/Pagination/Pagination.module.scss';
import clsx from 'clsx';

import Image from 'next/image';
import ic_arrow_left from '/public/icon/pagination/ic_arrow_left.svg';
import ic_arrow_left_disabled from '/public/icon/pagination/ic_arrow_left_disabled.svg';
import ic_arrow_right from '/public/icon/pagination/ic_arrow_right.svg';
import ic_arrow_right_disabled from '/public/icon/pagination/ic_arrow_right_disabled.svg';

const getPageNumbers = (page, total, max) => {
  const half = Math.floor(max / 2);
  let first = Math.max(1, page - half);
  let last = Math.min(total, first + max - 1);
  first = Math.max(1, last - max + 1);

  const pageNumbers = [];
  for (let i = first; i <= last; i++) {
    pageNumbers.push(i);
  }
  return pageNumbers;
};

const Pagination = ({ currentPage = 1, totalPages = 5, onPageChange = () => {}, maxPages = 5 }) => {
  const pageNumbers = getPageNumbers(currentPage, totalPages, maxPages);

  const moveToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) return;
    onPageChange(nextPage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={clsx(styles.button, styles.arrowButton)}
        onClick={() => moveToPage(currentPage - 1)}
      >
        {currentPage > 1 ? (
          <Image src={ic_arrow_left} alt="prev" width={40} height={40} />
        ) : (
          <Image src={ic_arrow_left_disabled} alt="prev" width={40} height={40} />
        )}
      </button>

      <div className={styles.pageNumbers}>
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => moveToPage(page)}
            className={clsx(styles.button, page === currentPage && styles.active)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={clsx(styles.button, styles.arrowButton)}
        onClick={() => moveToPage(currentPage + 1)}
      >
        {currentPage < totalPages ? (
          <Image src={ic_arrow_right} alt="next" width={40} height={40} />
        ) : (
          <Image src={ic_arrow_right_disabled} alt="next" width={40} height={40} />
        )}
      </button>
    </div>
  );
};

export default Pagination;
