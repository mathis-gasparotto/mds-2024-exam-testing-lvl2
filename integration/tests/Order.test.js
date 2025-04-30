import { describe, it, expect, beforeEach } from "vitest";
import { RestaurantSystem } from "../src/RestaurantService";
import { createCustomer } from "./utils/Restaurant";

describe("Order", () => {
  let restaurant;

  beforeEach(() => {
    restaurant = new RestaurantSystem();
  });

  it("should create a Restaurant", () => {
    expect(restaurant).toBeDefined();
  });

  it("should create an order with single products", () => {
    const customer = createCustomer(restaurant, 0);
    const products = [
      restaurant.getProductService().createProduct({
        name: "Burger",
        price: 10,
        category: "main",
        available: true,
        preparationTimeMinutes: 20,
      }),
      restaurant.getProductService().createProduct({
        name: "Soda",
        price: 2,
        category: "drink",
        available: true,
        preparationTimeMinutes: 30,
      }),
    ]; // max preparation time : 30 | total price : 15
    const quantityPerProduct = 1;
    const totalPrice = 12 * quantityPerProduct;
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setMinutes(
      estimatedDeliveryDate.getMinutes() + 30 + 15
    );
    const loyaltyPointsEarned =
      Math.floor(totalPrice / 10) > 0 ? Math.floor(totalPrice / 10) : 0;

    const order = restaurant.getOrderService().createOrder(
      customer.id,
      products.map((product) => ({
        productId: product.id,
        quantity: quantityPerProduct,
      }))
    );

    expect(order).not.toBeNull();
    expect(order.totalAmount).toBe(totalPrice);
    // j'ai dû faire un Math.floor car il peut y avoir 1ms de différence entre le moment où la function est appelée et le moment où la date expected est calculée
    expect(Math.floor(order.estimatedDeliveryTime.getTime() / 1000)).toBe(
      Math.floor(estimatedDeliveryDate.getTime() / 1000)
    );
    expect(customer.loyaltyPoints).toBe(loyaltyPointsEarned);
  });

  it("should create an order with double products", () => {
    const customer = createCustomer(restaurant, 0);
    const products = [
      restaurant.getProductService().createProduct({
        name: "Burger",
        price: 10,
        category: "main",
        available: true,
        preparationTimeMinutes: 20,
      }),
      restaurant.getProductService().createProduct({
        name: "Soda",
        price: 2,
        category: "drink",
        available: true,
        preparationTimeMinutes: 10,
      }),
    ]; // max preparation time : 20 | total price : 12
    const quantityPerProduct = 2;
    const totalPrice = 12 * quantityPerProduct;
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setMinutes(
      estimatedDeliveryDate.getMinutes() + 20 + 15
    );
    const loyaltyPointsEarned =
      Math.floor(totalPrice / 10) > 0 ? Math.floor(totalPrice / 10) : 0;

    const order = restaurant.getOrderService().createOrder(
      customer.id,
      products.map((product) => ({
        productId: product.id,
        quantity: quantityPerProduct,
      }))
    );

    expect(order).not.toBeNull();
    expect(order.totalAmount).toBe(totalPrice);
    // j'ai dû faire un Math.floor car il peut y avoir 1ms de différence entre le moment où la function est appelée et le moment où la date expected est calculée
    expect(Math.floor(order.estimatedDeliveryTime.getTime() / 1000)).toBe(
      Math.floor(estimatedDeliveryDate.getTime() / 1000)
    );
    expect(customer.loyaltyPoints).toBe(loyaltyPointsEarned);
  });

  it("should create 2 orders with double products", () => {
    const customer = createCustomer(restaurant, 10);
    const products = [
      restaurant.getProductService().createProduct({
        name: "Burger",
        price: 10,
        category: "main",
        available: true,
        preparationTimeMinutes: 20,
      }),
      restaurant.getProductService().createProduct({
        name: "Soda",
        price: 2,
        category: "drink",
        available: true,
        preparationTimeMinutes: 10,
      }),
    ]; // max preparation time : 20 | total price : 12
    const quantityPerProduct = 2;
    const totalPrice = 12 * quantityPerProduct;
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setMinutes(
      estimatedDeliveryDate.getMinutes() + 20 + 15
    );
    const loyaltyPointsEarned =
      Math.floor(totalPrice / 10) > 0 ? Math.floor(totalPrice / 10) : 0;

    // first order
    const order1 = restaurant.getOrderService().createOrder(
      customer.id,
      products.map((product) => ({
        productId: product.id,
        quantity: quantityPerProduct,
      }))
    );

    expect(order1).not.toBeNull();
    expect(order1.totalAmount).toBe(totalPrice);
    expect(Math.floor(order1.estimatedDeliveryTime.getTime() / 1000)).toBe(
      Math.floor(estimatedDeliveryDate.getTime() / 1000)
    );

    // second order
    const order2 = restaurant.getOrderService().createOrder(
      customer.id,
      products.map((product) => ({
        productId: product.id,
        quantity: quantityPerProduct,
      }))
    );

    expect(order2).not.toBeNull();
    expect(order2.totalAmount).toBe(totalPrice);
    expect(Math.floor(order2.estimatedDeliveryTime.getTime() / 1000)).toBe(
      Math.floor(estimatedDeliveryDate.getTime() / 1000)
    );

    expect(customer.loyaltyPoints).toBe(loyaltyPointsEarned * 2);
  });
});
