
module.exports = {
  removeNullValuesFromObject: function (obj) {
    return Object.keys(obj).reduce(function (prev, currentKey){
      if (!obj[currentKey]) return prev;

      var currentObject = {};
      currentObject[currentKey] = obj[currentKey];

      return Object.assign(prev, currentObject);
    }, { });
  }
}