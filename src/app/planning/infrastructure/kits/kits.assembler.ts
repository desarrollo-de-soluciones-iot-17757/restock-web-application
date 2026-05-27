import { Kit } from '../../domain/model/kit.entity';
import { KitItem } from '../../domain/model/kit-item.entity';
import { KitResponse } from './kits.response';

/**
 * Mapper dedicated to translating infrastructure query contracts into Domain entities.
 */
export class KitAssembler {
  /**
   * Maps an API KitResponse into a complete Domain Kit aggregate root,
   * initializing all its nested KitItem entities.
   */
  static toEntityFromResponse(response: KitResponse): Kit {
    // 1. Mapeamos los sub-elementos de Beeceptor usando el constructor de KitItem
    const domainItems = response.items.map(
      (item) =>
        new KitItem({
          id: item.id,
          name: item.name,
          sku: item.sku,
          price: item.price,
          quantity: item.quantity,
        }),
    );

    // 2. Construimos el Agregado Raíz (Kit) de nuestro Dominio
    return new Kit({
      id: response.id,
      name: response.name,
      // CONTROL DE SEGURIDAD: Como los kits de tu JSON real no traen sku en la raíz,
      // usamos el "id" como respaldo (fallback) para evitar que rompa con undefined.
      sku: response.sku || response.id,
      price: response.price,
      description: response.description,
      imageUrl: response.imageUrl,
      status: response.status.toUpperCase() as any, // Asegura compatibilidad con 'Active' -> 'ACTIVE'
      items: domainItems,
    });
  }
}
