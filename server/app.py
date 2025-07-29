import time
from db import get_doc_with_split_colors, update_doc_status
from flask import Flask, render_template, jsonify, request
from pyaxidraw import axidraw

SERVER_STATE_IDLE = "idle"
SERVER_STATE_READY_TO_PRINT = "ready-to-print"
SERVER_STATE_PRINTING = "printing"
SERVER_STATE_WAIT_FOR_PEN_SWAP = "wait-for-pen-swap"
SERVER_STATE_ERROR = "error"

app = Flask(__name__)
server_state = SERVER_STATE_IDLE
files_to_print = []

def draw_file(filename):
    ad = axidraw.AxiDraw()
    ad.plot_setup(filename)
    ad.plot_run()

def check_for_files():
    global server_state, files_to_print
    while True:
        if server_state == SERVER_STATE_IDLE:
            new_files = get_doc_with_split_colors()
            if new_files:
                files_to_print.extend(new_files)
                server_state = SERVER_STATE_READY_TO_PRINT
                print(f"New files added: {new_files}")
            else:
                print("No new files found.")
        time.sleep(5)  # Wait for 5 seconds before checking again

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/axidraw/state", methods=["GET"])
def get_state():
    file_info = files_to_print[0] if files_to_print else None
    return jsonify({"state": server_state, "file": file_info})

@app.route("/api/axidraw/print", methods=["POST"])
def start_print():
    global server_state
    if server_state == SERVER_STATE_READY_TO_PRINT:
        server_state = SERVER_STATE_PRINTING
        print_next_color()
    return jsonify({"state": server_state})

@app.route("/api/axidraw/pen-loaded", methods=["POST"])
def pen_loaded():
    global server_state
    if server_state == SERVER_STATE_WAIT_FOR_PEN_SWAP:
        server_state = SERVER_STATE_PRINTING
        print_next_color()
    return jsonify({"state": server_state})

def print_next_color():
    global server_state, files_to_print
    if files_to_print:
        file_info = files_to_print.pop(0)
        filename = file_info["filename"]
        doc_name = file_info["doc_name"]
        print(f"Drawing file: {filename}")
        try:
            draw_file(filename)
            print("Drawing completed.")
            update_doc_status(doc_name, "printed")
            if files_to_print:
                server_state = SERVER_STATE_WAIT_FOR_PEN_SWAP
            else:
                server_state = SERVER_STATE_IDLE
        except Exception as e:
            print(f"Error occurred while drawing: {str(e)}")
            server_state = SERVER_STATE_ERROR
            update_doc_status(doc_name, "error")
    else:
        server_state = SERVER_STATE_IDLE

if __name__ == "__main__":
    import threading
    threading.Thread(target=check_for_files).start()
    app.run(port=3000, debug=True)
