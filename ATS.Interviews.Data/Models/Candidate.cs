namespace ATS.Interviews.Data.Models
{
    public class Candidate
    {
        public int Id { get; set; }
        public string FirstName { get; set; } 
        public string LastName { get; set; } 
        public string Email { get; set; }
        public string? ResumeLink { get; set; }
        public string? LinkedInProfile { get; set; }
        public string? GitHubProfile { get; set; }
        public string? OtherProfile { get; set; }
        public List<Interview> Interviews { get; set; } = new List<Interview>();
    }
}


