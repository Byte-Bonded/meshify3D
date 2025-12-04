import azure.functions as func
import json
from datetime import datetime

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


@app.route(route="meshify")
def meshify_main(req: func.HttpRequest) -> func.HttpResponse:
    """
    Main endpoint for Meshify3D Azure Function.
    Returns information about the Meshify3D service.
    """
    response_data = {
        "service": "Meshify3D",
        "version": "1.0.0",
        "status": "running",
        "description": "Meshify3D uses deep learning to convert 2D images into detailed 3D models",
        "features": [
            "2D to 3D conversion",
            "Key feature extraction and matching",
            "Geometry reconstruction",
            "Depth estimation",
            "Texture mapping"
        ],
        "applications": [
            "Design",
            "AR/VR",
            "Digital Art",
            "3D Printing"
        ],
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    return func.HttpResponse(
        json.dumps(response_data, indent=2),
        mimetype="application/json",
        status_code=200
    )


@app.route(route="health")
def health_check(req: func.HttpRequest) -> func.HttpResponse:
    """
    Health check endpoint.
    Returns the health status of the function app.
    """
    health_data = {
        "status": "healthy",
        "service": "Meshify3D",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    return func.HttpResponse(
        json.dumps(health_data, indent=2),
        mimetype="application/json",
        status_code=200
    )


@app.route(route="info")
def get_info(req: func.HttpRequest) -> func.HttpResponse:
    """
    Information endpoint.
    Returns detailed information about the Meshify3D API.
    """
    # Get optional name parameter
    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
            name = req_body.get('name')
        except ValueError:
            name = None
    
    info_data = {
        "message": f"Welcome to Meshify3D{', ' + name if name else ''}!",
        "endpoints": {
            "/api/meshify": "Main service endpoint - Returns service information",
            "/api/health": "Health check endpoint - Returns service health status",
            "/api/info": "Information endpoint - Returns API documentation"
        },
        "documentation": "https://github.com/Byte-Bonded/meshify3D",
        "contact": "For support, please visit our GitHub repository",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    return func.HttpResponse(
        json.dumps(info_data, indent=2),
        mimetype="application/json",
        status_code=200
    )
