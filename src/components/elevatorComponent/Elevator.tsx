import * as React from 'react';
import { View, Text, Dimensions, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Color from '../../constants/Colors';

interface Props {
  size: string;
  name: string;
}

export const Elevator: React.FC<Props> = props => {
  return (
    <View style={styles.container} >
      <Image
        source={require('../../../assets/images/elevator_setting_big.png')}
        style={styles.leftContainer}
      ></Image>
      <View style={styles.centerContainer}>
        <Text style={styles.centerContainerTop}>{props.name}</Text>
      <Text style={styles.sizeText}>収容人数：{props.size}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.rightContainerTop}>○</Text>
        <Text style={styles.rightContainerBottom}>使用可能</Text>
      </View>
    </View>
  );
};

EStyleSheet.build({});
const {width, height} = Dimensions.get('screen');

const styles = EStyleSheet.create({
  container: {
    width: `${width} * 0.89`,
    height: `${height} * 0.11`,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: height * 0.02,
    marginBottom: height * 0.02,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderColor: Color.mainColor,
    borderWidth: 1,
    borderRadius: 3,
  },
  leftContainer: {
    width: `${width} * 0.14`,
    height: `${height} * 0.08`,
  },
  centerContainer: {
    marginTop: 3,
    marginLeft: 18,
    marginRight: 10,
    width: `${width} * 0.46`,
    // height: `${height} * 0.05`,
  },
  centerContainerTop: {
    fontSize: 16,
    color: Color.white,
    lineHeight: 22,
    fontFamily: 'MPLUS1p-Medium',
  },
  rightContainer: {
    width: `${width} * 0.13`,
    marginTop: -8,
    // height: `${height} * 0.06`,
  },
  rightContainerTop: {
    fontSize: 45,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: Color.mainColor,
  },
  rightContainerBottom: {
    fontSize: 12,
    marginTop: -4,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: Color.mainColor,
    fontWeight: '700',
  },
  sizeText: {
    lineHeight: 22,
    color: Color.white,
    fontFamily: 'MPLUS1p-Medium',
  },
});
