import styles from './App.module.less';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import MapPage from './pages/MapPage/MapPage';
import "leaflet/dist/leaflet.css";
import './App.css';
import { useEffect, useState } from 'react';
import SignInPage from './pages/RegisterPage/components/SignInPage';
import SignUpPage from './pages/RegisterPage/components/SignUpPage';
import { InfoPage } from './pages/InfoPage/InfoPage';



function App() {

  const [ location, setLocation ] = useState({
    latitude: 49.84309611110559,
    longitude: 24.030603315948206,
    display_name: "",
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      getCurrentCityName,
    );
  }, []);

  function getCurrentCityName(position : any) {

    const url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+ position.coords.latitude + '&lon=' +  
                          position.coords.longitude ;
     
    fetch(url, {
        method: "GET",
        mode: "cors",      
      }).then((response) => response.json())
        .then((data) => setLocation({ latitude: position.coords.latitude,
                                      longitude: position.coords.longitude,
                                      display_name:`${ data.address.city }, ${ data.address.country }` })    
        );
  }

  return (
    <div className={styles.main}>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/map' element={
        <MapPage location={location}/>
      }/>
      <Route path='/login' element={<SignInPage/>}/>
      <Route path='/signup' element={<SignUpPage/>}/>
      <Route path='/info' element={<InfoPage/>}/>
      </Routes>
    </div>
  )
}

export default App
