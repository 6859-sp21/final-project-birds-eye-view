import csv, json
from geojson import Feature, FeatureCollection, Point

features = []
with open('../data/electricity_decade.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for country,country_code,year,value in reader:
        try:
            features.append(
                Feature(
                    geometry = Point((0, 0)),
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
with open("../data/electricity_decade.geojson", "w") as f:
    f.write('%s' % collection)
    
    
# source: https://stackoverflow.com/questions/48586647/python-script-to-convert-csv-to-geojson
