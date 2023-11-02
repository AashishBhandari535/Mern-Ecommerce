import React from "react";

import { Pie } from "react-chartjs-2";

export default function OrderStatusPie({ orders }) {
  const statuses = ["Processing", "Shipped", "Delivered"];
  const pieState = {
    labels: statuses,
    datasets: [
      {
        backgroundColor: ["#9333ea", "#facc15", "#4ade80"],
        hoverBackgroundColor: ["#a855f7", "#fde047", "#86efac"],
        data: statuses.map(
          (status) =>
            orders?.filter((item) => item.orderStatus === status).length
        ),
      },
    ],
  };
  return (
    <>
      <Pie data={pieState} />
    </>
  );
}
