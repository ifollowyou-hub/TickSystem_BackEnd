const db = require("./pdb");
const helper = require("../helper");
const config = require("../config");

async function getMultiple({ keyword }) {
  // console.log("page :>> ", page);
  // const offset = helper.getOffset(page, config.listPerPage);
  let query = "SELECT * FROM ticket ";
  let keyword_qeury = "where title LIKE '%" + keyword + "%'";
  if (keyword) {
    query += keyword_qeury;
  }
  console.log("query :>> ", query);
  const rows = await db.query(query);
  // const rows = await db.query("SELECT * FROM ticket OFFSET $1 LIMIT $2", [
  //   offset,
  //   config.listPerPage,
  // ]);
  const data = helper.emptyOrRows(rows);
  // const meta = { page };

  return { data };
}

async function getOne(tId) {
  const rows = await db.query(`SELECT * from ticket WHERE tid=$1`, [tId]);
  const data = helper.emptyOrRows(rows);
  return { data };
}

async function insertOne({ title, author, description, priority }) {
  try {
    await db.query(
      `Insert into ticket(title, author, description, priority, status) values($1, $2, $3, $4, $5)`,
      [title, author, description, priority, "open"]
    );
    return { code: "success" };
  } catch (e) {
    console.log("e :>> ", e);
    return e;
  }
}

async function updateById({
  tid,
  title,
  description,
  priority,
  status,
  assignee,
}) {
  try {
    await db.query(
      `UPDATE ticket set title=$1, description=$2, priority=$3, status=$4, assignee=$5 where tid=$6`,
      [title, description, priority, status, assignee, tid]
    );
    return "success";
  } catch (e) {
    return e;
  }
}

async function deleteById({ tId }) {
  try {
    return await db.query(`DELETE from ticket where tid=$1`, [tId]);
  } catch (e) {
    return e;
  }
}

async function s_getTickets() {
  try {
    let rows = await db.query(
      `SELECT count(tid) count, 
              'Total' title, 
              COUNT(tid) filter (where createdAt >= current_date::timestamp and createdAt < current_date::timestamp + interval '1 day') as today 
      FROM ticket`
    );

    let data = helper.emptyOrRows(rows);
    rows = await db.query(
      `SELECT count(tid) count, 
              'Open' title, 
              COUNT(tid) filter (where createdAt >= current_date::timestamp and createdAt < current_date::timestamp + interval '1 day') as today 
      FROM ticket WHERE status='open'`
    );
    data = [...data, rows[0]];
    rows = await db.query(
      `SELECT count(tid) count, 
              'Urgent' title, 
              COUNT(tid) filter (where createdAt >= current_date::timestamp and createdAt < current_date::timestamp + interval '1 day') as today 
      FROM ticket 
      WHERE PRIORITY='urgent'`
    );
    data = [...data, rows[0]];

    rows = await db.query(
      `SELECT count(tid) count, 
              'Resolved' title, 
              COUNT(tid) filter (where createdAt >= current_date::timestamp and createdAt < current_date::timestamp + interval '1 day') as today 
      FROM ticket 
      WHERE status='resolved'`
    );
    data = [...data, rows[0]];
    return { data };
  } catch (e) {
    console.log("e :>> ", e);
    return e;
  }
}

async function s_all_resolve_open() {
  try {
    let rows = await db.query(
      `SELECT date(createdat) as date, 
              count(tid) count, 
              COUNT(tid) filter (where status='open') as open_, 
              COUNT(tid) filter (where status='close') as close_, 
              COUNT(tid) filter (where status='resolved') as resolved_ 
      FROM ticket 
      GROUP BY createdat::date 
      ORDER BY date DESC 
      LIMIT 7;`
    );

    let data = helper.emptyOrRows(rows);
    return { data };
  } catch (e) {
    console.log("e :>> ", e);
    return e;
  }
}

async function s_open_daily() {
  try {
    const rows = await db.query(
      `SELECT count(createdat::date), 
              date(createdat) as date  
      FROM ticket 
      GROUP BY createdat::date 
      ORDER BY date DESC
      LIMIT 7`
    );
    const data = helper.emptyOrRows(rows);
    return { data };
  } catch (e) {
    console.log("e :>> ", e);
    return e;
  }
}

async function s_urgent_medium_easy() {
  try {
    let rows = await db.query(
      `SELECT date(createdat) as date, 
              count(tid) count, 
              COUNT(tid) filter (where priority='urgent') as urgent_, 
              COUNT(tid) filter (where priority='medium') as medium_, 
              COUNT(tid) filter (where priority='easy') as easy_ 
      FROM ticket 
      GROUP BY createdat::date 
      ORDER BY date DESC
      LIMIT 7`
    );

    let data = helper.emptyOrRows(rows);
    return { data };
  } catch (e) {
    console.log("e :>> ", e);
    return e;
  }
}

module.exports = {
  getMultiple,
  getOne,
  insertOne,
  updateById,
  deleteById,
  s_getTickets,
  s_all_resolve_open,
  s_open_daily,
  s_urgent_medium_easy,
};
