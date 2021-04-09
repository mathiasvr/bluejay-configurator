// Copyright 2021 Dinesh Manajipet
//
// This is based on the MIT Licensed work done by Adam Rahwane in https://github.com/adamonsoon/rtttl-parse
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software
// and associated documentation files (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

class Rtttl {

/**
 * Parse RTTTL
 *
 * @param {string} rtttl - RTTTL String
 * @returns {object} - An object specifying frequency and duration for each note
 */
static parse(rtttl) {

  const REQUIRED_SECTIONS_NUM = 3;
  const SECTIONS = rtttl.split(':');

  if (SECTIONS.length !== REQUIRED_SECTIONS_NUM) {
    throw new Error('Invalid RTTTL file.');
  }

  const NAME     = Rtttl.getName(SECTIONS[0]);
  const DEFAULTS = Rtttl.getDefaults(SECTIONS[1]);
  const MELODY   = Rtttl.getData(SECTIONS[2], DEFAULTS);

  return {
    name     : NAME,
    defaults : DEFAULTS,
    melody   : MELODY
  }
}

/**
 * Parse RTTTL to Bluejay/BlHeli ESC startup melody data
 *
 * @param {string} rtttl - RTTTL String
 * @param {int} startupMelodyLength - Bluejay Temp4,Temp3 array length. If unspecified, it is assumed to be 128 bytes
 * @returns an object {
 *     data: [] , // An array of (Number of pulses, Pulse width) tuples for each note of rtttl
 *     errorCodes: [] // An array of errors encountered while processing each note of rtttl
 * }
 *
 * Startup melody data structure is:
 * [2 bytes of bpm],[1 byte of default octave],[1 byte of default duration][(Temp4, Temp3) values]
 * Temp4 = number of pulses (~ duration)
 * Temp3 = duration of each pulse (~ pitch)
 *
 * error codes:
 * 0 = no error
 * 1 = invalid note frequency
 * 2 = note too long
 */
static toBluejayStartupMelody(rtttl, startupMelodyLength) {

  let parsedData = Rtttl.parse(rtttl);
  startupMelodyLength = (typeof startupMelodyLength === 'number')? startupMelodyLength : 128;

  if (startupMelodyLength < 4) {
    throw new Error('startupMelodyLength is too small to fit a Bluejay Startup Melody');
  }

  // Melody is basically an array of [{ duration(in ms): number, frequency (in Hz): number }]
  const MAX_ITEM_VALUE = 2**8;
  let melody = parsedData.melody;
  let result = new Uint8Array(startupMelodyLength);
  let errorCodes = new Array(melody.length);

  let bpm = Math.floor(parsedData.defaults.bpm) % (2**16);
  result[0] = (bpm >> 8) & (2**8 - 1);
  result[1] = (bpm) & (2**8 - 1);
  result[2] = Math.floor(parsedData.defaults.octave) % (MAX_ITEM_VALUE);
  result[3] = Math.floor(parsedData.defaults.duration) % (MAX_ITEM_VALUE);

  var currentResultIndex = 4;
  var currentMelodyIndex = 0;

  while(currentMelodyIndex < melody.length && currentResultIndex < result.length) {
    var item = melody[currentMelodyIndex];

    // Check if the current note is a pause
    if (item.frequency != 0) {
      // temp3 is a measure of wavelength of the sound
      let temp3 = Rtttl._calculateBluejayTemp3FromFrequency(item.frequency);

      if (temp3 > 0 && temp3 < MAX_ITEM_VALUE) {
        let duration_per_pulse_ms = 1000/item.frequency;
        let pulses_needed = Math.round(item.duration / duration_per_pulse_ms);

        while (pulses_needed > 0 && currentResultIndex < result.length) {
          result[currentResultIndex++] = Math.min(pulses_needed, MAX_ITEM_VALUE - 1);
          result[currentResultIndex++] = temp3;
          pulses_needed -= result[currentResultIndex - 2];
        }

        // If the current note doesn't fit in the result,
        // then the while loop exits with pulses_needed > 0
        if (pulses_needed > 0) {
          errorCodes[currentMelodyIndex] = 2;
        } else {
          errorCodes[currentMelodyIndex] = 0;
        }
      } else {
          errorCodes[currentMelodyIndex] = 1;
      }
    } else {
        // Each (Temp3, Temp4) tuple can wait from 1-255ms
        // So split up a single silent note, if we have to
        let duration = Math.round(item.duration);

        while (duration > 0 && currentResultIndex < result.length) {
            result[currentResultIndex++] = Math.min(duration, MAX_ITEM_VALUE - 1);
            result[currentResultIndex++] = 0;
            duration -= result[currentResultIndex - 2];
        }

        // If the current note doesn't fit in the result,
        // then the while loop exits with duration > 0
        if (duration > 0) {
          errorCodes[currentMelodyIndex] = 2;
        } else {
          errorCodes[currentMelodyIndex] = 0;
        }
    }

    currentMelodyIndex++;
  }

  while (currentMelodyIndex < melody.length) {
    errorCodes[currentMelodyIndex] = 2;
    currentMelodyIndex++;
  }

  return {
    data: result,
    errorCodes: errorCodes
  };

}

/**
 * Parse a Bluejay startup melody array into an rtttl string
 *
 * @param {Uint8Array} startupMelodyData - an array of [(Temp4, Temp3)] values
 * @param {string}} melodyName - Name to use in generated rtttl
 * @returns an array of (Number of pulses, Pulse width) tuples
 */
static fromBluejayStartupMelody(startupMelodyData, melodyName) {

  melodyName = melodyName || 'Melody'

  if (startupMelodyData.length < 4) {
    return melodyName + 'Melody:d=1,o=4,bpm=100:';
  }

  let defaults = {
      bpm: (startupMelodyData[0] << 8) + startupMelodyData[1],
      octave: startupMelodyData[2],
      duration: startupMelodyData[3]
  };

  let melodyNotes = [];

  // First try to glob all the same adjacent notes, that could have been split up due to Temp4 size limits
  for (var i = 4; i + 1 < startupMelodyData.length; i += 2){
    const freq = Rtttl._calculateFrequencyFromBluejayTemp3(startupMelodyData[i+1]);
    const note = Rtttl._calculateNoteNameFromFrequency(freq);
    const octave = Rtttl._calculateNoteOctaveFromFrequency(freq);
    const dur = freq == 0? startupMelodyData[i] : (1000/Rtttl._calculateFrequency(note, octave))*startupMelodyData[i];

    if (dur > 0) {
        // Two adjacent notes of same frequency can be assumed to be split up IF
        // Temp4 value of the previous note is 255
        // TODO: Improve this heuristic by making sure Temp4 = 255 is not a quantized note duration
        if (melodyNotes.length > 0
            && (Math.abs(melodyNotes[melodyNotes.length - 1].frequency - freq) < 0.01
                && startupMelodyData[i-2] === 255)){
            melodyNotes[melodyNotes.length - 1].duration += dur;
        } else {
            melodyNotes.push({
                              duration: dur,
                              frequency: freq,
                              musicalNote: note,
                              musicalOctave: octave});
        }
    } else {
        break;
    }
  }

  const fullNoteDuration = 4*60000/defaults.bpm;
/*
  // Alternative implementation where we are trying to find the closest note duration
  const closestIndex = (array, value) => {
      if (array.length < 1) {
          return -1;
      }

      let result = 0;
      let start = 0;
      let end = array.length;

      while (end >= start) {
        let mid = start + Math.floor((end - start)/2);
        result = Math.abs(array[mid] - value) < Math.abs(array[result] - value) ? mid : result;
        if(value > array[mid]) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
      }

      return result;
  }

  const maximumDots = 1;
  const dottedDurationMultipliers = [1, 1.5, 1.75, 1.875, 1.9375].splice(0, maximumDots + 1);
  const durations = [1/32, 1/16, 1/8, 1/4, 1/2, 1].map((d) => dottedDurationMultipliers.map((m) => d*m)).flat();

  let melodyString = ''
  for (var item of melodyNotes) {
    let musicalDuration = item.duration/fullNoteDuration;

    while (musicalDuration > 0) {
      const itemDuration = Math.min(dottedDurationMultipliers.length, musicalDuration); // Longest allowed note is a full note with 4 dots
      const durationIndex = closestIndex(durations, itemDuration);
      const rtttlDuration = Math.pow(2, 5 - Math.floor(durationIndex/dottedDurationMultipliers.length));
      const dots = '.'.repeat(durationIndex % dottedDurationMultipliers.length);

      melodyString += (rtttlDuration === defaults.duration? '' : rtttlDuration) +
                      (item.musicalNote) +
                      (item.musicalOctave === defaults.octave || item.musicalOctave === 0 ? '' : item.musicalOctave) +
                      (dots) +
                      ',';
      musicalDuration -= itemDuration;
    }
  }
*/
  let smallestMusicalDuration = fullNoteDuration/64; // Smallest Note duration is 1/32nd note's dot
  let quantizedDuration = (duration) => Math.round(duration/smallestMusicalDuration)*smallestMusicalDuration;

  let melodyString = ''
  for (var item of melodyNotes) {
    let musicalDuration = quantizedDuration(item.duration)/fullNoteDuration;

    while (musicalDuration > 1/64) {
      let currentDuration = Math.min(1.5, musicalDuration); // Maximum allowed note is one and a half note
      let rtttlDuration = Math.pow(2, -Math.floor(Math.log2(currentDuration)));
      let isDottedNote = currentDuration*rtttlDuration > 1
      melodyString += (rtttlDuration === defaults.duration ? '' : rtttlDuration) +
                      (item.musicalNote) +
                      (item.musicalOctave === defaults.octave || item.musicalOctave === 0 ? '' : item.musicalOctave) +
                      (isDottedNote ? '.' : '') + // Add a dot at the end of half notes
                      ',';
      musicalDuration -= currentDuration;
    }
  }

  return melodyName + ':b='+defaults.bpm+',o='+defaults.octave+',d=' + defaults.duration +':' + melodyString.replace(/,$/, '')
}


/**
 * Get ring tone name
 *
 * @param {string} name
 * @returns {string}
 */
static getName(name) {

  const MAX_LENGTH = 10;

  if (name.length > MAX_LENGTH) {
    console.warn('Tune name should not exceed 10 characters.');
  }

  if (!name) {
    return 'Unknown';
  }

  return name;

}

/**
 * Get duration, octave and BPM
 *
 * @param {string} defaults
 * @returns {object}
 */
static getDefaults(defaults) {

  const VALUES = defaults.split(',');

  const VALUES_ARR = VALUES.map((value) => {

    if (value === '') {
      return {}
    }

    const KEY_VAL = value.split('=');

    if (KEY_VAL.length !== 2) {
      throw new Error('Invalid setting ' + value);
    }

    const KEY = KEY_VAL[0];
    const VAL = KEY_VAL[1];

    const ALLOWED_DURATION = ['1', '2', '4', '8', '16', '32'];
    const ALLOWED_OCTAVE   = ['4', '5', '6', '7'];
    const ALLOWED_BPM      = [
      '25', '28', '31', '35', '40', '45', '50', '56', '63', '70', '80', '90', '100',
      '112', '125', '140', '160', '180', '200', '225', '250', '285', '320', '355',
      '400', '450', '500', '565', '635', '715', '800', '900'
      ];

    switch(KEY) {
      case 'd':
        if (ALLOWED_DURATION.indexOf(VAL) !== -1) {
          return {duration: VAL};
        } else {
          throw new Error('Invalid duration ' + VAL);
        }
      case 'o':
        if (ALLOWED_OCTAVE.indexOf(VAL) === -1) {
          console.warn('Invalid octave ' + VAL);
        }
        return {octave: VAL};
      case 'b':
        if (ALLOWED_BPM.indexOf(VAL) === -1) {
          console.warn('Invalid BPM ' + VAL);
        }
        return {bpm: VAL};
    }

  });

  const VALUES_OBJ = Rtttl._toObject({}, VALUES_ARR);

  const DEFAULT_VALUES = {
    duration : '4',
    octave   : '6',
    bpm      : '63'
  };

  return Object.assign(DEFAULT_VALUES, VALUES_OBJ);

}

/**
 * Convert an array of objects into an object
 *
 * @param {object} obj
 * @param {Array} arr
 * @returns {object}
 * @private
 */
static _toObject(obj, arr) {

  if (arr.length === 0) {
    return obj;
  }

  const newObj = Object.assign(obj, arr[0]);

  return Rtttl._toObject(newObj, arr.slice(1));
}

/**
 * Get the parsed melody data
 *
 * @param {string} melody
 * @param {object} defaults
 * @returns {Array}
 */
static getData(melody, defaults) {

  const NOTES       = melody.split(',');
  const BEAT_EVERY  = 60000 / parseInt(defaults.bpm);

  return NOTES.map((note) => {

    const NOTE_REGEX = /(1|2|4|8|16|32|64)?((?:[a-g]|h|p)#?){1}(\.*)(1|2|3|4|5|6|7|8)?(\.*)/;
    const NOTE_PARTS = note.match(NOTE_REGEX);

    const NOTE_DURATION = NOTE_PARTS[1] || parseInt(defaults.duration);
    const NOTE          = NOTE_PARTS[2] === 'h' ? 'b' : NOTE_PARTS[2];
    const NOTE_OCTAVE   = NOTE_PARTS[4] || parseInt(defaults.octave);
    const NOTE_DOTS     = NOTE_PARTS[3] && NOTE_PARTS[3][0] === '.' ? NOTE_PARTS[3].length:
                          NOTE_PARTS[5] && NOTE_PARTS[5][0] === '.' ? NOTE_PARTS[5].length:
                                                                      0;

    return {
      note: NOTE,
      duration: Rtttl._calculateDuration(BEAT_EVERY, parseFloat(NOTE_DURATION), NOTE_DOTS),
      frequency: Rtttl._calculateFrequency(NOTE, NOTE_OCTAVE)
    };
  });
}

/**
 * Calculate the frequency of a note
 *
 * @param {string} note
 * @param {number} octave
 * @returns {number}
 * @private
 */
static _calculateFrequency(note, octave) {

  if (note === 'p') {
    return 0;
  }

  const C4           = 261.63;
  const TWELFTH_ROOT = Math.pow(2, 1/12);
  const N            = Rtttl._calculateSemitonesFromC4(note, octave);
  const FREQUENCY    = C4 * Math.pow(TWELFTH_ROOT, N);

  return Math.round(FREQUENCY * 1e1) / 1e1;
}

static _calculateSemitonesFromC4(note, octave) {

  const NOTE_ORDER          = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
  const MIDDLE_OCTAVE       = 4;
  const SEMITONES_IN_OCTAVE = 12;

  const OCTAVE_JUMP = (octave - MIDDLE_OCTAVE) * SEMITONES_IN_OCTAVE;

  return NOTE_ORDER.indexOf(note) + OCTAVE_JUMP;

}

/**
 * Calculate the note name, given frequency of a note
 *
 * @param {number} octave
 * @returns {number}
 * @private
 */
static _calculateNoteNameFromFrequency(freq) {
    if (freq === 0) {
        return 'p'
    }

    const C4           = 261.63;
    const NOTE_ORDER          = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
    const SEMITONES_IN_OCTAVE = 12;
    const noteSemitones = Math.round(SEMITONES_IN_OCTAVE * Math.log2(freq/C4));
    const noteIndex = noteSemitones < 0 ? 12 + noteSemitones % SEMITONES_IN_OCTAVE
                                        : noteSemitones % SEMITONES_IN_OCTAVE;

    return NOTE_ORDER[noteIndex]
}

/**
 * Calculate the note octave, given frequency of a note
 *
 * @param {number} octave
 * @returns {number}
 * @private
 */
static _calculateNoteOctaveFromFrequency(freq) {
    if (freq === 0) {
        return 0
    }

    const C4           = 261.63;
    const MIDDLE_OCTAVE       = 4;
    const SEMITONES_IN_OCTAVE = 12;

    let noteSemitones = Math.round(SEMITONES_IN_OCTAVE * Math.log2(freq/C4))
    let noteOctave = MIDDLE_OCTAVE + Math.floor(noteSemitones/SEMITONES_IN_OCTAVE)

    return noteOctave
}

/**
 * Calculate the duration a note should be played
 *
 * @param {number} beatEvery
 * @param {number} noteDuration
 * @param {number} dots
 * @returns {number}
 * @private
 */
static _calculateDuration(beatEvery, noteDuration, dots) {
  const DURATION = (beatEvery * 4) / noteDuration;
  return DURATION*(dots === 4 ? 1.9375:
                   dots === 3 ? 1.875:
                   dots === 2 ? 1.75:
                   dots === 1 ? 1.5:
                                1
                   );
}

/**
 * Calculate the Bluejay Temp3 register value for a given sound frequency
 *
 * @param {freq} frequency
 * @returns {number}
 * @private
 */
static _calculateBluejayTemp3FromFrequency(freq) {
  return freq === 0 ? 0 : Math.round(1000000 / (freq * 24.72) - 399.3 / 24.72);
}

/**
 * Calculate the frequency given a Bluejay Temp3 register value
 *
 * @param {freq} frequency
 * @returns {number}
 * @private
 */
static _calculateFrequencyFromBluejayTemp3(temp3) {
  return temp3 === 0 ? 0 : 1000000 / (24.72 * temp3 + 399.3);
}

}

typeof module !== 'undefined'? module.exports = Rtttl : null;
