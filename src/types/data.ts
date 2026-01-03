export type Pagination = {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
};

export type StrapiCollectionResponse<T> = {
  data: T[];
  meta?: {
    pagination?: Pagination;
  };
};
