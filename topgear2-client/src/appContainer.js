class AppContainer {
  buses = [];
  routes = [];
  url = "http://api.prod.obanyc.com/api/siri/vehicle-monitoring.json?key=02e06296-1f9a-40a3-a94d-5a3d6ee09f2e&callback=configObj";
  localfile = './vehicle-monitoring-05022020-1138.json';
  url_helper2 = "";

  route_object = {};

  get_mta_data() {
    //make a fetch request
    //populate buses and routes property with values
    //call next function
    fetch(this.localfile)
      .then(resp => resp.json())
      .then(function(object) {
        let lineNames = [];
        let destinations = [];

        const unique = (value, index, self) => {
          return self.indexOf(value) === index
        }

        let busesInRequest = object.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity;

        for (const eachEntry in busesInRequest) {
          lineNames.push(busesInRequest[eachEntry].MonitoredVehicleJourney.PublishedLineName)
          destinations.push(busesInRequest[eachEntry].MonitoredVehicleJourney.DestinationName)
        }//use map to create new array

        const uniqueBusLines = lineNames.sort().filter(unique)


        console.log(uniqueBusLines)
        console.log(destinations)
        // console.log((object.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.PublishedLineName));
        // console.log((object.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.DestinationName));
        // console.log((object.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.MonitoredCall.Extensions.Distances.PresentableDistance));
        // console.log((object.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.MonitoredCall.StopPointName));
        // console.log((object.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.ProgressRate));

      })
      .catch(function(error) {
        alert("Everything id Broken!!! AHHHH!!!!");
        console.log(error.message);
      });
  };

  method_function2() {
    //create DOM nodes and insert data to display to user
  };
}
