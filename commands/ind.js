const { REST, Routes } = require('discord.js');

const botID = "1234037890372075550"
const serverID = "1236918939422822431"
const botToken = process.env.token

const rest = new REST().setToken(botToken)
const slashRegister = async () => {
    try{
      await rest.put(Routes,applicationGuildCommands(botID, serverID), {
          BODY: [
              {
                  name: "ping",
                  description: "a ping command"
              }
              ]
      })      
    } catch (error) {
      console.error(error)
    }
}
slashRegister();
