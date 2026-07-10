import React from "react";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos
} from "react-icons/md";
import clsx from "clsx";

import { getPaginationData } from "./Pagination.helpers";
import styles from "./Pagination.module.css";

interface IProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<IProps> = ({
  currentPage,
  totalPages,
  setCurrentPage
}) => {
  const paginationData = getPaginationData(currentPage, totalPages);

  return (
    <div className={styles.container}>
      {/** Render First Page button */}
      {totalPages > 0 && (
        <button
          className={styles.button}
          aria-label="Previous page"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <MdOutlineArrowBackIos />
        </button>
      )}
      {/** Render other page buttons */}
      <div className={styles.buttons}>
        {paginationData.map(item => (
          <button
            key={item.page}
            className={clsx(styles.button, {
              [styles.currentPage]: currentPage === item.page
            })}
            onClick={() => setCurrentPage(item.page)}
            aria-label={`Select page ${item.page}`}
            disabled={currentPage === item.page}
          >
            {item.isSpread ? "..." : item.page}
          </button>
        ))}
      </div>
      {/** Render Last Page button */}
      {totalPages > 0 && (
        <button
          className={styles.button}
          aria-label="Next page"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <MdOutlineArrowForwardIos />
        </button>
      )}
    </div>
  );
};

export const MemoPagination = React.memo(Pagination);
