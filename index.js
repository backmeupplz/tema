require('dotenv').config({ path: '/home/deploy/tema/.env' })
const TelegramBot = require('node-telegram-bot-api')
var generateName = require('sillyname');

const token = process.env.token
const banned = process.env.banned.split(',').map(v => parseInt(v))

const bot = new TelegramBot(token, { polling: true })

bot.on('message', (msg) => {
  // Check if message
  if (!msg || !msg.text) return
  // Check if banned
  if (banned.includes(msg.from.id)) {
    bot.sendMessage(msg.from.id, 'Сорямба, мне пришлось вас забанить. Напишите @borodutch, если хотите разбана.')
    return
  }
  // Process message
  if (msg.text.startsWith('/review ') && msg.text.replace('/review ', '')) {
    bot.sendMessage(process.env.channel, `${generateName()}:\n\n${msg.text.replace('/review ', '')}`)
    bot.sendMessage(process.env.admin, `\`${JSON.stringify(msg, null, 2)}\``, { parse_mode: 'Markdown' })
  } else {
    bot.sendMessage(msg.from.id, 'Йоу. Я — бот ака независимый журналист. Собираю отзывы на @golden_borodutch и публикую их на @golden_borodutch_reviews. Пришли мне свой отзыв на какой-либо пост на Золоте Бородача (начни сообщение с /review), а я добавлю его на канал с отзывами. Не стесняйся писать что-либо угодно — сообщения полностью анонимны, а модерации почти нет. Что сегодня подлого или хорошего скажете о Золоте? Пример сообщения: "/review Почему ты заявляешь, что Земля — плоская? Это оскорбляет мои чувства. Больше так не пиши, пожалуйста."')
  }
})
