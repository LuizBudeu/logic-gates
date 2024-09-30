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
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text not null,
            email text not null unique,
            password text not null,
            created_at datetime not null,
            updated_at datetime not null
        );

        insert into user (name, email, password, created_at, updated_at)
        values ('User 1', 'email@email.com', '1234qwer', '2024-03-29', '2024-03-29'),
            ('User 2', 'email2@email.com', '1234qwer', '2024-03-29', '2024-03-29');
        
        create table gate (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        `, ()  => {
            console.log("tables created!");
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