export type RoleType = 'RETAIL_MANAGER' | 'RESTAURANT_MANAGER';

export interface Role {
  id: string;
  name: RoleType;
  permissions: string[];
}
