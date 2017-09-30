const memoryStore = () => {
  let store = {};

  const get = (fn) => {
    fn(null, store);
  };

  const set = (data, options, fn) => {
    store = data;
    fn(null, store);
  };

  return { get: get, set: set };
};

const promisify = (fn) => {
  return new Promise((resolve, reject) => {
    fn((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const createStorage = (medium = memoryStore()) => {
  const get = () => promisify(medium.get.bind(medium)).then(data => data || {});
  const set = data => promisify(medium.set.bind(medium, data, {force: 1})).then(() => data);

  return { get: get, set: set };
}

module.exports = createStorage;
