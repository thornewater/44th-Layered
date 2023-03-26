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
    console.log('likeDao Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error occurred during Data Source initialization', err);
    appDataSource.destroy();
  });

const createLike = async (userId, postId) => {
  try {
    return await appDataSource.query(
      `INSERT INTO likes(
                user_id,
                post_id
            ) VALUES (?, ?);`,
      [userId, postId]
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  createLike,
};
