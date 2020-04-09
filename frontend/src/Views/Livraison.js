import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { IconButton } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import { Route, Redirect, Switch, Link, BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { getMe } from "../Services/userservice";

import {
  getCommands,
  acceptCommand,
  deleteCommand,
  validate,
} from "../Services/commandservice";

const columns = [
  { id: "name", label: "Livraison", minWidth: 170 },
  { id: "code", label: "Client", minWidth: 100 },
  {
    label: "Nombre d'Article",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString(),
  },
  {
    label: "Status",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString(),
  },
  {
    label: "Facture",
    minWidth: 150,
    align: "center",
  },
  {
    label: "Actions",
    minWidth: 100,
    align: "center",
  },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

function prixHt(details) {
  var total = 0;

  //console.log(command);
  for (var i = 0; i < details.length; i++) {
    total += details[i].article.prixVenteHT * details[i].nombre;
  }
  return total;
}

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [commands, setCommand] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      const { data: command } = await getCommands();
      const { data: me } = await getMe();
      if (me.role != "admin") {
        window.location.replace("https://www.perdu.com/");
      }

      setCommand(command);
    }
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAdd = async (id) => {
    try {
      await validate(id);
      toast.success("Livraison Validé !");
    } catch (e) {}
  };

  const handleDelete = async (id, index) => {
    try {
      await deleteCommand(id);
      var newCmd = [...commands];
      newCmd.splice(index, 1);
      setCommand(newCmd);
      toast.success("Livraison Rejeté !");
    } catch (e) {}
  };

  const handleAccept = async (id, index) => {
    try {
      await validate(id);
      toast.success("Livraison Validé !");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (e) {}
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {commands
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                if (row.statutLivraison == "en preparation") {
                  return (
                    <TableRow key={row._id}>
                      <TableCell component="th" scope="row">
                        {row.ref}
                      </TableCell>
                      <TableCell>
                        {row.client.name} {row.client.surName}
                      </TableCell>
                      <TableCell align="right">{row.details.length}</TableCell>
                      <TableCell align="right">{row.statutLivraison}</TableCell>
                      <TableCell align="center">
                        <Link
                          to={`/Commande/${row._id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <IconButton style={{ outline: "none" }}>
                            <VisibilityIcon></VisibilityIcon>
                          </IconButton>
                        </Link>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          style={{ outline: "none" }}
                          onClick={() => handleAccept(row._id)}
                        >
                          <CheckCircleIcon></CheckCircleIcon>
                        </IconButton>
                        <IconButton
                          style={{ outline: "none" }}
                          onClick={() => handleDelete(row._id, index)}
                        >
                          <CancelIcon></CancelIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={commands.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
