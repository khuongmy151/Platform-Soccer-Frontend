import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <NavBar></NavBar>
      <SideBar></SideBar>
      <Outlet></Outlet>
      <Footer />
    </>
  );
};
export default Home;
