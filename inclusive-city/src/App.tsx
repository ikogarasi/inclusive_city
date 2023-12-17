import styles from "./App.module.less";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage/HomePage";
import "leaflet/dist/leaflet.css";
import "./App.css";
import SignInPage from "./pages/RegisterPage/components/SignInPage";
import SignUpPage from "./pages/RegisterPage/components/SignUpPage";
import { InfoPage } from "./pages/InfoPage/InfoPage";
import { AdminPage } from "./pages/AdminPage/AdminPage";
import { MessagePage } from "./pages/MessagePage/MessagePage";
import { MapPage } from "./pages/MapPage/MapPage";
import { UserData, setUser } from "./api/userSlice";
import { useAppDispatch } from "./app/hooks";
import { getCookie } from "./helpers/getCookie";
import { jwtParseToken } from "./helpers/jwtParseToken";
import { AddInfoPage } from "./pages/AdminPage/components/AddInfoPage";

export const useAuthentication = () => {
  const dispatch = useAppDispatch();
  const token = getCookie("API_TOKEN");

  if (token) {
    const userData: UserData = jwtParseToken();

    dispatch(setUser(userData));
  }
};

function App() {
  useAuthentication();

  return (
    <div className={styles.main}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/info/:structureId" element={<InfoPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/admin/add" element={<AddInfoPage />} />
      </Routes>
    </div>
  );
}

export default App;
