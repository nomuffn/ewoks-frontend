import json
import os.path
import re
import sys
import urllib.request
from os import listdir
from os import path

import io
import requests
import zipfile


def make_safe_filename(s):
    return re.sub(r'[^\w\d-]', ' ', s)


# Script in Playlists/
if len(sys.argv) == 1:
    input("Drag a playlist on this file :(")
    exit()

playlistPath = sys.argv[1]
if not path.exists(sys.argv[1]):
    input("File does not exist, the fuck did you do?")
    exit()

fileJson = open(playlistPath, encoding='utf-8').read()
try:
    playlistJson = json.loads(fileJson)
except ValueError as e:
    input("File is not a json :(")
    exit()

customlevelsPath = os.path.dirname(os.getcwd()) + "\\Beat Saber_Data" + "\\CustomLevels\\"
if not path.exists(customlevelsPath):
    input("Wrong folder, put file in 'Beat Saber/Playlists/'")
    exit()

print("CustomLevels folder: " + customlevelsPath)

# for i in range(0, len(dir["songs"])):
for i in range(0, len(playlistJson["songs"])):

    hashh = playlistJson["songs"][i]["hash"].lower()

    # get id, name and mapper
    url = "https://beatsaver.com/api/maps/by-hash/" + hashh
    user_agent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64)'
    headers = {'User-Agent': user_agent}

    req = urllib.request.Request(url, headers=headers)

    try:
        contents = urllib.request.urlopen(req)
    except (urllib.error.HTTPError, urllib.error.URLError) as e:
        print("- Hash invalid/song not available anymore: " + hashh)
        continue

    dataJson = json.loads(contents.read())

    songname = dataJson["metadata"]["songName"]
    mapper = dataJson["metadata"]["levelAuthorName"]
    id = dataJson["key"]

    # check if folder already exists or another folder in another format, so contains all three strings
    foldername = id + " (" + make_safe_filename(songname) + " - " + make_safe_filename(mapper) + ")"
    if path.exists(customlevelsPath + foldername):
        print("- Skipping, already downloaded: " + songname)
        continue

    x = 0
    for f in listdir(customlevelsPath):
        if songname and mapper and id in f:
            x = 1
            break
    if x == 1:
        print(
            "- Skipping, already downloaded: " + songname + ", But the format is scuff so suggest to fix it to: id (songname - mapper)")
        continue

    print("Downloading song: " + songname + " (" + hashh + ")")

    # download file
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
    r = requests.get("https://beatsaver.com/api/download/hash/" + hashh, stream=True,
                     headers=headers)

    try:
        z = zipfile.ZipFile(io.BytesIO(r.content))
        filePath = os.path.join(customlevelsPath, foldername)
        z.extractall(filePath)
        print("+ Downloaded & extracted: " + songname)
    except zipfile.BadZipFile:
        print(playlistJson["songs"][i]["songName"] + ": could not be downloaded")

input("Hopefully successfully finished downloading all songs hahaball")
