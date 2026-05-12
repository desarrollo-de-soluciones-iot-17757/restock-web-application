/**
 * RegisterSaleRequest
 * Contains the necessary information to register a sale, including business and branch identifiers, customer name, user ID of the person registering the sale, and currency details.
 * This interface is used to structure the data sent from the client to the server when registering a new sale.
 */
export interface RegisterSaleRequest {
  businessId: string;
  branchId: string;
  customerName: string;
  registeredByUserId: string;
  currencyCode: string;
  currencySymbol: string;
}
