import db from "../client.js";
console.log(`INITIATING ADDRESS QUERY`);

export const createAddress = async ({ streetLine1, unit, city, subDist, district, state }) => {
  try {
    const { rows: [address] } = await db.query(`
      INSERT INTO addresses (
        street_number_1,
        apt_unit,
        city,
        sub_district,
        district,
        provence_state)
      VALUES (
        '${streetLine1}',
        '${unit}',
        '${city}',
        '${subDist}',
        '${district}',
        '${state}')
      RETURNING *;
      `);
  } catch(err) {
    console.log(`ERROR CREATING EMPLOYEE`, err)
  }
}