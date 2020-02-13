const debug = require('debug')('linto:skill:v2:linto-skill:news:events:news')

const PREFIX = 'type_'

module.exports = async function (msg) {
  let tts = this.skillConfig[this.skillConfig.language]

  if (msg.payload.nlu.entitiesNumber !== 1) {
    return { say: tts.say.error_entities_number }
  }

  let type = this.payloadAction.extractEntityFromPrefix(msg.payload, PREFIX).entity
  if (!type) {
    return { say: tts.say.error_unknown_type }
  }

  try {
    let result = await this.controller[this.config.api](type, this.skillConfig.language)
    return { say: `${result}` }
  } catch (e) {
    if (e.name === 'LanguageNotSupportedException')
      return { say: tts.say.error_lang_not_supported }
    else
      return { say: tts.say.error_api }
  }
}