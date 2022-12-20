import { ChatGPTAPIBrowser } from "chatgpt";
import whatsappweb from "whatsapp-web.js";

const { Client, LocalAuth } = whatsappweb;
import qrcode from "qrcode-terminal";
import * as dotenv from "dotenv";
dotenv.config();

// Initialize conversation storage
const conversations = {};

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

  const chatgpt = new ChatGPTAPIBrowser({
    email,
    password,
    isGoogleLogin: false,
    isMicrosoftLogin: true,
    debug: false,
    minimize: true,
  });

  await chatgpt.initSession();

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
          
        console.log('=== MESSAGE RECEIVED ===');
        console.log(`From: ${msg.from} (${msg._data.notifyName})`);
        console.log(`Message: ${msg.body}`);

        await chat.sendStateTyping();

        if (msg.body.startsWith("!join ")) {
          // Join group with invite code
          const inviteCode = msg.body.split(" ")[1];
          try {
            await whatsapp.acceptInvite(inviteCode);
            msg.reply("Joined the group!");
          } catch (e) {
            msg.reply("That invite code seems to be invalid.");
          }
          return;
        } else if (msg.body === "!reset") {
          // Reset conversations with AI
          delete conversations[msg.from];
          msg.reply("Conversations reset!")
          return;
        }

        // Do we already have a conversation for this sender?
        if (conversations[msg.from] === undefined) {
          conversations[msg.from] = await chatgpt.sendMessage(msg.body);
        } else {
          const conversationId = conversations[msg.from].conversationId;
          const messageId = conversations[msg.from].messageId;
          conversations[msg.from] = await chatgpt.sendMessage(msg.body, {
            conversationId: conversationId,
            parentMessageId: messageId,
          });
        }

        await chat.clearState();
        
        const response = conversations[msg.from].response;

        console.log(`Response: ${response}`);

        if (chat.isGroup) {
          msg.reply(response);
        } else {
          whatsapp.sendMessage(msg.from, response);
        }
      })();
    }
  });
}
