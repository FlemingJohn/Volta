import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DesignValidationModule } from './design-validation/design-validation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DesignValidationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
