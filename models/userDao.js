const { DataSource } = require('typeorm');

const appDataSource = new DataSource({
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

appDataSource
  .initialize()
  .then(() => {
    console.log('UsersDao Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error occurred during Data Source initialization', err);
    appDataSource.destroy();
  });

const createUser = async (name, email, password, profileImage) => {
  try {
    return await appDataSource.query(
      `INSERT INTO users(
                name,
                email, 
                password,
                profile_image
                ) VALUES (?, ?, ?, ?);
            `,
      [name, email, password, profileImage]
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

const userAllPostView = async (userId) => {
  try {
    return await appDataSource.query(
      `SELECT
      u.id as userId,
      u.profile_image as userProfileImage,
      (SELECT
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "postingID", p.id,
            "postingTitle", p.title,
            "postingContent", p.content
          )
        ) 
        ) as postings 
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = ?
        GROUP BY p.user_id;`,
      { userId }
    );
  } catch (err) {
    const error = new Error('DO_NOT_GET_DATA');
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  createUser,
  userAllPostView,
};
