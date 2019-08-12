
const getLatestYear = (grades) => {
    let latestYear;
    for (const grade of grades) {
        latestYear = latestYear == undefined ? grade.year : latestYear
        latestYear = latestYear > grade.year ? latestYear : grade.year
    }
    return latestYear;
}

const distictSubjects = (grades) => {
    return [... new Set(grades.map(grade => grade.subject))]
};
 
const performace = (grades) => {
    const result = {};
    grades.map((item) => {
        if(!result.hasOwnProperty(item.year))  {
            result[item.year] = {
                studentsCount: item.studentsCount,
                avgGrade: item.avgGrade,
                batchCount: item.batchCount
            };
        }
        else {
            const temp = {
                studentsCount: item.studentsCount + result[item.year].studentsCount,
                avgGrade: ( item.studentsCount * item.avgGrade 
                    + result[item.year].studentsCount * result[item.year].avgGrade )
                    /(item.studentsCount+result[item.year].studentsCount),
                batchCount: item.batchCount + result[item.year].batchCount

            }
            result[item.year] = temp;
        }
    });
    // console.log(result)
    return result; 
}

const getBestWorstSubjects = (grades, year) => {
    const filtered = grades.filter(grade => grade.year == year);
    filtered.sort((a,b) => b.avgGrade-a.avgGrade);

    const len = filtered.length;

    const result = {
        bestSubjects:[],
        worstSubjects:[]
    }
    if(len>0) {
        result.bestSubjects = filtered.filter(grade => grade.avgGrade >= filtered[0].avgGrade);
        result.worstSubjects = filtered.filter(grade => grade.avgGrade <= filtered[len-1].avgGrade && grade.avgGrade != filtered[0]);
    }

    return result;
}

const batchSize = (grades, year, subject) => {
    let filtered = grades.filter(grade => grade.year == year);
    // console.log(filtered);
    if(subject) {
        filtered = filtered.filter(grade => grade.subject == subject)
    }
    let students = 0;
    let batchCount = 0;
    for (const grade of filtered) {
        students += grade.studentsCount
        batchCount += grade.batchCount
    }
    if(batchCount == 0) return 0;
    return Math.round(students/batchCount)
}

const getCorrespondingCitySubjects = (cityGrades, grades) => {
    return grades.map(grade => {
        return cityGrades.filter(cityGrade => cityGrade.subject == grade.subject 
            && cityGrade.year == grade.year)[0]
    });
}

module.exports = {
    batchSize,
    distictSubjects, 
    getBestWorstSubjects,
    getCorrespondingCitySubjects,
    getLatestYear,
    performace,
}