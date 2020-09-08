const username = 'admin';
const password = 'passw0rd123';
const db = 'doodlio-dev';

module.exports = {
    mongoURI: `mongodb+srv://${username}:${password}@doodlio-cluster-p2qay.mongodb.net/${db}?retryWrites=true`,
    secretOrKey: 'It really do be like that again...'
};
