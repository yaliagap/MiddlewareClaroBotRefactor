const env = process.env

module.exports = (sequelize,DataTypes) => {
	const Session = sequelize.define('session',{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},

		user_id: {type:DataTypes.STRING(50),allowNull:false},
		context: {type:DataTypes.JSON,allowNull:false},

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
		tableName: 'session',
		comment: 'Session Table'
	})

	return Session
}