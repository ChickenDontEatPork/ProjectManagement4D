import { Test, TestingModule } from '@nestjs/testing';
import { CommentsAssignService } from './comments-assign.service';

describe('CommentsAssignService', () => {
  let service: CommentsAssignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentsAssignService],
    }).compile();

    service = module.get<CommentsAssignService>(CommentsAssignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
