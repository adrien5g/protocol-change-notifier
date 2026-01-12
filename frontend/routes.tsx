import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListItems from "./pages/list";
import Item from "./pages/item";

export default function Router() {
  return (
    <BrowserRouter>
         <Routes>
           <Route path="/" element={<ListItems />} />
           <Route path="/item/:id" element={<Item />} />
         </Routes>
       </BrowserRouter>
  )
}
