import { HttpMethod } from '@dapr/dapr';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { log } from 'console';
import { DaprClientService } from 'src/dapr/services/dapr-client/dapr-client.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private readonly logger = new Logger(AuthorizationGuard.name);

  constructor(
    private readonly daprClientService: DaprClientService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    
    const userId = request.headers['x-user-id'];
    const action = this.reflector.get<string>('action', context.getHandler());

    if (!userId || !action) {
      throw new ForbiddenException('Missing user ID or action');
    }

    try {
      
      const response : any = await this.daprClientService.clientInstance.invoker.invoke(
        'orderus-pdp',           // appId of PDP service
        'authorize',             // method in PDP service
        HttpMethod.POST,
        { userId: userId, action }
      );
      log(response)
      if (response && response.decision === 'allow') {
        return true;
      } else {
        this.logger.warn(`Access denied for user ${userId} on action ${action}`);
        throw new ForbiddenException(response?.reason || 'Access denied');
      }
    } catch (err) {
      this.logger.error('Authorization check failed', err);
      throw new ForbiddenException('Authorization service error');
    }
  }
}
