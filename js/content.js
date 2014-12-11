var brackets = {
  estimate: /(?:^|\s)\{([\d]+)\}(?:$|\s)/,
  done: /(?:^|\s)\(([\d]+)\)(?:$|\s)/,
  remaining: /(?:^|\s)\[([\d]+)\](?:$|\s)/
}

function sumScores(scores) {
  return Array.prototype.map.call(scores, function(score) {
    var value = score.innerHTML;
    return value == '?' ? 0 : parseInt(value, 10);
  }).reduce(function(sum, value) {
    return sum + value;
  }, 0);
}
function extractScore(title, bracketName) {
  var matches = title.match(brackets[bracketName]);
  return matches ? matches[1] : '?';
}
function updateScore(container, selector, value, valueClass, bracketName) {
  var child = container.getElementsByClassName(selector)[0];
 
  if (child.querySelectorAll('.' + valueClass + '.' + bracketName).length) {
    child.querySelectorAll('.' + valueClass + '.' + bracketName + ' strong').innerHTML = value;
  } else {
    var span = document.createElement('span');
    span.className = valueClass + ' ' + bracketName;
    span.innerHTML = '<strong>' + value + '</strong>';
    child.appendChild(span);
  } 
}
function updateCardScore(card, score, bracketName) {
  updateScore(card, 'footer', score, 'score', bracketName);
}
function updateColumnTotal(column, total, bracketName) {
  updateScore(column, 'column-header', total, 'total', bracketName);
}
function processCardScore(card) {
  var title = card.getElementsByClassName('title')[0].value;
  Object.keys(brackets).forEach(function(bracketName) {
    updateCardScore(this, extractScore(title, bracketName), bracketName);
  }, card);
}
function tallyColumn(column) {
  Object.keys(brackets).forEach(function(bracketName) {
    updateColumnTotal(this, sumScores(this.querySelectorAll('.footer .' + bracketName + ' strong')), bracketName);
  }, column);
}

function fetchScores() {
  Array.prototype.forEach.call(document.getElementsByClassName('card-body'), processCardScore);
  Array.prototype.forEach.call(document.getElementsByClassName('column-ct'), tallyColumn);
  setTimeout(fetchScores, 2000);
}

fetchScores()