NUM_SYMBOLS = 6;
NUM_FIELDS = 4;

SYMBOLS = ["A", "B", "C", "D", "E", "F"];

var testCode = function (combination, solution) {
  var a = 0;
  var b = 0;
  var marked = [0, 0, 0, 0];
  for (var i = 0; i < NUM_FIELDS; i++) {
    if (combination[i] == solution[i]) {
      a++;
      marked[i] = 1;
    }
  }
  for (var i = 0; i < NUM_FIELDS; i++) {
    if (combination[i] != solution[i]) {
      for (var j = 0; j < NUM_FIELDS; j++) {
        if (i != j && 0 == marked[j] && combination[i] == solution[j]) {
          b++;
          marked[j] = 1;
          break;
        }
      }
    }
  }
  return [a, b];
};

function chooseNextGuess(eligible) {
  var max = 0;
  var nextGuess = eligible[0];
  for (var i in eligible) {
    var sum = 0;
    var searchSpace = _.without(eligible, eligible[i]);
    for (var j in searchSpace) {
      var testResponse = testCode(
        eligible[i].split(""),
        searchSpace[j].split("")
      );
      var remainingCodes = _.without(searchSpace, searchSpace[j]);
      for (var k in remainingCodes) {
        var subResponse = testCode(
          remainingCodes[k].split(""),
          searchSpace[j].split("")
        );
        if (testResponse.join("") != subResponse.join("")) {
          sum++;
        }
      }
    }
    if (sum > max) {
      max = sum;
      nextGuess = eligible[i];
    }
  }
  return nextGuess.split("");
}

function showPegs(code) {
  var testResponse = game.testCombination(code);
  var testTableSelector = $(".test-table-" + previousGuesses.length);
  var td = 0;
  for (; td < testResponse[0]; td++) {
    testTableSelector.find("#tcol-" + td).addClass("red-peg");
  }
  for (; td < testResponse[0] + testResponse[1]; td++) {
    testTableSelector.find("#tcol-" + td).addClass("yellow-peg");
  }
  if (
    testResponse[0] == NUM_FIELDS ||
    previousGuesses.length == 6 ||
    (gameMode == GAME_MODE_1 && previousGuesses.length == 5)
  ) {
    $("[class*='go-btn']").addClass("disabled");
    displayGameSolution();
    return true;
  }
  return false;
}

function diplayGuess(code) {
  var rowSelector = $(".guess-row-" + previousGuesses.length);
  var i = 0;
  var fn = function (callback) {
    rowSelector
      .find(".sym-col:nth-child(" + (i + 1) + ")")
      .addClass("sym-bg")
      .hide()
      .addClass("sym-" + code[i])
      .fadeIn(280);
    if (++i < code.length) {
      setTimeout(function () {
        fn(callback);
      }, 280);
    } else {
      callback();
    }
  };
  fn(function () {
    if (gameMode == GAME_MODE_3) {
      showPegs(code);
    }
  });
}

var allCodes = [];
variations(SYMBOLS, NUM_FIELDS, [], allCodes);

var game, aiGuess, population, eligibleSet;
var gameMode, previousGuesses, playerCode;

GAME_MODE_1 = 1;
GAME_MODE_2 = 2;
GAME_MODE_3 = 3;

function variations(symbols, depth, variation, results) {
  if (depth > 0) {
    for (var i = 0; i < symbols.length; i++) {
      var newBranch = variation.slice();
      newBranch.push(symbols[i]);
      variations(symbols, depth - 1, newBranch, results);
    }
  } else {
    results.push(variation.join(""));
  }
}

function Mastermind() {
  this.solution = [];
  this.newGame();
}
Mastermind.prototype.newGame = function () {
  for (var i = 0; i < NUM_FIELDS; i++) {
    this.solution[i] = SYMBOLS[Math.floor(Math.random() * NUM_SYMBOLS)];
  }
};
Mastermind.prototype.testCombination = function (combination) {
  return testCode(combination, this.solution);
};

startNewGame();

function startNewGame() {
  initGameVariables();
  cleanUpPlayground();
  if (gameMode != GAME_MODE_1) {
    diplayGuess(aiGuess);
    $(".go-btn-5").hide();
  } else {
    $(".go-btn-5").show();
  }
}

function initGameVariables() {
  game = new Mastermind();
  aiGuess = _.sample(allCodes);
  //population = new Population(POPULATION_SIZE);
  eligibleSet = [];
  gameMode = parseInt($("#mode-select").val());
  playerCode = [0, 0, 0, 0];
  previousGuesses = [];
  console.log(game.solution);
}

function getNumberFromClass(classAttr, prefix) {
  var startIndex = classAttr.indexOf(prefix);
  if (startIndex != -1) {
    return parseInt(classAttr.charAt(startIndex + prefix.length));
  }
  return NaN;
}

function cleanUpPlayground() {
  $("[class*='go-btn']").addClass("disabled").show();
  $(".go-btn-0").removeClass("disabled");
  $(".sym-col").each(function () {
    if (!$(this).is("[class*='secret-block']")) {
      var prefix = "block-";
      var blockNumber = getNumberFromClass($(this).attr("class"), prefix);
      $(this).attr("class", "sym-col " + prefix + blockNumber);
    }
  });
  $(".test-col").removeClass("red-peg").removeClass("yellow-peg");
  $(".loader-col img").hide();
  clearSolutionBoxes();
}

$(".new-game").click(function () {
  startNewGame();
});

function playNextGuess(blackNum, whiteNum) {
  console.log(blackNum, whiteNum);
  previousGuesses.push({ code: aiGuess, x: blackNum, y: whiteNum });
  if (blackNum == NUM_FIELDS) {
    alert("Win!");
    return;
  }
  eligibleSet = [];
  var genNum = 0;
  population.generation(previousGuesses, eligibleSet, MAXGEN, function () {
    if (eligibleSet.length > 0) {
      aiGuess = chooseNextGuess(eligibleSet);
      diplayGuess(aiGuess);
      $("#loader-" + (previousGuesses.length - 1)).hide();
      $(".go-btn-" + previousGuesses.length).removeClass("disabled");
    } else {
      alert("Lose!");
    }
    $("#loader").hide();
  });
}

$(".test-col").click(function () {
  if (gameMode == GAME_MODE_2) {
    if ($(this).hasClass("red-peg")) {
      $(this).removeClass("red-peg");
    } else if ($(this).hasClass("yellow-peg")) {
      $(this).removeClass("yellow-peg");
      $(this).addClass("red-peg");
    } else {
      $(this).addClass("yellow-peg");
    }
  }
});

function countTestResponse() {
  var red = 0,
    yellow = 0;
  var responseSelector = $(".test-table-" + previousGuesses.length + " td");
  responseSelector.each(function () {
    var that = $(this);
    if (that.hasClass("red-peg")) {
      red++;
    } else if (that.hasClass("yellow-peg")) {
      yellow++;
    }
  });
  return { a: red, b: yellow };
}

function displayGameSolution() {
  for (var i in game.solution) {
    var fieldSelect = $(".secret-block-" + i);
    fieldSelect.removeClass("secret-sym").addClass("sym-" + game.solution[i]);
  }
}

function clearSolutionBoxes() {
  $("[class*='secret-block']").each(function () {
    var newClass =
      $(this).attr("class").split(" ").slice(0, 2).join(" ") + " secret-sym";
    $(this).attr("class", newClass);
  });
}

$("[class*='go-btn']").click(function () {
  if (gameMode != GAME_MODE_1) {
    var response = countTestResponse();
    $(this).hide();
    $("#loader-" + previousGuesses.length).show();
    playNextGuess(response.a, response.b);
  } else {
    if (playerCode.indexOf(0) == -1) {
      var over = showPegs(playerCode);
      $(this).hide();
      previousGuesses.push(playerCode);
      playerCode = [0, 0, 0, 0];
      if (!over) {
        $(".go-btn-" + previousGuesses.length).removeClass("disabled");
      }
    }
  }
});

$("[class^='option-col']").click(function () {
  if (gameMode == GAME_MODE_1) {
    var symbolClass = $(this).attr("class").split(" ")[1];
    var firstPosition = playerCode.indexOf(0);
    if (firstPosition != -1) {
      $(".guess-row-" + previousGuesses.length)
        .find(".sym-col:nth-child(" + (firstPosition + 1) + ")")
        .addClass("sym-bg")
        .hide()
        .addClass(symbolClass)
        .fadeIn(200);
      var symbolValue = symbolClass.substr(4, 1);
      playerCode[firstPosition] = symbolValue;
    }
  }
});

$(".sym-col").click(function () {
  if (gameMode == GAME_MODE_1) {
    var blockNumber = getNumberFromClass($(this).attr("class"), "block-");
    playerCode[blockNumber] = 0;
    $(this).attr("class", "sym-col block-" + blockNumber);
  }
});
