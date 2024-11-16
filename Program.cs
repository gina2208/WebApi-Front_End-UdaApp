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
            response.Redirect("/Home/Error401");  // Página de inicio de sesión
            break;
        case 403:
            response.Redirect("/Home/Error403");  // Página de acceso denegado
            break;
        case 404:
            response.Redirect("/Home/Error404");  // Página de no encontrado
            break;
        case 500:
            response.Redirect("/Home/Error500");  // Página de error interno
            break;
        case 400:
            response.Redirect("/Home/Error400");  // Página de solicitud incorrecta
            break;
    }
    return Task.CompletedTask;
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();