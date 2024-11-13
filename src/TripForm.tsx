import React, { useState, useEffect } from 'react';

import { Form, Button, Container, Row, Col, InputGroup, Card } from 'react-bootstrap';

const TripForm: React.FC = () => {
    const [startTime, setStartTime] = useState<string>(() => {
        const now = new Date();
        return now.toTimeString().slice(0, 8); // Format as HH:MM:SS
    });

    // Set the end time and refresh it every 10 seconds
    const [endTime, setEndTime] = useState<string>(() => {
        const now = new Date();
        return now.toTimeString().slice(0, 8); // Format as HH:MM:SS
    });
    const [distance, setDistance] = useState<number>(0);
    const [tips, setTips] = useState<number>(0);
    const [hourlyRate, setHourlyRate] = useState<number>(20.88);
    const [kmRate, setKmRate] = useState<number>(0.35);
    const [earning, setEarning] = useState<number | null>(null);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>();

    useEffect(() => {
        return (() => stopEndTimeInterval());
    }, []);


    const startEndTimeInterval = () => {
        if (!intervalId) {
            const id = setInterval(() => {
                const now = new Date();
                setEndTime(now.toTimeString().slice(0, 8)); // Update the end time
            }, 1000); // 1 seconds
            setIntervalId(id);
        }
    };

    const stopEndTimeInterval = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };


    const toggleTimer = () => {
        if (intervalId) {
            stopEndTimeInterval();
        } else {
            startEndTimeInterval();
        }
    };

    const calcTimeDiff = (start: string, end: string) => {
        const startDate = new Date(`2024-01-01T${start}`);
        const endDate = new Date(`2024-01-01T${end}`);

        const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

        return diff >= 0 ? diff : diff + 24;
    };

    const setCurrentTime = (setTime: React.Dispatch<React.SetStateAction<string>>) => {
        const now = new Date();
        const formattedTime = now.toTimeString().slice(0, 8);
        setTime(formattedTime);
    };

    const handleEarningCalculation = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const hoursWorked = calcTimeDiff(startTime, endTime);
        const expensePerKM = 0;

        const totalEarning = hoursWorked * hourlyRate + Number(distance) * (kmRate - expensePerKM) + tips;

        setEarning(totalEarning);
    };


    return (
        <Container className="mt-3">
            <Card>
                <Card.Header className='text-center'>
                    <strong>Day Tripper</strong>
                </Card.Header>

                <Card.Body>

                    <Form onSubmit={handleEarningCalculation}>
                        <Form.Group className="mb-3" controlId="startTime">
                            <InputGroup>
                                <InputGroup.Text>Start Time</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={startTime}
                                    placeholder="Enter time as HH:MM:SS"
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                                <Button variant="primary" onClick={() => setCurrentTime(setStartTime)}>
                                    Now
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="endTime">
                            <InputGroup>
                                <InputGroup.Text>End Time</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={endTime}
                                    placeholder="Enter time as HH:MM:SS"
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                                <Button variant={(intervalId) ? "danger" : "primary"} onClick={() => toggleTimer()}>
                                    {(intervalId) ? "STOP" : "TRACK"}
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        {/* Grouped Hourly Rate and Tips */}
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="hourlyRate">
                                    <InputGroup>
                                        <Form.Control
                                            type="number"
                                            value={hourlyRate}
                                            onChange={(e) => setHourlyRate(Number(e.target.value))}
                                            placeholder="Hourly Rate"
                                        />
                                        <InputGroup.Text>$/h</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="kmRate">
                                    <InputGroup>
                                        <Form.Control
                                            type="number"
                                            value={kmRate}
                                            onChange={(e) => setKmRate(Number(e.target.value))}
                                            placeholder="per KM Compensation"
                                        />
                                        <InputGroup.Text>$/km</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="tips">
                            <InputGroup>
                                <InputGroup.Text>Tips</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    value={tips}
                                    onChange={(e) => setTips(Number(e.target.value))}
                                    placeholder="Tips"
                                />
                                <InputGroup.Text>$</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="kilometers">
                            <InputGroup>
                                <InputGroup.Text>Distance</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    placeholder="Distance"
                                    value={distance}
                                    onChange={(e) => setDistance(Number(e.target.value))}
                                />
                                <InputGroup.Text>km</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        <Button type="submit" variant="success">
                            Calculate
                        </Button>
                    </Form>
                </Card.Body>

                <Card.Footer>
                    {earning ? (
                        <div>
                            Earning: ${earning.toFixed(2)}
                        </div>
                    ) : "Earning"}

                </Card.Footer>
            </Card>
        </Container >
    )

}


export default TripForm;