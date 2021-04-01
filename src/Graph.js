import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import algebra from 'algebra.js';

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expression: '',
      firstOrderDxy: '',
      secondOrderDxy: '',
      labels: [-2, -1, 0, 1, 2],
      data: [],
    };
  }

  componentDidMount() {
    expr = this.props.route.params.expression;
    dxy = this.derivative(expr);
    d2xy = this.derivative(dxy);

    this.setState({
      expression: expr,
      firstOrderDxy: dxy,
      secondOrderDxy: d2xy,
    });
  }

  isNumeric(n) {
    // kiem tra bieu thuc co phai la so thuc hay khong
    // n : bieu thuc can kiem tra
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  derivative(expr) {
    // tinh dao ham
    // expr: bieu thuc can tinh dao ham
    let ans = [];
    expr = expr.toString().split('-');
    expr = expr.join('+-');
    monomials = expr.toString().split('+');
    for (let i = 0; i < monomials.length; i++) {
      if (this.isNumeric(monomials[i])) {
        continue;
      }
      let index = monomials[i].split('X^');
      if (index[1] == 1) {
        ans.push(index[0]);
      } else {
        ans.push(index[0] * index[1] + 'X^' + (index[1] - 1));
      }
    }
    ans = ans.join('+');
    ans = ans.split('+-');
    ans = ans.join('-');
    return ans;
  }

  exEquation(expr) {
    // tinh gia tri toa do
    // expr: phuong trinh fx=0, dxy=0
    expr = expr.split('+-');
    expr = expr.join('-');
    if (this.isNumeric(expr)) {
      console.log('phuong trinh khong hop le');
    } else {
      var eq = new algebra.parse(expr + '=0');
      console.log(eq.toString());
      let ans = eq.solveFor('X');
      if (typeof ans === 'undefined') {
        console.log('No is undefined');
      } else {
        ans = ans.toString().split(',');
        for (let i = 0; i < ans.length; i++) {
          if (ans[i].match(/\//)) {
            let label = ans[i].split('/');
            this.state.labels.push(label[0] / label[1]);
          } else if (ans[i] == '') {
            continue;
          } else {
            this.state.labels.push(ans[i]);
          }
        }
      }
    }
  }

  calculateY() {
    let label = this.state.labels;
    let expr = this.state.expression;
    expr = expr.split('-');
    expr = expr.join('+-');
    expr = expr.split('+');
    for (let i = 0; i < label.length; i++) {
      let val = 0;
      for (let j = 0; j < expr.length; j++) {
        if (this.isNumeric(expr[j])) {
          val += parseFloat(expr[j]);
        } else {
          let index = expr[j].split('X^');
          val += parseFloat(index[0] * label[i] ** index[1]);
        }
      }
      this.state.data.push(val);
    }
  }

  createObject() {
    // create object from lebels, data
    labels = this.state.labels;
    data = this.state.data;
    coordinates = [];
    for (let i = 0; i < labels.length; i++) {
      coordinate = {};
      coordinate.x = labels[i];
      coordinate.y = data[i];
      coordinates.push(coordinate);
    }
    return coordinates;
  }

  checkDuplicate(coordinates) {
    //check duplicate coordinates
    tmp = [];
    tmp.push(coordinates[0]);
    flag = 0;
    for (let i = 1; i < coordinates.length; i++) {
      if (coordinates[i].x == tmp[flag].x) {
        continue;
      } else {
        tmp.push(coordinates[i]);
        flag++;
      }
    }
    return tmp;
  }

  showGraph() {
    // tinh nghiem dxy
    // them vao mang coordinate
    // sort by x
    // checkduplicate
    // truyen sang ShowGraph

    this.exEquation(this.state.firstOrderDxy);
    this.calculateY();
    coordinates = this.createObject();
    coordinates.sort((a, b) => (a.x > b.x ? 1 : -1)); // sort by x
    coordinates = this.checkDuplicate(coordinates);

    return this.props.navigation.navigate('ShowGraph', {
      coord: coordinates,
    });
  }

  render() {
    return (
      <View>
        <Text>{' Y = ' + this.state.expression}</Text>
        <Text>{' Dxy = ' + this.state.firstOrderDxy}</Text>
        <Text>{' D2xy = ' + this.state.secondOrderDxy}</Text>
        <TouchableOpacity>
          <Text onPress={() => this.showGraph()}>SHOW GRAPH</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Graph;
