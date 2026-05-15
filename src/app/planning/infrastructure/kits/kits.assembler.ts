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
      items:
        (resource as any).products?.map(
          (item: any) =>
            new KitItem({
              id: item.id.toString(),
              name: item.name,
              sku: item.sku,
              price: item.price,
              quantity: item.quantity,
            }),
        ) || [],
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
      products: entity.items.map((item) => ({
        id: item.productId,
        name: item.productName,
        sku: item.sku,
        price: 0, // Placeholder, puedes agregar precio real
        quantity: item.quantity,
      })),
    } as any; // Cast to any to match db.json structure
  }
}
