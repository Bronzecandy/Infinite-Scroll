import React from "react";
import ProductList from "./components/ProductList";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1 className="text-center text-2xl font-bold my-4">Product List</h1>
      <ProductList />
    </div>
  );
};

export default App;
