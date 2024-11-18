import React, { useState } from 'react';
import { Button, ListGroup, Container, InputGroup, FormControl } from 'react-bootstrap';

interface Location {
    latitude: number;
    longitude: number;
}

const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

const LocationDistanceCalculator: React.FC = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [distance, setDistance] = useState<string | null>(null);

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const newLocation: Location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                setLocations((prevLocations) => {
                    const updatedLocations = [...prevLocations, newLocation];
                    if (updatedLocations.length >= 2) {
                        const lastIndex = updatedLocations.length - 1;
                        const dist = getDistanceFromLatLonInKm(
                            updatedLocations[lastIndex - 1].latitude,
                            updatedLocations[lastIndex - 1].longitude,
                            updatedLocations[lastIndex].latitude,
                            updatedLocations[lastIndex].longitude
                        );
                        setDistance(dist.toFixed(2)); // Round distance to 2 decimal places
                    }
                    return updatedLocations;
                });
            }, (error) => {
                alert(`Error getting location: ${error.message}`);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    return (
        <Container className="mt-3">
            <Button variant="primary" onClick={handleGetLocation}>
                Get Current Location
            </Button>
            <h4 className="mt-3">Recorded Locations:</h4>
            <ListGroup>
                {locations.map((loc, index) => (
                    <ListGroup.Item key={index}>
                        Location {index + 1}: Lat {loc.latitude.toFixed(5)}, Lon {loc.longitude.toFixed(5)}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            {distance !== null && (
                <InputGroup className="mt-3">
                    <InputGroup.Text>Distance between last two locations:</InputGroup.Text>
                    <FormControl value={`${distance} km`} readOnly />
                </InputGroup>
            )}
        </Container>
    );
};

export default LocationDistanceCalculator;