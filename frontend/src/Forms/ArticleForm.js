import React, { Component } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { toast } from "react-toastify";

/* Services*/
import { getDepots } from "../Services/depotservice";
import { getFournisseurs } from "../Services/fournisseurservice";
import { saveArticle, updateArticle } from "../Services/articleservice";
import { getArticle } from "../Services/articleservice";

export default function ArticleForm(props) {
  const [depots, setDepot] = React.useState([]);
  const [fournisseurs, setFournisseur] = React.useState([]);

  /*Form State*/
  const [ref, setRef] = React.useState("");
  const [libelle, setLibelle] = React.useState("");
  const [depot, setDpot] = React.useState("");
  const [frn, setFrn] = React.useState("");
  const [pa, setPA] = React.useState("");
  const [qte, setQte] = React.useState("");
  const [prixVente, setPv] = React.useState("");

  /*On Component Mount */
  React.useEffect(() => {
    async function fetchData() {
      const { data: depots } = await getDepots([]);
      const { data: fournisseur } = await getFournisseurs([]);
      setDepot(depots);
      setFournisseur(fournisseur);
      if (props.id != "") {
        const { data: article } = await getArticle(props.id);
        setLibelle(article.libelle);
        setRef(article.ref);
        setPA(article.prixAchat);
        setPv(article.prixVenteHT);
        setQte(article.qte);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const article = {
        libelle: libelle,
        ref: ref,
        prixAchat: pa,
        prixVenteHT: prixVente,
        qte: qte,
        fournisseur: frn,
        depot: depot,
      };
      if (props.id != "") {
        await updateArticle(props.id, article);
        toast.success("Article Modifié !");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        await saveArticle(article);
        toast.success("Article Ajoutée ! ");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (e) {}
  };

  return (
    <Form>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Réference</Form.Label>
          <Form.Control
            value={ref}
            placeholder="Ref"
            onChange={(e) => setRef(e.target.value)}
          />
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Libelle</Form.Label>
          <Form.Control
            placeholder="Libelle"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
          />
        </Form.Group>
      </Form.Row>

      <Form.Group>
        <Form.Label>Dépot</Form.Label>
        <Form.Control as="select" onChange={(e) => setDpot(e.target.value)}>
          <option>Choisir...</option>
          {depots.map((depot) => {
            return <option value={depot._id}>{depot.name}</option>;
          })}
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Fournisseur</Form.Label>
        <Form.Control as="select" onChange={(e) => setFrn(e.target.value)}>
          <option>Choisir...</option>
          {fournisseurs.map((f) => {
            return <option value={f._id}>{f.name}</option>;
          })}
        </Form.Control>
      </Form.Group>

      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Prix Achat</Form.Label>
          <Form.Control
            value={pa}
            placeholder="Prix Achat"
            onChange={(e) => setPA(e.target.value)}
          />
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Prix Vente</Form.Label>
          <Form.Control
            value={prixVente}
            placeholder="Prix HT"
            onChange={(e) => setPv(e.target.value)}
          />
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Quantité</Form.Label>
          <Form.Control
            value={qte}
            placeholder="Qte"
            onChange={(e) => setQte(e.target.value)}
          />
        </Form.Group>
      </Form.Row>

      <Button variant="primary" onClick={handleSubmit} block>
        Valider
      </Button>
    </Form>
  );
}
