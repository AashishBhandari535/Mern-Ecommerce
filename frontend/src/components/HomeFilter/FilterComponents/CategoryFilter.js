import React from "react";

export default function CategoryFilter({
  setCurrentCategory,
  currentCategory,
}) {
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
  return (
    <>
      <div>
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8,1fr)",
            gap: "10px",
          }}
          className="list-unstyled px-lg-4"
        >
          {categories.map((category) => (
            <li
              className={`category-button p-2 text-center ${
                currentCategory === category
                  ? "category-button__active"
                  : " sdsd"
              } `}
              onClick={() => setCurrentCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
