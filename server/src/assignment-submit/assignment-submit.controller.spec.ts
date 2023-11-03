import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentSubmitController } from './assignment-submit.controller';
import { AssignmentSubmitService } from './assignment-submit.service';

describe('AssignmentSubmitController', () => {
  let controller: AssignmentSubmitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentSubmitController],
      providers: [AssignmentSubmitService],
    }).compile();

    controller = module.get<AssignmentSubmitController>(
      AssignmentSubmitController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
