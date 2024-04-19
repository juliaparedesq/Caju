const { all } = require('mathjs');
const schedule = require('node-schedule');

module.exports = async function (app) {
  
  const date = new Date();
  const year = date.getFullYear();
  let offset = 0;
  let limit = 100;
  try{
    res = await app.service("api/equipment").find({
      query: {
        active: true,
        $limit: limit,
        $skip: offset,
        vur: {
          $gt: 0
        },
      }
    });
    allEquips = res.data;
    while(res.total > res.skip + res.limit){
      offset = offset + res.limit;
      res = await app.service("api/equipment").find({
        query: {
          active: true,
          $limit: limit,
          $skip: offset,
          vur: {
            $gt: 0
          },
        }
      });
      allEquips = allEquips.concat(res.data);
    }
    const job = schedule.scheduleJob('0 0 1 1 *', function(){
      for (var i = 0; i < allEquips.length; i++) {
        if ( allEquips[i].year_of_instalation != null & allEquips[i].useful_life != null){
          let newVur = allEquips[i].year_of_instalation + allEquips[i].useful_life - year;
          if (newVur < 0) {
            newVur = 0;
          }
          let MIFactor2;
          let percentage = Math.round(newVur * 100 / allEquips[i].useful_life);
            if(percentage < 25){
                MIFactor2 = 2;
            }
            else if( 25 <= percentage & percentage < 50){
                MIFactor2 = 1;
            }
            else if( 50 <= percentage & percentage < 75){
                MIFactor2 = 0;
            }
            else if( 75 <= percentage & percentage < 100){
                MIFactor2 = -1;
            }
            else if( 100 <= percentage){
                MIFactor2 = -2;
            }
          let maintenanceIndicator = allEquips[i].mi_function + allEquips[i].mi_aplication + allEquips[i].mi_maintenance + allEquips[i].mi_factor1 + MIFactor2;
          app.service("api/equipment").patch(allEquips[i].id, {vur: newVur, maintenance_indicator: maintenanceIndicator});
        }
        
    }

    });
  }
  catch(e){
  }
}