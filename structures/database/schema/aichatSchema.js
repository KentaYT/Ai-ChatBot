const { model, Schema } = require(`mongoose`);

let aichatSchema = new Schema({
    GuildID: String,
    ChannelID: String,
    Model: String,
});

module.exports = model(`aichatSchema`, aichatSchema);
