import { RegisterDeviceResource, RegisterDeviceResponse } from './register-device.response';
import { RegisterDeviceCommand } from '../../domain/model/register-device.command';
import { RegisterDeviceRequest } from './register-device.request';

/**
 * Assembler for converting between RegisterDeviceCommand command and infrastructure HTTP request payloads.
 *
 * @remarks
 * This assembler is responsible for transforming between:
 * - {@link RegisterDeviceCommand} - Domain command for registering devices into a business account.
 * - {@link RegisterDeviceRequest} - Infrastructure request payload for API communication.
 * - {@link RegisterDeviceResponse} - API response from successful registration.
 * - {@link RegisterDeviceResource} - Infrastructure resource for application use.
 */
export class RegisterDeviceAssembler {

  /**
   * Converts an API endpoint response into an application-level resource.
   *
   * @param response - Raw response object returned by the device registration endpoint.
   * @returns Mapped device registration resource ready for using in the application.
   */
  toResourceFromResponse(response: RegisterDeviceResponse): RegisterDeviceResource {
    return {
      id: response.id,
      macAddress: response.macAddress,
      networkState: response.networkState
    } as RegisterDeviceResource;
  }

  /**
   * Converts a domain device registration command into the request payload for API communication.
   *
   * @param command - The domain command with needed registration params.
   * @returns HTTP request payload in the expected format by the device registration endpoint.
   */
  toRequestFromCommand(command: RegisterDeviceCommand): RegisterDeviceRequest {
    return {
      accountId: command.accountId,
      registrationToken: command.registrationToken,
      alias: command.alias
    } as RegisterDeviceRequest;
  }
}
