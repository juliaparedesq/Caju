module.exports = async function (app) {
  await app.get("sequelizeSync");

  try {
    console.log("SYNC DB DATA");

    // Create admin user
    const admin = app.get("admin");

    const ADMIN_USER = {
      name: "Admin",
      email: admin["email"],
      password: admin["password"],
      role: "admin",
      lastname: "admin",
      docID: "123",
      phoneNumber: "123",
      account: "123",
      
    };

    /* Create super user*/
    let user = await app.service("users").find({name: "Admin"});
    if (user.total == 0) {
      await app.service("users").create(ADMIN_USER);
      console.log("Super user created");
    }

  }
  catch (e) {
    console.error(e);
  }

};

