const sqlite3 = require('sqlite3').verbose();

// open database
let db = new sqlite3.Database('./Nandesis.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the Nandesis.db SQlite database.');
    console.log('Creating tables...');
    createTables(db);
    console.log('Tables created successfully!');
    console.log('Closing database...');
    closeDatabase(db);
});

function createTables(db) {
    db.exec(`
        create table user (
            id int primary key not null,
            name text not null,
            email text not null,
            password text not null,
            created_at datetime not null,
            updated_at datetime not null
        );

        insert into user (id, name, email, password, created_at, updated_at)
        values (1, 'User 1', 'email@email.com', '1234qwer', '2024-03-29', '2024-03-29'),
            (2, 'User 2', 'email2@email.com', '1234qwer', '2024-03-29', '2024-03-29');
        
        create table gate (
            id int primary key not null,
            user_id int not null,
            name text not null,
            function_string text not null,
            function_order int not null,
            inputs int not null,
            outputs int not null,
            hidden boolean not null,
            created_at datetime not null,
            updated_at datetime not null
        );
        
        insert into gate (id, user_id, name, function_string, function_order, inputs, outputs, hidden, created_at, updated_at)
        values (1, 1, 'NAND', 'qwertyuiop', 1, 1, 1, false, '2024-03-29', '2024-03-29'),
            (2, 1, 'AND', 'asdfghjkl', 2, 3, 2, false, '2024-03-29', '2024-03-29'),
            (3, 2, 'NAND', 'qwertyuiop', 1, 1, 1, false, '2024-03-29', '2024-03-29');
            
        `, ()  => {
            runQueries(db);
    });
}

function runQueries(db) {
    db.all(`select u.name as user_name, g.name as gate_name, function_string from gate g
        inner join user u on g.user_id = u.id
        where u.id = ?`, 1, (err, rows) => {
        rows?.forEach(row => {
            console.log(row.user_name + "\t" +row.gate_name + "\t" +row.function_string);
        });
    });
}

function closeDatabase(db) {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}