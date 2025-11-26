import { Test, TestingModule } from '@nestjs/testing';
import { DaprClientService } from './dapr-client.service';

describe('DaprClientService', () => {
  let service: DaprClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DaprClientService],
    }).compile();

    service = module.get<DaprClientService>(DaprClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
