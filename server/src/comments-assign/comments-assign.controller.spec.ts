import { Test, TestingModule } from '@nestjs/testing';
import { CommentsAssignController } from './comments-assign.controller';
import { CommentsAssignService } from './comments-assign.service';

describe('CommentsAssignController', () => {
  let controller: CommentsAssignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsAssignController],
      providers: [CommentsAssignService],
    }).compile();

    controller = module.get<CommentsAssignController>(CommentsAssignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
