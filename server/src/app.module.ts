import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { LoggerMiddleware } from './common/logger.middleware';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TagModule } from './tag/tag.module';
import { TopicModule } from './topic/topic.module';
import { CommentsAnnounceModule } from './comments-announce/comments-announce.module';
import { CommentsAssignModule } from './comments-assign/comments-assign.module';
import { GroupModule } from './group/group.module';
import { UserGroupModule } from './user-group/user-group.module';
import { GroupInviteModule } from './group-invite/group-invite.module';
import { MinioClientModule } from './minio-client/minio-client.module';
import { AssignmentModule } from './assignment/assignment.module';
import { AssignmentSubmitModule } from './assignment-submit/assignment-submit.module';
import { AnnouncementModule } from './announcement/announcement.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    UserModule,
    AuthModule,
    TagModule,
    TopicModule,
    CommentsAnnounceModule,
    CommentsAssignModule,
    GroupModule,
    UserGroupModule,
    GroupInviteModule,
    MinioClientModule,
    AssignmentModule,
    AssignmentSubmitModule,
    AnnouncementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
