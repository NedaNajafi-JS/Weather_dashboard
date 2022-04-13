import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { city, cityDocument } from './schema/city.schema';

import {cityDto} from './dto/city.dto';
import { Cron } from '@nestjs/schedule';
import { resolveAny } from 'dns';


@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);

  constructor(private readonly http: HttpService, 
              @InjectModel(city.name) private readonly model: Model<cityDocument>){}

  
  @Cron('0 01 * * * *')
  async getWeatherHourly() {

    let today = new Date();
    this.logger.log(`Get weather hourly. `, today);

    let cities: city[] = await this.model.find().exec();

    await Promise.all(cities.map(async (city_) => {

      let cityWeather : city = await this.getWeather(city_.coord.lat, city_.coord.lon);
    
      this.logger.log(`Weather forecast for the city ${cityWeather.name}: `, cityWeather.main);
      
      this.model.findOneAndUpdate({
        id: city_.id
      }, cityWeather)
      .exec();
      
    }));
  }

  async findAll(): Promise<city[]> {
    return await this.model.find().exec();
  }

  async create(name: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let {lat, lon} = await this.getCoordinate(name);

      this.getWeather(lat, lon)
      .then(async (city_) => {

          this.logger.log(`The city ${name} is created successfully.`);

          
            await new this.model({
              ...city_
            })
            .save();

            resolve(city_)
          
          

      })
      .catch(err => {

        this.logger.log(`An error occured while creating a new city.`, err);
        reject(err);

      });
    })
  }

  async checkExist(name: string): Promise<any>{

    return new Promise(async (resolve, reject) => {
      let {lat, lon} = await this.getCoordinate(name);

      this.getWeather(lat, lon)
      .then(async (city_) => {

        if(city_){

          this.model.findOne({
            id: city_.id
          })
          .then(double => {

            if(double === null){
              resolve(HttpStatus.OK);
            }else{
              this.logger.log(`The city ${name} already exists in the database.`);
              reject(HttpStatus.CONFLICT);
            }
          });
          
        }else{
          reject(HttpStatus.NOT_FOUND);
        }

      })
      .catch(err => {
        this.logger.log(err);
        
        reject(HttpStatus.NOT_FOUND);

      });
    });
      

  }

  async update(id: string, CityDto: cityDto): Promise<city> {
    return await this.model.findByIdAndUpdate(id, CityDto).exec();
  }

  async delete(id: string): Promise<city> {
    return await this.model.findOneAndDelete({
      id: id
    }).exec();
  }

  async findOne(id: string): Promise<city> {
    return await this.model.findById(id).exec();
  }

  async getCoordinate(name: string): Promise<any> {

    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=1&appid=c4a53b1a69670bb51bc16f409189a7d3`;

    const { data } = await firstValueFrom(this.http.get(url));
    if(data && data.length > 0){

      return {lat: data[0].lat, lon: data[0].lon};
    }else{
      this.logger.log(`The city ${name} not found through the weather API.`);

      return {lat: null, lon: null};

    }
  }

  async findOneByName(name: string): Promise<any> {

    let city_: city =  await this.model.findOne({
      name: name
    })
    .exec();

    if(!city_){

      let {lat, lon} = await this.getCoordinate(name);
      city_ = await this.getWeather(lat, lon);
    }

    let previousDates = [];
    let i = 1;

    while(i < 6){
  
        let date = null;
        date = new Date();
        date.setDate(date.getDate() - i);
  
        let data = null;
        data = await this.previousDay(city_.coord.lat, city_.coord.lon, Math.floor(date.getTime()/1000));
  
        previousDates.push({datee: date, temp: data.current.temp});
        i++;
    }
  
    return [{name: city_.name, temp: city_.main}, previousDates];
    
    
  }

  async previousDay(lat: Number, lon: Number, timestamp_: Number): Promise<any>{

    const url = `http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp_}&appid=c4a53b1a69670bb51bc16f409189a7d3`;
    
    const { data } = await firstValueFrom(this.http.get(url));
    return data;

  }

  async upcommingSevenDays(cityId: Number): Promise<any>{

    return new Promise((resolve, reject) => {

      this.model.findOne({
        id: cityId
      })
      .then(async(city_) => {
  
        if(city_){
  
          const url = `http://api.openweathermap.org/data/2.5/onecall?lat=${city_.coord.lat}&lon=${city_.coord.lon}&exclude=minutely,hourly&appid=c4a53b1a69670bb51bc16f409189a7d3`;
          
          const { data } = await firstValueFrom(this.http.get(url));
          resolve(data);
  
        }else{
          reject('No data');
        }
      })
      .catch(err => {
        this.logger.log(`An error occured while getting weather forecast for upcomming 7 days.`, err);
        reject('An error occured while getting weather forecast for upcomming 7 days.');
      });

    });
  }

  async getWeather(lat: Number, lon: Number): Promise<city>  {

    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c4a53b1a69670bb51bc16f409189a7d3`;
    const { data } = await firstValueFrom(this.http.get(url));
    return data;

  }

  async getWeatherAll(): Promise<city[]>  {

    let cities: city[] = await this.model.find().exec();
    let res = [];

    await Promise.all(cities.map(async(city) => {

      const url = `http://api.openweathermap.org/data/2.5/weather?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=c4a53b1a69670bb51bc16f409189a7d3`;
      const { data } = await firstValueFrom(this.http.get(url));

      if(data){
        res.push(data);
      }
    }));
    
    return res;

  }

}
