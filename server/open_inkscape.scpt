-- AppleScript to open Inkscape and run a Python script
set inkscapePath to "/Applications/Inkscape.app"
set pythonScriptPath to "/Users/fdb/StudentProjects/bob-harterink/image_bob_harterink/server/draw_rectangle.py"

tell application "Inkscape"
    activate
    -- Run the Python script via Inkscape command line interface
    do shell script "open -a " & quoted form of inkscapePath & " --args --script=" & quoted form of pythonScriptPath
end tell

delay 2

tell application "System Events"
    -- Ensure Inkscape is the frontmost application
    tell process "Inkscape"
        set frontmost to true
        
        -- Open the SVG file
        keystroke "o" using {command down}
        delay 1
    end tell
end tell