import time
import serial

# Configure the serial port and baud rate
ser = serial.Serial("/dev/tty.usbmodemEast1", timeout=1)


def send_command(command):
    ser.write((command + "\r").encode())
    time.sleep(0.1)
    response = ser.read(ser.inWaiting()).decode()
    print(f"Sent: {command}, Received: {response}")
    return response


def initialize_axidraw():
    send_command("EM,1")  # Enable motors
    send_command("SP,1")  # Set pen up
    # send_command("H")  # Home


def draw_square():
    send_command("G0,X0,Y0")  # Move to origin
    send_command("SP,0")  # Pen down
    send_command("G0,X100,Y0")  # Draw first side
    send_command("G0,X100,Y100")  # Draw second side
    send_command("G0,X0,Y100")  # Draw third side
    send_command("G0,X0,Y0")  # Draw fourth side
    send_command("SP,1")  # Pen up


if __name__ == "__main__":
    initialize_axidraw()
    draw_square()
    send_command("EM 0")  # Disable motors
