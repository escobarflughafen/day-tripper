import React from 'react';
import TripForm from './TripForm';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import TripMeterDashboard from './TripMeter';
import { Card, Container } from 'react-bootstrap';
import LocationDistanceCalculator from './LocationDistanceCalculator';



function App() {
  return (
    <div className="App">
      <Container className='mt-3'>
        <Card>
          <Card.Header className='text-center'>
            <strong>Day Tripper</strong>
          </Card.Header>
          <Card.Body>
            <TripMeterDashboard></TripMeterDashboard>

            <LocationDistanceCalculator></LocationDistanceCalculator>
          </Card.Body>

        </Card>

      </Container>
    </div>
  );
}

export default App;
