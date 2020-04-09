import React, { Component } from "react";
import { Form, Button, Col, Card } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { getClient, updateClient } from "../Services/clientservice";
import { getMe } from "../Services/userservice";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton } from "@material-ui/core";
import { toast } from "react-toastify";

/* Services*/

export default function Profile() {
  /*Form State*/
  const [nom, setNom] = React.useState("");
  const [prenom, setPrenom] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [pw2, setPw2] = React.useState("");
  const [role, setRole] = React.useState("");
  const [sexe, setSexe] = React.useState("");
  const [tel, setTel] = React.useState("");
  const [fax, setFax] = React.useState("");
  const [pays, setPays] = React.useState("");
  const [ville, setVille] = React.useState("");
  const [addr, setAddr] = React.useState("");
  const [postal, setPostal] = React.useState("");
  const [remise, setRemise] = React.useState("");
  const [disabled, setDisabled] = React.useState(true);
  const [hidden, setHidden] = React.useState("none");
  const [id, setID] = React.useState("");

  React.useEffect(() => {
    async function fetchData() {
      const { data: client } = await getMe();
      setNom(client.surName);
      setPrenom(client.name);
      setEmail(client.email);
      setRole(client.role[0]);
      setSexe(client.sexe);
      setTel(client.tel);
      setFax(client.fax);
      setVille(client.ville);
      setPays(client.pays);
      setAddr(client.rue);
      setRemise(client.taux_remise);
      setPostal(client.codePostale);
      setID(client._id);
    }
    fetchData();
  }, []);

  const handleClick = () => {
    setDisabled(!disabled);
    if (hidden == "") {
      setHidden("none");
    } else {
      setHidden("");
    }
  };

  const handleSubmit = async () => {
    try {
      const client = {
        name: prenom,
        surName: nom,
        sexe: "homme",
        tel: tel,
        fax: fax,
        pays: pays,
        ville: ville,
        rue: addr,
        codePostale: postal,
        taux_remise: remise,
        email: email,
        role: role,
      };
      console.log(client);
      await updateClient(id, client);
      toast.success("Client Modifié !");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (e) {}
  };

  return (
    <Card>
      <Card.Header as="h5">
        Mon Compte{" "}
        <IconButton style={{ outline: "none" }} size="small">
          <EditIcon size="sm" onClick={handleClick}></EditIcon>
        </IconButton>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Nom</Form.Label>
              <Form.Control
                placeholder="Nom"
                value={nom}
                disabled={disabled}
                onChange={(e) => setNom(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                placeholder="Prenom"
                value={prenom}
                disabled={disabled}
                onChange={(e) => setPrenom(e.target.value)}
              />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formGridAddress2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              disabled={disabled}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Role</Form.Label>
            <Form.Control as="select" value={role} disabled>
              <option>Choisir...</option>
              <option value="admin">Administrateur</option>
              <option value="fournisseur">Fournisseur</option>
              <option value="user">Client</option>
            </Form.Control>
          </Form.Group>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Téléphone</Form.Label>
              <PhoneInput
                onChange={(data) => setTel(data)}
                disabled={disabled}
                value={tel}
                country={"fr"}
                inputStyle={{ width: "100%" }}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Fax</Form.Label>
              <PhoneInput
                onChange={(data) => setFax(data)}
                disabled={disabled}
                value={fax}
                country={"fr"}
                inputStyle={{ width: "100%" }}
              />
            </Form.Group>
          </Form.Row>

          <Form.Group>
            <Form.Label>Addresse</Form.Label>
            <Form.Control
              placeholder="Adresse"
              value={addr}
              disabled={disabled}
              onChange={(e) => setAddr(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Pays</Form.Label>
              <Form.Control
                placeholder="Pays"
                value={pays}
                disabled={disabled}
                onChange={(e) => setPays(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Ville</Form.Label>
              <Form.Control
                placeholder="Ville"
                value={ville}
                disabled={disabled}
                onChange={(e) => setVille(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridZip">
              <Form.Label>Code Postal</Form.Label>
              <Form.Control
                placeholder="Code Postal"
                value={postal}
                disabled={disabled}
                onChange={(e) => setPostal(e.target.value)}
              />
            </Form.Group>
          </Form.Row>

          <Form.Group>
            <Form.Label>Taux de remise</Form.Label>
            <Form.Control
              placeholder="Remise"
              value={remise}
              disabled
              onChange={(e) => setRemise(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Form>
        <Button
          variant="primary"
          style={{ display: hidden }}
          block
          onClick={handleSubmit}
        >
          Modifier mes Informations
        </Button>
      </Card.Body>
    </Card>
  );
}
