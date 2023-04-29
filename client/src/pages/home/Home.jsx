import "./home.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Cities from "../../components/cities/Cities";
import PropertyList from "../../components/propertyList/PropertyList";
import Recommandations from "../../components/recommandations/Recommandations";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
const Home = () => {
  return (
    <div style={{ margin: -8 }}>
      <Navbar />
      <Header />
      <div className="homeContainer">
        <Cities />
        <h1 className="homeTitle">Browse by property type</h1>
        <PropertyList />
        <h1 className="homeTitle">Homes guests love</h1>
        <Recommandations/>
        <MailList/>
        <Footer/>
      </div>
      
    </div>
  );
};

export default Home;
