export class PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;

  constructor(data: T[], totalCount: number, page: number, size: number, totalPages: number) {
    this.data = data;
    this.totalCount = totalCount;
    this.page = page;
    this.size = size;
    this.totalPages = totalPages;
  }
}
