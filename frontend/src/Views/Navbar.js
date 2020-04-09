import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Cookies from "universal-cookie";

import Divider from "@material-ui/core/Divider";

// Icons

import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DashboardIcon from "@material-ui/icons/Dashboard";
import GroupIcon from "@material-ui/icons/Group";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import EmojiTransportationIcon from "@material-ui/icons/EmojiTransportation";
import ListAltIcon from "@material-ui/icons/ListAlt";

//Router
import { Route, Redirect, Switch, Link, BrowserRouter } from "react-router-dom";
import { getMe } from "../Services/userservice";

import Dashboard from "./Dashboard";
import NewCmd from "./NewCommand";
import MyCommands from "../Components/MyCommands";
import Articles from "./Articles";
import Depot from "./Depot";
import Client from "./Client";
import LatestCmd from "./LatestCommands";
import CommandDetails from "../Components/CommandDetails";
import Livraison from "./Livraison";
import MyLivraisons from "../Components/MyLivraisons";
import Profile from "./Profile";
import SignIn from "./Sign-in";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [role, setRole] = React.useState("");

  React.useEffect(() => {
    async function fetchData() {
      const { data: client } = await getMe();
      setRole(client.role[0]);
      console.log("zebi" + client.role[0]);
    }
    fetchData();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getIconsUser = (index) => {
    switch (index) {
      case 0:
        return <ShoppingCartIcon></ShoppingCartIcon>;
      case 1:
        return <AddShoppingCartIcon></AddShoppingCartIcon>;
      case 2:
        return <LocalShippingIcon></LocalShippingIcon>;
      case 3:
        return <PersonIcon></PersonIcon>;
      case 4:
        return <ExitToAppIcon></ExitToAppIcon>;
    }
  };

  const getAdminUser = (index) => {
    switch (index) {
      case "Dashboard":
        return <DashboardIcon></DashboardIcon>;
      case "Clients":
        return <GroupIcon></GroupIcon>;
      case "Articles":
        return <InsertDriveFileIcon></InsertDriveFileIcon>;
      case "Depots":
        return <HomeWorkIcon></HomeWorkIcon>;
      case "Livraisons":
        return <EmojiTransportationIcon></EmojiTransportationIcon>;
      case "Commandes":
        return <ListAltIcon></ListAltIcon>;
    }
  };

  const getFournisseurUser = (index) => {
    switch (index) {
      case 0:
        return <InsertDriveFileIcon></InsertDriveFileIcon>;
      case 1:
        return <HomeWorkIcon></HomeWorkIcon>;
    }
  };

  const routes = ["/mycommands", "/create", "/mesLivraisons", "/profile"];
  const adminRoutes = [
    { nom: "Dashboard", url: "dashboard" },
    { nom: "Clients", url: "/clients" },
    { nom: "Articles", url: "/articles" },
    { nom: "Depots", url: "/depots" },
    { nom: "Livraisons", url: "/livraisons" },
    { nom: "Commandes", url: "/commands" },
  ];
  const fournisseurRoutes = [
    { nom: "Articles", url: "/articles" },
    { nom: "Depots", url: "/depots" },
  ];
  const getRoutes = () => {
    switch (role) {
      case "fournisseur":
        return fournisseurRoutes;
      case "admin":
        return adminRoutes;
    }
    return [];
  };

  const handleLogout = (route) => {
    if (route == "Logout") {
      const cookie = new Cookies();
      cookie.remove("token", { path: "/" });
      window.location.reload();
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Projet Web Avancé
          </Typography>
        </Toolbar>
      </AppBar>
      <BrowserRouter>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            {getRoutes().map((row, index) => (
              <Link
                to={row.url}
                style={{ textDecoration: "none", color: "#2E2E2E" }}
              >
                <ListItem button key={row.nom}>
                  <ListItemIcon>{getAdminUser(row.nom)}</ListItemIcon>
                  <ListItemText primary={row.nom} />
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider />
          <List>
            {[
              "Mes Commandes",
              "Nouvelle Commande",
              "Mes Livraisons",
              "Mon Compte",
              "Logout",
            ].map((text, index) => (
              <Link
                to={routes[index]}
                style={{ textDecoration: "none", color: "#2E2E2E" }}
              >
                <ListItem button key={text} onClick={() => handleLogout(text)}>
                  <ListItemIcon>{getIconsUser(index)}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              </Link>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />

          <Switch>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/mycommands" component={MyCommands} />
            <Redirect from="/" exact to="/mycommands" />
            <Route path="/Commande/:id" component={CommandDetails}></Route>
            <Route path="/create" component={NewCmd}></Route>
            <Route path="/commands" component={LatestCmd}></Route>
            <Route path="/articles" component={Articles}></Route>
            <Route path="/depots" component={Depot}></Route>
            <Route path="/clients" component={Client}></Route>
            <Route path="/livraisons" component={Livraison}></Route>
            <Route path="/mesLivraisons" component={MyLivraisons}></Route>
            <Route path="/profile" component={Profile}></Route>
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  );
}
