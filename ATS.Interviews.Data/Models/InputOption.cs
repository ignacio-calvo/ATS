namespace ATS.Interviews.Data.Models
{
    public class InputOption
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public required string OptionText { get; set; }
        public Question? Question { get; set; }
    }
}
