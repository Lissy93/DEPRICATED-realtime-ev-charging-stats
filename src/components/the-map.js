import React, { Component } from "react";
import Link from 'gatsby-link';
import * as d3 from "d3";

class TheMap extends Component {

  constructor() {
    super();
  }

  render() {
      return (
      <div>   
          <div id="mapContainer"></div>
      </div>
      )
  }

  componentDidMount =  () => {

  }

}

export default TheMap
