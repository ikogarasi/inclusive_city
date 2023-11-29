using Azure.Storage.Blobs.Models;
using AzureBlobStorage;
using Incity.Services.StructureAPI.Dto;
using Incity.Services.StructureAPI.Infrastructure;
using Incity.Services.StructureAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System.Runtime.CompilerServices;

namespace Incity.Services.StructureAPI.Services
{
    public class StructureService : IStructureService
    {
        private readonly StructureDbContext _dbContext;
        private readonly IAzureStorage _azureStorage;

        public StructureService(StructureDbContext dbContext, IAzureStorage azureStorage)
        {
            _dbContext = dbContext;
            _azureStorage = azureStorage;
        }

        public async Task<IEnumerable<GetStructureDto>> GetStructures()
        {
            return await _dbContext.CategoryStructures
                .AsNoTracking()
                .Include(i => i.Structure)
                .Include(i => i.Category)
                .Select(i => new GetStructureDto(
                    i.Structure.Id,
                    i.Structure.DisplayName,
                    i.Structure.Description,
                    i.Structure.ImageUrl,
                    i.Category.Name,
                    i.Structure.Latitude,
                    i.Structure.Longitude, 
                    i.Structure.Rating))
                .ToListAsync();
        }

        public async Task<GetStructureDto?> GetStructure(Guid id)
        {
            return await _dbContext.CategoryStructures
                .AsNoTracking()
                .Include(i => i.Structure)
                .Include(i => i.Category)
                .Where(i => i.StructureId == id)
                .Select(i => new GetStructureDto(
                    i.Structure.Id,
                    i.Structure.DisplayName,
                    i.Structure.Description,
                    i.Structure.ImageUrl,
                    i.Category.Name,
                    i.Structure.Latitude,
                    i.Structure.Longitude,
                    i.Structure.Rating))
                .FirstOrDefaultAsync();
        }

        public async Task<GetStructureDto> CreateStructure(StructureDto dto)
        {
            var structure = new Structure
            {
                DisplayName = dto.Name,
                Description = dto.Description,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
            };

            if (dto.Image != null)
            {
                var blob = await _azureStorage.UploadAsync(dto.Image);

                if (!blob.Error)
                {
                    structure.ImageUrl = blob.Blob.Uri;
                    structure.ImageName = blob.Blob.Name;
                }
            }

            await _dbContext.Structures.AddAsync(structure);
            await _dbContext.SaveChangesAsync();

            var category = await _dbContext.Categories
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.NormalizedName == dto.Category.ToUpper());

            category ??= await AddCategory(dto.Category);

            var categoryStructure = await _dbContext.CategoryStructures.AddAsync(new()
            {
                CategoryId = category.Id,
                StructureId = structure.Id
            });

            await _dbContext.SaveChangesAsync();

            return new GetStructureDto(
                structure.Id,
                structure.DisplayName,
                structure.Description,
                structure.ImageUrl,
                category.Name,
                structure.Latitude,
                structure.Longitude,
                structure.Rating);
        }

        public async Task<GetStructureDto> UpdateStructure(StructureDto dto)
        {
            var structureFromDb = await _dbContext.Structures
                .FirstOrDefaultAsync(i => i.Id == dto.Id)
                    ?? throw new ArgumentException("Structure with such id does not exist");

            structureFromDb.Id = dto.Id.Value;
            structureFromDb.DisplayName = dto.Name;
            structureFromDb.Description = dto.Description;
            structureFromDb.Latitude = dto.Latitude;
            structureFromDb.Longitude = dto.Longitude;

            if (dto.Image != null)
            {
                await _azureStorage.DeleteAsync(structureFromDb.ImageName);

                var blob = await _azureStorage.UploadAsync(dto.Image);

                if (!blob.Error)
                {
                    structureFromDb.ImageUrl = blob.Blob.Uri;
                    structureFromDb.ImageName = blob.Blob.Name;
                }
            }

            var structureCategoryFromDb = await _dbContext.CategoryStructures
                .FirstOrDefaultAsync(i => i.StructureId == dto.Id);

            var categoryFromDb = await _dbContext.Categories
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.NormalizedName == dto.Category.ToUpper());

            categoryFromDb ??= await AddCategory(dto.Category);

            if (structureCategoryFromDb.CategoryId != categoryFromDb.Id)
            {
                structureCategoryFromDb.CategoryId = categoryFromDb.Id;
            }

            await _dbContext.SaveChangesAsync();
            
            return new GetStructureDto(
                structureFromDb.Id,
                structureFromDb.DisplayName,
                structureFromDb.Description,
                structureFromDb.ImageUrl,
                categoryFromDb.Name,
                structureFromDb.Latitude,
                structureFromDb.Longitude,
                structureFromDb.Rating);
        }

        public async Task DeleteStructure(Guid id)
        {
            var structureFromDb = await _dbContext.Structures
                .FirstOrDefaultAsync(i => i.Id == id)
                    ?? throw new ArgumentException("Structure with such id does not exist");

            await _azureStorage.DeleteAsync(structureFromDb.ImageName);

            var structureCategoryFromDb = await _dbContext.CategoryStructures
                .FirstOrDefaultAsync(i => i.StructureId == id);

            _dbContext.CategoryStructures.Remove(structureCategoryFromDb);
            _dbContext.Structures.Remove(structureFromDb);
            await _dbContext.SaveChangesAsync();
        }

        public async Task ChangeRating(Guid structureId, double averageRating)
        {
            var structureFromDb = await _dbContext.Structures
                .FirstOrDefaultAsync(i => i.Id == structureId);

            if (structureFromDb != null)
            {
                structureFromDb.Rating = averageRating;

                await _dbContext.SaveChangesAsync();
            }
        }

        private async Task<Category> AddCategory(string categoryName)
        {
            var categoryEntity = new Category()
            {
                Name = categoryName,
                NormalizedName = categoryName.ToUpper()
            };

            await _dbContext.Categories.AddAsync(categoryEntity);

            await _dbContext.SaveChangesAsync();
            
            return categoryEntity;
        }
    }
}
