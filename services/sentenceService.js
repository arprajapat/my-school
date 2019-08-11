const formSentences = (data) => {
    
}

const offeredSubject = (data) => {
    return `The school offer following subjects:\n${data.subjectOffered.join(',\n')}`
}

const getLatestBatchSize = (data) => {
    return Math.round(data.studentsCount/data.batchCount);
}

const getLatestYear = (data) => {
    let latestYear;
    for (const year in data) {
        latestYear = latestYear == undefined ? year : latestYear
        latestYear = latestYear > year ? latestYear : year
    }
    return latestYear;
}

const getLatestYears = (data, limit = 1) => {
    let latestYear = getLatestYear(data);
    const latestYears = [];

    for (let i = 0; i < limit; i++) {
        if(data.hasOwnProperty(latestYear-i))
            latestYears.push(latestYear-i)
    }
    return latestYears;
}

const batchSize = (data) => {
    const schoolPerformace = data.schoolMetrics.overallPerformace;
    const cityPerformace = data.cityMetrics.overallPerformace;

    let latestYear = getLatestYear(schoolPerformace);
    
    const schoolBatchSize = getLatestBatchSize(schoolPerformace[latestYear]);
    const cityBatchSize = getLatestBatchSize(cityPerformace[latestYear])
    return `In year ${latestYear}, average batch size of the school was ${schoolBatchSize}, while city average batch was around ${cityBatchSize}`
}

const bestSubjects = (data) => {
    const subjects = data.schoolMetrics.latestBestSubjects;
    // console.log(subjects)
    if(!subjects.length) return '';
    let temp = '';
    for (const elm of subjects) {
        if(temp != '') temp = temp + ', '
        // console.log(elm.subject)
        temp = temp + elm.subject;
    }
    const helpingVerb = subjects.length == 1 ? 'is' : 'are'
    return `best performing subject of the school ${helpingVerb} ${temp}`
}

const worstSubjects = (data) => {
    const subjects = data.schoolMetrics.latestWorstSubjects;
    if(!subjects.length) return '';
    let temp = '';
    for (const elm of subjects) {
        if(temp != '') temp = temp + ', '
        temp = temp + elm.subject;
    }
    const helpingVerb = subjects.length == 1 ? 'is' : 'are'
    return `worst performing subject of the school ${helpingVerb} ${temp}`
}

const overyearsConsistancy = (data) => {
    const { overallPerformace } = data.schoolMetrics
    const cityPerformace = data.cityMetrics.overallPerformace
    const latestYears = getLatestYears(overallPerformace, 3);
    
    const threshold = 70;
    let isConsitant = true;
    let isIncreasing;
    for (let i = latestYears.length-1; i > 0; i--) {
        const curr = overallPerformace[latestYears[i]].avgGrade;
        const next = overallPerformace[latestYears[i-1]].avgGrade;
        const multiplier = parseInt(latestYears[i-1]-latestYears[i])/10;

        console.log(curr, next, multiplier)
        isIncreasing = overallPerformace[latestYears[0]].avgGrade > overallPerformace[latestYears[1]].avgGrade

        if(next < curr*(1-multiplier) || next > curr*(1+multiplier)) {
            isConsitant = false;
            break;
        }
    }
    let temp = ''
    if(isConsitant && latestYears.length > 1) {
        temp = temp +'School performace is consistant over last few years. '
    }
    else if(!isConsitant && isIncreasing && latestYears.length > 1) {
        temp = temp +'School performace is increased over last few years.'
    }
    else if(!isConsitant && !isIncreasing && latestYears.length > 1) {
        temp = temp + 'School performace is declined over last few years'
    }
    
    if(cityPerformace[latestYears[0]].avgGrade * 1.1 < overallPerformace[latestYears[0]].avgGrade) {
        temp = temp + `In ${latestYears[0]}, school did well in the city`
    }
    else if(cityPerformace[latestYears[0]].avgGrade * .9 > overallPerformace[latestYears[0]].avgGrade){
        temp = temp + `In ${latestYears[0]}, average grades of the school was lower then the city schools`
    }
    else {
        temp = temp + `In ${latestYears[0]}, it was an average performaing school`
    }
    return temp
}


module.exports = {
    offeredSubject,
    batchSize,
    bestSubjects,
    worstSubjects,
    overyearsConsistancy
}