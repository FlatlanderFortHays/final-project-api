const statesData = require('../model/statesData.json');

const verifyStates = (req, res, next) => {
    const stateCode = req.params.state?.toUpperCase();

    const stateEntry = statesData.find(st => st.code === stateCode);

    if (!stateEntry) {
        return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
    }

    req.code = stateCode;
    req.stateEntry = stateEntry;
    next();
};

module.exports = verifyStates;
