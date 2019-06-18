import React, { useEffect } from "react";
import axios from "axios";

const App = () => {
  //const [stateProduct, setStateProduct] = useState([]);

  useEffect(() => {
    axios.get("/api/product/brands").then(response => {
      console.log(response);
    });
  }, []);

  // componentDidMount(){
  //   axios.get('/api/product/brands').then(response => {
  //     console.log(response)
  //   })
  // }

  return <div className="App">MY</div>;
};
export default App;
