import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

/* Custom Components*/
import PersonalInfo from "./PersonnalInfo";
import Facture from "./Facture";

/* Services */

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  table: {
    minWidth: 650,
  },
}));

function arrayToObject(arr) {
  var obj = [];
  for (var i = 0; i < arr.length; ++i) {
    obj[i] = {
      id: arr[i]._id,
      libelle: arr[i].libelle,
      qte: 0,
      qteMax: arr[i].qte,
      prixHT: arr[i].prixVenteHT,
    };
  }
  return obj;
}

function getSteps() {
  return ["Séléction des Articles", "Mes Informations"];
}

var articles = [];

const TestComponent = (props) => {
  const classes = useStyles();

  const [itemsArray, setItemsArray] = React.useState([]);
  React.useEffect(() => {
    async function fetchData() {
      setItemsArray(arrayToObject(props.items));
    }
    fetchData();
  }, [props]);

  const handleAdd = (index) => {
    articles = [...itemsArray];
    if (articles[index].qte >= articles[index].qteMax) {
      return;
    }
    articles[index].qte++;
    setItemsArray(articles);
  };

  const handleMinus = (index) => {
    var articles = [...itemsArray];
    if (articles[index].qte <= 0) {
      return;
    }
    articles[index].qte--;
    setItemsArray(articles);
  };

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Article</TableCell>
            <TableCell>Qte</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {itemsArray.map((row, index) => (
            <TableRow key={row._id}>
              <TableCell component="th" scope="row">
                {row.libelle}
              </TableCell>
              <TableCell>
                <IconButton style={{ outline: "none" }}>
                  <RemoveIcon
                    fontSize="small"
                    onClick={() => handleMinus(index)}
                  />
                </IconButton>
                {row.qte}
                <IconButton style={{ outline: "none" }}>
                  <AddIcon fontSize="small" onClick={() => handleAdd(index)} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const GetStepContent = (stepIndex, items) => {
  switch (stepIndex) {
    case 0:
      return <TestComponent items={items}></TestComponent>;
    case 1:
      return <PersonalInfo></PersonalInfo>;

    default:
      return "Unknown stepIndex";
  }
};

export default function HorizontalLabelPositionBelowStepper(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = async () => {
    /* 
 const { data: user } = await getMe();
    for (var i = 0; i < itemsArray.length; i++) {
      articles[i] = itemsArray[i].id;
    }
    console.log(articles);
    await saveCommand(user._id, articles);
   ;*/
    window.location.reload(false);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div>
        {activeStep === steps.length ? (
          <div>
            <Facture articles={articles}></Facture>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {GetStepContent(activeStep, props.items, classes)}
            </Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Retour
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Facture" : "Suivant"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
