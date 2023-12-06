import styles from './App.module.less';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import "leaflet/dist/leaflet.css";
import './App.css';
import SignInPage from './pages/RegisterPage/components/SignInPage';
import SignUpPage from './pages/RegisterPage/components/SignUpPage';
import { InfoPage } from './pages/InfoPage/InfoPage';
import { AdminPage } from './pages/AdminPage/AdminPage';
import { MessagePage } from './pages/MessagePage/MessagePage';
import { MapPage } from './pages/MapPage/MapPage';



function App() {

  

  return (
    <div className={styles.main}>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/map' element={
        <MapPage/>
      }/>
      <Route path='/login' element={<SignInPage/>}/>
      <Route path='/signup' element={<SignUpPage/>}/>
      <Route path='/info' element={<InfoPage/>}/>
      <Route path='/admin' element={<AdminPage/>}/>
      <Route path='/message' element={<MessagePage/>}/>
      </Routes>
    </div>
  )
}

export default App
