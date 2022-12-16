import { ChatGPTAPIBrowser } from "chatgpt";
import whatsappweb from "whatsapp-web.js";

const { Client, LocalAuth } = whatsappweb;
import qrcode from "qrcode-terminal";
import * as dotenv from "dotenv";
dotenv.config();

// Create whatsapp client instance
const whatsapp = new Client({
  puppeteer: {
    executablePath: process.env.CHROME_PATH,
  },
  authStrategy: new LocalAuth(),
});
whatsapp.initialize();
whatsapp.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});
whatsapp.on("authenticated", () => {
  console.log("Authentication complete");
});
whatsapp.on("ready", () => {
  console.log("Ready to accept messages");
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
});
// END Create whatsapp client instance

async function main() {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;

  const chatgpt = new ChatGPTAPIBrowser({email, password});

  await chatgpt.init();

  whatsapp.on("message", (message) => {
    if (message.from != 'status@broadcast') {
      (async () => {
        console.log(
          `From: ${message._data.id.remote} (${message._data.notifyName})`
        );
  
        console.log(`Message: ${message.body}`);
  
        // If added to a chatgroup, only respond if tagged
        const chat = await message.getChat();
  
        if (
          chat.isGroup &&
          !message.mentionedIds.includes(whatsapp.info.wid._serialized)
        )
          return;
  
        const response = await chatgpt.sendMessage(
          message.body
        );
  
        console.log(`Response: ${response}`);
  
        message.reply(response);
      })();
    }
  });
}