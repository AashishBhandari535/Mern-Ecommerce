import React from "react";

import "chart.js/auto";
import { Bar } from "react-chartjs-2";

export default function CategoriesBar({ products }) {
  const categories = [
    "Electronics",
    "Cameras",
    "Laptops",
    "Accessories",
    "Headphones",
    "Food",
    "Books",
    "Clothes/Shoes",
    "Beauty/Health",
    "Sports",
    "Outdoor",
    "Home",
  ];

  const barState = {
    labels: categories,
    datasets: [
      {
        label: "Products",
        borderColor: "#17a2b8",
        backgroundColor: "#17a2b8",
        hoverBackgroundColor: "#6b21a8",
        data: categories.map(
          (cat) => products?.filter((item) => item.category === cat).length
        ),
      },
    ],
  };
  return (
    <>
      <Bar data={barState} />
    </>
  );
}
