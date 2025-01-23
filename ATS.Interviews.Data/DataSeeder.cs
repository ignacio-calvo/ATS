using ATS.Interviews.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ATS.Interviews.Data
{
    public static class DataSeeder
    {
        public static async Task SeedData(InterviewDbContext context)
        {
            if (await context.Sections.AnyAsync())
            {
                return; // DB has been seeded
            }

            var restSection = new Section
            {
                Name = "REST",
                Questions = new List<Question>
                                    {
                                        new Question { Text = "What is REST?", Hint = "Representational State Transfer", Order = 1 },
                                        new Question { Text = "What are HTTP methods?", Hint = "GET, POST, PUT, DELETE, etc.", Order = 2 },
                                        new Question { Text = "What is the difference between PUT and POST?", Hint = "PUT is idempotent, POST is not", Order = 3 },
                                        new Question { Text = "What is CORS?", Hint = "Cross-Origin Resource Sharing", Order = 4 },
                                        new Question { Text = "How do you secure a REST API?", Hint = "Authentication, Authorization, HTTPS", Order = 5 },
                                        new Question { Text = "What are HTTP status codes?", Hint = "200 OK, 404 Not Found, 500 Internal Server Error, etc.", Order = 6 },
                                        new Question { Text = "What is an idempotent operation?", Hint = "An operation that can be applied multiple times without changing the result", Order = 7 },
                                        new Question { Text = "What is the purpose of HTTP headers?", Hint = "To pass additional information with the request or response", Order = 8 },
                                        new Question { Text = "What is a RESTful service?", Hint = "A service that follows REST principles", Order = 9 },
                                        new Question { Text = "What is the difference between synchronous and asynchronous requests?", Hint = "Synchronous waits for the response, asynchronous does not", Order = 10 }
                                    }
            };

            var dotNetSection = new Section
            {
                Name = ".NET",
                Questions = new List<Question>
                                    {
                                        new Question { Text = "What is .NET?", Hint = "A software development framework", Order = 1 },
                                        new Question { Text = "What is the CLR?", Hint = "Common Language Runtime", Order = 2 },
                                        new Question { Text = "What is the difference between .NET Core and .NET Framework?", Hint = ".NET Core is cross-platform, .NET Framework is Windows-only", Order = 3 },
                                        new Question { Text = "What is garbage collection?", Hint = "Automatic memory management", Order = 4 },
                                        new Question { Text = "What are assemblies in .NET?", Hint = "Compiled code libraries", Order = 5 },
                                        new Question { Text = "What is dependency injection?", Hint = "A design pattern for managing dependencies", Order = 6 },
                                        new Question { Text = "What is ASP.NET Core?", Hint = "A framework for building web applications", Order = 7 },
                                        new Question { Text = "What is Entity Framework?", Hint = "An ORM for .NET", Order = 8 },
                                        new Question { Text = "What is LINQ?", Hint = "Language Integrated Query", Order = 9 },
                                        new Question { Text = "What is the difference between a class and an object?", Hint = "A class is a blueprint, an object is an instance", Order = 10 }
                                    }
            };

            var frontEndSection = new Section
            {
                Name = "Front End (React)",
                Questions = new List<Question>
                                    {
                                        new Question { Text = "What is JavaScript?", Hint = "A programming language for the web", Order = 1 },
                                        new Question { Text = "What is TypeScript?", Hint = "A superset of JavaScript with static types", Order = 2 },
                                        new Question { Text = "What is React?", Hint = "A JavaScript library for building user interfaces", Order = 3 },
                                        new Question { Text = "What is JSX?", Hint = "JavaScript XML, a syntax extension for React", Order = 4 },
                                        new Question { Text = "What is the virtual DOM?", Hint = "A lightweight copy of the real DOM", Order = 5 },
                                        new Question { Text = "What are hooks in React?", Hint = "Functions that let you use state and other React features", Order = 6 },
                                        new Question { Text = "What is the difference between state and props in React?", Hint = "State is local to a component, props are passed from parent to child", Order = 7 },
                                        new Question { Text = "What is a component in React?", Hint = "A reusable piece of UI", Order = 8 },
                                        new Question { Text = "What is the context API in React?", Hint = "A way to pass data through the component tree without props", Order = 9 },
                                        new Question { Text = "What is a single-page application (SPA)?", Hint = "A web application that loads a single HTML page and dynamically updates as the user interacts with the app", Order = 10 }
                                    }
            };

            var nodeSection = new Section
            {
                Name = "NodeJS",
                Questions = new List<Question>
                                    {
                                        new Question { Text = "What is NodeJS?", Hint = "A JavaScript runtime built on Chrome's V8 engine", Order = 1 },
                                        new Question { Text = "What is npm?", Hint = "Node Package Manager", Order = 2 },
                                        new Question { Text = "What is the difference between CommonJS and ES Modules?", Hint = "CommonJS uses require(), ES Modules use import/export", Order = 3 },
                                        new Question { Text = "What is an event loop in NodeJS?", Hint = "A mechanism that handles asynchronous operations", Order = 4 },
                                        new Question { Text = "What is Express.js?", Hint = "A web application framework for NodeJS", Order = 5 },
                                        new Question { Text = "What is middleware in Express.js?", Hint = "Functions that execute during the lifecycle of a request to the server", Order = 6 },
                                        new Question { Text = "What is the purpose of package.json?", Hint = "To manage project dependencies and scripts", Order = 7 },
                                        new Question { Text = "What is the difference between synchronous and asynchronous code in NodeJS?", Hint = "Synchronous code blocks the event loop, asynchronous code does not", Order = 8 },
                                        new Question { Text = "What is a callback function?", Hint = "A function passed into another function as an argument", Order = 9 },
                                        new Question { Text = "What is the purpose of the 'fs' module in NodeJS?", Hint = "To handle file system operations", Order = 10 }
                                    }
            };

            var candidates = new List<Candidate>
                            {
                                new Candidate { FirstName = "John", LastName = "Doe", Email = "john.doe@example.com" },
                                new Candidate { FirstName = "Jane", LastName = "Smith", Email = "jane.smith@example.com" },
                                new Candidate { FirstName = "Alice", LastName = "Johnson", Email = "alice.johnson@example.com" },
                                new Candidate { FirstName = "Bob", LastName = "Brown", Email = "bob.brown@example.com" }
                            };

            var interviewers = new List<Interviewer>
                            {
                                new Interviewer { FirstName = "Alice", LastName = "Green", Email = "alice.green@example.com" },
                                new Interviewer { FirstName = "Bob", LastName = "White", Email = "bob.white@example.com" },
                                new Interviewer { FirstName = "Charlie", LastName = "Black", Email = "charlie.black@example.com" }
                            };

            var interviewTemplateDotNetReact = new InterviewTemplate
            {
                Name = "Technical Interview (.NET & React)"
            };

            var interviewTemplateNodeReact = new InterviewTemplate
            {
                Name = "Technical Interview (Node & React)"
            };

            var interviewTemplateSectionsDotNetReact = new List<InterviewTemplateSection>
                                {
                                    new InterviewTemplateSection { InterviewTemplate = interviewTemplateDotNetReact, Section = restSection, Order = 1 },
                                    new InterviewTemplateSection { InterviewTemplate = interviewTemplateDotNetReact, Section = dotNetSection, Order = 2 },
                                    new InterviewTemplateSection { InterviewTemplate = interviewTemplateDotNetReact, Section = frontEndSection, Order = 3 }
                                };

            var interviewTemplateSectionsNodeReact = new List<InterviewTemplateSection>
                                {
                                    new InterviewTemplateSection { InterviewTemplate = interviewTemplateNodeReact, Section = restSection, Order = 1 },
                                    new InterviewTemplateSection { InterviewTemplate = interviewTemplateNodeReact, Section = nodeSection, Order = 2 },
                                    new InterviewTemplateSection { InterviewTemplate = interviewTemplateNodeReact, Section = frontEndSection, Order = 3 }
                                };

            var interview = new Interview
            {
                Candidate = candidates[0],
                ScheduledDate = DateTime.Now.AddDays(5)
            };

            var interviewInterviewers = new List<InterviewInterviewer>
                {
                    new InterviewInterviewer { Interview = interview, Interviewer = interviewers[0], InterviewTemplate = interviewTemplateDotNetReact },
                    new InterviewInterviewer { Interview = interview, Interviewer = interviewers[1], InterviewTemplate = interviewTemplateNodeReact }
                };

            context.Candidates.AddRange(candidates);
            context.Interviewers.AddRange(interviewers);
            context.InterviewTemplates.AddRange(new[] { interviewTemplateDotNetReact, interviewTemplateNodeReact });
            context.InterviewTemplateSections.AddRange(interviewTemplateSectionsDotNetReact);
            context.InterviewTemplateSections.AddRange(interviewTemplateSectionsNodeReact);
            context.Interviews.Add(interview);
            context.InterviewInterviewers.AddRange(interviewInterviewers);
            await context.SaveChangesAsync();
        }
    }
}



