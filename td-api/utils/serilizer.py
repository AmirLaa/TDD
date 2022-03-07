import json
import argparse
parser = argparse.ArgumentParser(description='This tool serlize TD json to RDF. Execution example:  Python3 serilizer.py -inputFile /Users/amirl/Downloads/ambientSensor.json -outputFile /Users/amirl/Downloads/ambientSensor.rdf ')
parser.add_argument('-inputFile', help='The path of the input File', required=True)
parser.add_argument('-outputFile', help='The path of the output File. If the file is not empty, its content will be overwritten.', required=True)
args = vars(parser.parse_args())
#read input file
f = open(args["inputFile"])
jsonFile = json.load(f)
#read output file
outputFile = open(args["outputFile"], "w")
ID=jsonFile["id"]
Name=jsonFile["title"]
properties= []
unitsOFmeasurement = []
Type=jsonFile["@type"]
Room=""
LocationLabel=""
location=jsonFile["dco:isLocatedAt"]
propertiesJson=jsonFile["properties"]
#parsing the located-in array


#parsing the properties
#print(propertiesJson)
#test for the structures
StructureType=0

try:
    for item in propertiesJson:
        unitsOFmeasurement.append(propertiesJson[item]["unit"])
        StructureType=1
except:
    try:
        propertiesJson["report"]
        StructureType=3
    except:
        StructureType=2

if (StructureType==1):
    for item2 in propertiesJson:
        properties.append(propertiesJson[item2]["@type"])
        unitsOFmeasurement.append(propertiesJson[item2]["unit"])

if (StructureType==2):
    for item2 in propertiesJson:
        properties.append(propertiesJson[item2]["@type"])
        try:
            unitsOFmeasurement.append(propertiesJson[item2]["unit"])
        except:
            PropertiesLevel2=propertiesJson[item2]["properties"]["value"]
            unitsOFmeasurement.append(PropertiesLevel2["unit"])

if (StructureType==3):
    propertiesJsonLevel3= propertiesJson["report"]["properties"]
    for item3 in propertiesJsonLevel3:
        properties.append(propertiesJsonLevel3[item3]["@type"])
        try:
            unitsOFmeasurement.append(propertiesJsonLevel3[item3]["unit"])
        except:
            unitsOFmeasurement.append("0")

TDName=Type+'_'+ID
outputFile.write('dco:'+TDName+' rdf:Type '+Type+' .')
outputFile.write('dco:'+TDName+' dco:hasName "'+Name+'" .')
outputFile.write('dco:'+TDName+' dco:hasID "'+ID+'" .')
outputFile.write('dco:'+TDName+' dco:isLocatedAt '+location+' .')

#loop the properties
j=0
print(properties)
while ( j < len(properties)):
    PropName = Type+'_'+properties[j][4:]+ID
    outputFile.write('dco:'+TDName+' dco:hasProperty dco:'+PropName+' .')
    outputFile.write('dco:'+PropName+' rdf:type '+properties[j]+' .')
    outputFile.write('dco:'+PropName+' rdf:type dco:Property . ')
    if (unitsOFmeasurement[j]!="0"):
        outputFile.write('dco:'+PropName+' dco:isMeasuredIn '+unitsOFmeasurement[j]+' .')
    j +=1
outputFile.close()

print("done")
