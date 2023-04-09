import { Body } from "./components/body/Body";
import { Footer } from "./components/footer/Footer";
import { Header } from "./components/header/Header";
import { Popup } from "./components/popup/Popup";
import "./App.css";
function App() {
  $(document).keydown(function(objEvent) {
    if (objEvent.keyCode == 9) {  //tab pressed
        objEvent.preventDefault(); // stops its action
    }
  })
  return (
    <>
      <Header></Header>
      <Body></Body>
      <Footer></Footer>
      <Popup></Popup>
    </>
  );
}

export default App;
