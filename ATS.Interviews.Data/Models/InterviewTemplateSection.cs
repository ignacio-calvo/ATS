namespace ATS.Interviews.Data.Models
{
    public class InterviewTemplateSection
    {
        public int InterviewTemplateId { get; set; }
        public InterviewTemplate? InterviewTemplate { get; set; }
        public int SectionId { get; set; }
        public Section? Section { get; set; }
        public int Order { get; set; } 
    }
}
