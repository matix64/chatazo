import { SetMetadata } from '@nestjs/common';
import { Role } from './models/roles';

export const REQ_ROLE_METADATA = 'roles';

export const RequireRole = (role: Role) => SetMetadata(REQ_ROLE_METADATA, role);
