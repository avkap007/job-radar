import pandas as pd
import json

# Load file
df = pd.read_excel('us_tech/it_jobs.xlsx')

# Columns to keep for visualizations
columns_to_keep = [
    'title', 'company', 'location', 'site',
    'min_amount', 'max_amount', 'mean_salary',
    'is_remote', 'job_level', 'company_industry',
    'cleaned_description'
]

# Drop rows with missing title/salary
df_filtered = df[columns_to_keep].dropna(subset=['title', 'mean_salary'])

# Add derived fields
df_filtered['city'] = df_filtered['location'].apply(lambda x: str(x).split(',')[0].strip() if pd.notna(x) else None)
df_filtered['remote_status'] = df_filtered['is_remote'].apply(lambda x: 'Remote' if x == True else 'On-site')

# Replace NaN with None so it's valid JSON
df_filtered = df_filtered.where(pd.notnull(df_filtered), None)

# Export
job_records = df_filtered.to_dict(orient='records')
with open('it_jobs.json', 'w') as f:
    json.dump(job_records, f, indent=2)


print(f"✅ Exported {len(job_records)} jobs to it_jobs.json")
