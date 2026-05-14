import { environment } from '../../../../environments/environment';

/**
 * Resolves the HTTP origin (no trailing slash) for profiles/businesses REST calls.
 *
 * @throws When the active `environment` does not define {@link environment.profilesApi.baseUrl}.
 */
export function profilesApiOrigin(): string {
  const base = environment.platformProviderApiBaseUrl.trim().replace(/\/+$/, '');
  if (!base) {
    throw new Error(
      '[profiles] environment.platformProviderApiBaseUrl must be a non-empty string.',
    );
  }
  return base;
}

