const sqlite3 = require('sqlite3').verbose();

// open database
let db = new sqlite3.Database('./database/Nandesis.db', async (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the Nandesis.db SQlite database.');
    console.log('Creating tables...');
    await createTables(db);
    console.log('Tables created successfully!');
    console.log('Closing database...');
    closeDatabase(db);
});

async function createTables(db) {
    await db.exec(`
        create table user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text not null,
            email text not null unique,
            password text not null,
            created_at datetime not null,
            updated_at datetime not null
        );

        insert into user (name, email, password, created_at, updated_at)
        values ('User 1', 'email@email.com', '1234qwer', DATE('now'), DATE('now')),
            ('User 2', 'email2@email.com', '1234qwer', DATE('now'), DATE('now'));
        
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
        
        create table mission (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text not null,
            'order' int not null,
            description_url text not null,
            solution_url text not null,
            created_at datetime not null,
            updated_at datetime not null
        ); 

        insert into mission (name, 'order', description_url, solution_url, created_at, updated_at)
        values ('NOT', 1, './docs#NOT', './solutions#NOT', DATE('now'), DATE('now')),
            ('AND', 2, './docs#AND', './solutions#AND', DATE('now'), DATE('now')),
            ('NOR', 3, './docs#NOR', './solutions#NOR', DATE('now'), DATE('now'));

        create table user_mission (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id int not null,
            mission_id int not null,
            created_at datetime not null,
            updated_at datetime not null
        ); 

        insert into user_mission (user_id, mission_id, created_at, updated_at)
        values (1, 1, DATE('now'), DATE('now')),
            (2, 2, DATE('now'), DATE('now')),
            (2, 3, DATE('now'), DATE('now'));
        `, (err, row)  => {
            if (err) {
                return console.error(err.message);
            }
            return;
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