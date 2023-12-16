FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Incity/Incity.Gateway/Incity.Gateway.csproj", "Incity/Incity.Gateway/"]
RUN dotnet restore "./Incity/Incity.Gateway/./Incity.Gateway.csproj"
COPY . .
WORKDIR "/src/Incity/Incity.Gateway"

ARG OcelotConfigPath
COPY ["$OcelotConfigPath", ""]
RUN dotnet build "./Incity.Gateway.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Incity.Gateway.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Incity.Gateway.dll"]

