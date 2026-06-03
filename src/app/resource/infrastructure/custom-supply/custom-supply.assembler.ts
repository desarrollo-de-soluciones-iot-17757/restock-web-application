import { CustomSupplyResponse } from './custom-supply.response';
import { CustomSupply } from '../../domain/model/custom-supply.entity';
import { Supply } from '../../domain/model/supply.entity';
import { UnitMeasure } from '../../domain/model/unit-measure.entity';

/**
 * Assembles a {@link CustomSupply} domain entity from the flat API response.
 *
 * All endpoints (GET list, GET by id, POST, PATCH) return the same flat shape:
 * supplyId, supplyName, categoryName — no nested objects.
 */
export function assembleCustomSupply(dto: CustomSupplyResponse): CustomSupply {
  const supply = Supply.create(
    dto.supplyId,
    dto.supplyName,
    dto.description,
    false,
    dto.categoryName,
  );

  const unitMeasure = UnitMeasure.create('', dto.unitMeasurement, dto.unitMeasurement);

  return CustomSupply.create(
    dto.id,
    dto.accountId,
    dto.name,
    dto.categoryName,
    parseFloat(dto.unitPriceAmount) || 0,
    supply,
    dto.minimumStock,
    unitMeasure,
    dto.maximumStock,
    dto.pictureUrl,
  );
}
