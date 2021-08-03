import React from 'react';
import { Container, Row, Col, } from 'react-bootstrap';
import FindCity from './FindCity';
import axios from 'axios';
import LatLon from './LatLon';
import Map from './Map';
import Weather from './Weather';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayError: false,
            showMap: false,
          
            lat: '',
            loc: '',
            longitude: '',
           
            weather: [],
            errorMessage: '',
            searchQuery: '',
        }
    }

    updateCity = (event) => {
        this.setState({ 
        searchQuery: event.target.value 
        });
    }

    showLocation = async () => {
        const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_MAP_KEY}&q=${this.state.searchQuery}&format=json`;
        let location;

        try {
            location = await axios.get(url)
            this.setState({
                location: location.data[0].display_name,
                lat: location.data[0].lat,
                lon: location.data[0].lon,
                showMap: true,
                displayError: false
            });
            this.displayWeather(location.data[0].lat, location.data[0].lon)

        } catch (error) {
            
            this.setState({
                showMap: false,
                displayError: true,
                errorMessage: "ERROR"
            });
        }
    }

    showWeather = async (lat, lon) => {
        try {
            const weather = await axios.get(`http://localhost:3001/weather?searchQuery=${this.state.searchQuery}&lon=${this.state.lon}&lat=${this.state.lat}`);
            console.log(weather);
            this.setState({
                weather: weather.data
            })
        } catch (error) {
            this.setState({
                showMap: false,
                displayError: true,
                errorMessage: "ERROR"
            })
        }
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <FindCity
                            updateCity={this.updateCity}
                            showLocation={this.showLocation}
                            hasError={this.state.showWeather}
                        />
                    </Col>
                </Row>
                {this.state.showMap &&
                    <>
                        <Row>
                            <Col>
                                <LatLon
                                    city={this.state.location}
                                    lat={this.state.lat}
                                    lon={this.state.lon}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Map
                                    imgaeurl={`https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_MAP_KEY}&center=${this.state.lat},${this.state.lon}&format=jpg`}
                                    city={this.state.location}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Weather
                                    weather={this.state.weather}
                                />
                            </Col>
                        </Row>
                    </>
                }
            </Container>
        )
    }
}

export default Main;