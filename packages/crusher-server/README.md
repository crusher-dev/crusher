# How to Deploy?

Steps to run this project:

1. Run `now --prod` command

# How to build?

Steps to run this project:

1. Setup database settings inside `ormconfig.json` file
2. Run `yarn devInFastMode` command

# How to push?

Run this command
`mysqldump -h localhost -u root -p crusher > sample_db.sql`


# Migration?
Load initial sql. Migration should both handle schema or data change. Change to flyway for more control. Has info, repair and baseline support
1.) Update config dev.json
2.) Run db:migrate_up to apply migration
3.) Run db:migrate_dow to downgrade migration
// Use env variable from travis or secret machine. Load env variable.

# How to fix "Client Does not support authentication protocol requested by the user" error ?

1. mysql> USE mysql;
2. mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
