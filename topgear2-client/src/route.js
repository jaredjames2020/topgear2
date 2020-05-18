class Route {
    constructor(bus_line_name, service_stops, service_status, service_origin, service_destination) {
      this.bus_line_name = bus_line_name;
      this.service_stops = service_stops;
      this.service_status = service_status;
      this.service_origin = service_origin;
      this.service_destination = service_destination;
      AppContainer.route.push(this);
    }
}
