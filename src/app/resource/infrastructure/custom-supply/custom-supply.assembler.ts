import { CustomSupplyResponse } from './custom-supply.response';
import { CustomSupply } from '../../domain/model/custom-supply.entity';
import { Supply } from '../../domain/model/supply.entity';
import { UnitMeasure } from '../../domain/model/unit-measure.entity';

/**
 * Assembles a {@link CustomSupply} domain entity from a backend response.
 *
 * The backend returns two different shapes depending on the endpoint:
 * - POST /custom-supplies  → uses `category` field (flat supply template object)
 * - GET /accounts/{id}/custom-supplies → uses `supply` field (nested supply object)
 *
 * Both fields share the same structure: { id, name, description, category, isPerishable }.
 */
export function assembleCustomSupply(dto: CustomSupplyResponse): CustomSupply {
  // Resolve the supply template from whichever field is present
  const supplyDto = dto.supply ?? dto.category;

  const supply = supplyDto
    ? Supply.create(
        supplyDto.id,
        supplyDto.name,
        supplyDto.description,
        supplyDto.isPerishable,
        supplyDto.category,
      )
    : Supply.empty();

  const unitMeasure = UnitMeasure.create('', dto.unitMeasurement, dto.unitMeasurement);

  return CustomSupply.create(
    dto.id,
    dto.accountId ?? '',
    dto.name,
    supply.category,
    parseFloat(dto.unitPriceAmount) || 0,
    supply,
    0,
    unitMeasure,
    0,
    dto.pictureUrl,
  );
}
