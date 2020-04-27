const env = process.env
const Sequelize = require('sequelize')

const sequelize = new Sequelize(env.PG_DB,env.PG_USER,env.PG_PASS,{
	host: env.PG_HOST,
	port: env.PG_PORT,
	dialect: 'mysql',
	application_name: 'bot_middleware',
	omitNull: true,
	define: {
		freezeTableName: false,
		timestamps: false,
		underscored: false,
		paranoid: false,
		charset: 'utf8',
		collate: 'utf8_unicode_ci'
	},
	pool: {
		min: 2,
		max: 3,
		acquire: 30000,
		idle: 10000
	},
	logging: false
})

sequelize
	.authenticate()
	.then(() => console.log('Connection has been established successfully'))
	.catch((err) => console.error(err));

require('pg').types.setTypeParser(1114, (val) => new Date(`${val} +00:00`));

const models = {
	Log: sequelize.import('./Log'),
	Session: sequelize.import('./Session'),
}

Object.keys(models).forEach((model) => {
	if(models[model].associate){
		models[model].associate(models)
	}
})

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models