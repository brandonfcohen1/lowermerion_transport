#!/bin/bash

# Find all GeoJSON files in the current directory
geojson_files=(*.geojson)
mbtiles_files=()

# Check if GeoJSON files are found
if [ ${#geojson_files[@]} -eq 0 ]; then
  echo "No GeoJSON files found in the current directory."
  exit 1
fi

# Generate an MBTiles file for each GeoJSON input
for file in "${geojson_files[@]}"; do
  output_name=$(basename "$file" .geojson).mbtiles
  mbtiles_files+=("$output_name")
  tippecanoe -o "$output_name" --force --no-tile-compression "$file"
done

# Use tile-join to combine all MBTiles into a single PMTiles file
tile-join -o "output.pmtiles" -pk -f "${mbtiles_files[@]}"

# Clean up individual MBTiles files if no longer needed
rm "${mbtiles_files[@]}"
