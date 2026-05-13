require('dotenv').config();
const mongoose = require('mongoose');
const State = require('../model/State');

const seedData = [
    {
        stateCode: 'KS',
        funfacts: [
            'The geographic center of the contiguous United States is in Smith County, near Lebanon, Kansas.',
            'The world’s largest ball of twine is in Cawker City, Kansas — it weighs over 20,000 pounds and is still growing.',
            'Dodge City, Kansas is the windiest city in the United States.'
        ]
    },
    {
        stateCode: 'MO',
        funfacts: [
            'Kansas City, Missouri has more fountains than any city in the world except Rome.',
            'The ice cream cone was popularized at the 1904 World’s Fair in St. Louis, Missouri.',
            'Missouri is the only state with two Federal Reserve banks (in Kansas City and St. Louis).'
        ]
    },
    {
        stateCode: 'OK',
        funfacts: [
            'The parking meter was invented in Oklahoma City in 1935 by Carl C. Magee.',
            'Oklahoma’s name comes from two Choctaw words: "okla" meaning people and "humma" meaning red.',
            'The shopping cart was invented in Ardmore, Oklahoma in 1937 by Sylvan Goldman.'
        ]
    },
    {
        stateCode: 'NE',
        funfacts: [
            'Nebraska is the only U.S. state with a unicameral (single-house) legislature.',
            'The Reuben sandwich was invented in Omaha, Nebraska around 1925.',
            'Kool-Aid was invented in Hastings, Nebraska by Edwin Perkins in 1927 and is Nebraska’s official state soft drink.'
        ]
    },
    {
        stateCode: 'CO',
        funfacts: [
            'Colorado is the only U.S. state located entirely above 1,000 meters elevation.',
            'The cheeseburger was trademarked in Denver, Colorado in 1935 by Louis Ballast.',
            'Colorado has the highest paved road in North America: Mount Blue Sky (formerly Mount Evans) at 14,130 feet.'
        ]
    }
];

const run = async () => {
    if (!process.env.DATABASE_URI) {
        console.error('DATABASE_URI is not set. Create a .env file with your MongoDB connection string.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('Connected to MongoDB');

        for (const entry of seedData) {
            const result = await State.findOneAndUpdate(
                { stateCode: entry.stateCode },
                { $set: { funfacts: entry.funfacts } },
                { upsert: true, new: true }
            );
            console.log(`Seeded ${result.stateCode}: ${result.funfacts.length} facts`);
        }

        console.log('Seed complete.');
    } catch (err) {
        console.error(err);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

run();
