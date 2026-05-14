import { KitResource, KitsResponse } from './kits.response';
import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { Kit } from '../../domain/model/kit.entity';
import { KitItem } from '../../domain/model/kit-item.entity';

/**
 * Assembler class responsible for converting between domain models, request objects, and response objects related to Kits.
 */
export class KitsAssembler implements BaseAssembler<Kit, KitResource, KitsResponse> {
  /**
   * Maps an array of KitResource objects to an array of Kit entities.
   * @param response - The response object containing an array of KitResource objects.
   * @returns An array of Kit entities created from the KitResource objects.
   */
  toEntitiesFromResponse(response: KitsResponse): Kit[] {
    return response.kits.map((kitResource) => this.toEntityFromResource(kitResource));
  }

  /**
   * Converts a KitResource object to a Kit entity.
   * @param resource - The KitResource object to be converted.
   * @returns The Kit entity created from the KitResource.
   */
  toEntityFromResource(resource: KitResource): Kit {
    return new Kit({
      id: resource.id,
      name: resource.name,
      description: resource.description,
      price: resource.price,
      imageUrl: resource.imageUrl,
      status: resource.status,
      items: resource.items.map(
        (item) =>
          new KitItem({
            productId: item.productId,
            productName: item.productName,
            sku: item.sku,
            quantityPerKit: item.quantityPerKit,
            currentStock: item.currentStock,
          }),
      ),
    });
  }

  /**
   * Converts a Kit entity to a KitResource object.
   * @param entity - The Kit entity to be converted.
   * @returns The KitResource object created from the Kit entity.
   */
  toResourceFromEntity(entity: Kit): KitResource {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      imageUrl: entity.imageUrl,
      status: entity.status,
      items: entity.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        quantityPerKit: item.quantityPerKit,
        currentStock: item.currentStock,
      })),
    } as KitResource; // Añadido el cast explícito como hace tu compañero
  }
}
