import styles from './App.module.less';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';

function App() {
  
  return (
    <div className={styles.main}>
      <Routes>
        <Route path='/home' element={<HomePage/>}/>
      </Routes>
    </div>
  )
}

export default App
