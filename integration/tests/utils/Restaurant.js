export function createCustomer(restaurant, loyaltyPoints = 0) {
  return restaurant.getCustomerService().createCustomer({
    name: "John Doe",
    email: "john.doe@example.com",
    address: "oui",
    phone: "3630",
    loyaltyPoints,
  });
}
