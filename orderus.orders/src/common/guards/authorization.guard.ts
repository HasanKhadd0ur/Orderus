import { HttpMethod } from '@dapr/dapr';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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
      this.logger.warn(`Missing user ID or action. userId=${userId}, action=${action}`);
      throw new ForbiddenException('Missing user ID or action');
    }

    const payload = { userId, action };

    
    this.logger.log(`Authorizing request → userId=${userId}, action=${action}`);
    this.logger.debug(`Payload sent to PDP: ${JSON.stringify(payload)}`);

    try {
      const response: any = await this.daprClientService.clientInstance.invoker.invoke(
        'orderus-pdp',
        'authorize',
        HttpMethod.POST,
        payload
      );

      
      this.logger.log(`PDP responded for userId=${userId}, action=${action}`);
      this.logger.debug(`PDP Response: ${JSON.stringify(response)}`);

      if (response && response.decision === 'allow') {
        this.logger.log(`Authorization ALLOW → userId=${userId}, action=${action}`);
        return true;
      } else {
        this.logger.warn(
          `Authorization DENIED → userId=${userId}, action=${action}, reason=${response?.reason}`
        );
        throw new ForbiddenException(response?.reason || 'Access denied');
      }
    } catch (err) {
      this.logger.error(
        `Authorization check FAILED → userId=${userId}, action=${action}, error=${err.message}`,
      );
      throw new ForbiddenException('Authorization service error');
    }
  }
}
