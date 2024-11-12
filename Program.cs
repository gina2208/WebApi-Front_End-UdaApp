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

// Middleware para redirigir seg�n c�digos de estado HTTP
app.UseStatusCodePages(context =>
{
    var response = context.HttpContext.Response;
    switch (response.StatusCode)
    {
        case 401:
            response.Redirect("/Account/Login");  // P�gina de inicio de sesi�n
            break;
        case 403:
            response.Redirect("/Error/AccessDenied");  // P�gina de acceso denegado
            break;
        case 404:
            response.Redirect("/Error/NotFound");  // P�gina de no encontrado
            break;
        case 500:
            response.Redirect("/Error/InternalServerError");  // P�gina de error interno
            break;
        case 400:
            response.Redirect("/Error/BadRequest");  // P�gina de solicitud incorrecta
            break;
        case 429:
            response.Redirect("/Error/TooManyRequests");  // P�gina de demasiadas solicitudes
            break;
    }
    return Task.CompletedTask;
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();