using QueFarm.Server.Core.DTOs;

namespace QueFarm.Server.Core.Services
{
    public interface IProductImportService
    {
        Task<ProductImportResponse> ImportFromExcelAsync(Stream excelStream, bool overwriteExisting = false);
        Task<byte[]> GenerateTemplateAsync();
    }
}

