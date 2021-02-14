import json
import sys
import os
from os import path

#0 red, 1 blue
color = input("Removes all blocks from a certain color. Enter 0 to remove all reds or 1 for blue: ")
while color != "1" and color != "0":
    color = input("Removes all blocks from a certain color. Enter 0 to remove all reds or 1 for blue: ")

color = int(color)

if len(sys.argv) == 1:
    input("Drag a difficulty on me :(")
    exit()
    
filePath = sys.argv[1]
if not path.exists(sys.argv[1]):
    input("File does not exist, the fuck did you do?")
    exit()

fileJson = open(filePath, encoding='utf-8').read()
try:
    fileJson = json.loads(fileJson)
except ValueError as e:
    input("File is not a json :(")
    exit()


newNotes = []

#for i in range(0, len(dir["songs"])):
for i in range(0, len(fileJson["_notes"])):
    
    #print( str(fileJson["_notes"][i]["_type"]) + "    "+ str(color) )
    if fileJson["_notes"][i]["_type"] != color:
        newNotes.append(fileJson["_notes"][i])    

fileJson["_notes"] = newNotes

if color == 1:
    color = "red"
else:
    color = "blue"

filename = color+' blocks only for '+ os.path.basename(sys.argv[1])
with open(filename, 'w+') as outfile:
    json.dump(fileJson, outfile)

input("Hopefully successfully saved to '"+filename+"'")

















