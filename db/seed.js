import db from "./client.js";
import { faker } from "@faker-js/faker";

import { createAddress } from "./queries/addresses.js";

const seedAddresses = async () => {
  for (let i = 1; i <= 3; i++) {
    const streetLine1 = faker.location.streetAddress(false);
    const unit = faker.location.buildingNumber();
    const city = faker.location.city();

    const address = {
      streetLine1: streetLine1,
      unit: unit,
      city: city,
      subDist: "Huai Racha",
      district: "Huai Rat",
      state: "Buriram"
    };
    await createAddress(address);
    console.log(`ADDRESS FROM seedAddresses:`, address);
  }
};

await db.connect();
await seedAddresses();
await db.end();

console.log(`Addresses are seeded`);
