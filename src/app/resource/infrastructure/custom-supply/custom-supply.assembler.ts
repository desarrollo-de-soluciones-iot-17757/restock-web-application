import { CustomSupplyResponse } from './custom-supply.response';
import { CustomSupply } from '../../domain/model/custom-supply.entity';
import { Supply } from '../../domain/model/supply.entity';
import { UnitMeasure } from '../../domain/model/unit-measure.entity';

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
  const maximumStock = dto.maximumStock ?? Math.max(minimumStock, dto.supplyContent ?? 0);

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
