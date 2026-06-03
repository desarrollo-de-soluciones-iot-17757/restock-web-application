import { CustomSupplyResponse } from './custom-supply.response';
import { CustomSupply } from '../../domain/model/custom-supply.entity';
import { Supply } from '../../domain/model/supply.entity';
import { UnitMeasure } from '../../domain/model/unit-measure.entity';

export function assembleCustomSupply(dto: CustomSupplyResponse): CustomSupply {
  const supply = Supply.create(
    '',
    dto.name,
    dto.description,
    false, 
    dto.categoryName
  );

  const unitMeasure = UnitMeasure.create('', dto.unitMeasurement, dto.unitMeasurement);

  return CustomSupply.create(
    dto.id,
    dto.accountId ?? '',
    dto.name,
    dto.categoryName,
    parseFloat(dto.unitPriceAmount) || 0,
    supply,
    0, 
    unitMeasure,
    0, 
    dto.pictureUrl
  );
}
