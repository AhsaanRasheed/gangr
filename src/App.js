import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetOrders from "./pages/ordersList";
import showOrderDetails from "./pages/showOrderDetails";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  Component={GetOrders}> </Route>
        <Route path="/showOrderdetails/:id"  Component={showOrderDetails}> </Route>
      </Routes>
    </BrowserRouter>
  );
}
