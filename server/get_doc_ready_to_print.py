import os
import requests
import json

# The URL for the Firestore query
url = "https://firestore.googleapis.com/v1/projects/axidrawer/databases/(default)/documents:runQuery"

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

# Convert the query to JSON
query_json = json.dumps(query)

# Send the POST request and get the response
response = requests.post(
    url, headers={"Content-Type": "application/json"}, data=query_json
)

# Checking if the request was successful
if response.status_code == 200:
    response_data = response.json()

    # Extract the first document's URL if there are any results
    if response_data:
        first_document = response_data[0]["document"]
        svg_url = first_document["fields"]["url"]["stringValue"]
        print(f"The first SVG URL is: {svg_url}")

        # Download the SVG url as a file in the "jobs" directory
        svg_filename = os.path.basename(svg_url)
        svg_response = requests.get(svg_url)
        with open(f"jobs/{svg_filename}", "wb") as f:
            f.write(svg_response.content)
        print(f"Downloaded SVG file as: {svg_filename}")
    else:
        print("No documents found with the status 'ready-to-print'.")
else:
    print(f"Failed to fetch documents. Status code: {response.status_code}")
