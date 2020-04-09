import React, { Component } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { toast } from "react-toastify";

/* Services*/
import { saveDepot, updateDepot, getDepot } from "../Services/depotservice";

export default function ArticleForm(props) {
  /*Form State*/
  const [name, setName] = React.useState("");
  const [address, setAdress] = React.useState("");

  /*On Component Mount */
  React.useEffect(() => {
    async function fetchData() {
      if (props.id != "") {
        const { data: depot } = await getDepot(props.id);
        setName(depot.name);
        setAdress(depot.adresse);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const depot = {
        name: name,
        adresse: address,
      };
      if (props.id != "") {
        await updateDepot(props.id, depot);
        toast.success("Dépot Modifié !");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        await saveDepot(depot);
        toast.success("Dépot Ajoutée ! ");
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
          <Form.Label>Nom</Form.Label>
          <Form.Control
            value={name}
            placeholder="Nom"
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Adresse</Form.Label>
          <Form.Control
            placeholder="Adresse"
            value={address}
            onChange={(e) => setAdress(e.target.value)}
          />
        </Form.Group>
      </Form.Row>

      <Button variant="primary" onClick={handleSubmit}>
        Valider
      </Button>
    </Form>
  );
}
