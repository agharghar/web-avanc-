import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Route, Redirect, Switch, Link, BrowserRouter } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";

import { getMe } from "../Services/userservice";
import { getCommands } from "../Services/clientservice";
import { useState, useEffect } from "react";

import Cart from "../Views/Cart";

const useStyles = makeStyles({
  table: {
    minWidth: 800,
  },
});

export default function SimpleTable() {
  const classes = useStyles();
  const [commands, setCommand] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data: user } = await getMe();
      const { data: command } = await getCommands(user._id);
      setCommand(command);
    }
    fetchData();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID Commande</TableCell>
            <TableCell align="right">Date Commande</TableCell>
            <TableCell align="right">Articles</TableCell>
            <TableCell align="right">Facture</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {commands.map((row) => {
            if (row.statutLivraison == "en attente") {
              return (
                <TableRow key={row._id}>
                  <TableCell component="th" scope="row">
                    {row.ref}
                  </TableCell>
                  <TableCell align="right">
                    {new Date(row.date).toISOString().split("T")[0]}
                  </TableCell>
                  <TableCell align="right">{row.details.length}</TableCell>
                  <TableCell align="right">
                    <Link to={`/Commande/${row._id}`}>
                      <IconButton style={{ outline: "none" }}>
                        <VisibilityIcon></VisibilityIcon>
                      </IconButton>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            }
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
