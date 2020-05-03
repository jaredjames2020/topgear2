# topgear2
### FILE STRUCTURE ###
  README.md
  topgear2 - API
  topgear2 - Client
    index.html
    src
      index.js
      class files

rails g resource [classname] [attributes] --no-test-framework 14:50

###### JSON OPTIONS: ######
1) trigger file download on click with html
2) JSON request object with init https://www.youtube.com/watch?v=1tVCwv_BX2M

3) stringify then parse
var qData;

var jsonData = function(data) {
  qData = (JSON.stringify(data));
  requestedNow = JSON.parse(data)
};



###### API VEHICLE MONITORING CALLS ######
Line Name = console.log((object.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.PublishedLineName));
DestinationName=
console.log((object.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.DestinationName));
CurrentLocation=
console.log((object.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.MonitoredCall.Extensions.Distances.PresentableDistance));
Current or Next Stop =
console.log((object.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.MonitoredCall.StopPointName));
Status=
console.log((object.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.ProgressRate));


###### TO DO ######
select bus line
(after selection displays two buttons)

select route final Destination (direction)
Routes:
to A
to B
(after selection displays dropdown of stops)

select current location
displays next arrival time & # of stops away & service status


### CLASSES ###
Bus (belong to route)
  route_name - string
  route_destination - string
  congestion - string
  current_location - string (at stop + stop name)
  next_stop - string (use current location & Routes[array]+1 to determine next)
  stops_away - string (how many stops away from user location)
  user_location - string
  route_id - foreign key
  user_id - foreign key

Route (has_many buses)
  bus_line_name - string
  service_stops - string
  service_status - string
  service_origin - string
  service_destination - string
  bus_id - foreign key
  user_id - foreign key

User
  username - string
  current_location - string
  observed_congestion - string (update congestion level) Yes or No
  observed_time_status - string (was bus on time) Yes or No
  observed_service_status - string (report service status update) Yes or No
  bus_id - foreign key
  user_id - foreign key

AppContainer - stores data across the application - helps so you dont have to make a fetch request everytime - can store data locally
STORE ARRAY OF:
Bus Instances (from above)
Route Instances (from above)
urls from data fetch
methods needed for the fetch (these are functions)
render activities - what is being sent to the DOM (these are functions)

Current_request - frontend class that will not persist
bus lineNames
route_name
route_destination
service_origin
service_destination

***Frontend data classes do not persist in the database***

### AJAX REQUEST ###
1. get /buses
2. get /routes
3. update /user/route/observed_congestion
4. update /user/route/observed_time_status
5. update /user/route/observed_service_status


### Bus = Activity, Route = Categories ###

### TO DESTORY DATABASE ###
Busssess.destroy_all
Routes.destroy_all
