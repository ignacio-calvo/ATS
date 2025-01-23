namespace ATS.Interviews.Data.Models
{
    public class Interview
    {
        public int Id { get; set; }
        public int CandidateId { get; set; }
        public DateTime ScheduledDate { get; set; }
        public List<Feedback> Feedbacks { get; set; } = new List<Feedback>();

        public Candidate? Candidate { get; set; }

        public List<InterviewInterviewer> InterviewInterviewers { get; set; } = new List<InterviewInterviewer>();
        public string? JobDescriptionLink { get; set; }
    }
}

