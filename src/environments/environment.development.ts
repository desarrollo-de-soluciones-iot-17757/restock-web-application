/**
 * Environment configuration for development.
 * Contains API endpoints and settings for local development of the Restock Web Application.
 */
export const environment = {
  production: false,

  // Base API URL
  platformProviderApiBaseUrl: 'http://localhost:3000/api/v1/',

  // Sales Management API
  platformProviderSalesEndpointsPath: 'sales',
};
