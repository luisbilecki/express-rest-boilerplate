const sayHello = ({ req, res }) => {
    const params = req.query;

    res.json(`Hello ${params.name}. V2 API is working!`);
};

module.exports = {
    sayHello,
};
