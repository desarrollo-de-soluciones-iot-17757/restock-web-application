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

  profilesApi: {
    baseUrl: 'https://restock-api-profiles.free.beeceptor.com',
  },


  // IAM & Profiles 
  platformProviderIamApiBaseUrl: 'https://restock-api-iam.free.beeceptor.com',
  platformProviderSignUpEndpointPath: 'auth/sign-up',
  platformProviderRegistrationBusinessDetailsEndpointPath: 'businesses',
  platformProviderRegistrationPersonalProfileEndpointPath: 'profiles',

};

