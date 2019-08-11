// const groupBy = (items, groupKey, sortKey) => {
//     const result = {};
//     items.map((item) => {
//         if(item[groupKey]) {
//             if(!result.hasOwnProperty(item[groupKey]))  {
//                 result[item[groupKey]] = [];
//             }
//             result[item[groupKey]].push(item);
//             if(sortKey)
//                 result[item[groupKey]].sort((a,b) => a[sortKey] - b[sortKey]);
//         }
       
//     })
//     return result;
// }
// const consistancyYearWise = (grades) => {
//     const result = {};
//     grades.map((item) => {
//         if(!result.hasOwnProperty(item.year))  {
//             result[item.year] = {
//                 studentsCount: item.studentsCount,
//                 avgGrade: item.avgGrade,
//                 batchCount: item.batchCount
//             };
//         }
//         else {
//             const temp = {
//                 studentsCount: item.studentsCount + result[item.year].studentsCount,
//                 avgGrade: ( item.studentsCount * item.avgGrade 
//                     + result[item.year].studentsCount * result[item.year].avgGrade )
//                     /(item.studentsCount+result[item.year].studentsCount),
//                 batchCount: item.batchCount + result[item.year].batchCount

//             }
//             result[item.year] = temp;
//         }
//     });
//     // console.log(result)
//     return result; 
// }



// const gradeConsistancy = (grades) => {
//     const subjetWise = groupBy(grades, 'subject', 'year');
//     const overAll = groupBy(grades, 'city', 'year');
//     const aggr = {};
//     for (let [key, value] of Object.entries(subjetWise)) {
//         aggr[key] = consistancyYearWise(value);
//     }
//     aggr['overall'] = consistancyYearWise(grades);
//     console.log(aggr)
//     // consistancyYearWise
//     // console.log(subjetWise);
//     // console.log(overAll);
// }
// Used utils;


// Used one methods;
const distictSubject = (grades) => {
    return [... new Set(grades.map(grade => grade.subject))]
};
 
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

const latestBestWorstSubjects = (grades) => {
    grades.sort((a,b) => b.avgGrade-a.avgGrade);
    grades.sort((a,b) => b.year-a.year);
    // console.log(grades);
    const result = {
        latestBestSubjects:[],
        latestWorstSubjects:[]
    }
    if(grades.length) {
        const filtered = grades.filter(grade => grade.year == grades[0].year);
        result.latestBestSubjects = filtered.filter(grade => (grade.avgGrade >= grades[0].avgGrade));
        filtered.sort((a,b) => a.avgGrade-b.avgGrade);
        result.latestWorstSubjects = filtered.filter(grade => grade.avgGrade <= filtered[0].avgGrade && grade.avgGrade != filtered[filtered.length-1])
    }
    return result;
}

const getMetrics =  (grades) => {
    const { latestBestSubjects,  latestWorstSubjects } = latestBestWorstSubjects(grades);
    const result = {
        subjectOffered: distictSubject(grades),
        overallPerformace: overallPerformace(grades),
        latestBestSubjects,
        latestWorstSubjects
    }

    // console.log(result);
    // const obj = groupBy(grades, 'subject', 'year');
    // const obj1 = groupBy(grades, 'year', 'subject');
    return result;
}


module.exports = {
    getMetrics,
}