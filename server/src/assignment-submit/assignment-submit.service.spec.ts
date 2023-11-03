import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentSubmitService } from './assignment-submit.service';

describe('AssignmentSubmitService', () => {
  let service: AssignmentSubmitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignmentSubmitService],
    }).compile();

    service = module.get<AssignmentSubmitService>(AssignmentSubmitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
