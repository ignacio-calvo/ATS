using Microsoft.EntityFrameworkCore;
using ATS.Interviews.Data.Models;

namespace ATS.Interviews.Data
{
    public class InterviewDbContext : DbContext
    {
        public DbSet<InterviewTemplate> InterviewTemplates { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Interviewer> Interviewers { get; set; }
        public DbSet<Candidate> Candidates { get; set; }
        public DbSet<Interview> Interviews { get; set; }
        public DbSet<InterviewTemplateSection> InterviewTemplateSections { get; set; }
        public DbSet<InterviewInterviewer> InterviewInterviewers { get; set; }
        public DbSet<InputOption> InputOptions { get; set; }

        public InterviewDbContext(DbContextOptions<InterviewDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Feedback>()
                .HasKey(f => f.Id);

            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Interview)
                .WithMany(i => i.Feedbacks)
                .HasForeignKey(f => f.InterviewId);

            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Interviewer)
                .WithMany(i => i.Feedbacks)
                .HasForeignKey(f => f.InterviewerId);

            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Question)
                .WithMany()
                .HasForeignKey(f => f.QuestionId);

            modelBuilder.Entity<Interviewer>()
                .HasKey(i => i.Id);

            modelBuilder.Entity<InterviewTemplate>()
                .HasKey(it => it.Id);

            modelBuilder.Entity<Section>()
                .HasKey(s => s.Id);

            modelBuilder.Entity<Section>()
                .HasMany(s => s.Questions)
                .WithOne()
                .HasForeignKey(q => q.SectionId);

            modelBuilder.Entity<Question>()
                .HasKey(q => q.Id);

            modelBuilder.Entity<Question>()
                .HasMany(q => q.InputOptions)
                .WithOne(io => io.Question)
                .HasForeignKey(io => io.QuestionId);

            modelBuilder.Entity<Candidate>()
                .HasKey(c => c.Id);

            modelBuilder.Entity<Interview>()
                .HasKey(i => i.Id);

            modelBuilder.Entity<Interview>()
                .HasOne(i => i.Candidate)
                .WithMany(c => c.Interviews)
                .HasForeignKey(i => i.CandidateId);

            // Configure many-to-many relationship between Interview and Interviewer
            modelBuilder.Entity<InterviewInterviewer>()
                .HasKey(ii => new { ii.InterviewId, ii.InterviewerId });

            modelBuilder.Entity<InterviewInterviewer>()
                .HasOne(ii => ii.Interview)
                .WithMany(i => i.InterviewInterviewers)
                .HasForeignKey(ii => ii.InterviewId);

            modelBuilder.Entity<InterviewInterviewer>()
                .HasOne(ii => ii.Interviewer)
                .WithMany(i => i.InterviewInterviewers)
                .HasForeignKey(ii => ii.InterviewerId);

            modelBuilder.Entity<InterviewInterviewer>()
                .HasOne(ii => ii.InterviewTemplate)
                .WithMany()
                .HasForeignKey(ii => ii.InterviewTemplateId);

            // Configure auto-increment for Id properties
            modelBuilder.Entity<Feedback>()
                .Property(f => f.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Interviewer>()
                .Property(i => i.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<InterviewTemplate>()
                .Property(it => it.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Section>()
                .Property(s => s.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Question>()
                .Property(q => q.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<InputOption>()
                .Property(io => io.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Candidate>()
                .Property(c => c.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Interview>()
                .Property(i => i.Id)
                .ValueGeneratedOnAdd();

            // Configure many-to-many relationship between InterviewTemplate and Section
            modelBuilder.Entity<InterviewTemplateSection>()
                .HasKey(its => new { its.InterviewTemplateId, its.SectionId });

            modelBuilder.Entity<InterviewTemplateSection>()
                .HasOne(its => its.InterviewTemplate)
                .WithMany(it => it.InterviewTemplateSections)
                .HasForeignKey(its => its.InterviewTemplateId);

            modelBuilder.Entity<InterviewTemplateSection>()
                .HasOne(its => its.Section)
                .WithMany(s => s.InterviewTemplateSections)
                .HasForeignKey(its => its.SectionId);
        }

        public async Task SeedDataAsync()
        {
            await DataSeeder.SeedData(this);
        }
    }
}
