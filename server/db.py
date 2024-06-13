import os
import requests
import json
from split_colors import split_colors

# The URL for the Firestore query
query_url = "https://firestore.googleapis.com/v1/projects/axidrawer/databases/(default)/documents:runQuery"

# The structured query to filter documents by status
query = {
    "structuredQuery": {
        "from": [{"collectionId": "bobs-designs"}],
        "where": {
            "fieldFilter": {
                "field": {"fieldPath": "status"},
                "op": "EQUAL",
                "value": {"stringValue": "ready-to-print"},
            }
        },
    }
}

def get_doc_ready_to_print():
    # Convert the query to JSON

    query_json = json.dumps(query)

    # Send the POST request and get the response
    response = requests.post(
        query_url, headers={"Content-Type": "application/json"}, data=query_json
    )

    # Checking if the request was successful
    if response.status_code == 200:
        response_data = response.json()

        # Extract the first document's URL if there are any results
        if response_data:
            first_document = response_data[0]["document"]
            doc_name = first_document["name"]  # Document name including the path
            svg_url = first_document["fields"]["url"]["stringValue"]
            print(f"The first SVG URL is: {svg_url}")

            # Download the SVG url as a file in the "jobs" directory
            svg_basename = os.path.basename(svg_url)
            svg_filename = f"static/jobs/{svg_basename}"
            svg_response = requests.get(svg_url)
            with open(svg_filename, "wb") as f:
                f.write(svg_response.content)
            print(f"Downloaded SVG file as: {svg_filename}")
            return svg_filename, doc_name
        else:
            print("No documents found with the status 'ready-to-print'.")
            return None, None
    else:
        print(f"Failed to fetch documents. Status code: {response.status_code}")
        return None, None

def get_doc_with_split_colors():
    svg_filename, doc_name = get_doc_ready_to_print()
    if svg_filename:
        output_files = split_colors(svg_filename, doc_name)
        return output_files
    else:
        return None

def update_doc_status(doc_name, status):
    update_url = f"https://firestore.googleapis.com/v1/{doc_name}?updateMask.fieldPaths=status"
    update_data = {
        "fields": {
            "status": {"stringValue": status}
        }
    }
    response = requests.patch(
        update_url,
        headers={"Content-Type": "application/json"},
        data=json.dumps(update_data)
    )
    if response.status_code == 200:
        print(f"Document {doc_name} status updated to {status}.")
    else:
        print(f"Failed to update document {doc_name}. Status code: {response.status_code}, Response: {response.text}")
