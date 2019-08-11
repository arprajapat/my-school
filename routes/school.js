var express = require('express');
var router = express.Router();
const models  = require('../models');
const { distictSubjects, performace, getLatestYear, getBestWorstSubjects, batchSize} = require('../services/utils')
const { getSentences } = require('../services/sentenceUtils');
const { getMetrics, latestBestWorstSubjects } = require('../services/service');
const { getCityMetrics } = require('../services/cityMetricService');
const { offeredSubject, worstSubjects, bestSubjects, overyearsConsistancy } = require('../services/sentenceService');

/* GET users listing. */
router.get('/:school/city/:city', async (req, res, next) => {
    const { school } = req.params;
    try {
        // check if school exist in multiple cities
        const distictCites = await models.Grade.aggregate('city', 'DISTINCT', {
            where: { school },
            plain: false
        });
        if(distictCites.length > 1) {
            res.end(JSON.stringify({message: `There are ${distictCites.length} schools in diferent cities`}))
        }

        const city = distictCites[0]['DISTINCT'];

        const schoolData =  await models.Grade.findAll({
            where: { school },
            raw: true
        });
       
        const cityData = await models.AggregatedGrade.findAll({
            where: { city },
            raw: true
        });
       
        const citySchoolsCount = await models.Grade.count({
            distinct: true,
            col: 'school',
            where: { city }
        });
        // school metrics
        const latestYear = getLatestYear(schoolData);
        const { bestSubjects, worstSubjects } = getBestWorstSubjects(schoolData, latestYear)
        const schoolMetrics = {
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
            schoolsCount: citySchoolsCount,
            offeredSubject: distictSubjects(cityData),
            performace: performace(cityData),
            latestYear,
            batchSize: batchSize(schoolData, latestYear)
        };
        // console.log(cityMetrics);
        const sentences = getSentences({school: schoolMetrics, city: cityMetrics});
        sentences.sort((a,b) => b.weight-a.weight);
        // console.log(sentences)
        const index = Math.min(5, sentences.length)
        let paragraph = sentences
            .filter(sentence => sentence.weight >= sentences[index].weight)
            .map((sentence, idx) => `${idx+1}. ${sentence.message}`)
            .join('\n');
        // console.log(paragraph)
        res.end(paragraph)        
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
    
});

module.exports = router;
