import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import MoneyIcon from "@material-ui/icons/Money";
import { Avatar } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import PeopleIcon from "@material-ui/icons/People";
import ReceiptIcon from "@material-ui/icons/Receipt";
import AllInboxIcon from "@material-ui/icons/AllInbox";

const useStyles = makeStyles({
  root: {
    marginTop: "40px",
    height: "70%"
  },
  avatar: {
    backgroundColor: "green",
    height: 42,
    width: 42
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontWeight: 700,
    fontSize: 12
  },
  icon: {
    height: 32,
    width: 32
  },

  pos: {
    marginBottom: 12
  }
});

export default function SimpleCard(props) {
  const classes = useStyles();

  var getIcon = icon => {
    if (icon == 0) {
      return <PeopleIcon className={classes.icon} />;
    } else if (icon == 1) {
      return <ReceiptIcon className={classes.icon} />;
    } else if (icon == 2) {
      return <AllInboxIcon className={classes.icon} />;
    } else {
      return <MoneyIcon className={classes.icon} />;
    }
  };

  var getColor = icon => {
    if (icon == 0) {
      return "red";
    } else if (icon == 1) {
      return "#3366cc";
    } else if (icon == 2) {
      return "orange";
    } else {
      return "green";
    }
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              {props.title}
            </Typography>
            <Typography variant="h6">{props.value}</Typography>
          </Grid>
          <Grid item>
            <Avatar
              className={classes.avatar}
              style={{
                backgroundColor: getColor(props.icon)
              }}
            >
              {getIcon(props.icon)}
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
