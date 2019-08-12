const subjectsList = (offeredSubject, school, city, year) => {
    return {
        message: `School "${school} - ${city}" offer following subjects in year ${year}:\n${offeredSubject.join(',\n')}`,
        weight: 1.0000
    }
}

const batchSize = (schoolBatchSize, cityBatchSize) => {

    if(schoolBatchSize < cityBatchSize * 1.25 && schoolBatchSize > cityBatchSize * .75) {
        return {
            message: `School runs classes in medium size batches, which has strength of ${cityBatchSize} students in a batch`,
            weight: 0.50
        }
    }
    if(schoolBatchSize < cityBatchSize * .75) {
        return {
            message: `School keep classes in small batches compare to other schools in the city, so attention on students will be more`,
            weight: 0.75
        }
    }
    else {
        return {
            message: `Number of students in classes are higher than average students strength in a class in the city`,
            weight: 0.75
        }
    }
}

const isOnlySchoolInCity = (schoolsCount, cityName) => {
    if(schoolsCount==1) {
        return {
            message: `This is only school in city "${cityName}"`,
            weight: 1.00
        }
    }
    else {
        return {
            message: `City has ${schoolsCount} schools and this one of them`,
            weight: .01
        }
    }
}

const subjectCoverage = (data) => {
    if(!data.school.isOnlySchoolInCity) {
        if(data.city.offeredSubject.length *.70 < data.school.offeredSubject.length 
            && data.school.offeredSubject.length > 5) {
                return {
                    message: `The school offered most of the subjects in the city in year ${data.school.latestYear}`,
                    weight: .70
                }
        }
        else {
            return {
                message: `The school doesn't offered most of the subjects in the city in year ${data.school.latestYear}`,
                weight: .001
            }
        }
    }
    else {
        return {
            message: `City doesn't have many schools`,
            weight: .001
        }
    }
}

const bestSubjects = (data) => {
    const subjects = data.school.bestSubjects;
    const citySubjects = data.city.bestSubjects;
    if(subjects.length == 0) {
        return {
            message: 'School results not excelling in any subject',
            weight : .0001
        }
    }

    let subjectList = '';
    let exclusiveList = '';
    for (let i = 0;i< subjects.length;i++) {
        if(subjectList != '') subjectList = subjectList + ', '
        subjectList = subjectList + `"${subjects[i].subject}"`;
        if(citySubjects[i] && subjects[i].batchCount == citySubjects[i].batchCount) {
            if(exclusiveList != '') exclusiveList = exclusiveList + ', '
            exclusiveList = exclusiveList + `"${subjects[i].subject}"`;
        }
    }

    const helpingVerb = subjects.length == 1 ? 'is' : 'are'

    if(data.school.isOnlySchoolInCity) {
        return {
            message: `Top graded subject of the school ${helpingVerb} ${subjectList}`,
            weight: .80
        }
    }
    else {
        if(exclusiveList!='') {
            return {
                message: `Top subject of the school ${helpingVerb} ${subjectList}. ${exclusiveList} are only offered by the school in "${data.city.name}"`,
                weight: .80
            }
        }
        return {
            message: `Top graded subject of the school ${helpingVerb} ${subjectList}`,
            weight: .80
        }
    }
}

const worstSubjects = (data) => {
    const subjects = data.school.worstSubjects;
    if(subjects.length == 0) {
        return {
            message: 'None subject is taught very bad in here',
            weight : .0001
        }
    }
    
    let subjectList = '';
    for (const elm of subjects) {
        if(subjectList != '') subjectList = subjectList + ', '
        subjectList = subjectList + `"${elm.subject}"`;
    }
    const helpingVerb = subjects.length == 1 ? 'is' : 'are'

    if(data.school.isOnlySchoolInCity) {
        return {
            message: `${subjectList}  ${helpingVerb} worst taught subjects here`,
            weight: .80
        }
    }
    else {
        return {
            message: `Worst performing subject ${helpingVerb} ${subjectList} in school`,
            weight: .80
        }
    }
}

const gradeConsistancy = (data) => {
    const year = data.school.latestYear;
    const performace = data.school.performace
    const cityPerformance = data.city.performace
    const LIMIT = 3;
    const latestYears = []; // last 3/LIMIT years
    for (let i = 0; i < LIMIT; i++) {
        if(data.school.performace.hasOwnProperty(year-i))
            latestYears.push(year-i);
    }
    latestYears.reverse();
    const len = latestYears.length;
    let isConsistent = true;
    for (let i = 1; i < latestYears.length; i++) {
        const prev = performace[latestYears[i-1]].avgGrade;
        const curr = performace[latestYears[i]].avgGrade;
        const multiplier = parseInt(latestYears[i]-latestYears[i-1])/10;
        
        if(curr < prev*(1-multiplier) || curr > prev*(1+multiplier)) {
            isConsitant = false;
            break;
        }
    }
    if(len==1) {
        // Todo: Compare with city
        const diff = performace[year].avgGrade - cityPerformance[year].avgGrade;
        if(Math.abs(diff) > cityPerformance[year].avgGrade*.1) {
            return {
                message: `Overall performance of all subjects in school in ${year} was ${Math.round(performace[year].avgGrade)}% where city average was ${Math.round(cityPerformance[year].avgGrade)} %`,
                weight: .75
            }
        }
        return {
            message: `Overall performance of all subjects in school in ${year} was ${Math.round(performace[year].avgGrade)} percentage`,
            weight: .45
        }
    }
    if(isConsistent) {
        //Todo: compare with city performance
        return {
            message: `Overall performance of school remain consistent around ${Math.round(performace[year].avgGrade)}% in last few years`,
            weight: .65
        }
    }
    else if(performace[latestYears[len-1]].avgGrade > performace[latestYears[len-2]].avgGrade){
        return {
            message: `Compare to previous year, school grade performance increased to ${Math.round(performace[year].avgGrade)}% in year ${year},`,
            weight: .75
        }
    }
    else {
        return {
            message: `Compare to previous year, school grade performance reduced to ${Math.round(performace[year].avgGrade)}% in year ${year},`,
            weight: .75
        }
    } 
}

const studentConsistency = (data) => {
    const year = data.school.latestYear;
    const performace = data.school.performace
    const LIMIT = 3;
    const latestYears = []; // last 3/LIMIT years
    for (let i = 0; i < LIMIT; i++) {
        if(data.school.performace.hasOwnProperty(year-i))
            latestYears.push(year-i);
    }
    latestYears.reverse();
    const len = latestYears.length;
    let isConsistent = true;
    for (let i = 1; i < latestYears.length; i++) {
        const prev = performace[latestYears[i-1]].studentsCount;
        const curr = performace[latestYears[i]].studentsCount;
        const multiplier = parseInt(latestYears[i]-latestYears[i-1])/10;
        
        if(curr < prev*(1-multiplier) || curr > prev*(1+multiplier)) {
            isConsitant = false;
            break;
        }
    }
    if(len==1) {
        // Todo: Compare with city
        return {
            message: `${performace[year].studentsCount} students were enrolled in year ${year}`,
            weight: .45
        }
    }
    if(isConsistent) {
        //Todo: compare with city performance
        return {
            message: `Overall students enrolled in an academic sessions of the school remain consistent around ${performace[year].studentsCount} in last few years`,
            weight: .65
        }
    }
    else if(performace[latestYears[len-1]].studentsCount > performace[latestYears[len-2]].studentsCount){
        return {
            message: `Compare to previous year, students enrollment increased to ${performace[year].studentsCount} in year ${year},`,
            weight: .75
        }
    }
    else {
        const diff = performace[latestYears[len-2]].studentsCount - performace[latestYears[len-1]].studentsCount
        return {
            message: `Compare to previous year, students enrollment reduced to ${performace[year].studentsCount},  which is ${diff} less`,
            weight: .75
        }
    } 
}

const getSentences = (data) => {
    const results = [];
    results.push(subjectsList(data.school.offeredSubject, data.school.name, data.city.name, data.school.latestYear));
    results.push(batchSize(data.school.batchSize, data.city.batchSize));
    results.push(isOnlySchoolInCity(data.city.schoolsCount, data.city.name));
    results.push(subjectCoverage(data));
    results.push(bestSubjects(data));
    results.push(worstSubjects(data));
    results.push(gradeConsistancy(data));
    results.push(studentConsistency(data));
    return results;
}


module.exports = {
    getSentences,
}