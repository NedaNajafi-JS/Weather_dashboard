import { Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { city, citySchema } from './schema/city.schema';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [HttpModule, 
            MongooseModule.forRoot("mongodb+srv://nnajafi:Admin123456@cluster0.llcux.mongodb.net/Weather_dashboard?retryWrites=true&w=majority"), 
            MongooseModule.forFeature([{ name: city.name, schema: citySchema }]),
            ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
