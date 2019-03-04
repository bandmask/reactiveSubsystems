FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT "Production"

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY ["HostApi.csproj", "./"]
RUN dotnet restore "./HostApi.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "HostApi.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "HostApi.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "HostApi.dll", "--urls", "http://*:9000"]
