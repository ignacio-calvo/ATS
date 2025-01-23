using System.Security.AccessControl;

var builder = DistributedApplication.CreateBuilder(args);

//Declaring Variables/Secrets
var envIdentityJwtKey = builder.AddParameter("IdentityJwtKey");

var envDBServer = builder.AddParameter("DBServer");
var envDBUser = builder.AddParameter("DBUser");
var envDBPassword = builder.AddParameter("DBPassword");
var envDBName = builder.AddParameter("DBName");

var envInterviewsApiUrl = builder.AddParameter("InterviewsApiUrl");

var interviewsApi = builder.AddProject<Projects.ATS_Interviews_API>("atsinterviewsapi");


builder.AddNpmApp("InterviewsFrontend", "../../ATS.Interviews.Frontend")
    .WithReference(interviewsApi)
    .WaitFor(interviewsApi)
    .WithEnvironment("BROWSER", "none") // Disable opening browser on npm start
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints();

builder.Build().Run();
