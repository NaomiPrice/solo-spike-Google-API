import React, {Component} from 'react';
import Script from 'react-load-script';

class Search extends Component{
    //set up search bar that will allow  user to type restaurant name and will search Google Places API while user types to pick actual restaurant. 
    state = {
        name: '',
        address: '',
        price_level: '',
        placeLat: '',
        placeLng: '',
        userLat: '',
        userLng: '',
    };

    autocomplete = null;

    handleScriptLoad = ()=>{
        //define google as the global google brought in when script loads and google API is hit
        const google = window.google;
        //set search options as defined by google
        let options = {
            types: ['establishment'],
            fields: ['place_id', 'name', 'types', 'price_level', 'formatted_address', 'geometry']
        }
        // Get the HTML input element for the autocomplete search box
        let input = document.getElementById('pac-input');
        //create the autocomplete object
        this.autocomplete = new google.maps.places.Autocomplete(input, options);
        window.au = this.autocomplete
        this.autocomplete.addListener('place_changed', this.placeChangeHandler);
    }
    
    placeChangeHandler = ()=>{
        console.log('place was changed!')
        
        let thePlace = this.autocomplete.getPlace();
        console.log(thePlace);
        this.setState({
            name: thePlace.name,
            address: thePlace.formatted_address,
            price_level: thePlace.price_level,
            placeLat: thePlace.geometry.location.lat(),
            placeLng: thePlace.geometry.location.lng(),

        })
    }

    displayPriceLevel = ()=>{
        switch(this.state.price_level){
            case 1:
                return '$'
            case 2:
                return '$$'
            case 3:
                return '$$$'
            case 4:
                return '$$$$'
            case 5:
                return '$$$$$'
            default:
                return '0'
        }
    }
    getMyDistance = (lat1, lon1, lat2, lon2, unit)=> {
        if(!lat1 || !lon1 || !lat2 || !lon2){
            return 0;
        }
        //calculate distance distance between two points with latitudet and longitude
        const radlat1 = Math.PI * lat1/180
        const radlat2 = Math.PI * lat2/180
        const theta = lon1-lon2
        const radtheta = Math.PI * theta/180
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit==="K") { dist = dist * 1.609344 }
        if (unit==="N") { dist = dist * 0.8684 }
        return dist
    }
    componentDidMount = ()=>{
        this.geolocate();
    }
    geolocate = ()=> {
        //get geolocation as supplied by brwoser's navigator.geolocation object
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position)=>{
            this.setState({
                userLat: position.coords.latitude,
                userLng: position.coords.longitude,
            })  
          });
        }
      }
    
    render(){
        const distance = this.getMyDistance(this.state.placeLat, this.state.placeLng, this.state.userLat, this.state.userLng, "M")
        let urlToUse = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&libraries=places`
    
        // Map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
       
        return (
            <div>
                 <Script url={urlToUse}          
                         onLoad={this.handleScriptLoad}        
                />
                <input id="pac-input" className="controls" type="text" size="50" placeholder="Type Resturant Here"></input>
                <div className="displayInfo">
                    <p>Name: {this.state.name}</p>
                    <p>Address: {this.state.address}</p>
                    <p>Price Level: {this.displayPriceLevel()}</p>
                    <p>Distance from current location: {Math.round(distance * 100)/100} miles</p>
            
                </div>
            </div>
        )
    }
}

export default Search; 