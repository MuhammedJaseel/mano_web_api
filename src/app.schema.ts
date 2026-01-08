import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class AccesLog {
  @Prop({ type: Array })
  ips: any[];

  @Prop({ type: String })
  domain: string;
}

export const AccesLogSchema = SchemaFactory.createForClass(AccesLog);
