import React, { Component } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

/* Services*/
import { saveClient, getClient, updateClient } from "../Services/clientservice";

export default function ArticleForm(props) {
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

  /*On Component Mount */
  React.useEffect(() => {
    async function fetchData() {
      if (props.id != "") {
        const { data: client } = await getClient(props.id);
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
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const client = {
        name: prenom,
        surName: nom,
        sexe: sexe,
        tel: tel,
        fax: fax,
        pays: pays,
        ville: ville,
        rue: addr,
        codePostale: postal,
        taux_remise: remise,
        email: email,
        password: pw,
        role: role,
      };
      console.log(client);
      if (props.id != "") {
        await updateClient(props.id, client);
        toast.success("Client Modifié !");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        await saveClient(client);
        toast.success("Client Ajoutée ! ");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (e) {}
  };

  return (
    <Form style={{ height: "100%" }}>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Nom</Form.Label>
          <Form.Control
            value={nom}
            placeholder="Nom de l'utilisateur"
            onChange={(e) => setNom(e.target.value)}
          />
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Prénom</Form.Label>
          <Form.Control
            placeholder="Prénom de l'utilisateur"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
        </Form.Group>
      </Form.Row>

      <Form.Group controlId="formGridAddress2">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          placeholder="Email de l'utilisateur"
          onChange={(e) => setEmail(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Form.Row>
        <Form.Group as={Col} controlId="formGridCity">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            type="password"
            placeholder="Mot de passe"
            onChange={(e) => setPw(e.target.value)}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>Confirmer Mot de passe</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirmation"
            onChange={(e) => setPw2(e.target.value)}
          />
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => setRole(e.target.value)}
            value={role}
          >
            <option>Choisir...</option>
            <option value="admin">Administrateur</option>
            <option value="fournisseur">Fournisseur</option>
            <option value="user">Client</option>
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Sexe</Form.Label>
          <Form.Control
            value={sexe}
            as="select"
            onChange={(e) => setSexe(e.target.value)}
          >
            <option>Choisir...</option>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
            <option value="autre">Autres</option>
          </Form.Control>
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Téléphone</Form.Label>
          <PhoneInput
            country={"fr"}
            value={tel}
            onChange={(data) => setTel(data)}
          />
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Fax</Form.Label>
          <PhoneInput
            country={"fr"}
            value={fax}
            onChange={(data) => setFax(data)}
          />
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Pays</Form.Label>
          <Form.Control
            value={pays}
            placeholder="Pays"
            onChange={(e) => setPays(e.target.value)}
          />
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Ville</Form.Label>
          <Form.Control
            value={ville}
            placeholder="Ville"
            onChange={(e) => setVille(e.target.value)}
          />
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Addresse</Form.Label>
          <Form.Control
            value={addr}
            placeholder="Addresse"
            onChange={(e) => setAddr(e.target.value)}
          />
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Code Postal</Form.Label>
          <Form.Control
            value={postal}
            placeholder="Code Postal"
            onChange={(e) => setPostal(e.target.value)}
          />
        </Form.Group>
      </Form.Row>
      <Form.Group>
        <Form.Label>Taux de Remise</Form.Label>
        <Form.Control
          value={remise}
          placeholder="Taux de Remise"
          onChange={(e) => setRemise(e.target.value)}
        ></Form.Control>
      </Form.Group>

      <Button variant="primary" onClick={handleSubmit} block>
        Valider
      </Button>
    </Form>
  );
}
