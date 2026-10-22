import db from "./db.js";
import { faker } from "@faker-js/faker";

import { createAddress } from "./queries/addresses.js";
import { createPatient } from "./queries/patient_info.js";
import { createService } from "./queries/services.js";
import { createClientCreds, updateWhichPatientIsClient } from "./queries/client_credentials.js";
import { createAppointment } from "./queries/appointments.js";

const seedAddresses = async () => {
  for (let i = 1; i <= 3; i++) {
    const streetLine1 = faker.location.streetAddress(false);
    const unit = faker.location.buildingNumber();
    const city = faker.location.city();

    const address = {
      street1: streetLine1,
      street2: "",
      unit: unit,
      city: city,
      subDistrict: "Huai Racha",
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
    const clientID = addressID;
    const email = faker.internet.email({ firstName: firstName });
    const phone = faker.phone.number({ style: "international" });

    const patient = {
      clientID: clientID,
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
    await updateWhichPatientIsClient(clientID, i);
  };
};

const seedServices = async () => {
  for (let i = 1; i <= 3; i++) {
    const title = `Massage Title ${i}`;
    const description = `Description Number ${i}`;
    const service = {
      title: title,
      description: description,
    };
    await createService(service);
  }
};

const seedClients = async () => {
  for (let i = 1; i <= 3; i++) {
    const userName = `TESTING_client${i}`;
    const password = `PASSWORD${i}Test`;
    const newClient = {
      userName: userName,
      password: password,
    };
    await createClientCreds(newClient);
  }
};

const seedAppointments = async () => {
  for (let i = 1; i <= 15; i++) {
    const rawDate = faker.date.future();
    const date = rawDate.toISOString().split("T")[0];

    const rawTime = rawDate.toISOString().split("T")[1];
    const time = rawTime.slice(0, 5);
    
    let [hours, minutes] = time.split(":").map(Number);
    console.log(`split time:`, [hours, minutes]);
    hours = (hours + 1) % 24;

    const increasedTime = `${String(hours)}:${String(minutes)}`;
    console.log(`increasedTime:`, increasedTime);
    

    const patientID = Math.floor(Math.random() * 10) + 1;
    const serviceID = Math.floor(Math.random() * 3) + 1;

    const appointmentData = {
      date: date,
      startTime: time,
      endTime: increasedTime,
      patientID: patientID,
      serviceID: serviceID,
    };
    console.log(appointmentData);

    await createAppointment(appointmentData);
  }
};

await db.connect();
await seedServices();
await seedClients();
await seedAddresses();
await seedPatients();
await seedAppointments();
await db.end();
