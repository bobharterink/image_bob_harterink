const { SerialPort, ReadlineParser } = require("serialport");

// Adjust the port name based on the one you found
const portName = "/dev/tty.Maker3-401F"; // Replace with your identified port

// Create a new serial port
const port = new SerialPort({
  path: portName,
  baudRate: 115200, // Ensure this matches the AxiDraw's baud rate
  autoOpen: false,
});

// Create a parser to read data from the serial port
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

// Open the port
port.open((err) => {
  if (err) {
    return console.log("Error opening port: ", err.message);
  }

  console.log("Port opened successfully");
  sendCommands();
});

// Read data from the port
parser.on("data", (data) => {
  console.log("Data received: ", data);
});

// Function to send commands to AxiDraw
function sendCommands() {
  // Enable motors
  port.write("EM 1\r", (err) => {
    if (err) {
      return console.log("Error writing to port: ", err.message);
    }
    console.log("Motors enabled");
  });

  // Move to absolute position (100, 100)
  port.write("G0 X100 Y100\r", (err) => {
    if (err) {
      return console.log("Error writing to port: ", err.message);
    }
    console.log("Moved to (100, 100)");
  });

  // Pen down
  port.write("SP 0\r", (err) => {
    if (err) {
      return console.log("Error writing to port: ", err.message);
    }
    console.log("Pen down");
  });

  // Move to absolute position (200, 200)
  port.write("G0 X200 Y200\r", (err) => {
    if (err) {
      return console.log("Error writing to port: ", err.message);
    }
    console.log("Moved to (200, 200)");
  });

  // Pen up
  port.write("SP 1\r", (err) => {
    if (err) {
      return console.log("Error writing to port: ", err.message);
    }
    console.log("Pen up");
  });

  // Disable motors
  port.write("EM 0\r", (err) => {
    if (err) {
      return console.log("Error writing to port: ", err.message);
    }
    console.log("Motors disabled");
  });
}
