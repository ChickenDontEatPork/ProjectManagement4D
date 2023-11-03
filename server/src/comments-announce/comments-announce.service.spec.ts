import { Test, TestingModule } from '@nestjs/testing';
import { CommentsAnnounceService } from './comments-announce.service';

describe('CommentsAnnounceService', () => {
  let service: CommentsAnnounceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentsAnnounceService],
    }).compile();

    service = module.get<CommentsAnnounceService>(CommentsAnnounceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
