import { ChatGPTAPIBrowser } from "chatgpt";
import whatsappweb from "whatsapp-web.js";

const { Client, LocalAuth } = whatsappweb;
import qrcode from "qrcode-terminal";
import * as dotenv from "dotenv";
dotenv.config();

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

async function main() {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;

  const chatgpt = new ChatGPTAPIBrowser({ email, password });

  await chatgpt.init();

  whatsapp.on("message", (msg) => {
    if (!msg.isStatus) {
      (async () => {
        const chat = await msg.getChat();

        // If added to a chatgroup, only respond if tagged
        if (
          chat.isGroup &&
          !msg.mentionedIds.includes(whatsapp.info.wid._serialized)
        )
          return;

        const response = await chatgpt.sendMessage(msg.body);
        msg.reply(response);
      })();
    }
  });
}
