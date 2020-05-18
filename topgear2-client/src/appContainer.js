class AppContainer {
  static bus = []; //bus seed
  static route = []; //route seed
  static activity = []; //MTA data
  static activity_selected_vehicle = []; //current bus activity from selector
  static current_bus = {}; //current bus line
  static bus_trip = {}; //probably dont need origin/destination data
  static bus_line = "";
  static current_vehicle_activity = {bus_name: "", bus_line: "", congestion: "LIMITED SEATS", delay: "ON TIME"} //current vehicle activity

//add division create to handle page refreshing with if statement - if this is present reload else wait

  routes_url = "https://bustime.mta.info/routes&callback=configObj";
  url = "http://api.prod.obanyc.com/api/siri/vehicle-monitoring.json?key=02e06296-1f9a-40a3-a94d-5a3d6ee09f2e&callback=jsonData";
  vehicleMonitoring_lf = './vehicle-monitoring-05022020-1138.json';
  vehicleMonitoring_lf2 = './vehicle-monitoring_05_10_2020.json';
  stopsForLocation_lf = './stops-for-location.json';
  busesInRequest = "Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity";

  startup() {
    this.bindingEventListerners();
  }

  bindingEventListerners() {
    window.addEventListener('DOMContentLoaded', (event) => {
      console.log('DOM fully loaded and parsed');
      this.buses_and_routes();//FETCH: loads all buses and routes from seed file
      this.activity_session();//FETCH: loads current activity data from MTA
    });
    document.addEventListener('change', (event) => {
      this.destination_delay_dropdown_value();
      this.destination_congestion_dropdown_value();
      this.origin_delay_dropdown_value();
      this.origin_congestion_dropdown_value();
      this.origin_dropdown_value()
      this.destination_dropdown_value()
      this.dropdown_activity_finder();
    })

    document.getElementById("destination_button").addEventListener("click", () => this.update_activity())
    document.getElementById("origin_button").addEventListener("click", () => this.update_activity())
  }

  // SEPARATES MTA DATA INTO ROUTE DIRECTIONS
  routeDirectionSelector() {
    const find_bus_line = document.getElementById("bus-line")
    const selected_bus_line = find_bus_line.value
    const routeByBusLine = (AppContainer.bus).filter(line => line.name === selected_bus_line)

    find_bus_line.addEventListener('change', (selected_bus_line) => {

      AppContainer.current_bus.bus_line = selected_bus_line.target.value
      AppContainer.bus_trip[selected_bus_line.target.value] = {
        origin: [{}],
        destination: [{}]
      }
      this.filter_activities();
      this.build_activities_tables();

      const buses = AppContainer.bus.find(bus => bus.name === selected_bus_line.target.value)
      const destination_div = document.getElementById("route_destination");
      const origin_div = document.getElementById("route_origin");
      const d_heading = document.createElement("h4");
      const o_heading = document.createElement("h4");
      const d_ul = document.createElement("ul");
      const o_ul = document.createElement("ul");
      d_ul.id = "destination"
      o_ul.id = "origin"
      d_heading.innerText = `DESTINATION: ${buses.route_origin.toUpperCase()}`;
      o_heading.innerText = `DESTINATION: ${buses.route_destination.toUpperCase()}`;

      destination_div.appendChild(d_heading)
      origin_div.appendChild(o_heading)
      destination_div.appendChild(d_ul);
      origin_div.appendChild(o_ul);

      const stops = AppContainer.route.find(e => e.bus_line_name === selected_bus_line.target.value).service_stops
      console.log(selected_bus_line.target.value)

      const origin_list = stops.toUpperCase().split(", ")
      const destination_list = stops.toUpperCase().split(", ").reverse()

      for (var i = 0; i < origin_list.length; i++) {
        document.getElementById("origin").style.visibility = "visible"
        const add_origin_div = document.createElement("div");
        let li = document.createElement("li");
        li.innerText = `${origin_list[i]}`
        li.id = `o_${origin_list[i]}`
        o_ul.appendChild(li)
      } //refactor to make own functions

      for (var i = 0; i < destination_list.length; i++) {
        const add_destination_div = document.createElement("div");
        let li = document.createElement("li");
        li.innerText = `${destination_list[i]}`
        li.id = `d_${destination_list[i]}`
        d_ul.appendChild(li)
      } //refactor make own function
    })
  }

  //ACTIVITY TABLES
  build_activities_tables() {
    this.filter_activities().forEach(entry => {
      console.log(entry)
      AppContainer.act.push(entry)
      const find_activity = document.getElementById("activity")

      //refactor table maker
      if (entry.direction === "0") {
        const ori_table_label = document.getElementById("ori_act_tbl_lbl")
        ori_table_label.innerText = `DESTINATION: ${entry.route_destination}`
        const origin_act_table = document.getElementById("origin_activity_table")
        const tbl_body = document.createElement("tbody");
        const tr = document.createElement("tr")
        tbl_body.appendChild(tr)
        const td1 = document.createElement("td")
        const td2 = document.createElement("td")
        const td3 = document.createElement("td")
        const td4 = document.createElement("td")
        td1.appendChild(document.createTextNode(entry.next_stop))
        td2.appendChild(document.createTextNode(entry.stops_away))
        td3.appendChild(document.createTextNode(entry.delay))
        td4.appendChild(document.createTextNode(entry.congestion))
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        origin_activity_table.appendChild(tbl_body)
        this.load_origin_dropdown(entry.next_stop, entry.vehicle)

      } else if (entry.direction === "1") {
        const des_table_label = document.getElementById("des_act_tbl_lbl")
        des_table_label.innerText = `DESTINATION: ${entry.route_destination}`
        const destination_act_table = document.getElementById("destination_activity_table")
        const tbl_body = document.createElement("tbody");
        const tr = document.createElement("tr")
        tbl_body.appendChild(tr)
        const td1 = document.createElement("td")
        const td2 = document.createElement("td")
        const td3 = document.createElement("td")
        const td4 = document.createElement("td")
        td1.appendChild(document.createTextNode(`${entry.next_stop}`))
        td2.appendChild(document.createTextNode(`${entry.stops_away}`))
        td3.appendChild(document.createTextNode(`${entry.delay}`))
        td4.appendChild(document.createTextNode(`${entry.congestion}`))
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        destination_activity_table.appendChild(tbl_body)
        this.load_destination_dropdown(entry.next_stop, entry.vehicle)
      } else {
        console.log("NO BUENO")
      }
    })
  }

  //FETCH REQUEST
  buses_and_routes() {
    fetch("http://localhost:3000/buses")
      .then(resp => resp.json())
      .then(data => {
        data.forEach(bus => {
          new Bus(bus.route_name, bus.route_destination, bus.route_origin, bus.route, bus.congestion)
          new Route(bus.route.bus_line_name, bus.route.service_stops, bus.route.service_status, bus.route.service_origin, bus.route.service_destination)
        });
        this.load_busline_dropdown();
      })
      .catch(function(error) {
        alert("Everything id Broken!!! ARGHHHH!!!!");
        console.log(error.message);
      });
  } //loads all buses and routes from seed file

  activity_session() {
    fetch(this.vehicleMonitoring_lf2)
      .then(resp => resp.json())
      .then(data => {
        const bus_info = data.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity

        bus_info.forEach(bus => {
          const bl_route_name = bus.MonitoredVehicleJourney.PublishedLineName
          const bl_route_destination = bus.MonitoredVehicleJourney.DestinationName
          const bl_direction = bus.MonitoredVehicleJourney.DirectionRef
          const bl_next_stop = bus.MonitoredVehicleJourney.MonitoredCall.StopPointName
          const bl_stops_away = bus.MonitoredVehicleJourney.MonitoredCall.Extensions.Distances.PresentableDistance
          const bl_vehicle_ref = bus.MonitoredVehicleJourney.VehicleRef;
          const congestion = "Limited Seats"
          const delay = "On Time"
          new Activity(bl_route_name, bl_route_destination, bl_direction, bl_next_stop, bl_stops_away, delay, congestion, bl_vehicle_ref);
        })
      })
  } //loads current activity data from MTA

  create_activity(activity_creator) {
    fetch("http://localhost:3000/activities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(activity_creator)
    })
  } //creates local activity data for this session

  update_activity() {
    fetch(`http://localhost:3000/activities/${AppContainer.current_vehicle_activity.bus_line}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          congestion: AppContainer.current_vehicle_activity.congestion.toUpperCase(),
          delay: AppContainer.current_vehicle_activity.delay.toUpperCase()
        })
      })
      .then(resp => resp.json())
      .then(data => {
        console.log(data)
        alert(`Thanks for your update to ${AppContainer.current_bus.bus_line}
        Congestion: ${AppContainer.current_vehicle_activity.congestion}
        Delay: ${AppContainer.current_vehicle_activity.delay}`)
      })
      .catch(errors => console.log(errors))
  } //updates activity session from user input



  //FINDERS & FILTERS
  dropdown_activity_finder() {
    const finder = document.getElementById("origin_list_selector")
    return AppContainer.activity.filter(bus => bus.vehicle === finder.options[finder.selectedIndex].value)
  }//finds current bus vehicle identifer

  filter_activities() {
    return AppContainer.activity.filter(bus => bus.route_name === AppContainer.current_bus.bus_line)
  }//finds current bus route

  filter_vehicle(name) {
    console.log(AppContainer.activity_selected_vehicle.filter(act => act.vehicle === name))
    return AppContainer.activity_selected_vehicle.filter(act => act.vehicle === name)
  }

  //DROPDOWN MENUS
  load_busline_dropdown() {
    for (var i = 0; i < AppContainer.bus.length; i++) {
      var find_bus_line = document.getElementById("bus-line");
      var add_bus_line = document.createElement("option");
      add_bus_line.text = AppContainer.bus[i].name;
      add_bus_line.value = AppContainer.bus[i].name;
      find_bus_line.add(add_bus_line);
    }
    this.routeDirectionSelector();
  }

  load_origin_dropdown(origin_list, vehicle_id) {
    const find_origin_dropdown_list = document.getElementById("origin_list_selector")
    const add_option = document.createElement("option");
    add_option.text = `${origin_list} - ${vehicle_id}`;
    add_option.value = vehicle_id;
    find_origin_dropdown_list.appendChild(add_option)
  }

  load_destination_dropdown(destination_list, vehicle_id) {
    const find_destination_dropdown_list = document.getElementById("destination_list_selector")
    const add_option = document.createElement("option");
    add_option.text = `${destination_list} - ${vehicle_id}`;
    add_option.value = vehicle_id;
    find_destination_dropdown_list.appendChild(add_option)
  }

  //GET DROPDOWN VALUES
  destination_congestion_dropdown_value() {
    const congestion_dropdown_menu = document.getElementById("destination-congestion-level")
    const congestion_value = congestion_dropdown_menu.value
    congestion_dropdown_menu.addEventListener('change', (congestion_value) => {
      AppContainer.current_vehicle_activity.congestion = congestion_value.target.value
      return congestion_value.target.value
    })
  }

  destination_delay_dropdown_value() {
    const delay_dropdown_menu = document.getElementById("destination-delay-level")
    const delay_value = delay_dropdown_menu.value
    delay_dropdown_menu.addEventListener('change', (delay_value) => {
      AppContainer.current_vehicle_activity.delay = delay_value.target.value
      return delay_value.target.value
    })
  }

  origin_congestion_dropdown_value() {
    const congestion_dropdown_menu = document.getElementById("origin-congestion-level")
    const congestion_value = congestion_dropdown_menu.value
    congestion_dropdown_menu.addEventListener('change', (congestion_value) => {
      AppContainer.current_vehicle_activity.congestion = congestion_value.target.value
      return congestion_value.target.value
    })
  }

  origin_delay_dropdown_value() {
    const delay_dropdown_menu = document.getElementById("origin-delay-level")
    const delay_value = delay_dropdown_menu.value
    delay_dropdown_menu.addEventListener('change', (delay_value) => {
      AppContainer.current_vehicle_activity.delay = delay_value.target.value
      return delay_value.target.value
    })
  }

  origin_dropdown_value() {
    const origin_dropdown_menu = document.getElementById("origin_list_selector")
    const origin_value = origin_dropdown_menu.value
    origin_dropdown_menu.addEventListener('change', (origin_value) => {
      AppContainer.current_vehicle_activity.bus_line = origin_value.target.value
      this.create_activity(this.filter_vehicle(origin_value.target.value)[0])
      return origin_value.target.value
    })
  }

  destination_dropdown_value() {
    const destination_dropdown_menu = document.getElementById("destination_list_selector")
    const destination_value = document.getElementById("destination_list_selector").value
    destination_dropdown_menu.addEventListener('change', (destination_value) => {
      AppContainer.current_vehicle_activity.bus_line = destination_value.target.value
      this.create_activity(this.filter_vehicle(destination_value.target.value)[0])
      return destination_value.target.value
    })
  }//returns current activty vehicle name

}
