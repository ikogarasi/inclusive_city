FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Incity/Incity.Services.AuthAPI/Incity.Services.AuthAPI.csproj", "Incity/Incity.Services.AuthAPI/"]
RUN dotnet restore "./Incity/Incity.Services.AuthAPI/./Incity.Services.AuthAPI.csproj"
COPY . .
WORKDIR "/src/Incity/Incity.Services.AuthAPI"

RUN dotnet build "./Incity.Services.AuthAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Incity.Services.AuthAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Incity.Services.AuthAPI.dll"]