import azure.functions as func
import json
import os
import base64
from datetime import datetime
from pathlib import Path

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


# Get the base directory for static files
def get_static_file_path(filename: str) -> str:
    """Get the correct path for static files in Azure Functions."""
    # Try multiple possible locations
    possible_paths = [
        Path(__file__).parent / "static" / filename,
        Path("/home/site/wwwroot/static") / filename,
        Path(os.environ.get("AzureWebJobsScriptRoot", "")) / "static" / filename,
    ]
    
    for path in possible_paths:
        if path.exists():
            return str(path)
    
    return str(possible_paths[0])  # Return first path even if not found


@app.route(route="", methods=["GET"])
def serve_homepage(req: func.HttpRequest) -> func.HttpResponse:
    """
    Serve the main HTML page at root URL.
    """
    try:
        html_path = get_static_file_path("index.html")
        
        with open(html_path, "r", encoding="utf-8") as f:
            html_content = f.read()
        
        return func.HttpResponse(
            html_content,
            mimetype="text/html",
            status_code=200
        )
    except FileNotFoundError as e:
        return func.HttpResponse(
            f"Homepage not found. Path tried: {html_path}. Error: {str(e)}",
            status_code=404
        )
    except Exception as e:
        return func.HttpResponse(
            f"Error loading homepage: {str(e)}",
            status_code=500
        )


@app.route(route="api/upload", methods=["POST"])
def upload_image(req: func.HttpRequest) -> func.HttpResponse:
    """
    Handle image upload for 3D mesh generation.
    Accepts multipart/form-data with an image file.
    """
    try:
        # Get the uploaded file
        file = req.files.get('image')
        
        if not file:
            # Try to get from body as base64
            try:
                body = req.get_json()
                image_data = body.get('image')
                filename = body.get('filename', 'uploaded_image.jpg')
            except:
                return func.HttpResponse(
                    json.dumps({"error": "No image provided"}),
                    mimetype="application/json",
                    status_code=400
                )
        else:
            filename = file.filename
            image_data = base64.b64encode(file.read()).decode('utf-8')
        
        # In a real implementation, this would:
        # 1. Save the image to Azure Blob Storage
        # 2. Trigger the 3D mesh generation pipeline
        # 3. Return a job ID for status tracking
        
        response_data = {
            "status": "success",
            "message": "Image uploaded successfully",
            "filename": filename,
            "job_id": f"mesh_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            "estimated_time": "30 seconds",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        
        return func.HttpResponse(
            json.dumps(response_data, indent=2),
            mimetype="application/json",
            status_code=200
        )
        
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )


@app.route(route="api/generate", methods=["POST"])
def generate_mesh(req: func.HttpRequest) -> func.HttpResponse:
    """
    Generate 3D mesh from uploaded image.
    This is a placeholder for the actual ML pipeline.
    """
    try:
        body = req.get_json()
        job_id = body.get('job_id')
        
        if not job_id:
            return func.HttpResponse(
                json.dumps({"error": "job_id is required"}),
                mimetype="application/json",
                status_code=400
            )
        
        # Placeholder response - in production this would:
        # 1. Check job status
        # 2. Return mesh data or processing status
        
        response_data = {
            "status": "completed",
            "job_id": job_id,
            "mesh": {
                "format": "obj",
                "vertices": 1024,
                "faces": 2048,
                "download_url": f"/api/download/{job_id}"
            },
            "processing_time": "28.5 seconds",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        
        return func.HttpResponse(
            json.dumps(response_data, indent=2),
            mimetype="application/json",
            status_code=200
        )
        
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )


@app.route(route="api/meshify")
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


@app.route(route="api/health")
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


@app.route(route="api/info")
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
