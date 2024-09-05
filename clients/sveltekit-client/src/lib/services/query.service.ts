// Package imports
import { QueryClient } from "@tanstack/svelte-query";

let queryClient: QueryClient | null = null;

class QueryService {
  static createQueryClient() {
    queryClient = new QueryClient();
    return queryClient;
  }

  static getQueryClient() {
    return queryClient || this.createQueryClient();
  }
}

export default QueryService;
