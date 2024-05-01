import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

// ui components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import {
  AdminRoutes,
  ProtectedRoutes,
  VerifiedRoutes,
  publicRoutes,
} from "./Routes";

// middleware
import ProtectedRoute from "./middlewares/ProtectedRoute";
import AdminWrapper from "./middlewares/AdminWrapper";
import ElementsLayout from "./middlewares/ElementsLayout";
import VerifiedRoute from "./middlewares/VerifiedRoute";

// queries
import { useLoadUserQuery } from "./slices/userApiSlice";
import { useGetStripeKeyQuery } from "./slices/orderApiSlice";

// Payment
import { loadStripe } from "@stripe/stripe-js";

import "./App.css";

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");

  const { isSuccess } = useLoadUserQuery();
  //Runs only after LoadUserquery is fulfilled
  const { data } = useGetStripeKeyQuery(undefined, { skip: !isSuccess });

  useEffect(() => {
    setStripeApiKey(data?.stripeApiKey);
  }, [data?.stripeApiKey]);

  return (
    <div className="App">
      <Header />
      <Routes>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route element={<ProtectedRoute />}>
          {ProtectedRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route element={<VerifiedRoute />}>
            {VerifiedRoutes.map((route) => {
              return route.path === "payment" && stripeApiKey ? (
                <Route
                  element={<ElementsLayout stripe={loadStripe(stripeApiKey)} />}
                >
                  <Route path={route.path} element={route.element} />
                </Route>
              ) : (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              );
            })}
          </Route>
          <Route element={<AdminWrapper isAdmin={true} />}>
            {AdminRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
