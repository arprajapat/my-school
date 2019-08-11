const overallPerformace = (grades) => {
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

const distictSubject = (grades) => {
    return [... new Set(grades.map(grade => grade.subject))]
};

const getCityMetrics =  (grades) => {
    // const { latestBestSubjects,  latestWorstSubjects } = latestBestWorstSubjects(grades);
    const result = {
        subjectOffered: distictSubject(grades),
        overallPerformace: overallPerformace(grades),
    }

    // console.log(result);
    // const obj = groupBy(grades, 'subject', 'year');
    // const obj1 = groupBy(grades, 'year', 'subject');
    return result;
}

module.exports = {
    getCityMetrics,
}