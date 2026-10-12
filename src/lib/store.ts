"use client";
import { useSyncExternalStore } from "react";
import { products } from "./catalog";
export type Order = {
  id: string;
  product: string;
  size: number;
  price: number;
  date: string;
};
type State = {
  ready: boolean;
  member: boolean;
  orders: Order[];
  storageError: boolean;
  dark: boolean;
};
const empty: State = {
  ready: false,
  member: false,
  orders: [],
  storageError: false,
  dark: false,
};
let state = empty;
let initialized = false;
const key = "soleva.demo.v1";
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "{}");
    const orders = Array.isArray(raw.orders)
      ? raw.orders.filter(
          (o: Order) =>
            o &&
            typeof o.id === "string" &&
            products.some(
              (p) =>
                p.id === o.product &&
                p.sizes.includes(o.size) &&
                p.price === o.price,
            ) &&
            typeof o.date === "string" &&
            Number.isFinite(Date.parse(o.date)),
        )
      : [];
    state = {
      ready: true,
      member: raw.member === true,
      dark: raw.dark === true,
      orders,
      storageError: false,
    };
  } catch {
    state = { ...empty, ready: true, storageError: true };
  }
}
function subscribe(fn: () => void) {
  listeners.add(fn);
  if (!initialized) {
    initialized = true;
    load();
  }
  const update = (e: StorageEvent) => {
    if (e.key === key) {
      load();
      emit();
    }
  };
  window.addEventListener("storage", update);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", update);
  };
}
function save(next: State) {
  localStorage.setItem(
    key,
    JSON.stringify({ member: next.member, orders: next.orders, dark: next.dark }),
  );
  state = next;
  emit();
}
export function useStore() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => empty,
  );
}
export function signInDemo() {
  save({ ...state, member: true });
}
export function toggleTheme() {
  const next = { ...state, dark: !state.dark };
  try { save(next); } catch { state = { ...next, storageError: true }; emit(); }
}
export function signOutDemo() {
  save({ ...state, member: false });
}
export function remaining(product: string, size: number) {
  const p = products.find((p) => p.id === product);
  return p && p.sizes.includes(size)
    ? Math.max(
        0,
        p.stock -
          state.orders.filter((o) => o.product === product && o.size === size)
            .length,
      )
    : 0;
}
export function reservePair(product: string, size: number) {
  load();
  if (!state.member)
    throw new Error("Sign in to the demo before reserving a pair.");
  if (!remaining(product, size))
    throw new Error(
      "This size has already been reserved. Please choose another pair.",
    );
  const p = products.find((p) => p.id === product)!;
  const order = {
    id: "SVA-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
    product,
    size,
    price: p.price,
    date: new Date().toISOString(),
  };
  save({ ...state, orders: [order, ...state.orders] });
  return order;
}
export function resetDemo() {
  save({ ...empty, ready: true });
}
