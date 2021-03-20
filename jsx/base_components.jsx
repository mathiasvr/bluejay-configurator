'use strict';

// todo: laziness...
function hacks (text) {
    return text.startsWith('_') ? text.slice(1) : chrome.i18n.getMessage(text)
}

var Checkbox = React.createClass({
    render: function() {
        return (
            <div className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        name={this.props.name}
                        checked={this.props.value === 1 ? true : false}
                        onChange={this.handleChange}
                    />
                    <span className={this.props.notInSync ? "not-in-sync" : ""}>{hacks(this.props.label)}</span>
                </label>
            </div>
        );
    },
    handleChange: function(e) {
        this.props.onChange(e.target.name, e.target.checked ? 1 : 0);
    }
});

var Select = React.createClass({
    render: function() {
        return (
            <div className="select">
                <label>
                    <select
                        name={this.props.name}
                        value={this.props.notInSync ? -1 : this.props.value}
                        onChange={this.handleChange}
                    >
                        <option className="hidden" disabled selected value="-1" />
                        {
                            this.props.options.map(option => <option value={option.value}>{option.label}</option>)
                        }
                    </select>
                    <span className={this.props.notInSync ? "not-in-sync" : ""}>{hacks(this.props.label)}</span>
                </label>
            </div>
        );

    },
    handleChange: function(e) {
        this.props.onChange(e.target.name, parseInt(e.target.value));
    }
});

var Number = React.createClass({
    render: function() {
        return (
            <div className="number">
                <label>
                    <InputRange
                        name={this.props.name}
                        step={this.props.step}
                        minValue={this.props.min}
                        maxValue={this.props.max}
                        value={this.props.notInSync ? null : this.getDisplayValue()}
                        labelSuffix={this.props.suffix}
                        onChange={this.handleChange}
                    />
                    <span className={this.props.notInSync ? "not-in-sync label" : "label"}>{hacks(this.props.label)}</span>
                </label>
            </div>
        );
    },
    handleChange: function(component, value) {
        if (this.props.offset || this.props.factor) {
            value = Math.floor((value - (this.props.offset || 0)) / (this.props.factor || 1));
        }

        this.props.onChange(component.props.name, value);
    },
    getDisplayValue: function() {
        let val = this.props.value || 0
        if (this.props.offset || this.props.factor) {
            val = (this.props.factor || 1) * val + (this.props.offset || 0);
        }
        if (this.props.round != null) {
            // TODO: Number() is overridden by React for some reason :(
            //val = this.props.round === 0 ? Math.round(val) : Number(val).toPrecision(this.props.round)
            val = Math.round(val)
        }
        return val;
    }
});

var Melody = React.createClass({
    getInitialState () {
        return {
            melody: null
        };
    },
    render: function() {
        //TODO: Disable Accept button when state.melody === null || state.melody === props.value

        return (
            <div className="melody">
                <label>
                    <span className={this.props.notInSync ? "not-in-sync label" : "label"}>{hacks(this.props.label)}</span>
                    <span className="btn melody_btn">
                        <a className={this.state.melody === null || this.state.melody === Rtttl.fromBluejayStartupMelody(this.props.value) ? "disabled" : ""}
                            href="#"
                            onClick={this.acceptMelody}
                        >
                            {chrome.i18n.getMessage('escButtonAccept')}
                        </a>
                    </span>
                    <span className="btn melody_btn">
                        <a
                            className={this.props.isPlayingAll || (!this.props.isPlaying && this.props.isPlayingAny) ? 'disabled' : ''}
                            href="#"
                            onClick={this.togglePlayMelody}
                        >
                            {(this.props.isPlaying && !this.props.isPlayingAll) ? chrome.i18n.getMessage('escButtonStop') : chrome.i18n.getMessage('escButtonPlay')}
                        </a>
                    </span>
                    <span className="btn melody_btn">
                        <a
                            className={(this.props.isPlaying && !this.props.isPlayingAll) || this.props.isPlayingAny ? 'disabled' : ''}
                            href="#"
                            onClick={this.togglePlayMelodyAll}
                        >
                            {(this.props.isPlayingAll) ? chrome.i18n.getMessage('escButtonStop') : chrome.i18n.getMessage('escButtonPlayAll')}
                        </a>
                    </span>
                    <textarea
                        name={this.props.name}
                        value={this.getDisplayValue()}
                        onChange={this.handleChange}
                    />
                </label>
            </div>
        );
    },
    handleChange: function(e) {
        this.setState({melody: e.target.value})
    },
    getDisplayValue: function() {
        return this.state.melody === null ? Rtttl.fromBluejayStartupMelody(this.props.value) : this.state.melody;
    },
    acceptMelody: function() {

        try {
            // Little Easter egg
            let melody = this.state.melody === null ? Rtttl.fromBluejayStartupMelody(this.props.value) : this.state.melody
            melody = melody.trim() === ":D"
                     ? "D:d=4,o=5,b=110:32c,8d.,16f.,16p.,8f,32d,16e.,8d,8c,8a4,8d.,16g.,16p.,8g"
                     : melody
            let startupMelody = Rtttl.toBluejayStartupMelody(melody, this.props.melodyLength)
            var self = this
            // Update the displayValue so we are looking at the accepted melody
            this.setState({melody: Rtttl.fromBluejayStartupMelody(startupMelody)}, function(){
                self.props.onChange(self.props.name, startupMelody);
            })
        } catch (err) {
            alert(err)
        }
    },
    togglePlayMelodyAll: function() {
        this.props.onPlayAll();
    },
    togglePlayMelody: function() {
        this.props.onPlay();
    }
});
