import { SetMetadata } from '@nestjs/common';

export const Action = (action: string) => SetMetadata('action', action);
