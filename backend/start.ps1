# Foxnuts Farm Backend - PowerShell Startup Script

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  FOXNUTS FARM BACKEND SERVER" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "  Please install Python 3.9+ from https://www.python.org/downloads/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host ""
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
}

# Activate virtual environment
Write-Host ""
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Check if requirements are installed
try {
    pip show flask | Out-Null
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "⚠ WARNING: .env file not found!" -ForegroundColor Yellow
    Write-Host "Copying .env.example to .env..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host ""
    Write-Host "IMPORTANT: Please edit .env file with your credentials!" -ForegroundColor Red
    Write-Host "Required: MongoDB URI, JWT Secret, Stripe Keys, SendGrid API Key" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter after updating .env file to continue"
}

# Start the Flask server
Write-Host ""
Write-Host "Starting Flask server..." -ForegroundColor Cyan
Write-Host ""
python app.py

Write-Host ""
Read-Host "Press Enter to exit"
