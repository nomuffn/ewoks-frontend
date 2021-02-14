import math
import os
import json
from bisect import bisect


def get_attr(obj, key, default=None):
    return obj[key] if key in obj else default


def compute_bpm_changes():
    global diffJson, difficultyBeatmap, seconds_per_beat, editor_offset, bpm, bpm_changes, bpm_change_times

    custom_data = get_attr(diffJson, '_customData', {})
    raw_changes = get_attr(custom_data, '_BPMChanges', []) + get_attr(custom_data, '_bpmChanges', [])  # read both formats
    raw_changes = sorted(raw_changes, key=lambda c: c['_time'])

    editor_offset = get_attr(get_attr(difficultyBeatmap, '_customData', {}), '_editorOffset', 0)

    grid_start = {
        '_time': editor_offset / 1000 / seconds_per_beat,
        '_BPM': bpm,
        '_beat': 0,
        '_beatsPerBar': 4,
        '_metronomeOffset': 4,
    }

    bpm_changes = [grid_start]
    for change in raw_changes:
        if change['_beatsPerBar'] != 4 or change['_metronomeOffset'] != 4 or change['_time'] <= 0:
            print('Map contains very fucked BPM changes… Beat numbers will be off')

        passed_beats = (change['_time'] - bpm_changes[-1]['_time'] - 0.01) / bpm * \
                       bpm_changes[-1]['_BPM']
        change['_beat'] = bpm_changes[-1]['_beat'] + math.ceil(
            passed_beats)
        bpm_changes.append(change)

    bpm_change_times = [c['_time'] for c in bpm_changes]


def get_editor_beat(beat):
    global bpm_changes, bpm_change_times, bpm

    if beat < bpm_changes[0]['_time']:
        return beat
    last_bpm_change = bpm_changes[bisect(bpm_change_times, beat) - 1]
    passed_beats = (beat - last_bpm_change['_time']) / bpm * last_bpm_change['_BPM']

    return last_bpm_change['_beat'] + passed_beats


if os.path.isfile(os.getcwd() + "\\" + "info.dat"):
    filePath = os.getcwd() + "\\" + "info.dat"
elif os.path.isfile(os.getcwd() + "\\" + "Info.dat"):
    filePath = os.getcwd() + "\\" + "Info.dat"
else:
    input("no info file found")
    exit()




with open(filePath, "rb") as f:
    info_json = json.loads(f.read())


bpm = info_json["_beatsPerMinute"]
seconds_per_beat = 60 / bpm



for difficultyBeatmapSet in info_json["_difficultyBeatmapSets"]:
    if difficultyBeatmapSet["_beatmapCharacteristicName"] == "Standard":
        for diff in difficultyBeatmapSet["_difficultyBeatmaps"]:

            difficultyBeatmap = diff

            fileName = diff["_beatmapFilename"]

            print(fileName)

            if os.path.isfile(os.getcwd() + "\\" + fileName):
                with open(os.getcwd() + "\\" + fileName, "rb") as f:
                    diffJson = json.loads(f.read())

                compute_bpm_changes()

                for bookmark in diffJson["_customData"]["_bookmarks"]:
                    print(str(
                        round( get_editor_beat(bookmark["_time"]), 2))
                          + ", " + bookmark["_name"])

            print("------------------")

print("Not always super accurate")
input("Press any key to quit")
exit()
