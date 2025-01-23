using System.Text.Json.Serialization;

namespace ATS.Interviews.Data.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum InputType
    {
        Text,
        Rating,
        MultipleChoice
    }
}
