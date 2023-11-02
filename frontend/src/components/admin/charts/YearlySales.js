import React from "react";

import { Line } from "react-chartjs-2";

export default function YearlySales({ orders }) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date();
  const lineState = {
    labels: months,
    datasets: [
      {
        label: `Sales in ${date.getFullYear() - 1}`,
        borderColor: "#febd69",
        backgroundColor: "#febd69",
        data: months.map((m, i) =>
          orders
            ?.filter(
              (od) =>
                new Date(od.createdAt).getMonth() === i &&
                new Date(od.createdAt).getFullYear() === date.getFullYear() - 1
            )
            .reduce((total, od) => total + od.totalPrice, 0)
        ),
      },
      {
        label: `Sales in ${date.getFullYear()}`,
        borderColor: "#4ade80",
        backgroundColor: "#4ade80",
        data: months.map((m, i) =>
          orders
            ?.filter(
              (od) =>
                new Date(od.createdAt).getMonth() === i &&
                new Date(od.createdAt).getFullYear() === date.getFullYear()
            )
            .reduce((total, od) => total + od.totalPrice, 0)
        ),
      },
    ],
  };
  return (
    <>
      <Line data={lineState} />
    </>
  );
}
