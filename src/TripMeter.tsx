import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ButtonGroup, Button, Table, InputGroup, FormControl } from 'react-bootstrap';

interface Trip {
    index: number;
    fare: number;
    extra: number;
    start_time: string;
    end_time: string;
}


interface TripTableProps {
    trips: Trip[];
}

const TripTable: React.FC<TripTableProps> = ({ trips }) => {
    return (
        <div style={{ overflowX: 'auto' }}> {/* Add horizontal scroll */}
            {trips.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Fare ($)</th>
                            <th>Extra ($)</th>
                            <th>Total ($)</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trips.map((trip) => (
                            <tr key={trip.index}>
                                <td>{trip.index}</td>
                                <td>{trip.fare.toFixed(2)}</td>
                                <td>{trip.extra.toFixed(2)}</td>
                                <td>{(trip.fare + trip.extra).toFixed(2)}</td> {/* Total earnings */}
                                <td>{new Date(trip.start_time).toLocaleString()}</td>
                                <td>{new Date(trip.end_time).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No trips recorded yet.</p>
            )}
        </div>
    );
};


interface AnalogDisplayProps {
    fare: number;
    extra: number;
    duration: string; // Expected in "HH:MM:SS" format
}

const AnalogDisplay: React.FC<AnalogDisplayProps> = ({ fare, extra, duration }) => {
    // Format fare to 5 digits (000.00 to 999.99)
    const formattedFare = fare.toFixed(2).padStart(6, '0'); // Includes padding and formatting

    // Format extra to 4 digits (00.00 to 99.99)
    const formattedExtra = extra.toFixed(2).padStart(5, '0'); // Includes padding and formatting

    // Format duration to 6 digits (HH:MM:SS, where max is 99:59:59)
    const formattedDuration = duration.padStart(8, '0');

    return (
        <div className="analog-display">
            <InputGroup className="mb-3">
                <InputGroup.Text>FARE</InputGroup.Text>
                <FormControl value={fare.toFixed(2)} readOnly disabled />
                <InputGroup.Text>$</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text>EXTRA</InputGroup.Text>
                <FormControl value={extra.toFixed(2)} readOnly disabled />
                <InputGroup.Text>$</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text>DURATION</InputGroup.Text>
                <FormControl value={duration} readOnly disabled />
            </InputGroup>
        </div>
    );
};

const TripMeterDashboard: React.FC = () => {
    const [fare, setFare] = useState<number>(0);
    const [extra, setExtra] = useState<number>(0);
    const [start_time, setStartTime] = useState<string | null>(null);
    const [end_time, setEndTime] = useState<string | null>(null);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [pausedDuration, setPausedDuration] = useState<number>(0); // Total paused duration in seconds
    const [pauseStart, setPauseStart] = useState<number | null>(null); // Timestamp when paused
    const [trips, setTrips] = useState<Trip[]>([]);
    const [duration, setDuration] = useState<string>('00:00:00');
    const [hourlyRate] = useState<number>(20.88); // Default hourly rate

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isActive && !isPaused) {
            timer = setInterval(() => {
                if (start_time) {
                    const now = new Date();
                    const start = new Date(start_time);

                    // Calculate the total elapsed time minus the paused duration
                    const totalElapsedTime = Math.floor((now.getTime() - start.getTime()) / 1000) - pausedDuration;
                    const hours = Math.floor(totalElapsedTime / 3600);
                    const minutes = Math.floor((totalElapsedTime % 3600) / 60);
                    const seconds = totalElapsedTime % 60;

                    setDuration(
                        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                    );

                    // Update fare and extra earnings
                    const calculatedFare = (totalElapsedTime / 3600) * hourlyRate; // Calculate fare based on duration in hours
                    const calculatedExtra = (totalElapsedTime / 60) * 0.15; // Calculate extra based on minutes

                    setFare(calculatedFare);
                    setExtra(calculatedExtra);
                }
            }, 1000); // Update every second
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isActive, isPaused, start_time, pausedDuration, hourlyRate]);

    const handleTrack = () => {
        setIsActive(true);
        setIsPaused(false);
        const now = new Date().toISOString();
        setStartTime(now);
        setEndTime(null);
        setFare(0);
        setExtra(0);
        setPausedDuration(0);
        setDuration('00:00:00');
    };

    const handlePauseResume = () => {
        if (isPaused) {
            // Resuming the trip: calculate paused time and add it to the total paused duration
            if (pauseStart) {
                const now = Date.now();
                setPausedDuration((prev) => prev + Math.floor((now - pauseStart) / 1000));
                setPauseStart(null);
            }
        } else {
            // Pausing the trip: record the time when the pause started
            setPauseStart(Date.now());
        }
        setIsPaused(!isPaused);
    };

    const handleEndTrip = () => {
        if (start_time) {
            const now = new Date().toISOString();
            setEndTime(now);
            const newTrip: Trip = {
                index: trips.length + 1, // Set the index based on the number of trips
                fare,
                extra,
                start_time,
                end_time: now,
            };
            // Prepend the new trip to the trips array
            setTrips((prevTrips) => [newTrip, ...prevTrips]);
            setIsActive(false);
            setIsPaused(false);
            setPausedDuration(0);
            setPauseStart(null);
        }
    };

    return (
        <Container className="mt-3">
            <div className='mb-3'>

                <Row className="mb-3">
                    <AnalogDisplay fare={fare} extra={extra} duration={duration} />

                </Row>

                <ButtonGroup className="d-flex w-100">
                    <Button className="flex-fill" variant="success" onClick={handleTrack} disabled={isActive}>
                        TRACK
                    </Button>
                    <Button
                        className="flex-fill"
                        variant={isPaused ? 'warning' : 'primary'}
                        onClick={handlePauseResume}
                        disabled={!isActive}
                    >
                        {isPaused ? 'RESUME' : 'PAUSE'}
                    </Button>
                    <Button className="flex-fill" variant="danger" onClick={handleEndTrip} disabled={!isActive}>
                        END TRIP
                    </Button>
                </ButtonGroup>
            </div>

            <TripTable trips={trips} />
        </Container>
    );
};

export default TripMeterDashboard;