var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

// Middleware para redirigir según códigos de estado HTTP
app.UseStatusCodePages(context =>
{
    var response = context.HttpContext.Response;
    switch (response.StatusCode)
    {
        case 401:
            response.Redirect("/Account/Login");  // Página de inicio de sesión
            break;
        case 403:
            response.Redirect("/Error/AccessDenied");  // Página de acceso denegado
            break;
        case 404:
            response.Redirect("/Error/NotFound");  // Página de no encontrado
            break;
        case 500:
            response.Redirect("/Error/InternalServerError");  // Página de error interno
            break;
        case 400:
            response.Redirect("/Error/BadRequest");  // Página de solicitud incorrecta
            break;
        case 429:
            response.Redirect("/Error/TooManyRequests");  // Página de demasiadas solicitudes
            break;
    }
    return Task.CompletedTask;
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();