import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapViewComponent from './mapComponents/MapViewComponent';

interface Props {
  indoorLevel: string;
  initializedLocation: InitializedLocation;
  movieMarkers?: MovieMarkers[];
  publicFacilityMarkers?: PublicFacilityMarkers[];
  guideLines: guideLines[];
  currentScreen: string;
  screenChange: any;
  changeIndoorLevel: any;
}

interface MovieMarkers {
  floor: string;
  movieId: number;
  latitude: number;
  longitude: number;
}

interface PublicFacilityMarkers {
  floor: string;
  type: 'toilet' | 'elevator';
  latitude: number;
  longitude: number;
}

interface InitializedLocation {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface guideLines {
    floor: string;
    latitude: number;
    longitude: number;
  }

export default class SubWindow extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const currentScreen = this.props.currentScreen === 'map' ? this.mapScreen() : this.videoScreen();
    return (
      <View style={style.container}>
        {currentScreen}
      </View>
    );
  }

  private mapScreen() {
    return (
      <MapViewComponent
        indoorLevel={this.props.indoorLevel}
        initializedLocation={this.props.initializedLocation}
        movieMarkers={this.props.movieMarkers}
        publicFacilityMarkers={this.props.publicFacilityMarkers}
        guideLines={this.props.guideLines}
        changeIndoorLevel={this.props.changeIndoorLevel}
      />
    );
  }

  private videoScreen() {
    return (
      <View style={style.container}></View>
    );
  }
}

const {width, height} = Dimensions.get('screen');

const style = StyleSheet.create({
  container: {
    width: width,
    height: height,
    position: 'absolute',
    backgroundColor: '#000000',
  },
});
