//for inquirer prompts
const mysql = require('mysql2')
const inquirer = require('inquirer');
const cTable = require('console.table');


//link to mysql database
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

//initial function -- gives immediate action options via inquirer
function menu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            choices:
                ['View Data', 'Add Data', 'Update Employee Role', 'Exit Program'],
            description: 'What would you like to do?'
        },
    ]).then(res => {
        switch (res.menu) {
            case ('View Data'):
                viewData();
                break;
            case ('Add Data'):
                addData();
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

//secondary menu function -- options for data to view (includes db queries to view data)
function viewData() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'selection',
            choices: ['View All Departments', 'View All Roles', 'View All Employees'],
            description: 'Which data would you like to view?'
        },
    ]).then(res => {
        switch (res.selection) {
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
            default:
                console.log('Goodbye!');
                process.exit();
        }
    })
}


//secondary menu function -- options to add data (calls individual add function) 
function addData() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'selection',
            choices: ['Add a Department', 'Add a Role', 'Add an Employee'],
            description: 'What data would you like to add?'
        },
    ]).then(res => {
        switch (res.selection) {
            case ('Add a Department'):
                addDept();
                break;
            case ('Add a Role'):
                addRole();
                break;
            case ('Add an Employee'):
                addEmployee();
                break;
            default:
                console.log('Goodbye!');
                process.exit();
        }
    })

}

//after performing an action -- offers user to continue or exit program 
function continueProgram() {

    inquirer.prompt(
        {
            type: 'list',
            message: 'Would you like to continue?',
            choices: ['Continue', 'Exit'],
            name: 'continue'
        }
    ).then(res => {
        var confirm = res.continue;
        if (confirm === 'Continue') {
            menu();
        } else {
            console.log('Goodbye!');
            process.exit();
        }
    });
};



/* -------------- MYSQL QUERY FUNCTIONS -------------- */

//PULL EXISTING DATA FROM TABLES --- INTO AN ARRAY 

//list of employees
const currentEmployees = () => {
    const holdingArray = []
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM employee;`, (err, data) => {
            if (err) { reject(err) }
            else {
                for (let i = 0; i < data.length; i++) {
                    holdingArray.push(data[i].first_name + ' ' + data[i].last_name);
                }
                resolve(holdingArray)
            }
        })

    })
}

//list of roles
const currentRoles = () => {
    const tempArray = []
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM roles;`, (err, results) => {
            if (err) { reject(err); }
            else {
                for (let i = 0; i < results.length; i++) {
                    tempArray.push(results[i].title);
                }
                resolve(tempArray)
            }
        });
    })
}

//list of departments
const currentDept = () => {
    const tempArray = []
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM department;`, (err, results) => {
            if (err) { reject(err); }
            else {
                for (let i = 0; i < results.length; i++) {
                    tempArray.push(results[i].dept_name);
                }
                resolve(tempArray)
            }
        });
    })
}


//FIND ID OF SELECTED LIST ITEM

//dept id based on name of dept
const deptId = (res) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id FROM department WHERE dept_name = ?`, res, (err, data) => {
            if (err) { reject(err) }
            else {
                resolve(data[0].id);
            }
        })
    })
}

//employee id based on first/last name
const employeeId = (first, last) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id FROM employee WHERE first_name = ? AND last_name = ?`, [first, last], (err, data) => {
            if (err) { reject(err) }
            else {
                resolve(data[0].id);
            }
        })
    })
}

//role id based on title
const findRoleId = (res) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id FROM roles WHERE title = ?`, res, (err, data) => {
            if (err) { reject(err) }
            else {
                resolve(data[0].id);
            }
        })
    })
}


//ADD NEW DATA TO EXISTING TABLE

//add new role
function insertRole(title, salary, deptId) {
    db.query('INSERT INTO roles(title,salary,dept_id) VALUES (?,?,?)', [title, salary, deptId], (err, data) => {
        if (err) { console.log(err) }
        else {
            console.log('Role added successfully.')
        }
    })
}
//add new employee
function insertEmployee(first, last, role, manager) {
    db.query(`INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)`, [first, last, role, manager], (err, data) => {
        if (err) { console.log(err) }
        else {
            console.log('Role added successfully.')
        }
    });

}
//update existing employees role 
function updateEmployee(roleId, first, last) {
    db.query('UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?', [roleId, first, last], (err, data) => {
        if (err) { console.log(err) }
        else {
            console.log('Role updated successfully')
            continueProgram();
        };
    })
}



//inquirer functions -- function called from menu to add a role 
function addDept() {
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
}

async function addRole() {

    var deptChoices = await currentDept();

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
    ]).then(async res => {

        var title = res.title;
        var salary = res.salary;

        var departmentId = await deptId(res.dept);

        return [title, salary, departmentId];
    }).then(res => {
        insertRole(res[0], res[1], res[2]);
        continueProgram();
    })
}

async function addEmployee() {

    var roleChoices = await currentRoles();
    var managerList = await currentEmployees();
    managerList.push('No manager');


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
    ]).then(async (res) => {

        var first = res.first_name;
        var last = res.last_name;

        var role = await findRoleId(res.role);

        var managerName = res.employee.split(' ');
        var manager;
        if (res.employee === 'No manager') {
            manager = null;
        } else { manager = await employeeId(managerName[0], managerName[1]); };

        return [first, last, role, manager]
    }).then(res => {
        insertEmployee(res[0], res[1], res[2], res[3]);
        continueProgram();
    })

}

async function updateData() {

    var currentEmp = await currentEmployees();
    var rolesList = await currentRoles();

    inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee role would you like to update?',
            choices: currentEmp,
            name: 'employee'
        },
        {
            type: 'list',
            message: 'What is their new role?',
            choices: rolesList,
            name: 'role'
        }
    ]).then(async (res) => {

        var roleId = await findRoleId(res.role);

        let employee = res.employee.split(' ')

        updateEmployee(roleId, employee[0], employee[1]);

    })

}