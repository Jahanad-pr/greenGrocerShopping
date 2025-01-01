import { useState, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import DeletePopup from "../../../parts/popups/DeletePopup";
import { useAddLocationMutation } from "../../../../services/User/userApi";

const libraries = ["places"];
const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

function Map({userData}) {

    const [ addLocation, { isLoading, data } ] = useAddLocationMutation()

    useEffect(()=>{
        if(data){
        alert(data)
        } 
    },[data]) 

    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ lat: 0, lng: 0 });
    const [distance, setDistance] = useState(0);
    const [zoom, setZoom] = useState(10);
    const [popup, showPopup] = useState(true);
    const [add, showAddPopup] = useState(false);
    const [clickedLocation, setClickedLocation] = useState(null);
    const [locationAddress, setLocationAddress] = useState(null);
    const [used,setUsed] = useState(true);
    const searchRef = useRef(null);
    const [dropdownVisible, setDropdownVisible] = useState({});
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locations, setLocations] = useState([userData?.location?.first, userData?.location?.second, userData?.location?.third]);
    const [editLocation, setEditLocation] = useState(null);

    useEffect(() => {
        setLocations([userData?.location?.first, userData?.location?.second, userData?.location?.third]);
    }, [userData]);

    const toggleDropdown = (index) => {
        setDropdownVisible((prev) => ({ [index]: !prev[index] }));
    };

    const handleCloseMap = () => {
        setOpen(!open);
    };

    const handleLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude, accuracy } = position.coords;
                const newCoords = { lat: latitude, lng: longitude };
                setCoords(newCoords);
                setClickedLocation(newCoords); // Set clicked location to current location
                setDistance(accuracy);
                setZoom(20); // Set maximum zoom when getting current location
                getAddressFromCoords(latitude, longitude);
            });
        }
    };

    const handleZoomIn = () => {
        setZoom((prevZoom) => Math.min(prevZoom + 1, 20));
    };

    const handleZoomOut = () => {
        setZoom((prevZoom) => Math.max(prevZoom - 1, 0));
    };

    const getAddressFromCoords = (lat, lng) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
            { location: { lat, lng } },
            (results, status) => {
                if (status === "OK" && results[0]) {
                    const addressComponents = results[0].address_components;
                    const formattedAddress = {
                        streetNumber: '',
                        route: '',
                        neighborhood: '',
                        locality: '',
                        area: '',
                        state: '',
                        country: '',
                        postalCode: ''
                    };

                    addressComponents.forEach(component => {
                        const type = component.types[0];
                        if (type === 'street_number') formattedAddress.streetNumber = component.long_name;
                        if (type === 'route') formattedAddress.route = component.long_name;
                        if (type === 'neighborhood') formattedAddress.neighborhood = component.long_name;
                        if (type === 'sublocality_level_1') formattedAddress.area = component.long_name;
                        if (type === 'locality') formattedAddress.locality = component.long_name;
                        if (type === 'administrative_area_level_1') formattedAddress.state = component.long_name;
                        if (type === 'country') formattedAddress.country = component.long_name;
                        if (type === 'postal_code') formattedAddress.postalCode = component.long_name;
                    });

                    setLocationAddress(formattedAddress);
                }
            }
        );
    };

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        setClickedLocation({ lat, lng });
        setZoom(20); // Set maximum zoom when clicking on the map
        getAddressFromCoords(lat, lng);
    };

    const handleSearch = () => {
        const autocomplete = new window.google.maps.places.Autocomplete(searchRef.current, {
            fields: ["geometry", "name", "place_id", "formatted_address"],
        });

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setCoords({ lat, lng });
                setClickedLocation({ lat, lng }); // Set clicked location when searching
                setZoom(20);
                getAddressFromCoords(lat, lng);
            } else {
                alert("No details available for the input: '" + searchRef.current.value + "'");
            }
        });
    };

    const renderLocationDetails = () => {
        return ( clickedLocation && locationAddress &&
            <>
            { add && (
                <DeletePopup
                    action={'Set Your Location'}
                    redish={false}
                    deleteData={{
                        locationData:{
                            lat:clickedLocation.lat,
                            lng:clickedLocation.lng,
                            address:locationAddress
                        },
                        position:'third',
                        _id:userData?._id
                    }}
                    showPopup={showAddPopup}
                    updater={addLocation}
                    isUser={true}
                    normal={true}
                />) }
            <div className="mt-4 p-4 px-10 bg-gradient-to-br from-[#ffffff40] to-[#fbfbfb40] backdrop-blur-md bg-gray-50/50 rounded-[30px] rounded-br-[120px] absolute top-96 left-[680px] z-10">
                {clickedLocation && locationAddress && (
                    <div className="mb-4 p-3 rounded shadow-sm">
                        <div className="flex items-center gap-2 mb-5 font-['lufga']">
                            <h4 className="font-semibold">Location Details</h4>
                        </div>
                        <div className="text-sm text-gray-600 space-y-3 text-[25px]">
                            <p className="font-medium  mt-8 text-[20px] mb-3">Coordinates: </p>
                            <p>Latitude: {clickedLocation.lat.toFixed(6)}</p>
                            <p>Longitude: {clickedLocation.lng.toFixed(6)}</p>
                            <br/>
                            <p className="font-medium mt-8 text-[20px]">Address Details:</p>
                            {locationAddress.streetNumber && locationAddress.route && (
                                <p>{locationAddress.streetNumber} {locationAddress.route}</p>
                            )}
                            {locationAddress.neighborhood && (
                                <p>Neighborhood: {locationAddress.neighborhood}</p>
                            )}
                            {locationAddress.area && (
                                <p>Area: {locationAddress.area}</p>
                            )}
                            {locationAddress.locality && (
                                <p>City: {locationAddress.locality}</p>
                            )}
                            {locationAddress.state && (
                                <p>State: {locationAddress.state}</p>
                            )}
                            {locationAddress.country && (
                                <p>Country: {locationAddress.country}</p>
                            )}
                            {locationAddress.postalCode && (
                                <p>Postal Code: {locationAddress.postalCode}</p>
                            )}
                        </div>
                        { !used &&
                        <button onClick={()=>showAddPopup(true)} className='flex justify-start items-center font-bold rounded-full text-white absolute bottom-0 right-0 bg-[linear-gradient(#b4c2ba,#789985)] overflow-hidden w-[70px] h-[70px] hover:scale-125 duration-500 group'>
                            <i className="ri-check-double-line font-thin rounded-full min-w-[70px] text-[25px]  group-hover:-translate-x-full duration-500"></i>
                            <i className="ri-arrow-right-line rounded-full min-w-[70px] text-[25px] group-hover:-translate-x-full duration-500"></i>
                        </button>
                        }
                    </div>
                )}
            </div>
            </>
        );
    };

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey:'AlzaSyZ6MMH1EASe0aF2EN-Xi9FYjsXH7YJEZTX',
        libraries,
    });

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading maps ...</div>;

            return (
            <>    {popup && (
                <DeletePopup
                    action={'Set Current Location'}
                    redish={false}
                    showPopup={showPopup}
                    updater={handleLocation}
                    isUser={true}
                    normal={true}
                />
            )}
                <div className="flex h-screen w-screen">
                    <div className="w-[30%] bg-white p-10 pl-16 shadow-lg overflow-y-auto">
                        <h1 className="text-[35px] font-bold leading-none mt-12">Manage</h1>
                        <h1 className="text-[35px] font-bold leading-none mb-4">Location</h1>
                <p className="text-sm text-gray-500 mb-8 pr-16">
                    Here you can manage your location, search a location, zoom in/out and get your current location.
                </p>

                <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search a location..."
                    className="border-2 border-[#85a29090] focus:border-[#85a290] rounded-[30px] rounded-br-[120px] p-2 mb-4 w-full max-w-[300px]"
                    onFocus={handleSearch}
                /> <br /> 
                <span className="flex gap-3 my-5">
                    <button className="bg-blue-500 text-white p-2 px-10 rounded-full mb-2" onClick={handleZoomIn}>Zoom In</button>
                    <button className="bg-red-500 text-white p-2 rounded-full px-10 mb-2" onClick={handleZoomOut}>Zoom Out</button>
                </span>

                <h3 className="leading-none mb-4 mt-8">Sync your <br /> Current Location</h3>
                <p className="text-sm text-gray-500 pr-20">
                    Note: This feature is important in case you want to deliver your products to your customers. By clicking the "Get Current Location" button, your device will try to find your current location. If you don't allow the browser to access your location, it will not be possible to find your current location.
                </p>

                <button className="bg-[#718a7a] hover:bg-[#4e5f54] duration-300 text-white p-2 flex px-8 rounded-[30px] mb-8 mt-4 items-center justify-center" onClick={handleLocation}>
                    <i className="ri-focus-3-line text-[22px] mr-3"></i>
                    <p> Get Current Location</p>
                </button>

                {/* location container */}
                <span className="flex gap-3 my-5">
                {locations.map((location, index) => (
                    <div key={index} className="relative w-40 h-52 bg-[#8f9a7743] items-center px-2 py-2 flex flex-col rounded-[22px] hover:translate-y-5 duration-500">
                        <div className="absolute right-2 top-2">
                            <div className="relative">
                                <button className="p-1 rounded-full hover:bg-gray-200" onClick={() => toggleDropdown(index)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                    </svg>
                                </button>
                                <div className={`absolute right-full bottom-full mt-2 w-36 bg-red-100/10 backdrop-blur-2xl z-10 rounded-lg shadow-lg ${dropdownVisible[index] ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-300`}> 
                                    <ul className="py-2">
                                        <li onClick={() => {
                                            setCoords({lng:location.lng,lat:location.lat}); 
                                            setUsed(true); 
                                            setClickedLocation(location); 
                                            setZoom(20); 
                                            setDropdownVisible(0) 
                                            setLocationAddress({ 
                                                streetNumber: location.address.streetNumber || '',
                                                route: location.address.route || '',
                                                area: location.address.area || '',
                                                locality: location.address.locality || '',
                                                state: location.address.state || '',
                                                postalCode: location.address.postalCode || ''
                                            })
                                            }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Use</li>
                                        { index !== 0 && <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Set Current</li>}
                                        <li onClick={() => { 
                                            setCoords({lng:location.lng,lat:location.lat}); 
                                            setUsed(false);
                                            setEditLocation(location);
                                            setClickedLocation(location); 
                                            setZoom(20); 
                                            setDropdownVisible(0) 
                                            setLocationAddress({ 
                                                streetNumber: location.address.streetNumber || '',
                                                route: location.address.route || '',
                                                area: location.address.area || '',
                                                locality: location.address.locality || '',
                                                state: location.address.state || '',
                                                postalCode: location.address.postalCode || ''
                                            });
                                            // Do not update the map coordinates or zoom here
                                        }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit</li>
                                        <li className="px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer">Delete</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <img className="rounded-[18px] border-2 border-green-950" src="https://lh3.googleusercontent.com/KEfZe6eblIDD7q2q9LTzldLXmuTkefUzen9BAKPYFQcach8j1G0jpYaFccwRodbtFzOYeEze2BLf3-I-VbWptoYsZaoTuePGE0l7f2M=w450" alt="" />
                        <p className="leading-none mt-4 mb-1 text-[20px] text-center">{index === 0 ? 'Current Location' : index === 1 ? 'Second Location' : 'Third Location'}</p>
                        <p className="leading-none opacity-55">{location?.address?.locality}, {location?.address?.area}</p>
                        <p className="leading-none opacity-55">{location?.address?.state}, {location?.address?.postalCode}</p>
                    </div>
                ))}
                </span>

                {renderLocationDetails()}
            </div>
            <div className="flex-1 rounded-[35px] overflow-hidden mb-8 mt-8 mr-8">
                {!open && (
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={coords}
                        zoom={zoom}
                        onClick={handleMapClick}
                    >
                        <Marker position={coords} />
                        {clickedLocation && (
                            <Marker
                                position={clickedLocation}
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                    scaledSize: new window.google.maps.Size(40, 40)
                                }}
                            />
                        )}
                    </GoogleMap>
                )}
            </div>
        </div>
            </>
    );
}

export default Map;