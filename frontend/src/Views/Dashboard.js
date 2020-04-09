import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

import Card from "../HelperComponents/Card";
import CardChart from "../HelperComponents/CardChart";
import CardTable from "../HelperComponents/CardTable";

import { getArticles } from "../Services/articleservice";
import { getClients } from "../Services/clientservice";
import { getCommands } from "../Services/commandservice";
import { getMe } from "../Services/userservice";

function getLivraisons(cmd) {
  var livraison = 0;
  for (var i = 0; i < cmd.length; i++) {
    if (cmd[i].statutLivraison == "en preparation") {
      livraison++;
    }
  }
  return livraison;
}

function getDepenses(cmd) {
  var depense = 0;
  for (var i = 0; i < cmd.length; i++) {
    for (var j = 0; j < cmd[i].details.length; j++) {
      depense +=
        cmd[i].details[j].article.prixVenteHT * cmd[i].details[j].nombre;
      depense += depense * 0.2;
    }
  }
  return depense;
}

export default function Dashboard() {
  const [articles, setArticles] = React.useState("");
  const [clients, setClients] = React.useState("");
  const [livraisons, setLivraisons] = React.useState("");
  const [depenses, setDepenses] = React.useState("");

  React.useEffect(() => {
    async function fetchData() {
      const { data: articles } = await getArticles();
      const { data: clients } = await getClients();
      const { data: commands } = await getCommands();
      const { data: me } = await getMe();
      if (me.role != "admin") {
        window.location.replace("https://www.perdu.com/");
      }

      console.log("OK");

      setArticles(articles.length);
      setClients(clients.length);
      setLivraisons(getLivraisons(commands));
      setDepenses(getDepenses(commands));
    }
    fetchData();
  }, []);

  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={3}>
          <Card value={clients} title="Utilisateurs" icon="0"></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card value={articles} title="Articles" icon="1"></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card value={livraisons} title="Livraison" icon="2"></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card value={depenses} title="Dépenses"></Card>
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12} sm={12} md={12}>
          <CardChart></CardChart>
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={12} md={12}>
          <CardTable></CardTable>
        </Grid>
      </Grid>
    </div>
  );
}
