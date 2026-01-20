// db.js
const mysql = require("mysql2/promise");

// 创建连接池（不是单个连接）
const pool = mysql.createPool({
  host: "127.0.0.1",      // 如果是服务器本机 mysql
  port: 3306,
  user: "music_user",
  password: "Qinguanqiao1356",
  database: "music_website_vue3",
  waitForConnections: true,
  connectionLimit: 10,    // 最大连接数
  queueLimit: 0,
  charset: "utf8mb4"
});

// 暴露一个统一的数据库访问方法
async function connectDB(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (err) {
    console.error("❌ 数据库操作失败:", err);
    throw err;
  }
}

module.exports = {
  connectDB
};
