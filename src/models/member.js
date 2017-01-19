const model = {
  id: {
    type: 'number',
    required: true
  },
  name: {
    type: 'string',
    required: true
  },
  vendorId: {
    type: 'number',
    required: true
  },
  vendor: {
    type: 'string',
    required: true
  },
  items: {
    type: 'array',
    required: true
  }
}
const fields = Object.keys(model)

const Member = (data = {}) => {
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
  for (field in model) {
    let expected = model[field]
    if (field in member) {
      let invalid = false
      let value = member[field]
      switch (expected.type) {
      case 'str':
      case 'string':
        if (typeof value !== 'string') {
          invalid = true
        }
        break;
      case 'int':
      case 'integer':
      case 'number':
        if (typeof value !== 'number') {
          invalid = true
        }
        break;
      case 'arr':
      case 'array':
        if (!Array.isArray(value)) {
          invalid = true
        }
        break;
      case 'bool':
      case 'boolean':
        if (typeof value !== 'boolean') {
          invalid = true
        }
        break;
      case 'obj':
      case 'object':
        if (typeof value !== 'object') {
          invalid = true
        }
        break;
      }
      if (invalid) {
        err.push(`${field} is not of type ${expected.type}`)
      }
    } else if (expected.required) {
      err.push(field + ' is required')
    }
  }
  if ('function' === typeof cb) {
    cb.call(Member, err, member)
  }
}

module.exports = {
  fields, validate, Member
}