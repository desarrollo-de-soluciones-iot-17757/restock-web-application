/**
 * Production defaults. For local dev overrides see `environment.development.ts`
 * (swapped via `fileReplacements` in `angular.json`).
 */
export const environment = {
  production: true,
  resourceApi: {
    /**
     * Beeceptor (or any HTTP) origin **without** trailing slash, e.g.
     * `https://tu-proyecto.free.beeceptor.com`
     *
     * When `null` or blank, inventory uses {@link SimulatedBatchInventoryRepository}.
     */
    batchInventoryBaseUrl: null as string | null,
    /**
     * Path appended to `batchInventoryBaseUrl` (GET). Keep in sync with
     * `BATCH_INVENTORY_API_ENDPOINT` in `resource/infrastructure/batch-inventory-api-endpoint.ts`.
     */
    batchInventoryHttpPath: '/inventory/batch-inventory',
  },

  // Base API URL
  platformProviderApiBaseUrl: 'http://localhost:3000/api/v1/',

  // Sales Management API
  platformProviderSalesEndpointsPath: 'sales',
  iamApi: {
    /**
     * URL for sign-up endpoint. When null, uses simulated repository.
     */
    signUpUrl: null as string | null,
    /**
     * URL for sign-up conflict endpoint (e.g., duplicate email).
     */
    signUpConflictUrl: null as string | null,

    /**
     * URL for sign-in endpoint.
     */
    signInUrl: null as string | null, // O la URL de tu API de login
    /**
     * URL for token validation or session check (opcional pero recomendado)
     */
    validateTokenUrl: null as string | null,
  },
  /**
   * Profiles bounded context: HTTP API origin (no trailing slash).
   * When null, the app uses the development default inside profiles infrastructure.
   */
  profilesApi: {
    /** Replace with your production profiles API origin when available. */
    baseUrl: 'https://restock-fakeapi.free.beeceptor.com',
  },
};
