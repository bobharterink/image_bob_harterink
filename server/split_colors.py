import re
import os
import webcolors


import math


def hex_to_rgb(hex_color):
    return webcolors.hex_to_rgb(hex_color)


def rgb_distance(rgb1, rgb2):
    r1, g1, b1 = rgb1
    r2, g2, b2 = rgb2
    return math.sqrt((r2 - r1) ** 2 + (g2 - g1) ** 2 + (b2 - b1) ** 2)


def find_closest_color(hex_color):
    rgb_color = hex_to_rgb(hex_color)

    min_distance = float("inf")
    closest_color = None

    for named_color, named_hex in webcolors.CSS3_NAMES_TO_HEX.items():
        named_rgb = webcolors.hex_to_rgb(named_hex)
        distance = rgb_distance(rgb_color, named_rgb)

        if distance < min_distance:
            min_distance = distance
            closest_color = named_color

    return closest_color


def split_colors(filename):
    # Open the SVG file and read its contents
    with open(filename, "r") as f:
        svg_contents = f.read()

    # Extract the SVG header and footer
    header_match = re.search(r"<svg.*?>", svg_contents)
    footer_match = re.search(r"</svg>", svg_contents)

    if header_match and footer_match:
        svg_header = header_match.group()
        svg_footer = footer_match.group()

        # Extract all the paths from the SVG
        path_matches = re.findall(r"<path.*?/>", svg_contents)

        # Create a dictionary to store paths by color
        color_paths = {}

        # Iterate over each path and extract its color
        for path in path_matches:
            color_match = re.search(r"stroke:#([0-9A-Fa-f]{6})", path)
            if color_match:
                color = color_match.group(1)
                if color not in color_paths:
                    color_paths[color] = []
                color_paths[color].append(path)

        # Create a list to store the generated filenames and colors
        output_list = []

        # Create a new SVG file for each color
        for color, paths in color_paths.items():
            color_name = find_closest_color(f"#{color}")

            output_filename = f"{os.path.splitext(filename)[0]}_{color_name}.svg"
            with open(output_filename, "w") as f:
                f.write(svg_header + "\n")
                f.write("<g>\n")
                for path in paths:
                    f.write(path + "\n")
                f.write("</g>\n")
                f.write(svg_footer + "\n")

            output_list.append(
                {"filename": output_filename, "color": color_name, "hex": f"#{color}"}
            )

        print(f"Split {filename} into {len(color_paths)} SVG files by color.")
        return output_list
    else:
        print(f"Invalid SVG format in {filename}. Unable to split.")
        return []


# Example usage
if __name__ == "__main__":
    output_files = split_colors("static/jobs/mm8tk.svg")
    print(output_files)
