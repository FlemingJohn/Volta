import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CableDesign extends Document {
    @Prop({ required: true })
    standard: string;

    @Prop({ required: true })
    voltage: string;

    @Prop({ required: true })
    conductorMaterial: string;

    @Prop({ required: true })
    conductorClass: string;

    @Prop({ required: true })
    csa: number;

    @Prop({ required: true })
    insulationMaterial: string;

    @Prop({ required: true })
    insulationThickness: number;
}

export const CableDesignSchema = SchemaFactory.createForClass(CableDesign);
