import { Test, TestingModule } from '@nestjs/testing';
import { CommentsAnnounceController } from './comments-announce.controller';
import { CommentsAnnounceService } from './comments-announce.service';

describe('CommentsAnnounceController', () => {
  let controller: CommentsAnnounceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsAnnounceController],
      providers: [CommentsAnnounceService],
    }).compile();

    controller = module.get<CommentsAnnounceController>(
      CommentsAnnounceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
