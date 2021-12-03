function convertToDots(input) {
    var f = input.target.files[0]

    if (f) {
        var r = new FileReader()
        r.onload = function(e) {
            var contents = e.target.result
            try {
                var obj = JSON.parse(contents)
                if (obj._notes != null) {
                    for (var i = 0; i < obj._notes.length; i++) {
                        if (obj._notes[i]._type === 3) {
                            obj._notes.splice(i, 1)
                            i = 0
                        }

                        var c = 0
                        for (var n = 0; n < obj._notes.length; n++) {
                            if (obj._notes[i]._time === obj._notes[n]._time) {
                                if (c === 0) {
                                    c++
                                } else {
                                    obj._notes.splice(n, 1)
                                    n = 0
                                    c = 0
                                }
                            }
                        }
                    }

                    for (var k in obj._notes) {
                        obj._notes[k]._lineIndex = 3
                        obj._notes[k]._lineLayer = 0
                        obj._notes[k]._type = 1
                        obj._notes[k]._cutDirection = 8
                    }
                    var element = document.createElement('a')
                    element.setAttribute(
                        'href',
                        'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(obj)),
                    )
                    element.setAttribute('download', 'Timings of ' + f.name)

                    element.style.display = 'none'
                    document.getElementById('fileinputbla').appendChild(element)
                    element.click()
                    document.getElementById('fileinputbla').removeChild(element)
                } else {
                    alert('Invalid file')
                }
            } catch (err) {
                alert('Invalid file')
            }
        }
        r.readAsText(f)
    } else {
        alert('Failed to load file')
    }
}

function fixWalls(input, bpm) {
    if (isNaN(bpm) || bpm == '') {
        alert('BPM must be a number >:(')
        return false
    }

    var f = input.target.files[0]

    if (f) {
        var r = new FileReader()
        r.onload = function(e) {
            var contents = e.target.result
            try {
                var obj = JSON.parse(contents)

                if (obj._obstacles != null) {
                    for (var i = 0; i < obj._obstacles.length; i++) {
                        var wall = obj._obstacles[i]

                        if (
                            wall._duration * (60 / bpm) + 1e-9 < 0.02 &&
                            (wall._width >= 2 || wall._lineIndex == 1 || wall._lineIndex == 2)
                        ) {
                            wall._duration = (0.02 - 1e-9) / (60 / bpm)
                        }
                    }

                    var element = document.createElement('a')
                    element.setAttribute(
                        'href',
                        'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(obj)),
                    )
                    element.setAttribute('download', 'Fixed Walls for ' + f.name)

                    element.style.display = 'none'
                    document.getElementById('fileinputblaWalls').appendChild(element)
                    element.click()
                    document.getElementById('fileinputblaWalls').removeChild(element)
                } else {
                    alert('Invalid file1')
                }
            } catch (err) {
                alert('Invalid file2: ' + err)
            }
        }
        r.readAsText(f)
    } else {
        alert('Failed to load file')
    }
}

export { convertToDots, fixWalls }
