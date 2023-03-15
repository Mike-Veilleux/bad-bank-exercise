import React, { Fragment } from "react";
import { Container, Stack } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import ToastAlerts from "../components/ToastAlerts";
import NavigationBar from "./NavigationBar";

const Layout = () => {
  return (
    <Stack>
      <NavigationBar />
      <ToastAlerts />
      <Stack style={{ alignItems: "center", marginTop: 20 }}>
        <Outlet />
      </Stack>
    </Stack>
  );
};

export default Layout;
