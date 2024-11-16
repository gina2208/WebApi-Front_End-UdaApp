var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configurar el manejo de excepciones antes de cualquier middleware de manejo de errores por estado HTTP
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// Asegurarse de que las páginas de error de estado HTTP sean manejadas
app.UseStatusCodePagesWithReExecute("/Home/Error{0}");

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Middleware para manejar errores en solicitudes API
app.Use(async (context, next) =>
{
    await next();

    if (context.Request.Path.StartsWithSegments("/api") && context.Response.StatusCode >= 400)
    {
        var statusCode = context.Response.StatusCode;

        if (statusCode == 400 || statusCode == 401 || statusCode == 403 || statusCode == 404 || statusCode == 500)
        {
            context.Response.Redirect($"/Home/Error{statusCode}");
        }
    }
});


string GetApiErrorMessage(int statusCode)
{
    return statusCode switch
    {
        400 => "Bad Request",
        401 => "Unauthorized",
        403 => "Forbidden",
        404 => "Not Found",
        500 => "Internal Server Error",
        _ => "Unexpected Error"
    };
}

// Middleware para redirigir según el favicon
app.Use(async (context, next) =>
{
    // Excluir favicon.ico del pipeline de autorización
    if (context.Request.Path.StartsWithSegments("/favicon.ico"))
    {
        context.Response.ContentType = "image/x-icon";
        await context.Response.SendFileAsync("wwwroot/favicon.ico");
        return;
    }
    await next();
});

// Middleware de autorización debe ir después de UseRouting y antes de el mapeo de rutas
app.UseAuthorization();

// Mapear las rutas predeterminadas
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
