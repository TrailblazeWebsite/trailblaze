import './styles/App.css';
import {BrowserRouter as Router,Routes, Route} from "react-router-dom";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Map from "./pages/Map/Map";
import Place from "./pages/Place/Place"
import Places from "./pages/Categories/Categories"
import EditLocations from "./Admin/pages/AddPlace/EditLocations";
import NotFoundPage from "./pages/NotFoundPage";
import AdminHome from "./Admin/pages/AdminHome/AdminHome";
import EditCategories from "./Admin/pages/editLocations/EditCategories";
import CategoryDetails from "./pages/CategoryDetail/CategoryDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/place/:id" element={<Place />} />
        <Route path="/places" element={<Places />} />
        <Route path="/map" element={<Map />} />
        <Route path="/addPlace" element={<EditLocations />} />
        <Route path="/adminHome" element={<AdminHome />} />
        <Route path="/editCategories" element={<EditCategories />} />
        <Route path="/categories/:id" element={<CategoryDetails />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
