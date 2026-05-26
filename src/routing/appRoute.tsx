import type React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../layout/rootlayout/layout";
import Home from "../components/home/home";
import Cart from "../components/cart/cart";
import Discounts from "../components/discounts/discounts";

const AppRoute: React.FC = () => {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "cart", element: <Cart /> },
        { path: "discounts", element: <Discounts /> }
      ]
    }
  ]);
  return (
    <>
      <RouterProvider router={route} />
    </>
  );
};

export default AppRoute;