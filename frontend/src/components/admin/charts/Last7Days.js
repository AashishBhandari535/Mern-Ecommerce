import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";

import moment from "moment";

// queries and mutations
import { useLast7DaySalesQuery } from "../../../slices/orderApiSlice";

export default function Last7Days() {
  const { data } = useLast7DaySalesQuery();
  const lineState = {
    labels: data?.last7daysIncome?.map((item) => [
      moment(new Date(item.paidAt)).format("dddd").substring(0, 3),
      item.paidAt,
    ]),
    datasets: [
      {
        label: `Sales in last7days`,
        borderColor: "#febd69",
        backgroundColor: "#febd69",
        lineTension: 0.5,
        data: data?.last7daysIncome?.map((item) => item.total),
      },
    ],
  };

  return (
    <>
      <Line data={lineState} />
    </>
  );
}
