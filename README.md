# Notice:

OpenAI's ChatGPT is experiencing heavy traffic and at the moment obtaining a session is difficult. You may get these messages while attempting to run the bot. If this happens, try again. Once you get a session, it seems to last quite a while (although it will eventually timeout.)

The ChatGPT NPM module will eventually move to use the official OpenAI API, and I will update this message when that happens.

Also - feel free to contribute via pull requests etc. :)

<img width="350" alt="Screenshot 2022-12-13 at 8 52 47 AM" src="https://user-images.githubusercontent.com/18585190/207405349-479782ad-b6a8-4994-aefc-82b32ec267cc.png">

<img width="350" alt="Screenshot 2022-12-13 at 8 51 56 AM" src="https://user-images.githubusercontent.com/18585190/207405242-171787d3-2cde-417b-a2df-aa53fc80cd31.png">

## Thanks to

- [chatgpt npm wrapper by Travis Fischer](https://github.com/transitive-bullshit/chatgpt-api)
- [whatsapp-web.js](https://wwebjs.dev/guide/)
- [qrcode-terminal for quickly linking device](https://www.npmjs.com/package/qrcode-terminal)

# Requirements

- A phone number that can receive text messages/voice calls, linked to its own WhatsApp instance.
- I use a Google Voice number, and run a 2nd instance of WhatsApp on my phone by using the [WhatsApp for Business app](https://business.whatsapp.com/) (it's free!])
- Node JS >= 18
- A computer that can run Chrome (headless is now broken as OpenAI is using CloudFlare)

# Installation

## Get the files

Clone the repository:

```console
git clone https://github.com/mtaupiq/wa-chatgpt.git
```

Install dependencies:

```console
npm install
```

## Find your local path to Chrome

## Configure it

Create a .env file with the following variables. In this example, we are using Chrome on Windows.

```console
CHROME_PATH=C:/Program Files/Google/Chrome/Application/chrome.exe
EMAIL=[Your email used to register with OpenAI]
PASSWORD=[Your password used to register with OpenAI]
```

## Run it

```console
npm start
```

## Scan the barcode with your WhatsApp app
## Done :)



# Use it

Open a chat with the WhatsApp account linked to the number you just linked to this bot. ChatGPT will answer. This works for several users at the same time and each conversation is separate.
