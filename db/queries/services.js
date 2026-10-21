import db from "../db.js";

export const createService = async ({ title, description }) => {
  try {
    const {
      rows: [service],
    } = await db.query(`
        INSERT INTO services (
          title,
          description)
        VALUES (
          '${title}',
          '${description}')
        RETURNING *;
      `);
    return service;
  } catch (err) {
    console.log(`ERROR CREATING SERVICE:`, err);
  }
};

export const updateServiceById = async (id) => {};

export const getAllServices = async () => {};

export const getServiceById = async (id) => {};
