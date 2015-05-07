'use strict';

var _ = require('underscore');

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} = React;

var MathFactsStore = require('../stores/MathFactsStore');
var MathFactsActions = require('../actions/MathFactsActions');

var StateFromStoreMixin = require("../lib/state-from-store-mixin.js");

var Quizzer = require('./Quizzer.ios');
var Stats = require('./Stats.ios');

var Button = React.createClass({
  defaultProps: {
    small: React.PropTypes.bool,
    color: React.PropTypes.string,
    text: React.PropTypes.string,
  },
  render: function() {
    var color = this.props.color ? this.props.color : '#89dacc';

    var buttonTextStyle = styles.buttonText;
    if (this.props.small) {
      buttonTextStyle = [buttonTextStyle, { fontSize: 20 }];
    }

    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        underlayColor="transparent"
        activeOpacity={0.5}>
        <View style={[styles.button, { backgroundColor: color }]}>
          <Text style={buttonTextStyle}>{this.props.text}</Text>
        </View>
      </TouchableHighlight>
    );
  }
});

var MathFactsApp = React.createClass({
  mixins: [
    StateFromStoreMixin({
      quizzesData: {
        store: MathFactsStore,
        fetch: (store) => {
          var allFacts = store.getAll();
          return allFacts;
        }
      }
    })
  ],
  getInitialState: function() {
    return {
      playing: false,
      showStats: false,
      operation: 'addition'
    };
  },
  startGame: function() {
    this.setState({
      playing: true
    });
  },
  showStats: function() {
    this.setState({
      showStats: true
    });
  },
  showMenu: function() {
    this.setState({
      playing: false,
      showStats: false,
    });
  },
  finish: function(quizData) {
    var operation = this.state.operation;
    _.each(quizData, (questionData) => {
      MathFactsActions.addAttempts(operation, [questionData]);
    });

    this.setState({
      playing: false,
    });
  },
  addFactAttempt: function() {
    var newData = _.clone(this.state.data);

  },
  componentDidMount: function() {
    MathFactsActions.initializeData();
  },
  setAdditionoperation: function() {
    this.setState({operation: 'addition'});
  },
  setMultiplicationoperation: function() {
    this.setState({operation: 'multiplication'});
  },
  _renderHomeScreen: function() {
    var operation = this.state.operation;
    return (
      <View style={styles.container}>
        <Button text="Play" onPress={this.startGame} />
        <Button text="Stats" onPress={this.showStats} />
        <View style={styles.toggleButtons}>
          <Button
            text="Addition"
            color={operation === 'addition' ? "#666" : "#ccc"}
            small={true}
            onPress={this.setAdditionoperation}/>
          <Button
            text="Multiplication"
            color={operation === 'multiplication' ? "#666" : "#ccc"}
            small={true}
            onPress={this.setMultiplicationoperation}/>
        </View>
      </View>
    );
  },
  render: function() {
    var operation = this.state.operation;
    return (
      <View style={styles.appWrapper}>
        {this.state.playing &&
          <Quizzer
            operation={operation}
            back={this.showMenu}
            finish={this.finish}
            mode={'time'}
            seconds={3}
            count={10}/>
        }
        {this.state.showStats &&
          <Stats
            operation={operation}
            back={this.showMenu}
            quizzesData={this.state.quizzesData[operation]}/>
        }
        {!this.state.playing && !this.state.showStats &&
          this._renderHomeScreen()
        }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  appWrapper: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingTop: 20
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },

  button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#89dacc",
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 30,
    color: '#fff'
  },

  toggleButtons: {
    flexDirection: 'row',
    justifyContent: 'center'
  }

});

module.exports = MathFactsApp;