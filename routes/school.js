var express = require('express');
var router = express.Router();
const models  = require('../models');
const { getMetrics } = require('../services/service');
const { getCityMetrics } = require('../services/cityMetricService');
const { offeredSubject, batchSize, worstSubjects, bestSubjects, overyearsConsistancy } = require('../services/sentenceService');

/* GET users listing. */
router.get('/:school/city/:city', async (req, res, next) => {
// router.post('/info', async (req, res, next) => {
    const { school } = req.params;
    try {
        const distictCites = await models.Grade.aggregate('city', 'DISTINCT', {
            where: { school },
            plain: false
        });
        /**
         *  [
                { DISTINCT: 'Future Ahali' },
                { DISTINCT: 'Khadija High School' },
                { DISTINCT: 'High Ktain Alsomr' },
                { DISTINCT: 'Comprehensive whether to coal' },
                { DISTINCT: 'Gerard Eye Middle School' },
                { DISTINCT: 'Future Umm al-Fahm' }
            ]
         */
        console.log(distictCites);
        if(distictCites.length > 1) {
            res.end(JSON.stringify({message: `There are ${distictCites.length} schools in diferent cities`}))
        }
        const city = distictCites[0]['DISTINCT'];

        const grades =  await models.Grade.findAll({
            where: { school },
            raw: true
        });
        // console.log(getMetrics(grades));
        const aggrGrades = await models.AggregatedGrade.findAll({
            where: { city },
            raw: true
        });
        // console.log(getCityMetrics(aggrGrades));
        const formattedData = {
            schoolMetrics: getMetrics(grades),
            cityMetrics: getCityMetrics(aggrGrades)
        }
        console.log(formattedData.schoolMetrics);

        res.end(
            `1. ${offeredSubject(formattedData.schoolMetrics)}\n`+
            `2. ${batchSize(formattedData)}\n`+
            `3. ${bestSubjects(formattedData)}\n`+
            `4. ${worstSubjects(formattedData)}\n`+
            `5. ${overyearsConsistancy(formattedData)}`
        );
        
    } catch (error) {
        
    }
    
});

module.exports = router;
