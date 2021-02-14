import json
import os
import hashlib
from datetime import date

songs = []

#current dir
cwd = os.getcwd()

#get all folders
arr = os.listdir(cwd)

#Iterate through all folders in CustomLevels
for folder in arr:
    
    #Open info.dat
    print("Reading folder: "+ folder)

    if "CustomLevelsToPlaylist_Converter.exe" in folder:
        continue

    try:

        infoDatPath = cwd + "\\" + folder + "\\" + "info.dat"

        if not os.path.isfile(infoDatPath):
            print(infoDatPath + " doesnt exist, skipping folder")
            continue

        with open(infoDatPath, "rb") as f:
            infoFile = json.loads(f.read())
            songName = infoFile["_songName"]
            print("Getting diffs of: " + songName)

            infoDat = open(infoDatPath, "rb")
            allFiles = infoDat.read()
            infoDat.close()
            
            #Iterate through all sets & maps
            for beatmapSets in infoFile["_difficultyBeatmapSets"]:
                for diff in beatmapSets["_difficultyBeatmaps"]:
                    
                    try:
                        #print(diff["_beatmapFilename"])
                        #Get content of each file and append
                        print("diff: "+diff["_beatmapFilename"])
                        in_file = open(cwd + "\\" + folder + "\\" + diff["_beatmapFilename"], "rb")
                        allFiles = allFiles + in_file.read()
                        in_file.close()
                        
                    except IOError:
                        print("(beatmap) Invalid file: "+diff["_beatmapFilename"])
                        input()
                        
            hash_object = hashlib.sha1(allFiles)
            hashh = hash_object.hexdigest()
            songs.append((songName, hashh))
            print("Song added: "+songName)
            print("Hash added: " + hashh)
            print("---------------------------------")

            
    except IOError:
        print("(infoDat) Invalid folder: "+ folder)
        print("---------------------------------")
        input()
        
name = input("Enter your epic gamer name: ")

newJson = {}
newJson["playlistTitle"] = "CustomLevels Folder ("+str(len(songs))+") by "+name+" from " + str(date.today())
newJson["playlistAuthor"] = "muffns customlevels to playlist script thingy"
newJson["playlistDescription"] = "Hopefully all custom levels put together in a playlist"
newJson["image"] = "data:image/png;base64,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"

songsForJson = []

for song in songs:
    item = { "hash":song[1], "songName":song[0] }
    songsForJson.append(item)
    
newJson["songs"] = songsForJson

print("Hopefully successfull yay")

file = open("CustomLevels ("+str(len(songs))+" Songs) By "+name+" from "+str(date.today())+" .json", "w+") 
file.write(json.dumps(newJson)) 
file.close() 

print("File saved to " + cwd + "\\" + "CustomLevels ("+str(len(songs))+" Songs) By "+name+" from "+str(date.today())+".json" )

input("Press Enter to fuck off :)") 


























