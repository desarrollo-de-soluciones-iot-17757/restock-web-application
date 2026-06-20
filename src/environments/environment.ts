export const environment = {
  production: true,

  // Se tiene que cambiar por la url de Render
  // baseUrl: 'https://restock-web-services-iot.onrender.com/api/v1',
  // baseUrl: 'http://localhost:8080/api/v1',
  baseUrl: 'https://restock-api-17757.azurewebsites.net/api/v1/',

  // Authentication
  platformProviderSignUpEndpointPath: 'auth/sign-up',
  platformProviderSignInEndpointPath: 'auth/sign-in',
  platformProviderForgotPasswordEndpointPath: 'auth/forgot-password',

  // Profiles & Businesses
  platformProviderRegistrationPersonalProfileEndpointPath: 'profiles',
  platformProviderRegistrationBusinessDetailsEndpointPath: 'businesses',

  // Supplies
  platformProviderSuppliesEndpointPath: 'supplies',
  platformProviderSupplyCategoriesEndpointPath: 'supplies/categories',
  platformProviderCustomSuppliesEndpointPath: 'custom-supplies',

  // Inventory
  platformProviderBatchesEndpointPath: 'batches',
  platformProviderBranchesEndpointPath: 'branches',

  // Devices & IoT
  platformProviderDevicesEndpointPath: 'devices',
  platformProviderDeviceThresholdsEndpointPath: 'device-thresholds',
  platformProviderTelemetriesEndpointPath: 'telemetries',

  // Products (Kits & Combos in the UI → /products on the backend)
  platformProviderKitsEndpointPath: 'products',
  platformProviderKitsRegisterEndpointPath: 'products',
  platformProviderProductsEndpointPath: 'products',

  // Notifications
  platformProviderNotificationsEndpointPath: 'notifications',
  platformProviderPushSubscriptionsEndpointPath: 'push-subscriptions',

  // Analytics
  platformProviderAnalyticsEndpointPath: 'metrics',
  analyticsStockDiscrepanciesPath: '/custom-supplies/{id}/stock-discrepancies',
  analyticsRecentSalesPath: '/accounts/{accountId}/recent-sales',
  analyticsCriticalProductsPath: '/accounts/{accountId}/critical-products',
  analyticsDefaultStockDiscrepanciesSupplyId: '' as string,

  // Sales
  platformProviderSalesEndpointsPath: 'sales',
};
