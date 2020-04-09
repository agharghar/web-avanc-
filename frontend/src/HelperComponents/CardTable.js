import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Table from "../Components/Table";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles({
  root: {
    marginTop: "40px",
    height: "100%",
  },
  avatar: {
    backgroundColor: "red",
    height: 34,
    width: 34,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontWeight: 700,
    fontSize: 12,
  },
  icon: {
    height: 24,
    width: 24,
  },

  pos: {
    marginBottom: 12,
  },
});

export default function CardChart(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root}>
      <CardHeader title="Dernieres Commande" />
      <Divider />

      <Table></Table>
    </Card>
  );
}
