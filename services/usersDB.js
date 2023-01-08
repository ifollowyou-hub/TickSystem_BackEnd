const db = require("./pdb");
const helper = require("../helper");
const config = require("../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");

// register user
async function resigter({ firstname, lastname, email, password }) {
  try {
    hash = await bcrypt.hash(password, 10);
    await db.query(
      `Insert into users(firstname, lastname, email, password) values($1, $2, $3, $4)`,
      [firstname, lastname, email, hash]
    );
    return "success";
  } catch (e) {
    return e.code;
  }
}

async function getMultiple(page = 1) {
  console.log("page :>> ", page);
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query("SELECT * FROM users OFFSET $1 LIMIT $2", [
    offset,
    config.listPerPage,
  ]);
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return { data, meta };
}

async function signin({ email, password }) {
  try {
    let rows = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (!rows[0]) return { code: "register" };
    let data = helper.emptyOrRows(rows);
    let bal = await bcrypt.compare(password, data[0].password);
    if (bal) {
      let session = {
        email: data[0].email,
        firstname: data[0].firstname,
        lastname: data[0].lastname,
      };
      let token = await jwt.sign(session, "ticket", {
        expiresIn: "1h",
      });
      return { code: "success", token };
    } else {
      return { code: "wrong" };
    }
  } catch (e) {
    console.log("e :>> ", e);
  }
}

async function updateInfo({ uId, firstname, lastname }) {
  console.log("uId, firstname, lastname :>> ", uId, firstname, lastname);
  try {
    await db.query(`UPDATE users set firstname=$1, lastname=$2 where uid=$3`, [
      firstname,
      lastname,
      uId,
    ]);
    return "success";
  } catch (e) {
    console.log("e :>> ", e);
  }
}

// async function getOne(tId) {
//   const rows = await db.query(`SELECT * from ticket WHERE id=$1`, [tId]);
//   const data = helper.emptyOrRows(rows);
//   return { data };
// }

// async function updateById({tId, ticket, author}) {
//   try{
//     await db.query(`UPDATE ticket set ticket=$1, author=$2 where id=$3`, [ticket, author, tId]);
//     console.log('object :>> ');
//     getOne(tId)
//   }
//   catch(e){
//     return e;
//   }
// }

async function deleteById({ tId }) {
  try {
    return await db.query(`DELETE FROM users WHERE uid = $1`, [tId]);
  } catch (e) {
    return e;
  }
}

module.exports = {
  resigter,
  signin,
  getMultiple,
  deleteById,
  updateInfo,
};
