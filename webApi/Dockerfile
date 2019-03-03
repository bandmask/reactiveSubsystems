FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT "Production"

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY ["webApi.csproj", "./"]
RUN dotnet restore "./webApi.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "webApi.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "webApi.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "webApi.dll", "--urls", "http://*:9000"]
