const getPaginationData = (
  currentPage: number,
  totalPages: number
): { page: number; isSpread?: boolean }[] => {
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, index) => ({
      page: index + 1
    }));
  }

  if (currentPage <= 5) {
    return [
      ...Array.from({ length: 7 }, (_, index) => ({ page: index + 1 })),
      { page: 8, isSpread: true },
      { page: totalPages }
    ];
  }

  if (currentPage >= totalPages - 4) {
    return [
      { page: 1 },
      { page: totalPages - 7, isSpread: true },
      ...Array.from({ length: 7 }, (_, index) => ({
        page: totalPages - index
      })).reverse()
    ];
  }

  return [
    { page: 1 },
    { page: currentPage - 3, isSpread: true },
    { page: currentPage - 2 },
    { page: currentPage - 1 },
    { page: currentPage },
    { page: currentPage + 1 },
    { page: currentPage + 2 },
    { page: currentPage + 3, isSpread: true },
    { page: totalPages }
  ];
};

export { getPaginationData };
