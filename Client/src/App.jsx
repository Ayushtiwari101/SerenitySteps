
import Landing from './Pages/Landing'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Signup from './Components/Signup'
import Login from './Components/Login'
import Home from './Pages/Home'
import Meditation from './Pages/Meditation'
import Workout from './Pages/Workout'
import Games from './Pages/Games'
import DietPlan from './Pages/DietPlan'


function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/meditate' element={<Meditation/>}/>
        <Route path='/games' element={<Games/>}/>
        <Route path='/workout' element={<Workout/>}/>
        <Route path='/diet' element={<DietPlan/>}/>
        
        
      </Routes>
      
  
    </BrowserRouter>
      
      
    </>
  )
}

export default App
