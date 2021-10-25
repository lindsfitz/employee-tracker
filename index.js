//for inquirer prompts
const mysql = require('mysql2')
const inquirer = require('inquirer');
const cTable = require('console.table');



const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Rico!chopper4094',
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
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update Employee Role', 'Exit Program'],
            description: 'What would you like to do?'
        },
    ]).then(res => {
        var selection = res.menu;
        switch (res.menu) {
            case ('View All Departments'):
                viewData(selection);
                break;
            case ('View All Roles'):
                viewData(selection);
                break;
            case ('View All Employees'):
                viewData(selection);
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
                            menu();
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


function viewData(selection) {
    switch (selection) {
        case ('View All Departments'):
            db.query('SELECT * FROM department', (err, data) => {
                if (err) { throw err }
                else { console.table(data) }
            });
            break;
        case ('View All Roles'):
            db.query('SELECT * FROM roles', (err, data) => {
                if (err) { throw err }
                else { console.table(data) }
            });
            break;
        case ('View All Employees'):
            db.query('SELECT * FROM employee', (err, data) => {
                if (err) { throw err }
                else { console.table(data) }
            });
            break;
        default:
            console.log('Please try again!');
            menu();
    };

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

function addRole() {
    const roleChoices = [];

    db.query('SELECT * FROM department;',(err,data) => {
        if (err) {
            console.log(err);
        } else {
            for (const element of data) {
                choices.push(element.department)
            }
        }
    });

    inquirer.prompt([
        {
            type: 'list',
            choices: roleChoices,
            message: 'Which department would you like to add this role to?',
            name: 'dept'
        },
        {
            type: 'input',
            message: 'Please enter the title of the role.',
            name: 'title'
        },
        {
            type: 'input',
            message: 'Please enter the salary for this role.',
            name: 'salary'
        }
    ]).then(res => {
        db.query('INSERT INTO roles(title,salary,dept_id) VALUES (?,?,?)', [res.title, res.salary, res.dept], (err, data) => {
            if (err) { console.log(err) }
            else {
                console.log('Role added successfully.')
                menu();
            }

        })
    })

}

function addEmployee() {

    const empChoices = [];

    db.query('SELECT * FROM roles',(err,data) => {
        if(err) {throw(err)}
        else {
            for(const element in data){
                empChoices.push(element.roles)

            }
        }
    })


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
            choices: empChoices,
            name: 'role'
        },
        {
            type: 'input',
            message: 'Who is this employees manager? Leave blank if this employee does not have a manager.',
            name: 'employee'
        }
    ]).then(res => {
        db.query('INSERT INTO employee(first_name,last_name,role_id) VALUES (?,?,?)', [res.first_name, res.last_name,])
    })

}


function updateData() {

};