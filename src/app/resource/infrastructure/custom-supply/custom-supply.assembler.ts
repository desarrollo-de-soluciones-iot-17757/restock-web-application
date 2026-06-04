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
  const supplyDto = dto.supply;
  const supply = Supply.create(
    supplyDto?.id ?? dto.supplyId ?? '',
    supplyDto?.name ?? dto.name,
    supplyDto?.description ?? dto.description,
    supplyDto?.category ?? dto.categoryName,
    supplyDto?.isPerishable ?? false,
  );

  const unitMeasure = UnitMeasure.create('', dto.unitMeasurement, dto.unitMeasurement);
  const minimumStock = dto.minimumStock ?? 0;
  const maximumStock = dto.maximumStock ?? minimumStock;

  return CustomSupply.create(
    dto.id,
    dto.accountId ?? '',
    dto.name,
    dto.supplyId ?? supply.id,
    supply,
    { minimumStock, maximumStock },
    {
      amount: parseFloat(dto.unitPriceAmount) || 0,
      currencyCode: dto.unitPriceCurrencyCode ?? 'PEN',
    },
    dto.description,
    unitMeasure,
    dto.pictureUrl,
  );
}
