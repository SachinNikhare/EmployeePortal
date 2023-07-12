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

app.get("/emps/filter/:col/sort",function(req,res,next){
    const col = req.params.col;
    const {dept = "", des="", gender=""} = req.query;
    const params = [];
    let filterquery = [];
    if(dept){
        filterquery.push("department=$1");
        params.push(dept);
      }
      if(des){
        filterquery.push("designation=$2");
        params.push(des);
      }
      if(gender){
        filterquery.push("gender=$3");
        params.push(gender);
      }
      filterquery=filterquery.join(" AND ");
      let query = `SELECT * FROM employees WHERE ${filterquery} ORDER BY ${col} ASC`;
      client.query(query,params,function(err,result){
        if(err) return res.status(440).send(err);
        else return res.send(result.rows);
        client.end();
      });
})

app.get("/emps/filter",function(req,res){
    console.log("INSIDE /emps/filter")
    const {dept = "", des="", gender=""} = req.query;
    const params=[];
    let filterquery = [];
    let index = 1;
    if(dept){
      filterquery.push(`department=$`+index);
      params.push(dept);
      index++;
    }
    if(des){
      filterquery.push(`designation=$`+index);
      params.push(des);
      index++;
    }
    if(gender){
      filterquery.push(`gender=$`+index);
      params.push(gender);
    }
    filterquery=filterquery.join(" AND ");
    let query = `SELECT * FROM employees WHERE ${filterquery}`;
    client.query(query,params,function(err,result){
        if(err) return res.status(440).send(err);
        else{
            return res.send(result.rows);
        }
        client.end();
    });
  });


app.get("/emps/:col/sort",function(req,res,next){
    console.log("Inside /emps/:col/sort");
    let col = req.params.col;
    let query = `SELECT * FROM employees ORDER BY ${col}`;
    client.query(query,function(err,result){
        if(err) res.status(440).send(err);
        else res.send(result.rows);
    });
});

app.get("/emps/des/:des/:col/sort",function(req,res,next){
    console.log("Inside /emps/des/:des/:col/sort");
    let des = req.params.des;
    let col = req.params.col;
    let query = `SELECT * FROM employees WHERE designation=$1 ORDER BY ${col}`;
    client.query(query,[des],function(err,result){
        if(err) res.status(440).send(err);
        else res.send(result.rows);
    });
});
  
app.get("/emps/des/:des",function(req,res,next){
    let des = req.params.des;
    let query = `SELECT * FROM employees WHERE designation=$1`;
    client.query(query,[des],function(err,result){
        if(err) return res.status(440).send(err);
        else res.send(result.rows);
    });
});

app.get("/emps/dept/:dept/:col/sort",function(req,res,next){
    console.log("Inside /emps/dept/:dept/:col/sort");
    let dept = req.params.dept;
    let col = req.params.col;
    let query = `SELECT * FROM employees WHERE department=$1 ORDER BY ${col}`;
    client.query(query,[dept],function(err,result){
        if(err) res.status(440).send(err);
        else res.send(result.rows);
    });
});

app.get("/emps/dept/:dept",function(req,res,next){
    let dept = req.params.dept;
    let query = 'SELECT * FROM employees WHERE department=$1';
    client.query(query,[dept],function(err,result){
        if(err) res.send(err);
        else res.send(result.rows);
    })
})

app.get("/emps",function(req,res,next){
    console.log("Inside /emps get api");
    const query = `SELECT * FROM employees`;
    client.query(query,function(err,result){
        if(err){
            console.log(err);
            return res.status(440).send(err);
        }
        console.log("ROWS",result.rows);
        return res.send(result.rows);
        client.end();
    });
});

app.post("/newemp",function(req,res,next){
    console.log("Inside post of employees");
    let values = Object.values(req.body);
    console.log(values);
    const query = `INSERT INTO employees(empcode, name, department, designation, salary, gender) VALUES ($1,$2,$3,$4,$5,$6)`;
    client.query(query,values,function(err,result){
        if(err){
            return res.status(400).send(err);
        }
        console.log(result)
        return res.send(`${result.rowCount} insertion successful`);
    })
})

app.put("/edit/:id",function(req,res,next){
    console.log("Inside put of employees");
    let id = req.params.id;
    let body = req.body;
    const {name, department, designation, salary, gender} = body;
    let values = [name,department,designation,salary,gender,id];
    const query = `UPDATE employees SET name=$1, department=$2, designation=$3, salary=$4, gender=$5 WHERE empcode=$6`;
    client.query(query,values,function(err,result){
        if(err){
            return res.status(400).send(err);
        }
        else{
            return res.send(`${result.rowCount} updation successful`);
        }
    });
});

app.delete("/delete/:id",function(req,res,next){
    console.log("Inside Delete of employees");
    let id = req.params.id;
    const query = `DELETE FROM employees WHERE empcode=$1`;
    client.query(query,[id],function(err,result){
        if(err){
            return res.status(400).send(err);
        }
        else{
            return res.send(`${id} deleted`);
        }
    });
});