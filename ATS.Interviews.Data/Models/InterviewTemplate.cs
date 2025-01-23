using System.Collections.Generic;

namespace ATS.Interviews.Data.Models
{
    public class InterviewTemplate
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<InterviewTemplateSection> InterviewTemplateSections { get; set; } = new List<InterviewTemplateSection>();
    }
}
