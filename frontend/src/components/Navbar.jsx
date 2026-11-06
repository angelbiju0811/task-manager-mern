import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const tab = (to, label) => (
    <Button
      component={Link}
      to={to}
      color="inherit"
      sx={{
        borderRadius: 0,
        borderBottom: pathname === to ? "2px solid white" : "2px solid transparent",
      }}
    >
      {label}
    </Button>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>
        {tab("/", "Dashboard")}
        {tab("/add", "Add Task")}
      </Toolbar>
    </AppBar>
  );
}