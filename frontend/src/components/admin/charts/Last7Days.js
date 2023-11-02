import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";

import { useLast7DaySalesQuery } from "../../../slices/orderApiSlice";

export default function Last7Days() {
  const { data } = useLast7DaySalesQuery();
  const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let last7daysData = data?.last7daysIncome?.map((item, index) => {
    return {
      day: DAYS[item._id - 1],
      amount: item.total,
    };
  });
  const lineState = {
    labels: last7daysData?.map((item) => item.day),
    datasets: [
      {
        label: `Sales in last7days`,
        borderColor: "#febd69",
        backgroundColor: "#febd69",
        lineTension: 0.5,
        data: last7daysData?.map((item) => item.amount),
      },
    ],
  };

  return (
    <>
      <Line data={lineState} />
    </>
  );
}
