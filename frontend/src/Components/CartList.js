import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

export default function CartList(props) {
  const classes = useStyles();
  var items = arrayToObject(props.items);

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell>Qte</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.libelle}
              </TableCell>
              <TableCell>
                <RemoveIcon fontSize="small" />
                {row.qte}
                <AddIcon fontSize="small" onClick={add(row)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
