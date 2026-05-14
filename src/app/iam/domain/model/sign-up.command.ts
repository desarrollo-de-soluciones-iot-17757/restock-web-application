/**
 * Command used to register a new user in the IAM bounded context.
 */
export class SignUpCommand {
  private readonly _email: string;
  private readonly _password?: string;
  private readonly _roleId?: string;

  /**
   * Initializes a new SignUpCommand.
   * @param params - Command payload for sign-up.
   */
  constructor(params: { email: string; password?: string; roleId?: string }) {
    this._email = params.email;
    this._password = params.password;
    this._roleId = params.roleId;
  }

  get email(): string {
    return this._email;
  }

  get password(): string | undefined {
    return this._password;
  }

  get roleId(): string | undefined {
    return this._roleId;
  }
}
