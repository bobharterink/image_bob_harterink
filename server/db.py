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
    query_json = json.dumps(query)
    response = requests.post(query_url, headers={"Content-Type": "application/json"}, data=query_json)

    if response.status_code == 200:
        response_data = response.json()
        documents = [doc["document"] for doc in response_data if "document" in doc]
        
        if documents:
            for document in documents:
                doc_name = document["name"]
                svg_url = document["fields"]["url"]["stringValue"]
                svg_basename = os.path.basename(svg_url)
                svg_filename = f"static/jobs/{svg_basename}"
                svg_response = requests.get(svg_url)
                with open(svg_filename, "wb") as f:
                    f.write(svg_response.content)
                yield svg_filename, doc_name
        else:
            yield None, None
    else:
        yield None, None

def get_doc_with_split_colors():
    output_files = []
    for svg_filename, doc_name in get_doc_ready_to_print():
        if svg_filename:
            output_files.extend(split_colors(svg_filename, doc_name))
    return output_files

def update_doc_status(doc_name, status):
    update_url = f"https://firestore.googleapis.com/v1/{doc_name}?updateMask.fieldPaths=status"
    update_data = {
        "fields": {
            "status": {"stringValue": status}
        }
    }
    response = requests.patch(update_url, headers={"Content-Type": "application/json"}, data=json.dumps(update_data))
    if response.status_code == 200:
        print(f"Document {doc_name} status updated to {status}.")
    else:
        print(f"Failed to update document {doc_name}. Status code: {response.status_code}, Response: {response.text}")
