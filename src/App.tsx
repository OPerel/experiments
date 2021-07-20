import React from 'react';
import './App.css';

// import Fact from './Fact';
import JsonToTable from "./JsonToTable";

const App: React.FC = () => {

  return (
    <div className="App">
       <JsonToTable />
      {/*<Fact />*/}
    </div>
  );
}

export default App;
