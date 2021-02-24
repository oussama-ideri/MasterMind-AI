$(document).ready(function () {
  //initGame();
});

initGame();

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
                        <div class="btn btn-go go-btn-${i} disabled"> Vérifier</div>
                        <img id="loader-${i}" src="images/loader.gif">
                    </td>
                </tr>`;
    $(".guess-table").append(table);
  }
  $(".go-btn-5").css("display", "none");

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
                        <div class="btn btn-go go-btn-${i} disabled"> Vérifier</div>
                        <img id="loader-${i}" src="images/loader.gif">
                    </td>
                </tr>`;

    $(".guess-table").append(table);
  }
  $(".go-btn-5").css("display", "none");

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
                          <div class="btn btn-go go-btn-${i} disabled"> Vérifier</div>
                          <img id="loader-${i}" src="images/loader.gif">
                      </td>
                  </tr>`;

    $(".guess-table").append(table);
  }
  $(".go-btn-5").css("display", "none");
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
  if (secretLenght == 4) buildTable4();
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

function getNumberFromClass(classAttr, prefix) {
  var startIndex = classAttr.indexOf(prefix);
  if (startIndex != -1) {
    return parseInt(classAttr.charAt(startIndex + prefix.length));
  }
  return NaN;
}

var playerCode;
var previousGuesses, secretLenght;

function initGame() {
  secretLenght = $("#lenght-selected").val();
  if (secretLenght == 4) playerCode = [0, 0, 0, 0];
  if (secretLenght == 5) playerCode = [0, 0, 0, 0, 0];
  if (secretLenght == 6) playerCode = [0, 0, 0, 0, 0, 0];

  previousGuesses = [];
  buildTable();
}

/*$("[class*='go-btn']").click(function () {
  if (playerCode.indexOf(0) == -1) {
    var over = showPegs(playerCode);
    $(this).hide();
    previousGuesses.push(playerCode);
    playerCode = [0, 0, 0, 0];
    if (!over) {
      $(".go-btn-" + previousGuesses.length).removeClass("disabled");
    }
  }
});*/

$("[class^='option-col']").click(function () {
  var symbolClass = $(this).attr("class").split(" ")[1]; //  symbolClass= "sym-A" ou "sym-B" ....
  var firstPosition = playerCode.indexOf(0);
  if (firstPosition != -1) {
    $(".guess-row-" + previousGuesses.length)
      .find(".sym-col:nth-child(" + (firstPosition + 1) + ")")
      .addClass("sym-bg")
      .hide()
      .addClass(symbolClass)
      .fadeIn();
    var symbolValue = symbolClass.substr(4, 1); // symbolValue = A ou B ou C ..
    playerCode[firstPosition] = symbolValue; //
  }
});

$(".sym-col").click(function () {
  var blockNumber = getNumberFromClass($(this).attr("class"), "block-"); // blockNumber est le nbr i dans l'exemple suivant : class="sym-col block-i"
  playerCode[blockNumber] = 0; // reinitialiser le attribue playerCode[i] en 0
  $(this).attr("class", "sym-col block-" + blockNumber); // No need
});

function removeSym() {
  var blockNumber = getNumberFromClass(".sym-col", "block-"); // blockNumber est le nbr i dans l'exemple suivant : class="sym-col block-i"
  playerCode[blockNumber] = 0; // reinitialiser le attribue playerCode[i] en 0
  $(this).attr("class", "sym-col block-" + blockNumber); // No need
  console.log(blockNumber);
}
