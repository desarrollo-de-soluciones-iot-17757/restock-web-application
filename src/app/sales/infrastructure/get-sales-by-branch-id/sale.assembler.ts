import { SaleResource, SalesResponse } from './sale.response';
import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { Sale } from '../../domain/model/sale.entity';
import { Currency } from '../../../shared/domain/model/currency.entity';
import { SaleTotal } from '../../domain/model/sale-total.entity';
import { SaleStatus } from '../../domain/model/sale-status.enum';
import { Customer } from '../../domain/model/customer.entity';

/**
 * Assembler class responsible for converting between domain models, request objects, and response objects related to get-sale-by-branch-id.
 */
export class SaleAssembler implements BaseAssembler<Sale, SaleResource, SalesResponse> {

  /**
   * Maps an array of SaleResource objects to an array of Sale entities.
   * @param response - The response object containing an array of SaleResource objects.
   * @returns An array of Sale entities created from the SaleResource objects.
   */
  toEntitiesFromResponse(response: SalesResponse): Sale[] {
    return response.sales.map((saleResource) => this.toEntityFromResource(saleResource));
  }

  /**
   * Converts a SaleResource object to a Sale entity.
   * @param resource - The SaleResource object to be converted.
   * @returns The Sale entity created from the SaleResource.
   */
  toEntityFromResource(resource: SaleResource): Sale {
    return new Sale({
      id: resource.id,
      businessId: resource.businessId,
      branchId: resource.branchId,
      registeredByUserId: resource.registeredByUserId,
      customer: new Customer({
        name: resource.customerName,
      }),
      currency: new Currency({
        code: resource.currency,
      }),
      saleItems: [],
      additionalSupplies: [],
      saleTotal: new SaleTotal({
        subTotal: resource.subtotal,
        tax: resource.tax,
        total: resource.total,
      }),
      saleStatus: resource.status as SaleStatus,
      date: new Date(resource.saleDate),
    });
  }

  /**
   * Converts a Sale entity to a SaleResource object.
   * @param entity - The Sale entity to be converted.
   * @returns The SaleResource object created from the Sale entity.
   */
  toResourceFromEntity(entity: Sale): SaleResource {
    return {
      id: entity.id,
      businessId: entity.businessId,
      branchId: entity.branchId,
      registeredByUserId: entity.registeredByUserId,
      customerName: entity.customer.name,
      currency: entity.currency.code,
      subtotal: entity.saleTotal.subTotal,
      tax: entity.saleTotal.tax,
      total: entity.saleTotal.total,
      status: entity.saleStatus,
      saleDate: entity.date.toISOString(),
    } as SaleResource;
  }
}
