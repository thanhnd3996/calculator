import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resultText: '', // bieu thuc nhap vao
      calculationText: '', // ket qua sau tinh toan
    };
    this.operations = [
      ['+', '-'],
      ['*', '/'],
      ['(', ')'],
      ['^', 'DEL'],
    ];
  }

  validate() {
    // kiem tra bieu thuc hop le
    // neu bieu thuc ket thuc la 1 toan tu -> false
    const text = this.state.resultText;
    switch (text.slice(-1)) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '^':
        return false;
    }
    return true;
  }

  buttonPressed(text) {
    // nhap toan hang va in ra man hinh result text
    // =: in ra ket qua calculation text
    // graph: tinh dao ham bac 1, bac 2, ve do thi
    console.log(text);
    if (text == '=') {
      return this.validate() && this.caculateFromRPN(this.shuntingYard());
    }
    if (text == 'graph') {
      return this.props.navigation.navigate('Graph', {
        expression: this.state.resultText,
      });
    }
    this.setState({
      resultText: this.state.resultText + text,
    });
  }

  operate(operation) {
    // in toan tu va xoa bieu thuc
    // DEL: xoa bieu thuc
    // +-*/^ : in ra man hinh resultText
    switch (operation) {
      case 'DEL':
        let text = this.state.resultText.split('');
        text.pop();
        this.setState({
          resultText: text.join(''),
        });
        break;
      case '+':
      case '-':
      case '*':
      case '/':
      case '(':
      case ')':
      case '^':
        console.log(operation);
        this.setState({
          resultText: this.state.resultText + operation,
        });
    }
  }

  definePrecedence(op) {
    // set thu tu thuc thi cua toan tu
    // () ^ */ +-
    switch (op) {
      case '+':
      case '-':
        return 0;
      case '/':
      case '*':
        return 1;
      case '^':
        return 2;
      case '(':
      case ')':
        return 3;
    }
  }

  shuntingYard() {
    // convert infix notation to postfix notation
    // using shunting yard algorithm
    operatorStack = [];
    outputQueue = [];
    flag = 0;

    input = this.state.resultText.split('');
    for (let i = 0; i < input.length; i++) {
      if (input[i].match(/[0-9]/)) {
        outputQueue.unshift(input[i]);
      } else if (input[i].match(/[\+\-\*\/\^]/)) {
        if (
          operatorStack.length > 0 &&
          this.definePrecedence(input[i]) -
            this.definePrecedence(operatorStack[flag]) <=
            0
        ) {
          outputQueue.unshift(operatorStack.pop());
          operatorStack.push(input[i]);
        }
        operatorStack.push(input[i]);
        flag++;
      } else if (input[i] === '(') {
        operatorStack.push(input[i]);
        flag++;
      } else if (input[i] === ')') {
        for (let j = flag - 1; j >= 0; j--) {
          if (operatorStack[j] != '(') {
            outputQueue.unshift(operatorStack.pop());
            flag--;
          } else {
            operatorStack.pop();
            flag--;
            break;
          }
        }
      }
    }
    while (operatorStack.length > 0) {
      outputQueue.unshift(operatorStack.pop());
    }
    console.log(outputQueue);
    return outputQueue.reverse();
  }

  caculateFromRPN(postfix) {
    // eval the postfix notation
    // postfix: postfix notataion return from shuntingYard()
    var resultStack = [];
    console.log(postfix);
    for (var i = 0; i < postfix.length; i++) {
      if (postfix[i].match(/[0-9]/)) {
        resultStack.push(postfix[i]);
      } else {
        var a = resultStack.pop();
        var b = resultStack.pop();
        if (postfix[i] === '+') {
          resultStack.push(parseInt(a) + parseInt(b));
        } else if (postfix[i] === '-') {
          resultStack.push(parseInt(b) - parseInt(a));
        } else if (postfix[i] === '*') {
          resultStack.push(parseInt(a) * parseInt(b));
        } else if (postfix[i] === '/') {
          resultStack.push(parseInt(b) / parseInt(a));
        } else if (postfix[i] === '^') {
          resultStack.push(parseInt(b) ** parseInt(a));
        }
      }
    }
    if (resultStack.length > 1) {
      return 'error';
    }
    this.setState({
      calculationText: resultStack.pop(),
    });
  }

  render() {
    let rows = [];
    let nums = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      ['.', 0, '='],
      ['X^', 'Y', 'graph'],
    ];
    for (let i = 0; i < 5; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        row.push(
          <TouchableOpacity key={nums[i][j]} style={styles.btn}>
            <Text
              onPress={() => this.buttonPressed(nums[i][j])}
              style={styles.btntext}>
              {nums[i][j]}
            </Text>
          </TouchableOpacity>,
        );
      }
      rows.push(
        <View key={i} style={styles.row}>
          {row}
        </View>,
      );
    }

    let ops = [];
    for (let i = 0; i < 4; i++) {
      let op = [];
      for (let j = 0; j < 2; j++) {
        op.push(
          <TouchableOpacity key={this.operations[i][j]} style={styles.btn}>
            <Text
              onPress={() => this.operate(this.operations[i][j])}
              style={[styles.btntext, styles.white]}>
              {this.operations[i][j]}
            </Text>
          </TouchableOpacity>,
        );
      }
      ops.push(
        <View key={i} style={styles.row}>
          {op}
        </View>,
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.result}>
          <Text style={styles.resultText}>{this.state.resultText}</Text>
        </View>
        <View style={styles.calculation}>
          <Text style={styles.calculationText}>
            {this.state.calculationText}
          </Text>
        </View>
        <View style={styles.buttons}>
          <View style={styles.numbers}>{rows}</View>
          <View style={styles.operations}>{ops}</View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btntext: {
    fontSize: 25,
  },
  white: {
    color: 'white',
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  calculationText: {
    fontSize: 30,
    color: 'white',
  },
  resultText: {
    fontSize: 50,
    color: 'white',
  },
  result: {
    flex: 2,
    backgroundColor: '#8bc2f9',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  calculation: {
    flex: 1,
    backgroundColor: '#4ba0f4',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buttons: {
    flex: 7,
    flexDirection: 'row',
  },
  numbers: {
    flex: 3,
    backgroundColor: '#82868c',
  },
  operations: {
    flex: 2,
    backgroundColor: '#b8babc',
  },
});

export default Calculator;
