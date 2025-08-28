using System.Threading;
using System.Threading.Tasks;

namespace QueFarm.Server.Core.Services
{
	public interface IEmailService
	{
		Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken cancellationToken = default);
	}

	public class EmailSettings
	{
		public string Host { get; set; } = string.Empty;
		public int Port { get; set; } = 587;
		public bool EnableSsl { get; set; } = true;
		public string UserName { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
		public string From { get; set; } = string.Empty;
		public string ToAdmin { get; set; } = string.Empty;
	}
}

