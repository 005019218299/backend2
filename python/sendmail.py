# encoding:utf-8
from pydantic import BaseModel
import requests
from requests.auth import HTTPBasicAuth
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:3005",
    "http://localhost",
    "http://localhost:3005",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailRequest(BaseModel):
    sendto: str
    title: str

def send_email(sendto: str, title: str) -> dict:
    """
    Gửi email qua EngageLab API
    """
    url = "https://email.api.engagelab.cc/v1/mail/send"
    
    html_content = """
    <html>
      <body style="font-family: Arial; max-width: 600px; margin: 0 auto;">
        <div style="padding: 20px;">
          <p>Xin chào,</p>
          <p>Chúng tôi gửi bạn tài liệu quan trọng:</p>
          <h2 style="color: #0066cc;">{title}</h2>
          <a href="https://onthithpt2026.com/download" 
             style="display: inline-block; padding: 10px 20px; background: #0066cc; 
                    color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">
            Tải xuống ngay
          </a>
          <p style="font-size: 12px; color: #999;">
            <a href="https://onthithpt2026.com/unsubscribe" style="color: #999;">Hủy đăng ký</a>
          </p>
        </div>
      </body>
    </html>
    """.format(title=title)

    request_body = {
        "from": "vnedu@mail.onthithpt2026.com",
        "to": [sendto],
        "body": {
            "subject": title,
            "content": {
                "html": html_content
            }
        }
    }
    
    # API credentials
    api_user = "JGaCg48wiZpm_test_p93g8W"
    api_key = "6f806cf44e0e3ceca110bf7bf7865e5b"
    
    try:
        response = requests.post(
            url,
            json=request_body,
            auth=HTTPBasicAuth(api_user, api_key),
            timeout=10
        )
        
        response.raise_for_status()  # Tự động raise exception nếu status code lỗi
        return {
            "status": "success",
            "message": "Email sent successfully",
            "response": response.json()
        }
    
    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "message": "Failed to send email",
            "error": str(e),
            "response": getattr(e.response, 'text', None) if hasattr(e, 'response') else None
        }

@app.post("/sendmail")
async def send_mail_endpoint(request: EmailRequest):
    """
    Endpoint API để gửi email
    """
    try:
        result = send_email(request.sendto, request.title)
        
        if result["status"] == "error":
            raise HTTPException(status_code=400, detail=result["message"])
            
        return {
            "status": "success",
            "data": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))