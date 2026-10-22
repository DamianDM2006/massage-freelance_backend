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

export const updateServiceById = async (id, {title, description}) => {
  const sql = `
    UPDATE services
    SET
      title = '${title}',
      description = '${description}'
    WHERE services.id = ${id}
    RETURNING *
  `;

  try {
    const { rows: [service] } = await db.query(sql);
    console.log(`service FROM getServiceDetailsById:`, service);
    if (!service) throw new Error(`There is no data related to the query`);
    return service
  } catch (err) {
    console.log(`ERROR UPDATING SERVICE:`, err)
  }
};

export const getAllServices = async () => {
  const sql = `
    SELECT
      services.id AS service_id,
      title
    FROM services
  `;

  try {
    const { rows: services } = await db.query(sql);
    console.log(`services FROM getAllServices:`, services);
    return services
  } catch (err) {
    console.log(`ERROR GETTING ALL SERVICES:`, err)
  }
};

export const getServiceDetailsById = async (id) => {
  const sql = `
    SELECT * FROM services WHERE id = ${id};
  `;

  try {
    const { rows: [service] } = await db.query(sql);
    console.log(`service FROM getServiceDetailsById:`, service);
    if (!service) throw new Error(`There is no data related to the query`);
    return service
  } catch (err) {
    console.log(`ERROR GETTING SERVICE DETAILS`, err)
  }
};
