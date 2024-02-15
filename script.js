const buttons = document.querySelectorAll(".btn");
var screen = document.getElementById("screen");
var expression;
const copyContent = async () => {
  try {
    await navigator.clipboard.writeText(screen.innerHTML);
    console.log("Content copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

function evaluate(expression) {
  let tokens = expression.split("");

  // Stack for numbers: 'values'
  let values = [];

  // Stack for Operators: 'ops'
  let ops = [];

  for (let i = 0; i < tokens.length; i++) {
    // Current token is a whitespace, skip it
    if (tokens[i] == " ") {
      continue;
    }

    // Current token is a number,
    // push it to stack for numbers
    if (tokens[i] >= "0" && tokens[i] <= "9") {
      let sbuf = "";

      // There may be more than
      // one digits in number
      while (i < tokens.length && tokens[i] >= "0" && tokens[i] <= "9") {
        sbuf = sbuf + tokens[i++];
      }
      values.push(parseInt(sbuf, 10));

      // Right now the i points to
      // the character next to the digit,
      // since the for loop also increases
      // the i, we would skip one
      //  token position; we need to
      // decrease the value of i by 1 to
      // correct the offset.
      i--;
    }

    // Current token is an opening
    // brace, push it to 'ops'
    else if (tokens[i] == "(") {
      ops.push(tokens[i]);
    }

    // Closing brace encountered,
    // solve entire brace
    else if (tokens[i] == ")") {
      while (ops[ops.length - 1] != "(") {
        values.push(applyOp(ops.pop(), values.pop(), values.pop()));
      }
      ops.pop();
    }

    // Current token is an operator.
    else if (
      tokens[i] == "+" ||
      tokens[i] == "-" ||
      tokens[i] == "*" ||
      tokens[i] == "/"
    ) {
      // While top of 'ops' has same
      // or greater precedence to current
      // token, which is an operator.
      // Apply operator on top of 'ops'
      // to top two elements in values stack
      while (ops.length > 0 && hasPrecedence(tokens[i], ops[ops.length - 1])) {
        values.push(applyOp(ops.pop(), values.pop(), values.pop()));
      }

      // Push current token to 'ops'.
      ops.push(tokens[i]);
    }
  }

  // Entire expression has been
  // parsed at this point, apply remaining
  // ops to remaining values
  while (ops.length > 0) {
    values.push(applyOp(ops.pop(), values.pop(), values.pop()));
  }
  return values.pop();
}

function hasPrecedence(op1, op2) {
  if (op2 == "(" || op2 == ")") {
    return false;
  }
  if ((op1 == "*" || op1 == "/") && (op2 == "+" || op2 == "-")) {
    return false;
  } else {
    return true;
  }
}
function applyOp(op, b, a) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b == 0) {
        document.write("Cannot divide by zero");
      }
      return parseInt(a / b, 10);
  }
  return 0;
}
var count = 0;
var anss = 0;
buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    var val = button.textContent;
    if (button == screen) {
      console.log("Screen");
      copyContent();
    }
    if (val === "eql") {
      console.log("it is eql");
      console.log(expression);
      const ans = evaluate(expression);
      console.log(ans);
      screen.textContent = ans;
      anss = 1;
      //count = 0;
    } else if (count === 0) {
      screen.textContent = val;
      expression = expression + val;
      count++;
    } else if (val != "eql") {
      screen.innerHTML = screen.innerHTML + val;
      expression = expression + val;
    }
    if (val === "C") {
      screen.textContent = "0";
      count = 0;
      expression = "";
      anss = 0;
      console.log(expression);
    }
    if (anss) {
      if (val >= 0 && val <= 9) {
        setTimeout(function () {
          screen.textContent = "0";
        }, 100);
        count = 0;
        expression = "";
        setTimeout(1000);
        screen.textContent = "Cant do it";
        anss = 0;
      } else {
        anss = 0;
      }
    }
  });
});

document.addEventListener("keydown", function (e) {
  const key = e.key;
  const button = this.getElementById("screen");
  if (
    (key >= 0 && key <= 9) ||
    key == "+" ||
    key == "-" ||
    key == "*" ||
    key == "/" ||
    key == "=" ||
    key == "Enter" ||
    key == "c"
  ) {
    if (key === "=" || key === "Enter") {
      console.log("it is eql");
      console.log(expression);
      const ans = evaluate(expression);
      console.log(ans);
      button.textContent = ans;
      anss = 1;
      //count = 0;
    } else if (count === 0) {
      button.textContent = key;
      expression = expression + key;
      count++;
    } else if (key != "=") {
      console.log(key);
      button.innerHTML = button.innerHTML + key;
      expression = expression + key;
    } else if (anss) {
      if (key >= 0 && key <= 9) {
        setTimeout(function () {
          screen.textContent = "0";
        }, 100);
        count = 0;
        expression = "";
        setTimeout(1000);
        screen.textContent = "Cant do it";
        anss = 0;
      }
    }else if (key === "c") {
      screen.textContent = "0";
      count = 0;
      expression = "";
      anss = 0;
      console.log(expression);
    }
  }
});
