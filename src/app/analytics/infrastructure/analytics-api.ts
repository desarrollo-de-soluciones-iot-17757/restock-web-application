import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Metric } from '../domain/model/metric.entity';
import { MetricResponse } from './metric/metric.response';
import { MetricAssembler } from './metric/metric.assembler';
import { MetricEndpoint } from './metric/metric.endpoint';
import { LoadMetricsCommand } from '../domain/commands/load-metrics.command';

@Injectable({ providedIn: 'root' })
export class AnalyticsApi {
  private readonly http = inject(HttpClient);

  getMetrics(command: LoadMetricsCommand): Observable<Metric[]> {
    const params = new HttpParams()
      .set('start_date', command.dateRange.startDate)
      .set('end_date',   command.dateRange.endDate);

    return this.http
      .get<MetricResponse[]>(
        MetricEndpoint.byAccount(command.accountId),
        { params }
      )
      .pipe(map(MetricAssembler.toEntityList));
  }

  getMetricById(id: string): Observable<Metric> {
    return this.http
      .get<MetricResponse>(MetricEndpoint.byId(id))
      .pipe(map(MetricAssembler.toEntity));
  }
}