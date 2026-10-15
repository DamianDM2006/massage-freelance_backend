import db from "../client.js";
console.log(`INITIATING ADDRESS QUERY`);

export const createAddress = async ({
  streetLine1,
  streetLine2,
  unit,
  city,
  subDist,
  district,
  state,
  postalCode,
}) => {
  try {
    const {
      rows: [address]
    } = await db.query(`
      INSERT INTO addresses (
        street_number_1,
        street_number_2,
        apt_unit,
        city,
        sub_district,
        district,
        provence_state,
        postal_code)
      VALUES (
        '${streetLine1}',
        '${streetLine2}',
        '${unit}',
        '${city}',
        '${subDist}',
        '${district}',
        '${state}',
        '${postalCode}')
      RETURNING *;
      `);
    return address;
  } catch (err) {
    console.log(`ERROR CREATING EMPLOYEE`, err);
  }
};
