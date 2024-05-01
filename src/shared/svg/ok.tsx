import React from 'react';
import { View } from 'react-native';
import { Svg, Rect, Defs, Pattern, Image, Use } from 'react-native-svg';
import { Marker, G, Path } from "react-native-svg";

export default class App extends React.Component {
  
  render() {
    return (
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width="275"
          height="200"
          viewBox="0 0 275 200"
        >
          <Defs>
            <Marker
              id="Triangle"
              viewBox="0 0 10 10"
              refX="1"
              refY="5"
              markerUnits="strokeWidth"
              markerWidth="4"
              markerHeight="3"
              orient="auto"
            >
              <Path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
            </Marker>
          </Defs>

          <G fill="none" strokeWidth="10" markerEnd="url(#Triangle)">
            <PlatformPath
              ref={this.refPath}
              stroke="crimson"
              d="M 100,75 C 125,50 150,50 175,75"
              markerEnd="url(#Triangle)"
            />
            <PlatformPath
              stroke="olivedrab"
              d="M 175,125 C 150,150 125,150 100,125"
              markerEnd="url(#Triangle)"
            />
          </G>
        </Svg>
    );
  }
}