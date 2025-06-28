# StudyMind AI - Startup Script
Write-Host "Starting StudyMind AI..." -ForegroundColor Green

# Check if PostgreSQL is running
$pgService = Get-Service -Name "postgresql-x64-17" -ErrorAction SilentlyContinue
if ($pgService.Status -ne "Running") {
    Write-Host "PostgreSQL service is not running!" -ForegroundColor Red
    Write-Host "Please start PostgreSQL service manually." -ForegroundColor Yellow
    exit 1
}

Write-Host "PostgreSQL service is running" -ForegroundColor Green

# Set environment variable
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/studymind_db"
Write-Host "Database URL set" -ForegroundColor Green

# Start the development server
Write-Host "Starting development server..." -ForegroundColor Yellow
Write-Host "Your app will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev 