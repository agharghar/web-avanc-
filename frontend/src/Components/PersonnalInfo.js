import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Button, Row, Col } from "react-bootstrap";
import { getMe } from "../Services/userservice";

export default function FormPropsTextFields() {
  const [nom, setNom] = React.useState("");
  const [prenom, setPrenom] = React.useState("");
  const [addr, setAddr] = React.useState("");

  React.useEffect(() => {
    async function fetchData() {
      const { data: client } = await getMe();
      setNom(client.name);
      setPrenom(client.surName);
      setAddr(client.rue);
    }
    fetchData();
  }, []);

  return (
    <Form>
      <Form.Row>
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Nom</Form.Label>
          <Form.Control placeholder="Nom" disabled value={nom} />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>Prénom</Form.Label>
          <Form.Control placeholder="Prénom" disabled value={prenom} />
        </Form.Group>
      </Form.Row>

      <Form.Group controlId="formGridAddress1">
        <Form.Label>Addresse</Form.Label>
        <Form.Control disabled placeholder="Adresse" value={addr} />
      </Form.Group>
    </Form>
  );
}
