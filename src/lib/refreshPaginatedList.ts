/** Refetch once after CRUD — avoids setCurrentPage + explicit fetch double-call. */
export const refreshPaginatedList = ({
  currentPage,
  targetPage = 1,
  setCurrentPage,
  refetch,
}: {
  currentPage: number;
  targetPage?: number;
  setCurrentPage: (page: number) => void;
  refetch: () => void;
}) => {
  if (currentPage === targetPage) {
    refetch();
  } else {
    setCurrentPage(targetPage);
  }
};
