const State = require('../model/State');
const statesData = require('../model/statesData.json');

const getAllStates = async (req, res) => {
    let results = statesData;

    if (req.query.contig === 'true') {
        results = results.filter(st => st.code !== 'AK' && st.code !== 'HI');
    } else if (req.query.contig === 'false') {
        results = results.filter(st => st.code === 'AK' || st.code === 'HI');
    }

    const dbStates = await State.find().lean();
    const factsByCode = new Map(dbStates.map(d => [d.stateCode, d.funfacts]));

    const merged = results.map(st => {
        const facts = factsByCode.get(st.code);
        return (facts && facts.length > 0) ? { ...st, funfacts: facts } : st;
    });

    res.json(merged);
};

const getState = async (req, res) => {
    const doc = await State.findOne({ stateCode: req.code }).lean();
    res.json(doc ? { ...req.stateEntry, funfacts: doc.funfacts || [] } : req.stateEntry);
};

const getRandomFunFact = async (req, res) => {
    const doc = await State.findOne({ stateCode: req.code }).lean();
    if (!doc || !doc.funfacts || doc.funfacts.length === 0) {
        return res.json({ message: `No Fun Facts found for ${req.stateEntry.state}` });
    }
    const funfact = doc.funfacts[Math.floor(Math.random() * doc.funfacts.length)];
    res.json({ funfact });
};

const getCapital = (req, res) => {
    res.json({ state: req.stateEntry.state, capital: req.stateEntry.capital_city });
};

const getNickname = (req, res) => {
    res.json({ state: req.stateEntry.state, nickname: req.stateEntry.nickname });
};

const getPopulation = (req, res) => {
    res.json({
        state: req.stateEntry.state,
        population: req.stateEntry.population.toLocaleString('en-US')
    });
};

const getAdmission = (req, res) => {
    res.json({ state: req.stateEntry.state, admitted: req.stateEntry.admission_date });
};

const createFunFact = async (req, res) => {
    const { funfacts } = req.body;

    if (!funfacts) {
        return res.status(400).json({ message: 'State fun facts value required' });
    }
    if (!Array.isArray(funfacts)) {
        return res.status(400).json({ message: 'State fun facts value must be an array' });
    }

    const doc = await State.findOneAndUpdate(
        { stateCode: req.code },
        { $push: { funfacts: { $each: funfacts } } },
        { upsert: true, new: true }
    );

    res.json(doc);
};

const updateFunFact = async (req, res) => {
    const { index, funfact } = req.body;

    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }
    if (!funfact) {
        return res.status(400).json({ message: 'State fun fact value required' });
    }

    const doc = await State.findOne({ stateCode: req.code });
    if (!doc || !doc.funfacts || doc.funfacts.length === 0) {
        return res.json({ message: `No Fun Facts found for ${req.stateEntry.state}` });
    }

    const idx = index - 1;
    if (idx < 0 || idx >= doc.funfacts.length) {
        return res.json({ message: `No Fun Fact found at that index for ${req.stateEntry.state}` });
    }

    doc.funfacts[idx] = funfact;
    const saved = await doc.save();
    res.json(saved);
};

const deleteFunFact = async (req, res) => {
    const { index } = req.body;

    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }

    const doc = await State.findOne({ stateCode: req.code });
    if (!doc || !doc.funfacts || doc.funfacts.length === 0) {
        return res.json({ message: `No Fun Facts found for ${req.stateEntry.state}` });
    }

    const idx = index - 1;
    if (idx < 0 || idx >= doc.funfacts.length) {
        return res.json({ message: `No Fun Fact found at that index for ${req.stateEntry.state}` });
    }

    doc.funfacts.splice(idx, 1);
    const saved = await doc.save();
    res.json(saved);
};

module.exports = {
    getAllStates,
    getState,
    getRandomFunFact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    createFunFact,
    updateFunFact,
    deleteFunFact
};
