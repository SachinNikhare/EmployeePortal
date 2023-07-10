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

let mysql = require("mysql");

let connData = {
  host: "localhost",
  user: "root",
  database: "employees",
};

app.get("/emps/filter/:col/sort",function(req,res){
  const col = req.params.col;
  const {dept = "", des="", gender=""} = req.query;

  const params=[];
  let filterquery = [];
  let connection = mysql.createConnection(connData);
  if(dept){
    filterquery.push("department=?");
    params.push(dept);
  }
  if(des){
    filterquery.push("designation=?");
    params.push(des);
  }
  if(gender){
    filterquery.push("gender=?");
    params.push(gender);
  }
  filterquery=filterquery.join(" AND ");
  let sql = `SELECT * FROM employees WHERE (${filterquery}) ORDER BY ${col} ASC`;
  connection.query(sql,params,function(err,result){
    if(err) return res.send(err);
    else return res.send(result);
  });
});

app.get("/emps/filter",function(req,res){
  // const {dept = "", des="", gender=""} = req.params;
  const {dept = "", des="", gender=""} = req.query;

  const params=[];
  let filterquery = [];
  let connection = mysql.createConnection(connData);
  if(dept){
    filterquery.push("department=?");
    params.push(dept);
  }
  if(des){
    filterquery.push("designation=?");
    params.push(des);
  }
  if(gender){
    filterquery.push("gender=?");
    params.push(gender);
  }
  filterquery=filterquery.join(" AND ");
  let sql = `SELECT * FROM employees WHERE (${filterquery})`;
  connection.query(sql,params,function(err,result){
    if(err) return res.send(err);
    else return res.send(result);
  });
});



app.get("/emps/:col/sort", function (req, res) {
  let col = req.params.col;
  let connection = mysql.createConnection(connData);
  let sql = `SELECT * FROM employees ORDER BY ${col}`;
  connection.query(sql, function (err, result) {
    if (err) return res.send(err);
    else return res.send(result);
  });
});

app.get("/emps/des/:des/:col/sort", function (req, res) {
  let des = req.params.des;
  let col = req.params.col;
  let connection = mysql.createConnection(connData);
  let sql = `SELECT * FROM employees WHERE designation=? ORDER BY ${col}`;
  connection.query(sql, des, function (err, result) {
    if (err) return res.send(err);
    else res.send(result);
  });
});

app.get("/emps/des/:des", function (req, res) {
  let des = req.params.des;
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM employees WHERE designation=?";
  connection.query(sql, des, function (err, result) {
    if (err) return res.send(err);
    else res.send(result);
  });
});

app.get("/emps/dept/:dept/:col/sort", function (req, res) {
  let dept = req.params.dept;
  let col = req.params.col;
  let connection = mysql.createConnection(connData);
  let sql = `SELECT * FROM employees WHERE department=? ORDER BY ${col}`;
  connection.query(sql, dept, function (err, result) {
    if (err) res.send(err);
    else res.send(result);
  });
});

app.get("/emps/dept/:dept", function (req, res) {
  let dept = req.params.dept;
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM employees WHERE department=?";
  connection.query(sql, dept, function (err, result) {
    if (err) res.send(err);
    else res.send(result);
  });
});

app.get("/emps", function (req, res) {
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM employees";
  connection.query(sql, function (err, result) {
    if (err) return res.send(err);
    else return res.send(result);
  });
});

app.post("/newemp", function (req, res) {
  let body = req.body;
  const { empcode, name, department, designation, salary, gender } = body;
  const params = [empcode, name, department, designation, salary, gender];
  let connection = mysql.createConnection(connData);
  let sql =
    "INSERT INTO employees(empcode, name, department, designation, salary, gender) VALUES(?,?,?,?,?,?)";
  connection.query(sql, params, function (err, result) {
    if (err) return res.send(err);
    else return res.send(result);
  });
});

app.get("/emp/:id",function(req,res){
    let id = req.params.id;
    let sql = "SELECT * FROM employees WHERE empcode=?";
    let connection = mysql.createConnection(connData);
    connection.query(sql,id,function(err,result){
        if(err) res.send(err);
        else res.send(result);
    })
})

app.put("/edit/:id",function(req,res){
    let id = req.params.id;
    let body = req.body;
    let {name, department, designation, salary, gender} = body;
    const params = [name,department,designation,salary,gender,id];
    let connection = mysql.createConnection(connData);
    let sql = "UPDATE employees SET name=?, department=?, designation=?, salary=?, gender=? WHERE empcode=?";
    connection.query(sql,params,function(err,result){
        if(err) return res.send(err);
        else return res.send(result);
    })
})

app.delete("/delete/:id",function(req,res){
    let id = req.params.id;
    let connection = mysql.createConnection(connData);
    let sql = "DELETE FROM employees WHERE empcode=?";
    connection.query(sql,id,function(err,result){
        if(err) res.send(err);
        else res.send(result);
    })
})