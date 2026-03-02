from serpapi import GoogleSearch
import json

# Testing with locations in Tamil Nadu, India
params = {
  "engine": "google_maps_directions",
  "start_addr": "Chennai, Tamil Nadu, India",
  "end_addr": "Madurai, Tamil Nadu, India",
  "api_key": "ad881a4d22ceb9e978403c63229b5947a3c4a64398fe13a9628a3d2aec6be339"
}

if __name__ == "__main__":
    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        
        if "directions" in results:
            directions = results["directions"]
            print(f"Found {len(directions)} routes from Chennai to Madurai.")
            for i, route in enumerate(directions):
                print(f"\nRoute {i+1}:")
                print(f"  Distance: {route.get('formatted_distance')}")
                print(f"  Duration: {route.get('formatted_duration')}")
                
        else:
            print("No directions found. Here is the raw result:")
            print(json.dumps(results, indent=2))
            
    except Exception as e:
        print(f"An error occurred: {e}")
