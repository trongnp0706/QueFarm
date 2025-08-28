using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using QueFarm.Server.Core.Services;
using System.Net;
using System.Net.Mail;

namespace QueFarm.Server.Application.Services
{
	public class SmtpEmailService : IEmailService
	{
		private readonly EmailSettings _settings;
		private readonly ILogger<SmtpEmailService> _logger;

		public SmtpEmailService(IOptions<EmailSettings> options, ILogger<SmtpEmailService> logger)
		{
			_settings = options.Value;
			_logger = logger;
		}

		public async Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken cancellationToken = default)
		{
			var fromAddress = string.IsNullOrWhiteSpace(_settings.From) ? _settings.UserName : _settings.From;
			if (string.IsNullOrWhiteSpace(_settings.Host) || string.IsNullOrWhiteSpace(fromAddress))
			{
				_logger.LogWarning("Email settings are not configured. Skipping email to {To}", toEmail);
				return;
			}

			using var client = new SmtpClient(_settings.Host, _settings.Port)
			{
				EnableSsl = _settings.EnableSsl,
				Credentials = string.IsNullOrWhiteSpace(_settings.UserName)
					? CredentialCache.DefaultNetworkCredentials
					: new NetworkCredential(_settings.UserName, _settings.Password)
			};

			using var msg = new MailMessage()
			{
				From = new MailAddress(fromAddress),
				Subject = subject,
				Body = htmlBody,
				IsBodyHtml = true
			};
			msg.To.Add(new MailAddress(toEmail));

			try
			{
				await client.SendMailAsync(msg, cancellationToken);
				_logger.LogInformation("Sent email to {To} with subject {Subject}", toEmail, subject);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Failed to send email to {To} with subject {Subject}", toEmail, subject);
				throw;
			}
		}
	}
}

