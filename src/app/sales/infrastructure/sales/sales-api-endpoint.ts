
import { ErrorHandlingEnabledBaseType } from '../../../shared/infrastructure/error-handling-enabled-base-type';
import { RegisterSaleAssembler } from './register-sale.assembler';
import { RegisterSaleCommand } from '../../domain/model/register-sale.command';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterSaleResource } from './register-sale.response';



export class SalesApiEndpoint extends ErrorHandlingEnabledBaseType {

  constructor(private http: HttpClient, private assembler: RegisterSaleAssembler) {
    super();
  }



}
