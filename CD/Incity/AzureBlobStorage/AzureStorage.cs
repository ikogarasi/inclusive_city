using Azure;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using AzureBlobStorage.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace AzureBlobStorage
{
    public class AzureStorage : IAzureStorage
    {
        private readonly string _storageConnectionString;
        private readonly string _storageContainerName;

        public AzureStorage(IConfiguration configuration)
        {
            _storageConnectionString = configuration["BlobConnectionString"]!.ToString();
            _storageContainerName = configuration["BlobContainerName"]!.ToString();
        }

        public async Task<BlobResponseDto> UploadAsync(IFormFile blob)
        {
            var response = new BlobResponseDto();

            var container = new BlobContainerClient(_storageConnectionString, _storageContainerName);

            try
            {
                var newFileName = Guid.NewGuid() + Path.GetExtension(blob.FileName);

                var client = container.GetBlobClient(newFileName);

                var options = new BlobUploadOptions
                {
                    HttpHeaders = new BlobHttpHeaders
                    {
                        ContentType = blob.ContentType
                    }
                };

                await using var data = blob.OpenReadStream();

                await client.UploadAsync(data, options);

                response.Status = $"File {blob.FileName} Uploaded Successfully";
                response.Error = false;
                response.Blob.Uri = client.Uri.AbsoluteUri;
                response.Blob.Name = client.Name;
            }
            catch (RequestFailedException ex)
            {
                response.Status = $"Unexpected error: {ex.StackTrace}. Check log with StackTrace ID.";
                response.Error = true;
                return response;
            }

            return response;
        }

        public async Task<BlobResponseDto> DeleteAsync(string blobFilename)
        {
            var client = new BlobContainerClient(_storageConnectionString, _storageContainerName);

            var file = client.GetBlobClient(blobFilename);

            try
            {
                await file.DeleteAsync();
            }
            catch (RequestFailedException ex)
                when (ex.ErrorCode == BlobErrorCode.BlobNotFound)
            {
                return new() { Error = true, Status = $"File with name {blobFilename} not found." };
            }

            return new() { Error = false, Status = $"File: {blobFilename} has been successfully deleted." };
        }
    }
}