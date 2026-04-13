import { Test, TestingModule } from '@nestjs/testing';
import { GstService } from './gst.service';

describe('GstService', () => {
  let service: GstService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GstService],
    }).compile();

    service = module.get<GstService>(GstService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
