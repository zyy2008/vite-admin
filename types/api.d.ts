declare interface ResultNoData {
  code?: "S-00001" | string;
  msg?: string;
}
declare interface Result {
  code?: string;
  data?: string | object | null;
  msg?: string;
}

declare interface Query {
  pageNumber?: number;
  pageSize?: number;
}

declare interface ResultDataByPage {
  current?: number;
  orders?: any[];
  pages?: number;
  records: any[];
  searchCount?: boolean;
  size?: number;
  total?: number;
}

declare interface QueryAll<T extends any, U extends any> {
  data?: T;
  params?: U;
}
