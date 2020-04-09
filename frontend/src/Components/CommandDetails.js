import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { getCommand } from "../Services/commandservice";
import { useState, useEffect } from "react";

const TAX_RATE = 0.2;

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function subtotal(details) {
  let sum = 0;
  /* for(var i=0;i<details.length;i++){
    sum+=details[i].article.prixVenteHT
  }*/
  details.map((x) => {
    sum += priceRow(x.nombre, x.article.prixVenteHT);
  });
  return sum;
}

function Tva(totalHt) {
  return totalHt * TAX_RATE;
}

export default function SpanningTable(props) {
  const classes = useStyles();
  const [details, setDetails] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data: command } = await getCommand(props.match.params.id);
      setDetails(command.details);
    }
    fetchData();
  }, [props]);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={3}>
              Details
            </TableCell>
            <TableCell align="right">Prix</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Desc</TableCell>
            <TableCell align="right">Qte</TableCell>
            <TableCell align="right">Prix Unitaire</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {details.map((row) => (
            <TableRow key={row.article}>
              <TableCell>{row.article.libelle}</TableCell>
              <TableCell align="right">{row.nombre}</TableCell>
              <TableCell align="right">{row.article.prixVenteHT}</TableCell>
              <TableCell align="right">
                {ccyFormat(priceRow(row.nombre, row.article.prixVenteHT))}
              </TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Total Hors Tax</TableCell>
            <TableCell align="right">{ccyFormat(subtotal(details))}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>TVA</TableCell>
            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(
              0
            )} %`}</TableCell>
            <TableCell align="right">
              {ccyFormat(Tva(subtotal(details)))}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={2}>Total TTC</TableCell>
            <TableCell align="right">
              {ccyFormat(Tva(subtotal(details)) + subtotal(details))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
