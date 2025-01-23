namespace ATS.Interviews.Data.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string Hint { get; set; }
        public int SectionId { get; set; }
        public int Order { get; set; }
        public bool IsRequired { get; set; }
        public InputType InputType { get; set; }
        public List<InputOption>? InputOptions { get; set; }
    }
}
