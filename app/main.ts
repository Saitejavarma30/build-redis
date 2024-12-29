import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
    let bufferCommand = '';

    connection.on('data', (data) => {
        bufferCommand += data.toString();
        if (bufferCommand.endsWith('\r\n')) {
            const command = bufferCommand.trim();
            bufferCommand = '';
            if (command === 'PING') {
                connection.write('+PONG\r\n');
            } else if (command.startsWith('ECHO')) {
                const message = command.substring(5).trim();
                connection.write(`+${message}\r\n`);
            } else {
                connection.write('-ERR unknown command\r\n');
            }
        }
    });
});
//
server.listen(6379, "127.0.0.1");
