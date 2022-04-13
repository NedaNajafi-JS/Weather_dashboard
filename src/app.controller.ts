import { 
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Res,
  Post,
  Put,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { AppService } from './app.service';
import {cityDto} from './dto/city.dto';
import {cityCreateDto} from './dto/cityCreate.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/city/weather/:lat/:lon')
  getWeather(@Param('lat') lat: Number, @Param('lon') lon: Number) {
    return this.appService.getWeather(lat, lon);
  }

  // returns a list of all cities containing id, name and the last weather information stored in the database.
  @Get('cities')
  async getCities(){
    return await this.appService.findAll();
  }

  // returns an array of cities stored in database and it's last known weather data(retrieved from weather API)
  @Get('/cities/weather')
  async getCitiesWeather(@Res() res){
    
    let cities = await this.appService.getWeatherAll();
    res.status(200).send(cities);
    
  }

  // creates a new city and retrieve the current temperature and other basic weather data for that city
  @Post('cities')
  create(@Body() cityCreatedto: cityCreateDto, @Res() res) {

    this.appService.checkExist(cityCreatedto.name)
    .then(async (status) => {

      if(status === 200){
  
        this.appService.create(cityCreatedto.name)
        .then((city) => {
          res.status(200).send(city);
        })
        .catch(err => res.status(400).send(err))
      }else{
        //throw new HttpException('Conflict', HttpStatus.CONFLICT);
        res.status(HttpStatus.CONFLICT).send('Conflict')
      }

    }).catch(err => {
      
      res.status(HttpStatus.CONFLICT).send('Conflict')
      //throw new HttpException('Conflict', HttpStatus.CONFLICT);
    })

  }

  // deletes the city and its weather data from the database
  @Delete('/cities/:id')
  async deleteCity(@Param('id') id: string){
    return await this.appService.delete(id);
  }

  // returns the last known weather data(realtime from weather API) for the city given by name(even if the city is not store in database)
  // it also includes the weather data for the last 7 days(usig weather API)
  @Get('/cities/:name/weather')
  async getCityWeatherByName(@Param('name') name: string){
    return await this.appService.findOneByName(name);
  }

  // @Get('/city/:id')//testDone
  // async find(@Param('id') id: string) {
  //   return await this.appService.findOne(id);
  // }

  // Get the weather data(realtime) for the coming 5 days for the city with the provided id.
  @Get('/cities/upcomming/:id')
  upcommingFiveDays(@Param('id') id: Number, @Res() res){
    this.appService.upcommingSevenDays(id)
    .then(data => {
      res.status(200).send(data)
      //return data;
    })
    .catch(err => {
      return err;
    });

  }

  // @Put('/city/update/:id')//testDone
  // async update(@Param('id') id: string, @Body() CityDto: cityDto) {
  //   return await this.appService.update(id, CityDto);
  // }
}
