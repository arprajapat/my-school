var express = require('express');
var router = express.Router();
const models  = require('../models');
const { 
    batchSize,
    distictSubjects, 
    getBestWorstSubjects,
    getCorrespondingCitySubjects,
    getLatestYear,
    performace,
} = require('../utils/utils');
const { getSentences } = require('../utils/sentenceUtils');


router.get('/:school', async (req, res, next) => {
    const { school } = req.params;
    //todo: check if city is being passed in query params
    try {
        // check if school exist in multiple cities
        const distictCites = await models.Grade.aggregate('city', 'DISTINCT', {
            where: { school },
            plain: false
        });
        if(distictCites.length > 1) {
            return res.end(JSON.stringify({message: `There are ${distictCites.length} schools of same name in diferent cities. As of now system doesn't support this`}))
        }
        if(distictCites.length == 0) {
            return res.end(JSON.stringify({message: `No school record found`}));
        }
        const city = distictCites[0] && distictCites[0]['DISTINCT'];

        // fetch school data
        const schoolData =  await models.Grade.findAll({
            where: { school },
            raw: true
        });
       
         // fetch city data
        const cityData = await models.AggregatedGrade.findAll({
            where: { city },
            raw: true
        });
       
        // fetch distinct school count in city
        const citySchoolsCount = await models.Grade.count({
            distinct: true,
            col: 'school',
            where: { city }
        });

        // school metrics
        const latestYear = getLatestYear(schoolData);
        const { bestSubjects, worstSubjects } = getBestWorstSubjects(schoolData, latestYear)
        const schoolMetrics = {
            name: school,
            isOnlySchoolInCity: (citySchoolsCount == 1),
            offeredSubject: distictSubjects(schoolData),
            performace: performace(schoolData),
            latestYear,
            bestSubjects,
            worstSubjects,
            batchSize: batchSize(schoolData, latestYear)
        };
        // console.log(schoolMetrics);

        // city metrics
        const cityMetrics = {
            name: city,
            schoolsCount: citySchoolsCount,
            offeredSubject: distictSubjects(cityData),
            performace: performace(cityData),
            latestYear,
            batchSize: batchSize(schoolData, latestYear),
            bestSubjects: getCorrespondingCitySubjects(cityData, schoolMetrics.bestSubjects),
            worstSubjects: getCorrespondingCitySubjects(cityData, schoolMetrics.worstSubjects)
        };
        // console.log(cityMetrics);

        // all sentences whith weightage
        const sentences = getSentences({school: schoolMetrics, city: cityMetrics});
        sentences.sort((a,b) => b.weight-a.weight);
        console.log(sentences)
        const index = Math.min(5, sentences.length)
        let paragraph = sentences
            .filter(sentence => sentence.weight >= sentences[index].weight)
            .map((sentence, idx) => `${idx+1}. ${sentence.message}`)
            .join('\n');

        res.end(paragraph);    
    } catch (error) {
        //Todo: add logger to log errors
        console.log(error)
        res.status(500).end('Internal Server Error')
    }
    
});

module.exports = router;
