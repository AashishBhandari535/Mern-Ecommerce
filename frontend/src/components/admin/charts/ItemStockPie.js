import React from "react";

import { Doughnut } from "react-chartjs-2";

export default function ItemStockPie({ products }) {
  let outOfStock = 0;
  products?.forEach((item) => {
    if (item.stock === 0) {
      outOfStock += 1;
    }
  });
  const doughnutState = {
    labels: ["Out of Stock", "In Stock"],
    datasets: [
      {
        backgroundColor: ["#ef4444", "#22c55e"],
        hoverBackgroundColor: ["#dc2626", "#16a34a"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };
  return (
    <>
      <Doughnut data={doughnutState} options={{ maintainAspectRatio: false }} />
    </>
  );
}
