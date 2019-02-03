import * as React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { MapData } from '../dummydata/mapData';
import { Region, ToiletMarker, ElevatorMarker, GuideLine, Gate } from 'src/domains/map';
import { Movie } from 'src/domains/movie';
import MovieNavigateComponent from '../components/movieComponents/MovieNavigateComponent';
import MapViewComponent from '../components/mapComponents/MapViewComponent';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { Modal } from '../components/Modal';
import Colors from 'src/constants/Colors';

interface Props { navigation: any; }

type ScreenName = 'video' | 'map';
type Carousel = (Movie | Gate);

interface BaseState {
  currentScreen: ScreenName | undefined;
  showModal: boolean;
}

export interface ActiveMapState extends BaseState{
  indoorLevel: string;
  initializedLocation: Region | undefined;
  movieMarkers: Movie[] | undefined;
  toiletMarkers: ToiletMarker[] | undefined;
  elevatorMarkers: ElevatorMarker[] | undefined;
  guideLines: GuideLine[] | undefined;
  movies: Movie[];
  carouselMarker?: Carousel;
  firstItem: number;
  start_gate: Gate;
  end_gate: Gate;
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

  readonly state: State = {
    currentScreen: undefined,
    showModal: false,
    carouselMarker: undefined,
  };

  public componentDidMount () {
    // FIXME 2回目以降はAsyncStorageとか使って以前のScreenを参照するようにしたい
    const currentScreen = this.state.currentScreen === 'video' ? 'video' : 'map'; // defaultは'map'

    if (currentScreen === 'map') {
      this.setState({
        currentScreen,
        indoorLevel: MapData.indoorLevel,
        initializedLocation: MapData.initializedLocation,
        movieMarkers: MapData.movies,
        guideLines: MapData.guideLines,
        elevatorMarkers: MapData.elevatorMarkers,
        movies: MapData.movies,
        start_gate: MapData.start_gate,
        end_gate: MapData.end_gate,
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

  public componentWillUpdate (nextProps: Props, nextState: State) {
    if (this.state.indoorLevel !== nextState.indoorLevel) this.setState({carouselMarker: undefined});
  }

  public render () {
    // NITS もう少し厳密に判断した方がいい説 :thinking:
    if (this.state.currentScreen == undefined) return null; // TODO loading animation
    if ((this.state.indoorLevel !== undefined) && (this.state.movieId !== undefined)) return null;

    const {
      indoorLevel, initializedLocation, start_gate, end_gate,
      toiletMarkers, elevatorMarkers, guideLines, movies,
    } = this.state;

    const carousel = [start_gate, ...movies, end_gate];
    let currentCarousel = carousel.filter(movie => movie.floor === this.state.indoorLevel);

    return (
      <View style={styles.content_wrap}>
        <MapViewComponent
          indoorLevel={indoorLevel}
          initializedLocation={initializedLocation!}
          movieMarkers={this.createMovieMarkers()}
          toiletMarkers={toiletMarkers}
          elevatorMarkers={elevatorMarkers}
          guideLines={guideLines}
          changeIndoorLevel={this.changeIndoorLevel}
          carouselMarker={this.state.carouselMarker}
          changeCarousel={this.changeCarousel.bind(this)}
          start_gate={this.state.start_gate}
          end_gate={this.state.end_gate}
        />
        {/* TODO
          MapComponentは常に表示して、ビデオを出し分けるなどしたい
        */}
        <Modal modalView={this.state.showModal}>
          <Carousel
            data={currentCarousel}
            itemWidth={Dimensions.get('screen').width * 0.8}
            sliderWidth={Dimensions.get('screen').width}
            sliderHeight={Dimensions.get('screen').height}
            renderItem={this.carouselRenderItem}
            lockScrollWhileSnapping={true}
            onSnapToItem={this.carouselOnSnapToItem}
            inactiveSlideShift={0.1}
            firstItem={this.carouselFirstItem(currentCarousel)}
          />
          <Pagination
            activeDotIndex={this.carouselFirstItem(currentCarousel) ? this.carouselFirstItem(currentCarousel) : 0}
            dotsLength={currentCarousel.length}
            dotStyle={styles.paginationDotStyle}
          />
        </Modal>
        { currentCarousel.length !== 0 ?
          <View style={styles.showModalBottomAround}>
            <TouchableOpacity onPress={this.changeModal.bind(this, Carousel)} style={styles.showModalBottom} >
              <Text style={styles.showModalBottomText}>OPEN</Text>
            </TouchableOpacity>
          </View> : null
        }
      </View>
    );
  }

  private carouselRenderItem = () => {
    return <View style={styles.carousel}></View>;
  }

  private carouselOnSnapToItem = (index: number) => {
    if (this.state.movies == undefined) return;

    const carousel = [this.state.start_gate, ...this.state.movies, this.state.end_gate];
    const currentCarousel = carousel.filter(movie => movie.floor === this.state.indoorLevel);
    return this.changeInitializedLocation(currentCarousel[index]);
  }

  private changeModal = () => {
    this.setState({
      showModal: this.state.showModal ? false : true,
    });
  }

  private changeIndoorLevel = (nextIndoorLevel: string) => {
    const validatedIndoorLevel = nextIndoorLevel.replace(/階/, '');
    const indoorLevel = validatedIndoorLevel.substr(-2);
    this.setState({ indoorLevel });
  }

  private changeInitializedLocation = (carousel: Carousel) => {
    const centerLatitude = -0.0006;
    const latitude = carousel.latitude + centerLatitude;
    this.setState({
      initializedLocation: {
        latitude: latitude,
        longitude: carousel.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      },
      carouselMarker: carousel,
    });
  }

  private createMovieMarkers = () => {
    if (this.state.movieMarkers == undefined) return;
    if (this.state.carouselMarker == undefined) return this.state.movieMarkers;
    if (this.state.carouselMarker === this.state.start_gate || this.state.carouselMarker === this.state.end_gate) return this.state.movieMarkers;

    const carouselMarkerId = this.state.carouselMarker.id;
    return this.state.movieMarkers.filter(movieMarker => movieMarker.id !== carouselMarkerId);
  }

  private changeCarousel = (carouselMarker: Carousel) => {
    const centerLatitude = -0.0006;
    const latitude = carouselMarker.latitude + centerLatitude;
    this.setState({
      showModal: true,
      carouselMarker: carouselMarker,
      initializedLocation: {
        latitude: latitude,
        longitude: carouselMarker.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      },
    });
  }

  private carouselFirstItem = (currentCarousel: Carousel[]) => {
    const carouselMarker = this.state.carouselMarker;
    if(carouselMarker == undefined) return;

    return currentCarousel.indexOf(carouselMarker);
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
    backgroundColor: 'red',
    justifyContent: 'center',
  },
  showModalBottom: {
    width: width * 0.42,
    height: height * 0.3,
    backgroundColor: 'red',
  },
  showModalBottomText: {
    bottom: 0,
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  showModalBottomAround: {
    width: width,
    height: width * 0.1,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  carousel: {
    width: width * 0.79,
    height: height * 0.33,
    backgroundColor: 'red',
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
  },
  view: {
    width: width,
    height: '50%',
    backgroundColor: 'rgba(50, 50, 50, 1)',
  },
  paginationDotStyle: {
    backgroundColor: '#fff',
    marginBottom: height * 0.03,
    marginTop: height * -0.025,
  },
});
