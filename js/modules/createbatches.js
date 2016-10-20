function createBatches(object) {
  var batchArray = [];
  do { //populate batchArray with page content divided into 10s
    for (; object.length > 0;) {
      batchArray.push(object.splice(0, 3)); //batchArray created
    }
  } while (object.lenth > 0);
  return batchArray;
}

module.exports = createBatches;
