import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CONSTANTS } from '../../constants';

export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    for (let x = 0; x < CONSTANTS.BY_PASS_ROLE.length; x++) {
      if (request.url == CONSTANTS.BY_PASS_ROLE[x]) return true;
    }
    return super.canActivate(context);
  }
}
