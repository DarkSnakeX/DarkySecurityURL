# DarkySecurityURL
A discord bot that uses the VirusTotal API to check if links might be malicious or not.

# Description
This bot analyzes all the messages that users send and when it finds a link it analyzes it using
the Virustotal API, as soon as there is at least an indication that the URL/link you have passed may be malicious
a message is sent about it, otherwise it sends another message advising of its apparent reliability.

# Instructions
To use the bot, configure your config.json file with your token, guildId and botid, then deploy the commands and finally run the index.js.
For the bot to analyze the uploaded files and urls go to the channel you want the bot to monitor and type "/addchannel". If you want to remove the channel from being monitored put "/removechannel".

# Requirements
- Have a valid Virustotal API.
- Have a valid Discord token to create bots.
- Install the dependency of node-fetch(2.6.1), discord.js, form-data and sqlite3.

# Warning
This bot is purely educational to teach about cybersecurity on discord and the use of the Virustotal API in Javascript.
It is also remembered that when using the Virustotal API, all URLs and files that are analyzed are stored PUBLICLY in the Virustotal database, so be careful.
