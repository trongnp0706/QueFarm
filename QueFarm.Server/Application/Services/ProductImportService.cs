using AutoMapper;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using QueFarm.Server.Core.Domain.Entities;
using QueFarm.Server.Core.DTOs;
using QueFarm.Server.Core.Services;
using QueFarm.Server.Data;
using System.Globalization;

namespace QueFarm.Server.Application.Services
{
    public class ProductImportService : IProductImportService
    {
        private readonly QueFarmDbContext _context;
        private readonly IMapper _mapper;

        public ProductImportService(QueFarmDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        }

        public async Task<ProductImportResponse> ImportFromExcelAsync(Stream excelStream, bool overwriteExisting = false)
        {
            var response = new ProductImportResponse();
            var errors = new List<ProductImportError>();
            var importedProducts = new List<ProductDto>();

            try
            {
                using var package = new ExcelPackage(excelStream);
                var worksheet = package.Workbook.Worksheets[0];
                var rowCount = worksheet.Dimension?.Rows ?? 0;

                if (rowCount <= 1)
                {
                    errors.Add(new ProductImportError
                    {
                        Row = 0,
                        Field = "File",
                        Value = "",
                        Error = "File Excel trống hoặc không có dữ liệu"
                    });
                    response.Errors = errors;
                    return response;
                }

                // Lấy danh sách categories để map
                var categories = await _context.Categories.ToListAsync();
                var categoryMap = categories.ToDictionary(c => c.Name.ToLower(), c => c.Id);

                response.TotalRows = rowCount - 1; // Trừ header row

                for (int row = 2; row <= rowCount; row++)
                {
                    try
                    {
                        var excelRow = ReadExcelRow(worksheet, row);
                        var validationErrors = ValidateRow(excelRow, categoryMap);

                        if (validationErrors.Count > 0)
                        {
                            errors.AddRange(validationErrors);
                            response.ErrorCount++;
                            continue;
                        }

                        // Kiểm tra sản phẩm đã tồn tại
                        var existingProduct = await _context.Products
                            .FirstOrDefaultAsync(p => p.Name.ToLower() == excelRow.Name.ToLower());

                        Product product;
                        if (existingProduct != null)
                        {
                            if (!overwriteExisting)
                            {
                                errors.Add(new ProductImportError
                                {
                                    Row = row,
                                    Field = "Name",
                                    Value = excelRow.Name,
                                    Error = "Sản phẩm đã tồn tại. Bật 'Ghi đè' để cập nhật."
                                });
                                response.ErrorCount++;
                                continue;
                            }

                            // Cập nhật sản phẩm hiện có
                            UpdateProductFromExcelRow(existingProduct, excelRow, categoryMap);
                            product = existingProduct;
                        }
                        else
                        {
                            // Tạo sản phẩm mới
                            product = CreateProductFromExcelRow(excelRow, categoryMap);
                            _context.Products.Add(product);
                        }

                        await _context.SaveChangesAsync();

                        var productDto = _mapper.Map<ProductDto>(product);
                        if (product.Category != null)
                        {
                            productDto.CategoryName = product.Category.Name;
                        }
                        else
                        {
                            var category = categories.FirstOrDefault(c => c.Id == product.CategoryId);
                            productDto.CategoryName = category?.Name ?? "";
                        }

                        importedProducts.Add(productDto);
                        response.SuccessCount++;
                    }
                    catch (Exception ex)
                    {
                        errors.Add(new ProductImportError
                        {
                            Row = row,
                            Field = "General",
                            Value = "",
                            Error = $"Lỗi không mong đợi: {ex.Message}"
                        });
                        response.ErrorCount++;
                    }
                }
            }
            catch (Exception ex)
            {
                errors.Add(new ProductImportError
                {
                    Row = 0,
                    Field = "File",
                    Value = "",
                    Error = $"Lỗi đọc file Excel: {ex.Message}"
                });
            }

            response.Errors = errors;
            response.ImportedProducts = importedProducts;
            return response;
        }

        public async Task<byte[]> GenerateTemplateAsync()
        {
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Products Template");

            // Headers
            var headers = new[]
            {
                "Tên sản phẩm (*)",
                "Giá bán (*)",
                "Giá gốc",
                "Mô tả",
                "Số lượng tồn",
                "Danh mục (*)",
                "Xuất xứ",
                "Khối lượng",
                "Vùng miền",
                "URL hình ảnh",
                "Kích hoạt"
            };

            for (int i = 0; i < headers.Length; i++)
            {
                worksheet.Cells[1, i + 1].Value = headers[i];
                worksheet.Cells[1, i + 1].Style.Font.Bold = true;
            }

            // Sample data
            var categories = await _context.Categories.Select(c => c.Name).ToListAsync();
            var sampleCategory = categories.FirstOrDefault() ?? "Rau củ quả";

            worksheet.Cells[2, 1].Value = "Cà chua cherry";
            worksheet.Cells[2, 2].Value = 45000;
            worksheet.Cells[2, 3].Value = 50000;
            worksheet.Cells[2, 4].Value = "Cà chua cherry tươi ngon, giàu vitamin";
            worksheet.Cells[2, 5].Value = 100;
            worksheet.Cells[2, 6].Value = sampleCategory;
            worksheet.Cells[2, 7].Value = "Đà Lạt";
            worksheet.Cells[2, 8].Value = "500g";
            worksheet.Cells[2, 9].Value = "Lâm Đồng";
            worksheet.Cells[2, 10].Value = "";
            worksheet.Cells[2, 11].Value = "TRUE";

            // Auto-fit columns
            worksheet.Cells.AutoFitColumns();

            // Add data validation for Category column
            if (categories.Count > 0)
            {
                var categoryRange = worksheet.Cells[2, 6, 1000, 6];
                var validation = categoryRange.DataValidation.AddListDataValidation();
                foreach (var category in categories)
                {
                    validation.Formula.Values.Add(category);
                }
                validation.ShowErrorMessage = true;
                validation.ErrorTitle = "Danh mục không hợp lệ";
                validation.Error = $"Vui lòng chọn từ danh sách: {string.Join(", ", categories)}";
            }

            // Add instructions worksheet
            var instructionsWs = package.Workbook.Worksheets.Add("Hướng dẫn");
            instructionsWs.Cells[1, 1].Value = "HƯỚNG DẪN IMPORT SẢN PHẨM";
            instructionsWs.Cells[1, 1].Style.Font.Bold = true;
            instructionsWs.Cells[1, 1].Style.Font.Size = 16;

            var instructions = new[]
            {
                "",
                "1. Các trường bắt buộc được đánh dấu (*)",
                "2. Tên sản phẩm: Không được trùng lặp",
                "3. Giá bán: Số tiền VNĐ (ví dụ: 45000)",
                "4. Danh mục: Phải khớp với danh mục đã có trong hệ thống",
                "5. Kích hoạt: TRUE/FALSE hoặc để trống (mặc định TRUE)",
                "",
                "Danh sách danh mục hiện có:",
            };

            for (int i = 0; i < instructions.Length; i++)
            {
                instructionsWs.Cells[i + 2, 1].Value = instructions[i];
            }

            int startRow = instructions.Length + 2;
            for (int i = 0; i < categories.Count; i++)
            {
                instructionsWs.Cells[startRow + i, 1].Value = $"- {categories[i]}";
            }

            instructionsWs.Cells.AutoFitColumns();

            return package.GetAsByteArray();
        }

        private ProductExcelRow ReadExcelRow(ExcelWorksheet worksheet, int row)
        {
            return new ProductExcelRow
            {
                Row = row,
                Name = GetCellValue<string>(worksheet, row, 1) ?? "",
                Price = ParseDecimal(GetCellValue<string>(worksheet, row, 2)),
                OriginalPrice = ParseDecimal(GetCellValue<string>(worksheet, row, 3)),
                Description = GetCellValue<string>(worksheet, row, 4),
                StockQuantity = ParseInt(GetCellValue<string>(worksheet, row, 5)),
                CategoryName = GetCellValue<string>(worksheet, row, 6),
                Origin = GetCellValue<string>(worksheet, row, 7),
                Weight = GetCellValue<string>(worksheet, row, 8),
                Region = GetCellValue<string>(worksheet, row, 9),
                ImageUrl = GetCellValue<string>(worksheet, row, 10),
                IsActive = ParseBool(GetCellValue<string>(worksheet, row, 11))
            };
        }

        private T? GetCellValue<T>(ExcelWorksheet worksheet, int row, int col)
        {
            var cell = worksheet.Cells[row, col];
            if (cell.Value == null) return default;

            try
            {
                if (typeof(T) == typeof(string))
                    return (T)(object)cell.Value.ToString()!;
                return (T)Convert.ChangeType(cell.Value, typeof(T));
            }
            catch
            {
                return default;
            }
        }

        private decimal? ParseDecimal(string? value)
        {
            if (string.IsNullOrWhiteSpace(value)) return null;
            if (decimal.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out var result))
                return result;
            return null;
        }

        private int? ParseInt(string? value)
        {
            if (string.IsNullOrWhiteSpace(value)) return null;
            if (int.TryParse(value, out var result))
                return result;
            return null;
        }

        private bool? ParseBool(string? value)
        {
            if (string.IsNullOrWhiteSpace(value)) return true; // Default to active
            value = value.ToLower().Trim();
            return value switch
            {
                "true" or "1" or "yes" or "có" or "x" => true,
                "false" or "0" or "no" or "không" => false,
                _ => true
            };
        }

        private List<ProductImportError> ValidateRow(ProductExcelRow row, Dictionary<string, int> categoryMap)
        {
            var errors = new List<ProductImportError>();

            // Validate required fields
            if (string.IsNullOrWhiteSpace(row.Name))
            {
                errors.Add(new ProductImportError
                {
                    Row = row.Row,
                    Field = "Name",
                    Value = row.Name,
                    Error = "Tên sản phẩm là bắt buộc"
                });
            }

            if (!row.Price.HasValue || row.Price <= 0)
            {
                errors.Add(new ProductImportError
                {
                    Row = row.Row,
                    Field = "Price",
                    Value = row.Price?.ToString() ?? "",
                    Error = "Giá bán phải là số dương"
                });
            }

            if (string.IsNullOrWhiteSpace(row.CategoryName))
            {
                errors.Add(new ProductImportError
                {
                    Row = row.Row,
                    Field = "CategoryName",
                    Value = row.CategoryName ?? "",
                    Error = "Danh mục là bắt buộc"
                });
            }
            else if (!categoryMap.ContainsKey(row.CategoryName.ToLower()))
            {
                errors.Add(new ProductImportError
                {
                    Row = row.Row,
                    Field = "CategoryName",
                    Value = row.CategoryName,
                    Error = $"Danh mục '{row.CategoryName}' không tồn tại trong hệ thống"
                });
            }

            // Validate optional fields
            if (row.OriginalPrice.HasValue && row.Price.HasValue && row.OriginalPrice < row.Price)
            {
                errors.Add(new ProductImportError
                {
                    Row = row.Row,
                    Field = "OriginalPrice",
                    Value = row.OriginalPrice.ToString(),
                    Error = "Giá gốc phải lớn hơn hoặc bằng giá bán"
                });
            }

            if (row.StockQuantity.HasValue && row.StockQuantity < 0)
            {
                errors.Add(new ProductImportError
                {
                    Row = row.Row,
                    Field = "StockQuantity",
                    Value = row.StockQuantity.ToString(),
                    Error = "Số lượng tồn không được âm"
                });
            }

            return errors;
        }

        private Product CreateProductFromExcelRow(ProductExcelRow row, Dictionary<string, int> categoryMap)
        {
            var discountPercentage = CalculateDiscountPercentage(row.Price, row.OriginalPrice);

            return new Product
            {
                Name = row.Name,
                Price = row.Price!.Value,
                OriginalPrice = row.OriginalPrice,
                DiscountPercentage = discountPercentage,
                Description = row.Description,
                StockQuantity = row.StockQuantity ?? 0,
                CategoryId = categoryMap[row.CategoryName!.ToLower()],
                Origin = row.Origin,
                Weight = row.Weight,
                Region = row.Region,
                ImageUrl = row.ImageUrl,
                IsActive = row.IsActive ?? true,
                CreatedAt = DateTime.UtcNow
            };
        }

        private void UpdateProductFromExcelRow(Product product, ProductExcelRow row, Dictionary<string, int> categoryMap)
        {
            var discountPercentage = CalculateDiscountPercentage(row.Price, row.OriginalPrice);

            product.Name = row.Name;
            product.Price = row.Price!.Value;
            product.OriginalPrice = row.OriginalPrice;
            product.DiscountPercentage = discountPercentage;
            product.Description = row.Description;
            product.StockQuantity = row.StockQuantity ?? product.StockQuantity;
            product.CategoryId = categoryMap[row.CategoryName!.ToLower()];
            product.Origin = row.Origin;
            product.Weight = row.Weight;
            product.Region = row.Region;
            if (!string.IsNullOrWhiteSpace(row.ImageUrl))
            {
                product.ImageUrl = row.ImageUrl;
            }
            product.IsActive = row.IsActive ?? product.IsActive;
            product.UpdatedAt = DateTime.UtcNow;
        }

        private int? CalculateDiscountPercentage(decimal? currentPrice, decimal? originalPrice)
        {
            if (!currentPrice.HasValue || !originalPrice.HasValue || originalPrice <= currentPrice)
                return null;

            var discount = Math.Round(((originalPrice.Value - currentPrice.Value) / originalPrice.Value) * 100, 0);
            return (int)discount;
        }
    }
}
