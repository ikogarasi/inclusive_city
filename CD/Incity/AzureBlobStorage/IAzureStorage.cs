using AzureBlobStorage.Dto;
using Microsoft.AspNetCore.Http;

namespace AzureBlobStorage
{
    public interface IAzureStorage
    {
        Task<BlobResponseDto> DeleteAsync(string blobFilename);
        Task<BlobResponseDto> UploadAsync(IFormFile blob);
    }
}