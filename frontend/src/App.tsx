import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/Login';
import SignupForm from './components/Signup';


function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={<LoginForm />} />
      <Route path="/auth/signup" element={<SignupForm />} />
    </Routes>
  );
}

export default App;