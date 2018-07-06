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

  /**
   * Called once the vis is setup
   * Calls to other functions that will 
   * render data, and attach listeners
   */
  vzIsSetUp = () => {
    this.renderTheViz()
    this.attatchRerenderListeners();
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

  /**
   * TODO - delete this, we'll have real data soon :)
   */
  fakeData() {
    return {
      "type": "Topology",
      "objects": {
        "london_stations":{
          "type": "GeometryCollection",
            "crs": {
              "type": "name",
              "properties": {
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
              }
            },
            "geometries": [
              {
                "type": "Point",
                "properties": {
                  "id": "940GZZDLALL",
                  "lines": [
                    {
                      "name": "DLR"
                    }
                  ]
                },
                "coordinates": [
                  7363,
                  4635
                ]
              },
              {
                "type": "Point",
                "properties": {
                  "id": "940GZZDLBEC",
                  "lines": [
                    {
                      "name": "DLR"
                    }
                  ]
                },
                "coordinates": [
                  7931,
                  4733
                ]
              },
              {
                "type": "Point",
                "properties": {
                  "id": "940GZZDLBLA",
                  "lines": [
                    {
                      "name": "DLR"
                    }
                  ]
                },
                "coordinates": [
                  7408,
                  4559
                ]
              },
              {
                "type": "Point",
                "properties": {
                  "id": "940GZZDLBOW",
                  "lines": [
                    {
                      "name": "DLR"
                    }
                  ]
                },
                "coordinates": [
                  7303,
                  5104
                ]
              },
              {
                "type": "Point",
                "properties": {
                  "id": "940GZZDLBPK",
                  "lines": [
                    {
                      "name": "DLR"
                    }
                  ]
                },
                "coordinates": [
                  7885,
                  4580
                ]
              },
              {
                "type": "Point",
                "properties": {
                  "id": "940GZZDLCAN",
                  "lines": [
                    {
                      "name": "DLR"
                    }
                  ]
                },
                "coordinates": [
                  7303,
                  4482
                ]
              },
              {
                "type": "Point",
                "properties": {
                  "id": "940GZZLUCGT",
                  "lines": [
                    {
                      "name": "Jubilee"
                    },
                    {
                      "name": "DLR"
                    }
                  ]
                },
                "coordinates": [
                  7526,
                  4727
                ]
              },
              {
                "type": "Point",
                "properties": {
                  "id": "940GZZDLCLA",
                  "lines": [
                    {
                      "name": "DLR"
                    }
                  ]
                },
                "coordinates": [
                  7352,
                  4225
                ]
              },
            ]
        }
      },
      "arcs": [
        
      ],
      "transform": {
        "scale": [
          0.00013036513651365137,
          0.00003629303263344896
        ],
        "translate": [
          -0.9729138,
          51.3424955666981
        ]
      }
    };
  }

  /**
   * Calculate the scale given mapbox state (derived from viewport-mercator-project's code) 
   * to define a d3 projection
   */
  getMercatorProjection = () => {
    const bbox = document.body.getBoundingClientRect();
    const center = this.map.getCenter();
    const zoom = this.map.getZoom();
    const scale = (512) * 0.5 / Math.PI * Math.pow(2, zoom); // 512 is hard-coded tile size
    const d3projection = d3.geo.geoMercator()
      .center([center.lng, center.lat])
      .translate([bbox.width/2, bbox.height/2])
      .scale(scale);
    return d3projection;
  }

  /**
   * Renders content based on new data onto the svg layer
   * Note: the viz must already have been set up. Call setUpD3Viz() first. 
   */
  renderTheViz = () => {

    const d3Projection = this.getMercatorProjection();
    const path = d3.geo.geoPath()
    path.projection(d3Projection)

    const data = this.fakeData();
    const points = topojson.feature(data, data.objects.london_stations)
    
    this.dots = this.svg
      .selectAll("circle.dot")
      .data(points.features)

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
        var x = d3Projection(d.geometry.coordinates)[0];
        return x
      })
      .attr("cy", (d) => { 
        var y = d3Projection(d.geometry.coordinates)[1];
        return y
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
      this.renderTheViz()
    })
    this.map.on("move", () => {
      this.renderTheViz()
    })
  }

}

export default TheMap
