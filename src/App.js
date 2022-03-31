import CandidateList from "./components/CandidateList";
import './App.css';
import { Routes, Route } from 'react-router-dom';
import AddExperience from "./components/AddExperience";
import EditExperience from "./components/EditExperience";
import EditCandidate from "./components/EditCandidate";

function App() {

  return (
    <div className="App">
      <div className="container">
      <Routes>
        <Route exact path="" element={<CandidateList/>}/>
        <Route exact path="/add-experiences" element={<AddExperience/>}/>
        <Route exact path="/edit-experiences/:id" element={<EditExperience/>}/>
        <Route exact path="/edit-candidate/:id" element={<EditCandidate/>}/>
      </Routes>
        
      </div>
    </div>
  );
}

export default App;
