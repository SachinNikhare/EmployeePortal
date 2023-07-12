//{POSTGRES BLOCK}
let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const {Client} = require("pg");
const client = new Client({
  user: "postgres",
  password: "&@(#!n@nikhare",
  port: 5432,
  host: "db.pgahfjcmiedlmawtfgbn.supabase.co",
  ssl: {rejectUnauthorized: false},
});
client.connect(function(res,error){
  console.log("Connected!!!");
});


app.get("/users",function(req,res,next){
  console.log("Inside /users get api");
  const query = `SELECT * FROM users`;
  client.query(query,function(err,result){
    if(err) {
        console.log(err);
      return res.status(440).send(err);
    }
    console.log("ROWS",result.rows);
    return res.send(result.rows);
    client.end();
  });
});

app.post("/user",function(req,res,next){
  console.log("Inside post of user");
  var values = Object.values(req.body);
  console.log(values);
  const query = `INSERT INTO users(email, firstname, lastname, age) VALUES ($1,$2,$3,$4)`;
  client.query(query,values,function(err,result){
    if(err){
        return res.status(400).send(err);
    }
    console.log(result);
    return res.send(`${result.rowCount} insertion successful`);
  });
});

app.put("/user/:id",function(req,res,next){
    console.log("Inside put of user");
    let userId = req.params.id;
    let age = req.body.age;
    let values = [age,userId];
    const query = `
    UPDATE users SET age = $1
    WHERE id=$2`;
    client.query(query,values,function(err,result){
        if(err){
            return res.status(400).send(err);
        }
        return res.send(`${result.rowCount} updation successful`);
    });
});