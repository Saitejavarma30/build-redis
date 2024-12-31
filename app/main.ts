import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
    let bufferCommand = '';
const values:{ [key: string]: {value: string; expiry?:number} } =  {}

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
            if(arrayOfCommands[i].toUpperCase() === 'PING'){
                    connection.write('+PONG\r\n')
                bufferCommand = ''
                break
            }
            if(arrayOfCommands[0].toUpperCase() === 'ECHO'){
                connection.write(`$${arrayOfCommands[1].length}\r\n${arrayOfCommands[1]}\r\n`)
                bufferCommand = ''
                break
            }
            if(arrayOfCommands[0].toUpperCase() === 'SET'){
                let expiry = undefined
                if (arrayOfCommands[1] && arrayOfCommands[2]){
                    if(arrayOfCommands[3] && arrayOfCommands[3] === 'PX'){
                        if(arrayOfCommands[4]){
                            expiry = Date.now() + parseInt(arrayOfCommands[4])
                        }
                    }
                    values[arrayOfCommands[1]] =  {value:arrayOfCommands[2], expiry: expiry}
                    connection.write('+OK\r\n')
                    bufferCommand = ''

                    break
                }
                else {
                        connection.write('-ERR\r\n')
                        bufferCommand = ''
                        break
                }
            }
            if(arrayOfCommands[0].toUpperCase() === 'GET'){

                if(arrayOfCommands[1]){
                    const entry = values[arrayOfCommands[1]];
                    console.log(Date.now())
                    console.log(JSON.stringify(entry))
                    if(entry){
                        if(entry.expiry && entry.expiry >= Date.now()){
                            delete values[arrayOfCommands[1]];
                            connection.write('-1\r\n')
                        }
                        else{
                            connection.write(`$${entry.value.length}\r\n${entry.value}\r\n`)
                        }
                    }
                    else{
                        connection.write('$-1\r\n')
                    }
                    break
                }
                else{
                    connection.write('-ERR\r\n')
                    break
                }
            }
        }
    });
    connection.on('end', () => {
        console.log('Connection ended');
    });

});
//
server.listen(6379, "127.0.0.1");
