/* Components */
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
import { IconButton } from "@material-ui/core";
import { toast } from "react-toastify";

import { Modal, Button } from "react-bootstrap";
import DepotForm from "../Forms/DepotForm";
import { getMe } from "../Services/userservice";

//Services
import { getDepots, deleteDepot } from "../Services/depotservice";

//Icons
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const columns = [
  {
    id: "name",
    label: "Depot",
    minWidth: 100,
    format: (value) => value.toLocaleString(),
  },
  {
    id: "code",
    label: "Nom",
    minWidth: 100,
    format: (value) => value.toLocaleString(),
  },
  {
    id: "population",
    label: "Addresse",
    minWidth: 100,
    format: (value) => value.toLocaleString(),
  },
  {
    id: "actions",
    label: "Actions",
    minWidth: 100,
    format: (value) => value.toLocaleString(),
  },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
  Button: {
    align: "right",
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);
  const [depot, setDepot] = React.useState([]);
  const [show, setShow] = React.useState(false);
  const [id, setID] = React.useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  React.useEffect(() => {
    async function fetchData() {
      const { data: depot } = await getDepots();
      const { data: me } = await getMe();
      if (me.role != "admin" && me.role != "fournisseur") {
        window.location.replace("https://www.perdu.com/");
      }

      setDepot(depot);
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

  const addButton = (label) => {
    if (label == "Depot") {
      return (
        <IconButton style={{ padding: 0 }} onClick={handleShow}>
          <AddIcon style={{ fontSize: 18 }}></AddIcon>
        </IconButton>
      );
    }
  };

  const handleEdit = (id_depot) => {
    setID(id_depot);
    handleShow();
  };

  const handleDelete = async (id_depot, index) => {
    try {
      await deleteDepot(id_depot);
      var newDepot = [...depot];
      newDepot.splice(index, 1);
      setDepot(newDepot);
      toast.success("Depot Supprimé !");
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
                  {column.label} {addButton(column.label)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {depot
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow key={row._id}>
                    <TableCell component="th" scope="row">
                      {row._id}
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.adresse}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(row._id)}>
                        <EditIcon></EditIcon>
                      </IconButton>
                      <IconButton onClick={() => handleDelete(row._id, index)}>
                        <DeleteIcon></DeleteIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[4, 8, 16]}
        component="div"
        count={depot.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Gestionnaire d'Articles</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DepotForm id={id}></DepotForm>
        </Modal.Body>
      </Modal>
    </Paper>
  );
}
