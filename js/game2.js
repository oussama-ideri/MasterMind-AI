GAME_MODE_HUMAN = 1;
GAME_MODE_AI = 2;

NUM_SYMBOLS = 6;
SYMBOLS = ["A", "B", "C", "D", "E", "F"];

MUTATION_PROBABILITY = 0.2;
PERMUTATION_PROBABILITY = 0.1;
INVERSION_PROBABILITY = 0.05;

MAXGEN = 250;
POPULATION_SIZE = 150;
SET_SIZE = 110;
FIT_A = 1;
FIT_B = 2;

var secretLenght;
var allCodes = [];

function shouldDo(probability) {
  if (Math.random() <= probability) {
    return true;
  }
  return false;
}

function getCrossoverPoint(length) {
  // Math.floor(x) renvoie le plus grand entier qui est inférieur ou égal à un nombre x
  return Math.floor(Math.random() * (length - 2) + 1);
}

function check(probability, toRepeat) {
  // toRepeat est le nbr de repetition
  var total = toRepeat;
  var count = 0;
  while (total--) {
    if (shouldDo(probability))
      // count est le nbr de fois Math.random() a generer un nbr plus grand que probability
      count++;
  }
  // toFixed() permet de formater un nombre en notation à point-fixe. (1.9040) -> (1.90)
  return (count / toRepeat).toFixed(2);
}

function Combination(code) {
  this.code = _.isString(code) ? code.split("") : code;
  this.fitness = 0;
  this.eligible = false;
}

Combination.prototype.crossover = function (other) {
  var crossoverPoint = getCrossoverPoint(this.code.length);
  var firstChild = this.code
    .slice(0, crossoverPoint)
    .concat(other.code.slice(crossoverPoint));
  var secondChild = other.code
    .slice(0, crossoverPoint)
    .concat(this.code.slice(crossoverPoint));
  return [new Combination(firstChild), new Combination(secondChild)];
};

Combination.prototype.mutate = function () {
  var position = Math.floor(Math.random() * secretLenght);
  var newValue = _.sample(_.without(SYMBOLS, this.code[position]));
  this.code[position] = newValue;
};

Combination.prototype.permutate = function () {
  var positions = _.range(secretLenght);
  var toPermute = _.sample(positions, 2);
  this.code[toPermute[1]] = [
    this.code[toPermute[0]],
    (this.code[toPermute[0]] = this.code[toPermute[1]]),
  ][0];
};

Combination.prototype.inverse = function () {
  this.code.reverse();
};

Combination.prototype.getCodeString = function () {
  return this.code.join("");
};

Combination.prototype.calculateFitness = function (prevGuesses) {
  var xDifference = 0;
  var yDifference = 0;
  var slickValue = 0;
  for (var i in prevGuesses) {
    var testResponse = testCode(this.code, prevGuesses[i].code);
    xDifference += Math.abs(testResponse[0] - prevGuesses[i].x);
    yDifference += Math.abs(testResponse[1] - prevGuesses[i].y);
    slickValue += parseInt(i);
  }
  if (xDifference === 0 && yDifference === 0) {
    this.eligible = true;
  }
  this.fitness =
    FIT_A * xDifference + yDifference + FIT_B * secretLenght * slickValue;
};

function variations(symbols, depth, variation, results) {
  // la fct va étre appler depth fois càd le tableau newBranch va étre remplie
  //
  if (depth > 0) {
    for (var i = 0; i < symbols.length; i++) {
      var newBranch = variation.slice(); // newBranch va étre un tableau vide -> []
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
  for (var i = 0; i < secretLenght; i++) {
    this.solution[i] = SYMBOLS[Math.floor(Math.random() * NUM_SYMBOLS)];
  }
};

Mastermind.prototype.testCombination = function (combination) {
  return testCode(combination, this.solution);
};

var testCode = function (combination, solution) {
  var a = 0;
  var b = 0;
  var marked;
  if (secretLenght == 4) marked = [0, 0, 0, 0];
  if (secretLenght == 5) marked = [0, 0, 0, 0, 0];
  if (secretLenght == 6) marked = [0, 0, 0, 0, 0, 0];
  for (var i = 0; i < secretLenght; i++) {
    if (combination[i] == solution[i]) {
      a++;
      marked[i] = 1;
    }
  }
  for (var i = 0; i < secretLenght; i++) {
    if (combination[i] != solution[i]) {
      for (var j = 0; j < secretLenght; j++) {
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

function Population(size) {
  this.members = [];
  this.size = size;
  this.init();
}

Population.prototype.init = function () {
  this.members = [];
  // _.sample(allCodes, this.size) renvoie this.size élements aléatoire du tableau allCodes
  var randomSample = _.sample(allCodes, this.size);
  for (var i in randomSample)
    this.members.push(new Combination(randomSample[i]));
};

Population.prototype.sort = function () {
  this.members.sort(function (a, b) {
    return a.fitness - b.fitness;
  });
};

Population.prototype.generation = function (
  prevGuesses,
  eiSet,
  maxGen,
  callback
) {
  if (maxGen <= 0 || eiSet.length == SET_SIZE) {
    if (!(prevGuesses.length > 1 && eiSet.length < 1)) {
      callback();
      return;
    }
  }
  for (var i in this.members) {
    this.members[i].calculateFitness(prevGuesses);
    if (this.members[i].eligible) {
      var codeString = this.members[i].getCodeString();
      if (eiSet.indexOf(codeString) === -1) {
        eiSet.push(this.members[i].getCodeString());
      }
    }
  }
  this.sort();
  var lastIndex = this.members.length - 1;
  var nextGeneration = this.members[lastIndex].crossover(
    this.members[lastIndex - 1]
  );
  for (var i in nextGeneration) {
    if (shouldDo(MUTATION_PROBABILITY)) nextGeneration[i].mutate();
    if (shouldDo(PERMUTATION_PROBABILITY)) nextGeneration[i].permutate();
    if (shouldDo(INVERSION_PROBABILITY)) nextGeneration[i].inverse();
  }
  this.members.splice(0, 2, nextGeneration[0], nextGeneration[1]);
  var uniqueCodes = _.chain(this.members)
    .map(function (obj) {
      return obj.code.join("");
    })
    .uniq()
    .value();
  var newMembers = _.sample(
    _.difference(allCodes, uniqueCodes),
    this.size - uniqueCodes.length
  );
  uniqueCodes = _.union(uniqueCodes, newMembers);
  this.members = uniqueCodes.map(function (e) {
    return new Combination(e);
  });
  var scope = this;
  var nextGen = maxGen - 1;
  setTimeout(function () {
    scope.generation(prevGuesses, eiSet, nextGen, callback);
  }, 5);
};

var gameMode, playerCode, solution, previousGuesses;
var game, aiGuess, population, eligibleSet, playerCode;

buildTable4();

function initGame() {
  secretLenght = $("#lenght-selected").val();
  gameMode = $("#mode-selected").val();
  buildTable();
  variations(SYMBOLS, secretLenght, [], allCodes);

  initGameVariables();
  cleanUpPlayground();
  if (gameMode != GAME_MODE_HUMAN) {
    console.log(aiGuess);
    //console.log(allCodes);
    diplayGuess(aiGuess);
    $(".go-btn-5").hide();
  } else {
    $(".go-btn-5").show();
  }
}

function initGameVariables() {
  game = new Mastermind();
  aiGuess = _.sample(allCodes);
  population = new Population(POPULATION_SIZE);
  eligibleSet = [];
  initPlayerCode();
  previousGuesses = [];
  console.log(game.solution);
}

function initPlayerCode() {
  if (secretLenght == 4) playerCode = [0, 0, 0, 0];
  if (secretLenght == 5) playerCode = [0, 0, 0, 0, 0];
  if (secretLenght == 6) playerCode = [0, 0, 0, 0, 0, 0];
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

function clearSolutionBoxes() {
  $("[class*='secret-block']").each(function () {
    var newClass =
      $(this).attr("class").split(" ").slice(0, 2).join(" ") + " secret-sym";
    $(this).attr("class", newClass);
  });
}

function playNextGuess(blackNum, whiteNum) {
  previousGuesses.push({ code: aiGuess, x: blackNum, y: whiteNum });
  if (blackNum == secretLenght) {
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

function buildTable6() {
  $(".guess-table").children().remove();
  for (i = 0; i < 6; i++) {
    //var table = `<tr class="guess-row-${i}"><td class="sym-col block-0"><span></span></td><td class="sym-col block-1"><span></span></td><td class="sym-col block-2"><span></span></td><td class="sym-col block-3"><span></span></td><td class="sym-col block-4"><span></span></td><td class="sym-col block-5"><span></span></td><td><table class="test-table-${i}"><tr><td class="test-col" id="tcol-0"></td><td class="test-col" id="tcol-1"></td><td class="test-col" id="tcol-2"></td></tr><tr><td class="test-col" id="tcol-3"></td><td class="test-col" id="tcol-4"></td><td class="test-col" id="tcol-5"></td></tr></table></td><td class="loader-col"><div class="btn btn-go go-btn-${i} disabled"> Vérifier</div><img id="loader-${i}" src="images/loader.gif"></td></tr>`;
    var table = ` <tr class="guess-row-${i}">
                    <td class="sym-col block-0"><span></span></td>
                    <td class="sym-col block-1"><span></span></td>
                    <td class="sym-col block-2"><span></span></td>
                    <td class="sym-col block-3"><span></span></td>
                    <td class="sym-col block-4"><span></span></td>
                    <td class="sym-col block-5"><span></span></td>
                    <td>
                        <table class="test-table-${i}">
                            <tr>
                                <td class="test-col" id="tcol-0"></td>
                                <td class="test-col" id="tcol-1"></td>
                                <td class="test-col" id="tcol-2"></td>

                            </tr>
                            <tr>
                                <td class="test-col" id="tcol-3"></td>
                                <td class="test-col" id="tcol-4"></td>
                                <td class="test-col" id="tcol-5"></td>
                            </tr>									
                        </table>
                    </td>
                    <td class="loader-col">
                        <div class="btn btn-go go-btn-${i}"> Vérifier</div>
                        <img id="loader-${i}" src="images/loader.gif">
                    </td>
                </tr>`;
    $(".guess-table").append(table);
    if (i != 0) {
      $(`.go-btn-${i}`).attr("disabled", true);
    }
  }
  //$(".go-btn-5").css("display", "none");

  var footer = `<tfoot id="footer">
  <tr class="secret-row">
      <td class="sym-col secret-block-0 secret-sym"></td>
      <td class="sym-col secret-block-1 secret-sym"></td>
      <td class="sym-col secret-block-2 secret-sym"></td>
      <td class="sym-col secret-block-3 secret-sym"></td>
      <td class="sym-col secret-block-4 secret-sym"></td>
      <td class="sym-col secret-block-5 secret-sym"></td>

  </tr>
</tfoot>`;
  $(".guess-table").append(footer);
}
function buildTable5() {
  $(".guess-table").children().remove();
  for (i = 0; i < 6; i++) {
    var table = ` <tr class="guess-row-${i}">
                    <td class="sym-col block-0"><span></span></td>
                    <td class="sym-col block-1"><span></span></td>
                    <td class="sym-col block-2"><span></span></td>
                    <td class="sym-col block-3"><span></span></td>
                    <td class="sym-col block-4"><span></span></td>
                    <td>
                        <table class="test-table-${i}">
                            <tr>
                                <td class="test-col" id="tcol-0"></td>
                                <td class="test-col" id="tcol-1"></td>
                                <td class="test-col" id="tcol-2"></td>

                            </tr>
                            <tr>
                                <td class="test-col" id="tcol-3"></td>
                                <td class="test-col" id="tcol-4"></td>
                            </tr>									
                        </table>
                    </td>
                    <td class="loader-col">
                        <div class="btn btn-go go-btn-${i}"> Vérifier</div>
                        <img id="loader-${i}" src="images/loader.gif">
                    </td>
                </tr>`;

    $(".guess-table").append(table);
    if (i != 0) {
      $(`.go-btn-${i}`).attr("disabled", true);
    }
  }
  //$(".go-btn-5").css("display", "none");

  var footer = `<tfoot id="footer">
  <tr class="secret-row">
      <td class="sym-col secret-block-0 secret-sym"></td>
      <td class="sym-col secret-block-1 secret-sym"></td>
      <td class="sym-col secret-block-2 secret-sym"></td>
      <td class="sym-col secret-block-3 secret-sym"></td>
      <td class="sym-col secret-block-4 secret-sym"></td>
  </tr>
</tfoot>`;
  $(".guess-table").append(footer);
}
function buildTable4() {
  $(".guess-table").children().remove();
  for (i = 0; i < 6; i++) {
    var table = ` <tr class="guess-row-${i}">
                      <td class="sym-col block-0"><span></span></td>
                      <td class="sym-col block-1"><span></span></td>
                      <td class="sym-col block-2"><span></span></td>
                      <td class="sym-col block-3"><span></span></td>
                      <td>
                          <table class="test-table-${i}">
                              <tr>
                                  <td class="test-col" id="tcol-0"></td>
                                  <td class="test-col" id="tcol-1"></td>
  
                              </tr>
                              <tr>
                                  <td class="test-col" id="tcol-2"></td>
                                  <td class="test-col" id="tcol-3"></td>
                              </tr>									
                          </table>
                      </td>
                      <td class="loader-col">
                          <div class="btn btn-go go-btn-${i}"> Vérifier</div>
                          <img id="loader-${i}" src="images/loader.gif">
                      </td>
                  </tr>`;

    $(".guess-table").append(table);
    if (i != 0) {
      $(`.go-btn-${i}`).attr("disabled", true);
    }
  }
  //$(".go-btn-5").css("display", "none");

  var footer = `<tfoot id="footer">
    <tr class="secret-row">
        <td class="sym-col secret-block-0 secret-sym"></td>
        <td class="sym-col secret-block-1 secret-sym"></td>
        <td class="sym-col secret-block-2 secret-sym"></td>
        <td class="sym-col secret-block-3 secret-sym"></td>
    </tr>
  </tfoot>`;
  $(".guess-table").append(footer);
}
function buildTable() {
  if (secretLenght == 6) buildTable6();
  if (secretLenght == 5) buildTable5();
  if (secretLenght == 4) {
    buildTable4();
  }
}

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

function diplayGuess(code) {
  var rowSelector = $(".guess-row-" + previousGuesses.length);
  console.log(previousGuesses.length);
  console.log(previousGuesses);
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
    if (gameMode == GAME_MODE_AI) {
      console.log(code);
      showColors(code);
    }
  });
}

$("[class^='option-col']").click(function () {
  var symbolClass = $(this).attr("class").split(" ")[1]; //  symbolClass= "sym-A" ou "sym-B" ....
  var firstPosition = playerCode.indexOf(0);
  if (firstPosition != -1) {
    $(".guess-row-" + previousGuesses.length)
      .find(".sym-col:nth-child(" + (firstPosition + 1) + ")")
      .addClass("sym-bg")
      .hide()
      .addClass(symbolClass)
      .fadeIn(200);
    var symbolValue = symbolClass.substr(4, 1); // symbolValue = A ou B ou C ..
    playerCode[firstPosition] = symbolValue; //
  }
});

function getNumberFromClass(classAttr, prefix) {
  var startIndex = classAttr.indexOf(prefix);
  if (startIndex != -1) {
    return parseInt(classAttr.charAt(startIndex + prefix.length));
  }
  return NaN;
}

$(document).on("click", ".sym-col", function (e) {
  var blockNumber = getNumberFromClass($(this).attr("class"), "block-"); // blockNumber est le nbr i dans l'exemple suivant : class="sym-col block-i"
  playerCode[blockNumber] = 0; // reinitialiser l'attribue playerCode[i] en 0
  $(this).attr("class", "sym-col block-" + blockNumber);
});

$(document).on("click", "[class*='go-btn']", function () {
  if (gameMode != GAME_MODE_HUMAN) {
    var response = countTestResponse();
    $(this).hide();
    $("#loader-" + previousGuesses.length).show();
    playNextGuess(response.a, response.b);
    $(".go-btn-" + previousGuesses.length).removeClass("disabled");
    $(`.go-btn-` + previousGuesses.length).attr("disabled", false);
  } else {
    if (playerCode.indexOf(0) == -1) {
      var over = showColors(playerCode);
      $(this).hide();
      previousGuesses.push(playerCode);
      initPlayerCode();
      if (!over) {
        $(".go-btn-" + previousGuesses.length).removeClass("disabled");
        $(`.go-btn-` + previousGuesses.length).attr("disabled", false);
      }
    }
  }
});

function showColors(code) {
  var testResponse = game.testCombination(code);
  var testTableSelector = $(".test-table-" + previousGuesses.length);
  var td = 0;
  for (; td < testResponse[0]; td++) {
    testTableSelector.find("#tcol-" + td).addClass("red-peg");
  }
  for (; td < testResponse[0] + testResponse[1]; td++) {
    testTableSelector.find("#tcol-" + td).addClass("yellow-peg");
  }
  // testResponse[0] egale au nbr des symboles bien placer dans la case correspondant
  if (
    testResponse[0] == secretLenght ||
    previousGuesses.length == 6 ||
    (gameMode == GAME_MODE_HUMAN && previousGuesses.length == 5)
  ) {
    $("[class*='go-btn']").addClass("disabled");
    displayGameSolution();
    return true;
  }
  return false;
}

function testCombination(combination) {
  return testCode(combination, solution);
}

function getNumberFromClass(classAttr, prefix) {
  var startIndex = classAttr.indexOf(prefix);
  if (startIndex != -1) {
    return parseInt(classAttr.charAt(startIndex + prefix.length));
  }
  return NaN;
}

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
