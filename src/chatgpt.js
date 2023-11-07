import OpenAI from 'openai';
import config from 'config';

const CHATGPT_MODEL = 'gpt-3.5-turbo'
const ROLES = {
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  USER: 'user'
}

const openai = new OpenAI({ apiKey: config.get('OPENAI_KEY') });

const getMessage = (mess) => `
  Напиши на основе этих тезисов последовательную эмоциональную историю: ${mess}
  
  Эти тезисы с описанием ключевых моментов истории.
  Необходимо в итоге сформировать такую историю, чтобы можно было ее прочитать,
  запомнить и потом рассказывать друзьям, знакомым и тп.

  Много текста не нужно, главное чтобы были эмоции, правильная последовательность и нужно учитывать контекст.
  `

export const chatGPT = async (message = '') => {
  const messages = [
    {
      role: ROLES.SYSTEM,
      content: 'Ты опытный копирайтер, который пишет краткие эмоциональные статьи для социальных сетей.'
    },
    {
      role: ROLES.USER,
      content: getMessage(message)
    }
  ];

  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: CHATGPT_MODEL
    })

    return completion.choices[0].message;
  } catch (error) {
    console.error('Error while chat completion', error.message)
  }
}