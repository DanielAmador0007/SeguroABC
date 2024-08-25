import { Seguro } from "./Seguro";

export interface PaginatedResponse {
    seguros: Seguro[];
    totalCount: number;
  }
  