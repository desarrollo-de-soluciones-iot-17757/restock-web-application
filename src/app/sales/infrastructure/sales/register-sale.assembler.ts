import { RegisterSaleCommand } from '../../domain/model/register-sale.command';
import { RegisterSaleRequest } from './register-sale.request';
import { RegisterSaleResource, RegisterSaleResponse } from './register-sale.response';

/**
 * Assembler class responsible for converting between domain models, request objects, and response objects related to registering sales.
 */
export class RegisterSaleAssembler {

  /**
   * Converts a RegisterSaleResponse object to a RegisterSaleResource object.
   * @param response - The RegisterSaleResponse object to be converted.
   * @returns The RegisterSaleResource object created from the RegisterSaleResponse.
   */
  toResourceFromResource(response: RegisterSaleResponse) : RegisterSaleResource {
    return {
      id: response.id,
      saleId: response.saleId,
      branchId: response.branchId,
      customerName: response.customerName,
      registeredByUserId: response.registeredByUserId,
      currencyCode: response.currencyCode,
      currencySymbol: response.currencySymbol
    } as RegisterSaleResource;
  }


  /**
   * Converts a RegisterSaleCommand object to a RegisterSaleRequest object.
   * @param command - The RegisterSaleCommand object to be converted.
   * @returns The RegisterSaleRequest object created from the RegisterSaleCommand.
   */
  toRequestFromCommand(command: RegisterSaleCommand) : RegisterSaleRequest {
    return {
      businessId: command.businessId,
      branchId: command.branchId,
      customerName: command.customerName.name,
      registeredByUserId: command.registeredByUserId,
      currencyCode: command.currency.code,
      currencySymbol: command.currency.symbol
    } as RegisterSaleRequest;
  }
}
