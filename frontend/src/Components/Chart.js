import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import "moment/locale/fr";
import { getCommands } from "../Services/commandservice";

var moment = require("moment");
var getDates = () => {
  var dates = [];
  for (var i = 7; i >= 1; i--) {
    dates.push(moment().subtract(i, "days").format("L"));
  }
  return dates;
};

var commandDates = async () => {
  const { data: cmd } = await getCommands();

  var obj = {};
  for (var i = 1; i <= 7; i++) {
    obj[moment().subtract(i, "days").format("L")] = 0;
  }

  for (var i = 0; i < cmd.length; i++) {
    if (obj.hasOwnProperty(moment(cmd[i].date).format("L"))) {
      obj[moment(cmd[i].date).format("L")]++;
    }
  }
  return Object.values(obj).reverse();
};

moment.locale("fr");

export default class Chart extends Component {
  constructor() {
    super();

    this.state = {
      values: [],
    };
  }
  render() {
    const data = {
      labels: getDates(),
      datasets: [
        {
          label: "Achat Hebdomadaire",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.values,
        },
      ],
    };
    console.log(data);

    return <Line ref="chart" data={data} />;
  }

  componentDidMount() {
    commandDates().then((result) =>
      this.setState({
        values: result,
      })
    );
    const { datasets } = this.refs.chart.chartInstance.data;
  }
}
