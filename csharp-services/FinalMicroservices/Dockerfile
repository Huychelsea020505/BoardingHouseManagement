FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY csharp-services/FinalMicroservices/FinalMicroservices.csproj csharp-services/FinalMicroservices/
RUN dotnet restore csharp-services/FinalMicroservices/FinalMicroservices.csproj

COPY csharp-services/FinalMicroservices csharp-services/FinalMicroservices
RUN dotnet publish csharp-services/FinalMicroservices/FinalMicroservices.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 5090
ENTRYPOINT ["dotnet", "FinalMicroservices.dll"]
