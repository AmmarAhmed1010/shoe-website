import data from "./products.json";
export type Product = (typeof data)[number];
export const products: Product[] = data;
export const categories = [
  "All Shoes",
  "Sneakers",
  "Runners",
  "Skate",
  "Basketball",
  "Boots",
  "Loafers",
];
export const sizeRows = [
  [6, 5, 38.5, 24],
  [6.5, 6, 39, 24.5],
  [7, 6, 40, 25],
  [7.5, 6.5, 40.5, 25.5],
  [8, 7, 41, 26],
  [8.5, 7.5, 42, 26.5],
  [9, 8, 42.5, 27],
  [9.5, 8.5, 43, 27.5],
  [10, 9, 44, 28],
  [10.5, 9.5, 44.5, 28.5],
  [11, 10, 45, 29],
  [11.5, 10.5, 46, 29.5],
  [12, 11, 46.5, 30],
  [13, 12, 47.5, 31],
];
export const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
