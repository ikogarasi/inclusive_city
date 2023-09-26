import styles from './App.module.less';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import { MapPage } from './pages/MapPage/MapPage';

const API_KEY = process.env.REACT_APP_API_KEY;
console.log(API_KEY)
function App() {
  return (
    <div className={styles.main}>
      <Routes>
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/map' element={<MapPage/>}/>
      </Routes>
    </div>
  )
}

export default App
