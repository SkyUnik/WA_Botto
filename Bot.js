const qrcode = require('qrcode-terminal');
const axios = require('axios')
const str_replace = require('str_replace');
const fs = require('fs')
const puppeteer = require('puppeteer')
 
const { Client, LocalAuth, MessageMedia, List, Buttons} = require('whatsapp-web.js');


const pup_me = ({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox']
})

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: pup_me
});
 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('QR RECEIVED', qr);
});
 
client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('CLIENT IS CONNECTED');
});
 
client.on('message', async message => {
    const chat = await message.getChat();
    const isitek = message.body;
    const contact = await message.getContact();
    console.log(`Message : "${isitek}" , FROM : "${chat.name}"`);

    if (isitek === '!notes') {
        const contact = await message.getContact();
        if (chat.isGroup) {
        var noteslist =`!ping
!info
!media
!everyone
!meme

Anda dapat mengambil catatan ini dengan menggunakan !notename
Member Count: ${chat.participants.length}`;
        chat.sendStateTyping();
            let sections = [{title:'List Of Notes',
            rows:[
            {title:'!ping'},
            {title:'!info'},
            {title:'!media'},
            {title:'!everyone'},
            {title:'!meme'},
            ]}];
            let list = new List(noteslist,'NOTES',sections,`*List of notes in ${chat.name} :*`,' ');
            message.reply(list, message.from);
        } else {
            const info = await message.getContact();
            var notepri =`!ping
!info
!media
!meme


Your Name : ${info.pushname}
Your Number : ${chat.name}
*Anda dapat mengambil catatan ini dengan menggunakan !notename*`;

                    chat.sendStateTyping();
                        //chat.sendMessage();
                        let sections = [{title:'List Of Notes',
                        rows:[
                        {title:'!ping'},
                        {title:'!info'},
                        {title:'!media'},
                        {title:'!meme'},
                        ]}];
                        let list = new List(notepri,'NOTES',sections,`*List of notes in ${chat.name} :*`,' ');
                        message.reply(list, message.from);
        }} else if (isitek.startsWith('!info')) {
            if (isitek === '!info') {
                info = await message.getContact();
            } else if (message.body.includes('@')) { 
                console.log('it got @ alright.');
                const nomoraja = isitek.split(' ')[1];
                const contacthe = str_replace('@', '', nomoraja)
                console.log(contacthe);
                let mentions = await message.getMentions();
                for (let contact of mentions) {
                     if (contact.number == contacthe) { 
                         info = contact;
                         console.log(contact);}}}
                console.log(info);
                chat.sendStateTyping();
                let vcard = `BEGIN:VCARD
VERSION:3.0
N:;${info.pushname};;;
FN:${info.pushname}
TEL;type=CELL;type=VOICE;waid=${info.number}:+${info.number}
END:VCARD`

                let infoaja = `*☀️Info about you🗿 :*
        
User name : ${info.pushname}
Number : +${info.number}
Chat : wa.me/${info.number}`
                await message.reply(infoaja, message.from);
                await chat.sendMessage(vcard)
        } else if (isitek === '!ping') {
        const idnunm = client.getNumberId('6281382519681');
        chat.sendStateTyping();
        console.log(idnunm);
        chat.sendMessage(`Hi @${contact.number} !`, {
            mentions: [contact]
        });
    } else if (isitek === '!media') {
        chat.sendStateTyping();
        const media = MessageMedia.fromFilePath('img.jpg');
        message.reply(media);
    } else if (isitek === '!card') {
        chat.sendStateTyping();
        message.reply(`BEGIN:VCARD
VERSION:3.0
N:;Bot Wa JS Fatih;;;
FN:Bot Wa JS Fatih
TEL;type=CELL;type=VOICE;waid=6289514599099:+62 895-1459-9099
END:VCARD`);
    } else if (isitek === '!video') {
        chat.sendStateTyping();
        let media = MessageMedia.fromFilePath('video.mp4');
        message.reply(media);
    } else if (isitek === '!last') {
        const lastMessage = await chat.fetchMessages({ limit: 2 });
        console.log(lastMessage);
        if (lastMessage[0].fromMe !== true) return; 
        let messageLower = lastMessage[0].body.toLowerCase();
        if (messageLower == "last message of the bot") {
            console.log(`The last message of the bot was: ${lastMessage}`);
        }
    } else if (isitek === '!meme') {
        chat.sendStateTyping();
        const browser = await puppeteer.launch(pup_me)
        try {
            const url = 'https://1cak.com/shuffle';
            console.log(`LOG : "Crawling ${url}"`)
            const page = await browser.newPage()
            await page.goto(url)
            const selector = 'td > img'
            await page.waitForSelector(selector)
            const links = await page.$$eval(selector, am => am.filter(e => e.src).map(e => e.src))
            titles = await page.$$eval(selector, am => am.filter(e => e.title).map(e => e.title))
            const result = str_replace(',', '\n\n\n', links);
            const resultt = str_replace(',', '\n\n\n', titles);

            console.log(`LOG : "Image : ${result}"`)
            console.log(`LOG : "Judul meme : ${resultt}"`)
            // console.log(result);
            const pageNew = await browser.newPage()
            const response = await pageNew.goto(result, {timeout: 0, waitUntil: 'networkidle0'})
            const imageBuffer = await response.buffer()
            var name = 'meme-1cak';
            await fs.promises.writeFile(name+'.jpg', imageBuffer)
            await page.close()
            await pageNew.close()
            await browser.close()
        } catch (err) {
            console.log(err)
        }

        let mesent = await MessageMedia.fromFilePath('meme-1cak.jpg');
        message.reply(mesent, message.from,{caption: `*"${titles}"*`});



    } else if (isitek.startsWith('!profile ')) {
        const nomoraja = isitek.split(' ')[1];
        const contacthe = str_replace('@', '', nomoraja)
        console.log(contacthe);
        let mentions = await message.getMentions();
        for (let contact of mentions) {
            if (contact.number == contacthe) {
                message.reply(`*PROFILE*
NUMBER: ${contact.number}
NAME: ${contact.pushname}

note: THIS IS YOUR PROFILE`)
            } else if (contact.number == 'owner number') {
                message.reply(`*PROFILE*
NUMBER: ${contact.number}
NAME: ${contact.pushname}
*OWNER*

note: THIS IS YOUR PROFILE`)
            }
        };
    } else if (isitek.startsWith('!join ')) {
        const inviteCode = isitek.split(' ')[1];
        var invit = inviteCode;
        if (inviteCode.startsWith("https")){
            invit = inviteCode.slice(26);
        } try {
            await client.acceptInvite(invit);
            message.reply('Joined the group!');
        } catch (e) {
            message.reply('That invite code seems to be invalid.');
        }
    } else if (isitek === '!delete') {
        if (message.hasQuotedMsg) {
            const quotedMsg = await message.getQuotedMessage();
            // console.log(quotedMsg);
            if (quotedMsg.fromMe) {
                await sleep(1500);
                quotedMsg.delete(true);
                console.log(`LOG : "it is from me and i delete it"`);
            } else {
                message.reply('I can only delete my own messages');
            }
        }
    } else if (isitek === '!leave') {
        // Leave the group
        let chat = await message.getChat();
        if (chat.isGroup) {
            chat.leave();
        } else {
            message.reply('This command can only be used in a group!');
        }
    } else if (isitek === '!resendmedia' && message.hasQuotedMsg) {
        const quotedMsg = await message.getQuotedMessage();
        if (quotedMsg.hasMedia) {
            const attachmentData = await quotedMsg.downloadMedia();
            message.reply(attachmentData, message.from, { caption: 'Here\'s your requested media.' });
        }
    } else if (isitek === '!pwsmanda fatih') {
            chat.sendStateTyping();
            await message.reply(`AUDITORIUM : 12345audit
operator : smandagenepbelas
RUANG KEPALA SEKOLAH : kepseksmanda
absen : absen12345
X MIPA 1~10 : 123456A(kelas)`
                );
     } else if (isitek === '!sticker'){
        chat.sendStateTyping();
        if (message.hasQuotedMsg){
            chat.sendStateTyping();
            const quotedMsg = await message.getQuotedMessage();
            if (quotedMsg.hasMedia) {
                const attachmentData = await quotedMsg.downloadMedia();
                message.reply(attachmentData, message.from,{ sendMediaAsSticker: true });
            }
        } else {
            const attachmentData = await message.downloadMedia();
            message.reply(attachmentData, message.from,{ sendMediaAsSticker: true });
        }
    } else if (isitek === '!source') {
        // Get Source Code , this File..
        const media = MessageMedia.fromFilePath('index.js');
        message.reply(media, message.from);
    } else if(isitek === '!everyone') {
        chat.sendStateTyping();
        if (chat.isGroup) {
        let text = "";
        let mentions = [];

        for(let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);
            
            mentions.push(contact);
            text += `@${participant.id.user} `;
        }

        await message.reply(text, message.from, { mentions });
    } else {
        message.reply('This command can only be used in a group!');
    }}

});
 


client.on('media_uploaded', async msg => {
    // Fired on all message creations, including your own
    // console.log(msg);
    await sleep(25000);
    if (msg.body.endsWith('.js')) {
        console.log(`LOG : "This is js file being sent i will not interupt"`);
    }
    if (msg.type === 'sticker') {
        console.log(`LOG : "This is sticker file being sent i will not interupt"`);
    }
    else if (msg.fromMe) {
        console.log(`LOG : "I Declare That the meesage is detected and it's from me .."`);
        msg.delete(true);
        console.log(`LOG : "I Have send delete command to the chat , it should be gone now"`);
    }
});

client.initialize();


