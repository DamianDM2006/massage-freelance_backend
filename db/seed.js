import db from "./client.js";
import { faker } from "@faker-js/faker";

import { createAddress } from "./queries/addresses.js";
import { createPatient } from "./queries/patient_info.js";
import { createService } from "./queries/services.js";

const seedAddresses = async () => {
  for (let i = 1; i <= 3; i++) {
    const streetLine1 = faker.location.streetAddress(false);
    const unit = faker.location.buildingNumber();
    const city = faker.location.city();

    const address = {
      streetLine1: streetLine1,
      streetLine2: "",
      unit: unit,
      city: city,
      subDist: "Huai Racha",
      district: "Huai Rat",
      state: "Buriram",
      postalCode: 31000,
    };
    await createAddress(address);
  }
};

const seedPatients = async () => {
  for (let i = 1; i <= 10; i++) {
    const rawBirthdate = faker.date.birthdate({
      mode: "age",
      min: 13,
      max: 90,
    });
    const birthdate = rawBirthdate.toISOString().split("T")[0];
    const gender = faker.person.sex();
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName();
    const addressID = Math.floor(Math.random() * 3) + 1;
    const email = faker.internet.email({ firstName: firstName });
    const phone = faker.phone.number({ style: "international" });

    const patient = {
      firstName: firstName,
      lastName: lastName,
      nickname: firstName,
      gender: gender,
      addressID: addressID,
      email: email,
      lineID: "none",
      phone: phone,
      birthdate: birthdate,
    };
    await createPatient(patient);
  }
};

const seedServices = async () => {
  for (let i = 1; i <= 3; i++) {
    const title = `Massage Title ${i}`;
    const description = `Description Number ${i}`;
    const service = {
      title: title,
      description: description
    };
    await createService(service)
  }
}
await db.connect();
await seedAddresses();
await seedPatients();
await seedServices();
await db.end();
