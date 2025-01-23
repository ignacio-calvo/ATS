using ATS.Interviews.Data.Models;

namespace ATS.Interviews.Business.Services.Interfaces
{
    public interface ISectionService
    {
        Task<IEnumerable<Section>> GetSectionsAsync();
        Task<Section> GetSectionByIdAsync(int id);
        Task<Section> CreateSectionAsync(Section section);
        Task UpdateSectionAsync(int id, Section section);
        Task DeleteSectionAsync(int id);
    }
}




