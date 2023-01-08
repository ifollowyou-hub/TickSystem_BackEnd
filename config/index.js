const env = process.env;

const config = {
  db: {
    /* do not put password or any sensitive info here, done only for demo */
    host: env.DB_HOST || "snuffleupagus.db.elephantsql.com",
    port: env.DB_PORT || "5432",
    user: env.DB_USER || "nkuoqgtn",
    password: env.DB_PASSWORD || "6j6baeqIOTUfwdxqoZVsll6xLmpaeRjL",
    database: env.DB_NAME || "nkuoqgtn",
  },
  listPerPage: env.LIST_PER_PAGE || 10,
};

module.exports = config;
