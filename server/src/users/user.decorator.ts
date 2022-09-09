import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './models/user.schema';

export const CurrentUser = createParamDecorator<
  undefined,
  any,
  User | undefined
>((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
