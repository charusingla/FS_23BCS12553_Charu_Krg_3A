import { useState } from 'react'
import './App.css'
import Header from './components/Header';
import Logs from './pages/Logs';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <>
      <Header title = "Ecotrack - Experiment 1" />
      <main style={{padding: "1rem"}}>
        <Dashboard />
        <Logs /> 
      </main>
    </>
  );
}

export default App
