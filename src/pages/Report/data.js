import React from "react";
import sales from "../../Images/sales.png";
import inventory from "../../Images/inventory.png";
import orders from "../../Images/orders.png";

const item = [
  {
    id: 1,
    title: "Sales",
    description:
      "Monitor your sales performance with detailed insights. Track revenue, top-selling products and growth.",
    buttonText: "Sales report",
    logo: sales,
    buttonColor: "bg-green-600 hover:bg-green-700",
  },
  {
    id: 2,
    title: "Inventory",
    description:
      "Stay on top of your stock levels. Track product availability, low-stock alerts, and inventory trends.",
    buttonText: "Inventory report",
    logo: inventory,
    buttonColor: "bg-green-600 hover:bg-green-700",
  },
  {
    id: 3,
    title: "Orders",
    description:
      "Track and analyze all your customer orders in one place. View order statuses, fulfillment progress, and sales performance.",
    buttonText: "Order report",
    logo: orders,
    buttonColor: "bg-green-600 hover:bg-green-700",
  },
];

export default item;