import re
import os

def custom_color_mapping(hex_color):
    color_mapping = {
        "#FFCB09": "gele",
        "#F68D2C": "oranje",
        "#ED1C24": "karmijn",
        "#D1204E": "donker rode",
        "#F4899D": "roze",
        "#A3238E": "lila",
        "#0B4DA1": "blauwe",
        "#0095D5": "licht blauwe",
        "#A1CC3A": "licht groene",
        "#00A15C": "groene",
        "#C54B42": "sanguine rode",
        "#714B3A": "bruine",
        "#ACC0D3": "licht koud grijze",
        "#5F6D7F": "donker grijze",
        "#001722": "zwarte",
    }

    return color_mapping.get(hex_color.upper(), "unknown")

def split_colors(filename, doc_name):
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
            color_name = custom_color_mapping(f"#{color}")

            output_filename = f"{os.path.splitext(filename)[0]}_{color_name}.svg"
            with open(output_filename, "w") as f:
                f.write(svg_header + "\n")
                f.write('<g transform="scale(0.7)">\n')
                for path in paths:
                    f.write(path + "\n")
                f.write("</g>\n")
                f.write(svg_footer + "\n")

            output_list.append(
                {"filename": output_filename, "color": color_name, "hex": f"#{color}", "doc_name": doc_name}
            )

        print(f"Split {filename} into {len(color_paths)} SVG files by color.")
        return output_list
    else:
        print(f"Invalid SVG format in {filename}. Unable to split.")
        return []