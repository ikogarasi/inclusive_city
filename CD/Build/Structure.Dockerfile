FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Incity/Incity.Services.StructureAPI/Incity.Services.StructureAPI.csproj", "Incity/Incity.Services.StructureAPI/"]
COPY ["Incity/AzureBlobStorage/AzureBlobStorage.csproj", "Incity/AzureBlobStorage/"]
RUN dotnet restore "./Incity/Incity.Services.StructureAPI/./Incity.Services.StructureAPI.csproj"
COPY . .
WORKDIR "/src/Incity/Incity.Services.StructureAPI"

RUN dotnet build "./Incity.Services.StructureAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Incity.Services.StructureAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Incity.Services.StructureAPI.dll"]