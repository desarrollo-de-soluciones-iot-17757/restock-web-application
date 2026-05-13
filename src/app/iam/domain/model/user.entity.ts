export type PlanType = 'FREE' | 'PRO';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';

export interface User {
  id: string;
  accountId: string; 
  email: string;
  roleId: string;
  plan: PlanType; 
  status: UserStatus; 
}
