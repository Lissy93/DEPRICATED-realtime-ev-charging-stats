import React, { Component } from "react";
import Link from 'gatsby-link';
import * as d3 from "d3";
import * as hexbin from "d3-hexbin";
import * as ss from 'simple-statistics';
import mapboxgl from 'mapbox-gl';
import { css } from 'glamor'

const mapStyle = css({
  width: '100%',
  height: '90%'
});

const theMapContainerStyles = css({ 
  height: '100%' 
});



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
  
    componentWillMount() {

    }

  componentDidMount =  () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXN5a2VzIiwiYSI6ImNqajE3cTJkZDBubGMzcW4zZDIydmxnOHcifQ._-KnhpPwutwQ6ZQ3kVa4KQ';

    var map = new mapboxgl.Map({
      container: 'mapContainer',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [-74.50, 40],
      zoom: 9,
      accessToken: 'pk.eyJ1IjoiYXN5a2VzIiwiYSI6ImNqajE3cTJkZDBubGMzcW4zZDIydmxnOHcifQ._-KnhpPwutwQ6ZQ3kVa4KQ'
    });

    // this.renderStuff();
  }

  // renderStuff = () => {
  //       //**********************************************************************************
  //       //********  LEAFLET HEXBIN LAYER CLASS *********************************************
  //       //**********************************************************************************
  //       L.HexbinLayer = L.Class.extend({
  //         includes: L.Mixin.Events,
  //         initialize: function (rawData, options) {
  //           this.levels = {};
  //           this.layout = d3.hexbin().radius(10);
  //           this.rscale = d3.scale.sqrt().range([0, 10]).clamp(true);
  //           this.rwData = rawData;
  //           this.config = options;
  //         },
  //         project: function(x) {
  //           var point = this.map.latLngToLayerPoint([x[1], x[0]]);
  //           return [point.x, point.y];
  //         },
  //         getBounds: function(d) {
  //           var b = d3.geo.bounds(d)
  //           return L.bounds(this.project([b[0][0], b[1][1]]), this.project([b[1][0], b[0][1]]));
  //         },
  //         update: function () {
  //           var pad = 100, xy = this.getBounds(this.rwData), zoom = this.map.getZoom();

  //           this.container
  //             .attr("width", xy.getSize().x + (2 * pad))
  //             .attr("height", xy.getSize().y + (2 * pad))
  //             .style("margin-left", (xy.min.x - pad) + "px")
  //             .style("margin-top", (xy.min.y - pad) + "px");

  //           if (!(zoom in this.levels)) {
  //               this.levels[zoom] = this.container.append("g").attr("class", "zoom-" + zoom);
  //               this.genHexagons(this.levels[zoom]);
  //               this.levels[zoom].attr("transform", "translate(" + -(xy.min.x - pad) + "," + -(xy.min.y - pad) + ")");
  //           }
  //           if (this.curLevel) {
  //             this.curLevel.style("display", "none");
  //           }
  //           this.curLevel = this.levels[zoom];
  //           this.curLevel.style("display", "inline");
  //         },
  //         genHexagons: function (container) {
  //           var data = this.rwData.features.map(function (d) {
  //             var coords = this.project(d.geometry.coordinates)
  //             return [coords[0],coords[1], d.properties];
  //           }, this);

  //           var bins = this.layout(data);
  //           var hexagons = container.selectAll(".hexagon").data(bins);

  //           var counts = [];
  //           bins.map(function (elem) { counts.push(elem.length) });
  //           this.rscale.domain([0, (ss.mean(counts) + (ss.standard_deviation(counts) * 3))]);

  //           var path = hexagons.enter().append("path").attr("class", "hexagon");
  //           this.config.style.call(this, path);

  //           that = this;
  //           hexagons
  //             .attr("d", function(d) { return that.layout.hexagon(that.rscale(d.length)); })
  //             .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
  //             .on("mouseover", function (d) { 
  //               var s=0, k=0;
  //               d.map(function(e){
  //                 if (e.length === 3) e[2].group === 1 ? ++k : ++s;
  //               });
  //               that.config.mouse.call(this, [s,k]);
  //               d3.select("#tooltip")
  //                 .style("visibility", "visible")
  //                 .style("top", function () { return (d3.event.pageY - 130)+"px"})
  //                 .style("left", function () { return (d3.event.pageX - 130)+"px";})
  //             })
  //             .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });
  //         },
  //         addTo: function (map) {
  //           map.addLayer(this);
  //           return this;
  //         },
  //         onAdd: function (map) {
  //           this.map = map;
  //           var overlayPane = this.map.getPanes().overlayPane;

  //           if (!this.container || overlayPane.empty) {
  //               this.container = d3.select(overlayPane)
  //                   .append('svg')
  //                       .attr("id", "hex-svg")
  //                       .attr('class', 'leaflet-layer leaflet-zoom-hide');
  //           }
  //           map.on({ 'moveend': this.update }, this);
  //           this.update();
  //         }
  //       });

  //       L.hexbinLayer = function (data, styleFunction) {
  //         return new L.HexbinLayer(data, styleFunction);
  //       };
  //       //**********************************************************************************
  //       //********  IMPORT DATA AND REFORMAT ***********************************************
  //       //**********************************************************************************
  //         console.log(coffee);

  //         function reformat (array) {
  //           var data = [];
  //           array.map(function (d){
  //             data.push({
  //               properties: {
  //                 group: +d.group,
  //                 city: d.city,
  //                 state: d.state,
  //                 store: d.storenumber
  //               }, 
  //               type: "Feature", 
  //               geometry: {
  //                 coordinates:[+d.longitude,+d.latitude], 
  //                 type:"Point"
  //               }
  //             });
  //           });
  //           return data;
  //         }
  //         var geoData = { type: "FeatureCollection", features: reformat(coffee) };
  //         //**********************************************************************************
  //         //********  CREATE LEAFLET MAP *****************************************************
  //         //**********************************************************************************
  //         var cscale = d3.scaleLinear().domain([0,1]).range(["#00FF00","#FFA500"]);

  //         // PLEASE DO NOT USE MY MAP ID :)  YOU CAN GET YOUR OWN FOR FREE AT MAPBOX.COM
  //         var leafletMap = L.mapbox.map('mapContainer', 'pk.eyJ1IjoiYXN5a2VzIiwiYSI6ImNqajE3cTJkZDBubGMzcW4zZDIydmxnOHcifQ._-KnhpPwutwQ6ZQ3kVa4KQ')
  //             .setView([40.7, -73.8], 11);

  //             mapboxgl.accessToken = 'pk.eyJ1IjoiYXN5a2VzIiwiYSI6ImNqajE3cTJkZDBubGMzcW4zZDIydmxnOHcifQ._-KnhpPwutwQ6ZQ3kVa4KQ';
  //               var map = new mapboxgl.Map({
  //               container: 'mapContainer',
  //               style: 'mapbox://styles/mapbox/streets-v10'
  //               });

  //         //**********************************************************************************
  //         //********  ADD HEXBIN LAYER TO MAP AND DEFINE HEXBIN STYLE FUNCTION ***************
  //         //**********************************************************************************
  //         var hexLayer = L.hexbinLayer(geoData, { 
  //                           style: hexbinStyle,
  //                           mouse: makePie
  //                         }).addTo(leafletMap);

  //         function hexbinStyle(hexagons) {
  //           hexagons
  //             .attr("stroke", "black")
  //             .attr("fill", function (d) {
  //               var values = d.map(function (elem) {
  //                 return elem[2].group;
  //               })
  //               var avg = d3.mean(d, function(d) { return +d[2].group; })
  //               return cscale(avg);
  //             });
  //         }

  //         //**********************************************************************************
  //         //********  PIE CHART ROLL-OVER ****************************************************
  //         //**********************************************************************************
  //         function makePie (data) {

  //           d3.select("#tooltip").selectAll(".arc").remove()
  //           d3.select("#tooltip").selectAll(".pie").remove()

  //           var arc = d3.svg.arc()
  //               .outerRadius(45)
  //               .innerRadius(10);

  //           var pie = d3.layout.pie()
  //               .value(function(d) { return d; });

  //           var svg = d3.select("#tooltip").select("svg")
  //                       .append("g")
  //                         .attr("class", "pie")
  //                         .attr("transform", "translate(50,50)");

  //           var g = svg.selectAll(".arc")
  //                     .data(pie(data))
  //                     .enter().append("g")
  //                       .attr("class", "arc");

  //               g.append("path")
  //                 .attr("d", arc)
  //                 .style("fill", function(d, i) { return i === 1 ? 'orange':'green'; });

  //               g.append("text")
  //                   .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
  //                   .style("text-anchor", "middle")
  //                   .text(function (d) { return d.value === 0 ? "" : d.value; });
  //         }
  // }

}

export default TheMap
