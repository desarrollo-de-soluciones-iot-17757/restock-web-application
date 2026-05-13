/**
 * Environment configuration for production.
 * Contains API endpoints and settings for production deployment of the Restock Web Application.
 */
export const environment = {
  production: true,

  // Base API URL
  platformProviderApiBaseUrl: 'http://localhost:3000/api/v1/',

  // Sales Management API
  platformProviderSalesEndpointsPath: 'sales',
};
