import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {	CssBaseline } from "@material-ui/core";
import MissionList from './components/MissionList';
import MissionDetail from './components/MissionDetail';
import RobotForm from './components/RobotForm';
import MissionForm from './components/MissionForm';
import RobotSimulation from './components/RobotSimulation';

/**
 * App component
 *
 * This component renders the routes for the app.
 * - The root route renders the MissionList component.
 * - The /mission/:id route renders the MissionDetail component with the given id.
 * - The /create-robot route renders the RobotForm component.
 * - The /create-mission route renders the MissionForm component.
 * - The /robot-simulation/:id route renders the RobotSimulation component with the given id.
 */
function App() {
  return (
    <Router>
      <CssBaseline />
        <Routes>
          <Route path="/" element={<MissionList />} />
          <Route path="/mission/:id" element={<MissionDetail />} />
          <Route path="/create-robot" element={<RobotForm />} />
          <Route path="/create-mission" element={<MissionForm />} />
          <Route path="/robot-simulation/:id" element={<RobotSimulation />} />
        </Routes>
    </Router>
  );
}

export default App;
