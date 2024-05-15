import json

# Load data from JSON file
with open("data.json", "r") as file:
    data = json.load(file)

# Function to generate sentences
def generate_sentences(data):
    sentences = []
    for thing_id, thing_data in data.items():
        thing_name = thing_data["@type"]
        sentences.append(f"{thing_name} Properties:")
        for prop_name, prop_data in thing_data["properties"].items():
            prop_desc = prop_data["description"]
            sentences.append(f"{thing_name}::{prop_name}: {prop_desc}")
        sentences.append(f"{thing_name} Actions:")
        for action_name, action_data in thing_data["actions"].items():
            action_desc = action_data["description"]
            sentences.append(f"{thing_name}::{action_name}: {action_desc}")
        sentences.append(f"{thing_name} Events:")
        for event_name, event_data in thing_data["events"].items():
            event_desc = event_data["description"]
            sentences.append(f"{thing_name}::{event_name}: {event_desc}")
        sentences.append("")  # Add a blank line between things
    return sentences

# Generate sentences
sentences = generate_sentences(data)

# Print sentences
for sentence in sentences:
    print(sentence)

output_file = "sentences.txt"

# Generate sentences
sentences = generate_sentences(data)

# Write sentences to the output file
with open(output_file, "w") as file:
    for sentence in sentences:
        file.write(sentence + "\n")

print(f"Sentences exported to {output_file}")