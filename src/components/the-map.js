import React, { Component } from "react";
import Link from 'gatsby-link';
import * as d3 from "d3";
import * as d3Geo from "d3-geo";
import * as d3Hexbin from "d3-hexbin";
import * as ss from 'simple-statistics';
import * as topojson from 'topojson';

import mapboxgl from 'mapbox-gl';
import { css } from 'glamor'

const mapStyle = css({
  width: '100%',
  height: '90%',
  position: 'absolute'
});

const theMapContainerStyles = css({ 
  height: '100%' 
});

d3.geo = d3Geo;

const coffee = [
  {
    "storenumber": 1004000000,
    "storename": "Allen & Delancey",
    "address": "80 Delancey Street",
    "addressline2": "",
    "addressline3": "",
    "city": "New York",
    "state": "NY",
    "zipcode": "10002-3133",
    "phonenumber": "917 5341397",
    "storehours": "Mon: 06:00:00-22:00:00 Tue: 06:00:00-22:00:00 Wed: 06:00:00-22:00:00 Thu: 06:00:00-22:00:00 Fri: 06:00:00-23:00:00 Sat: 06:00:00-23:00:00 Sun: 06:00:00-22:00:00",
    "wireless": "Wireless Hotspot",
    "latitude": 40.71932,
    "longitude": -73.98995,
    "group": 0,
    "faxnumber": "",
    "drivethru": ""
  },
  {
    "storenumber": 1005000000,
    "storename": "East Northport, Rte. 25",
    "address": "3011 Jericho Tpke.",
    "addressline2": "",
    "addressline3": "",
    "city": "East Northport",
    "state": "NY",
    "zipcode": "11731-6215",
    "phonenumber": "631-499-0258",
    "storehours": "Mon: 05:30:00-22:00:00 Tue: 05:30:00-22:00:00 Wed: 05:30:00-22:00:00 Thu: 05:30:00-22:00:00 Fri: 05:00:00-23:00:00 Sat: 06:30:00-23:30:00 Sun: 06:30:00-22:00:00",
    "wireless": "Wireless Hotspot",
    "latitude": 40.83935,
    "longitude": -73.32388,
    "group": 0,
    "faxnumber": "",
    "drivethru": ""
  },
  {
    "storenumber": 1005000000,
    "storename": "Smith Haven Mall",
    "address": "528 Smith Haven Mall",
    "addressline2": "Smith Haven Mall",
    "addressline3": "",
    "city": "Lake Grove",
    "state": "NY",
    "zipcode": "11755-1206",
    "phonenumber": "631-863-2061",
    "storehours": "Mon: 07:45:00-21:30:00 Tue: 07:45:00-21:30:00 Wed: 07:45:00-21:30:00 Thu: 07:45:00-21:30:00 Fri: 07:45:00-21:30:00 Sat: 07:45:00-21:30:00 Sun: 09:00:00-18:00:00",
    "wireless": "Wireless Hotspot",
    "latitude": 40.86502,
    "longitude": -73.13054,
    "group": 0,
    "faxnumber": "",
    "drivethru": ""
  }
];

class TheMap extends Component {

  constructor() {
    super();
    this.data = [ {
      "lat": 51.475542,
      "lon": -0.038495
    },
    {
      "lat": 51.54907,
      "lon": -0.038173
    },
    {
      "lat": 51.476571,
      "lon": -0.038108
    }];
    this.map = null; // This will soon hold reference to our awesome lil map
    this.dots = null; // And this will soon hold reference to dots on the map
    this.svg = null; // You guessed it, will hold ref to the SVG dom elem
  }

  render() {
      return (
      <div {...theMapContainerStyles}>   
          <div id="mapContainer" {...mapStyle}></div>
          <div id="tooltip">
              <svg width="100px" height="100px"></svg>
          </div>
      </div>
      )
  }

  componentDidMount =  () => {
    this.renderTheMap()
    this.setUpD3Viz(this.vzIsSetUp);
  }

makeRequest(requestReturned){
  const myRequest = new Request('https://api.openchargemap.io/v2/poi/?output=json&countrycode=UK&maxresults=10&compact=true&verbose=false');
  fetch(myRequest)
  .then(response => {
    if (response.status === 200) {
      return(response.json());
    } else {
      throw new Error('Something went wrong on api server!');
    }
  })
  .then(response => {
    requestReturned(response);
    // ...
  }).catch(error => {
    console.error(error);
  });
}

  /**
   * Called once the vis is setup
   * Calls to other functions that will 
   * render data, and attach listeners
   */
  vzIsSetUp = () => {
    // this.renderTheViz(this.data)
    this.attatchRerenderListeners();
    this.makeRequest(
      (res) => {
        res.forEach((each, i) => {
          this.data.push({lat: each.AddressInfo.Latitude, lon: each.AddressInfo.Longitude})
        })
        this.renderTheViz(this.data);
      }
    ) ;
  }

  /**
   * Specify's the intial properties of the map, then creates it
   */
  renderTheMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXN5a2VzIiwiYSI6ImNqajE3cTJkZDBubGMzcW4zZDIydmxnOHcifQ._-KnhpPwutwQ6ZQ3kVa4KQ';    

    this.map = new mapboxgl.Map({
      container: 'mapContainer',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [0, 51.5],
      zoom: 9,
      accessToken: 'pk.eyJ1IjoiYXN5a2VzIiwiYSI6ImNqajE3cTJkZDBubGMzcW4zZDIydmxnOHcifQ._-KnhpPwutwQ6ZQ3kVa4KQ'
    });
  }

  getLL = (d) => {
    return mapboxgl.LngLat.convert({lng: +d.lon, lat: +d.lat})
  }

  /**
   * Calculate the scale given mapbox state (derived from viewport-mercator-project's code) 
   * to define a d3 projection
   */
  getMercatorProjection = (d) => {
    return this.map.project(this.getLL(d));
  }

  /**
   * Renders content based on new data onto the svg layer
   * Note: the viz must already have been set up. Call setUpD3Viz() first. 
   */
  renderTheViz = (data) => {

    const points = data;
    
    this.dots = this.svg
      .selectAll("circle.dot")
      .data(points)

    this.dots.enter()
    .append("circle")
    .classed("dot", true)
    .attr("r", 1)
    .attr("style", "fill: #0082a3; fill-opacity: 0.6; stroke: #004d60; stroke-width: 1")
    .transition()
    .duration(1000)
    .attr("r", 6)
    
    this.dots
    .attr("cx",  (d) => { 
        return this.getMercatorProjection(d).x;
      })
      .attr("cy", (d) => { 
        return this.getMercatorProjection(d).y;
      })
  }

  /**
   * Called once, sets everything up, so that the viz can be rendered
   */

  setUpD3Viz = (doneCb) => {
    // Setup our svg layer to manipulate with d3
    var container = this.map.getCanvasContainer()
    this.svg = d3.select(container)
    .append("svg")
    .attr("class", "map-layer-svg")
   
    // Callback will render the data, and attach the listeners
    doneCb();
  }

  /**
   * Listens for changes in the page or map, 
   * and calls to re-renders the data points
   */
  attatchRerenderListeners = () => {
    this.map.on("viewreset", () => {
      this.renderTheViz(this.data)
    })
    this.map.on("move", () => {
      this.renderTheViz(this.data)
    })
  }

}

export default TheMap
