/**
 * Local / `ng serve` configuration (see `angular.json` → `development` → `fileReplacements`).
 *
 * When your Beeceptor endpoint exists: set `batchInventoryBaseUrl` and keep the path
 * in sync with your mock rule (or change `batchInventoryHttpPath` to match Beeceptor).
 */
export const environment = {
  production: false,
  resourceApi: {
    // Example (uncomment when ready):
    // batchInventoryBaseUrl: 'https://restock-inventory.free.beeceptor.com',
    batchInventoryBaseUrl: null as string | null,
    batchInventoryHttpPath: '/inventory/batch-inventory',
  },

  // Base API URL
  platformProviderApiBaseUrl: 'http://localhost:3000/api/v1/',

  // Sales Management API
  platformProviderSalesEndpointsPath: 'sales',
  iamApi: {
    signUpUrl: 'https://restock-apifake.free.beeceptor.com/sign-up',
    signUpConflictUrl: 'https://restock-apifake.free.beeceptor.com/sign-up/conflict',
  },
  profilesApi: {
    baseUrl: 'https://restock-api-profiles.free.beeceptor.com',
  },
};
