import * as React from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { DummyData } from '../components/mapComponents/DummyData';
import { Region, MovieMarker, ToiletMarker, ElevatorMarker, GuideLine } from 'src/domains/map';
import MovieNavigateComponent from '../components/movieComponents/MovieNavigateComponent';
import SubMovieComponent from '../components/movieComponents/SubMovieComponent';
import MapViewComponent from '../components/mapComponents/MapViewComponent';
import { AuthSession } from 'expo';

interface Props { navigation: any; }

type ScreenName = 'video' | 'map';

interface BaseState {
  currentScreen: ScreenName | undefined;
  modalFlg: boolean;
}

export interface ActiveMapState extends BaseState{
  indoorLevel: string;
  initializedLocation: Region | undefined;
  movieMarkers: MovieMarker[] | undefined;
  toiletMarkers: ToiletMarker[] | undefined;
  elevatorMarkers: ElevatorMarker[] | undefined;
  guideLines: GuideLine[] | undefined;
}

interface ActiveMovieState extends BaseState {
  movieId: string;
  thumbnails: string[];
  // FIXME 必要なものがわからん
}

type State = ActiveMapState & ActiveMovieState;

export default class GuideScreen extends React.Component<Props, State> {
  public static navigationOptions = {
    headerStyle: { display: 'none' },
  };

  readonly state: State = { currentScreen: undefined, modalFlg: false };

  public componentDidMount () {
    // FIXME 2回目以降はAsyncStorageとか使って以前のScreenを参照するようにしたい
    const currentScreen = this.state.currentScreen === 'video' ? 'video' : 'map'; // defaultは'map'

    if (currentScreen === 'map') {
      this.setState({
        currentScreen,
        indoorLevel: DummyData.indoorLevel,
        initializedLocation: DummyData.initializedLocation,
        movieMarkers: DummyData.movieMarkers,
        guideLines: DummyData.guideLines,
        elevatorMarkers: DummyData.elevatorMarkers,
      });
    } else {
      // TODO set movie states...
      this.setState({
        currentScreen,
        movieId: 'tmpState', // tmp
        thumbnails: ['OwSekWSe7NM', 'OwSekWSe7NM', 'OwSekWSe7NM', 'OwSekWSe7NM', 'OwSekWSe7NM'],
      });
    }
  }

  public render () {
    // NITS もう少し厳密に判断した方がいい説 :thiking:
    if (this.state.currentScreen == undefined) return null; // TODO loading animation
    if ((this.state.indoorLevel !== undefined) && (this.state.movieId !== undefined)) return null;

    const {
      currentScreen, indoorLevel, initializedLocation, movieMarkers,
      toiletMarkers, elevatorMarkers, guideLines,
    } = this.state;

    return (
      <View style={styles.content_wrap}>
         {
           currentScreen === 'map' ? (
             <>
              <MapViewComponent
                indoorLevel={indoorLevel}
                initializedLocation={initializedLocation!}
                movieMarkers={movieMarkers}
                toiletMarkers={toiletMarkers}
                elevatorMarkers={elevatorMarkers}
                guideLines={guideLines}
                changeIndoorLevel={this.changeIndoorLevel}
              />
             </>
          ) : ( <MovieNavigateComponent />)
         }
        {/* TODO
          MapComponentは常に表示して、ビデオを出し分けるなどしたい
        */}
        {/* <View style={styles.modal}> */}
            <Modal
              visible={this.state.modalFlg}
              animationType={'slide'}
              transparent={true}
            >
              <View style={styles.modalInViewAround}>
                <View style={styles.modalInView}></View>
              </View>
              <View style={styles.modalFlgBottomAround}>
                <TouchableOpacity onPress={() => this.changeModalFlg()} style={styles.modalFlgBottom} />
              </View>
            </Modal>
        {/* </View> */}
          <View style={styles.modalFlgBottomAround}>
            <TouchableOpacity onPress={() => this.changeModalFlg()} style={styles.modalFlgBottom} />
          </View>
      </View>
    );
  }

  private changeActiveScreen = () => {
    const currentScreen = this.state.currentScreen === 'map' ? 'video' : 'map';
    this.setState({ currentScreen });
  }

  private changeIndoorLevel = (nextIndoorLevel: string) => {
    const validatedIndoorLevel = nextIndoorLevel.replace(/階/, '');
    const indoorLevel = validatedIndoorLevel.substr(-2);
    this.setState({ indoorLevel });
  }

  private changeModalFlg() {
    const nextModalFlg = !this.state.modalFlg;
    this.setState({
      modalFlg: nextModalFlg,
    });
  }
}

EStyleSheet.build();
const {width, height} = Dimensions.get('screen');

const styles = EStyleSheet.create({
  content_wrap: {
    flex: 1,
    top: 0,
    position: 'relative',
    //marginBottom: height * 0.07,
  },
  thumbnails: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 90,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
  thumbnailImage: {
    width: 120,
    height: 90,
  },
  modal: {
    width: width * 0.79,
    height: height * 0.48,
    backgroundColor: 'red',
    marginBottom: height * 0.1,
  },
  modalInView: {
    width: width * 0.79,
    height: height * 0.48,
    position: 'absolute',
    bottom: 0,
    // marginRight: 'auto',
    // marginLeft: 'auto',
    backgroundColor: 'red',
    justifyContent: 'center',
  },
  modalInViewAround: {
    width: width,
    height: height * 0.48,
    position: 'absolute',
    bottom: 0,
    marginBottom: height * 0.1,
    backgroundColor: '#ffffff',
  },
  modalFlgBottom: {
    width: width * 0.42,
    height: height * 0.06,
    backgroundColor: 'red',
  },
  modalFlgBottomAround: {
    width: width,
    height: width * 0.07,
    position: 'absolute',
    bottom: 0,
    //marginBottom:  height * 0.07,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
