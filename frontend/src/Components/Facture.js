import React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { toast } from "react-toastify";

import { Button } from "react-bootstrap";
import { getMe } from "../Services/userservice";
import { saveCommand } from "../Services/commandservice";

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

function subtotal(articles) {
  let sum = 0;
  articles.map((x) => {
    sum += priceRow(x.qte, x.prixHT);
  });
  return sum;
}

function Tva(totalHt) {
  return totalHt * TAX_RATE;
}

function Remise(totalHt, remise) {
  return totalHt * (remise / 100);
}

function arrayToObject(arr) {
  var obj = [];
  for (var i = 0; i < arr.length; ++i) {
    obj[i] = {
      article: arr[i].id,
      nombre: arr[i].qte,
    };
  }
  return obj;
}

export default function Facture(props) {
  const classes = useStyles();
  const [user, setUser] = useState("");
  const [remise, setRemise] = useState(0);
  useEffect(() => {
    async function fetchData() {
      const { data: user } = await getMe();
      setUser(user._id);
      setRemise(user.taux_remise);
    }
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const command = {
        ref: Math.random().toString(36).slice(2),
        details: arrayToObject(props.articles),
        client: user,
      };
      await saveCommand(command);
      toast.success("Commande Ajoutée ! ");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (e) {}
  };

  return (
    <TableContainer>
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
          {props.articles.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.libelle}</TableCell>
              <TableCell align="right">{row.qte}</TableCell>
              <TableCell align="right">{row.prixHT}</TableCell>
              <TableCell align="right">
                {ccyFormat(priceRow(row.qte, row.prixHT))}
              </TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Total Hors Tax</TableCell>
            <TableCell align="right">
              {ccyFormat(subtotal(props.articles))}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>TVA</TableCell>
            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(
              0
            )} %`}</TableCell>
            <TableCell align="right">
              {ccyFormat(Tva(subtotal(props.articles)))}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Taux de Remise</TableCell>
            <TableCell align="right">{`${remise.toFixed(0)} %`}</TableCell>
            <TableCell align="right">
              {ccyFormat(Remise(subtotal(props.articles), remise))}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={3}>Total TTC</TableCell>
            <TableCell align="right">
              {ccyFormat(
                Tva(subtotal(props.articles)) +
                  subtotal(props.articles) -
                  Remise(subtotal(props.articles), remise)
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button
        variant="primary"
        style={{ marginTop: 50 }}
        onClick={handleSubmit}
        block
      >
        Commandez
      </Button>
    </TableContainer>
  );
}
