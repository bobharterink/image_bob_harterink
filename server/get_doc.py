import urllib.request
import json

# The URL for the Firestore collection
url = "https://firestore.googleapis.com/v1/projects/axidrawer/databases/(default)/documents/bobs-designs"

# Making a GET request to the Firestore REST API
response = urllib.request.urlopen(url)
data = json.loads(response.read().decode())

# Extracting the list of documents
documents = data["documents"]

# Extracting the first document
first_document = documents[0]

# Extracting the URL from the fields
svg_url = first_document["fields"]["url"]["stringValue"]

# Printing the SVG URL
print(f"The first SVG URL is: {svg_url}")
