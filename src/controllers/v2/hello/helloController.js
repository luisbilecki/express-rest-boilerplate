const sayHello = ({ req, res }) => {
    const params = req.query;

    res.send(`Hello ${params.name}. V2 API is working!`);
};

module.exports = {
    sayHello,
};
