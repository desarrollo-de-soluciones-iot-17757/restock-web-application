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

  salesAPI: {
    salesBaseUrl: 'https://restock-api-sales.free.beeceptor.com',
  },

  // Sales Management API
  platformProviderSalesEndpointsPath: 'sales',

  profilesApi: {
    baseUrl: 'https://restock-api-profiles.free.beeceptor.com',
    fallbackBaseUrl: 'https://profiles-restock-api.free.beeceptor.com',
  },

  // IAM & Profiles
  platformProviderApiBaseUrl: 'http://localhost:8080/api/v1',
  platformProviderSignUpEndpointPath: 'auth/sign-up',
  platformProviderRegistrationBusinessDetailsEndpointPath: 'businesses',
  platformProviderRegistrationPersonalProfileEndpointPath: 'profiles',

  //CUSTOM SUPPLY
  platformProviderCustomSuppliesEndpointPath: 'custom-supplies',
  
  //SUPPLIES
  platformProviderSuppliesEndpointPath: 'supplies',

  // IAM
  //https://restock-api-iam-login.free.beeceptor.com
  platformProviderIamApiBaseUrlForSignIn: 'https://restock-api-iam-login.free.beeceptor.com',
  platformProviderSignInEndpointPath: 'auth/sign-in',
  platformProviderForgotPasswordEndpointPath: 'auth/forgot-password',
};

