import * as React from 'react';
import { Text, View, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Color from '../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import mapMarker from '../../assets/images/marker.png';

interface Props {
  stationName: string;
  startGateName: string;
  endGateName: string;
}

const NavigationPlate: React.FC<Props> = props => (
  <View style={styles.container}>
    <StatusBar barStyle='light-content' />
    <View style={styles.leftContainer}>
      <Image source={mapMarker} style={styles.mapMarkerIcon}/>
      <Text style={styles.stationName}>{props.stationName}</Text>
      <View style={styles.routeContainer}>
        <TouchableOpacity style={styles.gateNameContainer}>
          <Text style={styles.gateName}>{props.startGateName}</Text>
        </TouchableOpacity>
        <Text style={styles.routeOptionText}>▶︎▶︎▶︎</Text>
        <TouchableOpacity style={styles.gateNameContainer}>
          <Text style={styles.gateName}>{props.endGateName}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

EStyleSheet.build({});
const {width, height} = Dimensions.get('screen');

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    width: width,
    height: height * 0.071,
    zIndex: 30,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 30,
    marginTop: height * 0.026,
  },
  mapMarkerIcon: {
    width: 17,
    height: 17,
    marginLeft: 5,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: -3,
  },
  stationName: {
    marginLeft: 5,
    marginRight: 5,
    color: Color.white,
    fontSize: '1rem',
    lineHeight: 30,
    fontFamily: 'MPLUS1p',
  },
  gateNameContainer: {
    backgroundColor: Color.white,
    height: 20,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 50,
    marginLeft: 5,
  },
  gateName: {
    lineHeight: 20,
    fontSize: '0.72rem',
    fontFamily: 'MPLUS1p',
  },
  routeContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  routeOptionText: {
    fontSize: '0.6rem',
    color: Color.subColorRed,
    lineHeight: 30,
    marginLeft: 5,
    fontFamily: 'MPLUS1p',
    letterSpacing: -1,
  },
  caption: {
    marginHorizontal: 10,
    color: Color.white,
    fontSize: '1.5rem',
    lineHeight: 30,
    fontWeight: '700',
    fontFamily: 'MPLUS1p-Medium',
  },
});

export default NavigationPlate;
