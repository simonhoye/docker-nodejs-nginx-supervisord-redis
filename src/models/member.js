const model = {
  id: 'number',
  name: 'string',
  vendorId: 'number',
  vendor: 'string',
  items: 'array'
}
const fields = Object.keys(model)

const Member = (data={}) => {
  let newMember = {}
  for (key in data) {
	newMember[key] = undefined
	if (fields.indexOf(key) !== -1) {
	  let value = data[key]
      newMember[key] = value
    }
  }
  return newMember
}

const validate = (member, cb) => {
  let err = []
  for (field in member) {
    if (member.hasOwnProperty(field) &&
       model.hasOwnProperty(field))
    {
      value = member[field]
      expected = model[field]
      switch (expected) {
        case 'str':
        case 'string':
          if (typeof value !== 'string') {
            invalid = true
            continue
          }
          break;
        case 'int':
        case 'integer':
        case 'number':
          if (typeof value !== 'number') {
            invalid = true
            continue
          }
          break;
        case 'arr':
        case 'array':
          if (!Array.isArray(value)) {
            invalid = true
            continue
          }
          break;
        case 'bool':
        case 'boolean':
          if (typeof value !== 'boolean') {
            invalid = true
            continue
          }
          break;
        case 'obj':
        case 'object':
          if (typeof value !== 'object') {
            invalid = true
            continue
          }
          break;
      }
      if (invalid) {
        err.push(`${field} is not ${expected}`)
      }
    } else {
	  err.push(field + ' could not be validated')
	}
  }
  if ('function' === typeof cb) {
	cb.call(err, member)
  }
}

module.exports = { fields, validate, Member }