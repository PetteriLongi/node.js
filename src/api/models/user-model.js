import promisePool from "../../utils/database.js";

const listAllUsers = async () => {
  const [rows] = await promisePool.query("SELECT * FROM wsk_users");
  console.log("rows", rows);
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    "SELECT * FROM wsk_users WHERE user_id = ?",
    [id],
  );

  console.log("rows", rows);

  if (rows.length === 0) {
    return false;
  }

  return rows[0];
};

const addUser = async (user) => {
  const { name, username, email, role, password } = user;
  const sql = `
    INSERT INTO wsk_users (name, username, email, role, password)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [name, username, email, role, password];
  const [result] = await promisePool.execute(sql, params);

  console.log("result", result);

  if (result.affectedRows === 0) {
    return false;
  }

  return {
    user_id: result.insertId,
  };
};

const modifyUser = async (user, id) => {
  const sql = promisePool.format("UPDATE wsk_users SET ? WHERE user_id = ?", [
    user,
    id,
  ]);
  const [result] = await promisePool.execute(sql);

  console.log("result", result);

  if (result.affectedRows === 0) {
    return false;
  }

  return {
    message: "success",
  };
};

const removeUser = async (id) => {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    // Delete all cats belonging to the user first
    await connection.execute("DELETE FROM wsk_cats WHERE owner = ?", [id]);

    // Then delete the user
    const [result] = await connection.execute(
      "DELETE FROM wsk_users WHERE user_id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    await connection.commit();

    return {
      message: "User deleted",
    };
  } catch (error) {
    await connection.rollback();
    console.error("error", error.message);

    return false;
  } finally {
    connection.release();
  }
};

export { listAllUsers, findUserById, addUser, modifyUser, removeUser };
