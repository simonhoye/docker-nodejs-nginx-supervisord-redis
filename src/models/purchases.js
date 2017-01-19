const Purchases = Set
Purchases.prototype = Set.prototype

Purchases.prototype.rand = function() {
  let values = [...this]
  return values[Math.floor(Math.random() * values.length)]
}
Purchases.prototype.union = function(setB) {
  var union = new Set(this)
  for (var elem of setB) {
    union.add(elem)
  }
  return union
}

module.exports = {
  Purchases
}