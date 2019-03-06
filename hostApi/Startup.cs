using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ServiceStack.Redis;
using HostApi.DataAccess;

namespace HostApi
{
    public class Startup
    {
        public Startup (IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices (IServiceCollection services)
        {
            services.AddCors(corsPolicy => corsPolicy.AddPolicy("allowAllPolicy",
                builder => builder.SetIsOriginAllowedToAllowWildcardSubdomains()
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .Build()
            ));

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            
            services.AddSingleton<IRedisClientsManager>(c => new RedisManagerPool("redis"));
            services.AddSingleton<ISignalHub, SignalHub>();
            services.AddSingleton<ICache, Cache>();
        }

        public void Configure (IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseCors("allowAllPolicy");
            app.UseHttpsRedirection();

            app.UseMvc();
        }
    }
}