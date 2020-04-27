const env = process.env

module.exports = (sequelize,DataTypes) => {
	const Log = sequelize.define('log',{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},

		channel_id: {type:DataTypes.INTEGER,allowNull:false},

		main: { type: DataTypes.STRING(150), allowNull: true },
		submain: { type: DataTypes.STRING(150), allowNull: true },
		detail: { type: DataTypes.STRING(150), allowNull: true },

		understanding: { type: DataTypes.BOOLEAN, allowNull: true },

		user_json: {type:DataTypes.JSON,allowNull:false},
		user_text: {type:DataTypes.TEXT('long'),allowNull:false},
		user_id: {type:DataTypes.STRING(50),allowNull:false},

		watson_json: {type:DataTypes.JSON,allowNull:false},
		watson_text: {type:DataTypes.TEXT('long'),allowNull:false},
		watson_conversation_id: {type:DataTypes.CHAR(36),allowNull:false},
		watson_intent_name: {type:DataTypes.STRING(100),allowNull:true,alias:'intent'},
		watson_intent_confidence: {type:DataTypes.NUMERIC(5,4),allowNull:true},

		user_agent: {type:DataTypes.STRING(200),allowNull:false},
		public_ip: {type:DataTypes.STRING(20),allowNull:false},

		utc_offset: {type:DataTypes.CHAR(6),allowNull:false},
		created_at: {
			type: sequelize.literal('timestamp'),
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		updated_at: {
			type: sequelize.literal('timestamp'),
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	},{
		tableName: 'logs',
		comment: 'Log Table'
	})

	return Log
}