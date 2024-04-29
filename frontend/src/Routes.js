import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";

// Cart Imports
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import Payment from "./components/cart/Payment";
import OrderSuccess from "./components/cart/OrderSuccess";

// Order Imports
import ListOrders from "./components/order/ListOrders";
import OrderDetails from "./components/order/OrderDetails";

// Auth or User Imports
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Profile from "./components/user/Profile";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";
import SendVerifyEmail from "./components/user/SendVerifyEmail";
import VerifyEmail from "./components/user/VerifyEmail";

// Admin Imports
import Dashboard from "./components/admin/Dashboard";
import ProductList from "./components/admin/ProductsList";
import NewProduct from "./components/admin/NewProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import OrdersList from "./components/admin/OrdersList";
import ProcessOrder from "./components/admin/ProcessOrder";
import UsersList from "./components/admin/UsersList";
import UpdateUser from "./components/admin/UpdateUser";
import ProductReviews from "./components/admin/ProductReviews";

export const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/search/:keyword",
    element: <Home />,
  },
  {
    path: "/product/:id",
    element: <ProductDetails />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/password/forgot",
    element: <ForgotPassword />,
  },
  {
    path: "/resetPassword/:token",
    element: <NewPassword />,
  },
];

export const ProtectedRoutes = [
  {
    path: "/me",
    element: <Profile />,
  },
  {
    path: "/me/update",
    element: <UpdateProfile />,
  },
  {
    path: "/email/sendVerifyEmail",
    element: <SendVerifyEmail />,
  },
  {
    path: "/email/verifyEmail/:userId/:emailVerificationToken",
    element: <VerifyEmail />,
  },
];

export const VerifiedRoutes = [
  { path: "/password/update", element: <UpdatePassword /> },
  { path: "/shipping", element: <Shipping /> },
  { path: "/order/confirm", element: <ConfirmOrder /> },
  {
    path: "/success",
    element: <OrderSuccess />,
  },
  {
    path: "/orders/me",
    element: <ListOrders />,
  },
  {
    path: "/order/:id",
    element: <OrderDetails />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
];

export const AdminRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/admin/products",
    element: <ProductList />,
  },
  {
    path: "/admin/product",
    element: <NewProduct />,
  },
  {
    path: "/admin/product/:id",
    element: <UpdateProduct />,
  },
  {
    path: "/admin/orders",
    element: <OrdersList />,
  },
  {
    path: "/admin/order/:id",
    element: <ProcessOrder />,
  },
  {
    path: "/admin/users",
    element: <UsersList />,
  },
  {
    path: "/admin/user/:id",
    element: <UpdateUser />,
  },
  {
    path: "/admin/reviews",
    element: <ProductReviews />,
  },
];
