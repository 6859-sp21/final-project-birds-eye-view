import csv, json
from geojson import Feature, FeatureCollection, Point

features = []
with open('../data/electricity_decade_fin.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for country, latitude, longitude, country_code,year,value in reader:
        try:
            latitude, longitude = map(float, (latitude, longitude))
            features.append(
                Feature(
                    geometry = Point((longitude, latitude)),
                    properties = {
                        'country' : country,
                        'country_code' : country_code,
                        'year' : year,
                        'value' : value
                    }
                )
            )
        except:
            pass

collection = FeatureCollection(features)
with open("../data/electricity_decade_fin.geojson", "w") as f:
    f.write('%s' % collection)
    
    
# source: https://stackoverflow.com/questions/48586647/python-script-to-convert-csv-to-geojson
