namespace ATS.Interviews.Data.Models
{
    public class Feedback
    {
        public int Id { get; set; }
        public int InterviewId { get; set; }
        public int InterviewerId { get; set; }
        public int QuestionId { get; set; }
        public string? Comments { get; set; }
        public int? Rating { get; set; }
        public int? SelectedOptionId { get; set; } 
        public DateTime CapturedAt { get; set; }
        public Interview? Interview { get; set; }
        public Interviewer? Interviewer { get; set; }
        public Question? Question { get; set; }
        public InputOption? SelectedOption { get; set; }
    }
}
