# MiddlewareClaroBotRefactor

Proyecto basado en Node.js

## 1. Editar las credenciales de la Base de datos MySQL en el archivo .env

### *Sólo editar las siguientes variables, dejar las demás como están.*

    ```
    PG_DB='compose'
    PG_USER='admin'
    PG_PASS='LYONSUYVNEZFPUPG'
    PG_HOST='sl-us-south-1-portal.43.dblayer.com'
    PG_PORT='22708'
    PG_SCHEMA=''
    PG_URI ='mysql://admin:LYONSUYVNEZFPUPG@sl-us-south-1-portal.43.dblayer.com:22708/compose'
    ```

## 2. Crear las tablas en la base de datos MySQL, siguiendo el script en el folder src/database/scripts

    ```
    -- Drop table

    -- DROP TABLE logs;

    CREATE TABLE logs (
        id serial primary key,
        channel_id int4 NOT NULL,
        user_json json NOT NULL,
        user_text text NOT NULL,
        user_id varchar(50) NOT NULL,
        watson_json json NOT NULL,
        watson_text text NOT NULL,
        watson_conversation_id char(36) NOT NULL,
        watson_intent_name varchar(100) NULL,
        watson_intent_confidence numeric(5,4) NULL,
        main varchar(150) NULL,
        submain varchar(150) NULL,
        detail varchar(150) NULL,
        understanding bool NULL,
        user_agent varchar(200) NOT NULL,
        public_ip varchar(50) NOT NULL,
        utc_offset char(6) NOT NULL,
        created_at timestamp  not null DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp  not null DEFAULT CURRENT_TIMESTAMP
    );

    -- Drop table

    -- DROP TABLE session;

    CREATE TABLE session (
        id serial primary key,
        user_id varchar(50) NOT NULL,
        context json NOT NULL,
        utc_offset char(6) NOT NULL,
        created_at timestamp  not null DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp  not null DEFAULT CURRENT_TIMESTAMP
    );

    ```

## 3. Irnos a la raíz del Proyecto y ejecutar el comando 
### **(Esto sólo se hace si tenemos salida a internet, de lo contrario verificar si se tiene el folder "node_modules dentro del proyecto)**
```
npm install
```

## 4. Ejecutar el proyecto mediante el comando
```
npm start
```

## 5. Dirigirse a la ruta http://localhost:4000

## 6. El proyecto ha iniciado correctamente.


