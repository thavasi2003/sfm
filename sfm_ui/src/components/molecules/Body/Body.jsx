import React from "react";
import "./Body.css";
import Breadcrumb from "../../atoms/Breadcrumb/Breadcrumb.jsx";
import Layout from "../Layout/Layout.jsx";

const Body = ({ breadcrumbItems, children }) => {
  return (
    <Layout>
      <Breadcrumb items={breadcrumbItems} />
      <div className="body-wrapper">
        <div className="body-container-content">{children}</div>
      </div>
    </Layout>
  );
};

export default Body;
