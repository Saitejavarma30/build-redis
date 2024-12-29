import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
    let bufferCommand = '';

    connection.on('data', (data) => {
        bufferCommand += data.toString();
        let newlineIndex;
        while ((newlineIndex = bufferCommand.indexOf('\n')) !== -1) {
            // Extract the full command up to the newline
            const command = bufferCommand.slice(0, newlineIndex).trim(); // Trim to remove \r or spaces
            bufferCommand = bufferCommand.slice(newlineIndex + 1); // Remove the processed command from the buffer
            console.log(command);
            console.log(`Received command: ${command}`);

            // Respond to the command
            if (command === 'PING') {
                connection.write('+PONG\r\n');
            } else {
                connection.write('-ERR unknown command\r\n');
            }
        }
    });
});
//
server.listen(6379, "127.0.0.1");
