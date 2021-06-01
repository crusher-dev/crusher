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

1.) Install flyways and keep it in crusher-server/flyways
2.) ./flyway/flyway -configFiles=config/flyway.conf info and ./flyway/flyway -configFiles=config/flyway.migrate

On CI, use https://flywaydb.org/documentation/v6/envvars

# How to fix "Client Does not support authentication protocol requested by the user" error ?

1. mysql> USE mysql;
2. mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
