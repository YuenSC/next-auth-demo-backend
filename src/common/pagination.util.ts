export const generatePaginationResponse = <T>(
  [items, totalCount]: [T[], number],
  { limit, page }: { page: number; limit: number },
) => {
  return {
    items,
    meta: {
      itemCount: items.length,
      totalItems: totalCount,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    },
  };
};
