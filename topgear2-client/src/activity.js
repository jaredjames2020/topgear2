class Activity {
  constructor(route_name, route_destination, direction, next_stop, stops_away, delay = "On Time", congestion = "Limited Seats", vehicle){
    this.route_name = route_name;
    this.route_destination = route_destination;
    this.direction = direction;
    this.next_stop = next_stop;
    this.stops_away = stops_away;
    this.delay = delay;
    this.congestion = congestion;
    this.vehicle = vehicle;
    AppContainer.activity.push(this);
  }
}
