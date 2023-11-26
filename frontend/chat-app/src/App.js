import SignupForm from './Components/SignupForm';
import LoginForm from './Components/LoginForm';
import Home from './Components/Home'
import { BrowserRouter, Routes,Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
function App() {
  const {user, load}=useAuth();
  return (
    <div className="App">
      {load && <div className='h-screen w-screen bg-[url(C:\Users\DELL\OneDrive\Bureau\jl.jfif)]  bg-no-repeat bg-cover flex justify-center items-center'> <span className="loading loading-spinner loading-lg"></span></div> }
     {!load && <BrowserRouter>
      <Routes>
        <Route path='/' element={user ? <Home/> : <Navigate to='/login'/>} />
        <Route path='/sign' element={!user ? <SignupForm/> : <Navigate to='/' ></Navigate>} />
        <Route path='/login' element={!user ? <LoginForm/> : <Navigate to='/' ></Navigate>} />
      </Routes>
     </BrowserRouter>}
    </div>
  );
}

export default App;
