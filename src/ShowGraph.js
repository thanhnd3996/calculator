import React, {Component} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from 'victory-native';

class ShowGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coord: this.props.route.params.coord,
    };
  }

  // componentDidMount() {
  //   this.setState({
  //     coord: this.props.route.params.coord,
  //   });
  // }

  render() {
    console.log(this.state.coord);
    return (
      <View style={styles.container}>
        <VictoryChart width={350} theme={VictoryTheme.material}>
          <VictoryLine
            interpolation="monotoneX"
            style={{
              data: {stroke: '#c43a31'},
            }}
            data={this.state.coord}></VictoryLine>
          <VictoryScatter
            data={this.state.coord}
            size={5}
            style={{data: {fill: '#c43a31'}}}></VictoryScatter>
        </VictoryChart>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
});

export default ShowGraph;
