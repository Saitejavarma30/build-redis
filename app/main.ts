import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
    let bufferCommand = '';

    connection.on('data', (data) => {
        bufferCommand += data.toString();

        // const commandArray = []
        bufferCommand = bufferCommand.replace(/\\r/g, '\r').replace(/\\n/g, '\n');
        const commandValue = bufferCommand.split('\r\n');
        while (commandValue.length > 0 && commandValue[commandValue.length - 1] === '') {
            commandValue.pop();
        }
        console.log(commandValue);
        const commandLength = commandValue[0].split('*')[1];
        commandValue.shift()
        const arrayOfCommands: string[] = [];
        for(let i=0; i< commandValue.length; i=i+2) {
            if(commandValue[i].includes('$') &&  commandValue[i+1] !== undefined) {
                if(commandValue[i].split('$')[1]  === commandValue[i+1].length.toString()) {
                    arrayOfCommands.push(commandValue[i + 1])
                }
            }
        }
        console.log(arrayOfCommands)

        for(let i=0; i<arrayOfCommands.length; i++) {
            if(arrayOfCommands[0].toUpperCase() === 'ECHO'){
                connection.write(`$${arrayOfCommands[1].length}\r\n${arrayOfCommands[1]}\r\n`)
            }
        }
    });
    connection.on('end', () => {
        console.log('Connection ended');
    });

});
//
server.listen(6379, "127.0.0.1");
