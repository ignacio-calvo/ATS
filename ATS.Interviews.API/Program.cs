using ATS.Interviews.Business.Services;
using ATS.Interviews.Business.Services.Interfaces;
using ATS.Interviews.Data;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using System.Text.Json.Serialization;

var MyAllowSpecificOrigins = "_myAllowLocalOrigins";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.SetIsOriginAllowed(origin =>
                          {
                              var uri = new Uri(origin);
                              return uri.Host == "localhost";
                          })
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                      });
});

// Load environment variables from .env file
DotNetEnv.Env.Load();

// Add services to the container.
var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
                       ?? builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection' is not set.");
}

builder.Services.AddDbContext<InterviewDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<IInterviewerService, InterviewerService>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();
builder.Services.AddScoped<IInterviewTemplateService, InterviewTemplateService>();
builder.Services.AddScoped<ICandidateService, CandidateService>();
builder.Services.AddScoped<IInterviewService, InterviewService>();
builder.Services.AddScoped<ISectionService, SectionService>();
builder.Services.AddScoped<IQuestionService, QuestionService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = false;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed data
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<InterviewDbContext>();
    await dbContext.SeedDataAsync();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();

    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
