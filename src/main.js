import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import config from 'config';
import {chatGPT} from './chatgpt.js';
import {create} from './notion.js'
import {Loader} from './loader.js';

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'), {
  handlerTimeout: Infinity,
})

bot.command('start', ctx => {
  ctx.reply('Добро пожаловать в бота! Отправьте текстовое сообщение с тезисами про вашу историю.')
})

bot.on(message('text'), async ctx => {
  try {
    const text = ctx.message.text
    
    if (!text.trim()) return ctx.reply('Кажется, ты написал пустой запрос...')

    const loader = new Loader(ctx)

    loader.show()

    const response = await chatGPT(text)

    if (!response) return ctx.reply('Ошибка в API', response)

    const notionResponse = await create(text, response.content)

    loader.hide()

    ctx.reply(`Ваша страница в notion: ${notionResponse.url}`)
  } catch (error) {
    console.log(`Error while proccessing text: ${error.message}`);
  }
})

bot.launch()