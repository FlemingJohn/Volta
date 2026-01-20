import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DesignValidationController } from './design-validation.controller';
import { DesignValidationService } from './design-validation.service';
import { AIGatewayModule } from '../ai-gateway/ai-gateway.module';
import { CableDesign, CableDesignSchema } from './schemas/cable-design.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: CableDesign.name, schema: CableDesignSchema }]),
        AIGatewayModule
    ],
    controllers: [DesignValidationController],
    providers: [DesignValidationService],
    exports: [DesignValidationService],
})
export class DesignValidationModule { }
