'use strict';


// unstable layout and settings during beta
var BLUEJAY_SETTINGS_DESCRIPTIONS = {
    // todo: remove multi
    '200': { // v0.9
        MULTI: {
            base:
            [
                {
                    name: 'STARTUP_POWER', type: 'enum', options: [
                        { value:  '1', label: '0.5% (0.031)' },
                        // { value:  '2', label: '0.8% (0.047)' }, { value:  '3', label: '1.2% (0.063)' },
                        // { value:  '4', label: '1.6% (0.094)' }, { value:  '5', label: '2.5% (0.125)' },
                        // { value:  '6', label: '3.5% (0.188)' },
                        { value:  '7', label:   '5%  (0.25)' }, { value:  '8', label:   '7%  (0.38)' },
                        { value:  '9', label:  '10%  (0.50)' }, { value: '10', label:  '15%  (0.75)' },
                        { value: '11', label:  '20%  (1.00)' }, { value: '12', label:  '24%  (1.25)' },
                        { value: '13', label:  '29%  (1.50)' }
                    ],
                    label: 'escRampupPower'
                },
                {
                    name: 'STARTUP_BOOST', type: 'number',label: 'escStartupBoost', 
                    min: 1000, max: 1125, step: 5, displayFactor: 1000 / 2047, displayOffset: 1000
                },
                {
                    name: 'TEMPERATURE_PROTECTION', type: 'enum', label: 'escTemperatureProtection',
                    options: [
                        { value: '0', label: 'Disabled' }, { value: '1', label: '80 C' },
                        { value: '2', label: '90 C' }, { value: '3', label: '100 C' },
                        { value: '4', label: '110 C' }, { value: '5', label: '120 C' },
                        { value: '6', label: '130 C' }, { value: '7', label: '140 C' }
                    ]
                },
                {
                    name: 'LOW_RPM_POWER_PROTECTION', type: 'bool', label: 'escLowRPMPowerProtection'
                },
                {
                    name: 'BRAKE_ON_STOP', type: 'bool', label: 'escBrakeOnStop'
                },
                {
                    name: 'DEMAG_COMPENSATION', type: 'enum', label: 'escDemagCompensation',
                    options: [
                        { value: '1', label: 'Off' }, { value: '2', label: 'Low' },
                        { value: '3', label: 'High' }
                    ]
                },
                {
                    name: 'COMMUTATION_TIMING', type: 'enum', label: 'escMotorTiming',
                    options: [
                        { value: '1', label: '0° (Low)' }, { value: '2', label: '7.5° (MediumLow)' },
                        { value: '3', label: '15° (Medium)' }, { value: '4', label: '22.5° (MediumHigh)' },
                        { value: '5', label: '30° (High)' }
                    ]
                },
                {
                    name: 'BEEP_STRENGTH', type: 'number', min: 0, max: 255, step: 1, label: 'escBeepStrength'
                },
                {
                    name: 'BEACON_STRENGTH', type: 'number', min: 0, max: 255, step: 1, label: 'escBeaconStrength'
                },
                {
                    name: 'BEACON_DELAY', type: 'enum', label: 'escBeaconDelay',
                    options: [
                        { value: '1', label: '1 minute' }, { value: '2', label: '2 minutes' },
                        { value: '3', label: '5 minutes' }, { value: '4', label: '10 minutes' },
                        { value: '5', label: 'Infinite' }
                    ]
                },
                {
                    name: 'STARTUP_BEEP', type: 'bool', label: 'escStartupBeep'
                },
                {
                    name: 'DITHERING', type: 'bool', label: 'escDithering'
                },
            ]
        }
    },
    // BLHeli_S
    '33': {
        MULTI: {
            base: BLHELI_S_SETTINGS_LAYOUT_33
        },
        // There is no MAIN nor MULTI mode in BLHeli_S, added for completeness
        MAIN: {
            base: []
        },
        TAIL: {
            base: []
        }
    },
};

var BLUEJAY_INDIVIDUAL_SETTINGS = [
    {
        name: 'MOTOR_DIRECTION', type: 'enum', label: 'escMotorDirection',
        options: [
            { value: '1', label: 'Normal' }, { value: '2', label: 'Reversed' },
            { value: '3', label: 'Bidirectional' }, { value: '4', label: 'Bidirectional Reversed' }
        ]
    },
];

var BLUEJAY_INDIVIDUAL_SETTINGS_DESCRIPTIONS = {
    '200': {
        base: BLUEJAY_INDIVIDUAL_SETTINGS
    },
    '33': {
        base: BLHELI_S_INDIVIDUAL_SETTINGS
    }
};
