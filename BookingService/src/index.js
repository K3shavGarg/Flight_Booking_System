const express = require('express');
const {serverConfig} = require('./config');


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


const apiRoutes = require('./routes')

app.use('/api', apiRoutes);

const CRON = require('./utils/common/cron-job')

app.listen(serverConfig.PORT,()=>{
    console.log(`Server is running on port ${serverConfig.PORT}`);

    CRON();
    // const { Airports, Flight} = require('./models');
    // const airport = await Airports.findByPk(2);
    // const airport = await city.createAirport({name :'Netaji Subhas Chandra Bose International Airport', code:'CCU'});
    // const airportsInCity = await city.getAirports();
    // console.log(airportsInCity);
    // console.log(City)
    // const response = await City.destroy({ 
    //     where:{
    //         id: 3
    //     }
    // })
}) 