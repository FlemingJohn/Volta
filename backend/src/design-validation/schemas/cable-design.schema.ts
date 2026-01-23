import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CableDesign extends Document {
    @Prop()
    standard: string;

    @Prop()
    voltage: string;

    @Prop()
    conductorMaterial: string;

    @Prop()
    conductorClass: string;

    @Prop()
    csa: number;

    @Prop()
    insulationMaterial: string;

    @Prop()
    insulationThickness: number;

    @Prop()
    maxResistance: string;
}

export const CableDesignSchema = SchemaFactory.createForClass(CableDesign);
