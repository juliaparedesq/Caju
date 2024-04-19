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
      role: "admin"
    };

    /* Create super user*/
    let user = await app.service("users").find({name: "Admin"});
    if (user.total == 0) {
      await app.service("users").create(ADMIN_USER);
      console.log("Super user created");
    }

    /* Create health service "salud oriente"*/
    let healthService = await app.service("api/healthService").find({name: "Servicio de Salud Metropolitano Oriente"});
    if (healthService.total == 0) {
      const HS = {name: 'Servicio de Salud Metropolitano Oriente', 
      code: 112010};
      await app.service("api/healthService").create(HS);
      console.log("Super health service created");
    }

    // Create 16 organizations
    const organizations = [{
      name: "Hospital Del Salvador",
      adress: "Salvador 364",
      neighborhood: "Providencia",  
      contact_person: 225754000, 
      code: 112100, 
      healthServiceId: 1
    },{
      name: "Hospital Dr. Luis Tisné B.",
      adress: "Las torres 5150",
      neighborhood: "Peñalolén",  
      contact_person:224725200 , 
      code: 112101, 
      healthServiceId: 1
      },{
        name: "Hospital de Niños Dr. Luis Calvo Mackenna",
        adress: "Antonio Varas 360",
        neighborhood: "Providencia",  
        contact_person: 225755800, 
        code: 112102,
        healthServiceId: 1
      },{
        name: "Instituto Nacional de Enfermedades Respiratorias y Cirugía Torácica",
        adress: "José Manuel Infante 717",
        neighborhood: "Providencia",  
        contact_person: 225755000, 
        code: 112103,
        healthServiceId: 1
      },{
        name: "Instituto de Neurocirugía Dr. Alfonso Asenjo",
        adress: "José M. Infante 553",
        neighborhood: "Providencia",  
        contact_person: 225754600, 
        code: 112104,
        healthServiceId: 1
      },{
        name: "Instituto Nacional de Rehabilitación Infantil Presidente Pedro Aguirre Cerda",
        adress: "José Arrieta 5969",
        neighborhood: "Peñalolén",  
        contact_person: 225754350,
        code: 112105,
        healthServiceId: 1
      },{
        name: "Instituto Nacional Geriátrico Presidente Eduardo Frei Montalva",
        adress: "José Manuel Infante 370",
        neighborhood: "Providencia",  
        contact_person: 225754459, 
        code: 112106,
        healthServiceId: 1
      },{
        name: "Centro de Referencia de Salud Cordillera Oriente",
        adress: "Las Torres 5100",
        neighborhood: "Peñalolén",  
        contact_person: 225688200, 
        code: 112300,
        healthServiceId: 1
      },{
        name: "COSAM La Reina",
        adress: "Quillahua 480",
        neighborhood: "La Reina",  
        contact_person: 225750652,
        code: 112606,
        healthServiceId: 1
      },{
        name: "COSAM Macul",
        adress: "Gregorio de la Fuente 3556",
        neighborhood: "Macul",  
        contact_person: 226591746,
        code: 112607, 
        healthServiceId: 1
      },{
        name: "COSAM Ñuñoa",
        adress: "Pichirangui 3650",
        neighborhood: "Ñuñoa",  
        contact_person: 225750203,
        code: 112608,
        healthServiceId: 1
      },{
        name: "COSAM Las Condes",
        adress: "Enrique Foster Sur 153",
        neighborhood: "Las Condes",  
        contact_person: 223358254,
        code: 112609,
        healthServiceId: 1
      },{
        name: "COSAM Peñalolén",
        adress: "Oriental 7250",
        neighborhood: "Peñalolén",  
        contact_person: 229397280,
        code: 112610,
        healthServiceId: 1
      },{
        name: "COSAM Provisam",
        adress: "Manuel Montt 2051",
        neighborhood: "Providencia",  
        contact_person: 223414150,
        code: 112611,
        healthServiceId: 1
      },{
        name: "COSAM Lo Barnechea",
        adress: "Padre Alfredo Arteaga 1873",
        neighborhood: "Lo Barnechea", 
        contact_person: 229557110,
        code: 112612,
        healthServiceId: 1
      },{
        name: "COSAM Vitacura",
        adress: "Indiana 1195",
        neighborhood: "Vitacura",  
        contact_person: 227561178,
        code: 112613,
        healthServiceId: 1
    },{
      name: "Hospital Hanga Roa",
      adress: null,
      neighborhood: null,  
      contact_person: null,
      code: null,
      healthServiceId: 1
  }];  
      
    /* Create each organization*/
    let organization = await app.service("api/organization").find({name: "Hospital Del Salvador"});
    if (organization.total == 0) {
      for(let ind = 0; ind < organizations.length ; ind++){
        await app.service("api/organization").create(organizations[ind]);
      }
      console.log(organizations.length + " organizations were created");
    }
  }
  catch (e) {
    console.error(e);
  }
  
};