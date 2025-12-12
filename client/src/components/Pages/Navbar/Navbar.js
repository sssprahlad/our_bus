import React from "react";
import { MdAccountCircle } from "react-icons/md";
import { IoIosHelpCircleOutline } from "react-icons/io";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { SiBookmyshow } from "react-icons/si";
import { IoIosCall } from "react-icons/io";
import { MdLogout } from "react-icons/md";

const Navbar = () => {
  const navigate = useNavigate();

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["My Bookings", "Account", "Help", "Contact", "Logout"].map(
          (text, index) => {
            const iconsList = [
              { icon: SiBookmyshow, url: "/my-bookings" },
              { icon: MdAccountCircle, url: "/my-account" },
              { icon: IoIosHelpCircleOutline, url: "/help" },
              { icon: IoIosCall, url: "/contact" },
              { icon: MdLogout, url: "/logout" },
            ];

            const Icon = iconsList[index].icon;

            return (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  onClick={() => {
                    iconsList[index].url !== "/logout"
                      ? navigate(iconsList[index].url)
                      : handleLogout();
                  }}
                >
                  <ListItemIcon>
                    <Icon style={{ width: "20px", height: "20px" }} />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            );
          }
        )}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div className="navbar-container">
      <div className="nav-left-part">
        <img
          src="/images/bus-logo.png"
          className="logo"
          onClick={() => navigate("/")}
        />
        {/* <ul className="image-containers">
          <li className="nav-link">
            <img
              src="/images/bus-tickets-page.svg"
              alt="bus-img"
              className="bus-img"
            />
          </li>
          <li className="nav-link">
            <img
              src="/images/train-tickets-page.svg"
              alt="train-img"
              className="train-img"
            />
          </li>
        </ul> */}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button> */}

        <Button
          onClick={toggleDrawer("right", true)}
          sx={{
            textTransform: "capitalize",
            border: "2px solid #d63941",
            color: "#d63941",
            padding: "0.5rem 1rem",
          }}
          variant="outlined"
          startIcon={<MdAccountCircle />}
        >
          My Account
        </Button>

        <Drawer
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
        >
          {list("right")}
        </Drawer>
      </div>
    </div>
  );
};

export default Navbar;
