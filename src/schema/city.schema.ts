import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type cityDocument = city & Document;

@Schema()
export class city {

  @Prop({ required: true })
  name: string;

  @Prop({type: Object})
  "coord": {
    "lon": Number,
    "lat": Number
};

@Prop()
weather: [
    {
        "id": Number,
        "main": string,
        "description": string,
        "icon": string
    }
];

@Prop()
"base": string;

@Prop({type: Object})
"main": {
    "temp": Number,
    "feels_like": Number,
    "temp_min": Number,
    "temp_max": Number,
    "pressure": Number,
    "humidity": Number
};

@Prop()
"visibility": Number;

@Prop({type: Object})
"wind": {
    "speed": Number,
    "deg": Number,
    "gust": Number
};

@Prop({type: Object})
"clouds": {
    "all": Number
};

@Prop()
"dt": Date;

@Prop({type: Object})
"sys": {
    "type": Number,
    "id": Number,
    "country": string,
    "sunrise": Date,
    "sunset": Date
};

@Prop()
"timezone": Number;

@Prop()
"id": Number;

@Prop()
"cod": Number

}

export const citySchema = SchemaFactory.createForClass(city);