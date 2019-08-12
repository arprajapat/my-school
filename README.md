# my-school

Assumptions
---
### General

- School name should be unique across the database(can support this later without much code change).
- Ignored API authorization;
 - while DB design, data normalization is ignored. have little data redundancy.   
 - Assuming data are available in tables as defined in schema and will be valid.
 - School result will be mostly based around the year which is latest available for the school
 - default running port `localhost:3000`
 - No test cases written
 - weightage of a metric is assume constant based on few parameters. 
 
# How Run Application
- create a database manually and udpate in config file `./config/config.json`
- add mysql `username` and `password` to config file
- Run Cmd: `npm start`
- No need create any tables manually.

# API Endpoints
- search school by name
```
{
 URL: v1/school/:schoolName
 Method: GET
}
```