export enum UserRole {
  administrator = 'administrator',
  manager = 'manager',
  technician = 'technician',
}

export interface JwtPayload {
  sub: string;
  role: UserRole;
  exp: number;
  iat: number;
}
