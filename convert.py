import pandas as pd
import json
import os

# List your job JSON files here (downloaded from R2)
input_files = [
    "cs_jobs.json",
    "ds_jobs.json",
    "it_jobs.json",
    "pm_jobs.json",
    "radar_data.json",
    "swe_jobs.json"
]

# Optional: Output folder (same directory by default)
output_folder = "./cleaned/"

os.makedirs(output_folder, exist_ok=True)

for filename in input_files:
    try:
        print(f"Processing {filename}...")

        # Read JSON into a DataFrame
        df = pd.read_json(filename)

        # Replace all NaN/NaT with None (JSON-safe null)
        df_clean = df.where(pd.notnull(df), None)

        # Save cleaned JSON
        output_path = os.path.join(output_folder, filename.replace(".json", "_clean.json"))
        df_clean.to_json(output_path, orient="records", indent=2)

        print(f"✅ Saved cleaned file to {output_path}")

    except Exception as e:
        print(f"❌ Error processing {filename}: {e}")
