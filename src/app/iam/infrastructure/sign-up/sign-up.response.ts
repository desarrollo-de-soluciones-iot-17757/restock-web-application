export interface SignUpResponse {
  success: boolean;
  message: string;
  user: {
    id: string | number;
    accountId?: string;
    email: string;
    roleId?: string;
    plan?: 'FREE' | 'PRO';
    status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
    token?: string;
  };
}
