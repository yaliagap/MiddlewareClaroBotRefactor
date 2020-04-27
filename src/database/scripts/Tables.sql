
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
