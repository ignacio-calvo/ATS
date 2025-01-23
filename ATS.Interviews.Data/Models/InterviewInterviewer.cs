namespace ATS.Interviews.Data.Models
{
    public class InterviewInterviewer
    {
        public int InterviewId { get; set; }
        public Interview? Interview { get; set; }

        public int InterviewerId { get; set; }
        public Interviewer? Interviewer { get; set; }

        public int? InterviewTemplateId { get; set; }
        public InterviewTemplate? InterviewTemplate { get; set; }
    }
}
