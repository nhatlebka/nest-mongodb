import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Customer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      username: request.user?.username,
      customerId: request.user?.customerId,
    };
  },
);
