class Bus {
  constructor(name, route_destination, route_origin, route, congestion){
    this.name = name;
    this.route_destination = route_destination;
    this.route_origin = route_origin;
    this.route = route;
    this.congestion = congestion;
    AppContainer.bus.push(this);
  }
}

//store which route a bus belongs to
// t.string "route_name"
// t.string "route_destination"
// t.string "congestion"
// t.string "current_location"
// t.string "next_stop"
// t.string "stops_away"
// t.string "user_location"
// t.integer "route_id"
// t.integer "user_id"
