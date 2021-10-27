//for inquirer prompts
const mysql = require('mysql2')
const inquirer = require('inquirer');
const cTable = require('console.table');



const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database`)
)

menu();

function menu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            choices:
                ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update Employee Role', 'Exit Program'],
            description: 'What would you like to do?'
        },
    ]).then(res => {
        switch (res.menu) {
            case ('View All Departments'):
                db.query('SELECT * FROM department', (err, data) => {
                    if (err) { throw err }
                    else { console.table(data) }
                    continueProgram();
                });
                break;
            case ('View All Roles'):
                db.query('SELECT * FROM roles', (err, data) => {
                    if (err) { throw err }
                    else { console.table(data) }
                    continueProgram();
                });
                break;
            case ('View All Employees'):
                db.query('SELECT * FROM employee', (err, data) => {
                    if (err) { throw err }
                    else { console.table(data) }
                    continueProgram();
                });
                break;
            case ('Add a Department'):
                inquirer.prompt(
                    {
                        type: 'input',
                        message: 'Please enter the name of the department.',
                        name: 'dept_name'
                    }
                ).then(res => {
                    db.query('INSERT INTO department(dept_name) VALUES (?);', res.dept_name, (err, data) => {
                        if (err) { console.log(err) }
                        else {
                            console.log('New department added!');
                            continueProgram();
                        };
                    })
                });
                break;
            case ('Add a Role'):
                addRole();
                break;
            case ('Add an Employee'):
                addEmployee();
                break;
            case ('Update Employee Role'):
                updateData();
                break;
            default:
                console.log('Goodbye!');
                process.exit();
        }
    })
}


function continueProgram() {

    inquirer.prompt(
        {
            type: 'confirm',
            message: 'Would you like to continue?',
            name: 'continue'
        }
    ).then(res => {
        var confirm = res.continue;
        if (confirm === true) {
            menu();
        } else {
            console.log('Goodbye!');
            process.exit();
        }
    });
};


function findRoleId(res) {
    var roleId;
    db.query(`SELECT id FROM roles WHERE title = "${res}"`, (err, data) => {
        if (err) { console.log(err) }
        else {
          return roleId = data[0].id;
        }
    });

    return roleId;

}


function addRole() {

    const deptChoices = [];
    db.query(`SELECT id, dept_name FROM department;`, (err, results) => {
        if (err) {
            reject(err);
        } else {
            for (let i = 0; i < results.length; i++) {
                deptChoices.push(results[i].dept_name);
            }
        }
    });

    inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter the title of the role.',
            name: 'title'
        },
        {
            type: 'input',
            message: 'Please enter the salary for this role.',
            name: 'salary'
        },
        {
            type: 'list',
            choices: deptChoices,
            message: 'Which department would you like to add this role to?',
            name: 'dept'
        }
    ]).then(res => {
        // const chosenDept = db.query(`SELECT id FROM department WHERE dept_name = ?`, res.dept, (err, data) => {
        //     if (err) { console.log(err) }
        //     else {
        //         chosenDept = data[0].id
        //     }

        // })

        var chosenDept = findId('department','dept_name',res.dept)

        db.query('INSERT INTO roles(title,salary,dept_id) VALUES (?,?,?)', [res.title, res.salary, chosenDept], (err, data) => {
            if (err) { console.log(err) }
            else {
                console.log('Role added successfully.')
                continueProgram();
            }

        })

    })
}

function roleChoices(){
    var roleChoices = [];
    db.query(`SELECT * FROM roles;`, (err, results) => {
        if (err) {
            reject(err);
        } else {
            for (let i = 0; i < results.length; i++) {
                roleChoices.push(results[i].title);
            }
        }
    });
}

async function addEmployee() {

    const roleChoices = [];
    const managerList = ['None'];

    db.query(`SELECT * FROM roles;`, (err, results) => {
        if (err) {
            reject(err);
        } else {
            for (let i = 0; i < results.length; i++) {
                roleChoices.push(results[i].title);
            }
        }
    });

    db.query(`SELECT * FROM employee;`, (err, results) => {
        if (err) {
            reject(err);
        } else {
            for (let j = 0; j < results.length; j++) {
                managerList.push([results[j].first_name, results[j].last_name]);
            }
        }
    });


    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the employees first name?',
            name: 'first_name'
        },
        {
            type: 'input',
            message: 'What is the employees last name?',
            name: 'last_name'
        },
        {
            type: 'list',
            message: 'Please select this employees role.',
            choices: roleChoices,
            name: 'role'
        },
        {
            type: 'list',
            message: 'Please select this employees manager',
            choices: managerList,
            name: 'employee'
        }
    ]).then((res) => {

        // var chosenRole;

        // var chosenRole = db.query(`SELECT id FROM roles WHERE title = "${res.role}" ;`,(err, data) => {
        //     if (err) { console.log(err) }
        //     else {
        //         return data[0].id;

        //     }
        // });
        // console.log(res.role)
        // var chosenRole = findRoleId(res.role)
        // console.log(chosenRole)



        db.query(`INSERT INTO employee(first_name,last_name,role_id) VALUES (?,?,?)`, 
        [`${res.first_name}`, 
        `${res.last_name}`, findRoleId(res.role)], 
        (err, data) => {
            if (err) { console.log(err) }
            else {
                console.log('Role added successfully.')
                continueProgram();
            }
        });

    });

}


function updateData() {

};