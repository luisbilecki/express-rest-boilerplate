const sayHello = ({ queryParams }) => {
    return `Hello ${queryParams.name}. V2 API is working!`;
};

module.exports = {
    sayHello,
};
