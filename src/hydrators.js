const member = obj => {
  let fields = ['id', 'name', 'vendorId', 'vendor', 'items']
  let newMember = {}
  for (key in obj) {
    if (fields.indexOf(key) !== -1) {
	    let value = obj[key]
        newMember[key] = value
    }
  }
  return newMember
}

module.exports = { member }