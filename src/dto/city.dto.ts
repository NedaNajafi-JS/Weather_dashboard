import { ApiProperty } from '@nestjs/swagger';

export class cityDto {
    
        @ApiProperty()
        coord: {
            lon: string
            lat: string
        }

        @ApiProperty()
        "weather": [
            {
                "id": Number,
                "main": string,
                "description": string,
                "icon": string
            }
        ]
        @ApiProperty()
        "base": string
        @ApiProperty()
        "main": {
            "temp": Number,
            "feels_like": Number,
            "temp_min": Number,
            "temp_max": Number,
            "pressure": Number,
            "humidity": Number
        }
        @ApiProperty()
        "visibility": Number
        @ApiProperty()
        "wind": {
            "speed": Number,
            "deg": Number,
            "gust": Number
        }

        @ApiProperty()
        "clouds": {
            "all": Number
        }
        @ApiProperty()
        "dt": string
        @ApiProperty()
        "sys": {
            "type": Number,
            "id": Number,
            "country": string,
            "sunrise": string,
            "sunset": string
        }
        @ApiProperty()
        "timezone": Number
        @ApiProperty()
        "id": Number
        @ApiProperty()
        "name": string
        @ApiProperty()
        "cod": Number
    
 }