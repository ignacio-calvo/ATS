using System.Collections.Generic;

namespace ATS.Interviews.Data.Models
{
    public class Section
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<Question> Questions { get; set; } = new List<Question>();
        public List<InterviewTemplateSection> InterviewTemplateSections { get; set; } = new List<InterviewTemplateSection>();
        public int Order { get; set; } // Added Order property to support section ordering
    }
}
