import a from"fs";import f from"cleverbot-free";import*as g from"google-tts-api";import{Client as b,GatewayIntentBits as c,Partials as d}from"discord.js";import{joinVoiceChannel as h,createAudioResource as i,createAudioPlayer as j}from"@discordjs/voice";import e from"dotenv";import k from"https";e.config();let intents=[];for(let[key,value]of Object.entries(c))Number.isInteger(value)&&intents.push(value);let partials=[];for(let[key,value]of Object.entries(d))Number.isInteger(value)&&partials.push(value);let client=new b({intents:intents,partials:partials}),guild,vocal,delay=a=>new Promise(b=>setTimeout(b,a)),auto=!1,speak=!1;a.existsSync("./audio")||a.mkdirSync("./audio");let mp3="./audio/.mp3";function play(){let b=h({channelId:process.env.VOCAL_ID,guildId:process.env.GUILD_ID,adapterCreator:guild.voiceAdapterCreator}),a=j(),c=i(mp3);a.play(c),b.subscribe(a)}async function chatbot(a){context.length>20&&context.shift();let b=await f(a,context,"FRANCE");return context.push(a),b}let context=[];client.once("ready",async a=>{console.log("Bot started"),vocal=(guild=client.guilds.cache.get(process.env.GUILD_ID)).channels.cache.get(process.env.VOCAL_ID)}),client.on("messageCreate",async b=>{if(process.env.CHAT_ID===b.channel.id)try{if(b.content.includes("`")||"disable auto mode"===b.content)return;if(b.author.bot){if(!auto)return;b.reference.messageId&&await delay(new Date().getTime()-b.createdTimestamp+5e3)}else{if(b.content.startsWith("auto")){(auto=!auto)?(await b.reply("`Speak to itself : enabled`"),await b.reply(await chatbot(b.content.replace("auto","")))):await b.reply("`Speak to itself : disabled`");return}if("speak"===b.content){(speak=!speak)?await b.reply("`Voice output : enabled`"):await b.reply("`Voice output : disabled`");return}if("help"===b.content){await b.reply("**Commands**\n`speak` (Voice output toggle)\n`auto` + starting message (Bot reply to itself from starting message)\n`repeat` + message (Bot will repeat message)");return}if("reset"===b.content){context=[],await b.reply("`Conversation reset`");return}else if(auto){await b.reply("`disable auto mode to speak`");return}}let c=b.content,d=(c=c.startsWith("repeat")?c.replace("repeat",""):await chatbot(b.content)).includes("*");if(c=c.replace(/[^a-zA-Z0-9âéêèîôûç \n]+/g,""),speak&&c.length<200){try{a.unlinkSync(mp3)}catch{}k.get(g.getAudioUrl(c,{lang:"fr",slow:d,host:"https://translate.google.com"}),async c=>{let b=a.createWriteStream(mp3);c.pipe(b),b.on("finish",()=>{b.close(),play()})})}await b.reply(c)}catch{await b.reply("J`'ai crash\xe9 :(")}}),client.login(process.env.TOKEN)