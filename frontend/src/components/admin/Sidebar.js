import React from "react";
import { Link } from "react-router-dom";

import UseMediaQuery from "../../hooks/MediaQuery";

const Sidebar = () => {
  const showOnMobile = UseMediaQuery("(max-width:900px)");
  return (
    <div className="sidebar-wrapper">
      <nav id="sidebar">
        <ul className="list-unstyled components">
          <li>
            <Link to="/dashboard">
              <i className="fa fa-tachometer"></i>
              {!showOnMobile ? "DashBoard" : " "}
            </Link>
          </li>

          <li>
            <a
              href="#productSubmenu"
              data-toggle="collapse"
              aria-expanded="false"
              className="dropdown-toggle"
            >
              <i className="fa fa-product-hunt"></i>{" "}
              {!showOnMobile ? "Products" : " "}
            </a>
            <ul className="collapse list-unstyled" id="productSubmenu">
              <li>
                <Link to="/admin/products">
                  <i className="fa fa-clipboard"></i>{" "}
                  {!showOnMobile ? "All" : " "}
                </Link>
              </li>

              <li>
                <Link to="/admin/product">
                  <i className="fa fa-plus"></i>{" "}
                  {!showOnMobile ? "Create" : " "}
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link to="/admin/orders">
              <i className="fa fa-shopping-basket"></i>{" "}
              {!showOnMobile ? "Orders" : " "}
            </Link>
          </li>

          <li>
            <Link to="/admin/users">
              <i className="fa fa-users"></i> {!showOnMobile ? "Users" : " "}
            </Link>
          </li>

          <li>
            <Link to="/admin/reviews">
              <i className="fa fa-star"></i> {!showOnMobile ? "Reviews" : " "}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
