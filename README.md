# Weather_dashboard

## Neda Najafi
API key: c4a53b1a69670bb51bc16f409189a7d3
used APIs:
  - http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=1&appid=c4a53b1a69670bb51bc16f409189a7d3
          - name to coordinates
        
  - http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp_}&appid=c4a53b1a69670bb51bc16f409189a7d3
          - Previous days

  - http://api.openweathermap.org/data/2.5/onecall?lat=${city_.coord.lat}&lon=${city_.coord.lon}&exclude=minutely,hourly&     appid=c4a53b1a69670bb51bc16f409189a7d3
          - Comming 7 days

  - http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c4a53b1a69670bb51bc16f409189a7d3
          - Get weather using coordinates
