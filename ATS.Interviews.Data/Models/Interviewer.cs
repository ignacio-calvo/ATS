namespace ATS.Interviews.Data.Models
{
    public class Interviewer
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public List<Feedback> Feedbacks { get; set; } = new List<Feedback>();
        public List<InterviewInterviewer> InterviewInterviewers { get; set; } = new List<InterviewInterviewer>(); 
    }
}
