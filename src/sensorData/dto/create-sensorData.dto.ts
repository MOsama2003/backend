import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSensorDataDto {
  @ApiProperty({ type: Number, description: "Nitrogen level as a float" })
  @IsNotEmpty()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2 })
  nitrogen: number;

  @ApiProperty({ type: Number, description: "Potassium level as a float" })
  @IsNotEmpty()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2 })
  potassium: number;

  @ApiProperty({ type: Number, description: "Phosphorus level as a float" })
  @IsNotEmpty()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2 })
  phosphorus: number;

  @ApiProperty({ type: Number, description: "Conductivity as a float" })
  @IsNotEmpty()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2 })
  conductivity: number;

  @ApiProperty({ type: Number, description: "pH level as a float" })
  @IsNotEmpty()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2 })
  pH: number;

  @ApiProperty({ type: Number, description: "Humidity as a float" })
  @IsNotEmpty()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2 })
  humidity: number;

  @ApiProperty({ type: Number, description: "Temperature as a float" })
  @IsNotEmpty()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2 })
  temperature: number;

  @ApiProperty({ type: String, description: "Device ID as a string" })
  @IsString()
  @IsNotEmpty()
  deviceId: string;
}
